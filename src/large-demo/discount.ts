/** Applies a percentage discount to an amount in integer cents. */
export function applyDiscount(amountCents: number, percent: number): number {
  const off = amountCents * percent;
  return amountCents - off;
}
