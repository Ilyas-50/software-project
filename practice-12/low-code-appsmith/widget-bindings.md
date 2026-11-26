# Appsmith: widgets and bindings (low-code track)

Platform: Appsmith Cloud (free plan), app "My first application", page Page1.

| Widget | Type | Configured property | Value |
|---|---|---|---|
| Text1 | Text | Text | `Smart Campus Room Availability Checker (Low-code: Appsmith). Now = 09:00, fictional data only.` |
| Select1 | Select | Source Data | `{{Rules.rooms.map(r => ({ name: r.name + (r.blocked ? " (BLOCKED)" : ""), code: r.id }))}}` |
| | | Label key / Value key | `name` / `code` |
| | | Default selected value | `402` |
| | | Label | `Room` |
| Input1 | Input (single-line text) | Label | `Start time (HH:MM)` |
| Input2 | Input (single-line text) | Label | `Duration (minutes)` |
| Text2 | Text | Text | `{{(() => { const r = Rules.check(Select1.selectedOptionValue, Input1.text, Input2.text); return "Decision: " + (r.available ? "AVAILABLE" : "UNAVAILABLE") + " \| Reason code: " + r.reasonCode + " \| " + r.message; })()}}` |
| Table1 | Table | Table data | `{{Rules.rooms.flatMap(r => r.bookings.length ? r.bookings.map(b => ({ room: r.name, status: r.blocked ? "Blocked" : "Active", booked: Rules.fmt(b.start) + "-" + Rules.fmt(b.end) })) : [{ room: r.name, status: r.blocked ? "Blocked" : "Active", booked: "-" }])}}` |

The business logic is in the JSObject `Rules` ([Rules.js](Rules.js)). The platform's visual tools cannot express the rules as a set of separate formulas, so the "small script" route from slide 26 was used.

## Limitations and incomplete parts (labelled honestly)

- **Layout:** widgets are placed unevenly. The agent could not drag widgets on the canvas, so the student placed them by hand and nobody aligned them afterwards.
- **Narrow screens:** at 375px the layout is cut off (screenshot `40_lowcode_mobile_375px_layout_DEFECT.jpg`). Auto-layout was not set up.
- **Export / version control:** the app was not exported as JSON, and Git (Appsmith "Connect Git") was not connected. This folder holds a manual copy of the code and bindings.
- **Access:** the app is **not public** ("Make application public" is off), so a viewer needs access to the workspace.
- The app has no "Check" button: the decision is recalculated reactively whenever an input changes.
