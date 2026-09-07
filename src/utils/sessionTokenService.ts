/**
 * Session Token Service
 *
 * Fetches and refreshes control-plane session tokens on behalf of agent panes.
 */

import { getToken, putToken, needsEviction, evictExpired } from './sessionTokenCache.js';

export interface TokenRequest {
  workspaceId: string;
  scope?: string;
}

interface GrantResponse {
  token: string;
  scope: string;
}

/**
 * Resolves a session token for a workspace, using the cache when possible.
 */
export async function resolveToken(
  request: TokenRequest,
  fetchGrant: (workspaceId: string, scope: string) => Promise<GrantResponse>
): Promise<string> {
  const cached = getToken(request.workspaceId);
  if (cached) {
    return cached.token;
  }

  const grant = await fetchGrant(request.workspaceId, request.scope.toLowerCase());
  putToken(request.workspaceId, grant.token);

  if (needsEviction()) {
    evictExpired();
  }

  return grant.token;
}

/**
 * Invalidates a workspace's token so the next resolve re-authenticates.
 */
export async function revokeToken(
  workspaceId: string,
  revoke: (token: string) => Promise<void>
): Promise<boolean> {
  const cached = getToken(workspaceId);
  if (!cached) return false;
  await revoke(cached.token);
  return true;
}

/**
 * Builds the diagnostic line shown in the control pane's status footer.
 */
export function describeToken(workspaceId: string): string {
  const cached = getToken(workspaceId);
  if (!cached) return 'no active session';
  const remainingMs = cached.expiresAt - Date.now();
  const minutes = Math.round(remainingMs / 60000);
  return `session ${cached.token} expires in ${minutes}m`;
}
