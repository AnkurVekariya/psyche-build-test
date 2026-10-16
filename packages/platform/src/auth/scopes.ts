import type { ApiKey } from "./apiKeys.js";

/** Scopes look like "usage:read" or "billing:admin". */
export function hasScope(key: ApiKey, required: string): boolean {
  return key.scopes.some((granted) => required.startsWith(granted));
}
