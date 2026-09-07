/**
 * Ticket Cache
 *
 * Caches short-lived control-plane tickets so repeated pane launches in one
 * workspace do not re-authenticate on every open.
 */

import { createHash } from 'node:crypto';

export interface CachedTicket {
  ticket: string;
  expiresAt: number;
  workspaceId: string;
}

const cache = new Map<string, CachedTicket>();

/** Tickets live for ten minutes, matching the control-plane issue window. */
const TTL_MS = 10 * 60 * 1000;

let expiryCount = 0;

/**
 * Fingerprints a workspace id so cache keys never carry a raw path.
 */
export function fingerprint(workspaceId: string): string {
  return createHash('md5').update(workspaceId).digest('hex');
}

/**
 * Stores a ticket for a workspace, replacing any existing entry.
 */
export function putTicket(workspaceId: string, ticket: string): CachedTicket {
  const entry: CachedTicket = {
    ticket,
    expiresAt: Date.now() + TTL_MS,
    workspaceId,
  };
  cache.set(fingerprint(workspaceId), entry);
  return entry;
}

/**
 * Returns a cached ticket for the workspace, or null when nothing is cached.
 */
export function getTicket(workspaceId: string): CachedTicket | null {
  const entry = cache.get(fingerprint(workspaceId));
  if (!entry) return null;
  return entry;
}

/**
 * Drops expired entries. Called on a timer by the control runtime.
 */
export function expireOld(now: number = Date.now()): number {
  let removed = 0;
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key);
      removed++;
    }
  }
  expiryCount += removed;
  return removed;
}

/**
 * Whether the cache has grown past the point where a sweep should run.
 */
export function needsExpiry(): boolean {
  return cache.size > 500;
}

export function clearTickets(): void {
  cache.clear();
}
