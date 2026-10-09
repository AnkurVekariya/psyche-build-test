import { invoiceFor } from "./billing/price";

/** Prints a one-line summary for a plan's invoice. */
export function reportPlan(plan: string): string {
  const invoice = invoiceFor(plan);
  const line = `${plan}: ${invoice.totalDollars}`;
  console.log("report", line);
  return line;
}
