'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Field, Out } from './calcUi';
import { computeOffer, type SellerType } from '@/lib/negotiationGuide';
import { PRODUCTS } from '@/lib/constants';

/**
 * Asking price in, three numbers out: where to open, what to aim for, where
 * to walk. Pure arithmetic in the browser on sourced typical ranges; it never
 * calls an API and it never sees the car. The reasons are printed under the
 * numbers because a figure you cannot explain is a figure you cannot defend
 * on a forecourt.
 */

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

const ISSUES: { key: keyof ReturnType<typeof blankIssues>; label: string; hint: string }[] = [
  { key: 'tires', label: 'Tires near the end of their life', hint: 'Tread near the 1/16 inch legal minimum, or the quarter test fails' },
  { key: 'brakes', label: 'Brake pads worn', hint: 'Squeal, grind, or an inspection said so' },
  { key: 'service', label: 'Due for a major service', hint: 'Timing belt, transmission fluid, 60k/90k/100k service' },
  { key: 'cosmetic', label: 'Cosmetic damage', hint: 'Dents, scuffs, curbed wheels' },
  { key: 'recall', label: 'Open safety recall', hint: 'Check the VIN free at nhtsa.gov/recalls' },
  { key: 'noHistory', label: 'No service history', hint: 'No receipts, no stamped book, no records' },
];

function blankIssues() {
  return { recall: false, tires: false, brakes: false, service: false, cosmetic: false, noHistory: false };
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
        checked ? 'border-brand bg-blue-50/60' : 'border-border bg-white hover:border-slate-300'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--brand)]"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-ink-2">{hint}</span>
      </span>
    </label>
  );
}

