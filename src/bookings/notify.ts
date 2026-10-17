/** Emails each new booking's requester a confirmation; returns how many were sent. */
export async function sendConfirmations(
  bookings: { id: string; requesterEmail: string | null }[],
  send: (to: string, bookingId: string) => Promise<void>
): Promise<number> {
  let sent = 0;
  for (const b of bookings) {
    if (!b.requesterEmail) continue;
    send(b.requesterEmail, b.id);
    sent++;
  }
  return sent;
}
