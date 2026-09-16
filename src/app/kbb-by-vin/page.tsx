import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';

// "kbb by vin", "kelley blue book vin lookup", "blue book value by vin": about
// 14,800 searches a month (Google Keyword Planner, US, September 2026) from
// people who want a value for a specific car and reach for the name they know.
// The honest answer is that KBB will take a VIN but still values the trim, and
// that a listing-based VIN valuation is a different product. Every claim about
// another site below was read on that site on the date shown.

const CHECKED = 'September 16, 2026';
const price = `$${PRODUCTS.valuation.price}`;

export const metadata: Metadata = {
  title: 'KBB by VIN: Can You Get a Blue Book Value from a VIN?',
  description:
    'Kelley Blue Book accepts a VIN, but the VIN only fills in the trim; the value is still KBB’s trim figure at a condition you pick. What a VIN value actually is, who offers one, and how to get one with the listings behind it.',
  alternates: { canonical: `${SITE_URL}/kbb-by-vin` },
};

const providers = [
  {
    name: 'Kelley Blue Book',
    inputs: 'VIN or license plate, or year, make and model; then mileage, ZIP, condition and options',
    vinDoes: 'Identifies the year, make, model and trim so you do not pick them from menus',
    output: 'Blue Book Trade-In Range, Private Party Value and an Instant Cash Offer from participating dealers',
    cost: 'Free; the site is paid by dealer leads',
    source: 'kbb.com/whats-my-car-worth and kbb.com/faq/values',
  },
  {
    name: 'Edmunds',
    inputs: 'VIN or license plate; then mileage, ZIP and condition',
    vinDoes: 'Identifies the trim and features',
    output: 'An appraisal based on year, make, model, trim, mileage, depreciation and features, plus dealer offers',
    cost: 'Free; paid by dealer leads',
    source: 'edmunds.com/appraisal',
  },
  {
    name: 'Carfax',
    inputs: 'VIN or license plate',
    vinDoes: 'Pulls the Carfax history for that car',
    output: 'A History-Based Value that considers reported accidents or damage, number of owners and service history',
    cost: 'Free; paid by dealer leads',
    source: 'carfax.com/value',
  },
  {
    name: 'CarGurus',
    inputs: 'License plate or VIN, or make, model, year and state',
    vinDoes: 'Identifies the car for the Instant Market Value',
    output: 'Trade-in value, private sale value and CarGurus Instant Market Value, an estimated retail price from listings',
    cost: 'Free; paid by dealer leads',
    source: 'cargurus.com/research/car-valuation',
  },
  {
    name: 'CarWorthIt',
    inputs: 'VIN, then odometer reading and ZIP; the asking price if you have one',
    vinDoes: 'Fixes the exact trim and factory options, then prices that car at its mileage',
    output: 'A local value, the national low, average and high from live listings, the nearest listings themselves, and a verdict on the asking price',
    cost: `${price} for the valuation, no account, no dealer contact`,
    source: 'This site',
  },
];

const steps = [
  { name: 'Find the VIN', text: 'Seventeen characters on the driver-side dashboard through the windshield, the door-jamb sticker, the title, the insurance card or the seller’s listing.' },
  { name: 'Decode it free', text: 'Enter it on CarWorthIt. The year, make, model, trim, engine, open recalls, safety ratings and running costs come back at no cost, with no account.' },
  { name: 'Add mileage and ZIP', text: `Those two numbers change the answer by thousands of dollars. From ${price} you get the value at that mileage in that market, with the listings it was built from.` },
];

const faqs = [
  {
    q: 'Does Kelley Blue Book let you look up a value by VIN?',
    a: `Yes. On its "What's My Car Worth?" page KBB accepts a VIN or a license plate as well as a year, make and model (read on kbb.com, ${CHECKED}). The VIN identifies the trim for you. You still choose mileage, ZIP code, condition and options, and the result is Kelley Blue Book's own value for that trim, not a figure built from that car's listings.`,
  },
  {
    q: 'Is the KBB VIN lookup free?',
    a: 'Yes. Kelley Blue Book, Edmunds, Carfax and CarGurus all give a value at no charge; they are paid by the dealers who receive your details when you ask for an offer. CarWorthIt charges a small one-off fee and sends nothing to a dealer.',
  },
  {
    q: 'Why does KBB ask what condition my car is in?',
    a: `Because its values are published per condition grade. KBB's own FAQ says most vehicles it values are in "Good" condition and that "most people tend to overestimate the condition of their car" (kbb.com/faq/values, ${CHECKED}). A listing-based value sidesteps the question: it shows what sellers are asking for the same car and lets you judge condition against the pictures and the inspection.`,
  },
  {
    q: 'Is a VIN value more accurate than a year, make and model value?',
    a: 'It is more specific. The VIN fixes the trim, engine, drivetrain and, with a build record, the factory options, so two cars that share a year and model but not a trim are not averaged together. Accuracy then depends on the data behind the number and how recent it is; the page you are reading dates every figure.',
  },
  {
    q: 'Can I get a value by VIN for a car I am buying, not selling?',
    a: 'Yes, and that is the case CarWorthIt is built for. The free valuation sites are designed around a seller asking for an offer. A buyer wants the opposite: whether the asking price is fair, how many comparable cars nearby are cheaper, and what to offer. The paid report answers those with the listings printed.',
  },
  {
    q: 'What does CarWorthIt show that a free VIN value does not?',
    a: 'The evidence. Alongside the local value you get the national low, average and high from live listings for that exact model at your mileage, the ten price bands those listings fall into, and the nearest listings by distance with their mileage and price. You can see why the number is the number.',
  },
  {
    q: 'Is CarWorthIt part of Kelley Blue Book?',
    a: 'No. We are not affiliated with Kelley Blue Book, Edmunds, Carfax, CarGurus or any dealer group, and we do not republish their values. We also do not sell vehicle history reports.',
  },
];

