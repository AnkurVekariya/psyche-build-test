import type { Order, OrderStore, Refund } from "./charge";

export type RefundGateway = {
  refund(input: { chargeId: string; amountCents: number; idempotencyKey: string }): Promise<{ id: string }>;
};

/** Reserve a refund: it counts against the amount paid from now on. Returns why it can't be. */
function reserve(order: Order, refund: Refund): Order | string {
  const earlier = order.refunds.find((r) => r.id === refund.id);
  if (earlier) {
    return earlier.amountCents === refund.amountCents
      ? order
      : `refund ${refund.id} was started for ${earlier.amountCents} cents, not ${refund.amountCents}`;
  }
  if (order.chargeId === null || (order.status !== "paid" && order.status !== "partially_refunded")) {
    return `order ${order.id} is ${order.status}; nothing to refund`;
  }
  const left = order.amountPaidCents - order.refundedCents;
  if (refund.amountCents > left) return `order ${order.id} has ${left} cents left to refund, not ${refund.amountCents}`;
  return { ...order, refunds: [...order.refunds, refund], refundedCents: order.refundedCents + refund.amountCents };
}

/** Mark a reserved refund paid out; the status follows the money actually returned. */
function markPaidOut(order: Order, refundId: string, gatewayRefundId: string): Order {
  const refunds = order.refunds.map((r) => (r.id === refundId ? { ...r, gatewayRefundId } : r));
  const paidOutCents = refunds.filter((r) => r.gatewayRefundId !== null).reduce((sum, r) => sum + r.amountCents, 0);
  return { ...order, refunds, status: paidOutCents === order.amountPaidCents ? "refunded" : "partially_refunded" };
}

/** One gateway key per refund of an order; each id is escaped so no two pairs share a key. */
function refundKey(orderId: string, refundId: string): string {
  return `refund:${encodeURIComponent(orderId)}:${encodeURIComponent(refundId)}`;
}

/**
 * Refund part or all of an order. `refundId` is chosen by the caller once per refund of this
 * order and reused on retries. The cents are reserved on the order before the gateway is called,
 * so concurrent refunds never add up to more than was paid. If the gateway call fails the
 * reservation stays: retry with the same refundId and the gateway pays it out once. A refund
 * that was already paid out is not sent to the gateway again.
 */
export async function refundOrder(
  gateway: RefundGateway,
  orders: OrderStore,
  orderId: string,
  refundId: string,
  amountCents: number
): Promise<string> {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("refund amount must be a positive whole number of cents");
  }
  if (refundId.trim() === "") throw new Error("refundId is required");

  let refused = `no order ${orderId}`;
  const reserved = await orders.update(orderId, (order) => {
    const next = reserve(order, { id: refundId, amountCents, gatewayRefundId: null });
    if (typeof next === "string") {
      refused = next;
      return null;
    }
    return next;
  });
  if (!reserved || !reserved.chargeId) throw new Error(refused);
  const paidOut = reserved.refunds.find((r) => r.id === refundId)?.gatewayRefundId;
  if (paidOut) return paidOut;

  const refund = await gateway.refund({
    chargeId: reserved.chargeId,
    amountCents,
    idempotencyKey: refundKey(orderId, refundId),
  });
  await orders.update(orderId, (order) => markPaidOut(order, refundId, refund.id));
  return refund.id;
}
