import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';
import { getModelIndex } from '@/lib/model-values';

// The head term: "how much is my car worth", 40,500 searches a month (Google
// Keyword Planner, US, September 2026), plus "what is my car worth" at 22,200
// and "my car value" at 33,100. Page one is Carfax, CarGurus, KBB and dealer
// blogs, none of which puts a dated number on the page. This one does: a real
// valuation with its count, its window and its spread, then the way to get the
// same for the reader's own VIN.

export const revalidate = 86400;

const CHECKED = 'September 16, 2026';
const price = `$${PRODUCTS.valuation.price}`;
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export const metadata: Metadata = {
  title: `How Much Is My Car Worth? Real Listings by VIN, from ${price}`,
  description:
    `What a used car is worth in the US right now, with a dated example from live listings, the three kinds of value explained, and a VIN valuation from ${price} that shows the listings behind the number. Free VIN report first.`,
  alternates: { canonical: `${SITE_URL}/how-much-is-my-car-worth` },
};

const steps = [
  { name: 'Enter the VIN', text: 'Seventeen characters, on the dashboard through the windshield, the door-jamb sticker, the title or the listing. The free report confirms the exact trim, engine and drivetrain.' },
  { name: 'Add the odometer reading and your ZIP code', text: 'Mileage is the biggest single driver of value after age, and the same car sells for different money in different markets. Both go into the price.' },
  { name: 'Read the value with its evidence', text: `From ${price}: the local value, the national low, average and high from live listings, the price bands, the nearest listings by distance with their mileage and price, and a verdict on the asking price if you gave one.` },
];

const faqs = [
  {
    q: 'How much is my car worth?',
    a: `What buyers are currently paying for the same year, make, model and trim at your mileage in your market. As a dated example, a 2021 Toyota Corolla LE at 50,000 miles had a national retail value of $18,487 on ${CHECKED}, from 1,600 US listings observed August 17 to September 7, 2026, ranging $15,744 to $21,229. Your car sits somewhere in that kind of band depending on trim, mileage, condition and where it is, which is what a VIN valuation pins down.`,
  },
  {
    q: 'What is the difference between trade-in value, private-party value and retail value?',
    a: `Kelley Blue Book's own definitions (kbb.com/faq/values, read ${CHECKED}): trade-in is "what you can expect to receive for your current car when trading it in at a dealer"; private party is "what a buyer can expect to pay when buying a used car from a private party"; retail is what a dealer asks after reconditioning. Trade-in is the lowest of the three and retail the highest. CarWorthIt's listing figures are retail asking prices, so a private sale usually lands a little under them and a trade-in offer well under.`,
  },
  {
    q: 'Is a car value by VIN free?',
    a: `The VIN report is free and needs no account: year, make, model, trim, open recalls, crash-test ratings and running costs. The valuation is ${price} because it uses live, licensed listing data for that exact model at your mileage rather than a national trim average. Kelley Blue Book, Edmunds, Carfax and CarGurus give a free figure and are paid by the dealers who then contact you; we send nothing to a dealer.`,
  },
  {
    q: 'How accurate is an online car value?',
    a: 'Only as accurate as the spread of the market allows. Measured on live listings in September 2026, common cars cluster within about 10 to 20 percent of their average and old or rare cars spread wider. A good valuation shows you that band and how many cars are in it, rather than a single number with no count behind it.',
  },
  {
    q: 'What lowers a car’s value the most?',
    a: 'Mileage and age, then accident or title history, then condition and missing service records. Trim and factory options move it too, which is why two cars with the same year and model can be thousands of dollars apart. The valuation prices your VIN at its mileage; it does not include accident history, which needs a separate NMVTIS-approved report.',
  },
  {
    q: 'Does the value depend on where I live?',
    a: 'Yes. Trucks hold value differently in Texas than in Vermont; convertibles differently in Florida than in Michigan. The report prices the car in the market around your ZIP code and, because every listing in the national feed carries a ZIP, shows you the nearest cars by distance.',
  },
  {
    q: 'Is this a Kelley Blue Book value?',
    a: 'No. We are not affiliated with Kelley Blue Book, Edmunds or J.D. Power and we do not republish their values. Ours come from live US sales listings and carry the date they were observed.',
  },
  {
    q: 'Do you buy cars or make offers?',
    a: 'No. We do not buy cars, we are not a dealer and we do not pass your details to one. You get the value and the evidence, and you decide what to do with it.',
  },
];

