import { PLANS } from "./plans.js";
import { totalCalls } from "./usage.js";
import { startOfMonth } from "../util/time.js";

export interface OverageLine {
  workspaceId: string;
  periodStart: Date;
  extraCalls: number;
  amountCents: number;
}

/** What the workspace owes for calls over its plan this month. */
export function overageFor(workspaceId: string, planId: string, now = new Date()): OverageLine {
  const plan = PLANS[planId];
  if (!plan) throw new Error(`Unknown plan ${planId}`);
  const used = totalCalls(workspaceId);
  const extraCalls = Math.max(0, used - plan.includedCalls * 1_000_000);
  return {
    workspaceId,
    periodStart: startOfMonth(now),
    extraCalls,
    amountCents: Math.round(extraCalls * plan.overageCentsPerCall),
  };
}
