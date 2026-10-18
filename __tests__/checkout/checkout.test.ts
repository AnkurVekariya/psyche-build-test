import { describe, expect, it } from "vitest";
import { checkout, type Order, type OrderStore, type PaymentGateway } from "../../src/checkout/charge";
import { couponIsValid, quote } from "../../src/checkout/quote";
import { refundOrder, type RefundGateway } from "../../src/checkout/refunds";

const card = { number: "4242424242424242", expMonth: 12, expYear: 2030, cvc: "123" };
const items = [{ sku: "plan-pro", unitPriceCents: 4900, quantity: 2 }];
const autumn = { code: "AUTUMN10", percentOff: 10, expiresAt: "2026-12-31" };
const order = { checkoutId: "co_1", customerId: "cus_1", items, region: "GB", card, today: "2026-10-18" };

function memoryOrders(): OrderStore & { all: Map<string, Order> } {
  const all = new Map<string, Order>();
  return {
    all,
    save: async (o) => void all.set(o.id, o),
    find: async (id) => all.get(id) ?? null,
    update: async (id, change) => {
      const current = all.get(id);
      const next = current ? change(current) : null;
      if (next) all.set(id, next);
      return next;
    },
  };
}

function gatewayReturning(...statuses: ("succeeded" | "declined")[]): PaymentGateway & { keys: string[] } {
  const keys: string[] = [];
  return {
    keys,
    charge: async ({ idempotencyKey }) => {
      keys.push(idempotencyKey);
      return { id: `ch_${keys.length}`, status: statuses[keys.length - 1] ?? "succeeded" };
    },
  };
}

function refundGateway(): RefundGateway & { calls: { amountCents: number; idempotencyKey: string }[] } {
  const calls: { amountCents: number; idempotencyKey: string }[] = [];
  return {
    calls,
    refund: async ({ amountCents, idempotencyKey }) => {
      calls.push({ amountCents, idempotencyKey });
      await Promise.resolve();
      return { id: `re_${idempotencyKey}` };
    },
  };
}

async function paidOrder(orders: OrderStore): Promise<void> {
  await checkout(gatewayReturning(), orders, { ...order, coupon: null });
}

describe("quote", () => {
  it("applies the coupon, then tax on the discounted amount", () => {
    expect(quote(items, "GB", autumn, "2026-10-18")).toEqual({
      subtotalCents: 9800,
      discountCents: 980,
      taxCents: 1764,
      totalCents: 10584,
    });
  });

  it("rounds a fractional cent of tax to the nearest cent", () => {
    // 1003 at 20% is 200.6 cents of tax; 1002 is 200.4.
    expect(quote([{ sku: "a", unitPriceCents: 1003, quantity: 1 }], "GB", null, "2026-10-18").taxCents).toBe(201);
    expect(quote([{ sku: "a", unitPriceCents: 1002, quantity: 1 }], "GB", null, "2026-10-18").taxCents).toBe(200);
  });

  it("accepts a coupon on its last day and drops it the day after", () => {
    const last = { code: "LAST", percentOff: 5, expiresAt: "2026-10-18" };
    expect(couponIsValid(last, "2026-10-18")).toBe(true);
    expect(couponIsValid(last, "2026-10-19")).toBe(false);
    expect(quote(items, "GB", last, "2026-10-19").discountCents).toBe(0);
  });

  it("rejects bad input", () => {
    const at = (overrides: object) => [{ sku: "a", unitPriceCents: 100, quantity: 1, ...overrides }];
    expect(() => quote([], "GB", null, "2026-10-18")).toThrow(/empty/);
    expect(() => quote(items, "XX", null, "2026-10-18")).toThrow(/region XX/);
    expect(() => quote(at({ unitPriceCents: -1 }), "GB", null, "2026-10-18")).toThrow(/price/);
    expect(() => quote(at({ unitPriceCents: 1.5 }), "GB", null, "2026-10-18")).toThrow(/price/);
    expect(() => quote(at({ quantity: 0 }), "GB", null, "2026-10-18")).toThrow(/quantity/);
    expect(() => quote(at({ unitPriceCents: 2 ** 50 }), "GB", null, "2026-10-18")).toThrow(/too large/);
    expect(() => quote(items, "GB", { ...autumn, percentOff: 150 }, "2026-10-18")).toThrow(/percentOff/);
    expect(() => quote(items, "GB", { ...autumn, percentOff: -5 }, "2026-10-18")).toThrow(/percentOff/);
  });
});

