import Link from 'next/link';
import type { VehicleSpecs } from '@/lib/types';
import { titleCase, type ModelValueRow, type ModelIndexRow } from '@/lib/model-values';
import type { ComplaintSummary } from '@/lib/nhtsaComplaints';
import type { StateFees } from '@/lib/state-fees';
import { stateRateText, localRangeText, docFeeText, titleFeeText, registrationText, fmtLongDate } from '@/lib/state-fees';
import { PRODUCTS } from '@/lib/constants';

// The free half of the report, built entirely from data that costs nothing to
// show: our own model-value rows (already paid for once, reused for everyone),
// NHTSA's complaint records, the state tax and fee dataset, and arithmetic.
// Nothing here calls a paid feed. The point of each block is to be useful on
// its own and to make the paid valuation, priced for THIS VIN at ITS mileage
// near the buyer's ZIP, the obvious next step.

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const monthYear = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};
/** FHWA average annual mileage for US drivers, the same figure the negotiation pack uses. */
const US_MILES_PER_YEAR = 13500;

/**
 * A paid section shown as a locked preview, the way CarCostCheck upsells from
 * its free report: the question the section answers, one line on what you get,
 * the price, and a jump to the buy cards. No blurred fake data.
 */
function Locked({ title, body, price, name }: { title: string; body: string; price: number; name: string }) {
  return (
    <a href="#buy" className="block rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-5 transition-colors hover:border-brand md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-brand">Locked, {name}</div>
          <h2 className="mt-1 text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{body}</p>
        </div>
        <div className="shrink-0 rounded-xl bg-brand px-4 py-2 text-center text-white">
          <div className="text-lg font-extrabold">${price}</div>
          <div className="text-[11px]">Unlock</div>
        </div>
      </div>
    </a>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
      <h2 className="text-xl font-bold">{title}</h2>
      {sub && <p className="mt-1 text-sm text-ink-2">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function FreeExtras({
  specs,
  modelRows,
  otherYears,
  complaints,
  state,
  problemsSlug,
}: {
  specs: VehicleSpecs;
  /** Rows for this exact year, make and model, if any trim has been valued. */
  modelRows: ModelValueRow[];
  /** Other model years we hold a value for. */
  otherYears: ModelIndexRow[];
  complaints: ComplaintSummary | null;
  /** The visitor's state from the request, when Vercel supplied one we know. */
  state: StateFees | null;
  /** Slug of the matching common-problems guide, if one exists. */
  problemsSlug: string | null;
}) {
  // vPIC shouts the make (CHEVROLET); the page should not.
  const make = titleCase(specs.make || '');
  const name = [specs.year, make, specs.model].filter(Boolean).join(' ');
  const headline = modelRows.length ? [...modelRows].sort((a, b) => b.pricing.count - a.pricing.count)[0] : null;
  const age = Math.max(0, new Date().getUTCFullYear() - Number(specs.year || 0));
  const expectedMiles = Number.isFinite(age) && age > 0 ? age * US_MILES_PER_YEAR : null;

  return (
    <>
      {/* MODEL VALUE: our own rows, free to show because they were struck once for the model page. */}
      {headline ? (
        <Section
          title={`What a ${name} is worth right now`}
          sub={`National retail value for the ${headline.trim || 'base'} trim at ${headline.mileage_basis.toLocaleString('en-US')} miles, from ${headline.pricing.count.toLocaleString('en-US')} US listings, ${monthYear(headline.fetched_at)}. The model, not this car: the paid valuation prices this VIN at its own mileage near your ZIP, with the nearest listings printed.`}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-5 text-center">
              <div className="text-2xl font-bold text-ink">{usd(headline.pricing.low)}</div>
              <div className="mt-1 text-xs text-ink-2">Low retail value</div>
            </div>
            <div className="rounded-xl border-2 border-brand bg-white p-5 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-brand">{usd(headline.pricing.avg)}</div>
              <div className="mt-1 text-xs font-semibold text-ink-2">Average retail value</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 text-center">
              <div className="text-2xl font-bold text-ink">{usd(headline.pricing.high)}</div>
              <div className="mt-1 text-xs text-ink-2">High retail value</div>
            </div>
          </div>
          {modelRows.length > 1 && (
            <p className="mt-3 text-sm text-ink-2">
              Other trims valued: {modelRows.filter((r) => r.prefix !== headline.prefix).map((r) => `${r.trim || 'base'} ${usd(r.pricing.avg)}`).join(', ')}.
            </p>
          )}
          <p className="mt-3 text-sm text-ink-2">
            Full breakdown, price bands and value by state: <Link href={`/car-value/${headline.slug}`} className="font-semibold text-brand hover:underline">{name} value</Link>.
            {' '}For this exact car, add the odometer reading and your ZIP above, from ${PRODUCTS.valuation.price}.
          </p>
        </Section>
      ) : otherYears.length > 0 ? (
        <Section title={`What a ${make} ${specs.model} is worth`} sub="We have not valued this model year yet, but we hold dated national values for these years of the same model.">
          <div className="flex flex-wrap gap-2">
            {otherYears.slice(0, 8).map((y) => (
              <Link key={y.slug} href={`/car-value/${y.slug}`} className="rounded-lg border border-border bg-white px-3 py-2 text-sm hover:border-brand">
                {y.year} {y.make} {y.model}: {usd(y.pricing.avg)}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink-2">The paid valuation prices this VIN at its own mileage near your ZIP, with the listings behind the number, from ${PRODUCTS.valuation.price}.</p>
        </Section>
      ) : null}

      <Locked
        name={PRODUCTS.valuation.name}
        price={PRODUCTS.valuation.price}
        title={`What THIS ${make} ${specs.model} is worth at its mileage, near you`}
        body="The local value for this VIN at its odometer reading, the national low, average and high from live listings, the ten price bands, the five nearest listings by distance with their mileage and price, and a verdict on the asking price."
      />

      {/* WHAT OWNERS REPORT: NHTSA complaints, free federal data. */}
      {complaints && complaints.total > 0 && (
        <Section
          title={`What owners report about the ${name}`}
          sub={`${complaints.total.toLocaleString('en-US')} complaints filed with NHTSA for this year, make and model${complaints.latest ? `, the latest from ${fmtLongDate(complaints.latest)}` : ''}. Matched by model, not by VIN, so this is what tends to go wrong with cars like this one.`}
        >
          {complaints.top.length > 0 && (
            <div className="space-y-2">
              {complaints.top.map((c) => {
                const pct = Math.min(100, Math.round((c.count / Math.max(1, complaints.top[0].count)) * 100));
                return (
                  <div key={c.component} className="flex items-center gap-3 text-sm">
                    <div className="w-40 shrink-0 text-ink">{c.component}</div>
                    <div className="h-3 flex-1 overflow-hidden rounded bg-border/60">
                      <div className="h-full rounded bg-warn/70" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-10 shrink-0 text-right text-ink-2">{c.count}</div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-3 text-xs text-ink-2">
            {complaints.crashes > 0 || complaints.fires > 0
              ? `${complaints.crashes} of these involved a crash and ${complaints.fires} a fire. `
              : ''}
            Ask the seller about the top items by name and check the service history for them.
            {problemsSlug && (
              <>
                {' '}Our guide: <Link href={`/blog/${problemsSlug}`} className="font-semibold text-brand hover:underline">{make} {specs.model} common problems</Link>.
              </>
            )}
          </p>
        </Section>
      )}

      <Locked
        name={PRODUCTS.worthit.name}
        price={PRODUCTS.worthit.price}
        title="Is any recall still open on THIS car, and what did it cost new?"
        body="The manufacturer's record for this VIN: recalls not yet completed, the original window sticker price, the factory options it was built with, standard equipment and the warranty terms, plus twelve nearest listings."
      />

      {/* MILEAGE FOR AGE: arithmetic on a public average. */}
      {expectedMiles !== null && (
        <Section title="What mileage to expect" sub="US drivers average about 13,500 miles a year (FHWA). The valuation is struck at the real odometer reading, so this is a yardstick for the listing, not a price adjustment.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <div className="text-2xl font-bold">{Math.round(expectedMiles * 0.8).toLocaleString('en-US')}</div>
              <div className="mt-1 text-xs text-ink-2">Low for its age (below this, ask why)</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <div className="text-2xl font-bold">{expectedMiles.toLocaleString('en-US')}</div>
              <div className="mt-1 text-xs text-ink-2">Typical at {age} {age === 1 ? 'year' : 'years'} old</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <div className="text-2xl font-bold">{Math.round(expectedMiles * 1.15).toLocaleString('en-US')}</div>
              <div className="mt-1 text-xs text-ink-2">High for its age (more wear, fewer buyers later)</div>
            </div>
          </div>
        </Section>
      )}

      {/* TAX AND FEES: the state dataset, keyed on where the request came from. */}
      {state && (
        <Section
          title={`Buying in ${state.name}: tax and fees on top of the price`}
          sub={`From our state dataset, verified ${fmtLongDate(state.checked)}. Your location is estimated from your connection; pick another state on the calculator if it is wrong.`}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4 text-sm"><div className="text-xs text-ink-2">State sales tax</div><div className="mt-1 font-semibold">{stateRateText(state)}</div><div className="mt-1 text-xs text-ink-2">Local: {localRangeText(state)}</div></div>
            <div className="rounded-xl border border-border bg-surface p-4 text-sm"><div className="text-xs text-ink-2">Dealer doc fee</div><div className="mt-1 font-semibold">{docFeeText(state)}</div></div>
            <div className="rounded-xl border border-border bg-surface p-4 text-sm"><div className="text-xs text-ink-2">Title fee</div><div className="mt-1 font-semibold">{titleFeeText(state)}</div></div>
            <div className="rounded-xl border border-border bg-surface p-4 text-sm"><div className="text-xs text-ink-2">Annual registration</div><div className="mt-1 font-semibold">{registrationText(state)}</div></div>
          </div>
          <p className="mt-3 text-sm text-ink-2">
            Work it out on the asking price: <Link href={`/car-sales-tax-calculator/${state.slug}`} className="font-semibold text-brand hover:underline">{state.name} car sales tax</Link> and the <Link href="/out-the-door-price-calculator" className="font-semibold text-brand hover:underline">out-the-door price calculator</Link>.
          </p>
        </Section>
      )}

      <Locked
        name={PRODUCTS.negotiation.name}
        price={PRODUCTS.negotiation.price}
        title="What to offer, what to aim for, and when to walk away"
        body="Three prices for this specific car, each with the argument behind it and the words to say, what the seller will say back, the thirty nearest listings as the evidence, and the checks to make before any money moves. See the sample report for a real one."
      />
    </>
  );
}
