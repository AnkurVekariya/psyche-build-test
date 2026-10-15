import { describe, expect, it } from 'vitest';
import { prorate } from '../src/proration';

describe('prorate', () => {
  it('charges the difference for an upgrade halfway through', () => {
    const period = { start: new Date('2026-04-01T00:00:00Z'), end: new Date('2026-05-01T00:00:00Z') };
    const cents = prorate(period, { oldPriceCents: 1000, newPriceCents: 3000, changedAt: new Date('2026-04-16T00:00:00Z') });
    expect(cents).toBeGreaterThan(0);
  });
});