export default async function Page() {
  const index = await getModelIndex();
  const popular = index.filter((r) => r.pricing.count >= 100).sort((a, b) => b.pricing.count - a.pricing.count).slice(0, 12);

  return (
    <div className="container-x py-14 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqSchema(faqs),
            howToSchema('How to find out how much your car is worth', 'From the VIN to a dated value with the listings behind it, in three steps.', steps),
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'How much is my car worth', url: `${SITE_URL}/how-much-is-my-car-worth` },
            ]),
          ]),
        }}
      />

      <h1 className="text-4xl font-extrabold">How much is my car worth?</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-2">
        What the same year, make, model and trim is selling for at your mileage in your market. A dated example: a 2021 Toyota Corolla LE at 50,000 miles was worth <strong className="text-ink">$18,487</strong> at retail on {CHECKED}, from 1,600 US listings observed August 17 to September 7, 2026, ranging $15,744 to $21,229. Your car sits inside a band like that, and the VIN valuation shows you where, with the listings printed.
      </p>

      <div className="mt-8 rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <h2 className="text-xl font-bold">Value your car by VIN</h2>
        <p className="mt-2 text-sm text-ink-2">Free VIN report first. Valuation with the nearest listings from {price}, Full Report ${PRODUCTS.worthit.price}, Negotiation Bundle ${PRODUCTS.negotiation.price}. No account, nothing sent to a dealer.</p>
        <div className="mt-4"><VinForm size="md" /></div>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">The three values, and which one you are looking at</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-ink-2">
              <th className="py-2 pr-3 font-medium">Value</th>
              <th className="py-2 pr-3 font-medium">Who pays it</th>
              <th className="py-2 pr-3 font-medium">Where it sits</th>
              <th className="py-2 font-medium">Where you see it</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60 align-top"><td className="py-2 pr-3 font-semibold">Trade-in</td><td className="py-2 pr-3 text-ink-2">A dealer taking your car against another</td><td className="py-2 pr-3 text-ink-2">Lowest: the dealer must recondition and resell</td><td className="py-2 text-ink-2">KBB Trade-In Range, dealer offers, Carvana and CarMax offers</td></tr>
            <tr className="border-b border-border/60 align-top"><td className="py-2 pr-3 font-semibold">Private party</td><td className="py-2 pr-3 text-ink-2">A private buyer, sold as is</td><td className="py-2 pr-3 text-ink-2">Middle</td><td className="py-2 text-ink-2">KBB Private Party Value, CarGurus private sale value</td></tr>
            <tr className="align-top"><td className="py-2 pr-3 font-semibold">Retail</td><td className="py-2 pr-3 text-ink-2">A buyer at a dealer</td><td className="py-2 pr-3 text-ink-2">Highest: advertised asking prices</td><td className="py-2 text-ink-2">Dealer listings; the CarWorthIt low, average and high; CarGurus Instant Market Value</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-ink-2">Definitions of trade-in and private party from kbb.com/faq/values; CarGurus value types from cargurus.com/research/car-valuation; both read {CHECKED}. Names are trademarks of their owners; this site is independent of all of them.</p>

      <h2 className="mt-12 text-2xl font-extrabold">How to find out, in three steps</h2>
      <ol className="mt-4 space-y-4">
        {steps.map((s, i) => (
          <li key={s.name} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</div>
            <div>
              <div className="font-bold">{s.name}</div>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-2xl font-extrabold">What moves the number</h2>
      <ul className="mt-3 space-y-2 leading-relaxed text-ink-2">
        <li><strong className="text-ink">Mileage.</strong> On the Corolla above the feed moved the value by $1,684 to bring the pool to 50,000 miles. A car 30,000 miles either side of the average is a different price.</li>
        <li><strong className="text-ink">Trim and options.</strong> The VIN fixes the trim; the build record in the Full Report lists the factory options and what they cost new.</li>
        <li><strong className="text-ink">Location.</strong> Every listing in the feed carries a ZIP code, so the report shows the nearest cars and their prices, not a national average dressed up as local.</li>
        <li><strong className="text-ink">Condition and history.</strong> Neither is in any online number, KBB&apos;s or ours. They are what the inspection and an NMVTIS history report are for.</li>
        <li><strong className="text-ink">Time.</strong> Listings are refreshed daily and the report prints the observation window. A value without a date is a memory.</li>
      </ul>

      {popular.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-extrabold">Values by model, dated</h2>
          <p className="mt-3 text-sm text-ink-2">National retail values for the model years people ask about most, each from hundreds of live listings. The full list is on the <Link href="/car-value" className="text-brand hover:underline">car values</Link> page.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {popular.map((r) => (
              <Link key={r.slug} href={`/car-value/${r.slug}`} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm hover:border-brand">
                <span className="font-semibold">{r.year} {r.make} {r.model}</span>
                <span className="text-ink-2">{usd(r.pricing.avg)}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-12 text-2xl font-extrabold">Questions</h2>
      <div className="mt-4 space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-border bg-white p-5">
            <h3 className="font-bold">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink-2">
        Related: <Link href="/kbb-by-vin" className="text-brand hover:underline">KBB by VIN</Link>,{' '}
        <Link href="/is-kbb-accurate" className="text-brand hover:underline">is Kelley Blue Book accurate</Link>,{' '}
        <Link href="/check-car-value" className="text-brand hover:underline">check a car&apos;s value by VIN</Link>,{' '}
        <Link href="/negotiate-used-car-price" className="text-brand hover:underline">negotiate a used car price</Link>,{' '}
        <Link href="/sample-report" className="text-brand hover:underline">see a real sample report</Link>.
      </p>
      <p className="mt-4 text-xs text-ink-2">Example figures from the national retail listings feed for VIN 5YFVPMAE9MP195479 at 50,000 miles, read {CHECKED}. We do not sell vehicle history reports. Checked {CHECKED}.</p>
    </div>
  );
}
