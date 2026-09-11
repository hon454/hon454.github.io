export type Quaternion = readonly [number, number, number, number];
function fraction(t: number): number {
  if (!Number.isFinite(t) || t < 0 || t > 1) throw new Error("Invalid interpolation fraction");
  return t;
}
export function scalarCameraAngle(a: number, b: number, t: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("Invalid angle");
  return a + (b - a) * fraction(t); // Preserve authored full turns; never wrap.
}
function normalized(q: Quaternion): Quaternion {
  if (q.some(value => !Number.isFinite(value))) throw new Error("Invalid rotation");
  const length = Math.hypot(...q);
  if (length < 1e-12 || !Number.isFinite(length)) throw new Error("Invalid rotation");
  return q.map(value => value / length) as unknown as Quaternion;
}
export function poseRotation(a: Quaternion, b: Quaternion, t: number): Quaternion {
  fraction(t);
  const start = normalized(a);
  let end = normalized(b);
  let dot = start.reduce((sum, value, i) => sum + value * end[i]!, 0);
  if (dot < 0) { end = end.map(v => -v) as unknown as Quaternion; dot = -dot; }
  dot = Math.min(1, dot);
  if (dot > 0.9995) {
    return normalized(start.map((v, i) => v + (end[i]! - v) * t) as unknown as Quaternion);
  }
  const angle = Math.acos(dot);
  const left = Math.sin((1 - t) * angle) / Math.sin(angle);
  const right = Math.sin(t * angle) / Math.sin(angle);
  return normalized(start.map((v, i) => v * left + end[i]! * right) as unknown as Quaternion);
}
export type Key = Readonly<{ id: string; frame: number; value: number }>;
/** Stable key identity survives a frame move. Collision fails before replacement. */
export function moveKey(keys: readonly Key[], id: string, frame: number): readonly Key[] {
  if (!Number.isSafeInteger(frame) || frame < 0) throw new Error("Invalid frame");
  if (!keys.some(key => key.id === id)) throw new Error("Missing key");
  if (keys.some(key => key.id !== id && key.frame === frame)) throw new Error("Occupied frame");
  return keys.map(key => key.id === id ? { ...key, frame } : key).sort((a, b) => a.frame - b.frame);
}
