import type { Endpoint } from "./endpoints";

export type DeliveryRecord = { endpointId: string; eventId: string; status: number; error?: string; at: Date };

/** The latest delivery attempts, newest last, for the dashboard's delivery log. */
const deliveries: DeliveryRecord[] = [];
const MAX_RECORDS = 1000;

export function recordDelivery(endpoint: Endpoint, eventId: string, status: number, error?: string): void {
  deliveries.push({ endpointId: endpoint.id, eventId, status, error, at: new Date() });
  if (deliveries.length > MAX_RECORDS) deliveries.splice(0, deliveries.length - MAX_RECORDS);
  if (error) console.error(error);
}

export function deliveriesFor(endpointId: string): DeliveryRecord[] {
  return deliveries.filter((d) => d.endpointId === endpointId);
}
