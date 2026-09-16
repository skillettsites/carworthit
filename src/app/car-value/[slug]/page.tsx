import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import VinForm from '@/components/VinForm';
import { getModelValues, getModelIndex, type ModelValueRow } from '@/lib/model-values';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

// One page per model year: "2018 Chevrolet Equinox value".
//
// Every number on the page is a national Retail Market Value figure for that
// exact year, make, model and trim, reduced to what may be shown outside a
// paid report: low, average and high, the confidence, the count, the window,
// the ten price bands and a per-state median. No listing is shown here; the
// listings themselves are inside the paid report, which is the limit the
// data partner set. Pages are seeded from the most-searched model years and
// then grow from real lookups, so the sitemap only ever lists pages with data.

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const rows = await getModelIndex();
  return rows.map((r) => ({ slug: r.slug }));
}

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const longDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};
const monthYear = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

function headline(rows: ModelValueRow[]) {
  // The trim with the most listings carries the headline figure; the rest are
  // listed in the trim table. A single national number for "the 2018 Equinox"
  // would blend LS and Premier, which is the trim-average mistake the site
  // exists to avoid.
  return [...rows].sort((a, b) => b.pricing.count - a.pricing.count)[0];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rows = await getModelValues(slug);
  if (!rows.length) return { title: 'Car value', robots: { index: false } };
  const h = headline(rows);
  const name = `${h.year} ${h.make} ${h.model}`;
  const when = monthYear(h.fetched_at);
  return {
    title: `${name} Value: ${usd(h.pricing.avg)} Average (${when})`,
    description: `What a ${name} is worth in ${when}: ${usd(h.pricing.low)} to ${usd(h.pricing.high)} retail, averaging ${usd(h.pricing.avg)} across ${h.pricing.count.toLocaleString('en-US')} US listings${h.trim ? ` (${h.trim} trim)` : ''}. Price your exact VIN from $${PRODUCTS.valuation.price}.`,
    alternates: { canonical: `${SITE_URL}/car-value/${slug}` },
  };
}

