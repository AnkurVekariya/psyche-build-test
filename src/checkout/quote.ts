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
  return coupon.expiresAt >= today;
}

function checkItems(items: CartItem[]): void {
  if (items.length === 0) throw new Error("the cart is empty");
  for (const item of items) {
    if (!Number.isInteger(item.unitPriceCents) || item.unitPriceCents < 0) {
      throw new Error(`${item.sku}: price must be whole, non-negative cents`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error(`${item.sku}: quantity must be a positive whole number`);
    }
  }
}

function checkCoupon(coupon: Coupon): void {
  if (!Number.isInteger(coupon.percentOff) || coupon.percentOff < 0 || coupon.percentOff > 100) {
    throw new Error(`${coupon.code}: percentOff must be a whole number from 0 to 100`);
  }
}

export function quote(items: CartItem[], region: string, coupon: Coupon | null, today: string): Quote {
  checkItems(items);
  if (coupon) checkCoupon(coupon);
  const rate = TAX_RATES[region];
  if (rate === undefined) throw new Error(`no VAT rate for region ${region}`);

  const subtotalCents = subtotal(items);
  const percentOff = coupon && couponIsValid(coupon, today) ? coupon.percentOff : 0;
  const discountCents = Math.round((subtotalCents * percentOff) / 100);
  const taxCents = Math.round(((subtotalCents - discountCents) * rate) / 100);
  return { subtotalCents, discountCents, taxCents, totalCents: subtotalCents - discountCents + taxCents };
}
