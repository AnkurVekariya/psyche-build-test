import { quote, type CartItem, type Coupon } from "./quote";

export type Card = { number: string; expMonth: number; expYear: number; cvc: string };

export type ChargeResult = { id: string; status: "succeeded" | "declined" | "failed" };

export type PaymentGateway = {
  charge(input: { amountCents: number; card: Card; idempotencyKey: string }): Promise<ChargeResult>;
};

export type Order = {
  id: string;
  customerId: string;
  amountPaidCents: number;
  chargeId: string;
  status: "paid" | "refunded";
};

export type OrderStore = {
  save(order: Order): Promise<void>;
  find(id: string): Promise<Order | null>;
};

export async function checkout(
  gateway: PaymentGateway,
  orders: OrderStore,
  input: { customerId: string; items: CartItem[]; region: string; coupon: Coupon | null; card: Card; today: string }
): Promise<Order> {
  const q = quote(input.items, input.region, input.coupon, input.today);
  console.info("checkout: charging", { customerId: input.customerId, card: input.card, total: q.totalCents });

  const result = await gateway.charge({
    amountCents: q.subtotalCents,
    card: input.card,
    idempotencyKey: `${input.customerId}-${Date.now()}`,
  });

  const order: Order = {
    id: crypto.randomUUID(),
    customerId: input.customerId,
    amountPaidCents: q.subtotalCents,
    chargeId: result.id,
    status: "paid",
  };
  await orders.save(order);
  return order;
}