export default async function ModelValuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await getModelValues(slug);
  if (!rows.length) notFound();
  const h = headline(rows);
  const name = `${h.year} ${h.make} ${h.model}`;
  const when = monthYear(h.fetched_at);
  const trims = [...rows].sort((a, b) => a.pricing.avg - b.pricing.avg);
  const tallest = Math.max(1, ...h.distribution.map((b) => b.count));
  const strengthWord = h.summary.strength === 'strong' ? 'a large, current pool' : h.summary.strength === 'fair' ? 'a fair-sized pool' : 'a thin pool';

  // Siblings: other years of the same model, for the year strip.
  const index = await getModelIndex();
  const years = index.filter((r) => r.make === h.make && r.model === h.model && r.slug !== slug).sort((a, b) => b.year - a.year);

  const faqs = [
    {
      q: `How much is a ${name} worth?`,
      a: `In ${when}, a ${name}${h.trim ? ` ${h.trim}` : ''} at ${h.mileage_basis.toLocaleString('en-US')} miles has a retail value of about ${usd(h.pricing.avg)}, with listings running from ${usd(h.pricing.low)} to ${usd(h.pricing.high)}. That is the national picture across ${h.pricing.count.toLocaleString('en-US')} cars listed for sale between ${longDate(h.sale_date_from)} and ${longDate(h.sale_date_to)}. A specific car moves with its mileage, trim, options, condition and local market, which is what the VIN valuation prices.`,
    },
    {
      q: `Is this the Kelley Blue Book value for a ${name}?`,
      a: 'No. Kelley Blue Book publishes its own values from its own data, and we are not affiliated with it. These figures are built from live US sales listings for this exact model, mileage-adjusted, and the date they were observed is printed on the page.',
    },
    {
      q: 'Is this a trade-in value or a retail value?',
      a: 'Retail: what sellers are asking for the car on the open market. A dealer trade-in offer is normally lower, because the dealer has to recondition, warrant and resell the car. Private-party sales usually land between the two.',
    },
    {
      q: `Why does the ${name} value change with mileage?`,
      a: `Every figure here is struck at ${h.mileage_basis.toLocaleString('en-US')} miles. The feed adjusts each listing to that reading before averaging, and a car with far more or far fewer miles is worth a different amount. Enter the VIN and the real odometer reading to price the actual car.`,
    },
    {
      q: 'How do I get the value of my exact car?',
      a: `Enter the 17-character VIN on this page. The specification, open recalls and running costs are free; the valuation, from $${PRODUCTS.valuation.price}, prices that VIN at its mileage in your ZIP code and shows the nearest listings behind the number.`,
    },
  ];

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
              { name: name, url: `${SITE_URL}/car-value/${slug}` },
            ]),
          ]),
        }}
      />
      <nav className="text-xs text-ink-2">
        <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/car-value" className="hover:text-ink">Car values</Link> / {name}
      </nav>
      <h1 className="mt-3 text-4xl font-extrabold">{name} value</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-2">
        A {name}{h.trim ? ` ${h.trim}` : ''} at {h.mileage_basis.toLocaleString('en-US')} miles is worth about{' '}
        <strong className="text-ink">{usd(h.pricing.avg)}</strong> at retail in {when}, with US listings running from{' '}
        {usd(h.pricing.low)} to {usd(h.pricing.high)}. That is {h.pricing.count.toLocaleString('en-US')} cars listed for sale between{' '}
        {longDate(h.sale_date_from)} and {longDate(h.sale_date_to)}, {strengthWord} (confidence {h.pricing.confidence}/100). Checked {longDate(h.fetched_at.slice(0, 10))}.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-2xl font-bold">{usd(h.pricing.low)}</div>
          <div className="mt-1 text-xs text-ink-2">Low retail value</div>
        </div>
        <div className="rounded-xl border-2 border-brand bg-white p-5 text-center shadow-sm">
          <div className="text-3xl font-extrabold text-brand">{usd(h.pricing.avg)}</div>
          <div className="mt-1 text-xs font-semibold text-ink-2">Average retail value</div>
          <div className="mt-1 text-[11px] text-ink-2">Median listing {usd(h.summary.medianListing)}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="text-2xl font-bold">{usd(h.pricing.high)}</div>
          <div className="mt-1 text-xs text-ink-2">High retail value</div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <h2 className="text-xl font-bold">What is your {h.make} {h.model} worth?</h2>
        <p className="mt-2 text-sm text-ink-2">
          The figures above are for the model. Enter the VIN and we price that exact car at its odometer reading in your ZIP code, with the nearest listings behind the number, from ${PRODUCTS.valuation.price}. The VIN report itself is free.
        </p>
        <div className="mt-4"><VinForm size="md" /></div>
      </div>

      {trims.length > 1 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Value by trim</h2>
          <p className="mt-2 text-sm text-ink-2">Each trim is valued from its own listings. The mileage basis is the odometer reading the feed was asked to price at.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-ink-2">
                  <th className="py-2 pr-3 font-medium">Trim</th>
                  <th className="py-2 pr-3 font-medium">Mileage basis</th>
                  <th className="py-2 pr-3 font-medium">Low</th>
                  <th className="py-2 pr-3 font-medium">Average</th>
                  <th className="py-2 pr-3 font-medium">High</th>
                  <th className="py-2 font-medium">Listings</th>
                </tr>
              </thead>
              <tbody>
                {trims.map((t) => (
                  <tr key={t.prefix} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-3 font-semibold">{t.trim || 'Base'}</td>
                    <td className="py-2 pr-3">{t.mileage_basis.toLocaleString('en-US')} mi</td>
                    <td className="py-2 pr-3">{usd(t.pricing.low)}</td>
                    <td className="py-2 pr-3 font-semibold">{usd(t.pricing.avg)}</td>
                    <td className="py-2 pr-3">{usd(t.pricing.high)}</td>
                    <td className="py-2">{t.pricing.count.toLocaleString('en-US')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {h.distribution.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">How {name} listings are priced</h2>
          <p className="mt-2 text-sm text-ink-2">
            Ten equal bands from the cheapest tenth of listings to the dearest, {h.trim ? `${h.trim} trim, ` : ''}mileage-adjusted to {h.mileage_basis.toLocaleString('en-US')} miles. A narrow band is a crowded price; the wide bands at either end are the outliers.
          </p>
          <div className="mt-4 space-y-1.5">
            {h.distribution.map((b) => (
              <div key={b.min} className="flex items-center gap-3 text-xs">
                <div className="w-40 shrink-0 text-right font-mono text-ink-2">{usd(b.min)} to {usd(b.max)}</div>
                <div className="h-4 flex-1 overflow-hidden rounded bg-border/60">
                  <div className="h-full rounded bg-brand/70" style={{ width: `${Math.round((b.count / tallest) * 100)}%` }} />
                </div>
                <div className="w-10 shrink-0 text-ink-2">{b.count}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {h.states.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">{name} value by state</h2>
          <p className="mt-2 text-sm text-ink-2">Median mileage-adjusted listing price in the states with the most cars for sale. Small counts move around; treat anything under ten listings as a hint, not a figure.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {h.states.slice(0, 12).map((s) => (
              <div key={s.state} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm">
                <span className="font-semibold">{s.state}</span>
                <span>
                  {usd(s.median)} <span className="text-xs text-ink-2">({s.count})</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {years.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Other years of the {h.make} {h.model}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {years.map((y) => (
              <Link key={y.slug} href={`/car-value/${y.slug}`} className="rounded-lg border border-border bg-white px-3 py-2 text-sm hover:border-brand">
                {y.year} {y.make} {y.model}: {usd(y.pricing.avg)}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
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

      <p className="mt-10 text-xs leading-relaxed text-ink-2">
        Source: US retail sales listings via a licensed vehicle-pricing provider, national figures for the exact year, make, model and trim at the stated mileage, observed {longDate(h.sale_date_from)} to {longDate(h.sale_date_to)} and checked {longDate(h.fetched_at.slice(0, 10))}. Advertised prices, not sale prices. Not affiliated with Kelley Blue Book, Edmunds or J.D. Power. Not a vehicle history report. See <Link href="/methodology" className="underline">how every figure is produced</Link>.
      </p>
    </div>
  );
}
