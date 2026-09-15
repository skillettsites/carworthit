import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { guides } from '@/app/guides/page';
import articles from '@/content/articles.json';
import { STATES, META } from '@/lib/state-fees';

// Priorities are relative and only meaningful against each other. The point is
// to tell a crawler which pages are the hubs, so the money pages and the
// diminished-value cluster are not weighted the same as a model guide.

// The two clusters we are actively betting on. Priority is relative, so this
// just tells a crawler these are hubs rather than one of 40 model guides.
const HUB_ARTICLES = new Set([
  'how-to-price-a-used-car-by-vin',
  'kelley-blue-book-alternatives',
  'kbb-vs-edmunds-vs-nada',
  'carvana-vs-carmax-offer',
  'what-is-diminished-value',
  'how-to-calculate-diminished-value',
  'how-to-file-a-diminished-value-claim',
  'diminished-value-by-state',
  'does-an-accident-lower-car-value',
  'trade-in-value-after-accident',
]);

const PRIORITY: Record<string, number> = {
  '': 1.0,
  '/pricing': 0.9,
  '/sample-report': 0.9,
  '/how-it-works': 0.8,
  '/blog': 0.8,
  '/methodology': 0.7,
  '/about': 0.6,
  '/guides': 0.6,
  '/tools': 0.5,
  '/press': 0.4,
  '/fuel-cost-calculator': 0.5,
  '/depreciation-calculator': 0.5,
  // Money pages, not utilities: these target terms where the SERP is winnable
  // for a young domain, unlike the valuation head terms.
  '/vin-decoder': 0.9,
  '/diminished-value-calculator': 0.9,
  '/how-much-is-my-car-worth': 0.9,
  '/check-car-value': 0.9,
  // State fee cluster: four hubs on one verified 51-row dataset. The state
  // children are added below with the dataset's checked date.
  '/car-sales-tax-calculator': 0.8,
  '/out-the-door-price-calculator': 0.8,
  '/dealer-doc-fee-by-state': 0.8,
  '/car-registration-fees-by-state': 0.8,
  // Tool-first guide on a 5,400/mo head term; feeds the $9.99 bundle.
  '/negotiate-used-car-price': 0.8,
  // The history-report decision cluster. The comparison and the FAQ are the
  // hubs; the two provider pages and the two page-backed posts hang off them.
  '/best-vehicle-history-report': 0.8,
  '/vehicle-history-faq': 0.8,
  '/bumper-review': 0.6,
  '/autocheck-free': 0.6,
  '/blog/carfax-report-cost': 0.6,
  '/blog/is-carfax-worth-it': 0.6,
  '/terms': 0.2,
  '/privacy': 0.2,
  '/disclaimer': 0.3,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // The state-fee pages carry the date the dataset was last verified, not the
  // build date: the page content genuinely changes only when the figures do.
  const feesChecked = new Date(`${META.checked}T00:00:00Z`);
  const FEE_HUBS = new Set([
    '/car-sales-tax-calculator',
    '/out-the-door-price-calculator',
    '/dealer-doc-fee-by-state',
    '/car-registration-fees-by-state',
  ]);

  const routes = Object.keys(PRIORITY).map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: FEE_HUBS.has(p) ? feesChecked : now,
    changeFrequency: (p === '' || p === '/blog' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: PRIORITY[p],
  }));

  const stateRoutes = STATES.map((s) => ({
    url: `${SITE_URL}/car-sales-tax-calculator/${s.slug}`,
    lastModified: new Date(`${s.checked}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const guideRoutes = guides.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Real per-article dates. Claiming all 52 changed today is a false freshness
  // signal, and one that crawlers learn to discount.
  const blogRoutes = (articles as { slug: string; published?: string; updated?: string }[]).map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(`${a.updated || a.published || '2026-07-13'}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: HUB_ARTICLES.has(a.slug) ? 0.8 : 0.5,
  }));

  return [...routes, ...stateRoutes, ...guideRoutes, ...blogRoutes];
}
