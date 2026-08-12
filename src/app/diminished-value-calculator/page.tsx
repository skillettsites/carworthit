import type { Metadata } from 'next';
import Link from 'next/link';
import DiminishedValueCalc from '@/components/calc/DiminishedValueCalc';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Diminished Value Calculator: What 17c Says Your Claim Is Worth',
  description:
    'Free diminished value calculator using the 17c formula insurers apply. See what they will offer after an accident, why the number comes out low, and when to challenge it.',
  alternates: { canonical: `${SITE_URL}/diminished-value-calculator` },
};

const faqs = [
  {
    q: 'What is diminished value?',
    a: 'Diminished value is the money a vehicle loses simply because it now has an accident on its record, even after every repair is done perfectly. Two identical cars, same year, same mileage, same condition: the one with a reported accident sells for less. That gap is the diminished value, and in many states you can claim it from the at-fault driver’s insurer.',
  },
  {
    q: 'What is the 17c formula?',
    a: 'The 17c formula is the method most US insurers use to calculate a diminished value offer. It takes the pre-accident value, caps it at 10 percent, then multiplies by a damage-severity factor and a mileage factor. It is named after paragraph 17c of a Georgia court settlement, and its status is worth understanding: it is an insurer’s negotiating position, not a law and not a legal standard.',
  },
  {
    q: 'Why does the calculator sometimes return $0?',
    a: 'Because the formula is built to. The mileage multiplier drops to zero at 100,000 miles, and the damage multiplier drops to zero without structural damage, so 17c can return $0 on a car that has genuinely lost thousands. That is not a flaw in this tool; it is the formula doing what it was designed to do, and it is the strongest single reason to treat a 17c offer as an opening bid.',
  },
  {
    q: 'Is the 10 percent cap a legal limit?',
    a: 'No. The 10 percent cap is the insurer’s own convention, applied for consistency across claims. No statute sets it. If your actual loss is demonstrably larger, the cap is a starting point to argue against, supported by evidence of what comparable cars without an accident history are selling for.',
  },
  {
    q: 'Can I claim diminished value in my state?',
    a: 'It depends where you are and who was at fault. Most states allow a third-party claim against the at-fault driver’s insurer; first-party claims against your own policy are far more restricted, and a handful of states do not recognise the claim at all. Check the rules where the accident happened, not where you live, if they differ.',
  },
  {
    q: 'How do I prove what my car is actually worth?',
    a: `You need evidence of what comparable vehicles are selling for now. CarWorthIt prices a specific VIN at its real mileage against cars listed near your ZIP code and shows the local average, low and high, from $${PRODUCTS.valuation.price}. That is the kind of like-for-like local figure an adjuster has to engage with, rather than a national average.`,
  },
];

const RELATED = [
  { slug: 'what-is-diminished-value', title: 'What is diminished value, and who pays it' },
  { slug: 'how-to-calculate-diminished-value', title: 'How to calculate diminished value' },
  { slug: 'how-to-file-a-diminished-value-claim', title: 'How to file a diminished value claim' },
  { slug: 'diminished-value-by-state', title: 'Diminished value rules by state' },
  { slug: 'does-an-accident-lower-car-value', title: 'Does an accident lower a car’s value?' },
  { slug: 'trade-in-value-after-accident', title: 'Trade-in value after an accident' },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Diminished Value Calculator', url: `${SITE_URL}/diminished-value-calculator` },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <h1 className="text-3xl md:text-4xl font-extrabold">Diminished Value Calculator</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          Work out what an insurer will offer for the value your car lost in an accident, using the same 17c formula
          they use. Free, and nothing to sign up for.
        </p>

        <div className="mt-6">
          <DiminishedValueCalc />
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">What this number actually is</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          It is the insurer&apos;s number, not necessarily yours. That distinction is the whole point of showing the
          working above rather than a single figure.
        </p>
        <p className="mt-3 leading-relaxed text-ink-2">
          The 17c formula takes your car&apos;s pre-accident value, caps the claim at 10 percent of it, then applies two
          multipliers that only ever reduce the result: one for how bad the damage was, one for how many miles the car
          had done. Nothing in the formula can increase the number above that 10 percent ceiling.
        </p>
        <p className="mt-3 leading-relaxed text-ink-2">
          It takes its name from paragraph 17c of a Georgia class-action settlement, and it has no statutory force
          anywhere. Insurers apply it because it is consistent and predictable, not because it is required or because it
          reflects what the market does to an accident-reported car.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">Where the formula is hardest to defend</h2>
        <ul className="mt-3 space-y-3 text-ink-2">
          <li>
            <strong>The mileage multiplier hits zero at 100,000 miles.</strong> A 105,000-mile truck with severe
            structural damage returns exactly $0 under 17c. A buyer will still pay less for it.
          </li>
          <li>
            <strong>No structural damage means no claim.</strong> Cosmetic repairs still show on a vehicle history
            report, and buyers still discount for them.
          </li>
          <li>
            <strong>The 10 percent cap is arbitrary.</strong> It is a convention for processing claims at scale, not a
            measurement of anything.
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-ink-2">
          None of that makes 17c useless. It tells you what the opening offer will be and how it was reached, which is
          exactly what you need before deciding whether to accept it or evidence a larger loss.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">How to argue for more</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          An adjuster is unlikely to move on an assertion, and quite likely to move on comparable local listings. What
          helps is a like-for-like figure: what the same year, make, trim and mileage sells for near you without an
          accident on record, against what yours is now worth with one.
        </p>
        <p className="mt-3 leading-relaxed text-ink-2">
          CarWorthIt prices a specific VIN at its actual odometer reading against vehicles currently listed around your
          ZIP code, from ${PRODUCTS.valuation.price}, and shows the local average alongside the lowest and highest
          asking prices. To be straight with you: it prices your car, it does not produce a formal diminished-value
          appraisal, and for a large claim an independent appraiser is worth the money.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">Read next</h2>
        <ul className="mt-3 space-y-2">
          {RELATED.map((r) => (
            <li key={r.slug}>
              <Link href={`/blog/${r.slug}`} className="text-brand underline">
                {r.title}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-2xl font-extrabold">Common questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-1 leading-relaxed text-ink-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <StickyVinCta />
    </>
  );
}
