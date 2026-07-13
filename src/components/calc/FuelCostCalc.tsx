'use client';
import { useState } from 'react';
import { Field, Out } from './calcUi';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export default function FuelCostCalc() {
  const [miles, setMiles] = useState(12000);
  const [mpg, setMpg] = useState(28);
  const [price, setPrice] = useState(3.3);

  const gallons = miles / Math.max(1, mpg);
  const annual = gallons * price;
  const monthly = annual / 12;
  const per100 = (100 / Math.max(1, mpg)) * price;
  const fiveYear = annual * 5;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Miles per year" value={miles} onChange={setMiles} step={500} />
        <Field label="MPG (combined)" value={mpg} onChange={setMpg} />
        <Field label="Gas price / gallon" value={price} onChange={setPrice} step={0.05} prefix="$" />
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Out label="Per year" value={usd(annual)} accent />
        <Out label="Per month" value={usd(monthly)} />
        <Out label="Per 100 miles" value={usd(per100)} />
        <Out label="Over 5 years" value={usd(fiveYear)} />
      </div>
      <p className="mt-4 text-xs text-ink-2">
        Estimate only. Real fuel cost varies with driving style, terrain, traffic and local gas prices. Want the exact
        EPA MPG for a specific car? Run its VIN for the real figure.
      </p>
    </div>
  );
}
