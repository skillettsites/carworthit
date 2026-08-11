import type { Metadata } from 'next';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { serviceSchema, faqSchema } from '@/lib/schema';

// The root layout no longer pins an og:url, because every page without its own
// openGraph inherits it wholesale. The homepage claims it here instead.
//
// Title and H1 used to point at different audiences: the title sold "price my
// car by VIN" (a seller valuing their own car) while the H1 asked "is this car
// worth it" (a buyer judging someone else's). Google Keyword Planner, United
// States, puts 27,100/mo on "what is my car worth" and 14,800/mo on the VIN
// phrasings ("car value by vin", "car worth by vin", "price my car by vin").
//
// The title leads on the VIN cluster despite it being the smaller number. The
// generic term is answered free by Kelley Blue Book, Edmunds, CarGurus and
// Carvana, who are paid for the lead and hold page one; "by VIN" is the half
// where pricing the actual car at its actual mileage beats a trim average, so
// it is the only half worth competing for. Both phrasings still appear, and
// both now say "this car" rather than one saying "my car": the product judges
// a car you are looking at, and a seller sent here by a seller-intent title
// would bounce.
//
// The description is kept under 160 characters so Google does not truncate
// "No signup", which is the sharpest contrast with KBB's question wizard.
export const metadata: Metadata = {
  title: 'Car Value by VIN: What Is This Car Worth?',
  description:
    'Price any car by its VIN, at its real mileage, against cars for sale near you. Free VIN report with recalls, safety and running costs. No signup.',
  openGraph: { url: SITE_URL },
};

const price = `$${PRODUCTS.valuation.price}`;

const features = [
  {
    icon: '🎯',
    title: 'What this car is worth',
    body: 'This VIN, at its odometer reading, in your local market. Not a national average for the model.',
  },
  {
    icon: '⚖️',
    title: 'A straight verdict',
    body: 'Tell us the asking price and we say whether it is fair, cheap, or too much. Including when it is too much.',
  },
  {
    icon: '🤝',
    title: 'A Negotiation Bundle',
    body: 'Your opening offer, your target and your walk-away price, with the evidence to argue for each one.',
  },
  {
    icon: '🏷️',
    title: 'What it cost new',
    body: 'The original window sticker for this VIN: MSRP, dealer invoice and the options it was built with.',
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
  { n: '1', title: 'Enter the VIN', body: 'Seventeen characters, on the windshield, door jamb or the listing itself.' },
  { n: '2', title: 'See the free report', body: 'Specs, open recalls, safety ratings and running costs, instantly. No signup.' },
  { n: '3', title: 'Add mileage and ZIP', body: `From ${price}, see what it is worth, whether the price is fair, and what to pay.` },
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
    q: 'What is in the Negotiation Bundle?',
    a: `Three prices for the specific car you are looking at: where to open, what to aim to pay, and the point above which you should walk away. Each one is derived from what comparable cars are listed at near you, so you can defend it out loud. It also sets out your case for paying less, with every claim sourced, what the seller is likely to argue back, the order to say things in, and the checks to make before any money moves. It costs $${PRODUCTS.negotiation.price} and includes both other reports.`,
  },
  {
    q: 'Is the valuation for my exact car, or just cars like it?',
    a: 'For your exact car. We start from the VIN, which fixes the precise trim and the factory options it was built with, then price it at your odometer reading in the market around your ZIP code. What comparable cars are currently listed for is the evidence we price against, because that is what any valuation anywhere is measured against, but the figure you get is for your vehicle rather than an average of the model. The one thing no data feed can see is condition, so a car that has been abused or immaculately kept will sit either side of it.',
  },
  {
    q: 'How is this different from Kelley Blue Book?',
    a: 'KBB works from year, make, model and trim, and asks a series of questions before giving you a figure. CarWorthIt starts from the VIN, which already knows the exact trim and factory options, then prices it at your mileage against cars listed near you. We are independent and not affiliated with Kelley Blue Book.',
  },
  {
    q: 'Do you sell a vehicle history report?',
    a: 'No. Accident and title-brand data in the United States sits behind licenses we do not hold, and we would rather say so than sell a thin substitute. For title and salvage history use an NMVTIS-approved provider. CarWorthIt covers what a car is worth, what it cost new and what it costs to run.',
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
          // Organization and WebSite are already emitted by the root layout on
          // every page. Repeating them here shipped both twice on the homepage.
          __html: JSON.stringify([serviceSchema(), faqSchema(faqs)]),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="container-x relative py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Both target phrases live in the H1 rather than one of them. The
                generic "what is my car worth" has the volume (27,100/mo) but
                page one is Kelley Blue Book, Edmunds and CarGurus answering it
                free; "by VIN" (14,800/mo) is the half where pricing the actual
                car beats a trim average. Leading on the generic alone forfeits
                the only phrase we can win. */}
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
              What is this car{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                worth
              </span>
              ?
              <span className="mt-3 block text-2xl font-bold text-slate-300 md:text-3xl">
                Check any car&apos;s value by VIN
              </span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-slate-300">
              Enter the VIN. We price that exact car at its real mileage, against cars for sale near you, then tell
              you whether the asking price is fair and what to pay.
            </p>
            {/* The one line that separates us from the free valuations. Kelley
                Blue Book prices a trim at an assumed mileage; this prices the
                car in front of you. Said here because it is the reason to
                choose us, not a footnote. */}
            <p className="mt-3 text-base text-slate-400">
              Kelley Blue Book prices a trim. We price the VIN, your odometer reading and your ZIP code.
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

      {/* The Negotiation Bundle */}
      <section className="border-y border-border bg-surface">
        <div className="container-x py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
              New
            </span>
            <h2 className="mt-4 text-3xl font-bold">Knowing the number isn&apos;t the hard part</h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              Saying it out loud is. The Negotiation Bundle gives you three prices for this specific car: where to
              open, what to aim for, and the point at which you walk. Then it gives you the reasons behind each one,
              every reason sourced, plus what the seller is going to say back and how the conversation should go.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
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
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            />
            <PriceCard
              name={PRODUCTS.negotiation.name}
              price={`$${PRODUCTS.negotiation.price}`}
              note="Everything above, plus what to pay and how to get it"
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
      className={`relative rounded-2xl border p-7 text-center ${
        highlight ? 'border-2 border-brand bg-white shadow-lg ring-2 ring-brand/20' : 'border-border bg-white'
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Most useful
        </span>
      )}
      <div className="font-semibold text-ink">{name}</div>
      <div className={`mt-2 text-3xl font-extrabold ${highlight ? 'text-brand' : 'text-ink'}`}>{price}</div>
      <div className="mt-2 text-xs leading-relaxed text-ink-2">{note}</div>
    </div>
  );
}
