import type { Handler } from "./rateLimiter";

/** Rejects requests without a valid API key (header x-api-key). */
export function requireApiKey(validKeys: readonly string[]): Handler {
  return (req) => {
    const key = req.headers["x-api-key"];
    if (!key || !validKeys.includes(key)) return { status: 401, headers: {}, body: { error: "invalid API key" } };
    return undefined;
  };
}
