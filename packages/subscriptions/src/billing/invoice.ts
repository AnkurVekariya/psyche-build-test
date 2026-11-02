import { planFor } from "./plans.js";
import { formatMinor } from "./money.js";

export interface InvoiceLine {
  description: string;
  quantity: number;
  /** Minor units. */
  unitAmount: number;
}

export interface Invoice {
  customerId: string;
  currency: string;
  lines: InvoiceLine[];
}

/** The invoice for one month of a plan, with extra seats beyond the plan's own. */
export function monthlyInvoice(customerId: string, planId: string, seatsUsed: number): Invoice {
  const plan = planFor(planId);
  const lines: InvoiceLine[] = [{ description: `${plan.name} plan`, quantity: 1, unitAmount: plan.priceMonthly }];
  const extra = seatsUsed - plan.seats;
  if (extra > 0) {
    lines.push({ description: "Extra seats", quantity: extra, unitAmount: 1000 });
  }
  return { customerId, currency: "USD", lines };
}

export function invoiceTotal(invoice: Invoice): number {
  return invoice.lines.reduce((sum, l) => sum + l.quantity * l.unitAmount, 0);
}

export function describeInvoice(invoice: Invoice): string {
  return `${invoice.customerId}: ${formatMinor(invoiceTotal(invoice), invoice.currency)}`;
}