export default function Page() {
  return (
    <div className="container-x py-14 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqSchema(faqs),
            howToSchema('How to look up a car value by VIN', 'Three steps from the VIN to a dated value with the listings behind it.', steps),
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'KBB by VIN', url: `${SITE_URL}/kbb-by-vin` },
            ]),
          ]),
        }}
      />
      <h1 className="text-4xl font-extrabold">KBB by VIN: can you get a Blue Book value from a VIN?</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-2">
        Yes, with a catch. Kelley Blue Book accepts a VIN on its valuation page (read on kbb.com, {CHECKED}), but the VIN only fills in the year, make, model and trim. You still pick mileage, ZIP, condition and options, and the result is KBB&apos;s own figure for that trim. A value built <em>from</em> that car&apos;s listings is a different thing, and this page explains both.
      </p>

      <div className="mt-8 rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <h2 className="text-xl font-bold">Look up a car by VIN now</h2>
        <p className="mt-2 text-sm text-ink-2">Free specification, recalls and running costs. The valuation with the listings behind it is {price}.</p>
        <div className="mt-4"><VinForm size="md" /></div>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">Who values a car by VIN, and what the VIN actually does</h2>
      <p className="mt-3 leading-relaxed text-ink-2">Each row was read on the provider&apos;s own page on {CHECKED}. None of them is affiliated with this site.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-ink-2">
              <th className="py-2 pr-3 font-medium">Site</th>
              <th className="py-2 pr-3 font-medium">Asks for</th>
              <th className="py-2 pr-3 font-medium">What the VIN does</th>
              <th className="py-2 pr-3 font-medium">What you get</th>
              <th className="py-2 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.name} className="border-b border-border/60 align-top last:border-0">
                <td className="py-3 pr-3 font-semibold">{p.name}<div className="mt-1 text-[11px] font-normal text-ink-2">{p.source}</div></td>
                <td className="py-3 pr-3 text-ink-2">{p.inputs}</td>
                <td className="py-3 pr-3 text-ink-2">{p.vinDoes}</td>
                <td className="py-3 pr-3 text-ink-2">{p.output}</td>
                <td className="py-3 text-ink-2">{p.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">A trim value and a listing value are not the same number</h2>
      <p className="mt-3 leading-relaxed text-ink-2">
        Kelley Blue Book says it &quot;reports vehicle values by analyzing actual transactions in the market&quot;, updates trade-in values weekly, and that its &quot;promise is to report dependable values, not set prices&quot; (kbb.com/faq/values, {CHECKED}). That is a reference figure for a trim in a stated condition. A listing-based valuation starts from the other end: the cars of that exact year, model and trim currently for sale, each adjusted to your mileage, with the low, the average, the high and the spread between them. On a 2018 Chevrolet Equinox LT at 73,000 miles, for example, the national feed held 897 listings on September 15, 2026 with a standard deviation of $2,773 around a $14,547 mean: a one-in-three chance any single car sits more than $2,700 from the average. Any one number, KBB&apos;s or ours, lives inside that band, which is why the report prints the band.
      </p>

      <h2 className="mt-12 text-2xl font-extrabold">How to look up a car value by VIN</h2>
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
        Related: <Link href="/is-kbb-accurate" className="text-brand hover:underline">Is Kelley Blue Book accurate?</Link>,{' '}
        <Link href="/how-much-is-my-car-worth" className="text-brand hover:underline">How much is my car worth?</Link>,{' '}
        <Link href="/car-value" className="text-brand hover:underline">used car values by model</Link>,{' '}
        <Link href="/blog/kbb-vs-edmunds-vs-nada" className="text-brand hover:underline">KBB vs Edmunds vs NADA</Link>.
      </p>
      <p className="mt-4 text-xs text-ink-2">Kelley Blue Book and Blue Book are trademarks of Kelley Blue Book Co., Inc. Edmunds, Carfax and CarGurus are trademarks of their owners. CarWorthIt is independent of all of them. Checked {CHECKED}.</p>
    </div>
  );
}
