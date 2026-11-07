import { Ban, Check, Users } from 'lucide-react';
import type { Room } from '@/lib/rooms';

type RoomCatalogProps = {
  rooms: Room[];
  matchingIds: Set<string>;
  onCheck: (roomId: string) => void;
};

export function RoomCatalog({ rooms, matchingIds, onCheck }: RoomCatalogProps) {
  return (
    <section aria-labelledby="catalog-heading">
      <h2 id="catalog-heading" className="mb-4 text-lg font-semibold">
        Room catalog
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            matches={matchingIds.has(room.id)}
            onCheck={onCheck}
          />
        ))}
      </div>
    </section>
  );
}

function RoomCard({
  room,
  matches,
  onCheck,
}: {
  room: Room;
  matches: boolean;
  onCheck: (roomId: string) => void;
}) {
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        matches ? 'border-slate-200' : 'border-dashed border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">{room.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
            <Users className="h-4 w-4 text-slate-400" />
            Seats {room.capacity}
          </p>
        </div>
        <StatusPill blocked={room.blocked} />
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {room.equipment.map((item) => (
          <li
            key={item}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        {room.blocked ? (
          <p className="flex items-center gap-2 text-sm text-rose-700">
            <Ban className="h-4 w-4" />
            Blocked rooms cannot be booked.
          </p>
        ) : matches ? (
          <button
            type="button"
            onClick={() => onCheck(room.id)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:scale-[0.99]"
          >
            <Check className="h-4 w-4" />
            Check availability
          </button>
        ) : (
          <p className="text-sm text-slate-500">
            Does not match your current filters.
          </p>
        )}
      </div>
    </article>
  );
}

function StatusPill({ blocked }: { blocked: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        blocked ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          blocked ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />
      {blocked ? 'Blocked' : 'Active'}
    </span>
  );
}
