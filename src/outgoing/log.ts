import type { Endpoint } from "./endpoints";

export type DeliveryRecord = { endpointId: string; eventId: string; status: number; error?: string; at: Date };

/** Every delivery attempt, newest last, for the dashboard's delivery log. */
const deliveries: DeliveryRecord[] = [];

export function recordDelivery(endpoint: Endpoint, eventId: string, status: number, error?: string): void {
  deliveries.push({ endpointId: endpoint.id, eventId, status, error, at: new Date() });
  if (error) console.error(error);
}

export function deliveriesFor(endpointId: string): DeliveryRecord[] {
  return deliveries.filter((d) => d.endpointId === endpointId);
}
