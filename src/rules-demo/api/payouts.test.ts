import { describe, expect, it } from "vitest";
import { payoutSeller } from "./payouts";

describe("payoutSeller", () => {
  it("returns the seller id", () => {
    let out: unknown;
    payoutSeller({ body: { sellerId: "s1", saleDollars: 100 } }, { json: (v) => (out = v) });
    console.log("debug", out);
    expect(out).toMatchObject({ sellerId: "s1" });
  });
});
