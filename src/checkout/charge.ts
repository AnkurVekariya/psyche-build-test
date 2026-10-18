import { quote, type CartItem, type Coupon } from "./quote";

export type Card = { number: string; expMonth: number; expYear: number; cvc: string };

export type ChargeResult = { id: string; status: "succeeded" | "declined" | "failed" };

export type PaymentGateway = {
  charge(input: { amountCents: number; card: Card; idempotencyKey: string }): Promise<ChargeResult>;
};

export type Order = {
  id: string;
  customerId: string;
  totalCents: number;
  amountPaidCents: number;
  refundedCents: number;
  chargeId: string | null;
  status: "pending" | "paid" | "failed" | "partially_refunded" | "refunded";
};

export type OrderStore = {
  save(order: Order): Promise<void>;
  find(id: string): Promise<Order | null>;
};

/**
 * Charge the customer for a cart. `checkoutId` is chosen by the client once per checkout and
 * reused on retries: it is the order id and the gateway idempotency key, so a retry after a
 * timeout or a crash never charges twice.
 */
export async function checkout(
  gateway: PaymentGateway,
  orders: OrderStore,
  input: {
    checkoutId: string;
    customerId: string;
    items: CartItem[];
    region: string;
    coupon: Coupon | null;
    card: Card;
    today: string;
  }
): Promise<Order> {
  const q = quote(input.items, input.region, input.coupon, input.today);

  const existing = await orders.find(input.checkoutId);
  if (existing && existing.customerId !== input.customerId) {
    throw new Error(`checkout ${input.checkoutId} belongs to another customer`);
  }
  if (existing && existing.status !== "pending") {
    if (existing.status === "failed") throw new Error(`checkout ${input.checkoutId} failed; start a new checkout`);
    return existing;
  }

  // Record the order before taking money, so a charge is never left without an order.
  const pending: Order = existing ?? {
    id: input.checkoutId,
    customerId: input.customerId,
    totalCents: q.totalCents,
    amountPaidCents: 0,
    refundedCents: 0,
    chargeId: null,
    status: "pending",
  };
  if (pending.totalCents !== q.totalCents) {
    throw new Error(`checkout ${input.checkoutId} was started for a different amount; start a new checkout`);
  }
  if (!existing) await orders.save(pending);

  console.info("checkout: charging", { customerId: input.customerId, orderId: pending.id, total: q.totalCents });
  const result = await gateway.charge({
    amountCents: q.totalCents,
    card: input.card,
    idempotencyKey: `checkout-${input.checkoutId}`,
  });

  if (result.status !== "succeeded") {
    await orders.save({ ...pending, chargeId: result.id, status: "failed" });
    throw new Error(`payment ${result.status} for checkout ${input.checkoutId}`);
  }

  const order: Order = { ...pending, amountPaidCents: q.totalCents, chargeId: result.id, status: "paid" };
  await orders.save(order);
  return order;
}
