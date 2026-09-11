export type Shot = Readonly<{ scene: string; shot: string; camera: string }>;
/** IDs only make sense inside their declared scope. Never select the first match. */
export function selectExact(shots: readonly Shot[], selector: Shot): Shot {
  const matches = shots.filter(candidate =>
    candidate.scene === selector.scene && candidate.shot === selector.shot && candidate.camera === selector.camera);
  if (matches.length !== 1) throw new Error(`Expected one shot; found ${matches.length}`);
  return matches[0]!;
}
export type Preview<T> = { kind: "ready"; value: T } | { kind: "unavailable" };
/** Optional preview corruption does not hide a valid authored document. */
export function optionalPreview<T>(decode: () => T): Preview<T> {
  try { return { kind: "ready", value: decode() }; }
  catch { return { kind: "unavailable" }; }
}
