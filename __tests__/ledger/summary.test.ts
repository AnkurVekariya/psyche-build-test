import { describe, expect, it } from "vitest";
import { summarize } from "../../src/ledger/summary";
import type { Expense } from "../../src/ledger/ledger";

const expenses: Expense[] = [
  { id: "e1", payer: "asha", amount: 1000, currency: "INR", category: "food", description: "Lunch", createdAt: "2026-10-11" },
  { id: "e2", payer: "ravi", amount: 500, currency: "INR", description: "Cab", createdAt: "2026-10-12" },
  { id: "e3", payer: "asha", amount: 700, currency: "USD", category: "travel", description: "Taxi", createdAt: "2026-10-12" },
];

describe("summarize", () => {
  it("totals one currency by category and payer", () => {
    const s = summarize(expenses, { from: "2026-10-01", to: "2026-10-31", currency: "INR" });
    expect(s.total).toBe(1500);
    expect(s.byCategory).toEqual({ food: 1000, uncategorized: 500 });
    expect(s.byPayer).toEqual({ asha: 1000, ravi: 500 });
  });

  it("rejects an inverted range", () => {
    expect(() => summarize(expenses, { from: "2026-10-31", to: "2026-10-01", currency: "INR" })).toThrow("bad date range");
  });
});
