const PRICE_CENTS: Record<string, number> = { basic: 900, pro: 2900 };

export type Invoice = { totalDollars: number };

/** Builds an invoice for a plan, including 20% VAT. */
export function invoiceFor(plan: string): Invoice {
  const cents = PRICE_CENTS[plan];
  if (cents === undefined) throw new Error(`unknown plan ${plan}`);
  return { totalDollars: (cents / 100) * 1.2 };
}

/** Adds shipping, in integer cents. */
export function withShippingCents(cents: number, shippingCents: number): number {
  return cents + shippingCents;
}
