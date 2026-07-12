import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import articles from '@/content/articles.json';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

type Article = { slug: string; title: string; metaTitle: string; metaDescription: string; bodyHtml: string; faqs: { q: string; a: string }[] };
const ARTICLES = articles as Article[];

function decode(s: string) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.metaTitle || a.title,
    description: a.metaDescription,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: { title: a.metaTitle || a.title, description: a.metaDescription, type: 'article', url: `${SITE_URL}/blog/${slug}` },
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <>
      <JsonLd
        data={[
          articleSchema({ title: a.title, description: a.metaDescription, slug: a.slug }),
          faqSchema(a.faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Guides', url: `${SITE_URL}/blog` },
            { name: a.title, url: `${SITE_URL}/blog/${slug}` },
          ]),
        ]}
      />
      <article className="container-x max-w-3xl py-12">
        <nav className="text-sm text-ink-2 mb-4">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/blog" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">{a.title}</h1>
        <div className="article-body" dangerouslySetInnerHTML={{ __html: decode(a.bodyHtml) }} />

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold">Check any car before you buy</h2>
          <p className="mt-2 text-ink-2">Run a VIN free: specs, safety ratings, recalls and running costs in seconds.</p>
          <div className="mt-5 max-w-xl mx-auto"><SearchBox /></div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {a.faqs.map((f, i) => (
              <details key={i} className="rounded-xl border border-border bg-white p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {f.q}<span className="text-brand group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-ink-2 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Link href="/blog" className="text-brand font-semibold hover:underline">← All guides</Link>
        </div>
      </article>
    </>
  );
}
