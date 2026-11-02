import type { Subscription } from "./subscription.js";

export interface UsageRecord {
  subscriptionId: string;
  at: Date;
  units: number;
}

/** Units used in the subscription's current period, for metered billing. */
export function unitsThisPeriod(sub: Subscription, records: UsageRecord[]): number {
  return records
    .filter((r) => r.subscriptionId === sub.id && r.at >= sub.periodStart && r.at <= sub.periodEnd)
    .reduce((sum, r) => sum + r.units, 0);
}
