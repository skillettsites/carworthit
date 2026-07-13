'use client';
import { useState } from 'react';
import { Field, Out } from './calcUi';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export default function DepreciationCalc() {
  const [price, setPrice] = useState(30000);
  const [rate, setRate] = useState(15);
  const [years, setYears] = useState(5);

  const r = Math.min(60, Math.max(0, rate)) / 100;
  const yrs = Math.min(15, Math.max(1, Math.round(years)));

  const rows = Array.from({ length: yrs + 1 }, (_, y) => {
    const value = price * Math.pow(1 - r, y);
    return { y, value, lost: price - value };
  });

  const endValue = rows[rows.length - 1].value;
  const totalLost = price - endValue;
  const perYear = totalLost / yrs;
  const retained = price > 0 ? (endValue / price) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Car price today" value={price} onChange={setPrice} step={500} prefix="$" />
        <Field label="Depreciation / year" value={rate} onChange={setRate} suffix="%" />
        <Field label="Years to project" value={years} onChange={setYears} min={1} />
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Out label={`Value after ${yrs} yr${yrs > 1 ? 's' : ''}`} value={usd(endValue)} accent />
        <Out label="Total lost" value={usd(totalLost)} />
        <Out label="Avg loss / year" value={usd(perYear)} />
        <Out label="Value retained" value={`${Math.round(retained)}%`} />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-2 border-b border-border">
              <th className="py-2 pr-4 font-semibold">Year</th>
              <th className="py-2 pr-4 font-semibold">Estimated value</th>
              <th className="py-2 font-semibold">Total depreciation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.y} className="border-b border-border/60">
                <td className="py-2 pr-4">{row.y === 0 ? 'Today' : `Year ${row.y}`}</td>
                <td className="py-2 pr-4 font-semibold text-ink">{usd(row.value)}</td>
                <td className="py-2 text-ink-2">{row.lost > 0 ? `-${usd(row.lost)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-2">
        Estimate only, using a steady annual rate. Real depreciation is steepest in year one and varies by make, model,
        mileage and condition. Toyota and Honda models typically hold value best; luxury and EV models often fall faster.
      </p>
    </div>
  );
}
