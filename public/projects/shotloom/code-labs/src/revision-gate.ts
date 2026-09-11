export type Command = Readonly<{
  id: string; epoch: string; revision: number; payload: string;
}>;
export type Receipt = Readonly<{ revision: number }>;

/** Bounded, process-local dedupe. `apply` must atomically commit or throw. */
export class RevisionGate {
  #epoch: string;
  #revision = 0;
  #capacity: number;
  #busy = false;
  #seen = new Map<string, { identity: string; receipt: Receipt }>();

  constructor(epoch: string, capacity = 64) {
    if (!epoch || !Number.isSafeInteger(capacity) || capacity < 1) throw new Error("Invalid gate");
    this.#epoch = epoch;
    this.#capacity = capacity;
  }

  execute(command: Command, apply: (payload: string) => void): Receipt {
    if (this.#busy) throw new Error("Reentrant command");
    if (!command.id || command.epoch !== this.#epoch) throw new Error("Invalid command scope");
    const identity = JSON.stringify([command.epoch, command.revision, command.payload]);
    const prior = this.#seen.get(command.id);
    if (prior) {
      if (prior.identity !== identity) throw new Error("Command ID reused with different content");
      return prior.receipt;
    }
    if (command.revision !== this.#revision) throw new Error("Stale revision");
    if (this.#revision === Number.MAX_SAFE_INTEGER) throw new Error("Revision exhausted");
    this.#busy = true;
    try { apply(command.payload); }
    finally { this.#busy = false; }
    const receipt = Object.freeze({ revision: ++this.#revision });
    this.#seen.set(command.id, { identity, receipt });
    if (this.#seen.size > this.#capacity) this.#seen.delete(this.#seen.keys().next().value!);
    return receipt;
  }
}
