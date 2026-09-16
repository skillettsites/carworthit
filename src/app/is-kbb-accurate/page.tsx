import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

// "is kbb accurate" and its variants: about 1,500 searches a month (Google
// Keyword Planner, US, September 2026), low competition, and page one is
// dealer blogs with no numbers. The wedge is a measured answer: the real
// spread of listing prices for one model, with the date, which is the thing
// no single valuation figure can escape.

const CHECKED = 'September 16, 2026';
const price = `$${PRODUCTS.valuation.price}`;

export const metadata: Metadata = {
  title: 'Is Kelley Blue Book Accurate? Measured Against Real Listings',
  description:
    'KBB is a fair reference for a trim in Good condition. Real listings for one model spread by 10 to 29 percent either side of the average, measured September 2026, so any single number sits in a band. How to check a KBB value in five minutes.',
  alternates: { canonical: `${SITE_URL}/is-kbb-accurate` },
};

// Standard deviation of mileage-adjusted listing prices around the mean, from
// the national retail listings feed, read September 15 and 16, 2026. Real
// responses, nothing rounded except the percentage.
const SPREADS = [
  { car: '2018 Chevrolet Equinox LT, 73,000 mi', mean: 14547, sd: 2773, n: 897, conf: 99 },
  { car: '2019 Tesla Model 3 Standard Range Plus, 45,000 mi', mean: 23208, sd: 3364, n: 699, conf: 99 },
  { car: '2021 Toyota Corolla LE, 50,000 mi', mean: 18487, sd: 1780, n: 1600, conf: 99 },
  { car: '2013 Ford F-150 XLT, 120,000 mi', mean: 14502, sd: 2945, n: 92, conf: 99 },
  { car: '2015 Porsche 911 Carrera S, 30,000 mi', mean: 90749, sd: 9266, n: 16, conf: 87 },
  { car: '2003 Honda Accord EX, 150,000 mi', mean: 4776, sd: 1393, n: 6, conf: 74 },
];

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

