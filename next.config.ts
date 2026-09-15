import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Pin the workspace root so the parent-folder lockfile doesn't confuse Turbopack.
  turbopack: { root: path.resolve(__dirname) },

  /**
   * Consolidations. Each of these was one of two or three pages chasing the
   * same query and splitting its ranking between them. The surviving page
   * absorbed anything the old one said that it did not; the old slug is gone
   * from articles.json and the sitemap, and returns a permanent redirect.
   */
  async redirects() {
    return [
      // Three inspection checklists on one intent. The guide survives.
      { source: '/blog/used-car-inspection-checklist', destination: '/guides/used-car-checklist', permanent: true },
      { source: '/blog/how-to-check-a-used-car-before-buying', destination: '/guides/used-car-checklist', permanent: true },
      // Two salvage pages ranking for "buying rebuilt title". The blog post survives.
      { source: '/guides/salvage-title-explained', destination: '/blog/salvage-vs-rebuilt-title', permanent: true },
      // The provider comparison rebuilt as a dated decision page on a non-blog slug.
      { source: '/blog/cheapest-vin-check', destination: '/best-vehicle-history-report', permanent: true },
      { source: '/blog/carfax-alternatives', destination: '/best-vehicle-history-report', permanent: true },
    ];
  },
};

export default nextConfig;
