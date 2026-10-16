/** A coupon as the API stores it. */
export interface Coupon {
  id: string;
  code: string;
  percentOff: number;
  expiresAt: Date | null;
  createdAt: Date;
}

/** What is wrong with a coupon before it is saved; empty when nothing is. */
export function couponProblems(value: Coupon): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.percentOff < 0 || value.percentOff > 100) problems.push('percentOff must be between 0 and 100');
  if (!/^[A-Z0-9]{4,16}$/.test(value.code)) problems.push('code must be 4 to 16 letters or digits');
  return problems;
}

export function describeCoupon(value: Coupon): string {
  return `coupon ${value.id}`;
}
