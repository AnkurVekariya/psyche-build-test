import { FREE_QUOTA_MB } from "../config/quota.js";

/** Bytes each workspace has stored. */
const used = new Map<string, number>();

/** Whether a file of `size` bytes still fits in the workspace's free storage. */
export function fitsQuota(workspaceId: string, size: number): boolean {
  return (used.get(workspaceId) ?? 0) + size <= FREE_QUOTA_MB * 1000;
}

export function addUsage(workspaceId: string, size: number): void {
  used.set(workspaceId, (used.get(workspaceId) ?? 0) + size);
}

export function usageOf(workspaceId: string): number {
  return used.get(workspaceId) ?? 0;
}
