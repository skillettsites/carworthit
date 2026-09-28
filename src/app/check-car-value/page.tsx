import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

const price = `$${PRODUCTS.valuation.price}`;

// "Car value by VIN" is one of the three big terms on Bing, where this site
// gets nearly all of its search traffic (about 575 searches a month there,
// September 2026). The page used to be 100 words; it now answers the question
// directly, says exactly what each price buys, and links the model-value pages.
export const metadata: Metadata = {
  title: { absolute: 'Car Value by VIN: Check What a Car Is Worth | CarWorthIt' },
  description: `Check a car's value by VIN: it is priced at its real mileage against live listings near your ZIP code, with the listings shown. Free VIN report first, valuation from ${price}.`,
  alternates: { canonical: `${SITE_URL}/check-car-value` },
};

const faqs = [
  {
    q: 'How do I check a car’s value by VIN?',
    a: `Enter the 17-character VIN. The free report confirms the exact year, make, model, trim and engine, plus recalls, crash-test ratings and running costs. Then add the odometer reading and your ZIP code: the valuation, from ${price}, prices that exact car against comparable cars listed for sale and shows the national low, average and high and the nearest listings with their mileage and asking price.`,
  },
  {
    q: 'Is checking a car’s value by VIN free?',
    a: 'The VIN report is free, with no account. The market valuation is paid, because it uses live, licensed listing data for that specific vehicle at its mileage rather than a national trim average, and it shows you those listings: the national low, average and high, the price bands, and the nearest cars by distance with their mileage and price.',
  },
  {
    q: 'Why does the VIN matter for the value?',
    a: 'The VIN fixes the exact trim, engine and drivetrain, which a year, make and model search leaves open. Two cars of the same year and model can be thousands of dollars apart on trim alone, so pricing the VIN avoids valuing a base model as a top trim, or the other way round.',
  },
  {
    q: 'Does a VIN value include accident or title history?',
    a: 'No. The valuation prices the car from its specification, mileage and location against cars for sale. Accident and title-brand records in the United States sit behind licenses we do not hold; for those, use an NMVTIS-approved provider. A car with a branded title is usually worth less than any listing-based figure suggests.',
  },
];

const tiers = [
  { p: PRODUCTS.valuation, what: 'What that VIN is worth near you at its mileage, the national low, average and high from live listings, the 5 nearest listings and a verdict on the asking price.' },
  { p: PRODUCTS.worthit, what: 'Everything in the Valuation, 12 nearest listings, plus what it cost new, its factory options and standard equipment.' },
  { p: PRODUCTS.negotiation, what: 'Both reports, the 30 nearest listings, and your opening offer, target and walk-away price with the evidence for each.' },
];

export default function Page() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqSchema(faqs),
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'Car value by VIN', url: `${SITE_URL}/check-car-value` },
            ]),
          ]),
        }}
      />

      <h1 className="text-4xl font-extrabold">Car value by VIN</h1>
      <div className="mt-5 rounded-2xl border-2 border-brand/30 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brand">Short answer</p>
        <p className="mt-2 leading-relaxed text-ink">
          Enter the VIN below for a free report on exactly what the car is. Add the mileage and your ZIP code and, from{' '}
          {price}, we price that car against comparable cars for sale, show the national low, average and high, and
          print the nearest listings with their mileage and asking price.
        </p>
      </div>

      <div className="mt-8">
        <VinForm size="md" />
        <p className="mt-3 text-sm text-ink-2">Valuation {price} · Full Report ${PRODUCTS.worthit.price} · Negotiation Bundle ${PRODUCTS.negotiation.price}. One-off payments, no account.</p>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">What each price buys</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-ink-2">
              <th className="py-2 pr-3 font-medium">Report</th>
              <th className="py-2 pr-3 font-medium">Price</th>
              <th className="py-2 font-medium">What it adds</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60 align-top">
              <td className="py-2 pr-3 font-semibold">Free VIN report</td>
              <td className="py-2 pr-3">$0</td>
              <td className="py-2 text-ink-2">Year, make, model, trim and engine from NHTSA&apos;s decoder, recalls, crash-test ratings, owner complaints and running costs.</td>
            </tr>
            {tiers.map((t) => (
              <tr key={t.p.id} className="border-b border-border/60 align-top">
                <td className="py-2 pr-3 font-semibold">{t.p.name}</td>
                <td className="py-2 pr-3">${t.p.price}</td>
                <td className="py-2 text-ink-2">{t.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">What this is not</h2>
      <p className="mt-3 leading-relaxed text-ink-2">
        This is not Carfax, AutoCheck or an NMVTIS history report. We do not sell accident or title-brand data.
        CarWorthIt tells you what the car is worth, what it cost new, and what it costs to run. For title and accident
        history, see the <Link href="/best-vehicle-history-report" className="text-brand hover:underline">history report comparison</Link>.
      </p>

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
        Related: <Link href="/how-much-is-my-car-worth" className="text-brand hover:underline">how much is my car worth</Link>,{' '}
        <Link href="/car-value" className="text-brand hover:underline">used car values by model and year</Link>,{' '}
        <Link href="/kbb-by-vin" className="text-brand hover:underline">KBB by VIN</Link>,{' '}
        <Link href="/vin-decoder" className="text-brand hover:underline">free VIN decoder</Link>,{' '}
        <Link href="/sample-report" className="text-brand hover:underline">a real sample report</Link>.
      </p>
    </div>
  );
}
