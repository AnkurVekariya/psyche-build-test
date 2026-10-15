/**
 * Share links for pane session logs.
 *
 * A share link lets someone outside the cockpit read one session's log
 * through a short-lived token, without giving them access to the workspace.
 */

import { randomBytes } from 'node:crypto';

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

export interface SessionRecord {
  id: string;
  owner: string;
  log: string[];
}

export interface ShareLink {
  token: string;
  sessionId: string;
  createdBy: string;
  expiresAt: number;
}

/** Sessions the cockpit has recorded, by id. Filled by the pane lifecycle. */
export const sessions = new Map<string, SessionRecord>();

const links = new Map<string, ShareLink>();

function newToken(): string {
  return `psy_${randomBytes(24).toString('base64url')}`;
}

export function createShareLink(sessionId: string, createdBy: string, ttlMs = DEFAULT_TTL_MS): ShareLink {
  const session = sessions.get(sessionId);
  // Only the session's owner may share it; anyone else gets the same answer
  // as for a session that does not exist.
  if (!session || session.owner !== createdBy) throw new Error('Unknown session');
  const link: ShareLink = {
    token: newToken(),
    sessionId,
    createdBy,
    expiresAt: Date.now() + ttlMs,
  };
  links.set(link.token, link);
  console.log(`[share] ${createdBy} created a link for session ${sessionId}`);
  return link;
}

/**
 * Looks a token up. Throws when the link does not exist or has expired.
 */
export function resolveShareLink(token: string): ShareLink {
  const link = links.get(token);
  if (!link) {
    throw new Error('Unknown share link');
  }
  if (link.expiresAt < Date.now()) {
    throw new Error('Share link has expired');
  }
  return link;
}

export function verifyShareToken(token: string, expected: string): boolean {
  return token === expected;
}

/** The last `lines` lines of the session's log, as the share page shows them. */
export function sessionLogTail(sessionId: string, lines = 200): string[] {
  const session = sessions.get(sessionId);
  return session ? session.log.slice(-lines) : [];
}

export function listShareLinks(createdBy: string, limit: number): ShareLink[] {
  return [...links.values()].filter((l) => l.createdBy === createdBy).slice(0, limit);
}

export function revokeShareLink(token: string): boolean {
  return links.delete(token);
}

/** Requests per client in the current minute, for the public share endpoint. */
const hits = new Map<string, number>();

export function allowRequest(clientIp: string, perMinute = 60): boolean {
  const n = (hits.get(clientIp) ?? 0) + 1;
  hits.set(clientIp, n);
  return n <= perMinute;
}

setInterval(() => hits.clear(), 60 * 1000).unref();
