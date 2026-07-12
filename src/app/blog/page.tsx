import type { Metadata } from 'next';
import Link from 'next/link';
import articles from '@/content/articles.json';

export const metadata: Metadata = {
  title: 'Used car guides & advice',
  description: 'Practical US guides on buying, checking, insuring and running used cars, from the most reliable models to how to avoid a bad one.',
};

type Article = { slug: string; title: string; metaDescription: string };

export default function BlogIndex() {
  const list = articles as Article[];
  return (
    <div className="container-x max-w-3xl py-14">
      <h1 className="text-4xl font-extrabold">Used car guides</h1>
      <p className="mt-3 text-lg text-ink-2">Practical advice for buying, checking, insuring and running a used car in the US.</p>
      <div className="mt-10 space-y-4">
        {list.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="block rounded-2xl border border-border bg-white p-6 hover:border-brand transition-colors">
            <h2 className="text-xl font-semibold">{a.title}</h2>
            <p className="mt-1 text-ink-2 text-sm">{a.metaDescription}</p>
            <span className="mt-3 inline-block text-brand text-sm font-semibold">Read →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
