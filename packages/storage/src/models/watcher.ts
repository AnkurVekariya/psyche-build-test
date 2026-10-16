/** A watcher record. */
export interface Watcher {
  id: string;
  fileId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a watcher before it is saved; empty when nothing is. */
export function watcherProblems(value: Watcher): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.fileId || !value.userId) problems.push('fileId and userId are required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeWatcher(value: Watcher): string {
  return `watcher ${value.id}`;
}
