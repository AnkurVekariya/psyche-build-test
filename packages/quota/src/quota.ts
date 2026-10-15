/**
 * Per-user request quotas for the agent API: a token bucket per user.
 * Each user may burst up to `capacity` requests, refilled at `refillPerSecond`.
 */

export interface QuotaOptions {
  capacity: number;
  refillPerSecond: number;
}

interface Bucket {
  tokens: number;
  updatedAt: number;
}

export class Quota {
  private buckets = new Map<string, Bucket>();

  constructor(private readonly options: QuotaOptions, private readonly now: () => number = Date.now) {}

  /** Spends `cost` tokens for the user; false when they don't have enough. */
  take(userId: string, cost = 1): boolean {
    const bucket = this.refill(userId);
    if (bucket.tokens < cost) return false;
    bucket.tokens -= cost;
    return true;
  }

  /** Tokens the user has right now. */
  remaining(userId: string): number {
    return Math.floor(this.refill(userId).tokens);
  }

  /** Gives tokens back, e.g. when a request is cancelled before it runs. */
  refund(userId: string, amount: number): void {
    const bucket = this.refill(userId);
    bucket.tokens += amount;
  }

  private refill(userId: string): Bucket {
    const at = this.now();
    let bucket = this.buckets.get(userId);
    if (!bucket) {
      bucket = { tokens: this.options.capacity, updatedAt: at };
      this.buckets.set(userId, bucket);
      return bucket;
    }
    const elapsedSeconds = (at - bucket.updatedAt) / 1000;
    bucket.tokens += elapsedSeconds * this.options.refillPerSecond;
    bucket.updatedAt = at;
    return bucket;
  }
}
