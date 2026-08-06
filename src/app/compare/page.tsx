import Link from 'next/link';
import type { Metadata } from 'next';
import { buildFreeReport } from '@/lib/report';
import { getMarketValuation, getFactoryData } from '@/lib/apis/oneauto';
import { getPaidSession, peekOrderVins } from '@/lib/stripe';
import { buildVerdict } from '@/lib/worthit-report';
import { getCachedReport, cacheReport, healCachedReport } from '@/lib/db';
import { includesFactory, SITE_URL } from '@/lib/constants';
import { derivedSessionId } from '@/lib/multi-vin';
import type { FactoryData, FreeReport, MarketValuation, WorthItVerdict } from '@/lib/types';
import SearchBox from '@/components/SearchBox';

// The side-by-side comparison a multi-vehicle order pays for.
//
// Deliberately reuses the SAME cache rows the individual reports write, keyed
// by derivedSessionId, so opening the comparison after reading the reports
// costs nothing and shows exactly the same numbers. If a buyer lands here
// first, this page does the lookups and caches them for the report pages.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Compare your vehicles',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/compare` },
};

type Search = Promise<{ paid?: string }>;

interface Row {
  vin: string;
  free: FreeReport | null;
  valuation: MarketValuation | null;
  factory: FactoryData | null;
  verdict: WorthItVerdict | null;
  asking: number | null;
}

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export default async function ComparePage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const token = typeof sp.paid === 'string' ? sp.paid : '';

  // The comparison is paid content. getPaidSession checks VIN membership, and
  // this page has no single VIN to check, so learn the order's first VIN and
  // then verify through the normal path. No payment check is skipped.
  const orderVins = token ? await peekOrderVins(token) : [];
  const paid = orderVins.length ? await getPaidSession(orderVins[0], token) : null;

  if (!paid || paid.vins.length < 2) {
    return (
      <div className="container-x max-w-2xl py-16">
        <h1 className="text-2xl font-bold">Nothing to compare</h1>
        <p className="mt-2 text-ink-2">
          This page shows a side-by-side of the vehicles in a multi-vehicle order. Open it from the link you were
          given after paying, or check a car below.
        </p>
        <div className="mt-6"><SearchBox /></div>
      </div>
    );
  }

  const wantsFactory = includesFactory(paid.product);

  const rows: Row[] = await Promise.all(
    paid.vehicles.map(async ({ vin, mileage, asking }, i): Promise<Row> => {
      const key = derivedSessionId(token, i);
      const free = await buildFreeReport(vin);

      const cached = await getCachedReport<{ valuation: MarketValuation | null; factory: FactoryData | null }>(key);
      let valuation = cached?.valuation ?? null;
      let factory = cached?.factory ?? null;

      if (!valuation || (wantsFactory && !factory)) {
        const [v, f] = await Promise.all([
          Number.isFinite(mileage) && mileage > 0
            ? getMarketValuation(vin, paid!.ctx.zip, mileage)
            : Promise.resolve(null),
          wantsFactory ? getFactoryData(vin) : Promise.resolve(null),
        ]);
        valuation = v ?? valuation;
        factory = f ?? factory;
        // Same completeness rule the report page uses: never freeze a partial
        // result into a cache row that cannot be repaired. And HEAL an existing
        // partial row rather than skipping the write, otherwise every visit to
        // this page re-buys the same OneAuto data forever, up to ten paid calls
        // per view on a five-car order.
        if (valuation && (!wantsFactory || factory)) {
          if (cached) healCachedReport(key, { valuation, factory });
          else cacheReport(key, vin, paid!.product, { valuation, factory });
        }
      }

      return { vin, free, valuation, factory, verdict: buildVerdict(asking, valuation), asking };
    }),
  );

  // The verdict: cheapest against its own local market, not cheapest outright.
  // Comparing sticker prices across different cars would just say "the cheapest
  // car is cheapest", which the buyer can see without paying us.
  const scored = rows
    .filter((r) => r.valuation && r.asking)
    .map((r) => ({ r, delta: (r.asking as number) - (r.valuation as MarketValuation).averagePrice }))
    .sort((a, b) => a.delta - b.delta);
  // A verdict needs at least TWO cars actually measured. Asking price is
  // optional on every vehicle, so "one car had a price" is the ordinary case,
  // not an exotic one, and calling that car "the best buy" would be the paid
  // deliverable asserting a comparison it never performed.
  const best = scored.length >= 2 ? scored[0] : null;
  const unscored = rows.length - scored.length;

  return (
    <div className="bg-surface min-h-screen">
      <div className="bg-slate-900 text-white">
        <div className="container-x max-w-6xl py-8">
          <div className="text-xs uppercase tracking-wider text-slate-400">CarWorthIt comparison</div>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
            {rows.length} cars, side by side
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Each priced at its own mileage, in the market around ZIP {paid.ctx.zip}.
          </p>
        </div>
      </div>

      <div className="container-x max-w-6xl space-y-6 py-8">
        {best ? (
          <section className="rounded-2xl border border-good/40 bg-good/5 p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-ink-2">Our verdict</div>
            <h2 className="mt-1 text-2xl font-extrabold text-good">
              {[best.r.free?.specs.year, best.r.free?.specs.make, best.r.free?.specs.model]
                .filter(Boolean)
                .join(' ') || best.r.vin}{' '}
              is the best buy
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Of the {scored.length} we could measure, it is priced most keenly against its own local market
              {best.delta < 0
                ? `, at ${usd(Math.abs(best.delta))} below the average for comparable cars near you.`
                : best.delta === 0
                  ? ', sitting exactly on the local average.'
                  : `, though it is still ${usd(best.delta)} above its local average, so none of the ${scored.length} is a bargain.`}
              {unscored > 0 &&
                ` ${unscored} of the ${rows.length} could not be scored, because we have no asking price or no comparable cars for ${unscored === 1 ? 'it' : 'them'}.`}{' '}
              That is a judgement about price against market, not about which car suits you. Condition and history
              still decide it, and nobody has inspected any of them.
            </p>
          </section>
        ) : (
          <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-ink-2">Our verdict</div>
            <h2 className="mt-1 text-xl font-bold">
              {scored.length === 1
                ? 'Only one of these could be scored, so there is nothing to compare on price'
                : 'We cannot pick between these on price'}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Judging which is the better buy means comparing each asking price against what that specific car is
              worth locally, and we need at least two cars with both to do it.{' '}
              {rows.some((r) => !r.asking)
                ? 'Add the asking prices for the cars missing one and the verdict will follow.'
                : 'We could not find comparable cars near you for enough of them.'}{' '}
              Everything else below is still measured and still stands.
            </p>
          </section>
        )}

        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="p-4 font-semibold"> </th>
                {rows.map((r) => (
                  <th key={r.vin} className="p-4 font-bold">
                    {[r.free?.specs.year, r.free?.specs.make, r.free?.specs.model].filter(Boolean).join(' ') || 'Unknown'}
                    <div className="mt-1 font-mono text-[11px] font-normal text-ink-2">{r.vin}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Asking price" rows={rows} cell={(r) => (r.asking ? usd(r.asking) : 'Not given')} />
              <CompareRow
                label="Local market average"
                rows={rows}
                cell={(r) => (r.valuation ? usd(r.valuation.averagePrice) : 'No comparables')}
              />
              <CompareRow
                label="Against the average"
                rows={rows}
                cell={(r) => {
                  if (!r.valuation || !r.asking) return 'n/a';
                  const d = r.asking - r.valuation.averagePrice;
                  if (d === 0) return 'Exactly the average';
                  return `${d > 0 ? '+' : '−'}${usd(Math.abs(d))}`;
                }}
                tone={(r) => {
                  if (!r.valuation || !r.asking) return '';
                  const d = r.asking - r.valuation.averagePrice;
                  return d > 0 ? 'text-bad font-bold' : d < 0 ? 'text-good font-bold' : 'font-bold';
                }}
              />
              <CompareRow label="Verdict" rows={rows} cell={(r) => r.verdict?.headline ?? 'Add an asking price'} />
              <CompareRow
                label="Mileage"
                rows={rows}
                cell={(r) => (r.valuation ? `${r.valuation.mileage.toLocaleString('en-US')} miles` : 'n/a')}
              />
              <CompareRow
                label="Open recalls"
                rows={rows}
                cell={(r) =>
                  r.free?.recalls === null
                    ? 'NHTSA unreachable'
                    : r.free?.recalls.length
                      ? `${r.free.recalls.length} open`
                      : 'None found'
                }
                tone={(r) => (r.free?.recalls?.length ? 'text-warn font-bold' : '')}
              />
              <CompareRow
                label="NHTSA overall safety"
                rows={rows}
                cell={(r) => (r.free?.safety?.overall ? `${r.free.safety.overall} of 5` : 'Not rated')}
              />
              <CompareRow
                label="MPG combined"
                rows={rows}
                cell={(r) => (r.free?.runningCosts?.mpgCombined ? String(r.free.runningCosts.mpgCombined) : 'n/a')}
              />
              <CompareRow
                label="5-year running costs"
                rows={rows}
                cell={(r) => {
                  const o = r.free?.ownership;
                  if (!o) return 'n/a';
                  const total =
                    (r.free?.runningCosts?.annualFuelCost ? o.fuel : 0) +
                    o.insurance + o.maintenance + o.repairs + o.taxesFees;
                  return usd(total);
                }}
              />
              {wantsFactory && (
                <CompareRow
                  label="Cost new"
                  rows={rows}
                  cell={(r) => {
                    const n = r.factory?.combinedMsrp || r.factory?.msrp;
                    return n ? usd(n) : 'No record';
                  }}
                />
              )}
              <tr className="border-t border-border">
                <td className="p-4 font-semibold text-ink-2">Full report</td>
                {rows.map((r) => (
                  <td key={r.vin} className="p-4">
                    <Link
                      href={`/report/${r.vin}?paid=${encodeURIComponent(token)}`}
                      className="font-semibold text-brand hover:underline"
                    >
                      Open →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs leading-relaxed text-ink-2">
          Market values are an estimate, not an appraisal, and each car is priced against comparable cars in its own
          local market. This comparison does not cover vehicle history, title or salvage records.
        </p>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  rows,
  cell,
  tone,
}: {
  label: string;
  rows: Row[];
  cell: (r: Row) => string;
  tone?: (r: Row) => string;
}) {
  return (
    <tr className="border-t border-border">
      <td className="p-4 font-semibold text-ink-2">{label}</td>
      {rows.map((r) => (
        <td key={r.vin} className={`p-4 ${tone ? tone(r) : ''}`}>
          {cell(r)}
        </td>
      ))}
    </tr>
  );
}
