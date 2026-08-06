import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { organizationSchema, websiteSchema, serviceSchema, faqSchema } from '@/lib/schema';

const price = `$${PRODUCTS.valuation.price}`;

const features = [
  {
    icon: '📍',
    title: 'Priced where you are',
    body: 'Valued against cars actually listed for sale near your ZIP code, not a national average.',
  },
  {
    icon: '🛞',
    title: 'At your real mileage',
    body: 'Two identical cars 40,000 miles apart are not worth the same. We price yours, not the model.',
  },
  {
    icon: '🏷️',
    title: 'What it cost new',
    body: 'The original window sticker for your exact VIN: MSRP, dealer invoice and the options it was built with.',
  },
  {
    icon: '⚖️',
    title: 'A straight verdict',
    body: 'Tell us the asking price and we say whether it is fair, cheap, or too much. Including when it is too much.',
  },
  {
    icon: '🔧',
    title: 'Open recalls and safety',
    body: 'NHTSA recall campaigns and 5-star crash-test ratings, free for any VIN.',
  },
  {
    icon: '⛽',
    title: 'What it costs to run',
    body: 'Official EPA fuel economy plus an estimate of five-year running costs.',
  },
];

const steps = [
  { n: '1', title: 'Enter the VIN', body: 'Seventeen characters, on the windscreen, door jamb or the listing itself.' },
  { n: '2', title: 'See the free report', body: 'Specs, open recalls, safety ratings and running costs load instantly. No signup.' },
  { n: '3', title: 'Add mileage and ZIP', body: `From ${price}, see what it is worth near you and whether the price is fair.` },
];

const faqs = [
  {
    q: 'How do I find out what my car is worth by VIN?',
    a: 'Enter the 17-character VIN, then your odometer reading and ZIP code. CarWorthIt prices the car against comparable vehicles currently listed for sale near you, at that mileage, and shows the average, the lowest and the highest local asking prices. Most free tools work from year, make and model only, which gives you a national average rather than what your car is actually worth where you live.',
  },
  {
    q: 'Why do you need my mileage and ZIP code?',
    a: 'Because both change the answer, often by thousands of dollars. Mileage is the single biggest driver of a used car’s value after age, and the same car sells for different money in different markets. A valuation that ignores either is a guess.',
  },
  {
    q: 'Is the VIN report really free?',
    a: 'Yes. Vehicle specification, open safety recalls, NHTSA crash-test ratings and EPA running costs are free for any valid VIN, with no account and no card. You only pay if you want the valuation and the original factory record.',
  },
  {
    q: 'How is this different from Kelley Blue Book?',
    a: 'KBB works from year, make, model and trim, and asks a series of questions before giving you a figure. CarWorthIt starts from the VIN, which already knows the exact trim and factory options, then prices it at your mileage against cars listed near you. We are independent and not affiliated with Kelley Blue Book.',
  },
  {
    q: 'Do you sell a vehicle history report?',
    a: 'No. Accident and title-brand data in the United States sits behind licences we do not hold, and we would rather say so than sell a thin substitute. For title and salvage history use an NMVTIS-approved provider. CarWorthIt covers what a car is worth, what it cost new and what it costs to run.',
  },
  {
    q: 'Is there a subscription?',
    a: 'No. One payment for one report, no account to create and nothing to cancel.',
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema(), websiteSchema(), serviceSchema(), faqSchema(faqs)]),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="container-x relative py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="mb-5 inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
              Priced at your mileage, near your ZIP code
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
              Price your car by VIN, and see if it&apos;s{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                really worth it
              </span>
              .
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Enter a VIN for a free report: specs, open recalls, safety ratings and running costs, no signup. Add
              your mileage and ZIP to see what it&apos;s worth against cars actually for sale near you.
            </p>
            <div className="mt-8" id="check">
              <SearchBox dark />
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span>✓ Free VIN report</span>
              <span>✓ No account needed</span>
              <span>✓ Valuations from {price}</span>
              <span>✓ No subscription</span>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="container-x py-16">
        <h2 className="text-center text-3xl font-bold">What you get</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-hover rounded-2xl border border-border bg-white p-6">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why local pricing */}
      <section className="border-y border-border bg-surface">
        <div className="container-x py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Most valuations aren&apos;t about your car</h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              Ask a typical free tool what a car is worth and it will want the year, make, model and trim, then hand
              you a national average. But mileage is the biggest single lever on a used car&apos;s value after age,
              and the same car sells for different money in Staten Island than it does in rural Texas.
            </p>
            <p className="mt-4 leading-relaxed text-ink-2">
              We start from the VIN, which already knows the exact trim and the factory options it left the line
              with. Then we price it at your odometer reading, against cars listed for sale near you. That is the
              whole difference, and it is usually worth thousands.
            </p>
            <div className="mt-8">
              <Link
                href="/sample-report"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-brand px-6 py-3 font-bold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                See a real sample report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-y border-border bg-surface">
        <div className="container-x py-16">
          <h2 className="text-center text-3xl font-bold">Pay once, or not at all</h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
            <PriceCard name="Free VIN report" price="$0" note="Specs, recalls, safety, running costs" />
            <PriceCard
              name={PRODUCTS.valuation.name}
              price={`$${PRODUCTS.valuation.price}`}
              note="Local value and a verdict on the price"
            />
            <PriceCard
              name={PRODUCTS.worthit.name}
              price={`$${PRODUCTS.worthit.price}`}
              note="Adds what it cost new and its factory options"
              highlight
            />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-ink-2">
            One-off payments, no subscription and no account. Full detail on{' '}
            <Link href="/pricing" className="text-brand font-medium hover:underline">pricing</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-16">
        <h2 className="text-center text-3xl font-bold">Common questions</h2>
        <div className="mx-auto mt-10 max-w-3xl space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-white p-6">
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-2 leading-relaxed text-ink-2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900">
        <div className="container-x py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Check a car now</h2>
            <p className="mt-3 text-slate-300">Free report in seconds. No account, no card.</p>
            <div className="mt-8">
              <SearchBox dark />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PriceCard({
  name,
  price,
  note,
  highlight,
}: {
  name: string;
  price: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-7 text-center ${
        highlight ? 'border-2 border-brand bg-white shadow-lg ring-2 ring-brand/20' : 'border-border bg-white'
      }`}
    >
      <div className="font-semibold text-ink">{name}</div>
      <div className={`mt-2 text-3xl font-extrabold ${highlight ? 'text-brand' : 'text-ink'}`}>{price}</div>
      <div className="mt-2 text-xs leading-relaxed text-ink-2">{note}</div>
    </div>
  );
}
