'use client';

import { useState } from 'react';
import { Field, Out } from './calcUi';

/**
 * The 17c diminished-value formula.
 *
 * 17c is what most US insurers actually apply, so a claimant needs to be able
 * to reproduce their number before arguing with it. It is NOT a legal standard
 * and it is not generous: the 10% cap is the insurer's cap, not a law, and the
 * mileage multiplier zeroes out entirely above 100,000 miles. Both of those are
 * stated on the page rather than buried, because the honest use of this tool is
 * "here is what they will offer you and why it is low", not "here is what you
 * are owed".
 *
 * Pure arithmetic in the browser. No API, paid or otherwise.
 */

// Insurers apply a base cap of 10% of pre-accident value.
const BASE_CAP = 0.1;

const DAMAGE = [
  { label: 'Severe structural damage', v: 1.0 },
  { label: 'Major damage to structure and panels', v: 0.75 },
  { label: 'Moderate damage to structure and panels', v: 0.5 },
  { label: 'Minor damage to structure and panels', v: 0.25 },
  { label: 'No structural damage', v: 0 },
];

const MILEAGE = [
  { label: '0 to 19,999', v: 1.0 },
  { label: '20,000 to 39,999', v: 0.8 },
  { label: '40,000 to 59,999', v: 0.6 },
  { label: '60,000 to 79,999', v: 0.4 },
  { label: '80,000 to 99,999', v: 0.2 },
  { label: '100,000 or more', v: 0 },
];

const money = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

/** Matches Field's look, for the two multiplier dropdowns. Module scope, like
 *  Field, so the select does not lose focus on every keystroke elsewhere. */
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  options: { label: string; v: number }[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-2">{label}</span>
      <div className="mt-1 rounded-xl border border-border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-3 py-3 outline-none"
        >
          {options.map((o) => (
            <option key={o.label} value={o.v}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

export default function DiminishedValueCalc() {
  const [value, setValue] = useState(18000);
  const [damage, setDamage] = useState(0.5);
  const [mileage, setMileage] = useState(0.8);

  const pav = Math.max(0, value || 0);
  const cap = pav * BASE_CAP;
  const afterDamage = cap * damage;
  const result = afterDamage * mileage;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Pre-accident value" value={value} onChange={setValue} step={500} prefix="$" />
        <Select label="Damage severity" value={damage} onChange={setDamage} options={DAMAGE} />
        <Select label="Mileage at the time" value={mileage} onChange={setMileage} options={MILEAGE} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Out label="17c base cap (10%)" value={money(cap)} />
        <Out label="After damage multiplier" value={money(afterDamage)} />
        <Out label="17c diminished value" value={money(result)} accent />
      </div>

      {mileage === 0 && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          At 100,000 miles or more the 17c mileage multiplier is zero, so the formula returns $0 however bad the damage
          was. That is a property of the insurer&apos;s formula, not a statement that your car lost no value. It is
          also the clearest reason to challenge a 17c offer rather than accept it.
        </p>
      )}
      {damage === 0 && mileage !== 0 && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          With no structural damage the multiplier is zero and 17c returns $0, even though a buyer can still see the
          accident on the vehicle&apos;s history and will still pay less for it.
        </p>
      )}
      <p className="mt-4 text-xs text-muted">
        This reproduces the insurer&apos;s formula so you can check their arithmetic. It is not a valuation, not legal
        advice, and not what your claim is necessarily worth.
      </p>
    </div>
  );
}
