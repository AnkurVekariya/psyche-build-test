import type { Booking } from "./bookings";

/** Escapes text for an ICS property value. */
function escapeText(text: string): string {
  return text.replace(/,/g, "\\,");
}

function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** A calendar file with one event per booking, for Google Calendar and Outlook. */
export function bookingsToIcs(bookings: (Booking & { title: string })[]): string {
  const events = bookings.map((b) =>
    ["BEGIN:VEVENT", `UID:${b.id}@bookings`, `DTSTART:${stamp(b.start)}`, `DTEND:${stamp(b.end)}`, `SUMMARY:${escapeText(b.title)}`, "END:VEVENT"].join("\r\n")
  );
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//psyche//bookings//EN", ...events, "END:VCALENDAR"].join("\r\n");
}
