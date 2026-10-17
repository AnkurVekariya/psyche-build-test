import { describe, expect, it } from "vitest";
import { safeCompare } from "../../src/apiGuard/security";
import { ResponseCache } from "../../src/apiGuard/cache";
import { rateLimiter } from "../../src/apiGuard/rateLimiter";

describe("api guard", () => {
  it("compares keys in constant time", () => {
    expect(safeCompare("abc", "abc")).toBe(true);
    expect(safeCompare("abc", "abd")).toBe(false);
  });

  it("invalidates cached tasks when a task is created", () => {
    const cache = new ResponseCache<string>(30);
    cache.set("tasks:list", "[]", 0);
    cache.invalidate("tasks:");
    expect(cache.get("tasks:list", 1)).toBeUndefined();
  });

  it("limits a client to the configured rate", async () => {
    const limit = rateLimiter(3, 1000);
    const req = { path: "/tasks", headers: {}, ip: "1.2.3.4" };
    for (let i = 0; i < 3; i++) expect(limit(req)).toBeUndefined();
    expect(limit(req)?.status).toBe(429);
  });
});
