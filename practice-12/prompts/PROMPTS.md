# AI prompts used (Bolt.new, Standard mode)

All prompts were sent in the project `https://bolt.new/~/sb1-q7bjl9ac` on 26.11.2026.
Screenshots of each prompt being sent are in `../screenshots/`.

## Prompt 1 — implementation (based on slide 31)
Screenshots: `03_prompt1_typed.jpg`, `04_prompt1_sent.jpg`, `05_prompt1_bolt_plan.jpg`

```
Act as a software engineering assistant. Implement the Smart Campus availability contract in this Bolt.new project (React + TypeScript web app). Keep all six acceptance criteria unchanged: AC1 start time must be in the future; AC2 duration > 0 and <= 120 minutes; AC3 overlapping bookings are unavailable; AC4 blocked room is unavailable; AC5 display a clear decision without changing existing bookings; AC6 invalid input receives understandable feedback. Inputs: start time, duration, blocked flag, fictional bookings. Outputs: available (boolean), reason code, visible message. Use fictional data only. Separate deterministic booking rules from presentation. Explain limitations and provide tests for T1-T8 (free interval, overlap, blocked room, duration 0, duration 121, past start, adjacent interval, bookings unchanged). Do not invent successful test results.
```

## Prompt 1b — continue after the agent froze
Bolt hung for about 6 minutes on a file-search step. The generation was stopped and the page reloaded.
Screenshots: `06_prompt1b_continue_sent.jpg`, `07_…`, `08_…`

```
The previous response was interrupted. Continue the same plan: finish refactoring the rules, update the UI, write and run the T1-T8 tests, run typecheck/build, and report the real test output and limitations.
```

## Prompt 2 — comparison and review (based on slide 32)
Screenshots: `21_prompt2_typed.jpg`, `22_prompt2_sent.jpg`, `23_…`–`25_…`. Full answer: [bolt_prompt2_response.txt](bolt_prompt2_response.txt)

```
Compare these code-based and low-code implementations against the same requirements and test evidence. Assess correctness, maintainability, portability, cost, and security. Identify unsupported assumptions. For each risk, provide the observable evidence needed to verify it. Do not treat a platform as secure merely because it is low-code. Context: the code-based version is this Bolt.new project (T1-T8 pass: 15/15 assertions). The low-code version (Appsmith/Budibase/Power Apps) is not built yet, so clearly label every low-code statement as an assumption to verify, and give a comparison matrix (functional tests, build/repair time, customization, security controls, versioning/portability, ongoing cost) plus a security checklist (input validation/XSS, secrets, permissions/public sharing, dependencies/SCA, safe runtime checks/DAST). Do not modify any code.
```

> Note: prompt 2 was sent **before** the low-code version was built, so Bolt labelled its low-code points as assumptions. The final matrix in the report (README.md) is filled in from evidence that was observed later in Appsmith.

## Low-code track (Appsmith)
In Appsmith no prompts were sent to a built-in AI. The JSObject and the widget bindings were written by an AI agent (Claude Code, which controlled the browser). The student logged in and placed the widgets on the canvas by hand.
