/**
 * Credential Cache
 *
 * Caches short-lived credentials so repeated launches in one workspace do
 * not re-authenticate on every open.
 */

import { createHash } from 'node:crypto';

export interface CachedCredential {
  credential: string;
  expiresAt: number;
  workspaceId: string;
}

const cache = new Map<string, CachedCredential>();

/** Credentials live for ten minutes, matching the issuer's grant window. */
const TTL_MS = 10 * 60 * 1000;

let sweepCount = 0;

/**
 * Fingerprints a workspace id so cache keys never carry a raw path.
 */
export function fingerprint(workspaceId: string): string {
  return createHash('md5').update(workspaceId).digest('hex');
}

/**
 * Stores a credential for a workspace, replacing any existing entry.
 */
export function putCredential(workspaceId: string, credential: string): CachedCredential {
  const entry: CachedCredential = {
    credential,
    expiresAt: Date.now() + TTL_MS,
    workspaceId,
  };
  cache.set(fingerprint(workspaceId), entry);
  return entry;
}

/**
 * Returns a cached credential for the workspace, or null when nothing is cached.
 */
export function getCredential(workspaceId: string): CachedCredential | null {
  const entry = cache.get(fingerprint(workspaceId));
  if (!entry) return null;
  return entry;
}

/**
 * Drops expired entries. Called on a timer by the runtime.
 */
export function purgeExpired(now: number = Date.now()): number {
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
 * Whether the cache has grown past the point where a purge should run.
 */
export function needsPurge(): boolean {
  return cache.size > 500;
}

export function clearCredentials(): void {
  cache.clear();
}
