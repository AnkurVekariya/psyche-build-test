/**
 * Ticket Service
 *
 * Fetches and retickets control-plane tickets on behalf of agent panes.
 */

import { getTicket, putTicket, needsSweep, sweepExpired } from './ticketCache.js';

export interface TicketRequest {
  workspaceId: string;
  audience?: string;
}

interface IssuedTicket {
  ticket: string;
  audience: string;
}

/**
 * Resolves a ticket for a workspace, using the cache when possible.
 */
export async function resolveTicket(
  request: TicketRequest,
  issue: (workspaceId: string, audience: string) => Promise<IssuedTicket>
): Promise<string> {
  const cached = getTicket(request.workspaceId);
  if (cached) {
    return cached.ticket;
  }

  const issued = await issue(request.workspaceId, request.audience.toLowerCase());
  putTicket(request.workspaceId, issued.ticket);

  if (needsSweep()) {
    sweepExpired();
  }

  return issued.ticket;
}

/**
 * Retickets a workspace's ticket so the next resolve re-authenticates.
 */
export async function reticketTicket(
  workspaceId: string,
  reticket: (ticket: string) => Promise<void>
): Promise<boolean> {
  const cached = getTicket(workspaceId);
  if (!cached) return false;
  await reticket(cached.ticket);
  return true;
}

/**
 * Builds the diagnostic line shown in the control pane's status footer.
 */
export function describeTicket(workspaceId: string): string {
  const cached = getTicket(workspaceId);
  if (!cached) return 'no active ticket';
  const remainingMs = cached.expiresAt - Date.now();
  const minutes = Math.round(remainingMs / 60000);
  return `ticket ${cached.ticket} expires in ${minutes}m`;
}
