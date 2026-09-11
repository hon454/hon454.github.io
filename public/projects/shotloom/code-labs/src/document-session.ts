export type Item = Readonly<{ id: string; x: number }>;
export type Document = Readonly<{ items: readonly Item[] }>;

function snapshot(input: Document): Document {
  const ids = new Set<string>();
  const items = input.items.map(item => {
    if (!item.id || ids.has(item.id) || !Number.isFinite(item.x)) {
      throw new Error("Invalid document");
    }
    ids.add(item.id);
    return Object.freeze({ id: item.id, x: item.x });
  });
  return Object.freeze({ items: Object.freeze(items) });
}

/** A drag is one history entry. Invalid edits never replace the current state. */
export class DocumentSession {
  #current: Document;
  #before: Document | undefined;
  #undo: Document[] = [];
  #redo: Document[] = [];

  constructor(initial: Document) { this.#current = snapshot(initial); }
  get current(): Document { return this.#current; }

  begin(): void {
    if (this.#before) throw new Error("Transaction already open");
    this.#before = this.#current;
  }

  edit(transform: (current: Document) => Document): void {
    if (!this.#before) throw new Error("Begin a transaction first");
    const candidate = snapshot(transform(this.#current));
    this.#current = candidate;
  }

  finish(commit: boolean): void {
    if (!this.#before) throw new Error("No transaction");
    if (!commit) this.#current = this.#before;
    else if (JSON.stringify(this.#before) !== JSON.stringify(this.#current)) {
      this.#undo.push(this.#before);
      this.#redo = [];
    }
    this.#before = undefined;
  }

  undo(): boolean { return this.#travel(this.#undo, this.#redo); }
  redo(): boolean { return this.#travel(this.#redo, this.#undo); }

  #travel(from: Document[], to: Document[]): boolean {
    if (this.#before) throw new Error("Finish the transaction first");
    const previous = from.pop();
    if (!previous) return false;
    to.push(this.#current);
    this.#current = previous;
    return true;
  }
}
