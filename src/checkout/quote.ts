export type CartItem = { sku: string; unitPriceCents: number; quantity: number };
export type Coupon = { code: string; percentOff: number; expiresAt: string };

/** VAT by region, in percent. */
export const TAX_RATES: Record<string, number> = { GB: 20, DE: 19, FR: 20, IE: 23 };

/**
 * A price quote. Contract for anyone who takes payment:
 * - totalCents is what the customer pays: after the coupon, tax included.
 * - every amount is whole cents.
 */
export type Quote = {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
};

export function subtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}

/** A coupon is valid until the end of its expiry day. */
export function couponIsValid(coupon: Coupon, today: string): boolean {
  return coupon.expiresAt > today;
}

export function quote(items: CartItem[], region: string, coupon: Coupon | null, today: string): Quote {
  if (items.length === 0) throw new Error("the cart is empty");
  const subtotalCents = subtotal(items);
  const percentOff = coupon && couponIsValid(coupon, today) ? coupon.percentOff : 0;
  const discountCents = Math.round((subtotalCents * percentOff) / 100);
  const rate = TAX_RATES[region] ?? 0;
  const taxCents = Math.floor(((subtotalCents - discountCents) * rate) / 100);
  return { subtotalCents, discountCents, taxCents, totalCents: subtotalCents - discountCents + taxCents };
}
