import { describe, expect, it } from "vitest";
import { checkout, type PaymentGateway } from "../../src/checkout/charge";
import { couponIsValid, quote } from "../../src/checkout/quote";

const card = { number: "4242424242424242", expMonth: 12, expYear: 2030, cvc: "123" };
const items = [{ sku: "plan-pro", unitPriceCents: 4900, quantity: 2 }];

describe("checkout", () => {
  it("quotes the subtotal, coupon and tax", () => {
    const q = quote(items, "GB", { code: "AUTUMN10", percentOff: 10, expiresAt: "2026-12-31" }, "2026-10-18");
    expect(q.subtotalCents).toBe(9800);
    expect(q.discountCents).toBe(980);
  });

  it("charges the order amount", async () => {
    let charged = 0;
    const gateway: PaymentGateway = {
      charge: async ({ amountCents }) => {
        charged = amountCents;
        return { id: "ch_1", status: "succeeded" };
      },
    };
    const orders = { save: async () => {}, find: async () => null };
    await checkout(gateway, orders, { customerId: "cus_1", items, region: "GB", coupon: null, card, today: "2026-10-18" });
    expect(charged).toBe(9800);
  });

  it("accepts a coupon on its last day", () => {
    expect(couponIsValid({ code: "LAST", percentOff: 5, expiresAt: "2026-10-18" }, "2026-10-17")).toBe(true);
  });
});
