# Smart Campus Room Availability Checker - Assignment #04


## 1. Project Overview & Architecture
This repository contains the refactored, extended implementation of the **Smart Campus Room Availability Checker** (Assignment #04). It upgrades the single-room baseline from Assignment #03 to a 4-room catalog with dynamic filtering and room availability checks.

### Key Components
* `src/rooms.py` — Catalog model defining 4 fictional rooms (401, 402, 403, 404) with IDs, capacities, equipment lists, blocked statuses, and existing booking schedules.
* `src/filtering.py` — Pure filtering functions enforcing rules F1–F5 (capacity threshold, required equipment set matching, and blocked room exclusion).
* `src/booking_v2.py` — Availability validation engine enforcing criteria AC1–AC5 (max 120 minutes, touching endpoints allowed, start after current time, non-mutating checks) and returning structured diagnostic tuples `(is_available, reason)`.
* `main.py` — End-to-End interactive demonstration script executing room selection, filtering, availability validation, and room switching.
* `tests/test_booking_v2.py` — Suite of 10 automated unit and integration tests.

---

## 2. Directory Structure
```text
.
├── src/
│   ├── rooms.py             # Room catalog & data models
│   ├── filtering.py         # Catalog filtering logic (F1-F5)
│   ├── booking_v2.py        # Availability validation engine (AC1-AC5)
│   └── booking_v1.py        # Baseline validator from Assignment #03
├── tests/
│   ├── test_booking_v1.py   # Baseline test suite (12 tests)
│   └── test_booking_v2.py   # Refactored test suite (10 tests)
├── main.py                  # Interactive End-to-End CLI application
└── README.md                # Project documentation & run instructions
```

---

## 3. Environment Setup & Correct Run Instructions

### Prerequisites
* Python 3.8 or higher (standard library only, no external `pip` packages required).

### Running Automated Test Suites

To execute tests with correct module path resolution (`PYTHONPATH`), run:

```bash
# Run refactored test suite (10 tests)
python3 -m unittest discover -s tests -p "test_booking_v2.py"

# Alternatively, setting PYTHONPATH explicitly:
PYTHONPATH=src python3 tests/test_booking_v2.py
```

### Running the End-to-End Interactive CLI Application

To run the full end-to-end demonstration (filtering rooms by capacity/equipment, validating time slots, and switching rooms):

```bash
python3 main.py
```
