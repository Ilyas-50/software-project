"""
Domain models for Smart Campus Room Catalog.
"""
from typing import List, Dict, Any

class Room:
    def __init__(self, room_id: str, name: str, capacity: int, equipment: List[str], blocked: bool, bookings: List[tuple]):
        self.room_id = room_id
        self.name = name
        self.capacity = capacity
        self.equipment = set(equipment)
        self.blocked = blocked
        self.bookings = bookings

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.room_id,
            "name": self.name,
            "capacity": self.capacity,
            "equipment": list(self.equipment),
            "blocked": self.blocked,
            "bookings": self.bookings
        }

CATALOG: List[Room] = [
    Room("401", "Lab 401 - AI Research", 20, ["Projector", "Whiteboard", "Workstations"], False, [(540, 600)]),
    Room("402", "Room 402 - Conference Hall", 50, ["Projector", "Microphone", "Speakers"], False, [(600, 660)]),
    Room("403", "Room 403 - Study Pod", 4, ["Whiteboard", "Power Outlets"], False, [(700, 760)]),
    Room("404", "Room 404 - Server Maintenance Hub", 10, ["Monitors"], True, []),
]