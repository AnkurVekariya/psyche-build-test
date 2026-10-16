export interface Promo {
  code: string;
  /** Percent off, as a whole number: 10 means 10%. */
  percentOff: number;
  expiresAt: Date | null;
}

const PROMOS: Promo[] = [
  { code: "WELCOME10", percentOff: 10, expiresAt: null },
  { code: "LAUNCH25", percentOff: 25, expiresAt: new Date("2026-12-31T23:59:59Z") },
];

export function promoFor(code: string, now = new Date()): Promo | null {
  const promo = PROMOS.find((p) => p.code === code.toUpperCase());
  if (!promo || (promo.expiresAt && promo.expiresAt < now)) return null;
  return promo;
}

/** The total in cents after the promo. */
export function applyPromo(totalCents: number, promo: Promo): number {
  return Math.round(totalCents * (1 - promo.percentOff));
}
