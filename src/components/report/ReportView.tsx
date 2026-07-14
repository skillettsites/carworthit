import Link from 'next/link';
import type { FreeReport, HistoryData, Valuation } from '@/lib/types';
import ReportUnlock from '@/components/ReportUnlock';
import BuyTrigger from '@/components/BuyTrigger';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const num = (n?: number) => (n === undefined ? '—' : n.toLocaleString('en-US'));

const btnBlue = 'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500';
const btnGreen = 'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-400 px-6 py-3 font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:brightness-110';

function Section({ title, children, id, accent }: { title: string; children: React.ReactNode; id?: string; accent?: 'green' | 'blue' }) {
  return (
    <section id={id} className={`rounded-2xl border bg-white p-6 md:p-8 ${accent === 'green' ? 'border-good/40' : accent === 'blue' ? 'border-brand/40' : 'border-border'}`}>
      <h2 className={`text-xl font-bold mb-5 ${accent === 'green' ? 'text-good' : accent === 'blue' ? 'text-brand' : ''}`}>{title}</h2>
      {children}
    </section>
  );
}
function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border last:border-0 text-sm">
      <span className="text-ink-2">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-4 text-center">
      <div className={`text-2xl font-bold ${accent ? 'text-brand' : 'text-ink'}`}>{value}</div>
      <div className="text-xs text-ink-2 mt-1">{label}</div>
    </div>
  );
}
function StarStat({ label, v }: { label: string; v?: number }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-4 text-center">
      <div className="text-lg tracking-tight text-warn">{v ? '★'.repeat(v) + '☆'.repeat(5 - v) : <span className="text-ink-2 text-sm">n/a</span>}</div>
      <div className="text-xs text-ink-2 mt-1">{label}{v ? ` · ${v}/5` : ''}</div>
    </div>
  );
}
function Flag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${ok ? 'bg-good/5 border-good/30' : 'bg-bad/5 border-bad/30'}`}>
      <div className={`font-semibold text-sm ${ok ? 'text-good' : 'text-bad'}`}>{ok ? '✓' : '✗'} {label}</div>
      <div className="text-xs text-ink-2 mt-0.5">{ok ? 'Clear' : 'Found'}</div>
    </div>
  );
}
function LockedFlag({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <div className="font-semibold text-sm text-ink-2">🔒 {label}</div>
      <div className="text-xs text-ink-2 mt-0.5">Locked</div>
    </div>
  );
}

export default function ReportView({
  free, history, valuation, unlockedHistory, unlockedValuation, vin,
}: {
  free: FreeReport;
  history?: HistoryData;
  valuation?: Valuation;
  unlockedHistory: boolean;
  unlockedValuation: boolean;
  vin: string;
}) {
  const { specs, runningCosts: rc, recalls, ownership, safety, freeValue } = free;
  const title = [specs.year, specs.make, specs.model].filter(Boolean).join(' ') || 'Vehicle';
  const fullyUnlocked = unlockedHistory && unlockedValuation;
  const safetyHasStars = !!(safety && (safety.overall || safety.frontal || safety.side || safety.rollover));
  const safetyHasOther = !!(safety && (safety.complaints !== undefined || safety.investigations !== undefined));

  return (
    <div className="bg-surface min-h-screen pb-16">
      {/* Dark vehicle header band (CCC-style) */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-surface">
        <div className="container-x max-w-3xl pt-8 pb-6">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">← New search</Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">{title}</h1>
              <p className="mt-1 font-mono text-sm tracking-wider text-slate-400">VIN {vin}</p>
            </div>
            {safety?.overall ? (
              <div className="text-right">
                <div className="text-warn text-lg">{'★'.repeat(safety.overall)}{'☆'.repeat(5 - safety.overall)}</div>
                <div className="text-xs text-slate-400">NHTSA safety</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container-x max-w-3xl -mt-2 space-y-6">
        {/* Buy cards at the top (CCC layout) */}
        {!fullyUnlocked && (
          <div className="pt-2">
            <ReportUnlock vin={vin} hasHistory={unlockedHistory} hasValuation={unlockedValuation} />
          </div>
        )}

        {/* Purchased: Valuation */}
        {unlockedValuation && valuation && (
          <Section title="Valuation" accent="green" id="valuation">
            {valuation.isSample && <SampleNote text="Sample value shown. Live market data activates when the data feed is connected." />}
            <div className="text-center mb-6">
              <div className="text-sm text-ink-2">Estimated market value</div>
              <div className="text-4xl font-extrabold text-good mt-1">{usd(valuation.mean)}</div>
              <div className="text-sm text-ink-2 mt-1">Range {usd(valuation.low)} – {usd(valuation.high)}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Trade-in" value={usd(valuation.tradeIn)} />
              <Stat label="Private party" value={usd(valuation.privateParty)} />
              <Stat label="Dealer retail" value={usd(valuation.dealerRetail)} />
            </div>
            {valuation.conditions && valuation.conditions.length > 0 && (
              <div className="mt-6">
                <div className="font-semibold text-sm mb-2">Value by condition</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-surface text-ink-2">
                        <th className="text-left font-medium px-3 py-2">Condition</th>
                        <th className="text-right font-medium px-3 py-2">Trade-in</th>
                        <th className="text-right font-medium px-3 py-2">Private party</th>
                        <th className="text-right font-medium px-3 py-2">Dealer retail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valuation.conditions.map((c) => (
                        <tr key={c.condition} className="border-t border-border">
                          <td className="px-3 py-2 font-medium">{c.condition}</td>
                          <td className="px-3 py-2 text-right">{usd(c.tradeIn)}</td>
                          <td className="px-3 py-2 text-right">{usd(c.privateParty)}</td>
                          <td className="px-3 py-2 text-right">{usd(c.dealerRetail)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="mt-6">
              <div className="font-semibold text-sm mb-2">Estimated insurance by age</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {valuation.insuranceByAge.map((i) => (
                  <div key={i.band} className="rounded-xl bg-surface border border-border p-3 text-center">
                    <div className="font-bold">{usd(i.annual)}<span className="text-xs font-normal text-ink-2">/yr</span></div>
                    <div className="text-xs text-ink-2 mt-0.5">{i.band}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Purchased: History */}
        {unlockedHistory && history && (
          <Section title="Title history, brands & mileage" accent="blue" id="history">
            {history.isSample && <SampleNote text="Sample data shown. Live title & salvage records activate when the data feed is connected." />}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Flag ok={!history.salvage} label="Salvage" />
              <Flag ok={!history.theft} label="Theft" />
              <Flag ok={!history.totalLoss} label="Total loss" />
            </div>
            {history.brands.length > 0 && (
              <div className="mb-6 rounded-lg bg-bad/5 border border-bad/30 p-4">
                <div className="font-semibold text-bad mb-2">⚠ Title brands found</div>
                <ul className="text-sm space-y-1">
                  {history.brands.map((b, i) => (<li key={i}><span className="font-medium">{b.label}</span>{b.state ? ` · ${b.state}` : ''}{b.date ? ` · ${b.date}` : ''}</li>))}
                </ul>
              </div>
            )}
            {/* Auction appearances = our accident/damage proxy (a totalled car
                almost always goes through a salvage auction). */}
            <div className="mb-6">
              <div className="font-semibold text-sm mb-2">Salvage &amp; auction history</div>
              {history.auctionRecords.length > 0 ? (
                <>
                  <div className="mb-3 rounded-lg bg-bad/5 border border-bad/30 p-3 text-sm text-bad font-medium">
                    ⚠ This VIN appeared at a salvage/insurance auction, a strong sign it was wrecked or written off.
                  </div>
                  <ul className="space-y-3">
                    {history.auctionRecords.map((a, i) => (
                      <li key={i} className="rounded-lg border border-border p-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="font-medium">{a.seller || 'Auction'}{a.location ? ` · ${a.location}` : ''}</span>
                          <span className="text-ink-2">{a.date}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-ink-2">
                          {a.primaryDamage && <span>Damage: <span className="text-ink font-medium">{a.primaryDamage}{a.secondaryDamage ? `, ${a.secondaryDamage}` : ''}</span></span>}
                          {a.condition && <span>Condition: <span className="text-ink font-medium">{a.condition}</span></span>}
                          {a.odometer ? <span>Odometer: <span className="text-ink font-medium">{num(a.odometer)} mi</span></span> : null}
                          {a.salePrice ? <span>Sold: <span className="text-ink font-medium">{usd(a.salePrice)}</span></span> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-good font-medium text-sm">✓ No salvage or insurance-auction records found for this VIN.</p>
              )}
            </div>
            <div className="mb-6">
              <div className="font-semibold text-sm mb-2">Reported mileage</div>
              {history.odometer.length ? (
                <ul className="space-y-1 text-sm">
                  {history.odometer.map((o, i) => (<li key={i} className="flex justify-between border-b border-border py-1.5"><span className="text-ink-2">{o.date}</span><span className="font-medium">{num(o.reading)} mi</span></li>))}
                </ul>
              ) : <p className="text-ink-2 text-sm">No odometer readings on record.</p>}
            </div>
            {history.titles.length > 0 && (
              <div>
                <div className="font-semibold text-sm mb-2">Title & ownership records</div>
                <ul className="space-y-1 text-sm">
                  {history.titles.map((t, i) => (<li key={i} className="flex justify-between border-b border-border py-1.5"><span>{t.type}{t.state ? ` · ${t.state}` : ''}</span><span className="text-ink-2">{t.date}</span></li>))}
                </ul>
                {history.ownersEstimate && <p className="mt-3 text-sm text-ink-2">Estimated owners: <span className="font-medium text-ink">{history.ownersEstimate}</span></p>}
              </div>
            )}
          </Section>
        )}

        {/* Free: Vehicle details */}
        <Section title="Vehicle details">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <div>
              <Row label="Year" value={specs.year} />
              <Row label="Make" value={specs.make} />
              <Row label="Model" value={specs.model} />
              <Row label="Trim / series" value={specs.trim} />
              <Row label="Body" value={specs.bodyClass} />
            </div>
            <div>
              <Row label="Engine" value={specs.engine} />
              <Row label="Fuel" value={specs.fuelType} />
              <Row label="Drive" value={specs.driveType} />
              <Row label="Transmission" value={specs.transmission} />
              <Row label="Assembled in" value={specs.plantCountry} />
            </div>
          </div>
        </Section>

        {/* Free: Safety ratings (graceful when a year isn't crash-tested) */}
        {safety && (safetyHasStars || safetyHasOther) && (
          <Section title="Safety ratings">
            {safetyHasStars ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StarStat label="Overall" v={safety.overall} />
                <StarStat label="Frontal crash" v={safety.frontal} />
                <StarStat label="Side crash" v={safety.side} />
                <StarStat label="Rollover" v={safety.rollover} />
              </div>
            ) : (
              <p className="text-ink-2 text-sm">This model year predates NHTSA&apos;s star crash-test program, so no 5-star rating is on file.</p>
            )}
            {safetyHasOther && (
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {safety.complaints !== undefined && <span className="rounded-lg bg-surface border border-border px-3 py-1.5">Owner complaints: <b>{safety.complaints}</b></span>}
                {safety.investigations !== undefined && <span className="rounded-lg bg-surface border border-border px-3 py-1.5">NHTSA investigations: <b>{safety.investigations}</b></span>}
              </div>
            )}
            {(safety.esc || safety.fcw || safety.ldw) && (
              <div className="mt-4">
                <div className="text-sm font-semibold mb-2">Driver-assist / safety tech</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {safety.esc && <span className="rounded-full bg-good/10 text-good px-3 py-1 font-medium">✓ Stability control</span>}
                  {safety.fcw && <span className="rounded-full bg-good/10 text-good px-3 py-1 font-medium">✓ Forward collision warning</span>}
                  {safety.ldw && <span className="rounded-full bg-good/10 text-good px-3 py-1 font-medium">✓ Lane departure warning</span>}
                </div>
              </div>
            )}
            <p className="mt-4 text-xs text-ink-2">Source: NHTSA 5-star Safety Ratings (NCAP).</p>
          </Section>
        )}

        {/* Inline LOCKED: Vehicle history check (opens history modal) */}
        {!unlockedHistory && (
          <Section title="Vehicle history check" accent="blue">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <LockedFlag label="Salvage" />
              <LockedFlag label="Theft" />
              <LockedFlag label="Odometer" />
            </div>
            <p className="text-ink-2 text-sm mb-5">
              Unlock the full title history for this VIN: salvage, junk, flood and rebuilt brands, the theft and
              total-loss checks, salvage-auction damage records, every reported odometer reading (to catch rollback), and
              the ownership timeline. This is the part that catches a bad car.
            </p>
            <BuyTrigger product="history" className={btnBlue}>Unlock full history · $9.99 <span>→</span></BuyTrigger>
          </Section>
        )}

        {/* Free: Running costs */}
        <Section title="Running costs">
          {rc ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat label="Combined MPG" value={rc.mpgCombined ? String(rc.mpgCombined) : '—'} />
              <Stat label="City / Highway" value={`${num(rc.mpgCity)} / ${num(rc.mpgHighway)}`} />
              <Stat label="Est. fuel / year" value={rc.annualFuelCost ? usd(rc.annualFuelCost) : '—'} accent />
            </div>
          ) : <p className="text-ink-2 text-sm">EPA running-cost data isn&apos;t available for this exact model.</p>}
          {rc?.source && <p className="mt-4 text-xs text-ink-2">Source: EPA fueleconomy.gov (15,000 mi/yr).</p>}
        </Section>

        {/* Free: Cost to own */}
        {ownership && (
          <Section title="True 5-year cost to own">
            <div className="text-center mb-6">
              <div className="text-sm text-ink-2">Estimated total to own for 5 years</div>
              <div className="text-4xl font-extrabold text-brand mt-1">{usd(ownership.fiveYearTotal)}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Depreciation" value={usd(ownership.depreciation)} />
              <Stat label="Fuel" value={usd(ownership.fuel)} />
              <Stat label="Insurance" value={usd(ownership.insurance)} />
              <Stat label="Maintenance" value={usd(ownership.maintenance)} />
              <Stat label="Repairs" value={usd(ownership.repairs)} />
              <Stat label="Taxes & fees" value={usd(ownership.taxesFees)} />
            </div>
            <p className="mt-4 text-xs text-ink-2">Fuel uses this vehicle&apos;s actual EPA figure; the rest are US national averages, adjusted for the car&apos;s age.</p>
          </Section>
        )}

        {/* Inline LOCKED: How much is this car worth (opens valuation modal) */}
        {!unlockedValuation && freeValue && (
          <Section title="How much is this car worth?" accent="green">
            <div className="text-center mb-4">
              <div className="text-sm text-ink-2">Rough estimated range</div>
              <div className="text-3xl font-extrabold text-good mt-1">{usd(freeValue.low)} – {usd(freeValue.high)}</div>
            </div>
            <p className="text-ink-2 text-sm mb-5 text-center">
              Get the exact market value for this VIN, plus trade-in, private-party and dealer-retail values, insurance
              by age and depreciation.
            </p>
            <div className="text-center">
              <BuyTrigger product="valuation" className={btnGreen}>Get exact valuation · $4.99 <span>→</span></BuyTrigger>
            </div>
          </Section>
        )}

        {/* Free: Recalls */}
        <Section title={`Safety recalls${recalls.length ? ` (${recalls.length})` : ''}`}>
          {recalls.length === 0 ? (
            <p className="text-good font-medium">✓ No open NHTSA safety recalls found for this make, model and year.</p>
          ) : (
            <ul className="space-y-4">
              {recalls.slice(0, 25).map((r, i) => (
                <li key={i} className="border-l-4 border-warn pl-4">
                  <div className="font-semibold text-sm">{r.component}</div>
                  <p className="text-sm text-ink-2 mt-1 leading-relaxed">{r.summary}</p>
                  {r.campaign && <div className="text-xs text-ink-2 mt-1">Campaign {r.campaign}</div>}
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Free-vs-complete upsell (CCC PremiumUpsellCard) */}
        {!fullyUnlocked && (
          <div className="rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
            <h3 className="text-2xl font-bold">Get the complete picture</h3>
            <p className="mt-2 text-ink-2 max-w-xl mx-auto">
              The full title history <span className="font-semibold">and</span> the exact valuation in one report, for
              $2 less than buying them separately.
            </p>
            <div className="mt-6">
              <BuyTrigger product="bundle" className={btnBlue}>Get complete report · $12.99 <span>→</span></BuyTrigger>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SampleNote({ text }: { text: string }) {
  return <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2">{text}</div>;
}
