const WINDOW_MS = 60 * 1000;
const windows = new Map<string, { start: number; count: number }>();

/** Whether `key` has used up `limit` requests in the current window. */
export function limited(key: string, limit: number, now = Date.now()): boolean {
  const w = windows.get(key);
  if (!w || now - w.start >= WINDOW_MS) {
    windows.set(key, { start: now, count: 1 });
    return false;
  }
  w.count += 1;
  return w.count > limit;
}
