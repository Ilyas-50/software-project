import { formatMinutes } from '@/lib/time';

type TimeFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  parsed: number | null;
};

const HELP_TEXT = 'HH:MM (24-hour) or minutes after midnight';

export function TimeField({ id, label, value, onChange, parsed }: TimeFieldProps) {
  const invalid = value.trim() !== '' && parsed === null;

  let helpText = HELP_TEXT;
  if (invalid) helpText = `Not a valid time. Use ${HELP_TEXT}.`;
  else if (parsed !== null) helpText = `Reads as ${formatMinutes(parsed)}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={value}
        placeholder="09:30"
        aria-invalid={invalid}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          invalid
            ? 'border-rose-400 focus:ring-rose-400/40'
            : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/40'
        }`}
      />
      <p className={`mt-1.5 text-xs ${invalid ? 'text-rose-700' : 'text-slate-500'}`}>
        {helpText}
      </p>
    </div>
  );
}
