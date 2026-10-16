const balances = new Map<string, number>();

/** Adds to the customer's credit balance, persisting the new value first. */
export async function creditBalance(customerId: string, amountMinor: number): Promise<number> {
  const current = balances.get(customerId) ?? 0;
  await persist(customerId, current + amountMinor);
  balances.set(customerId, current + amountMinor);
  return current + amountMinor;
}

export function balanceOf(customerId: string): number {
  return balances.get(customerId) ?? 0;
}

async function persist(customerId: string, value: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 5));
  console.log(`saved balance for ${customerId}: ${value}`);
}
