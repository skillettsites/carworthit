import type { Metadata } from 'next';
import Link from 'next/link';
import DepreciationCalc from '@/components/calc/DepreciationCalc';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import StickyVinCta from '@/components/StickyVinCta';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Car Depreciation Calculator: What Your Car Will Be Worth',
  description: 'Free car depreciation calculator. Enter a price and rate to see what any car will be worth in 1 to 15 years, plus how much value it loses each year.',
  alternates: { canonical: `${SITE_URL}/depreciation-calculator` },
};

const faqs = [
  { q: 'How much does a car depreciate per year?', a: 'A typical new car loses about 20 to 30 percent of its value in the first year and roughly 15 percent a year after that, so it is worth around 40 percent of its original price after five years. Reliable brands like Toyota and Honda depreciate more slowly, while luxury cars and many EVs fall faster.' },
  { q: 'Which cars hold their value best?', a: 'Trucks, and reliable brands such as Toyota, Honda, Lexus and Subaru, hold value best. A Toyota Tacoma or 4Runner can keep 60 percent or more of its value after five years. Luxury sedans, large EVs and cars with weak reliability records tend to lose value fastest.' },
  { q: 'Why do new cars lose so much value in the first year?', a: 'A car stops being new the moment it is driven off the lot, and buyers will not pay new-car prices for a used one. First-year depreciation is the steepest, often 20 to 30 percent, which is why buying a lightly used car two to three years old avoids the biggest single hit.' },
  { q: 'How do I find a specific car’s real value?', a: 'Depreciation curves are estimates. For an exact figure on a specific vehicle, run its VIN on CarWorthIt to get a real market valuation with trade-in, private-party and dealer-retail values based on the actual year, mileage and options.' },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Depreciation Calculator', url: `${SITE_URL}/depreciation-calculator` },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <h1 className="text-3xl md:text-4xl font-extrabold">Car Depreciation Calculator</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          See what a car will be worth down the road. Enter the price today and a yearly depreciation rate to project its
          value over the next 1 to 15 years, plus how much it loses each year.
        </p>

        <div className="mt-8">
          <DepreciationCalc />
        </div>

        <div className="mt-10 space-y-4 text-ink-2 leading-relaxed">
          <h2 className="text-2xl font-bold text-ink">How car depreciation works</h2>
          <p>
            Depreciation is the gap between what you pay for a car and what you can sell it for later, and it is usually
            the single biggest cost of owning one. The drop is steepest early: a new car often loses 20 to 30 percent in
            the first year, then around 15 percent a year after that. The calculator above uses a steady yearly rate so
            you can compare scenarios quickly.
          </p>
          <h2 className="text-2xl font-bold text-ink">What rate should I use?</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>10 to 12 percent:</strong> strong value holders such as Toyota, Honda, Lexus and most trucks.</li>
            <li><strong>15 percent:</strong> a sensible default for a typical mainstream car.</li>
            <li><strong>20 percent or more:</strong> luxury sedans, large EVs and models with weak resale demand.</li>
          </ul>
          <p>
            Buying a car that is already two to three years old lets the first owner absorb the worst of the depreciation
            while you still get a nearly new vehicle. That is often the single best value move in the used market.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold">Want a real value for a specific car?</h2>
          <p className="mt-2 text-ink-2">Run its VIN for a market valuation with trade-in, private-party and dealer-retail prices.</p>
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
          <Link href="/fuel-cost-calculator" className="text-brand font-semibold hover:underline">Try the fuel cost calculator →</Link>
        </div>
      </div>
      <StickyVinCta />
    </>
  );
}
