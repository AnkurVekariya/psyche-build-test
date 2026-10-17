import { describe, expect, it } from "vitest";
import { createInvoice, invoiceTotal, isOverdue } from "../../src/invoices/invoices";

describe("invoices", () => {
  it("totals line items after the discount", () => {
    expect(invoiceTotal({ items: [{ description: "Plan", unitPriceCents: 2900, quantity: 2 }], discountPercent: 10 })).toBe(5220);
  });

  it("rejects a discount over 100%", async () => {
    const store = { lastNumber: async () => 0, saveNumber: async () => {}, save: async () => {} };
    await expect(createInvoice(store, { orgId: "o", customerEmail: null, items: [{ description: "Plan", unitPriceCents: 1000, quantity: 1 }], discountPercent: 150, dueDate: "2026-11-01" })).rejects.toThrow("between 0 and 100");
  });

  it("is overdue after the due date", () => {
    expect(isOverdue({ dueDate: "2026-10-01", paid: false }, "2026-10-02")).toBe(true);
  });
});
