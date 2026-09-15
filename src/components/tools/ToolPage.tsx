import type { ReactNode } from 'react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { CHECKED_ON_TEXT, SOURCES, type Source } from '@/lib/vin-tools/sources';

/**
 * The one template every VIN tool page uses.
 *
 * Shape, in order: H1, answer-first intro (the direct answer in the first 60
 * words), the tool above the fold, the body sections, "what free sources can
 * and cannot show", FAQs rendered on-page AND as FAQPage JSON-LD,
 * BreadcrumbList, optional HowTo, a sources list with the date each was
 * checked, and the honest next step to the paid reports. Server component: the
 * answer text, tables and FAQs are all in the HTML.
 */
export interface Faq {
  q: string;
  a: string;
}

export interface Crumb {
  name: string;
  path: string;
}

export interface ToolPageProps {
  h1: string;
  /** Answer-first paragraph(s). Keep the direct answer in the first 60 words. */
  intro: ReactNode;
  crumbs: Crumb[];
  /** The path of this page, e.g. "/title-check". */
  path: string;
  tool: ReactNode;
  children: ReactNode;
  faqs: Faq[];
  howTo?: { name: string; description: string; steps: { name: string; text: string }[] };
  /** What the free decode and the free sources CAN show, and what they cannot. */
  freeCan: string[];
  freeCannot: string[];
  /** Which source ids from sources.ts this page relies on. */
  sourceIds: (keyof typeof SOURCES)[];
  /** Extra sources not in the shared registry (per-make paint locators, etc.). */
  extraSources?: Source[];
  /** Override the default next-step block. */
  nextStep?: ReactNode;
  /** Related tool links rendered at the end. */
  related?: { href: string; label: string }[];
  /** Hide the sticky CTA on pages where it would be noise. */
  noSticky?: boolean;
}

export function DefaultNextStep({ context }: { context?: string }) {
  return (
    <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
      <h2 className="text-xl font-bold">What the paid reports add, honestly</h2>
      <p className="mt-2 text-ink-2">
        {context ||
          'The decode above is free and always will be. CarWorthIt does not sell vehicle history, and says so on every page.'}{' '}
        What we do sell is price and factory data for the exact VIN:
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-2">
        <li>
          <strong className="text-ink">
            {PRODUCTS.valuation.name}, ${PRODUCTS.valuation.price}:
          </strong>{' '}
          {PRODUCTS.valuation.blurb}
        </li>
        <li>
          <strong className="text-ink">
            {PRODUCTS.worthit.name}, ${PRODUCTS.worthit.price}:
          </strong>{' '}
          {PRODUCTS.worthit.blurb}
        </li>
        <li>
          <strong className="text-ink">
            {PRODUCTS.negotiation.name}, ${PRODUCTS.negotiation.price}:
          </strong>{' '}
          {PRODUCTS.negotiation.blurb}
        </li>
      </ul>
      <p className="mt-3 text-sm text-ink-2">
        Run any VIN free first: the free report already includes open recalls, crash-test ratings and running costs.{' '}
        <Link href="/pricing" className="text-brand underline">
          Pricing
        </Link>{' '}
        and{' '}
        <Link href="/sample-report" className="text-brand underline">
          a sample report
        </Link>
        .
      </p>
    </div>
  );
}

export default function ToolPage({
  h1,
  intro,
  crumbs,
  path,
  tool,
  children,
  faqs,
  howTo,
  freeCan,
  freeCannot,
  sourceIds,
  extraSources = [],
  nextStep,
  related = [],
  noSticky = false,
}: ToolPageProps) {
  const sources: Source[] = [...sourceIds.map((id) => SOURCES[id]), ...extraSources];
  const ld: object[] = [
    faqSchema(faqs),
    breadcrumbSchema([{ name: 'Home', url: SITE_URL }, ...crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.path}` }))]),
  ];
  if (howTo) ld.push(howToSchema(howTo.name, howTo.description, howTo.steps));

  return (
    <>
      <JsonLd data={ld} />
      <div className="container-x max-w-3xl py-12 pb-28">
        <nav className="mb-4 text-sm text-ink-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          {crumbs.map((c, i) => (
            <span key={c.path}>
              {' / '}
              {i === crumbs.length - 1 ? (
                <span className="text-ink">{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:text-ink">
                  {c.name}
                </Link>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-extrabold md:text-4xl">{h1}</h1>
        <div className="mt-3 space-y-3 text-lg leading-relaxed text-ink-2 [&_a]:text-brand [&_a]:underline [&_strong]:text-ink">{intro}</div>
        <p className="mt-2 text-xs text-muted">Facts and links on this page were checked on {CHECKED_ON_TEXT}.</p>

        <div className="mt-6">{tool}</div>

        <div className="mt-10 space-y-3 leading-relaxed text-ink-2 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_strong]:text-ink [&_a]:text-brand [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5">
          {children}
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-good/30 bg-good/5 p-5">
            <h2 className="text-lg font-bold text-ink">What free sources can show</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
              {freeCan.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-bad/30 bg-bad/5 p-5">
            <h2 className="text-lg font-bold text-ink">What they cannot</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
              {freeCannot.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </section>

        {howTo && (
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold">{howTo.name}</h2>
            <p className="mt-2 text-ink-2">{howTo.description}</p>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-ink-2">
              {howTo.steps.map((s) => (
                <li key={s.name}>
                  <strong className="text-ink">{s.name}.</strong> {s.text}
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold">Common questions</h2>
          <div className="mt-4 space-y-5">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-1 leading-relaxed text-ink-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {nextStep === undefined ? <DefaultNextStep /> : nextStep}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">Related free tools</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="block rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 border-t border-border pt-6">
          <h2 className="text-base font-bold">Sources checked for this page</h2>
          <ul className="mt-2 space-y-1 text-xs text-ink-2">
            {sources.map((s) => (
              <li key={s.id + s.url}>
                <a href={s.url} target="_blank" rel="nofollow noopener" className="text-brand underline">
                  {s.name}
                </a>
                , checked {formatDate(s.checked)}
                {s.note ? `: ${s.note}` : ''}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-2">
            CarWorthIt is not an NMVTIS-approved data provider, does not sell vehicle history reports, and is not affiliated with
            Carfax, AutoCheck, Kelley Blue Book, Edmunds or NADA.
          </p>
        </section>
      </div>
      {!noSticky && <StickyVinCta />}
    </>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[m - 1]} ${d}, ${y}`;
}
