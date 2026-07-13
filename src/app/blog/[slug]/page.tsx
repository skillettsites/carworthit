import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import articles from '@/content/articles.json';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import StickyVinCta from '@/components/StickyVinCta';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

// Compact inline CTA injected mid-article (right after the problems table).
function InlineCta() {
  return (
    <div className="not-prose my-8 rounded-2xl border border-brand/30 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-bold text-ink">Checking a specific car?</p>
        <p className="text-sm text-ink-2 mt-1">Run its VIN free to see title brands, salvage and flood history, an odometer check, and open recalls before you buy.</p>
      </div>
      <Link
        href="/#check"
        className="shrink-0 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500"
      >
        Check a VIN free
      </Link>
    </div>
  );
}

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

// Related guides for internal linking (topical clustering). Prefer same content
// type: "common problems" pages link to other problems pages, buying guides to guides.
function relatedArticles(slug: string) {
  const isProblems = slug.includes('common-problems');
  return ARTICLES.filter((a) => a.slug !== slug)
    .sort((a, b) => {
      const aSame = a.slug.includes('common-problems') === isProblems ? 0 : 1;
      const bSame = b.slug.includes('common-problems') === isProblems ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, 4);
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
  // Inject the inline CTA right after the first table (the common-problems table).
  const html = decode(a.bodyHtml);
  const splitAt = html.indexOf('</table>');
  const bodyBefore = splitAt !== -1 ? html.slice(0, splitAt + '</table>'.length) : html;
  const bodyAfter = splitAt !== -1 ? html.slice(splitAt + '</table>'.length) : '';
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
      <article className="container-x max-w-3xl py-12 pb-28">
        <nav className="text-sm text-ink-2 mb-4">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/blog" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">{a.title}</h1>
        <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyBefore }} />
        <InlineCta />
        {bodyAfter && <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyAfter }} />}

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

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-bold mb-4">Related guides</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {relatedArticles(slug).map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="block rounded-xl border border-border bg-white p-4 hover:border-brand hover:shadow-sm transition-all font-semibold text-ink hover:text-brand"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <Link href="/blog" className="text-brand font-semibold hover:underline">← All guides</Link>
        </div>
      </article>
      <StickyVinCta />
    </>
  );
}
