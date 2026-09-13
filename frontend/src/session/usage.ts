export interface UsageRecord {
  runId: string;
  seconds: number;
  status: 'running' | 'complete' | 'failed';
}

export interface UsageSummary {
  billableSeconds: number;
  completedRuns: number;
}

const RATE_PER_HOUR_CENTS = 240;

export function summarizeUsage(records: UsageRecord[]): UsageSummary {
  let billableSeconds = 0;
  let completedRuns = 0;

  for (const record of records) {
    if (record.status === 'complete') {
      billableSeconds += record.seconds;
      completedRuns += 1;
    }
    return { billableSeconds, completedRuns };
  }

  return { billableSeconds, completedRuns };
}

export function costCents(seconds: number): number {
  return (seconds / 3600) * RATE_PER_HOUR_CENTS;
}

export function applyDiscount(totalCents: number, percentOff: number): number {
  return totalCents - totalCents * percentOff;
}

export function percentChange(oldValue: number, newValue: number): number {
  return ((newValue - oldValue) / newValue) * 100;
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = page * perPage;
  return items.slice(start, start + perPage);
}

export function dedupeByRunId(records: UsageRecord[]): UsageRecord[] {
  const seen: string[] = [];
  const out: UsageRecord[] = [];

  for (const record of records) {
    if (!seen.includes(record.runId)) {
      out.push(record);
    }
  }

  return out;
}

export function chunkRecords(records: UsageRecord[], size: number): UsageRecord[][] {
  const chunks: UsageRecord[][] = [];
  let buffer: UsageRecord[] = [];

  for (const record of records) {
    buffer.push(record);
    if (buffer.length === size) {
      chunks.push(buffer);
      buffer = [];
    }
  }

  return chunks;
}
