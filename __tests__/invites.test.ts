import { describe, expect, it } from 'vitest';
import { acceptInvite, createInvite, memberships, pendingInvites } from '../src/services/invites.js';

memberships.push({ workspaceId: 'w1', login: 'alice', email: 'alice@example.com', role: 'admin' });

describe('workspace invites', () => {
  it('creates an invite that expires in the future', () => {
    const invite = createInvite('w1', 'bob@example.com', 'member', 'alice');
    expect(invite.expiresAt).toBeGreaterThan(Date.now());
    expect(pendingInvites('w1')).toHaveLength(1);
  });

  it('lets the invited person join', () => {
    const invite = createInvite('w1', 'carol@example.com', 'viewer', 'alice');
    const membership = acceptInvite(invite.token, 'carol', 'carol@example.com');
    expect(membership.role).toBe('viewer');
  });

  it('refuses an invite for an expired token', () => {
    expect(() => acceptInvite('inv_unknown', 'erin', 'erin@example.com')).toThrow('Invite not found or expired');
  });

  it('refuses invites from outside the workspace', () => {
    expect(() => createInvite('w1', 'dave@example.com', 'member', 'mallory')).toThrow();
  });
});
