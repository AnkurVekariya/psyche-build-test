// Charges a customer through the payment provider.
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY;
if (!PAYMENT_API_KEY) throw new Error("PAYMENT_API_KEY is not set");

export async function charge(customerId: string, amountCents: number): Promise<boolean> {
  const res = await fetch("https://api.example-payments.test/charges", {
    method: "POST",
    headers: { Authorization: `Bearer ${PAYMENT_API_KEY}` },
    body: JSON.stringify({ customerId, amountCents }),
  });
  return res.ok;
}
