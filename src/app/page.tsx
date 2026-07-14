import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import JsonLd from '@/components/JsonLd';
import { faqSchema, serviceSchema } from '@/lib/schema';
import { REPORT_PRICE_USD } from '@/lib/constants';

const price = `$${REPORT_PRICE_USD.toFixed(2)}`;

const reportIncludes = [
  { icon: '📋', title: 'Title history & brands', body: 'Salvage, junk, flood, lemon and rebuilt title brands, the deal-breakers.' },
  { icon: '🔢', title: 'Odometer / mileage check', body: 'Every reported reading, flagged for rollback and clocking.' },
  { icon: '🚨', title: 'Theft & total-loss', body: 'Whether the car has been reported stolen or written off.' },
  { icon: '⚙️', title: 'Full specs & recalls', body: 'Decoded from the VIN, plus every open NHTSA safety recall.' },
  { icon: '⛽', title: 'Real running costs', body: 'The car’s actual EPA MPG and what it costs to fuel each year.' },
  { icon: '💰', title: 'True 5-year cost to own', body: 'Fuel, insurance, maintenance, repairs and depreciation, the number nobody else shows you.' },
];

const steps = [
  { n: '1', title: 'Enter the VIN', body: 'Grab the 17-character VIN from the listing, dashboard or door jamb.' },
  { n: '2', title: 'See the free preview', body: 'Specs, recalls and running costs load instantly, no signup.' },
  { n: '3', title: 'Unlock the full report', body: `One ${price} payment reveals the title history, brands, mileage and cost to own.` },
];

const faqs = [
  { q: 'How is this different from Carfax?', a: `We surface the core checks that decide a purchase (title brands, salvage, odometer, theft, salvage-auction damage) and add the true cost to own that Carfax doesn’t show, for a fraction of the price. Carfax charges $44.99; we charge ${price}. We are independent and not affiliated with Carfax.` },
  { q: 'Where does the data come from?', a: 'Vehicle history (title brands, salvage, theft, total-loss and auction records) is sourced from a licensed US vehicle-data provider. Specs and recalls come from NHTSA, and running costs from the EPA’s fueleconomy.gov. CarWorthIt is not an approved NMVTIS data provider and our history report is not an official NMVTIS report.' },
  { q: 'Is the preview really free?', a: 'Yes. Specs, safety recalls and running costs are shown free for any valid VIN. You only pay if you want the full history and cost-to-own report.' },
  { q: 'Do I need an account?', a: 'No. Enter a VIN, see the preview, pay once if you want the full report. No subscription, no login.' },
];

export default function Home() {
  return (
    <>
      <JsonLd data={[serviceSchema(), faqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))]} />
      {/* Hero (dark gradient, CCC-style) */}
      <section id="check" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern-light opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="container-x relative py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 text-xs font-semibold px-3 py-1 mb-5">
              The essential checks Carfax charges $44.99 for, {price}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Know what a used car is{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                really worth
              </span>{' '}
              before you buy.
            </h1>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              Run any US car by its VIN for the title history, salvage and theft checks, real mileage, recalls,
              running costs and true 5-year cost to own. Free preview in seconds.
            </p>
            <div className="mt-8">
              <SearchBox dark />
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span>✓ Title & salvage data</span>
              <span>✓ Instant free preview</span>
              <span>✓ One-time {price}, no subscription</span>
            </div>
          </div>
        </div>
        <div className="gradient-line" />
      </section>

      {/* What's in the report */}
      <section className="container-x py-16">
        <h2 className="text-3xl font-bold text-center">What&apos;s in every report</h2>
        <p className="mt-3 text-center text-ink-2 max-w-2xl mx-auto">
          Everything you need to walk away from a bad car, and negotiate a good one.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reportIncludes.map((r) => (
            <div key={r.title} className="card-hover rounded-2xl border border-border bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-2xl">{r.icon}</div>
              <h3 className="mt-4 font-semibold text-lg">{r.title}</h3>
              <p className="mt-1 text-ink-2 text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Price comparison */}
      <section className="bg-surface border-y border-border">
        <div className="container-x py-16">
          <h2 className="text-3xl font-bold text-center">Same essential checks. A fraction of the price.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3 max-w-4xl mx-auto">
            <PriceCard name="Carfax" price="$44.99" muted />
            <PriceCard name="AutoCheck" price="$24.99" muted />
            <PriceCard name="CarWorthIt" price={price} highlight />
          </div>
          <p className="mt-6 text-center text-sm text-ink-2 max-w-2xl mx-auto">
            We focus on the checks that actually decide a purchase (title brands, salvage, odometer, theft) plus the
            cost-to-own the others leave out.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-16">
        <h2 className="text-3xl font-bold text-center">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card-hover rounded-2xl border border-border bg-white p-6">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold">{s.n}</div>
              <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
              <p className="mt-1 text-ink-2 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/sample-report" className="text-brand font-semibold hover:underline">See a sample report →</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface border-t border-border">
        <div className="container-x py-16 max-w-3xl">
          <h2 className="text-3xl font-bold text-center">Common questions</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-white p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {f.q}<span className="text-brand group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-ink-2 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-x py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to check a car?</h2>
        <p className="mt-3 text-ink-2">Free preview in seconds. Full report for {price}.</p>
        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBox />
        </div>
      </section>
    </>
  );
}

function PriceCard({ name, price, highlight, muted }: { name: string; price: string; highlight?: boolean; muted?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        highlight ? 'border-brand bg-white ring-2 ring-brand shadow-lg' : 'border-border bg-white'
      }`}
    >
      <div className={`font-semibold ${muted ? 'text-ink-2' : 'text-ink'}`}>{name}</div>
      <div className={`mt-2 text-4xl font-extrabold ${highlight ? 'text-brand' : 'text-ink'}`}>{price}</div>
      {highlight && <div className="mt-2 text-xs font-semibold text-good">Best value</div>}
    </div>
  );
}
