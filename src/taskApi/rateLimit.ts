/** At most `max` requests per client per window. */
export function createLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (client: string, now = Date.now()): boolean => {
    const recent = (hits.get(client) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(client, recent);
    return recent.length <= max;
  };
}
