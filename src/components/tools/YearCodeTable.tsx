import { YEAR_CODES } from '@/lib/vin-tools/year-codes';

/**
 * Server-rendered position-10 model-year table. `from` and `to` bound the
 * years shown; the full 1980 to 2039 set is the regulation's, and pages that
 * only need a slice (the make decoders) pass a narrower range.
 */
export default function YearCodeTable({ from = 1980, to = 2030, compact = false }: { from?: number; to?: number; compact?: boolean }) {
  const rows = YEAR_CODES.filter((r) => (r.first >= from && r.first <= to) || (r.second >= from && r.second <= to));
  return (
    <div className="mt-4 overflow-x-auto">
      <table className={`w-full ${compact ? 'text-xs' : 'text-sm'}`}>
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-semibold">10th character</th>
            <th className="py-2 pr-4 font-semibold">Model year (7th character numeric)</th>
            <th className="py-2 font-semibold">Model year (7th character a letter)</th>
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {rows.map((r) => (
            <tr key={r.code} className="border-b border-border">
              <td className="py-1.5 pr-4 font-mono font-bold text-ink">{r.code}</td>
              <td className="py-1.5 pr-4">{r.first >= from && r.first <= to ? r.first : ''}</td>
              <td className="py-1.5">{r.second >= from && r.second <= to ? r.second : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
