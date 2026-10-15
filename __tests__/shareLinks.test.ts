import { describe, expect, it } from 'vitest';
import {
  createShareLink,
  listShareLinks,
  resolveShareLink,
  revokeShareLink,
  sessions,
} from '../src/services/shareLinks.js';

sessions.set('s1', { id: 's1', owner: 'alice', log: ['started', 'built', 'done'] });

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

  it('revokes a link', () => {
    const link = createShareLink('s1', 'alice');
    expect(revokeShareLink(link.token, 'alice')).toBe(true);
  });
});
