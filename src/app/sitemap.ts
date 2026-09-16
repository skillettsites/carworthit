import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { guides } from '@/app/guides/page';
import articles from '@/content/articles.json';
import { STATES, META } from '@/lib/state-fees';
import { MAKES } from '@/lib/vin-tools/makes';
import { VEHICLE_TYPES } from '@/lib/vin-tools/vehicle-types';
import { STICKER_OEMS } from '@/lib/vin-tools/window-sticker';
import { getModelIndex } from '@/lib/model-values';

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
  // The value cluster of September 16, 2026: the model-value index and the two
  // pages that answer the KBB-shaped questions with dated, measured figures.
  '/car-value': 0.9,
  '/kbb-by-vin': 0.8,
  '/is-kbb-accurate': 0.8,
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
  // VIN tool pages (September 15, 2026). Tool hubs at 0.7; the per-make and
  // per-type children are added below at 0.5.
  '/title-check': 0.7,
  '/lien-check': 0.7,
  '/odometer-check': 0.7,
  '/stolen-vehicle-check': 0.7,
  '/window-sticker': 0.7,
  '/transmission-by-vin': 0.7,
  '/engine-by-vin': 0.7,
  '/vin-year-chart': 0.7,
  '/paint-code-by-vin': 0.7,
  '/check-warranty-by-vin': 0.7,
  '/classic-car-vin-decoder': 0.7,
};

const VIN_TOOL_CHILDREN = [
  ...MAKES.map((m) => `/vin-decoder/${m.slug}`),
  ...VEHICLE_TYPES.map((t) => `/${t.slug}`),
  ...STICKER_OEMS.map((o) => `/window-sticker/${o.slug}`),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const vinToolRoutes = VIN_TOOL_CHILDREN.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date('2026-09-15T00:00:00Z'),
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

  // Model-value pages: one per model year with data, dated by the day the
  // figures were struck. Read from the database, so a page appears here the
  // day it gains a row and never before.
  const modelRoutes = (await getModelIndex()).map((m) => ({
    url: `${SITE_URL}/car-value/${m.slug}`,
    lastModified: new Date(m.fetched_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...stateRoutes, ...vinToolRoutes, ...guideRoutes, ...blogRoutes, ...modelRoutes];
}
