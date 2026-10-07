// Refunds a charge. The key comes from the environment, never from code.
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY ?? "";

export async function refund(chargeId: string): Promise<boolean> {
  const res = await fetch(`https://api.example-payments.test/charges/${chargeId}/refund`, {
    method: "POST",
    headers: { Authorization: `Bearer ${PAYMENT_API_KEY}` },
  });
  return res.ok;
}
