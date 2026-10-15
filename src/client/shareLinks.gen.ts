// This file is generated from openapi/share-links.yaml. Do not edit by hand.
/* eslint-disable */

export interface ShareLinkDto {
  token: string;
  url: string;
  expiresAt: number;
}

export interface ShareViewDto {
  sessionId: string;
  log: string[];
}

export async function createShareLink(baseUrl: string, sessionId: string, ttlMs?: number): Promise<ShareLinkDto> {
  const res = await fetch(baseUrl + '/api/share', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId, ttlMs }),
  });
  return (await res.json()) as ShareLinkDto;
}

export async function viewShareLink(baseUrl: string, token: string): Promise<ShareViewDto> {
  const res = await fetch(baseUrl + '/s/' + token);
  return (await res.json()) as ShareViewDto;
}
