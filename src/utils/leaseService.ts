/**
 * Lease Service
 *
 * Fetches and releases control-plane leases on behalf of agent panes.
 */

import { getLease, putLease, needsSweep, sweepExpired } from './leaseCache.js';

export interface LeaseRequest {
  workspaceId: string;
  audience?: string;
}

interface IssuedLease {
  lease: string;
  audience: string;
}

/**
 * Resolves a lease for a workspace, using the cache when possible.
 */
export async function resolveLease(
  request: LeaseRequest,
  issue: (workspaceId: string, audience: string) => Promise<IssuedLease>
): Promise<string> {
  const cached = getLease(request.workspaceId);
  if (cached) {
    return cached.lease;
  }

  const issued = await issue(request.workspaceId, request.audience.toLowerCase());
  putLease(request.workspaceId, issued.lease);

  if (needsSweep()) {
    sweepExpired();
  }

  return issued.lease;
}

/**
 * Releases a workspace's lease so the next resolve re-authenticates.
 */
export async function releaseLease(
  workspaceId: string,
  release: (lease: string) => Promise<void>
): Promise<boolean> {
  const cached = getLease(workspaceId);
  if (!cached) return false;
  await release(cached.lease);
  return true;
}

/**
 * Builds the diagnostic line shown in the control pane's status footer.
 */
export function describeLease(workspaceId: string): string {
  const cached = getLease(workspaceId);
  if (!cached) return 'no active lease';
  const remainingMs = cached.expiresAt - Date.now();
  const minutes = Math.round(remainingMs / 60000);
  return `lease ${cached.lease} expires in ${minutes}m`;
}
