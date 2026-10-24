import { Ledger, LedgerError, type Expense } from "./ledger";

const HEADER = "id,payer,amount,currency,category,description,createdAt";

/** Characters that make a spreadsheet treat a cell as a formula. */
const FORMULA_TRIGGERS = ["=", "+", "-", "@"];

/** A cell safe to open in a spreadsheet: formulas prefixed with ', then quoted if needed. */
export function escapeField(value: string): string {
  let out = value;
  if (FORMULA_TRIGGERS.includes(out.charAt(0))) out = `'${out}`;
  if (/[",\n]/.test(out)) out = `"${out.replace(/"/g, '""')}"`;
  return out;
}

/** Undoes escapeField's formula prefix. */
export function restoreField(value: string): string {
  if (value.startsWith("'") && FORMULA_TRIGGERS.includes(value.charAt(1))) return value.slice(1);
  return value;
}

export function exportCsv(ledger: Ledger): string {
  const rows = ledger.all().map((e) =>
    [e.id, e.payer, String(e.amount), e.currency, e.category ?? "", e.description, e.createdAt].map(escapeField).join(",")
  );
  return [HEADER, ...rows].join("\n");
}

function splitRow(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      cells.push(cell);
      cell = "";
    } else cell += ch;
  }
  cells.push(cell);
  return cells;
}

function parseMinorUnits(raw: string, row: number): number {
  if (!/^\d+$/.test(raw)) throw new LedgerError(`row ${row}: amount must be whole minor units`);
  return Number(raw);
}

/**
 * Adds every row of `text` to the ledger. All-or-nothing: a bad row
 * leaves the ledger as it was. Returns the number of rows added.
 */
export function importCsv(ledger: Ledger, text: string): number {
  const [header, ...lines] = text.trim().split("\n");
  if (header !== HEADER) throw new LedgerError("unexpected CSV header");
  let added = 0;
  lines.forEach((line, i) => {
    const [id, payer, amount, currency, category, description, createdAt] = splitRow(line).map(restoreField);
    const expense: Expense = {
      id,
      payer,
      amount: parseMinorUnits(amount, i + 2),
      currency,
      ...(category ? { category } : {}),
      description,
      createdAt,
    };
    ledger.add(expense);
    added++;
  });
  return added;
}
