import { useState } from 'react';
import { ArrowLeft, CalendarClock, Clock } from 'lucide-react';
import { checkAvailability } from '@/lib/availability';
import type { Room } from '@/lib/rooms';
import { formatMinutes, parseTimeInput } from '@/lib/time';
import { StatusBanner } from '@/components/StatusBanner';
import { TimeField } from '@/components/TimeField';

type AvailabilityCheckerProps = {
  rooms: Room[];
  selectedRoom: Room | null;
  now: number;
  onSelectRoom: (roomId: string) => void;
  onBrowseRooms: () => void;
};

export function AvailabilityChecker({
  rooms,
  selectedRoom,
  now,
  onSelectRoom,
  onBrowseRooms,
}: AvailabilityCheckerProps) {
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');

  if (!selectedRoom) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold">No rooms match your filters</h2>
        <p className="mt-2 text-sm text-slate-600">
          Loosen the attendee count or remove an equipment requirement to see
          bookable rooms.
        </p>
        <button
          type="button"
          onClick={onBrowseRooms}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Adjust filters
        </button>
      </section>
    );
  }

  const start = parseTimeInput(startInput);
  const end = parseTimeInput(endInput);
  const timesReady = start !== null && end !== null;
  const result = timesReady ? checkAvailability(selectedRoom, start, end, now) : null;
  const summary = timesReady
    ? `${selectedRoom.shortName} is free from ${formatMinutes(start)} to ${formatMinutes(end)} (${end - start} min).`
    : '';

  return (
    <div className="space-y-6">
      <section aria-labelledby="room-picker-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="room-picker-heading" className="text-lg font-semibold">
            Choose a room
          </h2>
          <button
            type="button"
            onClick={onBrowseRooms}
            className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
          >
            Change filters
          </button>
        </div>
        <div role="group" aria-label="Rooms matching filters" className="flex flex-wrap gap-2">
          {rooms.map((room) => {
            const active = room.id === selectedRoom.id;
            return (
              <button
                key={room.id}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectRoom(room.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {room.shortName}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">{selectedRoom.name}</h3>
            <p className="mt-0.5 text-sm text-slate-600">
              Seats {selectedRoom.capacity} · {selectedRoom.equipment.join(', ')}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Booked today
          </p>
          {selectedRoom.bookings.length === 0 ? (
            <p className="text-sm text-slate-600">No bookings today.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {selectedRoom.bookings.map((booking) => (
                <li
                  key={booking.start}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                >
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {formatMinutes(booking.start)} – {formatMinutes(booking.end)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section
        aria-labelledby="slot-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h2 id="slot-heading" className="text-lg font-semibold">
          Booking time
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Use 24-hour HH:MM (for example 09:30) or minutes after midnight. Bookings
          can last up to 120 minutes.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TimeField
            id="start-time"
            label="Start time"
            value={startInput}
            onChange={setStartInput}
            parsed={start}
          />
          <TimeField
            id="end-time"
            label="End time"
            value={endInput}
            onChange={setEndInput}
            parsed={end}
          />
        </div>

        <div className="mt-6">
          <StatusBanner
            result={result}
            summary={summary}
            hint="Enter a start and end time to check this room."
          />
        </div>
      </section>
    </div>
  );
}
