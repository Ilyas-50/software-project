export type Booking = {
  start: number;
  end: number;
};

export type Room = {
  id: string;
  shortName: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

export const CATALOG: Room[] = [
  {
    id: '401',
    shortName: 'Room 401',
    name: 'Room 401 — AI Research Lab',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard', 'Workstations'],
    blocked: false,
    bookings: [{ start: 540, end: 600 }],
  },
  {
    id: '402',
    shortName: 'Room 402',
    name: 'Room 402 — Conference Hall',
    capacity: 50,
    equipment: ['Projector', 'Microphone', 'Speakers'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: '403',
    shortName: 'Room 403',
    name: 'Room 403 — Study Pod',
    capacity: 4,
    equipment: ['Whiteboard', 'Power Outlets'],
    blocked: false,
    bookings: [{ start: 700, end: 760 }],
  },
  {
    id: '404',
    shortName: 'Room 404',
    name: 'Room 404 — Server Maintenance Hub',
    capacity: 10,
    equipment: ['Monitors'],
    blocked: true,
    bookings: [],
  },
];

export const ALL_EQUIPMENT: string[] = [
  ...new Set(CATALOG.flatMap((room) => room.equipment)),
].sort();
