import type { WorthItReport as Report } from '@/lib/worthit-report';
import { buildVerdict, depreciation, groupFeatures } from '@/lib/worthit-report';
import type { NegotiationPack as Pack } from '@/lib/negotiation';
import NegotiationPack from './NegotiationPack';

// The paid Worth-It report.
//
// ⚠️ LICENCE CONSTRAINT, read before adding anything here.
// Only three Carketa fields may be shown to a consumer: average, low and high
// price. The comparable listings, the days-on-market figure and the
// comparables' mileage range are trade-only. The API client already discards
// them, so there is nothing in `valuation` that cannot be rendered, and it
// must stay that way.

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/** The API sends snake_case warranty types. Say them the way an owner would. */
const WARRANTY_LABELS: Record<string, string> = {
  total: 'Bumper to bumper',
  basic: 'Bumper to bumper',
  powertrain: 'Powertrain',
  anti_corrosion: 'Anti-corrosion',
  corrosion: 'Anti-corrosion',
  roadside_assistance: 'Roadside assistance',
  emissions: 'Emissions',
  hybrid: 'Hybrid components',
};
const warrantyLabel = (t: string) =>
  WARRANTY_LABELS[t.toLowerCase()] ||
  t.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

/** The feed uses a 7-digit sentinel (9,999,999) for unlimited mileage. */
const warrantyMiles = (m: number | null) =>
  m === null ? null : m >= 999999 ? 'Unlimited miles' : `${m.toLocaleString('en-US')} miles`;

/**
 * Strip the trade codes the factory feed appends, e.g. "Mudguards (PIO)" for
 * port-installed and "(DNS)" for distributor-installed. They mean nothing to a
 * consumer and make the report look like a data dump.
 */
