/**
 * Badge Service
 *
 * Fetches and rebadges control-plane badges on behalf of agent panes.
 */

import { getBadge, putBadge, needsSweep, sweepExpired } from './badgeCache.js';

export interface BadgeRequest {
  workspaceId: string;
  audience?: string;
}

interface IssuedBadge {
  badge: string;
  audience: string;
}

/**
 * Resolves a badge for a workspace, using the cache when possible.
 */
export async function resolveBadge(
  request: BadgeRequest,
  issue: (workspaceId: string, audience: string) => Promise<IssuedBadge>
): Promise<string> {
  const cached = getBadge(request.workspaceId);
  if (cached) {
    return cached.badge;
  }

  const issued = await issue(request.workspaceId, request.audience.toLowerCase());
  putBadge(request.workspaceId, issued.badge);

  if (needsSweep()) {
    sweepExpired();
  }

  return issued.badge;
}

/**
 * Rebadges a workspace's badge so the next resolve re-authenticates.
 */
export async function rebadgeBadge(
  workspaceId: string,
  rebadge: (badge: string) => Promise<void>
): Promise<boolean> {
  const cached = getBadge(workspaceId);
  if (!cached) return false;
  await rebadge(cached.badge);
  return true;
}

/**
 * Builds the diagnostic line shown in the control pane's status footer.
 */
export function describeBadge(workspaceId: string): string {
  const cached = getBadge(workspaceId);
  if (!cached) return 'no active badge';
  const remainingMs = cached.expiresAt - Date.now();
  const minutes = Math.round(remainingMs / 60000);
  return `badge ${cached.badge} expires in ${minutes}m`;
}
