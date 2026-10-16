export interface MeteredPlan {
  id: string;
  /** API calls included each month, in thousands. */
  includedCalls: number;
  /** Price per call over the included amount, in cents. */
  overageCentsPerCall: number;
}

export const PLANS: Record<string, MeteredPlan> = {
  free: { id: "free", includedCalls: 10, overageCentsPerCall: 0 },
  growth: { id: "growth", includedCalls: 500, overageCentsPerCall: 0.02 },
  scale: { id: "scale", includedCalls: 5_000, overageCentsPerCall: 0.01 },
};
