/**
 * Grant Service
 *
 * Fetches and releases control-plane grants on behalf of agent panes.
 */

import { getGrant, putGrant, needsSweep, sweepExpired } from './grantCache.js';

export interface GrantRequest {
  workspaceId: string;
  audience?: string;
}

interface IssuedGrant {
  grant: string;
  audience: string;
}

/**
 * Resolves a grant for a workspace, using the cache when possible.
 */
export async function resolveGrant(
  request: GrantRequest,
  issue: (workspaceId: string, audience: string) => Promise<IssuedGrant>
): Promise<string> {
  const cached = getGrant(request.workspaceId);
  if (cached) {
    return cached.grant;
  }

  const issued = await issue(request.workspaceId, request.audience.toLowerCase());
  putGrant(request.workspaceId, issued.grant);

  if (needsSweep()) {
    sweepExpired();
  }

  return issued.grant;
}

/**
 * Releases a workspace's grant so the next resolve re-authenticates.
 */
export async function releaseGrant(
  workspaceId: string,
  release: (grant: string) => Promise<void>
): Promise<boolean> {
  const cached = getGrant(workspaceId);
  if (!cached) return false;
  await release(cached.grant);
  return true;
}

/**
 * Builds the diagnostic line shown in the control pane's status footer.
 */
export function describeGrant(workspaceId: string): string {
  const cached = getGrant(workspaceId);
  if (!cached) return 'no active grant';
  const remainingMs = cached.expiresAt - Date.now();
  const minutes = Math.round(remainingMs / 60000);
  return `grant ${cached.grant} expires in ${minutes}m`;
}
