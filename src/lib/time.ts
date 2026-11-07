export const MINUTES_PER_DAY = 24 * 60;
export const MAX_BOOKING_MINUTES = 120;
export const CURRENT_TIME_MINUTES = 9 * 60;

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatMinutes(total: number): string {
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export function parseTimeInput(raw: string): number | null {
  const value = raw.trim();
  let total: number;

  const hhmm = value.match(/^(\d{1,2}):(\d{2})$/);
  if (hhmm) {
    const minutes = Number(hhmm[2]);
    if (minutes > 59) return null;
    total = Number(hhmm[1]) * 60 + minutes;
  } else if (/^\d{1,4}$/.test(value)) {
    total = Number(value);
  } else {
    return null;
  }

  return total <= MINUTES_PER_DAY ? total : null;
}
