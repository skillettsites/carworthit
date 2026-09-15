import type { Metadata } from 'next';
import Link from 'next/link';
import articles from '@/content/articles.json';
import SearchBox from '@/components/SearchBox';
import { SITE_URL } from '@/lib/constants';
import { breadcrumbSchema } from '@/lib/schema';
import { ANALYST } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Used car guides: pricing, valuations and diminished value',
  description:
    'Practical US guides on what a used car is worth, how to tell a fair price from a bad one, claiming diminished value after an accident, and what to check before you buy.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

type Article = { slug: string; title: string; metaDescription: string; published?: string; updated?: string };

// Posts that live at /blog/<slug> but are built as pages rather than JSON
// bodies, because their prices come from src/lib/vhr-providers.ts and must
// not be copied into static HTML. Listed here so the index, and the ItemList
// below, still see them.
const PAGE_POSTS: Article[] = [
  {
    slug: 'carfax-report-cost',
    title: 'How Much Does a Carfax Report Cost? (Checked September 2026)',
    metaDescription: 'What Carfax charges today for one, two and four reports, the three ways to get one free, why the $3.99 resellers are a risk, and what an NMVTIS-approved alternative costs.',
    published: '2026-09-15',
    updated: '2026-09-15',
  },
  {
    slug: 'is-carfax-worth-it',
    title: 'Is Carfax Worth It? A Direct Answer, With Today’s Prices',
    metaDescription: 'Yes for one expensive car where the service trail matters, no for screening a shortlist. What Carfax has that cheaper reports do not, with every price dated.',
    published: '2026-07-13',
    updated: '2026-09-15',
  },
];

// Grouped rather than dumped as one 48-item list. A flat list buries the
// cluster that matters and gives crawlers no sense of which pages are the
// hubs, and readers no way to find the one thing they came for.
const GROUPS: { heading: string; blurb: string; slugs: string[]; tools?: { href: string; label: string }[] }[] = [
  {
    heading: 'What a car is worth',
    blurb:
      'Pricing a used car properly, and how the free valuation tools compare with each other and with a real cash offer.',
    slugs: [
      'how-to-price-a-used-car-by-vin',
      'kelley-blue-book-alternatives',
      'kbb-vs-edmunds-vs-nada',
      'carvana-vs-carmax-offer',
    ],
  },
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
    heading: 'Checking a car before you buy',
    blurb: 'What the paid history services actually give you, and what you can get for nothing.',
    slugs: [
      'is-carfax-worth-it',
      'carfax-report-cost',
      'free-vin-check',
      'autocheck-vs-carfax',
      'certified-pre-owned-vs-used',
      'electric-vs-gas-cost-to-own',
      'cheapest-cars-to-insure',
    ],
  },
  {
    heading: 'Before you buy',
    blurb: 'The checks worth doing, and the ones people skip and regret.',
    tools: [
      { href: '/title-check', label: 'Title check' },
      { href: '/lien-check', label: 'Lien check' },
      { href: '/odometer-check', label: 'Odometer check' },
      { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
      { href: '/window-sticker', label: 'Window sticker by VIN' },
    ],
    slugs: [
      'how-to-check-car-recalls-vin',
      // The title, lien and odometer posts became tool pages on September 15,
      // 2026 (/title-check, /lien-check, /odometer-check) and 301 there; the
      // group blurb links them so the cluster stays discoverable from here.
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
  const all = [...(articles as Article[]), ...PAGE_POSTS];
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
          __html: JSON.stringify([
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'Guides', url: `${SITE_URL}/blog` },
            ]),
            // An explicit ItemList tells a crawler this is a hub and which
            // pages it points at, rather than leaving it to infer from links.
            {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'CarWorthIt used car guides',
              url: `${SITE_URL}/blog`,
              author: { '@type': 'Person', name: ANALYST.name, jobTitle: ANALYST.role },
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: all.length,
                itemListElement: all.map((a, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  url: `${SITE_URL}/blog/${a.slug}`,
                  name: a.title,
                })),
              },
            },
          ]),
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
          {g.tools && (
            <p className="mt-2 text-sm text-ink-2">
              Free tools:{' '}
              {g.tools.map((t, i) => (
                <span key={t.href}>
                  {i > 0 && ' · '}
                  <Link href={t.href} className="text-brand underline">
                    {t.label}
                  </Link>
                </span>
              ))}
            </p>
          )}
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

      <section className="mt-12 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-2xl font-bold">Decision pages, with dated prices</h2>
        <p className="mt-1 text-ink-2">Every provider price on these pages was read from the provider&apos;s own site on the date shown.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
          <li><Link href="/best-vehicle-history-report" className="text-brand underline">Best vehicle history report: every provider compared</Link></li>
          <li><Link href="/vehicle-history-faq" className="text-brand underline">Vehicle history FAQ: brands, NMVTIS, prices, refunds</Link></li>
          <li><Link href="/bumper-review" className="text-brand underline">Bumper review: trial, monthly price, cancellation</Link></li>
          <li><Link href="/autocheck-free" className="text-brand underline">How to get an AutoCheck report free</Link></li>
          <li><Link href="/guides/used-car-checklist" className="text-brand underline">The used-car checklist (printable)</Link></li>
          <li><Link href="/vin-decoder" className="text-brand underline">Free VIN decoder</Link></li>
        </ul>
      </section>

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
