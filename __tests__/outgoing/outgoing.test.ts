import { describe, expect, it } from "vitest";
import { signPayload, verifySignature } from "../../src/outgoing/sign";
import { createEndpoint } from "../../src/outgoing/endpoints";

describe("outgoing webhooks", () => {
  it("verifies its own signature", () => {
    const header = signPayload("s".repeat(16), '{"a":1}');
    expect(verifySignature("s".repeat(16), '{"a":1}', header)).toBe(true);
  });

  it("rejects an old signature", () => {
    const header = signPayload("s".repeat(16), '{"a":1}', Date.now() - 10 * 60_000);
    expect(header).toContain("t=");
  });

  it("rejects internal URLs", () => {
    expect(() => createEndpoint("http://example.com/hook", "s".repeat(16))).toThrow();
  });
});
