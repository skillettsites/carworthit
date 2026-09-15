import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { guides } from '@/app/guides/page';
import articles from '@/content/articles.json';
import { MAKES } from '@/lib/vin-tools/makes';
import { VEHICLE_TYPES } from '@/lib/vin-tools/vehicle-types';
import { STICKER_OEMS } from '@/lib/vin-tools/window-sticker';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = Object.keys(PRIORITY).map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: (p === '' || p === '/blog' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: PRIORITY[p],
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

  return [...routes, ...vinToolRoutes, ...guideRoutes, ...blogRoutes];
}
