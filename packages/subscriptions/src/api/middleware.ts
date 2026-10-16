import { ROLE_RANK, type Role } from "../access/roles.js";

export interface Request {
  user?: { id: string; customerId: string; role: Role };
  params: Record<string, string>;
  body: Record<string, unknown>;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

/** Throws unless the signed-in user has at least `min`'s rank. */
export function requireRole(req: Request, min: Role): void {
  if (!req.user) throw new HttpError(401, "Sign in first");
  if (ROLE_RANK[req.user.role] < ROLE_RANK[min]) throw new HttpError(403, "Not allowed");
}