const cleanOption = (s: string) => s.replace(/\s*\((?:PIO|DNS|DIO|OEM)\)\s*$/i, '').trim();

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
      <h2 className="text-xl font-bold">{title}</h2>
      {sub && <p className="mt-1 text-sm text-ink-2">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border last:border-0 text-sm">
      <span className="text-ink-2">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export default function WorthItReport({
  report,
  buy,
  pack,
  siblings,
}: {
  report: Report;
  /** The buy cards. Rendered at the TOP, the way CarCostCheck does it. */
  buy?: React.ReactNode;
  /** Top tier only. Built server-side so the logic never ships to the client. */
  pack?: Pack | null;
  /** Other vehicles bought in the same order, for the switcher. */
  siblings?: { vins: string[]; index: number; token: string };
}) {
  const { free, valuation, factory, recalls, askingPrice } = report;
  const specs = free.specs;
  const verdict = report.verdict ?? buildVerdict(askingPrice, valuation);
  const dep = depreciation(factory, valuation);
  const features = groupFeatures(factory);

  const title = [specs.year, specs.make, specs.model, factory?.trim || specs.trim]
    .filter(Boolean)
    .join(' ');

  const tone =
    verdict?.standing === 'above'
      ? { bar: 'bg-bad', text: 'text-bad', ring: 'border-bad/40 bg-bad/5' }
      : verdict?.standing === 'below'
        ? { bar: 'bg-good', text: 'text-good', ring: 'border-good/40 bg-good/5' }
        : { bar: 'bg-brand', text: 'text-brand', ring: 'border-brand/40 bg-brand/5' };

  return (
    <div className="bg-surface min-h-screen">
      {/* Vehicle header */}
      <div className="bg-slate-900 text-white">
        <div className="container-x py-8 max-w-4xl">
          <div className="text-xs uppercase tracking-wider text-slate-400">CarWorthIt report</div>
          <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">{title}</h1>
          <div className="mt-2 font-mono text-sm text-slate-400">VIN {specs.vin}</div>
          {valuation ? (
            <div className="mt-1 text-sm text-slate-300">
              Priced at {valuation.mileage.toLocaleString('en-US')} miles near ZIP {valuation.zip}
            </div>
          ) : (
            <div className="mt-1 text-sm text-slate-300">Free report. Specs, recalls, safety and running costs.</div>
          )}
        </div>
      </div>

      {/* Switcher for a multi-vehicle order. Sits above everything so a buyer
          who paid for five cars can see all five and move between them. */}
      {siblings && siblings.vins.length > 1 && (
        <div className="border-b border-border bg-white">
          <div className="container-x max-w-4xl py-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-2">
              Your order, {siblings.vins.length} vehicles
            </div>
            <div className="flex flex-wrap gap-2">
              {siblings.vins.map((v, i) => {
                const here = i === siblings.index;
                return (
                  <a
                    key={v}
                    href={`/report/${v}?paid=${encodeURIComponent(siblings.token)}`}
                    aria-current={here ? 'page' : undefined}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      here
                        ? 'border-brand bg-brand/10 font-bold text-brand'
                        : 'border-border text-ink-2 hover:border-brand hover:text-ink'
                    }`}
                  >
                    {here && <span aria-hidden="true">▸ </span>}
                    {v}
                  </a>
                );
              })}
              <a
                href={`/compare?paid=${encodeURIComponent(siblings.token)}`}
                className="rounded-lg border-2 border-brand bg-brand px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-dark"
              >
                Compare all {siblings.vins.length} →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Buy cards at the TOP, before the free content. The wrapper lives
          inside BuyCards so a top-tier buyer, for whom it renders nothing,
          does not get an empty bordered strip across their report. */}
      {buy}

      <div className="container-x py-8 max-w-4xl space-y-6">
        {/* THE VERDICT */}
        {verdict && (
          <section className={`rounded-2xl border p-6 md:p-8 ${tone.ring}`}>
            <div className="text-xs uppercase tracking-wider text-ink-2">Is it worth it?</div>
            <h2 className={`mt-1 text-2xl md:text-3xl font-extrabold ${tone.text}`}>{verdict.headline}</h2>
            <p className="mt-3 text-ink-2 leading-relaxed">{verdict.detail}</p>
          </section>
        )}

        {/* WHAT IT IS WORTH */}
        {valuation && (
          <Section
            title="What this car is worth"
            sub={`Priced for this VIN: its exact trim and the options it was built with, at ${valuation.mileage.toLocaleString('en-US')} miles, in the market around ZIP ${valuation.zip}.`}
          >
            {/* The low/high tiles only appear when the feed actually gave a
                range. Repeating the average in all three slots would present a
                fabricated range as a measured one. */}
            <div className={`grid gap-4 ${valuation.lowPrice !== null && valuation.highPrice !== null ? 'sm:grid-cols-3' : ''}`}>
              {valuation.lowPrice !== null && (
                <div className="rounded-xl border border-border bg-surface p-5 text-center">
                  <div className="text-2xl font-bold text-ink">{usd(valuation.lowPrice)}</div>
                  <div className="mt-1 text-xs text-ink-2">Lowest asking price</div>
                </div>
              )}
              <div className="rounded-xl border-2 border-brand bg-white p-5 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-brand">{usd(valuation.averagePrice)}</div>
                <div className="mt-1 text-xs font-semibold text-ink-2">Market average</div>
              </div>
              {valuation.highPrice !== null && (
                <div className="rounded-xl border border-border bg-surface p-5 text-center">
                  <div className="text-2xl font-bold text-ink">{usd(valuation.highPrice)}</div>
                  <div className="mt-1 text-xs text-ink-2">Highest asking price</div>
                </div>
              )}
            </div>
            {askingPrice && verdict?.differenceFromAverage !== null && verdict?.differenceFromAverage !== undefined && (
              <div className="mt-5 rounded-xl bg-surface border border-border p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-2">Seller is asking</span>
                  <span className="font-bold">{usd(askingPrice)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-ink-2">Against the market average</span>
                  {/* A car priced exactly at the average used to render as a
                      green "−$0", which reads as a saving of nothing. Zero is
                      its own case and gets said in words. */}
                  {verdict.differenceFromAverage === 0 ? (
                    <span className="font-bold text-ink">Exactly the average</span>
                  ) : (
                    <span className={`font-bold ${verdict.differenceFromAverage > 0 ? 'text-bad' : 'text-good'}`}>
                      {verdict.differenceFromAverage > 0 ? '+' : '−'}
                      {usd(Math.abs(verdict.differenceFromAverage))}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* NEGOTIATION PACK, top tier only */}
        {pack && <NegotiationPack pack={pack} />}

        {/* WHAT IT COST NEW */}
        {factory && (factory.combinedMsrp || factory.msrp) && (
          <Section
            title="What it cost new"
            sub="The original factory window sticker for this exact VIN, including the options it was built with."
          >
            <Row label="Base MSRP" value={factory.msrp ? usd(factory.msrp) : null} />
            <Row label="Fitted options" value={factory.optionsMsrp ? usd(factory.optionsMsrp) : null} />
            <Row label="Delivery charge" value={factory.deliveryCharges ? usd(factory.deliveryCharges) : null} />
            <Row label="Sticker price when new" value={factory.combinedMsrp ? usd(factory.combinedMsrp) : null} />
            <Row label="Dealer invoice price" value={factory.invoicePrice ? usd(factory.invoicePrice) : null} />

            {dep && (
              <div className="mt-5 rounded-xl border border-border bg-surface p-5">
                <div className="text-sm text-ink-2">Total depreciation since new</div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-ink">{usd(dep.lost)}</span>
                  <span className="text-lg font-bold text-ink-2">{dep.pct}% of its sticker price</span>
                </div>
                {/* Always brand-coloured. This bar shows value retained, which
                    has nothing to do with whether the seller's asking price is
                    fair, so it must not inherit the verdict's red/green tone. */}
                <div className="mt-4 flex justify-between text-xs font-medium text-ink-2">
                  <span>Value retained, {100 - dep.pct}%</span>
                  <span>Lost, {dep.pct}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full bg-brand" style={{ width: `${Math.min(100, 100 - dep.pct)}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-ink-2">
                  <span>Worth now {usd(dep.worthNow)}</span>
                  <span>Cost new {usd(dep.paidNew)}</span>
                </div>
              </div>
            )}
          </Section>
        )}

        {/* FITTED OPTIONS */}
        {factory && factory.installedOptions.length > 0 && (
          <Section
            title="Options this car was built with"
            sub="Factory-fitted extras on this VIN, which is what separates two otherwise identical cars."
          >
            <div className="space-y-0">
              {factory.installedOptions.map((o) => (
                <Row key={o.description} label={cleanOption(o.description)} value={o.msrp ? `${usd(o.msrp)} new` : 'Fitted'} />
              ))}
            </div>
          </Section>
        )}

        {/* RUNNING COSTS */}
        {(free.runningCosts || free.ownership) && (
          <Section title="What it costs to run" sub="Fuel figures are the EPA's official ratings for this year, make and model. The rest are US national averages, scaled for the car's age.">
            {free.runningCosts && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-surface border border-border p-4 text-center">
                  <div className="text-2xl font-bold">{free.runningCosts.mpgCombined ?? 'n/a'}</div>
                  <div className="text-xs text-ink-2 mt-1">MPG combined</div>
                </div>
                <div className="rounded-xl bg-surface border border-border p-4 text-center">
                  <div className="text-2xl font-bold">{free.runningCosts.mpgCity ?? 'n/a'}</div>
                  <div className="text-xs text-ink-2 mt-1">MPG city</div>
                </div>
                <div className="rounded-xl bg-surface border border-border p-4 text-center">
                  <div className="text-2xl font-bold">{free.runningCosts.mpgHighway ?? 'n/a'}</div>
                  <div className="text-xs text-ink-2 mt-1">MPG highway</div>
                </div>
              </div>
            )}
            {free.ownership && (
              <div className="mt-5">
                {free.runningCosts?.annualFuelCost ? (
                  <Row label="Fuel, 5 years" value={usd(free.ownership.fuel)} />
                ) : null}
                <Row label="Insurance, 5 years" value={usd(free.ownership.insurance)} />
                <Row label="Maintenance, 5 years" value={usd(free.ownership.maintenance)} />
                <Row label="Repairs, 5 years" value={usd(free.ownership.repairs)} />
                <Row label="Taxes and fees, 5 years" value={usd(free.ownership.taxesFees)} />
                {/* Total is summed from the rows above, NOT ownership.fiveYearTotal.
                    That field folds in a projected depreciation figure from a
                    generic age curve, which for this car came out at $14,750
                    against an actual loss of $3,876 in its whole life so far.
                    Showing a total larger than its own line items is the fastest
                    way to lose a reader, and the projection was not defensible. */}
                <div className="mt-3 flex justify-between rounded-xl bg-surface border border-border p-4">
                  <span className="font-semibold">Estimated 5-year running costs</span>
                  <span className="text-xl font-extrabold text-brand">
                    {usd(
                      (free.runningCosts?.annualFuelCost ? free.ownership.fuel : 0) +
                        free.ownership.insurance +
                        free.ownership.maintenance +
                        free.ownership.repairs +
                        free.ownership.taxesFees,
                    )}
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink-2">
                  An estimate, not a quote, and it excludes depreciation
                  {dep ? ', which is shown separately above' : ''}.{' '}
                  {free.runningCosts?.annualFuelCost
                    ? 'Only the fuel figure is specific to this car; the rest are US national averages scaled for its age.'
                    : 'We had no EPA fuel figure for this car, so fuel is excluded entirely. The rest are US national averages scaled for its age.'}
                </p>
              </div>
            )}
          </Section>
        )}

        {/* RECALLS + SAFETY */}
        <Section
          title="Safety and open recalls"
          sub={
            recalls
              ? 'Checked against this exact VIN, so it reflects whether the work has actually been done, and includes manufacturer campaigns never reported to NHTSA.'
              : 'From NHTSA. Recalls are matched by year, make and model, so confirm any that apply with a dealer.'
          }
        >
          {/* The paid VIN-level check answers the question the free NHTSA feed
              cannot: is there work still outstanding on THIS car. When we have
              it, it replaces the model-level list rather than sitting beside
              it, because showing both invites the reader to reconcile two
              different things. */}
          {recalls && (
            <div className="mb-5">
              {recalls.outstanding ? (
                <div className="rounded-xl border border-bad/40 bg-bad/5 p-4">
                  <div className="text-sm font-bold text-bad">
                    {recalls.total} outstanding recall {recalls.total === 1 ? 'campaign' : 'campaigns'} on this VIN
                  </div>
                  <p className="mt-1 text-xs text-ink-2">
                    This work has not been recorded as completed. It is free to have done at a franchised dealer.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-good/40 bg-good/5 p-4">
                  <div className="text-sm font-bold text-good">✓ No outstanding recalls on this VIN</div>
                  <p className="mt-1 text-xs text-ink-2">
                    Checked against the manufacturer&apos;s record for this exact vehicle, including voluntary service
                    campaigns that are never reported to NHTSA.
                  </p>
                </div>
              )}
              {recalls.items.length > 0 && (
                <div className="mt-3 space-y-3">
                  {recalls.items.slice(0, 8).map((r, i) => (
                    <div key={`${r.campaign || i}`} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-semibold">{r.component || 'Recall campaign'}</div>
                        <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[11px] text-ink-2">
                          {r.source}
                        </span>
                      </div>
                      {r.campaign && <div className="mt-1 text-xs text-ink-2">Campaign {r.campaign}</div>}
                      {r.summary && <p className="mt-2 text-sm leading-relaxed text-ink-2">{r.summary}</p>}
                      {r.remedy && <p className="mt-2 text-sm leading-relaxed text-ink-2"><strong>Remedy:</strong> {r.remedy}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {free.safety && (
            <div className="grid gap-4 sm:grid-cols-4 mb-5">
              {[
                ['Overall', free.safety.overall],
                ['Frontal', free.safety.frontal],
                ['Side', free.safety.side],
                ['Rollover', free.safety.rollover],
              ].map(([label, v]) => {
                const rated = typeof v === 'number' && v > 0;
                return (
                  <div key={String(label)} className="rounded-xl bg-surface border border-border p-4 text-center">
                    {/* The stars are decorative: repeated ★ glyphs read out as
                        "black star black star black star" or as nothing at all,
                        so the rating is also stated in words for assistive tech
                        and the count is shown to everyone. */}
                    <div className="text-lg tracking-tight text-warn" aria-hidden="true">
                      {rated ? '★'.repeat(v as number) + '☆'.repeat(5 - (v as number)) : <span className="text-ink-2 text-sm">n/a</span>}
                    </div>
                    <div className="text-xs text-ink-2 mt-1">
                      {String(label)}
                      {rated && <span className="ml-1 font-semibold text-ink">{v}/5</span>}
                    </div>
                    <span className="sr-only">
                      {rated ? `${String(label)} rating, ${v} out of 5 stars` : `${String(label)} rating not available`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {recalls ? null : free.recalls === null ? (
            /* NHTSA unreachable. Saying "no recalls found" here would tell a
               buyer a car with an open airbag campaign is clear. */
            <div className="rounded-xl border border-border bg-surface p-4 text-sm text-ink-2">
              We couldn&apos;t reach NHTSA to check recalls just now. This is not the same as there being none, so
              please check directly at{' '}
              <a href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener" className="text-brand hover:underline">
                nhtsa.gov/recalls
              </a>{' '}
              or with a franchised dealer.
            </div>
          ) : free.recalls.length === 0 ? (
            <div className="rounded-xl border border-good/30 bg-good/5 p-4 text-sm font-semibold text-good">
              ✓ No open safety recalls found for this year, make and model
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-warn/40 bg-warn/5 p-4 text-sm font-semibold text-warn">
                {free.recalls.length} recall {free.recalls.length === 1 ? 'campaign' : 'campaigns'} found
              </div>
              {free.recalls.slice(0, 6).map((r) => (
                <div key={r.campaign} className="rounded-xl border border-border p-4">
                  <div className="text-sm font-semibold">{r.component}</div>
                  <div className="mt-1 text-xs text-ink-2">Campaign {r.campaign}</div>
                  <p className="mt-2 text-sm text-ink-2 leading-relaxed">{r.summary}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* SPEC */}
        <Section title="How this car is specified" sub="Decoded from the VIN.">
          <Row label="Body" value={factory?.bodyType || specs.bodyClass} />
          <Row label="Engine" value={factory?.engine || specs.engine} />
          <Row label="Transmission" value={factory?.transmission || specs.transmission} />
          <Row label="Drivetrain" value={factory?.drivetrain || specs.driveType} />
          <Row label="Fuel" value={factory?.fuelType || specs.fuelType} />
          <Row label="Doors" value={factory?.doors ? String(factory.doors) : specs.doors} />
          <Row label="Seats" value={factory?.seats ? String(factory.seats) : undefined} />
          <Row label="Assembled in" value={specs.plantCountry} />
          {factory && factory.warranty.length > 0 && (
            <div className="mt-5">
              <div className="text-sm font-semibold mb-2">Original factory warranty</div>
              {factory.warranty.map((w) => (
                <Row
                  key={w.type}
                  label={warrantyLabel(w.type)}
                  value={[w.months ? `${w.months} months` : null, warrantyMiles(w.miles)]
                    .filter(Boolean)
                    .join(' / ')}
                />
              ))}
            </div>
          )}
        </Section>

        {/* STANDARD EQUIPMENT */}
        {features.length > 0 && (
          <Section title="Standard equipment" sub={`${factory!.standardFeatures.length} items this trim came with as standard.`}>
            <div className="grid gap-5 sm:grid-cols-2">
              {features.slice(0, 6).map((g) => (
                <div key={g.category}>
                  <div className="text-sm font-semibold">{g.category}</div>
                  <ul className="mt-2 space-y-1 text-sm text-ink-2">
                    {g.items.slice(0, 8).map((i) => (
                      <li key={i}>• {i}</li>
                    ))}
                    {g.items.length > 8 && <li className="text-xs">+ {g.items.length - 8} more</li>}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Kept deliberately short. The old block opened with a breakdown of who
            supplies what and led with the caveat rather than the product, which
            read as an apology for the report the customer had just bought. The
            two things a buyer genuinely needs are here; the full sourcing lives
            on /methodology for editors, and is no longer advertised to
            customers. */}
        <section className="rounded-2xl border border-border bg-white p-6 text-xs leading-relaxed text-ink-2">
          <p>
            Market values are an estimate, not an appraisal. Condition and service history move a real sale price
            either side of them.
          </p>
          <p className="mt-2">
            This report does not cover vehicle history, title or salvage records. For those, use an NMVTIS-approved
            provider.
          </p>
        </section>
      </div>
    </div>
  );
}
