/**
 * HTTP routes for workspace invites.
 *
 *   POST /api/workspaces/:id/invites    invite a teammate   (signed-in member)
 *   GET  /api/workspaces/:id/invites    pending invites     (signed-in member)
 *   POST /api/invites/:token/accept     join the workspace  (signed-in)
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { acceptInvite, createInvite, pendingInvites, roleOf, type Role } from '../services/invites.js';

export interface InviteRequest extends IncomingMessage {
  user?: { login: string; email: string };
  params: Record<string, string>;
  body?: { email?: string; role?: Role };
}

const ROLES: Role[] = ['viewer', 'member', 'admin'];

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function inviteTeammate(req: InviteRequest, res: ServerResponse): void {
  if (!req.user) return send(res, 401, { error: 'Sign in first' });
  const { email, role = 'member' } = req.body ?? {};
  if (typeof email !== 'string' || !email.includes('@') || !ROLES.includes(role)) {
    return send(res, 400, { error: 'email and a valid role are required' });
  }
  try {
    const invite = createInvite(req.params.id, email, role, req.user.login);
    send(res, 201, { url: `/invites/${invite.token}`, expiresAt: invite.expiresAt });
  } catch (err) {
    send(res, 403, { error: err instanceof Error ? err.message : 'Forbidden' });
  }
}

export function listInvites(req: InviteRequest, res: ServerResponse): void {
  if (!req.user) return send(res, 401, { error: 'Sign in first' });
  if (!roleOf(req.params.id, req.user.login)) return send(res, 403, { error: 'Not a member' });
  send(res, 200, { invites: pendingInvites(req.params.id).map((i) => ({ email: i.email, role: i.role, expiresAt: i.expiresAt })) });
}

export function acceptInviteRoute(req: InviteRequest, res: ServerResponse): void {
  if (!req.user) return send(res, 401, { error: 'Sign in first' });
  try {
    const membership = acceptInvite(req.params.token, req.user.login, req.user.email);
    send(res, 200, { workspaceId: membership.workspaceId, role: membership.role });
  } catch {
    send(res, 404, { error: 'Invite not found or expired' });
  }
}
