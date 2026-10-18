import { describe, expect, it } from "vitest";
import { checkout, type Order, type OrderStore, type PaymentGateway } from "../../src/checkout/charge";
import { couponIsValid, quote } from "../../src/checkout/quote";
import { refundOrder, type RefundGateway } from "../../src/checkout/refunds";

const card = { number: "4242424242424242", expMonth: 12, expYear: 2030, cvc: "123" };
const items = [{ sku: "plan-pro", unitPriceCents: 4900, quantity: 2 }];
const autumn = { code: "AUTUMN10", percentOff: 10, expiresAt: "2026-12-31" };

function memoryOrders(): OrderStore & { all: Map<string, Order> } {
  const all = new Map<string, Order>();
  return {
    all,
    save: async (order) => void all.set(order.id, order),
    find: async (id) => all.get(id) ?? null,
  };
}

function gatewayReturning(status: "succeeded" | "declined"): PaymentGateway & { charges: number[] } {
  const charges: number[] = [];
  return {
    charges,
    charge: async ({ amountCents }) => {
      charges.push(amountCents);
      return { id: "ch_1", status };
    },
  };
}

const refunds: RefundGateway = { refund: async () => ({ id: "re_1" }) };

const order = { checkoutId: "co_1", customerId: "cus_1", items, region: "GB", card, today: "2026-10-18" };

describe("quote", () => {
  it("applies the coupon, then tax on the discounted amount", () => {
    const q = quote(items, "GB", autumn, "2026-10-18");
    expect(q).toEqual({ subtotalCents: 9800, discountCents: 980, taxCents: 1764, totalCents: 10584 });
  });

  it("accepts a coupon on its last day", () => {
    expect(couponIsValid({ code: "LAST", percentOff: 5, expiresAt: "2026-10-18" }, "2026-10-18")).toBe(true);
  });

  it("rejects an unknown region and a bad coupon", () => {
    expect(() => quote(items, "XX", null, "2026-10-18")).toThrow(/region XX/);
    expect(() => quote(items, "GB", { ...autumn, percentOff: 150 }, "2026-10-18")).toThrow(/percentOff/);
  });
});

describe("checkout", () => {
  it("charges the total the customer pays", async () => {
    const gateway = gatewayReturning("succeeded");
    await checkout(gateway, memoryOrders(), { ...order, coupon: autumn });
    expect(gateway.charges).toEqual([10584]);
  });

  it("does not save a declined payment as paid", async () => {
    const orders = memoryOrders();
    await expect(checkout(gatewayReturning("declined"), orders, { ...order, coupon: null })).rejects.toThrow(/declined/);
    expect(orders.all.get("co_1")?.status).toBe("failed");
  });

  it("charges once when the same checkout is retried", async () => {
    const gateway = gatewayReturning("succeeded");
    const orders = memoryOrders();
    await checkout(gateway, orders, { ...order, coupon: null });
    await checkout(gateway, orders, { ...order, coupon: null });
    expect(gateway.charges).toEqual([11760]);
  });
});

describe("refunds", () => {
  it("tracks partial refunds and caps them at the amount paid", async () => {
    const orders = memoryOrders();
    await checkout(gatewayReturning("succeeded"), orders, { ...order, coupon: null });

    await refundOrder(refunds, orders, "co_1", 1760);
    expect(orders.all.get("co_1")).toMatchObject({ refundedCents: 1760, status: "partially_refunded" });

    await expect(refundOrder(refunds, orders, "co_1", 10001)).rejects.toThrow(/10000 cents left/);
    await refundOrder(refunds, orders, "co_1", 10000);
    expect(orders.all.get("co_1")?.status).toBe("refunded");
  });
});
