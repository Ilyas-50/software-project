# Smart Campus Room Availability Checker

A React + TypeScript web app implementing the Smart Campus availability contract with six acceptance criteria (AC1-AC6), dynamic room filtering (F1-F5), and an end-to-end booking check flow.

## Architecture

Deterministic booking rules are fully separated from presentation:

- **`src/lib/availability.ts`** — Pure availability engine. Takes `start`, `duration`, `blocked`, `bookings`, and `now`. Returns `{ available, reasonCode, message }`. Never mutates inputs. Never throws.
- **`src/lib/filtering.ts`** — Pure room filtering (capacity, equipment, blocked exclusion).
- **`src/lib/rooms.ts`** — Fictional room catalog (4 rooms, all data is invented).
- **`src/lib/time.ts`** — Time formatting and input parsing helpers.
- **`src/components/`** — React presentation layer (catalog, filters, checker, status banner).
- **`run_availability_tests.mjs`** — T1-T8 contract tests (no framework, runs with `node`).

## Acceptance Criteria

| AC | Rule | Reason code on failure |
|----|------|----------------------|
| AC1 | Start time must be in the future | `PAST_START` |
| AC2 | Duration > 0 and <= 120 minutes | `DURATION_ZERO` / `DURATION_TOO_LONG` |
| AC3 | Overlapping bookings are unavailable | `OVERLAP` |
| AC4 | Blocked room is unavailable | `ROOM_BLOCKED` |
| AC5 | Clear decision without mutating bookings | `OK` / no mutation |
| AC6 | Invalid input gets understandable feedback | `INVALID_INPUT` |

## Running Tests

### Availability contract tests (T1-T8)

```bash
node run_availability_tests.mjs
```

| Test | Scenario | Expected |
|------|----------|----------|
| T1 | Free interval, valid duration | Available, `OK` |
| T2 | Overlaps existing booking | Unavailable, `OVERLAP` |
| T3 | Blocked room | Unavailable, `ROOM_BLOCKED` |
| T4 | Duration = 0 | Unavailable, `DURATION_ZERO` |
| T5 | Duration = 121 | Unavailable, `DURATION_TOO_LONG` |
| T6 | Start in the past | Unavailable, `PAST_START` |
| T7 | Adjacent (touching) interval | Available, `OK` |
| T8 | Bookings array unchanged after check | No mutation |

### Python tests (AC1-AC5, F1-F5)

```bash
python3 run_tests_standalone.py
```

### TypeScript type-check and build

```bash
npm run typecheck
npm run build
```

## Limitations

1. **Duplicate logic in tests.** `run_availability_tests.mjs` mirrors `src/lib/availability.ts` by hand because no TypeScript test runner (Vitest, tsx) is installed. If you change the rules, update both files. The `.ts` file is the canonical source.
2. **Single current time.** "Now" is a fixed constant (09:00). There is no live clock. All time comparisons use this constant.
3. **Fictional data only.** Room names, capacities, equipment, and bookings are invented. No real database or API is used.
4. **One reason per check.** The engine returns the first failing reason code, not all failures. This matches the Python `check_availability` contract but differs from the earlier multi-reason UI.
5. **No persistence.** Bookings are in-memory only. Reloading the page resets all state.
6. **AC6 scope.** `INVALID_INPUT` covers non-integer, out-of-range, or non-finite inputs. The UI additionally validates raw text before calling the engine.
