export type LineItem = { description: string; unitPriceCents: number; quantity: number };
export type Invoice = {
  id: string;
  number: string;
  orgId: string;
  customerEmail: string | null;
  items: LineItem[];
  discountPercent: number;
  dueDate: string;
  paid: boolean;
};

export type InvoiceStore = {
  lastNumber(orgId: string): Promise<number>;
  saveNumber(orgId: string, n: number): Promise<void>;
  save(invoice: Invoice): Promise<void>;
};

/** INV-<org>-0001, numbered per organization with no gaps. */
export async function nextInvoiceNumber(store: InvoiceStore, orgId: string): Promise<string> {
  const last = await store.lastNumber(orgId);
  const next = last + 1;
  await store.saveNumber(orgId, next);
  return `INV-${orgId}-${String(next).padStart(4, "0")}`;
}

/** Total in cents after the discount, rounded once at the end. */
export function invoiceTotal(invoice: Pick<Invoice, "items" | "discountPercent">): number {
  const subtotal = invoice.items.reduce((sum, item) => sum + Math.round(item.unitPriceCents * item.quantity * 100) / 100, 0);
  return Math.round(subtotal * (1 - invoice.discountPercent / 100));
}

export async function createInvoice(
  store: InvoiceStore,
  input: { orgId: string; customerEmail: string | null; items: LineItem[]; discountPercent?: number; dueDate: string }
): Promise<Invoice> {
  if (input.items.length === 0) throw new Error("an invoice needs at least one item");
  const discount = input.discountPercent ?? 0;
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) throw new Error("discount must be between 0 and 100");
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    number: await nextInvoiceNumber(store, input.orgId),
    orgId: input.orgId,
    customerEmail: input.customerEmail?.toLowerCase() ?? null,
    items: input.items,
    discountPercent: discount,
    dueDate: input.dueDate,
    paid: false,
  };
  await store.save(invoice);
  return invoice;
}

/** An unpaid invoice is overdue from the day after its due date. */
export function isOverdue(invoice: Pick<Invoice, "dueDate" | "paid">, today: string): boolean {
  return !invoice.paid && invoice.dueDate < today;
}
