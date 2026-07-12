import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Used car buying guides',
  description: 'Plain-English guides to checking a used car: VINs, title brands, odometer fraud, and what to look for before you buy.',
};

export const guides = [
  { slug: 'what-is-a-vin', title: 'What is a VIN and where do I find it?', excerpt: 'The 17-character code that unlocks a car’s entire history, and the five places to find it.' },
  { slug: 'used-car-checklist', title: 'The used-car buying checklist', excerpt: 'The exact checks to run, on paper and in person, before you hand over any money.' },
  { slug: 'salvage-title-explained', title: 'Salvage, rebuilt & branded titles explained', excerpt: 'What each title brand means, what it does to value, and when to walk away.' },
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
    </div>
  );
}
