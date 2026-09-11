/** One in-flight operation and one replaceable intent; no growing input queue. */
export class LatestIntent<T> {
  #pending: { value: T } | undefined;
  #active: Promise<void> | undefined;
  #closed = false;
  #apply: (value: T) => Promise<void>;

  constructor(apply: (value: T) => Promise<void>) { this.#apply = apply; }

  submit(value: T): Promise<void> {
    if (this.#closed) return Promise.reject(new Error("Scheduler is closed"));
    this.#pending = { value };
    if (!this.#active) {
      // Defer start so even synchronous/reentrant submissions share this drain.
      this.#active = Promise.resolve().then(() => this.#drain());
    }
    return this.#active;
  }

  async #drain(): Promise<void> {
    try {
      while (this.#pending && !this.#closed) {
        const intent = this.#pending;
        this.#pending = undefined;
        await this.#apply(intent.value);
      }
    } finally {
      // A failed operation invalidates its remaining intents. Callers must retry.
      this.#pending = undefined;
      this.#active = undefined;
    }
  }

  /** Wait for the in-flight operation before releasing its resource. */
  async close(): Promise<void> {
    this.#closed = true;
    this.#pending = undefined;
    await this.#active;
  }
}
