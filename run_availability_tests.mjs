/**
 * T1-T8 acceptance tests for the Smart Campus availability contract.
 *
 * These tests exercise the deterministic booking rules in isolation.
 * No React, no DOM, no test framework — just assertions.
 *
 * Run with:  node run_availability_tests.mjs
 *
 * The logic under test mirrors src/lib/availability.ts. If you change the
 * rules, update both files in lockstep. The canonical source is the .ts file;
 * this file exists so tests run without a TypeScript compiler in the Bolt
 * terminal environment.
 */

const MAX_BOOKING_MINUTES = 120;

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatMinutes(total) {
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/**
 * Pure availability check — mirrors checkAvailability in src/lib/availability.ts.
 * Returns { available, reasonCode, message }.
 */
function checkAvailability({ start, duration, blocked, bookings, now }) {
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
      message: 'Enter a start time and a duration in whole minutes (0-1440).',
    };
  }

  if (start <= now) {
    return {
      available: false,
      reasonCode: 'PAST_START',
      message: `Start time must be later than the current time (${formatMinutes(now)}).`,
    };
  }

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

  if (blocked) {
    return {
      available: false,
      reasonCode: 'ROOM_BLOCKED',
      message: 'This room is blocked for maintenance or an administrative lock.',
    };
  }

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

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
const failures = [];

function assertEqual(actual, expected, label) {
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  if (match) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.log(`  FAIL  ${label}`);
    console.log(`        expected: ${JSON.stringify(expected)}`);
    console.log(`        actual:   ${JSON.stringify(actual)}`);
    failed++;
    failures.push(label);
  }
}

function assertTrue(value, label) {
  assertEqual(value, true, label);
}

function assertFalse(value, label) {
  assertEqual(value, false, label);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ---------------------------------------------------------------------------
// Shared fictional data
// ---------------------------------------------------------------------------

const NOW = 540; // 09:00
const BOOKINGS = [{ start: 600, end: 660 }]; // 10:00-11:00

// ---------------------------------------------------------------------------
// T1: free interval — no overlap, valid duration, not blocked, future start
// ---------------------------------------------------------------------------

function T1_free_interval() {
  const result = checkAvailability({
    start: 660,
    duration: 60,
    blocked: false,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertTrue(result.available, 'T1: available is true');
  assertEqual(result.reasonCode, 'OK', 'T1: reasonCode is OK');
}

// ---------------------------------------------------------------------------
// T2: overlap — requested slot overlaps an existing booking
// ---------------------------------------------------------------------------

function T2_overlap() {
  const result = checkAvailability({
    start: 630,
    duration: 60,
    blocked: false,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertFalse(result.available, 'T2: available is false');
  assertEqual(result.reasonCode, 'OVERLAP', 'T2: reasonCode is OVERLAP');
}

// ---------------------------------------------------------------------------
// T3: blocked room — blocked flag is true, otherwise valid
// ---------------------------------------------------------------------------

function T3_blocked_room() {
  const result = checkAvailability({
    start: 660,
    duration: 60,
    blocked: true,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertFalse(result.available, 'T3: available is false');
  assertEqual(result.reasonCode, 'ROOM_BLOCKED', 'T3: reasonCode is ROOM_BLOCKED');
}

// ---------------------------------------------------------------------------
// T4: duration 0 — must be rejected with DURATION_ZERO
// ---------------------------------------------------------------------------

function T4_duration_zero() {
  const result = checkAvailability({
    start: 660,
    duration: 0,
    blocked: false,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertFalse(result.available, 'T4: available is false');
  assertEqual(result.reasonCode, 'DURATION_ZERO', 'T4: reasonCode is DURATION_ZERO');
}

// ---------------------------------------------------------------------------
// T5: duration 121 — exceeds 120-minute cap, DURATION_TOO_LONG
// ---------------------------------------------------------------------------

function T5_duration_too_long() {
  const result = checkAvailability({
    start: 660,
    duration: 121,
    blocked: false,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertFalse(result.available, 'T5: available is false');
  assertEqual(result.reasonCode, 'DURATION_TOO_LONG', 'T5: reasonCode is DURATION_TOO_LONG');
}

// ---------------------------------------------------------------------------
// T6: past start — start time is not in the future
// ---------------------------------------------------------------------------

function T6_past_start() {
  const result = checkAvailability({
    start: 540,
    duration: 60,
    blocked: false,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertFalse(result.available, 'T6: available is false');
  assertEqual(result.reasonCode, 'PAST_START', 'T6: reasonCode is PAST_START');
}

// ---------------------------------------------------------------------------
// T7: adjacent interval — touching endpoints are allowed (not an overlap)
// ---------------------------------------------------------------------------

function T7_adjacent_interval() {
  const result = checkAvailability({
    start: 660,
    duration: 30,
    blocked: false,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertTrue(result.available, 'T7: available is true (touching endpoints OK)');
  assertEqual(result.reasonCode, 'OK', 'T7: reasonCode is OK');
}

// ---------------------------------------------------------------------------
// T8: bookings unchanged — calling checkAvailability must not mutate inputs
// ---------------------------------------------------------------------------

function T8_bookings_unchanged() {
  const bookingsBefore = deepClone(BOOKINGS);
  checkAvailability({
    start: 660,
    duration: 30,
    blocked: false,
    bookings: BOOKINGS,
    now: NOW,
  });
  assertEqual(BOOKINGS, bookingsBefore, 'T8: bookings array not mutated');
}

// ---------------------------------------------------------------------------
// Run all tests
// ---------------------------------------------------------------------------

const tests = [
  T1_free_interval,
  T2_overlap,
  T3_blocked_room,
  T4_duration_zero,
  T5_duration_too_long,
  T6_past_start,
  T7_adjacent_interval,
  T8_bookings_unchanged,
];

console.log('=== Availability Contract Tests (T1-T8) ===\n');

for (const test of tests) {
  test();
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) {
  console.log(`Failed: ${failures.join(', ')}`);
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED');
  process.exit(0);
}
