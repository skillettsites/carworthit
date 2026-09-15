import type { WmiRow } from '@/lib/vin-tools/makes';

/** Server-rendered WMI table. Every row came from vPIC; nothing is typed by hand. */
export default function WmiTable({ rows, make }: { rows: WmiRow[]; make: string }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-semibold">WMI</th>
            <th className="py-2 pr-4 font-semibold">Vehicle type</th>
            <th className="py-2 pr-4 font-semibold">Manufacturer (vPIC)</th>
            <th className="py-2 pr-4 font-semibold">Country</th>
            <th className="py-2 font-semibold">Also decodes as</th>
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {rows.map((r) => (
            <tr key={r.wmi} className="border-b border-border align-top">
              <td className="py-1.5 pr-4 font-mono font-bold text-ink">{r.wmi}</td>
              <td className="py-1.5 pr-4">{r.type}</td>
              <td className="py-1.5 pr-4">{r.manufacturer}</td>
              <td className="py-1.5 pr-4">{r.country || 'not listed'}</td>
              <td className="py-1.5">{r.sharedWith.length ? r.sharedWith.join(', ') : `${make} only`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
