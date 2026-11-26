# AI-Driven Software Engineering — Practice #12: Code-based vs Low-code

**Student:** Ильяс Елубаев · **ID:** `<ID>` · **Class:** `<day of week, time>`
**Date:** 26.11.2026

| | Code-based | Low-code |
|---|---|---|
| Platform / AI tool | **Bolt.new** (Standard mode, free plan; Bolt does not show the model name in the UI) | **Appsmith Cloud** (free plan) |
| Live demo | https://campus-room-availabi-qjtw.bolt.host (Version 10, published 26.11.2026) | https://app.appsmith.com/app/my-first-application/page1-6b07fd2ca11da8c85e01aa2d (made **public** 26.11.2026, `42_…`) |
| Source | https://github.com/Ilyas-50/software-project (synced from Bolt, branch `main`) | [low-code-appsmith/Rules.js](low-code-appsmith/Rules.js), [widget-bindings.md](low-code-appsmith/widget-bindings.md) |
| Helper AI agent | Claude Code (Opus 5.5) controlled the browser: sent prompts, ran tests, took screenshots | the same agent wrote the JSObject and bindings |

---

## 1. Shared requirements sheet (identical for both solutions)

**User story.** As a student, I want to check whether a fictional campus room is free for a chosen future start time and duration, so that I get a clear Available/Unavailable decision with a reason, without changing any existing bookings.

**Acceptance criteria**
| AC | Rule | Reason code |
|---|---|---|
| AC1 | Start time must be in the future (now = 09:00, fixed) | `PAST_START` |
| AC2 | 0 < duration ≤ 120 minutes | `DURATION_ZERO` / `DURATION_TOO_LONG` |
| AC3 | Overlapping bookings are unavailable (touching endpoints are allowed) | `OVERLAP` |
| AC4 | A blocked room is unavailable | `ROOM_BLOCKED` |
| AC5 | A clear decision is shown and existing bookings are not changed | `OK` |
| AC6 | Invalid input gets understandable feedback | `INVALID_INPUT` |

**Contract.** Inputs: start time, duration (minutes), blocked flag (per room), fictional bookings. Outputs: `available` (boolean), `reasonCode`, `message` (visible text).

**Fictional data (the same in both solutions)**
| Room | Blocked | Existing booking |
|---|---|---|
| 401 — AI Research Lab | no | 09:00–10:00 |
| 402 — Conference Hall | no | 10:00–11:00 |
| 403 — Study Pod | no | 11:40–12:40 |
| 404 — Server Maintenance Hub | **yes** | — |

No real personal data, login, payment or production database.

---

## 2. Eight-case test table (expected vs observed)

Inputs (room 402 unless stated): T1 12:00/60 · T2 10:30/30 · T3 room 404 · T4 12:00/0 · T5 12:00/121 · T6 08:00/30 · T7 11:00/30 · T8 compare bookings before and after.

| # | Expected | Code-based (Bolt): observed | Low-code (Appsmith): observed |
|---|---|---|---|
| T1 | Available | ✅ AVAILABLE "free 12:00–13:00" (`13_…`) | ✅ AVAILABLE / OK (`33_…`) |
| T2 | Unavailable | ✅ UNAVAILABLE / OVERLAP (`14_…`) | ✅ UNAVAILABLE / OVERLAP (`34_…`) |
| T3 | Unavailable | ✅ Room 404 "Blocked rooms cannot be booked"; ROOM_BLOCKED in the unit test (`15_…`) | ✅ UNAVAILABLE / ROOM_BLOCKED (`35_…`) |
| T4 | Validation error | ✅ field error "Enter a whole number of minutes (1-1440)"; DURATION_ZERO in the unit test (`16_…`) | ✅ UNAVAILABLE / DURATION_ZERO (`36_…`) |
| T5 | Validation error | ✅ UNAVAILABLE / DURATION_TOO_LONG (`17_…`) | ✅ UNAVAILABLE / DURATION_TOO_LONG (`37_…`) |
| T6 | Validation error | ✅ UNAVAILABLE / PAST_START (`18_…`) | ✅ UNAVAILABLE / PAST_START (`38_…`) |
| T7 | Available | ✅ AVAILABLE 11:00–11:30 (`19_…`) | ✅ AVAILABLE / OK (`39_…`) |
| T8 | Bookings unchanged | ✅ 402 still 10:00–11:00 (`20_…`) | ✅ table unchanged after all checks (`35_…`) |
| **Total** | | **8 / 8** | **8 / 8** |

Automated runs:
- Code-based: `node run_availability_tests.mjs` → **15 passed, 0 failed** ([test-results/test_output_code_based.txt](test-results/test_output_code_based.txt), `09_…`, `10_…`). The command was run by hand in the Bolt terminal, not copied from the AI's answer.
- Low-code: `Rules.runTests()` in Appsmith → **8/8 PASS** ([test-results/test_output_low_code.txt](test-results/test_output_low_code.txt), `31_…`).

---

## 3. Engineering effort (measured from screenshot timestamps, approximate)

