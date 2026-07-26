import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Explicitly welcome AI crawlers so our guides can be cited in AI answers.
export default function robots(): MetadataRoute.Robots {
  const base = { allow: '/', disallow: '/report/' };
  const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-Web', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot'];
  return {
    rules: [{ userAgent: '*', ...base }, ...aiBots.map((userAgent) => ({ userAgent, ...base }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
