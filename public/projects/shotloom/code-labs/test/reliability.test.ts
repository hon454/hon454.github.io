import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LatestIntent } from '../src/latest-intent.ts';
import { DocumentSession } from '../src/document-session.ts';
import { RevisionGate } from '../src/revision-gate.ts';
import { scalarCameraAngle, poseRotation, moveKey } from '../src/animation.ts';
import { renderCaptured, OutputSession } from '../src/artifact-pipeline.ts';
import { AssetCache, admitSizes, rotateY180, thumbnailKey } from '../src/asset-boundaries.ts';
import { selectExact, optionalPreview } from '../src/selection.ts';
import { enterWorkspace } from '../src/recovery.ts';

function deferred<T>() { return Promise.withResolvers<T>(); }

test('10,000 intermediate inputs occupy one pending slot and deliver the final intent', async () => {
  const gate = deferred<void>(); const seen: number[] = [];
  const scheduler = new LatestIntent<number>(async value => { seen.push(value); if (value === 0) await gate.promise; });
  const done = scheduler.submit(0);
  await Promise.resolve();
  for (let frame = 1; frame <= 10_000; frame++) assert.equal(scheduler.submit(frame), done);
  gate.resolve(); await done;
  assert.deepEqual(seen, [0, 10_000]);
});

test('close drains the resource owner and discards pending work', async () => {
  const gate = deferred<void>(); const seen: number[] = [];
  const scheduler = new LatestIntent<number>(async n => { seen.push(n); await gate.promise; });
  const done = scheduler.submit(1); await Promise.resolve(); scheduler.submit(2);
  let closed = false; const close = scheduler.close().then(() => { closed = true; });
  await Promise.resolve(); assert.equal(closed, false);
  gate.resolve(); await Promise.all([done, close]);
  assert.deepEqual(seen, [1]); await assert.rejects(scheduler.submit(3), /closed/);
});

test('failed input is observable and a later submission can recover', async () => {
  const scheduler = new LatestIntent<number>(async n => { if (n === 1) throw new Error('device lost'); });
  await assert.rejects(scheduler.submit(1), /device lost/);
  await scheduler.submit(2);
});

test('a drag has one undo entry; cancel and invalid edits preserve the document', () => {
  const session = new DocumentSession({ items: [{ id: 'actor', x: 0 }] });
  session.begin();
  for (let x = 1; x <= 20; x++) session.edit(() => ({ items: [{ id: 'actor', x }] }));
  assert.throws(() => session.edit(() => ({ items: [{ id: 'actor', x: NaN }] })), /Invalid/);
  assert.equal(session.current.items[0]!.x, 20);
  session.finish(true); assert.equal(session.undo(), true);
  assert.equal(session.current.items[0]!.x, 0); assert.equal(session.undo(), false);
  session.redo(); session.begin(); session.edit(() => ({ items: [] })); session.finish(false);
  assert.equal(session.current.items[0]!.x, 20);
});

test('a new branch invalidates redo; no-op transactions do not', () => {
  const session = new DocumentSession({ items: [] });
  session.begin(); session.edit(() => ({ items: [{ id: 'a', x: 1 }] })); session.finish(true); session.undo();
  session.begin(); session.finish(true); assert.equal(session.redo(), true); session.undo();
  session.begin(); session.edit(() => ({ items: [{ id: 'b', x: 2 }] })); session.finish(true);
  assert.equal(session.redo(), false);
});

test('caller mutation cannot corrupt stored snapshots', () => {
  const initial = { items: [{ id: 'a', x: 1 }] }; const session = new DocumentSession(initial);
  initial.items[0]!.x = 99; assert.equal(session.current.items[0]!.x, 1);
  assert.throws(() => { (session.current.items[0] as {x:number}).x = 88; }, TypeError);
});

test('identical retries return the receipt; changed IDs and stale revisions fail', () => {
  const gate = new RevisionGate('document-a', 2); let writes = 0;
  const command = { id: 'c1', epoch: 'document-a', revision: 0, payload: 'move:1' };
  const first = gate.execute(command, () => { writes++; });
  assert.equal(gate.execute(command, () => { writes++; }), first); assert.equal(writes, 1);
  assert.throws(() => gate.execute({ ...command, payload: 'move:2' }, () => {}), /reused/);
  assert.throws(() => gate.execute({ ...command, id: 'c2' }, () => {}), /Stale/);
  assert.throws(() => gate.execute({ ...command, epoch: 'document-b' }, () => {}), /scope/);
});

