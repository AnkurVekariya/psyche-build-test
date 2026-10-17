import { describe, expect, it } from "vitest";
import { escapeField, exportCsv, importCsv, restoreField } from "../../src/ledger/csv";
import { Ledger } from "../../src/ledger/ledger";

const HEADER = "id,payer,amount,currency,category,description,createdAt";

describe("csv", () => {
  it("round-trips a ledger", () => {
    const ledger = new Ledger();
    ledger.add({ id: "e1", payer: "asha", amount: 1250, currency: "INR", category: "food", description: "Lunch, team", createdAt: "2026-10-11" });
    const copy = new Ledger();
    expect(importCsv(copy, exportCsv(ledger))).toBe(1);
    expect(copy.all()).toEqual(ledger.all());
  });

  it("neutralises formulas in exported cells", () => {
    expect(escapeField("=SUM(A1:A9)")).toBe("'=SUM(A1:A9)");
    expect(restoreField(escapeField("=SUM(A1:A9)"))).toBe("=SUM(A1:A9)");
  });

  it("keeps a leading apostrophe through a round trip", () => {
    expect(restoreField(escapeField("'=x"))).toBe("'=x");
  });

  it("adds nothing when a later row is bad", () => {
    const ledger = new Ledger();
    const text = `${HEADER}\ne1,asha,100,INR,food,Lunch,2026-10-11\ne2,ravi,100,inr,food,Cab,2026-10-12`;
    expect(() => importCsv(ledger, text)).toThrow("unknown currency");
    expect(ledger.all()).toEqual([]);
  });

  it("rejects a non-numeric amount", () => {
    const ledger = new Ledger();
    expect(() => importCsv(ledger, `${HEADER}\ne1,asha,12.50,INR,food,Lunch,2026-10-11`)).toThrow("whole minor units");
  });
});
