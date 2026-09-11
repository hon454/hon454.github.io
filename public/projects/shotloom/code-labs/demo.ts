import { DocumentSession } from './src/document-session.ts';
import { scalarCameraAngle } from './src/animation.ts';
import { OutputSession } from './src/artifact-pipeline.ts';

const editor = new DocumentSession({ items: [{ id:'actor', x:0 }] });
editor.begin();
for (const x of [1,2,3]) editor.edit(() => ({items:[{id:'actor',x}]}));
editor.finish(true);
console.log('After drag:', editor.current);
editor.undo(); console.log('After one undo:', editor.current);
console.log('Two-turn camera midpoint:', scalarCameraAngle(0,720,0.5));
let attempt=0;
const exportSession = new OutputSession({
  renderVideo:async()=>{console.log('Render video once');return 'video.webm';},
  extractFrames:async()=>{if (++attempt===1) throw new Error('Synthetic readback failure');return ['first.png','last.png'];},
  publish:async files=>{console.log('Publish complete package:',files);},
});
try { await exportSession.run(); } catch(error) { console.log((error as Error).message); }
await exportSession.run();
