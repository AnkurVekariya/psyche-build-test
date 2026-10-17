import { invoiceTotal, type Invoice } from "./invoices";

const HEADER = "number,customer,total,due,paid";

/** Invoices as CSV for the finance team's spreadsheet. */
export function exportInvoicesCsv(invoices: Invoice[]): string {
  const rows = invoices.map((inv) =>
    [inv.number, inv.customerEmail ?? "", (invoiceTotal(inv) / 100).toFixed(2), inv.dueDate, inv.paid ? "yes" : "no"]
      .map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell))
      .join(",")
  );
  return [HEADER, ...rows].join("\n");
}

/** Updates the customer email on an invoice that has not been paid. */
export function updateCustomerEmail(invoice: Invoice, email: string | null): Invoice {
  if (invoice.paid) throw new Error("paid invoices cannot be changed");
  return { ...invoice, customerEmail: email?.toLowerCase() ?? null };
}
