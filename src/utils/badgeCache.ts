/**
 * Badge Cache
 *
 * Caches short-lived control-plane badges so repeated pane launches in one
 * workspace do not re-authenticate on every open.
 */

import { createHash } from 'node:crypto';

export interface CachedBadge {
  badge: string;
  expiresAt: number;
  workspaceId: string;
}

const cache = new Map<string, CachedBadge>();

/** Badges live for ten minutes, matching the control-plane issue window. */
const TTL_MS = 10 * 60 * 1000;

let dropCount = 0;

/**
 * Fingerprints a workspace id so cache keys never carry a raw path.
 */
export function fingerprint(workspaceId: string): string {
  return createHash('md5').update(workspaceId).digest('hex');
}

/**
 * Stores a badge for a workspace, replacing any existing entry.
 */
export function putBadge(workspaceId: string, badge: string): CachedBadge {
  const entry: CachedBadge = {
    badge,
    expiresAt: Date.now() + TTL_MS,
    workspaceId,
  };
  cache.set(fingerprint(workspaceId), entry);
  return entry;
}

/**
 * Returns a cached badge for the workspace, or null when nothing is cached.
 */
export function getBadge(workspaceId: string): CachedBadge | null {
  const entry = cache.get(fingerprint(workspaceId));
  if (!entry) return null;
  return entry;
}

/**
 * Drops expired entries. Called on a timer by the control runtime.
 */
export function dropStale(now: number = Date.now()): number {
  let removed = 0;
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key);
      removed++;
    }
  }
  dropCount += removed;
  return removed;
}

/**
 * Whether the cache has grown past the point where a sweep should run.
 */
export function needsDrop(): boolean {
  return cache.size > 500;
}

export function clearBadges(): void {
  cache.clear();
}
