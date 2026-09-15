'use client';

import { useState } from 'react';
import { Field, Out } from './calcUi';
import { calcVehicleTax, money, moneyRange, pct, type CalcState } from '@/lib/state-fees';

/**
 * Car sales tax calculator. Pure arithmetic in the browser on the slim
 * CalcState rows the server page passes in; no API call, paid or otherwise.
 *
 * The state's typical local range is shown as a range, because the local rate
 * depends on the buyer's address and we do not take a ZIP. A user who knows
 * their combined local rate can type it in and the range collapses to a figure.
 */
export default function SalesTaxCalc({
  states,
  initialCode = 'CA',
  initialPrice = 25000,
}: {
  states: CalcState[];
  initialCode?: string;
  initialPrice?: number;
}) {
  const [code, setCode] = useState(initialCode);
  const [price, setPrice] = useState(initialPrice);
  const [tradeIn, setTradeIn] = useState(0);
  const [local, setLocal] = useState('');

  const st = states.find((s) => s.code === code) ?? states[0];
  const localRate = local.trim() === '' ? null : Number(local);
  const r = calcVehicleTax(st, { price, tradeIn, localRate });

  const rateLabel = !r.rateKnown
    ? st.rateText
      ? 'by table'
      : 'not verified'
    : st.rateType === 'none' || r.stateRate === 0
      ? 'none'
      : pct(r.stateRate);
  const capLabel = st.localApplies && st.localBaseCap !== null ? ` on first ${money(st.localBaseCap)}` : '';
  const localLabel = r.localOverride
    ? `${pct(r.localMin)}${capLabel}`
    : !st.localApplies
      ? 'none'
      : r.localMin === r.localMax
        ? `${pct(r.localMax)}${capLabel}`
        : `${pct(r.localMin)} to ${pct(r.localMax)}${capLabel}`;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle price" value={price} onChange={setPrice} step={500} prefix="$" />
        <label className="block">
          <span className="text-sm font-medium text-ink-2">State</span>
          <div className="mt-1 rounded-xl border border-border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <select
              value={st.code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent px-3 py-3 outline-none"
              aria-label="State"
            >
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </label>
        <Field label="Trade-in value (optional)" value={tradeIn} onChange={setTradeIn} step={500} prefix="$" />
        <label className="block">
          <span className="text-sm font-medium text-ink-2">Your local rate, if you know it (optional)</span>
          <div className="mt-1 flex items-center rounded-xl border border-border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={15}
              step={0.01}
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder={st.localApplies ? 'blank = typical range' : 'no local tax here'}
              className="w-full bg-transparent px-3 py-3 outline-none"
              aria-label="Combined local sales tax rate in percent"
            />
            <span className="pr-3 text-sm text-ink-2">%</span>
          </div>
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Out label={`State tax (${rateLabel})`} value={r.rateKnown ? money(r.stateTax) : 'Not verified'} />
        <Out label={`Local tax (${localLabel})`} value={moneyRange(r.localTaxMin, r.localTaxMax)} />
        <Out label="Trade-in credit applied" value={money(r.tradeInCredit)} />
        <Out label="Total sales tax" value={r.rateKnown ? moneyRange(r.totalMin, r.totalMax) : 'Not verified'} accent />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {!r.rateKnown && st.rateText && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {st.name}&apos;s tax is {st.rateText}, so it cannot be computed from a price alone and no state figure is
            shown here. {st.rateNote ?? ''}
          </p>
        )}
        {!r.rateKnown && !st.rateText && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            We could not verify {st.name}&apos;s vehicle tax rate against the state&apos;s own page, so no state figure
            is shown. The local estimate above is from the state&apos;s published local range only.
          </p>
        )}
        {r.rateKnown && st.rateNote && <p className="rounded-xl bg-surface p-3 text-ink-2">{st.rateNote}</p>}
        {r.rateKnown && (st.rateType === 'none' || r.stateRate === 0) && (
          <p className="rounded-xl bg-surface p-3 text-ink-2">
            {st.name} charges no state sales tax on a vehicle purchase
            {st.localApplies ? ', but local sales taxes can still apply, so the range above is local tax only.' : '.'}
          </p>
        )}
        {tradeIn > 0 && st.tradeCredit === 'none' && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {st.name} taxes the full purchase price. Your trade-in lowers what you pay the dealer, but not the tax.
          </p>
        )}
        {tradeIn > 0 && st.tradeCredit === 'partial' && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {st.name} only deducts part of a trade-in before tax
            {st.tradeCap !== null ? ` (capped at ${money(st.tradeCap)})` : ''}. The credit applied above reflects that.
          </p>
        )}
        {r.flatCapApplied && st.flatCap !== null && (
          <p className="rounded-xl bg-surface p-3 text-ink-2">
            {st.name} caps this tax at {money(st.flatCap)}, so the state figure is the cap rather than the percentage.
          </p>
        )}
        {r.flatMinApplied && st.flatMin !== null && (
          <p className="rounded-xl bg-surface p-3 text-ink-2">
            {st.name} charges a minimum of {money(st.flatMin)}, which is what applies at this price.
          </p>
        )}
        <p className="text-xs text-ink-2">
          Taxable amount: {money(r.taxable)}. Tax only; dealer doc fees, title and registration are separate, and some
          states tax the doc fee as part of the price. The local figure is an estimate from the state&apos;s published
          range unless you entered your own rate.
        </p>
      </div>
    </div>
  );
}