test('failed atomic apply does not consume revision or command ID; evicted retries fail stale', () => {
  const gate = new RevisionGate('a', 1); const c = { id:'one', epoch:'a', revision:0, payload:'x' };
  assert.throws(() => gate.execute(c, () => { throw new Error('validation'); }), /validation/);
  assert.equal(gate.execute(c, () => {}).revision, 1);
  gate.execute({ ...c, id:'two', revision:1 }, () => {});
  assert.throws(() => gate.execute(c, () => {}), /Stale/);
});

test('camera full turns and quaternion shortest paths have distinct semantics', () => {
  assert.equal(scalarCameraAngle(0, 720, 0.5), 360);
  assert.equal(scalarCameraAngle(720, -720, 0.75), -360);
  const result = poseRotation([0,0,0,1], [0,0,0,-1], 0.5);
  assert.ok(Math.abs(result[3] - 1) < 1e-12);
  const midpoint = poseRotation([0,0,0,1], [0,1,0,0], 0.5);
  assert.ok(Math.abs(midpoint[1] - Math.SQRT1_2) < 1e-12);
  assert.throws(() => poseRotation([0,0,0,0], [0,0,0,1], 0.5), /Invalid/);
});

test('key identity survives retiming and a collision leaves input unchanged', () => {
  const keys = [{id:'a',frame:0,value:0},{id:'b',frame:10,value:1}];
  assert.equal(moveKey(keys,'a',5)[0]!.id, 'a');
  assert.throws(() => moveKey(keys,'a',10), /Occupied/); assert.equal(keys[0]!.frame,0);
});

test('hash and renderer consume captured bytes even if the source changes during hashing', async () => {
  const bytes = new TextEncoder().encode('abc'); let consumed = '';
  const task = renderCaptured(bytes, async captured => { consumed = new TextDecoder().decode(captured); return captured; });
  bytes.fill(0); const result = await task;
  assert.equal(consumed, 'abc');
  assert.equal(result.digest, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('retry after PNG failure preserves rendered video; retry after publish failure preserves frames', async () => {
  let renders=0, extracts=0, publishes=0;
  const session = new OutputSession({
    renderVideo: async () => { renders++; return 'video'; },
    extractFrames: async () => { if (++extracts===1) throw new Error('readback'); return ['first','last']; },
    publish: async files => { assert.deepEqual(files,['video','first','last']); if (++publishes===1) throw new Error('storage'); },
  });
  await assert.rejects(session.run(), /readback/); await assert.rejects(session.run(), /storage/);
  const first=session.run(); assert.equal(session.run(), first); await first; await session.run();
  assert.deepEqual({renders,extracts,publishes},{renders:1,extracts:2,publishes:2});
});

test('budget validation rejects an aggregate overflow and invalid lengths', () => {
  admitSizes([4,4],5,8); assert.throws(() => admitSizes([4,5],5,8));
  assert.throws(() => admitSizes([NaN],5,8)); assert.throws(() => admitSizes([-1],5,8));
});

test('coordinate rotation is an involution and recipe changes invalidate thumbnail identity', () => {
  const point = [2,3,4] as const; assert.deepEqual(rotateY180(rotateY180(point)),point);
  assert.notEqual(thumbnailKey('hash','rig-v1',256),thumbnailKey('hash','rig-v2',256));
});

test('parallel asset loads are deduplicated; failure remains retryable', async () => {
  const cache = new AssetCache<number>(); let loads = 0;
  const load = async () => { if (++loads===1) throw new Error('offline'); return 7; };
  const first = cache.get('a',load); assert.equal(cache.get('a',load),first);
  await assert.rejects(first,/offline/); assert.equal(await cache.get('a',load),7); assert.equal(loads,2);
});

test('duplicate scoped selectors fail instead of silently choosing a shot', () => {
  const a={scene:'a',shot:'shot-1',camera:'wide'}, b={...a,scene:'b'};
  assert.equal(selectExact([a,b],b),b); assert.throws(() => selectExact([a,a],a),/found 2/);
  assert.deepEqual(optionalPreview(() => {throw new Error('corrupt optional image');}),{kind:'unavailable'});
});

test('same-run entry restores edits; replacement requires successful backup', async () => {
  let current={run:'a',content:'authored'}; const calls:string[]=[];
  const store={read:async()=>current,backup:async()=>{calls.push('backup');},replace:async(next:typeof current)=>{calls.push('replace'); current=next;}};
  assert.equal((await enterWorkspace('a',store,async()=>{throw new Error('must not compose');})).content,'authored');
  await enterWorkspace('b',store,async()=>{calls.push('compose');return 'new';});
  assert.deepEqual(calls,['compose','backup','replace']);
  await assert.rejects(enterWorkspace('c',{...store,backup:async()=>{throw new Error('quota');}},async()=>'other'),/quota/);
  assert.equal(current.run,'b');
});
