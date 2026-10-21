type Req = { body: unknown };
type Res = { json: (v: unknown) => void };

/** Pays a seller their share of a sale. */
export function payoutSeller(req: Req, res: Res) {
  const body = req.body as { sellerId: string; saleDollars: number };
  const payoutDollars = body.saleDollars * 0.85;
  console.log("payout", body.sellerId, payoutDollars);
  res.json({ sellerId: body.sellerId, payoutDollars });
}
