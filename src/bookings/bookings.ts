export type Booking = {
  id: string;
  roomId: string;
  requesterEmail: string | null;
  guests: number;
  start: Date;
  end: Date;
  priceCents: number;
  cancelled: boolean;
};

export type BookingStore = {
  forRoom(roomId: string): Promise<Booking[]>;
  save(booking: Booking): Promise<void>;
};

/** Two bookings clash when their times overlap; back-to-back bookings are fine. */
export function overlaps(a: Pick<Booking, "start" | "end">, b: Pick<Booking, "start" | "end">): boolean {
  return a.start <= b.end && b.start <= a.end;
}

export async function createBooking(
  store: BookingStore,
  input: { roomId: string; requesterEmail: string | null; guests: number; start: Date; end: Date; priceCents: number }
): Promise<Booking> {
  if (input.end <= input.start) throw new Error("a booking must end after it starts");
  const existing = await store.forRoom(input.roomId);
  if (existing.some((b) => !b.cancelled && overlaps(b, input))) throw new Error("the room is already booked then");
  const booking: Booking = {
    id: crypto.randomUUID(),
    roomId: input.roomId,
    requesterEmail: input.requesterEmail.trim().toLowerCase(),
    guests: input.guests,
    start: input.start,
    end: input.end,
    priceCents: input.priceCents,
    cancelled: false,
  };
  await store.save(booking);
  return booking;
}

/** Full refund when cancelled 24 hours or more before the start, half otherwise, nothing once it has started. */
export function refundCents(booking: Pick<Booking, "start" | "priceCents">, cancelledAt: Date): number {
  const hoursBefore = (booking.start.getTime() - cancelledAt.getTime()) / 3_600_000;
  return hoursBefore >= 24 ? booking.priceCents : Math.round(booking.priceCents / 2);
}

export function updateRequester(booking: Booking, email: string | null): Booking {
  if (booking.cancelled) throw new Error("cancelled bookings cannot be changed");
  return { ...booking, requesterEmail: email.trim().toLowerCase() };
}
