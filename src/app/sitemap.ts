import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { guides } from '@/app/guides/page';
import articles from '@/content/articles.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/how-it-works', '/pricing', '/sample-report', '/guides', '/blog', '/tools', '/fuel-cost-calculator', '/depreciation-calculator', '/terms', '/privacy', '/disclaimer'];
  const guideRoutes = guides.map((g) => `/guides/${g.slug}`);
  const blogRoutes = (articles as { slug: string }[]).map((a) => `/blog/${a.slug}`);
  return [...routes, ...guideRoutes, ...blogRoutes].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now }));
}
