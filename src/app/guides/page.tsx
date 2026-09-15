import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Used car buying guides',
  description: 'Plain-English guides to checking a used car: VINs, the buying checklist, title brands, history reports and what to look for before you buy.',
  alternates: { canonical: `${SITE_URL}/guides` },
};

// Only pages that live under /guides/. sitemap.ts builds its guide URLs from
// this list, so a page at another path must go in `related` below instead.
export const guides = [
  { slug: 'what-is-a-vin', title: 'What is a VIN and where do I find it?', excerpt: 'The 17-character code that unlocks a car’s entire history, and the five places to find it.' },
  { slug: 'used-car-checklist', title: 'The used-car buying checklist', excerpt: '46 checks in nine steps: free VIN checks, the history report, paperwork, inspection, test drive and price. Printable.' },
];

// Pages that belong with the guides but live elsewhere. The salvage guide was
// merged into the blog post that already ranked for the same queries.
const related = [
  { href: '/blog/salvage-vs-rebuilt-title', title: 'Salvage, rebuilt and branded titles explained', excerpt: 'What each title brand means, what it does to the value, and how an NMVTIS check reveals brands a clean paper title hides.' },
  { href: '/best-vehicle-history-report', title: 'Best vehicle history report', excerpt: 'Carfax, AutoCheck, Bumper, EpicVIN, VinAudit and ClearVin compared on price, subscription traps and NMVTIS approval, with the date each price was checked.' },
  { href: '/vehicle-history-faq', title: 'Vehicle history FAQ', excerpt: 'What a history report shows, what NMVTIS is, every title brand, every provider’s price, and what CarWorthIt does and does not do.' },
  { href: '/blog/carfax-report-cost', title: 'What a Carfax report costs', excerpt: 'Today’s Carfax prices for one, two and four reports, the free routes, and why the $3.99 resellers are a risk.' },
  { href: '/autocheck-free', title: 'How to get an AutoCheck report free', excerpt: 'eBay Motors and dealer listings include one; what AutoCheck charges if neither applies.' },
  { href: '/bumper-review', title: 'Bumper review', excerpt: 'The trial, the monthly price, the cancellation terms and what the report contains, checked on Bumper’s own site.' },
];

export default function GuidesIndex() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <h1 className="text-4xl font-extrabold">Used car guides</h1>
      <p className="mt-3 text-lg text-ink-2">Everything you need to check a used car with confidence.</p>
      <div className="mt-10 space-y-4">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="block rounded-2xl border border-border bg-white p-6 hover:border-brand transition-colors">
            <h2 className="text-xl font-semibold">{g.title}</h2>
            <p className="mt-1 text-ink-2 text-sm">{g.excerpt}</p>
            <span className="mt-3 inline-block text-brand text-sm font-semibold">Read →</span>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">Titles and history reports</h2>
      <p className="mt-1 text-ink-2">What a report can and cannot tell you, and what each one costs today.</p>
      <div className="mt-5 space-y-4">
        {related.map((g) => (
          <Link key={g.href} href={g.href} className="block rounded-2xl border border-border bg-white p-6 hover:border-brand transition-colors">
            <h3 className="text-xl font-semibold">{g.title}</h3>
            <p className="mt-1 text-ink-2 text-sm">{g.excerpt}</p>
            <span className="mt-3 inline-block text-brand text-sm font-semibold">Read →</span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink-2">
        Decode any VIN free with the <Link href="/vin-decoder" className="text-brand underline">VIN decoder</Link>, or browse{' '}
        <Link href="/blog" className="text-brand underline">all guides</Link>.
      </p>
    </div>
  );
}
