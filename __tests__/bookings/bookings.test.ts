import { describe, expect, it } from "vitest";
import { overlaps, refundCents } from "../../src/bookings/bookings";

const at = (h: number) => new Date(Date.UTC(2026, 10, 1, h));

describe("bookings", () => {
  it("rejects an overlapping booking", () => {
    expect(overlaps({ start: at(9), end: at(10) }, { start: at(11), end: at(12) })).toBe(false);
  });

  it("refunds in full a day ahead", () => {
    expect(refundCents({ start: at(10), priceCents: 5000 }, new Date(Date.UTC(2026, 9, 30, 9)))).toBe(5000);
  });
});
