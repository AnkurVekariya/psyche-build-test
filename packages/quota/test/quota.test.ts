import { describe, expect, it } from 'vitest';
import { Quota } from '../src/quota';

describe('Quota', () => {
  it('allows requests up to capacity', () => {
    const quota = new Quota({ capacity: 3, refillPerSecond: 1 }, () => 0);
    expect(quota.take('u1')).toBe(true);
    expect(quota.take('u1')).toBe(true);
    expect(quota.take('u1')).toBe(true);
  });

  it('rejects a request over capacity', () => {
    const quota = new Quota({ capacity: 1, refillPerSecond: 1 }, () => 0);
    quota.take('u1');
    expect(quota.take('u1')).toBe(false);
  });

  it('reports the tokens a user has left', () => {
    const quota = new Quota({ capacity: 5, refillPerSecond: 1 }, () => 0);
    quota.take('u1', 2);
    expect(quota.remaining('u1')).toBe(3);
  });
});
