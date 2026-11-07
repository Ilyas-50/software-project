import { CheckCircle2, Info, XCircle } from 'lucide-react';
import type { AvailabilityResult } from '@/lib/availability';

type StatusBannerProps = {
  result: AvailabilityResult | null;
  summary: string;
  hint: string;
};

export function StatusBanner({ result, summary, hint }: StatusBannerProps) {
  if (result === null) {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
      >
        <Info className="h-5 w-5 shrink-0 text-slate-500" />
        <p>{hint}</p>
      </div>
    );
  }

  if (result.available) {
    return (
      <div
        role="status"
        className="animate-fade-up flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 sm:p-5"
      >
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
        <div>
          <p className="text-base font-bold uppercase tracking-wide text-emerald-800">
            Available
          </p>
          <p className="mt-0.5 text-sm text-emerald-900">{summary}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="animate-fade-up flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 sm:p-5"
    >
      <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-700" />
      <div>
        <p className="text-base font-bold uppercase tracking-wide text-rose-800">
          Unavailable
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-rose-900">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-700" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
