/** The plans customers can subscribe to. Prices are in dollars. */
export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  seats: number;
}

export const PLANS: Record<string, Plan> = {
  starter: { id: "starter", name: "Starter", priceMonthly: 29, seats: 3 },
  team: { id: "team", name: "Team", priceMonthly: 99, seats: 10 },
  business: { id: "business", name: "Business", priceMonthly: 299, seats: 50 },
};

export function planFor(id: string): Plan {
  const plan = PLANS[id];
  if (!plan) throw new Error(`Unknown plan ${id}`);
  return plan;
}
