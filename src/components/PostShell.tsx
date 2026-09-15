import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import StickyVinCta from '@/components/StickyVinCta';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, ANALYST } from '@/lib/constants';

/**
 * Layout for a /blog/<slug> post that is written as a page rather than a JSON
 * body. Mirrors src/app/blog/[slug]/page.tsx (breadcrumb, byline, FAQ, related
 * links, VIN CTA, sticky bar, Article + FAQPage + BreadcrumbList JSON-LD) so a
 * reader cannot tell the two apart. Used for the posts whose prices come from
 * src/lib/vhr-providers.ts and must never be frozen into static HTML.
 */

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export default function PostShell({
  slug,
  title,
  description,
  published,
  updated,
  faqs,
  related,
  children,
}: {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  faqs: { q: string; a: string }[];
  related: { href: string; title: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          articleSchema({ title, description, slug, datePublished: published, dateModified: updated }),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Guides', url: `${SITE_URL}/blog` },
            { name: title, url: `${SITE_URL}/blog/${slug}` },
          ]),
        ]}
      />
      <article className="container-x max-w-3xl py-12 pb-28">
        <nav className="text-sm text-ink-2 mb-4">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/blog" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h1>
        <div className="mt-3 mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-2">
          <span>
            By{' '}
            <Link href="/about" className="font-medium text-ink hover:text-brand">
              {ANALYST.name}
            </Link>
            , {ANALYST.role}
          </span>
          <span aria-hidden>·</span>
          <span>
            {updated !== published ? 'Updated' : 'Published'} <time dateTime={updated}>{fmtDate(updated)}</time>
          </span>
        </div>

        <div className="article-body">{children}</div>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold">Check any car before you buy</h2>
          <p className="mt-2 text-ink-2">Run a VIN free: specs, safety ratings, recalls and running costs in seconds. Not a history report.</p>
          <div className="mt-5 max-w-xl mx-auto"><SearchBox /></div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-white p-5 group">
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
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
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
