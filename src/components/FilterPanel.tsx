import { Check, Minus, Plus, RotateCcw, SlidersHorizontal, Users } from 'lucide-react';
import { DEFAULT_FILTERS, type RoomFilters } from '@/lib/filtering';

type FilterPanelProps = {
  filters: RoomFilters;
  equipmentOptions: string[];
  matchCount: number;
  totalCount: number;
  onChange: (filters: RoomFilters) => void;
};

export function FilterPanel({
  filters,
  equipmentOptions,
  matchCount,
  totalCount,
  onChange,
}: FilterPanelProps) {
  const setAttendees = (attendees: number) =>
    onChange({ ...filters, attendees: Math.max(1, attendees) });

  const toggleEquipment = (item: string) => {
    const equipment = filters.equipment.includes(item)
      ? filters.equipment.filter((existing) => existing !== item)
      : [...filters.equipment, item];
    onChange({ ...filters, equipment });
  };

  const hasActiveFilters =
    filters.attendees !== DEFAULT_FILTERS.attendees ||
    filters.equipment.length > 0;

  return (
    <section
      aria-labelledby="filter-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="filter-heading"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
          Filter rooms
        </h2>
        <p className="text-sm text-slate-500" aria-live="polite">
          Showing{' '}
          <span className="font-semibold text-slate-900">{matchCount}</span> of{' '}
          {totalCount} rooms
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users className="h-4 w-4 text-slate-400" />
            Attendees
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease attendees"
              disabled={filters.attendees <= 1}
              onClick={() => setAttendees(filters.attendees - 1)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min={1}
              value={filters.attendees}
              aria-label="Required capacity"
              onChange={(e) => {
                const parsed = Number.parseInt(e.target.value, 10);
                setAttendees(Number.isNaN(parsed) ? 1 : parsed);
              }}
              className="h-10 w-20 rounded-xl border border-slate-200 bg-white text-center text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            />
            <button
              type="button"
              aria-label="Increase attendees"
              onClick={() => setAttendees(filters.attendees + 1)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Rooms must seat at least this many people.
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">
            Equipment needed
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {equipmentOptions.map((item) => {
              const active = filters.equipment.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleEquipment(item)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                    active
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {item}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            A room must have every selected item.
          </p>
        </fieldset>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
