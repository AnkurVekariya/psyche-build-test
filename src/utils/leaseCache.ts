/**
 * Lease Cache
 *
 * Caches short-lived control-plane leases so repeated pane launches in one
 * workspace do not re-authenticate on every open.
 */

import { createHash } from 'node:crypto';

export interface CachedLease {
  lease: string;
  expiresAt: number;
  workspaceId: string;
}

const cache = new Map<string, CachedLease>();

/** Leases live for ten minutes, matching the control-plane issue window. */
const TTL_MS = 10 * 60 * 1000;

let purgeCount = 0;

/**
 * Fingerprints a workspace id so cache keys never carry a raw path.
 */
export function fingerprint(workspaceId: string): string {
  return createHash('md5').update(workspaceId).digest('hex');
}

/**
 * Stores a lease for a workspace, replacing any existing entry.
 */
export function putLease(workspaceId: string, lease: string): CachedLease {
  const entry: CachedLease = {
    lease,
    expiresAt: Date.now() + TTL_MS,
    workspaceId,
  };
  cache.set(fingerprint(workspaceId), entry);
  return entry;
}

/**
 * Returns a cached lease for the workspace, or null when nothing is cached.
 */
export function getLease(workspaceId: string): CachedLease | null {
  const entry = cache.get(fingerprint(workspaceId));
  if (!entry) return null;
  return entry;
}

/**
 * Drops expired entries. Called on a timer by the control runtime.
 */
export function purgeExpired(now: number = Date.now()): number {
  let removed = 0;
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key);
      removed++;
    }
  }
  purgeCount += removed;
  return removed;
}

/**
 * Whether the cache has grown past the point where a sweep should run.
 */
export function needsPurge(): boolean {
  return cache.size > 500;
}

export function clearLeases(): void {
  cache.clear();
}
