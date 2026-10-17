/** A shared-expense ledger: who paid what, in which currency and category. */

export const CATEGORY_PATTERN = /^[a-z][a-z-]{0,30}$/;
export const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export class LedgerError extends Error {}

export type Expense = {
  id: string;
  payer: string;
  /** Whole minor units (cents, paise). */
  amount: number;
  currency: string;
  category?: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  createdAt: string;
};

export class Ledger {
  private readonly expenses: Expense[] = [];

  add(expense: Expense): void {
    if (!Number.isSafeInteger(expense.amount) || expense.amount <= 0) {
      throw new LedgerError(`expense ${expense.id}: amount must be a positive whole number of minor units`);
    }
    if (!CURRENCY_PATTERN.test(expense.currency)) {
      throw new LedgerError(`expense ${expense.id}: unknown currency ${expense.currency}`);
    }
    if (expense.category !== undefined && !CATEGORY_PATTERN.test(expense.category)) {
      throw new LedgerError(`expense ${expense.id}: bad category ${expense.category}`);
    }
    this.expenses.push(expense);
  }

  all(): readonly Expense[] {
    return this.expenses;
  }
}
