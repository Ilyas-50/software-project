import { useMemo, useState } from 'react';
import { AvailabilityChecker } from '@/components/AvailabilityChecker';
import { FilterPanel } from '@/components/FilterPanel';
import { RoomCatalog } from '@/components/RoomCatalog';
import { SiteHeader, type AppView } from '@/components/SiteHeader';
import { DEFAULT_FILTERS, filterRooms, type RoomFilters } from '@/lib/filtering';
import { ALL_EQUIPMENT, CATALOG } from '@/lib/rooms';
import { CURRENT_TIME_MINUTES } from '@/lib/time';

function App() {
  const [view, setView] = useState<AppView>('rooms');
  const [filters, setFilters] = useState<RoomFilters>(DEFAULT_FILTERS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const matchingRooms = useMemo(() => filterRooms(CATALOG, filters), [filters]);
  const matchingIds = useMemo(
    () => new Set(matchingRooms.map((room) => room.id)),
    [matchingRooms]
  );
  const checkerRoom =
    matchingRooms.find((room) => room.id === selectedRoomId) ??
    matchingRooms[0] ??
    null;

  const openChecker = (roomId: string) => {
    setSelectedRoomId(roomId);
    setView('checker');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader view={view} onViewChange={setView} />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {view === 'rooms' ? (
          <div className="space-y-6">
            <FilterPanel
              filters={filters}
              equipmentOptions={ALL_EQUIPMENT}
              matchCount={matchingRooms.length}
              totalCount={CATALOG.length}
              onChange={setFilters}
            />
            <RoomCatalog
              rooms={CATALOG}
              matchingIds={matchingIds}
              onCheck={openChecker}
            />
          </div>
        ) : (
          <AvailabilityChecker
            rooms={matchingRooms}
            selectedRoom={checkerRoom}
            now={CURRENT_TIME_MINUTES}
            onSelectRoom={setSelectedRoomId}
            onBrowseRooms={() => setView('rooms')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
