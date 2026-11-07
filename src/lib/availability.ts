import type { Room } from '@/lib/rooms';
import { MAX_BOOKING_MINUTES, formatMinutes } from '@/lib/time';

export type AvailabilityResult =
  | { available: true }
  | { available: false; reasons: string[] };

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  now: number
): AvailabilityResult {
  const reasons: string[] = [];

  if (end <= start) {
    reasons.push('End time must be later than the start time.');
  }
  if (start <= now) {
    reasons.push(
      `Start time must be later than the current time (${formatMinutes(now)}).`
    );
  }
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push(
      `The booking is ${end - start} minutes long. The maximum is ${MAX_BOOKING_MINUTES} minutes.`
    );
  }
  if (room.blocked) {
    reasons.push('This room is blocked for maintenance or an administrative lock.');
  }
  if (end > start) {
    const clash = room.bookings.find((b) => start < b.end && b.start < end);
    if (clash) {
      reasons.push(
        `It overlaps an existing booking from ${formatMinutes(clash.start)} to ${formatMinutes(clash.end)}. Back-to-back times are allowed.`
      );
    }
  }

  return reasons.length === 0 ? { available: true } : { available: false, reasons };
}
