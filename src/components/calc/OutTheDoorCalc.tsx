'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Field } from './calcUi';
import { calcOutTheDoor, money, moneyRange, pct, type CalcState } from '@/lib/state-fees';

/**
 * Out-the-door price calculator. The dealer fee fields pre-fill from the
 * state dataset (statutory cap, or the typical high end where there is no cap)
 * and stay editable, because the buyer's order in front of the user beats any
 * typical figure. Pure arithmetic in the browser.
 */
export default function OutTheDoorCalc({
  states,
  initialCode = 'CA',
}: {
  states: CalcState[];
  initialCode?: string;
}) {
  const first = states.find((s) => s.code === initialCode) ?? states[0];
  const [code, setCode] = useState(first.code);
  const [price, setPrice] = useState(25000);
  const [tradeIn, setTradeIn] = useState(0);
  const [local, setLocal] = useState('');
  const [docFee, setDocFee] = useState(first.docFee ?? 0);
  const [titleFee, setTitleFee] = useState(first.titleFee ?? 0);
  const [registration, setRegistration] = useState(first.registration ?? 0);
  const [addons, setAddons] = useState(0);

  const st = states.find((s) => s.code === code) ?? states[0];

  function changeState(next: string) {
    const n = states.find((s) => s.code === next) ?? states[0];
    setCode(n.code);
    setDocFee(n.docFee ?? 0);
    setTitleFee(n.titleFee ?? 0);
    setRegistration(n.registration ?? 0);
  }

  const localRate = local.trim() === '' ? null : Number(local);
  const r = calcOutTheDoor(st, { price, tradeIn, localRate, docFee, titleFee, registration, addons });
  const t = r.tax;

  const rateLabel = !t.rateKnown
    ? st.rateText
      ? 'by table'
      : 'not verified'
    : st.rateType === 'none' || t.stateRate === 0
      ? 'none'
      : pct(t.stateRate);
  const capLabel = st.localApplies && st.localBaseCap !== null ? ` on first ${money(st.localBaseCap)}` : '';
  const localLabel = t.localOverride
    ? `${pct(t.localMin)}${capLabel}`
    : !st.localApplies
      ? 'none'
      : t.localMin === t.localMax
        ? `${pct(t.localMax)}${capLabel}`
        : `${pct(t.localMin)} to ${pct(t.localMax)}${capLabel}`;

  const rows: { label: string; value: string; sub?: string; strong?: boolean }[] = [
    { label: 'Vehicle price', value: money(t.price) },
    { label: `State sales tax (${rateLabel})`, value: t.rateKnown ? money(t.stateTax) : 'Not verified', sub: `on ${money(t.taxable)} taxable` },
    { label: `Local sales tax (${localLabel})`, value: moneyRange(t.localTaxMin, t.localTaxMax) },
    { label: 'Dealer doc fee', value: money(r.docFee), sub: st.docFeeLabel },
    { label: 'Title fee', value: money(r.titleFee), sub: st.titleFee === null ? 'Not verified; enter the DMV figure' : 'State fee, editable' },
    { label: 'Registration', value: money(r.registration), sub: st.registration === null ? 'Not verified; enter the DMV figure' : 'State base fee, editable' },
    { label: 'Add-ons and other fees', value: money(r.addons) },
    { label: 'Out-the-door price', value: moneyRange(r.outTheDoorMin, r.outTheDoorMax), strong: true },
    { label: 'Less trade-in', value: tradeIn > 0 ? `- ${money(Math.min(t.tradeIn, t.price))}` : money(0) },
    { label: 'Amount due', value: moneyRange(r.dueMin, r.dueMax), strong: true },
  ];

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Asking price" value={price} onChange={setPrice} step={500} prefix="$" />
        <label className="block">
          <span className="text-sm font-medium text-ink-2">State</span>
          <div className="mt-1 rounded-xl border border-border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <select
              value={st.code}
              onChange={(e) => changeState(e.target.value)}
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
        <Field label="Dealer doc fee" value={docFee} onChange={setDocFee} step={5} prefix="$" />
        <Field label="Title fee" value={titleFee} onChange={setTitleFee} step={1} prefix="$" />
        <Field label="Registration" value={registration} onChange={setRegistration} step={1} prefix="$" />
        <Field label="Add-ons (optional)" value={addons} onChange={setAddons} step={50} prefix="$" />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Itemized out-the-door price</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={row.strong ? 'bg-blue-50' : 'odd:bg-surface'}>
                <th scope="row" className={`px-4 py-2.5 text-left ${row.strong ? 'font-bold text-ink' : 'font-medium text-ink-2'}`}>
                  {row.label}
                  {row.sub && <span className="block text-xs font-normal text-ink-2">{row.sub}</span>}
                </th>
                <td className={`px-4 py-2.5 text-right tabular-nums ${row.strong ? 'text-lg font-extrabold text-brand' : 'text-ink'}`}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {tradeIn > 0 && st.tradeCredit === 'none' && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {st.name} taxes the full price, so the trade-in reduces the amount due but not the tax.
          </p>
        )}
        {tradeIn > 0 && st.tradeCredit === 'partial' && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {st.name} deducts only part of a trade-in before tax
            {st.tradeCap !== null ? ` (capped at ${money(st.tradeCap)})` : ''}; the tax line reflects that.
          </p>
        )}
        {!t.rateKnown && st.rateText && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {st.name}&apos;s tax is {st.rateText}, so it cannot be computed from a price alone; the state tax line shows
            no figure and the totals exclude it. {st.rateNote ?? ''}
          </p>
        )}
        {!t.rateKnown && !st.rateText && (
          <p className="rounded-xl bg-amber-50 p-3 text-amber-800">
            We could not verify {st.name}&apos;s vehicle tax rate against the state&apos;s own page, so the state tax
            line shows no figure and the totals exclude it.
          </p>
        )}
        {t.rateKnown && st.rateNote && <p className="rounded-xl bg-surface p-3 text-ink-2">{st.rateNote}</p>}
        <p className="text-xs text-ink-2">
          Estimate only. Fees pre-fill from our verified state table and can be edited to match the dealer&apos;s
          buyer&apos;s order. Local tax is a range unless you enter your own rate. Some states also tax the doc fee.{' '}
          <Link href={`/car-sales-tax-calculator/${st.slug}`} className="text-brand underline">
            {st.name} tax rules and sources
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
