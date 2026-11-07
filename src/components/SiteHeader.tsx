import type { LucideIcon } from 'lucide-react';
import { CalendarCheck, DoorClosed, LayoutGrid } from 'lucide-react';
import { CURRENT_TIME_MINUTES, formatMinutes } from '@/lib/time';

export type AppView = 'rooms' | 'checker';

const NAV_ITEMS: { view: AppView; label: string; icon: LucideIcon }[] = [
  { view: 'rooms', label: 'Rooms', icon: LayoutGrid },
  { view: 'checker', label: 'Check booking', icon: CalendarCheck },
];

type SiteHeaderProps = {
  view: AppView;
  onViewChange: (view: AppView) => void;
};

export function SiteHeader({ view, onViewChange }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <DoorClosed className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">CampusRooms</p>
              <p className="text-xs text-slate-500">Room availability</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:hidden">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {formatMinutes(CURRENT_TIME_MINUTES)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <nav className="grid w-full grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-flex sm:w-auto">
            {NAV_ITEMS.map(({ view: itemView, label, icon: Icon }) => {
              const active = view === itemView;
              return (
                <button
                  key={itemView}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onViewChange(itemView)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </nav>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Now {formatMinutes(CURRENT_TIME_MINUTES)}
          </div>
        </div>
      </div>
    </header>
  );
}
