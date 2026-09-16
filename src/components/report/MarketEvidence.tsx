import type { MarketEvidence as Evidence } from '@/lib/types';
import type { ProductId } from '@/lib/constants';
import { localMarket, cheaperThanShare, strength, bandChart, windowLabel, nationalMedian, usd } from '@/lib/market-evidence';

// The evidence behind the valuation: the listings themselves.
//
// This is the section the Carketa licence never allowed. Retail Market Value
// (VIN Audit via OneAuto) is a NATIONAL figure for the exact year, make, model
// and trim at the buyer's mileage, and its listings may be shown to a consumer
// inside a paid report (OneAuto, 15 September 2026). Each listing carries a
// ZIP and coordinates, so the "near you" view is ours: nearest first, radius
// widened in fixed steps until there are enough to mean something.
//
// Tier gating is on the TABLE only. Every paid tier sees the national figures,
// the price bands and the near-you summary; the number of listings laid out
// row by row is what grows with the price. The listing VINs are never shown:
// they identify somebody else's car.

const ROWS: Record<ProductId | 'sample', number> = { valuation: 5, worthit: 12, negotiation: 30, sample: 12 };

const miles = (n: number) => `${n.toLocaleString('en-US')} mi`;
const shortDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00Z');
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

export default function MarketEvidence({
  evidence,
  zip,
  asking,
  tier,
}: {
  evidence: Evidence;
  /** The buyer's ZIP, for the near-you view. */
  zip: string;
  asking: number | null;
  tier: ProductId | 'sample';
}) {
  const ev = evidence;
  const local = localMarket(ev, zip, ROWS[tier]);
  const s = strength(ev);
  const bands = bandChart(ev);
  const natMedian = nationalMedian(ev);
  const shareNat = asking ? cheaperThanShare(ev.listings, asking) : null;
  const shareLocal = asking && local ? cheaperThanShare(local.inside, asking) : null;
  const tone = s.level === 'strong' ? 'text-good bg-good/10 border-good/30' : s.level === 'fair' ? 'text-brand bg-brand/10 border-brand/30' : 'text-warn bg-warn/10 border-warn/30';
  const rows = local?.listings ?? [];
  const hiddenRows = Math.max(0, (local ? local.count : ev.listings.length) - rows.length);

  return (
    <section className="rounded-2xl border border-border bg-white p-6 md:p-8" id="evidence">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">The evidence: {ev.count.toLocaleString('en-US')} listings for this exact model</h2>
          <p className="mt-1 text-sm text-ink-2">
            {ev.vehicleDesc}, priced at {ev.mileage.toLocaleString('en-US')} miles, from US sales listings observed{' '}
            {windowLabel(ev)}. Every price below has been adjusted to this car&apos;s mileage, so it compares like with like.
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{s.label}</span>
      </div>

      {/* National figures */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-2xl font-bold text-ink">{usd(ev.low)}</div>
          <div className="mt-1 text-xs text-ink-2">Low retail value, nationally</div>
        </div>
        <div className="rounded-xl border-2 border-brand bg-white p-5 text-center shadow-sm">
          <div className="text-3xl font-extrabold text-brand">{usd(ev.avg)}</div>
          <div className="mt-1 text-xs font-semibold text-ink-2">Average retail value, nationally</div>
          <div className="mt-1 text-[11px] text-ink-2">Median listing {usd(natMedian)}, confidence {ev.confidence}/100</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-2xl font-bold text-ink">{usd(ev.high)}</div>
          <div className="mt-1 text-xs text-ink-2">High retail value, nationally</div>
        </div>
      </div>

      {/* Where the asking price sits */}
      {asking !== null && shareNat !== null && (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-ink-2">Asking {usd(asking)} is higher than</span>
            <span className="font-bold">{shareNat}% of listings nationally</span>
          </div>
          {local && shareLocal !== null && local.radius !== null && (
            <div className="mt-2 flex justify-between gap-4">
              <span className="text-ink-2">And higher than</span>
              <span className="font-bold">{shareLocal}% of the {local.count} within {local.radius} miles</span>
            </div>
          )}
          <p className="mt-2 text-xs text-ink-2">
            Read it as a percentile: at 50% the seller is asking a typical price; at 80% or more, four in five comparable cars are cheaper.
          </p>
        </div>
      )}

      {/* Price bands */}
      {bands.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold">How the {ev.count.toLocaleString('en-US')} listings are priced</h3>
          <p className="mt-1 text-xs text-ink-2">Ten equal bands from the cheapest tenth to the dearest. Each holds about the same number of cars, so the width of a band is the story: a narrow band is a crowded price.</p>
          <div className="mt-3 space-y-1.5">
            {bands.map((b) => (
              <div key={b.min} className="flex items-center gap-3 text-xs">
                <div className="w-36 shrink-0 text-right font-mono text-ink-2">
                  {usd(b.min)} to {usd(b.max)}
                </div>
                <div className="h-4 flex-1 overflow-hidden rounded bg-border/60">
                  <div className="h-full rounded bg-brand/70" style={{ width: `${b.pct}%` }} />
                </div>
                <div className="w-10 shrink-0 text-ink-2">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Near you */}
      <div className="mt-6">
        {local ? (
          <>
            <h3 className="text-sm font-semibold">
              {local.radius !== null
                ? `Near ZIP ${zip}: ${local.count} comparable ${local.count === 1 ? 'listing' : 'listings'} within ${local.radius} miles`
                : `Nearest listings to ZIP ${zip}`}
            </h3>
            <p className="mt-1 text-xs text-ink-2">
              {local.radius !== null ? (
                <>
                  Median {usd(local.median)}, middle half {usd(local.p25)} to {usd(local.p75)}, cheapest {usd(local.min)}. All at this car&apos;s mileage.
                </>
              ) : (
                <>
                  Fewer than eight listings sit within 500 miles of {zip}, so there is no local figure to quote; the nearest cars are listed below and the national figures above are the ones to use.
                </>
              )}
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-ink-2">
                    <th className="py-2 pr-3 font-medium">Distance</th>
                    <th className="py-2 pr-3 font-medium">State</th>
                    <th className="py-2 pr-3 font-medium">Mileage</th>
                    <th className="py-2 pr-3 font-medium">Advertised</th>
                    <th className="py-2 pr-3 font-medium">At {ev.mileage.toLocaleString('en-US')} mi</th>
                    <th className="py-2 font-medium">Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((l, i) => (
                    <tr key={`${l.zip}-${l.mileage}-${l.price}-${i}`} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-3 font-mono">{l.miles} mi</td>
                      <td className="py-2 pr-3">{l.state}</td>
                      <td className="py-2 pr-3">{miles(l.mileage)}</td>
                      <td className="py-2 pr-3">{usd(l.price)}</td>
                      <td className={`py-2 pr-3 font-semibold ${asking !== null && l.adjPrice < asking ? 'text-good' : ''}`}>{usd(l.adjPrice)}</td>
                      <td className="py-2 text-ink-2">{shortDate(l.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hiddenRows > 0 && (
              <p className="mt-2 text-xs text-ink-2">
                {tier === 'valuation' || tier === 'worthit'
                  ? `Showing the ${rows.length} nearest. The Negotiation Bundle lays out the ${Math.min(30, rows.length + hiddenRows)} nearest with the arguments to use them.`
                  : `Showing the ${rows.length} nearest of ${rows.length + hiddenRows}.`}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-ink-2">
            We could not place ZIP {zip} on the map (some post-office-box ZIPs have no area), so the national figures above stand on their own.
          </p>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-ink-2">
        Source: US retail sales listings via a licensed vehicle-pricing provider, refreshed daily; national figures for this exact trim at the stated mileage
        {ev.mileageAdjustment ? `, including a ${usd(Math.abs(ev.mileageAdjustment))} mileage adjustment against the pool` : ''}. Advertised prices are what sellers asked, not what buyers paid. Dealer names and listing links are not supplied by the feed.
      </p>
    </section>
  );
}
