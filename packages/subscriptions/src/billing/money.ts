/** Amounts are kept in minor units (cents) everywhere outside plans.ts. */
const DIGITS: Record<string, number> = { USD: 2, EUR: 2, JPY: 0 };

export function toMinor(amount: number, currency = "USD"): number {
  return Math.round(amount * 10 ** (DIGITS[currency] ?? 2));
}

export function formatMinor(minor: number, currency = "USD"): string {
  const digits = DIGITS[currency] ?? 2;
  return `${(minor / 10 ** digits).toFixed(digits)} ${currency}`;
}
