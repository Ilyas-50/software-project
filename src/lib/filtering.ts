import type { Room } from '@/lib/rooms';

export type RoomFilters = {
  attendees: number;
  equipment: string[];
};

export const DEFAULT_FILTERS: RoomFilters = {
  attendees: 1,
  equipment: [],
};

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  return rooms.filter(
    (room) =>
      !room.blocked &&
      room.capacity >= filters.attendees &&
      filters.equipment.every((item) => room.equipment.includes(item))
  );
}
