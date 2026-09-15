import { META, fmtLongDate } from '@/lib/state-fees';

/**
 * The dated provenance line every state-fee page carries. Reads the date from
 * the dataset so the line can never claim a check that did not happen.
 */
export default function VerifiedLine({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-ink-2 ${className}`}>
      Figures verified {fmtLongDate(META.checked)}; sources linked per row. Re-checked quarterly, next due{' '}
      {fmtLongDate(META.refreshDue)}.
    </p>
  );
}
