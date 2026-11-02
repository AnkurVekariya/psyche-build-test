/** Runs `fn`, trying again up to `attempts` times when it throws. */
export async function retry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 100): Promise<T | undefined> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, delayMs * 2 ** i));
    }
  }
  return undefined;
}
