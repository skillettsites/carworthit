import Link from 'next/link';
import { CHECKED_ON, CHECKED_ON_LONG, nmvtisLabel, type Provider, type Source } from '@/lib/vhr-providers';

/**
 * Server-rendered building blocks shared by the history-report cluster.
 *
 * None of this is interactive, and it must stay that way: the answer text,
 * the prices and the FAQ answers have to be in the HTML a crawler or an
 * assistant fetches, not painted in afterwards by a client component.
 */

/** The dated line every page in the cluster carries near the top. */
export function CheckedOn({ what = 'Prices and terms' }: { what?: string }) {
  return (
    <p className="mt-3 text-sm text-ink-2">
      {what} checked on each provider&apos;s own site on <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>.
      Providers change prices without notice; the source for every figure is listed at the foot of the page.
    </p>
  );
}

const cell = 'py-2.5 pr-4 align-top';

/** The dated comparison table. Columns are fixed so every page reads the same way. */
export function ProviderTable({ providers, compact = false }: { providers: Provider[]; compact?: boolean }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border" tabIndex={0}>
      <table className="w-full min-w-[720px] text-sm">
        <caption className="sr-only">Vehicle history report providers compared, prices checked {CHECKED_ON_LONG}</caption>
        <thead>
          <tr className="border-b border-border bg-surface text-left">
            <th className="py-2.5 pl-3 pr-4 font-semibold">Provider</th>
            <th className={`${cell} font-semibold`}>One report</th>
            <th className={`${cell} font-semibold`}>Packs or subscription</th>
            <th className={`${cell} font-semibold`}>Pricing model</th>
            <th className={`${cell} font-semibold`}>NMVTIS-approved for consumers?</th>
            {!compact && <th className={`${cell} font-semibold`}>What it includes</th>}
            {!compact && <th className={`${cell} font-semibold`}>What it lacks</th>}
            <th className={`${cell} font-semibold`}>Checked</th>
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {providers.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0">
              <td className="py-2.5 pl-3 pr-4 align-top font-semibold text-ink">
                {p.url.startsWith('/') ? (
                  <Link href={p.url} className="text-brand underline">
                    {p.name}
                  </Link>
                ) : (
                  <a href={p.url} rel="nofollow noopener" target="_blank" className="text-brand underline">
                    {p.name}
                  </a>
                )}
              </td>
              <td className={cell}>{p.single}</td>
              <td className={cell}>{p.packs}</td>
              <td className={cell}>{p.model}</td>
              <td className={cell}>{nmvtisLabel(p.nmvtis)}</td>
              {!compact && <td className={cell}>{p.includes}</td>}
              {!compact && <td className={cell}>{p.gap}</td>}
              <td className={`${cell} whitespace-nowrap`}>
                <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Questions and answers rendered as plain headings and paragraphs, mirrored in FAQPage JSON-LD by the page. */
export function FaqBlock({ faqs, heading = 'Common questions' }: { faqs: { q: string; a: string }[]; heading?: string }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold">{heading}</h2>
      <div className="mt-4 space-y-5">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-bold text-ink">{f.q}</h3>
            <p className="mt-1 leading-relaxed text-ink-2">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** The sources every figure on the page came from, dated, so a reader or a model can check them. */
export function SourcesNote({ sources }: { sources: Source[] }) {
  return (
    <section className="mt-10 rounded-xl border border-border bg-surface p-5 text-sm">
      <h2 className="font-bold text-ink">Sources and dates checked</h2>
      <ul className="mt-2 space-y-1.5 text-ink-2">
        {sources.map((s) => (
          <li key={s.url + s.claim}>
            <a href={s.url} rel="nofollow noopener" target="_blank" className="text-brand underline break-all">
              {s.url}
            </a>
            <span> (checked {s.checked}): {s.claim}</span>
            {s.note && <span className="block text-xs text-ink-2/80">{s.note}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export const CLUSTER_LINKS: { href: string; label: string }[] = [
  { href: '/best-vehicle-history-report', label: 'Best vehicle history report' },
  { href: '/vehicle-history-faq', label: 'Vehicle history FAQ' },
  { href: '/blog/carfax-report-cost', label: 'What a Carfax report costs' },
  { href: '/blog/is-carfax-worth-it', label: 'Is Carfax worth it?' },
  { href: '/bumper-review', label: 'Bumper review' },
  { href: '/autocheck-free', label: 'Free AutoCheck report' },
  { href: '/blog/autocheck-vs-carfax', label: 'AutoCheck vs Carfax' },
  { href: '/blog/free-vin-check', label: 'What you can check free' },
  { href: '/guides/used-car-checklist', label: 'Used-car checklist' },
  { href: '/blog/salvage-vs-rebuilt-title', label: 'Salvage vs rebuilt title' },
  { href: '/vin-decoder', label: 'Free VIN decoder' },
];

/** Cross-links inside the cluster. `except` is the current page. */
export function ClusterLinks({ except }: { except: string }) {
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-xl font-bold">More on checking a used car</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {CLUSTER_LINKS.filter((l) => l.href !== except).map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block rounded-lg border border-border bg-white px-4 py-2.5 font-medium text-ink hover:border-brand hover:text-brand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The honest handoff to the paid product, used where a page has just told someone the history is only half the job. */
export function NotAHistoryReport() {
  return (
    <p className="mt-3 text-sm text-ink-2">
      CarWorthIt is not a vehicle history report and is not an NMVTIS provider. We hold no title, accident, theft,
      odometer or lien records. We price the car; for its past, use one of the providers above.
    </p>
  );
}
