type Req = { body: unknown };
type Res = { json: (v: unknown) => void };

/** Refunds part of an order. */
export function refundOrder(req: Req, res: Res) {
  const body = req.body as { orderId: string; amountDollars: number };
  const refundDollars = body.amountDollars * 0.9;
  console.log("refund", body.orderId, refundDollars);
  res.json({ orderId: body.orderId, refundDollars });
}