export default function NegotiationCalc() {
  const thisYear = new Date().getUTCFullYear();
  const [asking, setAsking] = useState(18500);
  const [seller, setSeller] = useState<SellerType>('dealer');
  const [modelYear, setModelYear] = useState(thisYear - 6);
  const [mileage, setMileage] = useState(72000);
  const [issues, setIssues] = useState(blankIssues());
  const [quote, setQuote] = useState(0);

  const r = useMemo(
    () => computeOffer({ asking, seller, modelYear, mileage, issues, quote }),
    [asking, seller, modelYear, mileage, issues, quote],
  );
  const saving = r.net > 0 ? Math.max(0, asking - r.target) : 0;
  const segBtn = (active: boolean) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      active ? 'bg-white text-brand shadow-sm' : 'text-ink-2 hover:text-ink'
    }`;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm" id="calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Asking price" value={asking} onChange={setAsking} step={100} prefix="$" />
        <div>
          <span className="text-sm font-medium text-ink-2">Who is selling</span>
          <div className="mt-1 flex gap-1 rounded-xl border border-border bg-surface p-1" role="radiogroup" aria-label="Seller type">
            <button
              type="button"
              role="radio"
              aria-checked={seller === 'dealer'}
              className={segBtn(seller === 'dealer')}
              onClick={() => setSeller('dealer')}
            >
              Dealer
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={seller === 'private'}
              className={segBtn(seller === 'private')}
              onClick={() => setSeller('private')}
            >
              Private seller
            </button>
          </div>
        </div>
        <Field label="Model year" value={modelYear} onChange={setModelYear} min={1981} step={1} />
        <Field label="Mileage" value={mileage} onChange={setMileage} step={1000} suffix="miles" />
      </div>

      <div className="mt-5">
        <span className="text-sm font-medium text-ink-2">Anything you already know is wrong with it</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {ISSUES.map((i) => (
            <Toggle
              key={i.key}
              label={i.label}
              hint={i.hint}
              checked={issues[i.key]}
              onChange={(v) => setIssues({ ...issues, [i.key]: v })}
            />
          ))}
        </div>
        <div className="mt-3 max-w-sm">
          <Field label="Written quote for outstanding work, if you have one" value={quote} onChange={setQuote} step={50} prefix="$" />
        </div>
      </div>

      {asking <= 0 && (
        <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Enter the asking price to see your three numbers.</p>
      )}
      {asking > 0 && r.net <= 0 && (
        <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          The work you have ticked costs more than the asking price. There is no number to negotiate to; either the
          car is priced for parts or one of the deductions does not apply. Untick what you are not sure of.
        </p>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Out label="Open here" value={usd(r.opening)} />
        <Out label="Aim to pay" value={usd(r.target)} accent />
        <Out label="Walk away above" value={usd(r.walkAway)} />
      </div>
      {saving > 0 && (
        <p className="mt-3 text-center text-sm text-ink-2">
          Land on the target and you pay <strong className="text-ink">{usd(saving)}</strong> less than the asking price
          {r.deductions.length > 0 ? ', including the work it needs' : ''}.
        </p>
      )}

      {r.net > 0 && (
        <div className="mt-5 space-y-3 text-sm leading-relaxed text-ink-2">
          <p>
            <strong className="text-ink">Why open at {usd(r.opening)}:</strong> {r.reasons.opening}
          </p>
          <p>
            <strong className="text-ink">Why aim for {usd(r.target)}:</strong> {r.reasons.target}
          </p>
          <p>
            <strong className="text-ink">Why walk above {usd(r.walkAway)}:</strong> {r.reasons.walkAway}
          </p>
        </div>
      )}

      {r.deductions.length > 0 && (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4">
          <h3 className="text-sm font-bold text-ink">Work you can put a number on ({usd(r.deductions.reduce((s, d) => s + d.amount, 0))} off every price)</h3>
          <ul className="mt-2 space-y-2">
            {r.deductions.map((d) => (
              <li key={d.label} className="text-sm text-ink-2">
                <span className="font-semibold text-ink">
                  {d.label}: {usd(d.amount)}.
                </span>{' '}
                {d.why} <span className="text-xs text-ink-2/80">Source: {d.source}.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {r.leverage.length > 0 && (
        <div className="mt-4 rounded-xl border border-good/30 bg-good/5 p-4">
          <h3 className="text-sm font-bold text-ink">Things to say that carry no dollar figure</h3>
          <ul className="mt-2 space-y-3">
            {r.leverage.map((l) => (
              <li key={l.title} className="text-sm text-ink-2">
                <span className="font-semibold text-ink">{l.title}.</span> {l.detail}{' '}
                <span className="text-xs text-ink-2/80">Source: {l.source}.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {r.sellerSide.length > 0 && (
        <div className="mt-4 rounded-xl border border-warn/30 bg-warn/5 p-4">
          <h3 className="text-sm font-bold text-ink">What the seller will say back</h3>
          <ul className="mt-2 space-y-3">
            {r.sellerSide.map((l) => (
              <li key={l.title} className="text-sm text-ink-2">
                <span className="font-semibold text-ink">{l.title}.</span> {l.detail}{' '}
                <span className="text-xs text-ink-2/80">Source: {l.source}.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {r.mileageNote && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{r.mileageNote}</p>}

      <div className="mt-5 rounded-xl border-2 border-brand/40 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <p className="text-sm text-ink-2">
          <strong className="text-ink">This page cannot see the car.</strong> The numbers above are typical ranges from
          published sources applied to the price you typed. The{' '}
          <Link href="/pricing" className="font-semibold text-brand underline">
            {PRODUCTS.negotiation.name}, ${PRODUCTS.negotiation.price}
          </Link>
          , prices the actual VIN at its mileage against comparable cars listed near your ZIP code, and sets the opening
          offer, target and walk-away from that local low, average and high instead.
        </p>
      </div>

      <p className="mt-4 text-xs text-ink-2">
        Arithmetic only. Not a valuation, not a guarantee any seller will accept these numbers, and not advice about a
        specific car. Sources and dates are listed under every figure.
      </p>
    </div>
  );
}