describe("checkout", () => {
  it("charges the total the customer pays", async () => {
    const charged: number[] = [];
    const gateway: PaymentGateway = {
      charge: async ({ amountCents }) => {
        charged.push(amountCents);
        return { id: "ch_1", status: "succeeded" };
      },
    };
    await checkout(gateway, memoryOrders(), { ...order, coupon: autumn });
    expect(charged).toEqual([10584]);
  });

  it("does not save a declined payment as paid, and a retry does not charge again", async () => {
    const gateway = gatewayReturning("declined");
    const orders = memoryOrders();
    await expect(checkout(gateway, orders, { ...order, coupon: null })).rejects.toThrow(/declined/);
    expect(orders.all.get("co_1")?.status).toBe("failed");
    await expect(checkout(gateway, orders, { ...order, coupon: null })).rejects.toThrow(/start a new checkout/);
    expect(gateway.keys).toHaveLength(1);
  });

  it("retries a pending checkout with the same idempotency key", async () => {
    const orders = memoryOrders();
    const crashing: PaymentGateway = { charge: async () => Promise.reject(new Error("timeout")) };
    await expect(checkout(crashing, orders, { ...order, coupon: null })).rejects.toThrow(/timeout/);
    expect(orders.all.get("co_1")?.status).toBe("pending");

    const gateway = gatewayReturning();
    const paid = await checkout(gateway, orders, { ...order, coupon: null });
    expect(gateway.keys).toEqual(["checkout-co_1"]);
    expect(paid.status).toBe("paid");
  });

  it("refuses a retry for another customer or a different cart", async () => {
    const orders = memoryOrders();
    await paidOrder(orders);
    await expect(checkout(gatewayReturning(), orders, { ...order, customerId: "cus_2", coupon: null })).rejects.toThrow(
      /another customer/
    );
    await expect(checkout(gatewayReturning(), orders, { ...order, coupon: autumn })).rejects.toThrow(/different amount/);
  });
});

describe("refunds", () => {
  it("tracks partial refunds and caps them at the amount paid", async () => {
    const orders = memoryOrders();
    await paidOrder(orders);
    const gateway = refundGateway();

    await refundOrder(gateway, orders, "co_1", "r1", 1760);
    expect(orders.all.get("co_1")).toMatchObject({ refundedCents: 1760, status: "partially_refunded" });
    await expect(refundOrder(gateway, orders, "co_1", "r2", 10001)).rejects.toThrow(/cannot be refunded/);
    await refundOrder(gateway, orders, "co_1", "r3", 10000);
    expect(orders.all.get("co_1")?.status).toBe("refunded");
  });

  it("never lets concurrent refunds exceed the amount paid", async () => {
    const orders = memoryOrders();
    await paidOrder(orders);
    const gateway = refundGateway();

    const results = await Promise.allSettled([
      refundOrder(gateway, orders, "co_1", "a", 6000),
      refundOrder(gateway, orders, "co_1", "b", 6000),
      refundOrder(gateway, orders, "co_1", "c", 700),
    ]);
    expect(results.map((r) => r.status)).toEqual(["fulfilled", "rejected", "fulfilled"]);
    expect(gateway.calls).toEqual([
      { amountCents: 6000, idempotencyKey: "refund-a" },
      { amountCents: 700, idempotencyKey: "refund-c" },
    ]);
    expect(orders.all.get("co_1")?.refundedCents).toBe(6700);
  });

  it("pays a retried refund out once, and keeps a failed one reserved for its retry", async () => {
    const orders = memoryOrders();
    await paidOrder(orders);
    const failing: RefundGateway = { refund: async () => Promise.reject(new Error("timeout")) };
    await expect(refundOrder(failing, orders, "co_1", "r1", 500)).rejects.toThrow(/timeout/);
    expect(orders.all.get("co_1")).toMatchObject({ refundedCents: 500, status: "paid" });

    const gateway = refundGateway();
    await refundOrder(gateway, orders, "co_1", "r1", 500);
    await refundOrder(gateway, orders, "co_1", "r1", 500);
    expect(orders.all.get("co_1")).toMatchObject({ refundedCents: 500, status: "partially_refunded" });
    expect(gateway.calls.map((c) => c.idempotencyKey)).toEqual(["refund-r1", "refund-r1"]);
    await expect(refundOrder(gateway, orders, "co_1", "r1", 700)).rejects.toThrow(/cannot be refunded/);
  });
});
