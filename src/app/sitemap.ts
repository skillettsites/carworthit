import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { guides } from '@/app/guides/page';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/how-it-works', '/pricing', '/sample-report', '/guides', '/terms', '/privacy', '/disclaimer'];
  const guideRoutes = guides.map((g) => `/guides/${g.slug}`);
  return [...routes, ...guideRoutes].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now }));
}
