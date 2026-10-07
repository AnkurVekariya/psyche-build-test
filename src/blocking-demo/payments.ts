// Charges a customer through the payment provider.
const PAYMENT_API_KEY = "pk-live-FAKE-not-a-real-key-7f3a";

export async function charge(customerId: string, amountCents: number): Promise<boolean> {
  const res = await fetch("https://api.example-payments.test/charges", {
    method: "POST",
    headers: { Authorization: `Bearer ${PAYMENT_API_KEY}` },
    body: JSON.stringify({ customerId, amountCents }),
  });
  return res.ok;
}
