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

/**
 * Every static route with its priority and the date its content last really
 * changed (the last commit that touched the page, or the dataset date).
 *
 * These used to carry the build time, so every deploy told crawlers that all
 * ~120 static pages had changed that day. Bing schedules recrawls from
 * lastmod and learns to ignore a sitemap whose dates are always "now", which
 * is the opposite of what a new, unlinked domain needs. Bump a date here when
 * a page's content changes; leave it alone for a code-only deploy.
 */
const ROUTES: Record<string, { priority: number; updated: string }> = {
  '': { priority: 1.0, updated: '2026-09-28' },
  '/pricing': { priority: 0.9, updated: '2026-09-16' },
  '/sample-report': { priority: 0.9, updated: '2026-09-16' },
  '/how-it-works': { priority: 0.8, updated: '2026-09-15' },
  '/blog': { priority: 0.8, updated: '2026-09-28' },
  '/methodology': { priority: 0.7, updated: '2026-09-16' },
  '/about': { priority: 0.6, updated: '2026-08-06' },
  '/guides': { priority: 0.6, updated: '2026-09-15' },
  '/tools': { priority: 0.5, updated: '2026-09-15' },
  '/press': { priority: 0.4, updated: '2026-08-06' },
  '/fuel-cost-calculator': { priority: 0.5, updated: '2026-07-13' },
  '/depreciation-calculator': { priority: 0.5, updated: '2026-08-06' },
  // Money pages, not utilities: these target terms where the SERP is winnable
  // for a young domain, unlike the valuation head terms.
  '/vin-decoder': { priority: 0.9, updated: '2026-09-28' },
  '/diminished-value-calculator': { priority: 0.9, updated: '2026-08-12' },
  '/how-much-is-my-car-worth': { priority: 0.9, updated: '2026-09-28' },
  '/check-car-value': { priority: 0.9, updated: '2026-09-28' },
  // The value cluster of September 16, 2026: the model-value index and the two
  // pages that answer the KBB-shaped questions with dated, measured figures.
  '/car-value': { priority: 0.9, updated: '2026-09-16' },
  '/kbb-by-vin': { priority: 0.8, updated: '2026-09-16' },
  '/is-kbb-accurate': { priority: 0.8, updated: '2026-09-16' },
  // State fee cluster: four hubs on one verified 51-row dataset, dated by the
  // dataset's checked date below. The state children are added separately.
  '/car-sales-tax-calculator': { priority: 0.8, updated: '2026-09-15' },
  '/out-the-door-price-calculator': { priority: 0.8, updated: '2026-09-15' },
  '/dealer-doc-fee-by-state': { priority: 0.8, updated: '2026-09-15' },
  '/car-registration-fees-by-state': { priority: 0.8, updated: '2026-09-15' },
  // Tool-first guide on a 5,400/mo head term; feeds the $9.99 bundle.
  '/negotiate-used-car-price': { priority: 0.8, updated: '2026-09-15' },
  // The history-report decision cluster. The comparison and the FAQ are the
  // hubs; the two provider pages and the two page-backed posts hang off them.
  '/best-vehicle-history-report': { priority: 0.8, updated: '2026-09-15' },
  '/vehicle-history-faq': { priority: 0.8, updated: '2026-09-15' },
  '/bumper-review': { priority: 0.6, updated: '2026-09-15' },
  '/autocheck-free': { priority: 0.6, updated: '2026-09-15' },
  '/blog/carfax-report-cost': { priority: 0.6, updated: '2026-09-15' },
  '/blog/is-carfax-worth-it': { priority: 0.6, updated: '2026-09-15' },
  '/terms': { priority: 0.2, updated: '2026-08-06' },
  '/privacy': { priority: 0.2, updated: '2026-09-28' },
  '/disclaimer': { priority: 0.3, updated: '2026-08-06' },
  // VIN tool pages (September 15, 2026). Tool hubs at 0.7; the per-make and
  // per-type children are added below at 0.5.
  '/title-check': { priority: 0.7, updated: '2026-09-15' },
  '/lien-check': { priority: 0.7, updated: '2026-09-15' },
  '/odometer-check': { priority: 0.7, updated: '2026-09-15' },
  '/stolen-vehicle-check': { priority: 0.7, updated: '2026-09-15' },
  '/window-sticker': { priority: 0.7, updated: '2026-09-15' },
  '/transmission-by-vin': { priority: 0.7, updated: '2026-09-15' },
  '/engine-by-vin': { priority: 0.7, updated: '2026-09-15' },
  '/vin-year-chart': { priority: 0.7, updated: '2026-09-15' },
  '/paint-code-by-vin': { priority: 0.7, updated: '2026-09-15' },
  '/check-warranty-by-vin': { priority: 0.7, updated: '2026-09-15' },
  '/classic-car-vin-decoder': { priority: 0.7, updated: '2026-09-15' },
};

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);

const VIN_TOOL_CHILDREN = [
  ...MAKES.map((m) => `/vin-decoder/${m.slug}`),
  ...VEHICLE_TYPES.map((t) => `/${t.slug}`),
  ...STICKER_OEMS.map((o) => `/window-sticker/${o.slug}`),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The state-fee pages carry the date the dataset was last verified, not the
  // build date: the page content genuinely changes only when the figures do.
  const feesChecked = new Date(`${META.checked}T00:00:00Z`);
  const FEE_HUBS = new Set([
    '/car-sales-tax-calculator',
    '/out-the-door-price-calculator',
    '/dealer-doc-fee-by-state',
    '/car-registration-fees-by-state',
  ]);

  const routes = Object.entries(ROUTES).map(([p, r]) => ({
    url: `${SITE_URL}${p}`,
    lastModified: FEE_HUBS.has(p) ? feesChecked : day(r.updated),
    changeFrequency: (p === '' || p === '/blog' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: r.priority,
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
    lastModified: day('2026-09-15'),
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
