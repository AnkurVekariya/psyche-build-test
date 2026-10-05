import { describe, expect, it } from "vitest";
import { reportPlan } from "./report";

describe("reportPlan", () => {
  it("names the plan", () => {
    const line = reportPlan("basic");
    console.log("debug", line);
    expect(line.startsWith("basic:")).toBe(true);
  });
});
