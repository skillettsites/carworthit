import type { Metadata } from 'next';
import Link from 'next/link';
import FuelCostCalc from '@/components/calc/FuelCostCalc';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fuel Cost Calculator: What a Car Costs to Fuel',
  description: 'Free fuel cost calculator. Enter miles per year, MPG and gas price to see what any car costs to fuel per month, per year and over 5 years.',
  alternates: { canonical: `${SITE_URL}/fuel-cost-calculator` },
};

const faqs = [
  { q: 'How do I calculate my annual fuel cost?', a: 'Divide your yearly miles by the car’s combined MPG to get gallons used, then multiply by the price per gallon. For example, 12,000 miles at 28 MPG is about 429 gallons, and at $3.30 a gallon that is roughly $1,415 a year. The calculator above does this instantly.' },
  { q: 'What is a good MPG for saving money on gas?', a: 'For a gas car, 30 MPG or better keeps fuel costs reasonable. Hybrids like the Toyota Prius reach 45 to 55 MPG and cut fuel bills roughly in half. If fuel cost is a priority, compare the EPA combined MPG of the exact models you are considering.' },
  { q: 'How much does gas cost per year for the average driver?', a: 'The average US driver covers about 12,000 to 15,000 miles a year. In a typical 25 to 30 MPG car at around $3.30 a gallon, that works out to roughly $1,300 to $1,900 a year in fuel, though it varies widely by vehicle and local gas prices.' },
  { q: 'Where do I find a specific car’s real MPG?', a: 'The EPA publishes official combined, city and highway MPG for every model. On CarWorthIt you can run a car’s VIN to pull its real EPA figures along with an estimated annual fuel cost and 5-year cost to own.' },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Fuel Cost Calculator', url: `${SITE_URL}/fuel-cost-calculator` },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Fuel Cost Calculator</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          See what any car really costs to fuel. Enter how far you drive, the car&apos;s MPG, and your local gas price to
          get the cost per month, per year, and over five years.
        </p>

        <div className="mt-8">
          <FuelCostCalc />
        </div>

        <div className="mt-10 space-y-4 text-ink-2 leading-relaxed">
          <h2 className="text-2xl font-bold text-ink">How the fuel cost calculator works</h2>
          <p>
            The math is simple: your yearly miles divided by the car&apos;s combined MPG gives the gallons you burn, and
            multiplying by the price per gallon gives your fuel bill. A more efficient car, fewer miles, or cheaper gas all
            lower the number. Over five years, even a small MPG difference adds up to real money.
          </p>
          <h2 className="text-2xl font-bold text-ink">Tips to cut your fuel costs</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Choose a higher-MPG model. A jump from 22 to 32 MPG can save over $600 a year for an average driver.</li>
            <li>Keep tires properly inflated and remove roof racks when not in use.</li>
            <li>Combine trips and ease off hard acceleration and braking.</li>
            <li>For high-mileage drivers, a hybrid can pay back its price premium through fuel savings alone.</li>
          </ul>
        </div>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold">Want a specific car&apos;s real running costs?</h2>
          <p className="mt-2 text-ink-2">Run its VIN for the actual EPA MPG, annual fuel cost, and full 5-year cost to own.</p>
          <div className="mt-5 max-w-xl mx-auto"><SearchBox /></div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-white p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {f.q}<span className="text-brand group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-ink-2 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 text-sm">
          <Link href="/depreciation-calculator" className="text-brand font-semibold hover:underline">Try the depreciation calculator →</Link>
        </div>
      </div>
    </>
  );
}
