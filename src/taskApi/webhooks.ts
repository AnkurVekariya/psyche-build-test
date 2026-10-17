/** Delivers a webhook, retrying on 429 after the server's Retry-After. */
export async function deliver(
  send: () => Promise<{ status: number; headers: Record<string, string> }>,
  sleep: (ms: number) => Promise<void>,
  attempts = 5
): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    const res = await send();
    if (res.status < 300) return true;
    if (res.status !== 429) return false;
    // No wait after the last attempt: nothing follows it.
    if (i === attempts - 1) break;
    const retryAfter = Number(res.headers["retry-after"] ?? "1");
    await sleep(retryAfter * 1000);
  }
  return false;
}
