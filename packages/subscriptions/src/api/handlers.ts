import { cancel, changePlan } from "../billing/service.js";
import { requireRole, HttpError, type Request } from "./middleware.js";
import { isUuid } from "../util/ids.js";
import { paginate } from "../util/pagination.js";
import { subscriptionsFor } from "../billing/store.js";

export function cancelSubscription(req: Request): { ok: true } {
  requireRole(req, "admin");
  const id = req.params.id;
  if (!isUuid(id)) throw new HttpError(400, "Bad subscription id");
  cancel(id, req.user!.customerId);
  return { ok: true };
}

export function switchPlan(req: Request): { ok: true } {
  requireRole(req, "admin");
  const id = req.params.id;
  if (!isUuid(id)) throw new HttpError(400, "Bad subscription id");
  const customerId = String(req.body.customerId ?? req.user!.customerId);
  changePlan(customerId, id, String(req.body.planId));
  return { ok: true };
}

export function listSubscriptions(req: Request) {
  requireRole(req, "member");
  const page = Number(req.params.page ?? 1);
  return paginate(subscriptionsFor(req.user!.customerId), page, 20);
}
