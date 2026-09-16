import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { getModelIndex } from '@/lib/model-values';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Used Car Values by Year, Make and Model (2026)',
  description:
    'What used cars are worth right now, model by model, from live US sales listings: national low, average and high, price bands and value by state, each page dated. Or price your exact VIN from $2.99.',
  alternates: { canonical: `${SITE_URL}/car-value` },
};

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

const faqs = [
  {
    q: 'Where do these car values come from?',
    a: 'From live US retail sales listings for each exact year, make, model and trim, via a licensed vehicle-pricing provider that refreshes daily. Each page states how many listings it is built on, the dates they were observed and the mileage they were adjusted to.',
  },
  {
    q: 'Are these Kelley Blue Book values?',
    a: 'No. We are not affiliated with Kelley Blue Book, Edmunds or J.D. Power and do not republish their figures. These are independent, listing-based retail values with the date on every page.',
  },
  {
    q: 'How do I value my own car rather than the model?',
    a: `Enter the 17-character VIN. The specification, recalls and running costs are free; the valuation, from $${PRODUCTS.valuation.price}, prices that exact car at its mileage in your ZIP code and shows the nearest listings behind the number.`,
  },
];

export default async function CarValueIndex() {
  const rows = await getModelIndex();
  const byMake = new Map<string, typeof rows>();
  for (const r of rows) byMake.set(r.make, [...(byMake.get(r.make) || []), r]);
  const makes = [...byMake.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="container-x py-12 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqSchema(faqs),
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'Car values', url: `${SITE_URL}/car-value` },
            ]),
          ]),
        }}
      />
      <h1 className="text-4xl font-extrabold">Used car values by model</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-2">
        What each model year is worth at retail right now, from live US sales listings: the national low, average and high, the price bands and the median by state. {rows.length} model years so far, each page dated. For the car in front of you, use the VIN.
      </p>
      <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <h2 className="text-lg font-bold">Value a specific car by VIN</h2>
        <div className="mt-3"><VinForm size="md" /></div>
        <p className="mt-2 text-xs text-ink-2">Free VIN report. Valuation with the nearest listings from ${PRODUCTS.valuation.price}.</p>
      </div>

      {makes.length === 0 ? (
        <p className="mt-10 text-ink-2">Model pages are being built. Check back shortly, or value a car by VIN above.</p>
      ) : (
        makes.map(([make, list]) => (
          <section key={make} className="mt-10">
            <h2 className="text-2xl font-bold">{make}</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {list
                .sort((a, b) => a.model.localeCompare(b.model) || b.year - a.year)
                .map((r) => (
                  <Link key={r.slug} href={`/car-value/${r.slug}`} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm hover:border-brand">
                    <span className="font-semibold">{r.year} {r.make} {r.model}</span>
                    <span className="text-ink-2">{usd(r.pricing.avg)}</span>
                  </Link>
                ))}
            </div>
          </section>
        ))
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-white p-5">
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
