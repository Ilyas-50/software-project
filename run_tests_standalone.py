"""
Standalone test runner for Smart Campus Room Catalog.
Does NOT use unittest (avoids importing signal/_signal which is broken in some environments).

Run with:  python3 run_tests_standalone.py
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "src"))

from rooms import CATALOG, Room
from filtering import filter_rooms
from booking_v2 import check_availability

passed = 0
failed = 0

def check(label, condition, detail=""):
    global passed, failed
    if condition:
        print(f"  PASS  {label}")
        passed += 1
    else:
        print(f"  FAIL  {label}  {detail}")
        failed += 1

def assert_in(needle, haystack, label):
    check(label, needle in haystack, f"'{needle}' not in '{haystack}'")

def assert_not_in(needle, haystack, label):
    check(label, needle not in haystack, f"'{needle}' should not be in '{haystack}'")

def assert_equal(a, b, label):
    check(label, a == b, f"{a!r} != {b!r}")

def assert_true(a, label):
    check(label, a is True, f"{a!r} is not True")

def assert_false(a, label):
    check(label, a is False, f"{a!r} is not False")

# ---------------------------------------------------------------------------
print("=== Regression Tests (AC1 - AC5) ===")

def test_AC1():
    ok, reason = check_availability(540, 600, 540, False, [])
    assert_false(ok, "AC1: start==now must be rejected")
    assert_in("strictly after current time", reason, "AC1: reason message")

def test_AC2():
    ok_120, _ = check_availability(600, 720, 540, False, [])
    assert_true(ok_120, "AC2: 120 min allowed")
    ok_121, reason = check_availability(600, 721, 540, False, [])
    assert_false(ok_121, "AC2: 121 min rejected")
    assert_in("exceeds maximum limit of 120 minutes", reason, "AC2: reason message")

def test_AC3():
    ok, reason = check_availability(600, 660, 540, True, [])
    assert_false(ok, "AC3: blocked rejected")
    assert_in("blocked", reason, "AC3: reason message")

def test_AC4():
    existing = [(600, 660)]
    ok_touch, _ = check_availability(660, 720, 540, False, existing)
    assert_true(ok_touch, "AC4: touching intervals allowed")
    ok_overlap, reason = check_availability(630, 690, 540, False, existing)
    assert_false(ok_overlap, "AC4: overlap rejected")
    assert_in("overlaps", reason, "AC4: reason message")

def test_AC5():
    existing = [(600, 660)]
    copy_existing = existing.copy()
    check_availability(660, 720, 540, False, existing)
    assert_equal(existing, copy_existing, "AC5: no mutation of existing list")

# ---------------------------------------------------------------------------
print("\n=== Filtering Tests (F1 - F5) ===")

def test_F1():
    res = filter_rooms(CATALOG, requested_attendees=30, required_equipment=[])
    res_ids = [r.room_id for r in res]
    assert_in("402", res_ids, "F1: room 402 matches capacity>=30")
    assert_not_in("401", res_ids, "F1: room 401 excluded (capacity<30)")

def test_F2():
    res = filter_rooms(CATALOG, requested_attendees=1, required_equipment=["Projector", "Speakers"])
    res_ids = [r.room_id for r in res]
    assert_equal(res_ids, ["402"], "F2: only room 402 has Projector+Speakers")

def test_F3():
    res = filter_rooms(CATALOG, requested_attendees=1, required_equipment=[])
    res_ids = [r.room_id for r in res]
    assert_not_in("404", res_ids, "F3: blocked room 404 excluded")

def test_F4():
    res = filter_rooms(CATALOG, requested_attendees=500, required_equipment=["NonExistent"])
    assert_equal(len(res), 0, "F4: no match returns empty list")

def test_F5():
    room_401 = next(r for r in CATALOG if r.room_id == "401")
    room_402 = next(r for r in CATALOG if r.room_id == "402")
    ok_401, _ = check_availability(550, 590, 500, room_401.blocked, room_401.bookings)
    assert_false(ok_401, "F5: room 401 unavailable (booking 540-600 overlaps 550-590)")
    ok_402, _ = check_availability(550, 590, 500, room_402.blocked, room_402.bookings)
    assert_true(ok_402, "F5: room 402 available at 550-590")

# ---------------------------------------------------------------------------
tests = [
    test_AC1, test_AC2, test_AC3, test_AC4, test_AC5,
    test_F1, test_F2, test_F3, test_F4, test_F5,
]

for t in tests:
    try:
        t()
    except Exception as e:
        print(f"  ERROR {t.__name__}: {e}")
        failed += 1

print(f"\n{'='*50}")
print(f"Results: {passed} passed, {failed} failed, {passed + failed} total")
if failed > 0:
    print("FAILED")
    sys.exit(1)
else:
    print("ALL TESTS PASSED")
    sys.exit(0)