| Phase | Code-based (Bolt) | Low-code (Appsmith) |
|---|---|---|
| Setup | ~1 min (open the existing project) | ~1 min after login (empty app; the datasource step was skipped) |
| Implementation | ~8 min (prompt 1 + "continue") | ~1.5 min JSObject + ~6 min placing widgets by hand + ~2.5 min bindings/Deploy |
| Debugging | ~6 min of the 8 were the Bolt agent frozen on a search step (stop, reload, "continue") | ~1 min (drag-and-drop does not work for an automated agent; the student placed the widgets) |
| Testing | ~7 min (terminal + 8 UI checks) | ~1.5 min (runTests + 8 UI checks) |
| **Total** | **~16 min** | **~13 min** |
| Unresolved defects | 0 functional; reason code not shown for T3/T4 in the UI; tests copy the logic instead of importing it | 0 functional; **layout not responsive at 375px**; uneven layout |

**Measured vs impression.** The times above are measured, but **the comparison is not fully fair**: the low-code version was built second, from a contract and rules that were already worked out. The impression that "low-code is faster" for this task is **not confirmed**: almost all of the logic still had to be written as JS code inside the platform.

---

## 4. Comparison matrix (filled from evidence)

| Criterion | Code-based (Bolt.new) | Low-code (Appsmith) |
|---|---|---|
| Functional tests | **8 / 8** (UI) + 15/15 assertions | **8 / 8** (UI) + 8/8 `runTests` |
| Build and repair time | **~16 min** (6 of them an AI freeze) | **~13 min** (6 of them placing widgets by hand) |
| Customization | Full control: TypeScript, any UI, responsive layout (`28_live_demo_v10_mobile_375px.jpg`) | Limited to the widget set; the rules still had to be a JS script; the layout broke at 375px (`40_…`) |
| Security controls | React escapes output, no `dangerouslySetInnerHTML`, no secrets or backend; dependencies can be checked with `npm audit` (not run) | Data is bound into widgets through `{{ }}`; no datasources or secrets; viewing is public, editing is Administrator-only (`42_…`); platform updates depend on the vendor |
| Versioning / portability | Standard Vite/React project → GitHub, runs anywhere with Node | Proprietary JSON format; Git integration exists but was not connected; the code was copied out by hand |
| Ongoing cost | $0 (Bolt free; about 190K tokens out of 498K per month for prompt 1) + free hosting on bolt.host | $0 (Appsmith Cloud free); paid plans for wider sharing and SSO |

### Recommendation
For this feature **I recommend the code-based approach (Bolt.new / React)**. Both solutions passed 8/8. However, the code-based version has a responsive interface, normal version control (GitHub), separate pure logic with tests, and no vendor lock-in. Low-code (Appsmith) gave no real advantage here: the six-rule contract with reason codes still had to be written as JS code, and the layout needed extra manual work. Low-code makes sense for internal CRUD panels on top of a real database, where the widgets and connectors do most of the work.

---

## 5. Security checklist (Lecture #12)

| Check | Code-based | Low-code | Evidence |
|---|---|---|---|
| Input validation | ✅ `parseTimeInput`/`parseDurationInput` + `INVALID_INPUT` | ✅ regex `HH:MM`, `Number.isInteger` → `INVALID_INPUT` | `11_…`, `32_…` |
| Output / XSS | ✅ React escapes output; no `dangerouslySetInnerHTML` | ⚠ the Text widget shows strings from code; no user-supplied HTML is entered; an XSS injection test was **not** run | Bolt answer §4 |
| Secrets | ✅ none in the code; `@supabase/supabase-js` is installed but unused | ✅ no datasources or keys | `bolt_prompt2_response.txt` |
| Permissions / public sharing | Site is public (bolt.host), data is fictional | Was private (`41_…`); **made public** for the professor (`42_…`). No datasources or secrets are exposed; the editor stays limited to one Administrator | `41_…`, `42_…` |
| Dependencies (SCA) | ⚠ 8 npm dependencies; `npm audit` **was not run** | ⚠ platform responsibility (Appsmith Cloud) | — |
| Runtime checks (DAST) | ✅ safe manual tests T1–T8 on our own app only | ✅ the same | `13_…`–`20_…`, `33_…`–`39_…` |
| Third-party scanning | ❌ not done (no authorization) | ❌ not done | — |
| AI changes verified | ✅ tests re-run by hand; findings recorded | ✅ `runTests` + UI | `09_…` |

---

## 6. AI-use reflection

- **Bolt.new** carried out the contract and wrote tests, but **froze on a tool step** for about 6 minutes. A person had to stop it and send "continue".
- Bolt's claim that "all tests passed" was **confirmed independently**: I ran the command myself and checked all 8 cases in the UI.
- Bolt honestly pointed out a weakness in its own tests (they copy the logic instead of importing it). Next step: Vitest with a direct import of `availability.ts`.
- The AI's description did not fully match the UI: the T3 and T4 reason codes do not appear on screen. **AI output needs to be checked.**
- In prompt 2 the AI was asked to label everything about low-code as assumptions. It did, and gave concrete checks for each risk.

---

## 7. Incomplete or simulated parts (labelled explicitly)

- Low-code: **the layout is not responsive** (375px breaks); widgets are placed unevenly (by hand).
- Low-code: **no JSON export or Git connection**; the code and bindings were copied out by hand.
- `npm audit` and an XSS injection test were **not run**.
- The times in section 3 are approximate, taken from screenshot timestamps.

---

## Contents of this folder
- `screenshots/`: 42 screenshots (01–28 code-based, 29–42 low-code)
- `prompts/`: the prompt texts and Bolt's full answer to prompt 2
- `test-results/`: test output for both solutions
- `low-code-appsmith/`: the Appsmith JSObject and the widget bindings
