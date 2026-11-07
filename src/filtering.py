"""
Room Catalog Filtering Services (F1 - F5).
"""
from typing import List
from rooms import Room

def filter_rooms(rooms: List[Room], requested_attendees: int, required_equipment: List[str]) -> List[Room]:
    """
    F1: capacity >= attendees
    F2: equipment contains ALL required items
    F3: blocked rooms are excluded from available catalog search results
    """
    req_eq_set = set(required_equipment or [])
    matching_rooms = []
    for r in rooms:
        if r.blocked:
            continue
        if r.capacity < requested_attendees:
            continue
        if not req_eq_set.issubset(r.equipment):
            continue
        matching_rooms.append(r)
    return matching_rooms