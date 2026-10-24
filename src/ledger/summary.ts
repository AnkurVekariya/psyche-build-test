import { CURRENCY_PATTERN, LedgerError, type Expense } from "./ledger";

export type SpendingSummary = {
  currency: string;
  total: number;
  byCategory: Record<string, number>;
  byPayer: Record<string, number>;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Spending in one currency between `from` and `to`, both inclusive. */
export function summarize(expenses: readonly Expense[], range: { from: string; to: string; currency: string }): SpendingSummary {
  const { from, to, currency } = range;
  if (!DATE.test(from) || !DATE.test(to) || from > to) throw new LedgerError("bad date range");
  if (!CURRENCY_PATTERN.test(currency)) throw new LedgerError(`unknown currency ${currency}`);

  const out: SpendingSummary = { currency, total: 0, byCategory: {}, byPayer: {} };
  for (const e of expenses) {
    if (e.currency !== currency) continue;
    if (e.createdAt < from || e.createdAt > to) continue;
    const category = e.category ?? "uncategorized";
    out.total += e.amount;
    out.byCategory[category] = (out.byCategory[category] ?? 0) + e.amount;
    out.byPayer[e.payer] = (out.byPayer[e.payer] ?? 0) + e.amount;
  }
  return out;
}
