import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Pin the workspace root so the parent-folder lockfile doesn't confuse Turbopack.
  turbopack: { root: path.resolve(__dirname) },
  async redirects() {
    return [
      // Three thin blog posts (200 to 270 words each) rebuilt as tool-first
      // pages on September 15, 2026. The articles were removed from
      // src/content/articles.json so the sitemap and blog index drop them.
      { source: '/blog/how-to-check-a-car-title-status', destination: '/title-check', permanent: true },
      { source: '/blog/how-to-check-if-a-car-has-a-lien', destination: '/lien-check', permanent: true },
      { source: '/blog/how-to-check-a-car-for-odometer-fraud', destination: '/odometer-check', permanent: true },
    ];
  },
};

export default nextConfig;
