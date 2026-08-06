import type { Metadata } from 'next';
import Link from 'next/link';
import articles from '@/content/articles.json';
import SearchBox from '@/components/SearchBox';
import { SITE_URL } from '@/lib/constants';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Used car guides: pricing, valuations and diminished value',
  description:
    'Practical US guides on what a used car is worth, how to tell a fair price from a bad one, claiming diminished value after an accident, and what to check before you buy.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

type Article = { slug: string; title: string; metaDescription: string };

// Grouped rather than dumped as one 48-item list. A flat list buries the
// cluster that matters and gives crawlers no sense of which pages are the
// hubs, and readers no way to find the one thing they came for.
const GROUPS: { heading: string; blurb: string; slugs: string[] }[] = [
  {
    heading: 'Diminished value after an accident',
    blurb:
      'A repaired car is worth less than one that was never damaged. If someone else was at fault, that gap is usually claimable.',
    slugs: [
      'what-is-diminished-value',
      'how-to-calculate-diminished-value',
      'how-to-file-a-diminished-value-claim',
      'diminished-value-by-state',
      'does-an-accident-lower-car-value',
      'trade-in-value-after-accident',
    ],
  },
  {
    heading: 'What a car is worth, and what to pay',
    blurb: 'Pricing a used car properly, and telling a fair asking price from an optimistic one.',
    slugs: [
      'cheapest-vin-check',
      'free-vin-check',
      'carfax-alternatives',
      'autocheck-vs-carfax',
      'is-carfax-worth-it',
      'certified-pre-owned-vs-used',
      'electric-vs-gas-cost-to-own',
      'cheapest-cars-to-insure',
    ],
  },
  {
    heading: 'Before you buy',
    blurb: 'The checks worth doing, and the ones people skip and regret.',
    slugs: [
      'how-to-check-a-used-car-before-buying',
      'used-car-inspection-checklist',
      'how-to-check-car-recalls-vin',
      'how-to-check-a-car-title-status',
      'how-to-check-if-a-car-has-a-lien',
      'how-to-check-a-car-for-odometer-fraud',
      'how-to-spot-flood-damaged-car',
      'salvage-vs-rebuilt-title',
      'what-does-a-vehicle-history-report-show',
      'how-to-check-a-cars-accident-history',
      'how-to-buy-a-used-car-safely-online',
    ],
  },
  {
    heading: 'Which car to buy',
    blurb: 'Models that hold up, and what they cost to run.',
    slugs: [
      'most-reliable-used-cars',
      'most-reliable-used-suvs',
      'best-used-cars-under-10000',
      'best-used-cars-under-5000',
      'best-family-cars',
      'best-first-cars-new-drivers',
    ],
  },
];

export default function BlogIndex() {
  const all = articles as Article[];
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const grouped = new Set(GROUPS.flatMap((g) => g.slugs));
  // Anything not explicitly placed still gets listed, so adding an article can
  // never silently orphan it.
  const rest = all.filter((a) => !grouped.has(a.slug));

  return (
    <div className="container-x max-w-4xl py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'Guides', url: `${SITE_URL}/blog` },
            ]),
          ),
        }}
      />

      <h1 className="text-4xl font-extrabold">Used car guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">
        What a used car is really worth, how to tell a fair price from a bad one, and how to claim the value your car
        lost after an accident. All free.
      </p>

      {GROUPS.map((g) => (
        <section key={g.heading} className="mt-12">
          <h2 className="text-2xl font-bold">{g.heading}</h2>
          <p className="mt-1 max-w-2xl text-ink-2">{g.blurb}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {g.slugs.map((slug) => {
              const a = bySlug.get(slug);
              if (!a) return null;
              return (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className="block rounded-2xl border border-border bg-white p-5 transition-colors hover:border-brand"
                >
                  <h3 className="font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-ink-2">{a.metaDescription}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {rest.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Model guides</h2>
          <p className="mt-1 text-ink-2">Common problems and what to watch for, model by model.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-brand"
              >
                {a.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold">Check a specific car</h2>
        <p className="mt-1 mb-4 text-sm text-ink-2">
          Free VIN report with specs, open recalls, safety ratings and running costs.
        </p>
        <SearchBox />
      </div>
    </div>
  );
}
