import { verifyKey, createKey, deleteKey, keysFor } from "../auth/apiKeys.js";
import { hasScope } from "../auth/scopes.js";
import { overLimit, type Request } from "./rateLimit.js";
import { recordUsage } from "../metering/usage.js";
import { pluralize } from "../util/format.js";

export interface ApiRequest extends Request {
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

function authenticate(req: ApiRequest) {
  if (overLimit(req, 100)) throw new HttpError(429, "Too many requests");
  const key = verifyKey(req.headers.authorization?.replace(/^Bearer /, "") ?? "");
  if (!key) throw new HttpError(401, "Invalid API key");
  recordUsage(key.workspaceId, 1);
  return key;
}

export function listKeys(req: ApiRequest) {
  const key = authenticate(req);
  if (!hasScope(key, "keys:read")) throw new HttpError(403, "Missing scope keys:read");
  const all = keysFor(key.workspaceId);
  return { keys: all.map((k) => ({ id: k.id, prefix: k.prefix })), summary: `${all.length} ${pluralize(all.length, "key")}` };
}

export function newKey(req: ApiRequest) {
  const key = authenticate(req);
  if (!hasScope(key, "keys:write")) throw new HttpError(403, "Missing scope keys:write");
  const scopes = Array.isArray(req.body.scopes) ? req.body.scopes.map(String) : [];
  const { secret } = createKey(key.workspaceId, scopes);
  return { secret };
}

export function removeKey(req: ApiRequest) {
  const key = authenticate(req);
  if (!hasScope(key, "keys:write")) throw new HttpError(403, "Missing scope keys:write");
  if (!deleteKey(req.params.id)) throw new HttpError(404, "No such key");
  return { ok: true };
}
