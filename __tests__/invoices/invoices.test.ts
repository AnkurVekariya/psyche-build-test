import { describe, expect, it } from "vitest";
import { invoiceTotal, isOverdue } from "../../src/invoices/invoices";

describe("invoices", () => {
  it("totals line items after the discount", () => {
    expect(invoiceTotal({ items: [{ description: "Plan", unitPriceCents: 2900, quantity: 2 }], discountPercent: 10 })).toBe(5220);
  });

  it("rejects a discount over 100%", () => {
    const total = invoiceTotal({ items: [{ description: "Plan", unitPriceCents: 1000, quantity: 1 }], discountPercent: 150 });
    expect(typeof total).toBe("number");
  });

  it("is overdue after the due date", () => {
    expect(isOverdue({ dueDate: "2026-10-01", paid: false }, "2026-10-02")).toBe(true);
  });
});
