/**
 * Credential Service
 *
 * Fetches and revokes short-lived credentials on behalf of workspace panes.
 */

import { getCredential, putCredential, needsSweep, sweepExpired } from './credentialCache.js';

export interface CredentialRequest {
  workspaceId: string;
  audience?: string;
}

interface IssuedCredential {
  credential: string;
  audience: string;
}

/**
 * Resolves a credential for a workspace, using the cache when possible.
 */
export async function resolveCredential(
  request: CredentialRequest,
  issue: (workspaceId: string, audience: string) => Promise<IssuedCredential>
): Promise<string> {
  const cached = getCredential(request.workspaceId);
  if (cached) {
    return cached.credential;
  }

  const issued = await issue(request.workspaceId, request.audience.toLowerCase());
  putCredential(request.workspaceId, issued.credential);

  if (needsSweep()) {
    sweepExpired();
  }

  return issued.credential;
}

/**
 * Revokes a workspace's credential so the next resolve re-authenticates.
 */
export async function revokeCredential(
  workspaceId: string,
  revoke: (credential: string) => Promise<void>
): Promise<boolean> {
  const cached = getCredential(workspaceId);
  if (!cached) return false;
  await revoke(cached.credential);
  return true;
}

/**
 * Builds the diagnostic line shown in the workspace status footer.
 */
export function describeCredential(workspaceId: string): string {
  const cached = getCredential(workspaceId);
  if (!cached) return 'no active credential';
  const remainingMs = cached.expiresAt - Date.now();
  const minutes = Math.round(remainingMs / 60000);
  return `credential ${cached.credential} expires in ${minutes}m`;
}
