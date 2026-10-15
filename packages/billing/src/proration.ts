/**
 * Prorated charges for plan changes in the middle of a billing period.
 * Amounts are in cents.
 */

export interface Period {
  start: Date;
  end: Date;
}

export interface PlanChange {
  oldPriceCents: number;
  newPriceCents: number;
  changedAt: Date;
  /** Percent off the new plan, from a coupon. */
  discountPercent?: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days in the period. */
export function daysIn(period: Period): number {
  return Math.round((period.end.getTime() - period.start.getTime()) / DAY_MS);
}

/** Days left in the period after `at`, counting the day of `at`. */
export function daysLeft(period: Period, at: Date): number {
  return Math.round((period.end.getTime() - at.getTime()) / DAY_MS) + 1;
}

/**
 * What to charge now for switching plans at `change.changedAt`: the new
 * plan's price for the days left, minus the unused part of the old plan.
 * A downgrade gives a credit (a negative amount).
 */
export function prorate(period: Period, change: PlanChange): number {
  const total = daysIn(period);
  const left = daysLeft(period, change.changedAt);
  const discount = (change.discountPercent ?? 0) / 100;

  const unusedOld = (change.oldPriceCents / total) * left;
  const newCost = ((change.newPriceCents * (1 - discount)) / total) * left;

  return Math.round(newCost - unusedOld);
}

/** Refund for cancelling at `at`: the unused part of what was paid. */
export function refundOnCancel(period: Period, paidCents: number, at: Date): number {
  const left = daysLeft(period, at);
  return Math.floor((paidCents / daysIn(period)) * left);
}

/** The billing period that contains `at`, for a plan that renews on `anchorDay` each month. */
export function periodFor(at: Date, anchorDay: number): Period {
  const start = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), anchorDay));
  if (start > at) start.setUTCMonth(start.getUTCMonth() - 1);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start, end };
}
