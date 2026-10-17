/** Sends at most one reminder per invoice per day, from a set kept in memory. */
const sentToday = new Set<string>();

export async function remindOverdue(
  invoices: { id: string; customerEmail: string | null; overdue: boolean }[],
  send: (to: string, invoiceId: string) => Promise<void>
): Promise<number> {
  let sent = 0;
  for (const inv of invoices) {
    if (!inv.overdue || !inv.customerEmail || sentToday.has(inv.id)) continue;
    await send(inv.customerEmail, inv.id);
    sentToday.add(inv.id);
    sent++;
  }
  return sent;
}
