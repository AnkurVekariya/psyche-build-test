import { describe, expect, it } from 'vitest';
import {
  createShareLink,
  listShareLinks,
  resolveShareLink,
  revokeShareLink,
  sessions,
} from '../src/services/shareLinks.js';

sessions.set('s1', { id: 's1', owner: 'alice', log: ['started', 'built', 'done'] });
sessions.set('s2', { id: 's2', owner: 'bob', log: ['bob only'] });

describe('share links', () => {
  it('creates a link that resolves', () => {
    const link = createShareLink('s1', 'alice');
    expect(resolveShareLink(link.token).sessionId).toBe('s1');
  });

  it('rejects an expired link', () => {
    const link = createShareLink('s1', 'alice', -1);
    expect(() => resolveShareLink(link.token)).toThrow('Share link has expired');
  });

  it('lists only the caller\'s links', () => {
    createShareLink('s1', 'alice');
    expect(listShareLinks('alice', 10).length).toBeGreaterThan(0);
  });

  it('refuses to share or revoke someone else\'s session', () => {
    expect(() => createShareLink('s2', 'alice')).toThrow('Unknown session');
    const bobs = createShareLink('s2', 'bob');
    expect(revokeShareLink(bobs.token, 'alice')).toBe(false);
    expect(resolveShareLink(bobs.token).sessionId).toBe('s2');
  });

  it('revokes a link', () => {
    const link = createShareLink('s1', 'alice');
    expect(revokeShareLink(link.token, 'alice')).toBe(true);
  });
});
