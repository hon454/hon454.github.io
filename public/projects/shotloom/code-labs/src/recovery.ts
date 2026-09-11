export type StoredDocument = Readonly<{ run: string; content: string }>;
export type RecoveryStore = Readonly<{
  read: () => Promise<StoredDocument | undefined>;
  backup: (previous: StoredDocument) => Promise<void>;
  replace: (next: StoredDocument) => Promise<void>;
}>;
/** Caller holds the workspace owner lock. Backup must complete before replacement. */
export async function enterWorkspace(
  run: string, store: RecoveryStore, compose: () => Promise<string>,
): Promise<StoredDocument> {
  if (!run) throw new Error("Missing run");
  const previous = await store.read();
  if (previous?.run === run) return previous;
  const next = Object.freeze({ run, content: await compose() });
  if (previous) await store.backup(previous);
  await store.replace(next);
  return next;
}
