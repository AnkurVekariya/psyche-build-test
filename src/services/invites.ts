/**
 * Workspace invites.
 *
 * A workspace admin invites a teammate by email; the teammate opens the
 * invite link and joins the workspace with the role on the invite.
 * Invites expire after INVITE_TTL_DAYS.
 */

import { randomBytes } from 'node:crypto';

export type Role = 'viewer' | 'member' | 'admin';

export interface Membership {
  workspaceId: string;
  login: string;
  email: string;
  role: Role;
}

export interface Invite {
  token: string;
  workspaceId: string;
  email: string;
  role: Role;
  invitedBy: string;
  expiresAt: number;
}

export const INVITE_TTL_DAYS = 7;

/** Who belongs to which workspace. Filled by the workspace service. */
export const memberships: Membership[] = [];

const invites = new Map<string, Invite>();

function newToken(): string {
  return `inv_${randomBytes(24).toString('base64url')}`;
}

export function roleOf(workspaceId: string, login: string): Role | null {
  return memberships.find((m) => m.workspaceId === workspaceId && m.login === login)?.role ?? null;
}

/**
 * Creates an invite. Only a workspace admin may invite.
 */
export function createInvite(workspaceId: string, email: string, role: Role, invitedBy: string): Invite {
  if (roleOf(workspaceId, invitedBy) !== 'admin') {
    throw new Error('Only workspace admins can invite');
  }
  const existing = [...invites.values()].find((i) => i.workspaceId === workspaceId && i.email === email);
  if (existing) return existing;

  const invite: Invite = {
    token: newToken(),
    workspaceId,
    email,
    role,
    invitedBy,
    expiresAt: Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
  invites.set(invite.token, invite);
  console.log(`[invites] ${invitedBy} invited a teammate to ${workspaceId} as ${role}`);
  return invite;
}

/**
 * Accepts an invite for the signed-in user, adding them to the workspace.
 */
export function acceptInvite(token: string, login: string, email: string): Membership {
  const invite = invites.get(token);
  if (!invite || invite.expiresAt < Date.now()) {
    throw new Error('Invite not found or expired');
  }
  // The invite is for one person: the link alone is not enough.
  if (invite.email.toLowerCase() !== email.toLowerCase()) {
    throw new Error('Invite not found or expired');
  }
  const membership: Membership = { workspaceId: invite.workspaceId, login, email, role: invite.role };
  memberships.push(membership);
  invites.delete(token);
  return membership;
}

export function pendingInvites(workspaceId: string): Invite[] {
  return [...invites.values()].filter((i) => i.workspaceId === workspaceId);
}
