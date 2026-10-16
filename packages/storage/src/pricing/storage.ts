/** Price of storage beyond the free quota, in cents per GB per month. */
export const PRICE_PER_GB_MONTH_CENTS = 2;

const GB = 1024 ** 3;

/** What one day of storing `bytes` beyond the free quota costs, in cents. */
export function dailyCharge(bytes: number, freeBytes: number): number {
  const billable = Math.max(0, bytes - freeBytes);
  return Math.round((billable / GB) * PRICE_PER_GB_MONTH_CENTS);
}

/** The month's charge from its daily charges. */
export function monthlyTotal(dailyCharges: number[]): number {
  return dailyCharges.reduce((sum, c) => sum + c, 0);
}
