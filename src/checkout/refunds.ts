import type { OrderStore } from "./charge";

export type RefundGateway = {
  refund(input: { chargeId: string; amountCents: number; idempotencyKey: string }): Promise<{ id: string }>;
};

/** Refund part or all of an order. Refunds can never add up to more than was paid. */
export async function refundOrder(
  gateway: RefundGateway,
  orders: OrderStore,
  orderId: string,
  amountCents: number
): Promise<string> {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("refund amount must be a positive whole number of cents");
  }
  const order = await orders.find(orderId);
  if (!order) throw new Error(`no order ${orderId}`);
  if (!order.chargeId || (order.status !== "paid" && order.status !== "partially_refunded")) {
    throw new Error(`order ${orderId} is ${order.status}; nothing to refund`);
  }
  const refundable = order.amountPaidCents - order.refundedCents;
  if (amountCents > refundable) {
    throw new Error(`order ${orderId} has ${refundable} cents left to refund, not ${amountCents}`);
  }

  // Keyed on what was refunded before, so a repeated or concurrent request refunds once.
  const refund = await gateway.refund({
    chargeId: order.chargeId,
    amountCents,
    idempotencyKey: `refund-${orderId}-${order.refundedCents}`,
  });
  const refundedCents = order.refundedCents + amountCents;
  await orders.save({
    ...order,
    refundedCents,
    status: refundedCents === order.amountPaidCents ? "refunded" : "partially_refunded",
  });
  return refund.id;
}
