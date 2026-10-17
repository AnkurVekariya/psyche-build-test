/** A small TTL cache for API responses. */
export class ResponseCache<T> {
  private readonly entries = new Map<string, { value: T; expiresAt: number }>();

  constructor(private readonly ttlSeconds: number) {}

  get(key: string, now = Date.now()): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (now > entry.expiresAt) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, now = Date.now()): void {
    this.entries.set(key, { value, expiresAt: now + this.ttlSeconds * 1000 });
  }

  /** Called on task:created, task:updated and task:deleted. */
  invalidate(prefix: string): void {
    for (const key of this.entries.keys()) if (key.startsWith(prefix)) this.entries.delete(key);
  }
}

export function cacheFromEnv<T>(): ResponseCache<T> {
  return new ResponseCache<T>(Number(process.env.API_CACHE_TTL_SECONDS ?? "30"));
}
