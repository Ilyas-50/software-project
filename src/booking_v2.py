"""
Availability Validation Engine (AC1 - AC5).
"""
def check_availability(start: int, end: int, now: int, blocked: bool, existing: list) -> tuple[bool, str]:
    """
    Validates availability rules and returns (is_available, reason).
    """
    if not (0 <= start < end <= 1440):
        return False, "Invalid time range. Times must be between 0 and 1440 minutes."
    if start <= now:
        return False, f"Start time ({start}) must be strictly after current time ({now})."
    if end - start > 120:
        return False, "Booking duration exceeds maximum limit of 120 minutes."
    if blocked:
        return False, "Room is blocked for maintenance or administrative lock."

    for ex_start, ex_end in existing:
        if start < ex_end and ex_start < end:
            return False, f"Time overlaps with existing booking ({ex_start}-{ex_end})."

    return True, "Available"