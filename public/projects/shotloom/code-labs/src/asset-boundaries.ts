/** Byte limits are checked before any materialization side effect. */
export function admitSizes(sizes: readonly number[], perFile: number, total: number): void {
  if (![perFile, total].every(n => Number.isSafeInteger(n) && n >= 0)) throw new Error("Invalid limits");
  let used = 0;
  for (const size of sizes) {
    if (!Number.isSafeInteger(size) || size < 0 || size > perFile || size > total - used) {
      throw new Error("Asset budget exceeded");
    }
    used += size;
  }
}
export type Vec3 = readonly [number, number, number];
/** 180° about Y; only data owned by the normalized rig is passed to this function. */
export function rotateY180([x, y, z]: Vec3): Vec3 { return [-x, y, -z]; }

/** Dedupe concurrent loads; a failed load is evicted so retry remains possible. */
export class AssetCache<T> {
  #entries = new Map<string, Promise<T>>();
  get(key: string, load: () => Promise<T>): Promise<T> {
    const cached = this.#entries.get(key);
    if (cached) return cached;
    const pending = Promise.resolve().then(load).catch(error => {
      if (this.#entries.get(key) === pending) this.#entries.delete(key);
      throw error;
    });
    this.#entries.set(key, pending);
    return pending;
  }
  clear(): void { this.#entries.clear(); }
}
/** Version every output-affecting input, including the rendering recipe. */
export function thumbnailKey(assetDigest: string, recipe: string, pixels: number): string {
  if (!assetDigest || !recipe || !Number.isSafeInteger(pixels) || pixels < 1) throw new Error("Invalid thumbnail key");
  return JSON.stringify([assetDigest, recipe, pixels]);
}