const faqs = [
  {
    q: 'Is Kelley Blue Book accurate?',
    a: `As a reference for a trim in the condition you pick, yes. KBB says it "reports vehicle values by analyzing actual transactions in the market", updates trade-in values weekly and, in its own words, its "promise is to report dependable values, not set prices" (kbb.com/faq/values, read ${CHECKED}). Where it cannot be accurate is on your car: real listings for one model spread by roughly 10 to 29 percent either side of the average, so a single figure is a point inside a band, not the price.`,
  },
  {
    q: 'Why is my KBB value higher than what dealers offer?',
    a: 'Three reasons in KBB\'s own material: the condition grade (most people rate their car better than a dealer would, and most KBB values assume "Good"), the type of value (a trade-in figure is below a private-party figure, which is below retail), and the fact that a published value is a reference while an offer is a negotiation. A dealer also has reconditioning, warranty and margin to cover before the car goes back on the lot.',
  },
  {
    q: 'Is KBB or Edmunds more accurate?',
    a: 'Neither is measurably more accurate than the other in any published test we could find on either site; they use different data and different condition definitions, so they disagree on the same car and both are references. The useful check is not a third reference, it is the live listings for that exact year, model and trim at your mileage: if the KBB figure sits inside the middle of that band it is fair, and if it sits outside it you know which way.',
  },
  {
    q: 'How do I check whether a KBB value is right for my car?',
    a: `Look at what the same year, model and trim is listed for near you at a similar mileage. That is what the ${price} CarWorthIt valuation does from the VIN: the national low, average and high from live listings, the ten price bands, and the nearest listings by distance with their mileage and price. If KBB and the listings agree, use either. If they do not, the listings are what the buyer will see.`,
  },
  {
    q: 'Does KBB take a VIN?',
    a: 'Yes, on its valuation page, but the VIN only identifies the trim; the value is still the trim value at the condition you choose. See our page on KBB by VIN for the full comparison.',
  },
  {
    q: 'Is CarWorthIt affiliated with Kelley Blue Book?',
    a: 'No. We are independent of Kelley Blue Book, Edmunds, J.D. Power, Carfax and every dealer group, and we do not republish their figures. Our numbers come from live listings and carry the date they were observed.',
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
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'Is KBB accurate', url: `${SITE_URL}/is-kbb-accurate` },
            ]),
          ]),
        }}
      />
      <h1 className="text-4xl font-extrabold">Is Kelley Blue Book accurate?</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-2">
        For a trim in the condition you choose, it is a fair reference: KBB values are drawn from &quot;actual transactions in the market&quot; and the trade-in figures are updated weekly (kbb.com/faq/values, read {CHECKED}). For your specific car it cannot be exact, because no single number can be. Measured on {CHECKED}, real US listings for one model at one mileage spread by 10 to 29 percent either side of the average. Any figure, KBB&apos;s or anyone&apos;s, is a point inside that band.
      </p>

      <h2 className="mt-12 text-2xl font-extrabold">How wide the real market is, measured</h2>
      <p className="mt-3 leading-relaxed text-ink-2">
        Standard deviation of listing prices around the mean for six cars, from the national retail listings feed, each listing adjusted to the stated mileage. About a third of listings sit more than one standard deviation from the mean. Read September 15 and 16, 2026.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-ink-2">
              <th className="py-2 pr-3 font-medium">Car</th>
              <th className="py-2 pr-3 font-medium">Listings</th>
              <th className="py-2 pr-3 font-medium">Mean</th>
              <th className="py-2 pr-3 font-medium">Std. deviation</th>
              <th className="py-2 font-medium">Spread</th>
            </tr>
          </thead>
          <tbody>
            {SPREADS.map((s) => (
              <tr key={s.car} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-3 font-semibold">{s.car}</td>
                <td className="py-2 pr-3">{s.n.toLocaleString('en-US')}</td>
                <td className="py-2 pr-3">{usd(s.mean)}</td>
                <td className="py-2 pr-3">{usd(s.sd)}</td>
                <td className="py-2">±{Math.round((s.sd / s.mean) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-ink-2">
        The pattern is the useful part: common cars with hundreds of listings cluster tightly (the Corolla at ±10%), older and rarer cars do not (the 2003 Accord at ±29% on six listings, confidence 74 out of 100). A KBB figure for a 2021 Corolla is probably close; a KBB figure for a 22-year-old Accord is a guess dressed as a number, and so would ours be, which is why the report prints the count and the confidence next to the value.
      </p>

      <h2 className="mt-12 text-2xl font-extrabold">What KBB says about its own values</h2>
      <ul className="mt-3 space-y-2 leading-relaxed text-ink-2">
        <li>&quot;Kelley Blue Book reports vehicle values by analyzing actual transactions in the market.&quot;</li>
        <li>Trade-in values are &quot;updated weekly&quot;.</li>
        <li>Most vehicles KBB values are in &quot;Good&quot; condition, and &quot;most people tend to overestimate the condition of their car&quot;.</li>
        <li>Its &quot;promise is to report dependable values, not set prices&quot;, and &quot;every dealer is different and values are not guaranteed&quot;.</li>
      </ul>
      <p className="mt-2 text-xs text-ink-2">All four from kbb.com/faq/values, read {CHECKED}. The 90-year history and weekly updates across more than 100 regions are stated on kbb.com/whats-my-car-worth, read the same day.</p>

      <h2 className="mt-12 text-2xl font-extrabold">Check a KBB value in five minutes</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-6 leading-relaxed text-ink-2">
        <li>Note which KBB value you were given: trade-in, private party or retail. They are different numbers for the same car.</li>
        <li>Note the condition grade you chose. Drop it one step and see how much the figure moves; that is the size of the honest uncertainty.</li>
        <li>Enter the VIN below. The free report confirms the trim, so you are not comparing against the wrong car.</li>
        <li>Add the mileage and ZIP. The {price} valuation shows the national low, average and high from live listings, the price bands and the nearest listings by distance.</li>
        <li>If KBB sits inside the middle half of those listings, it is fair. If it sits above the high or below the low, you know which way it is wrong and by how much.</li>
      </ol>
      <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <div className="text-sm font-semibold">Check a car against real listings</div>
        <div className="mt-3"><VinForm size="md" /></div>
      </div>

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
        <Link href="/blog/kbb-vs-edmunds-vs-nada" className="text-brand hover:underline">KBB vs Edmunds vs NADA</Link>,{' '}
        <Link href="/blog/kelley-blue-book-alternatives" className="text-brand hover:underline">Kelley Blue Book alternatives</Link>,{' '}
        <Link href="/car-value" className="text-brand hover:underline">used car values by model</Link>.
      </p>
      <p className="mt-4 text-xs text-ink-2">Kelley Blue Book and Blue Book are trademarks of Kelley Blue Book Co., Inc. CarWorthIt is independent. Figures checked {CHECKED}.</p>
    </div>
  );
}
