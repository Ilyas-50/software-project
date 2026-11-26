import type { Booking } from '@/lib/rooms';
import { formatMinutes } from '@/lib/time';

export const MAX_BOOKING_MINUTES = 120;

/**
 * Stable reason codes that the presentation layer maps to copy.
 * Deterministic rules never throw and never mutate inputs.
 */
export type ReasonCode =
  | 'OK'
  | 'INVALID_INPUT'
  | 'PAST_START'
  | 'DURATION_ZERO'
  | 'DURATION_TOO_LONG'
  | 'ROOM_BLOCKED'
  | 'OVERLAP';

export type AvailabilityInput = {
  start: number;
  duration: number;
  blocked: boolean;
  bookings: Booking[];
  now: number;
};

export type AvailabilityDecision = {
  available: boolean;
  reasonCode: ReasonCode;
  message: string;
};

const INVALID_INPUT_MESSAGE =
  'Enter a start time and a duration in whole minutes (0-1440).';

/**
 * Pure availability check. AC1-AC6 are evaluated in a fixed order so the
 * first failing rule produces the reason code. Inputs are never mutated.
 */
export function checkAvailability(input: AvailabilityInput): AvailabilityDecision {
  const { start, duration, blocked, bookings, now } = input;

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(duration) ||
    start < 0 ||
    start > 1440 ||
    !Number.isInteger(start) ||
    !Number.isInteger(duration)
  ) {
    return {
      available: false,
      reasonCode: 'INVALID_INPUT',
      message: INVALID_INPUT_MESSAGE,
    };
  }

  // AC1: start time must be in the future (strictly after now).
  if (start <= now) {
    return {
      available: false,
      reasonCode: 'PAST_START',
      message: `Start time must be later than the current time (${formatMinutes(now)}).`,
    };
  }

  // AC2: duration > 0 and <= 120 minutes.
  if (duration <= 0) {
    return {
      available: false,
      reasonCode: 'DURATION_ZERO',
      message: 'Duration must be greater than zero minutes.',
    };
  }

  if (duration > MAX_BOOKING_MINUTES) {
    return {
      available: false,
      reasonCode: 'DURATION_TOO_LONG',
      message: `Duration is ${duration} minutes. The maximum booking length is ${MAX_BOOKING_MINUTES} minutes.`,
    };
  }

  // AC4: a blocked room is unavailable regardless of time.
  if (blocked) {
    return {
      available: false,
      reasonCode: 'ROOM_BLOCKED',
      message: 'This room is blocked for maintenance or an administrative lock.',
    };
  }

  // AC3: overlapping bookings are unavailable. Touching endpoints are allowed.
  const end = start + duration;
  for (const booking of bookings) {
    if (start < booking.end && booking.start < end) {
      return {
        available: false,
        reasonCode: 'OVERLAP',
        message: `It overlaps an existing booking from ${formatMinutes(booking.start)} to ${formatMinutes(booking.end)}. Back-to-back times are allowed.`,
      };
    }
  }

  return { available: true, reasonCode: 'OK', message: 'Available' };
}
