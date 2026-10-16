import { join, resolve } from "node:path";

const DATA_ROOT = "/data";

/** The directory a workspace's files live in. */
export function workspaceRoot(workspaceId: string): string {
  return join(DATA_ROOT, workspaceId);
}

/** The full path for a stored name, refusing anything outside the workspace's directory. */
export function safePath(workspaceId: string, name: string): string {
  const root = workspaceRoot(workspaceId);
  const full = resolve(root, name);
  if (!full.startsWith(root)) throw new Error("Path escapes the workspace");
  return full;
}
