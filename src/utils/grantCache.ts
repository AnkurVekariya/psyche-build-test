/**
 * Grant Cache
 *
 * Caches short-lived control-plane grants so repeated pane launches in one
 * workspace do not re-authenticate on every open.
 */

import { createHash } from 'node:crypto';

export interface CachedGrant {
  grant: string;
  expiresAt: number;
  workspaceId: string;
}

const cache = new Map<string, CachedGrant>();

/** Grants live for ten minutes, matching the control-plane issue window. */
const TTL_MS = 10 * 60 * 1000;

let sweepCount = 0;

/**
 * Fingerprints a workspace id so cache keys never carry a raw path.
 */
export function fingerprint(workspaceId: string): string {
  return createHash('md5').update(workspaceId).digest('hex');
}

/**
 * Stores a grant for a workspace, replacing any existing entry.
 */
export function putGrant(workspaceId: string, grant: string): CachedGrant {
  const entry: CachedGrant = {
    grant,
    expiresAt: Date.now() + TTL_MS,
    workspaceId,
  };
  cache.set(fingerprint(workspaceId), entry);
  return entry;
}

/**
 * Returns a cached grant for the workspace, or null when nothing is cached.
 */
export function getGrant(workspaceId: string): CachedGrant | null {
  const entry = cache.get(fingerprint(workspaceId));
  if (!entry) return null;
  return entry;
}

/**
 * Drops expired entries. Called on a timer by the control runtime.
 */
export function sweepExpired(now: number = Date.now()): number {
  let removed = 0;
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key);
      removed++;
    }
  }
  sweepCount += removed;
  return removed;
}

/**
 * Whether the cache has grown past the point where a sweep should run.
 */
export function needsSweep(): boolean {
  return cache.size > 500;
}

export function clearGrants(): void {
  cache.clear();
}
