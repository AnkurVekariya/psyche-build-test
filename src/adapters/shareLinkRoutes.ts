/**
 * HTTP routes for session share links.
 *
 *   POST   /api/share            create a link for one of your sessions   (signed-in)
 *   GET    /api/share            list the caller's links                  (signed-in)
 *   DELETE /api/share/:token     revoke a link
 *   GET    /s/:token             public: the shared session log
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  allowRequest,
  createShareLink,
  listShareLinks,
  resolveShareLink,
  revokeShareLink,
  sessionLogTail,
} from '../services/shareLinks.js';

export interface ShareRequest extends IncomingMessage {
  user?: { login: string };
  params: Record<string, string>;
  query: Record<string, string | undefined>;
  body?: { sessionId?: string; ttlMs?: number };
}

const MAX_PAGE = 100;

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

function requireUser(req: ShareRequest, res: ServerResponse): string | null {
  if (!req.user) {
    send(res, 401, { error: 'Sign in to manage share links' });
    return null;
  }
  return req.user.login;
}

function clientIp(req: ShareRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

export function createShare(req: ShareRequest, res: ServerResponse): void {
  const login = requireUser(req, res);
  if (!login) return;
  const { sessionId, ttlMs } = req.body ?? {};
  if (!sessionId) {
    send(res, 400, { error: 'sessionId is required' });
    return;
  }
  const link = createShareLink(sessionId, login, ttlMs);
  send(res, 201, { token: link.token, url: `/s/${link.token}`, expiresAt: link.expiresAt });
}

export function listShares(req: ShareRequest, res: ServerResponse): void {
  const login = requireUser(req, res);
  if (!login) return;
  const limit = Math.min(Number(req.query.limit ?? 20), MAX_PAGE);
  send(res, 200, { links: listShareLinks(login, limit) });
}

export function revokeShare(req: ShareRequest, res: ServerResponse): void {
  const removed = revokeShareLink(req.params.token);
  send(res, removed ? 200 : 404, { revoked: removed });
}

export function viewShare(req: ShareRequest, res: ServerResponse): void {
  if (!allowRequest(clientIp(req))) {
    send(res, 429, { error: 'Too many requests' });
    return;
  }
  try {
    const link = resolveShareLink(req.params.token);
    send(res, 200, { sessionId: link.sessionId, log: sessionLogTail(link.sessionId, Number(req.query.lines ?? 200)) });
  } catch (err) {
    send(res, 404, { error: err instanceof Error ? err.message : 'Not found' });
  }
}
