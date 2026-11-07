import unittest
from rooms import CATALOG, Room
from filtering import filter_rooms
from booking_v2 import check_availability

class TestSmartCampusSuite(unittest.TestCase):
    
    # --- Regression Tests (AC1 - AC5) ---
    def test_AC1_start_must_be_after_now(self):
        ok, reason = check_availability(540, 600, 540, False, [])
        self.assertFalse(ok)
        self.assertIn("strictly after current time", reason)

    def test_AC2_boundary_120_vs_121(self):
        ok_120, _ = check_availability(600, 720, 540, False, [])
        self.assertTrue(ok_120)
        ok_121, reason = check_availability(600, 721, 540, False, [])
        self.assertFalse(ok_121)
        self.assertIn("exceeds maximum limit of 120 minutes", reason)

    def test_AC3_blocked_room_rejected(self):
        ok, reason = check_availability(600, 660, 540, True, [])
        self.assertFalse(ok)
        self.assertIn("blocked", reason)

    def test_AC4_overlapping_and_touching_intervals(self):
        existing = [(600, 660)]
        # Touching at endpoints allowed
        ok_touch, _ = check_availability(660, 720, 540, False, existing)
        self.assertTrue(ok_touch)
        # Overlapping rejected
        ok_overlap, reason = check_availability(630, 690, 540, False, existing)
        self.assertFalse(ok_overlap)
        self.assertIn("overlaps", reason)

    def test_AC5_no_mutation(self):
        existing = [(600, 660)]
        copy_existing = existing.copy()
        check_availability(660, 720, 540, False, existing)
        self.assertEqual(existing, copy_existing)

    # --- New Filtering Tests (F1 - F5) ---
    def test_F1_capacity_filter(self):
        res = filter_rooms(CATALOG, requested_attendees=30, required_equipment=[])
        res_ids = [r.room_id for r in res]
        self.assertIn("402", res_ids)
        self.assertNotIn("401", res_ids)

    def test_F2_equipment_filter(self):
        res = filter_rooms(CATALOG, requested_attendees=1, required_equipment=["Projector", "Speakers"])
        res_ids = [r.room_id for r in res]
        self.assertEqual(res_ids, ["402"])

    def test_F3_blocked_room_excluded(self):
        res = filter_rooms(CATALOG, requested_attendees=1, required_equipment=[])
        res_ids = [r.room_id for r in res]
        self.assertNotIn("404", res_ids)

    def test_F4_empty_state_when_no_match(self):
        res = filter_rooms(CATALOG, requested_attendees=500, required_equipment=["NonExistent"])
        self.assertEqual(len(res), 0)

    def test_F5_room_switching_availability(self):
        room_401 = next(r for r in CATALOG if r.room_id == "401")
        room_402 = next(r for r in CATALOG if r.room_id == "402")
        
        ok_401, _ = check_availability(550, 590, 500, room_401.blocked, room_401.bookings)
        self.assertFalse(ok_401)
        
        ok_402, _ = check_availability(550, 590, 500, room_402.blocked, room_402.bookings)
        self.assertTrue(ok_402)

if __name__ == "__main__":
    unittest.main()