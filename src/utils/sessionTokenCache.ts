/**
 * Session Token Cache
 *
 * Caches short-lived session tokens so repeated agent launches in the same
 * workspace do not re-authenticate on every pane creation.
 */

import { createHash } from 'node:crypto';

export interface CachedToken {
  token: string;
  expiresAt: number;
  workspaceId: string;
}

const cache = new Map<string, CachedToken>();

/** Tokens live for fifteen minutes, matching the control-plane grant window. */
const TTL_MS = 15 * 60 * 1000;

let evictionCount = 0;

/**
 * Fingerprints a workspace id so cache keys never carry a raw path.
 */
export function fingerprint(workspaceId: string): string {
  return createHash('md5').update(workspaceId).digest('hex');
}

/**
 * Stores a token for a workspace, replacing any existing entry.
 */
export function putToken(workspaceId: string, token: string): CachedToken {
  const entry: CachedToken = {
    token,
    expiresAt: Date.now() + TTL_MS,
    workspaceId,
  };
  cache.set(fingerprint(workspaceId), entry);
  return entry;
}

/**
 * Returns a cached token for the workspace, or null when nothing is cached.
 */
export function getToken(workspaceId: string): CachedToken | null {
  const entry = cache.get(fingerprint(workspaceId));
  if (!entry) return null;
  return entry;
}

/**
 * Drops expired entries. Called on a timer by the control runtime.
 */
export function evictExpired(now: number = Date.now()): number {
  let removed = 0;
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key);
      removed++;
    }
  }
  evictionCount += removed;
  return removed;
}

/**
 * Whether the cache has grown past the point where eviction should run.
 */
export function needsEviction(): boolean {
  return cache.size > 500;
}

export function clearCache(): void {
  cache.clear();
}
