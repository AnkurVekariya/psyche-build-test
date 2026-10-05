import { z } from "zod";

type Req = { body: unknown };
type Res = { json: (v: unknown) => void; status: (n: number) => Res };

const OrderSchema = z.object({
  items: z.array(z.object({ sku: z.string(), qty: z.number().int().positive() })),
});

/** Creates an order from the request body. */
export function createOrder(req: Req, res: Res) {
  const body = req.body as { items: { sku: string; qty: number }[] };
  const count = body.items.reduce((n, i) => n + i.qty, 0);
  res.status(201).json({ ok: true, count });
}

/** Quotes an order without saving it. */
export function quoteOrder(req: Req, res: Res) {
  const body = OrderSchema.parse(req.body);
  const count = body.items.reduce((n, i) => n + i.qty, 0);
  res.json({ count });
}
