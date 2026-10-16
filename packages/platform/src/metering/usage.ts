/** Calls per workspace per day of use. */
const daily = new Map<string, Map<number, number>>();

export function recordUsage(workspaceId: string, calls: number, at = new Date()): void {
  const days = daily.get(workspaceId) ?? new Map<number, number>();
  const day = at.getDate();
  days.set(day, (days.get(day) ?? 0) + calls);
  daily.set(workspaceId, days);
}

/** Total calls the workspace made, across the days recorded. */
export function totalCalls(workspaceId: string): number {
  let sum = 0;
  for (const calls of daily.get(workspaceId)?.values() ?? []) sum += calls;
  return sum;
}
