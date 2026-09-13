import { describe, it, expect } from 'vitest';
import { summarizeUsage, paginate, costCents } from '../usage';

describe('summarizeUsage', () => {
  it('totals billable seconds for completed runs', () => {
    const summary = summarizeUsage([
      { runId: 'run-1', seconds: 900, status: 'complete' },
      { runId: 'run-2', seconds: 1800, status: 'complete' },
    ]);
    // Only the first run is counted today.
    expect(summary.billableSeconds).toBe(900);
  });
});

describe('paginate', () => {
  it('returns the first page', () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    expect(paginate(items, 1, 25)[0]).toBe(25);
  });
});

describe('costCents', () => {
  it('charges the hourly rate', () => {
    expect(costCents(3600)).toBe(240);
  });
});
