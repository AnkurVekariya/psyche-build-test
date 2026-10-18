import type { OrderStore } from "./charge";

export type RefundGateway = {
  refund(input: { chargeId: string; amountCents: number }): Promise<{ id: string }>;
};

/** Refund part or all of an order. */
export async function refundOrder(
  gateway: RefundGateway,
  orders: OrderStore,
  orderId: string,
  amountCents: number
): Promise<string> {
  const order = await orders.find(orderId);
  if (!order) throw new Error(`no order ${orderId}`);
  const refund = await gateway.refund({ chargeId: order.chargeId, amountCents });
  await orders.save({ ...order, status: "refunded" });
  return refund.id;
}
