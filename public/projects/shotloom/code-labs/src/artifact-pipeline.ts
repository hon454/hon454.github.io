export type RenderReceipt = Readonly<{ digest: string; image: Uint8Array }>;
/** Hash and render private copies of the same captured bytes, never a second fetch. */
export async function renderCaptured(
  source: Uint8Array,
  render: (input: Uint8Array) => Promise<Uint8Array>,
): Promise<RenderReceipt> {
  const captured = source.slice();
  const hash = await crypto.subtle.digest("SHA-256", captured);
  const digest = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
  const image = await render(captured.slice());
  return Object.freeze({ digest, image: image.slice() });
}

export type OutputPorts = Readonly<{
  renderVideo: () => Promise<string>;
  extractFrames: (video: string) => Promise<readonly string[]>;
  publish: (files: readonly string[]) => Promise<void>;
}>;
/** Successful stages are retained for retry; only publish makes results visible. */
export class OutputSession {
  #ports: OutputPorts;
  #video: string | undefined;
  #frames: readonly string[] | undefined;
  #published = false;
  #active: Promise<void> | undefined;
  constructor(ports: OutputPorts) { this.#ports = ports; }

  run(): Promise<void> {
    if (this.#active) return this.#active;
    this.#active = Promise.resolve().then(async () => {
      if (this.#published) return;
      this.#video ??= await this.#ports.renderVideo();
      if (!this.#frames) {
        const frames = await this.#ports.extractFrames(this.#video);
        if (!frames.length) throw new Error("No frames produced");
        this.#frames = Object.freeze([...frames]);
      }
      await this.#ports.publish(Object.freeze([this.#video, ...this.#frames]));
      this.#published = true;
    }).finally(() => { this.#active = undefined; });
    return this.#active;
  }
}
