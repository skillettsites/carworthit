import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidReportToken } from '@/lib/report-token';
import { getSessionIdByToken } from '@/lib/db';
import { peekOrderVins } from '@/lib/stripe';
import { SITE_URL, SUPPORT_EMAIL } from '@/lib/constants';
import SearchBox from '@/components/SearchBox';

/** Same frame the report page uses for its own dead ends. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface min-h-screen">
      <div className="container-x py-10 max-w-3xl">
        <div className="mb-6">
          <Link href="/" className="text-sm text-brand hover:underline">
            ← New search
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

// Always live. This resolves a paid order against Stripe, so a cached answer
// could hand one buyer another buyer's redirect.
export const dynamic = 'force-dynamic';

type Params = Promise<{ token: string }>;
type Search = Promise<{ v?: string }>;

export const metadata: Metadata = {
  title: 'Your report',
  // Same reasoning as /report/[vin]: a paid report is private and these URLs
  // have no search value.
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}` },
};

/**
 * The short link we email after a purchase.
 *
 * The email cannot carry /report/<VIN>?paid=<66-character session id> without
 * looking like tracking spam and wrapping across lines in half the clients it
 * lands in, so it carries /r/<last 12 of that id> and this page turns it back
 * into the real thing.
 *
 * The token is resolved against `cwi_purchases`, which the webhook writes on
 * payment whether or not the buyer ever returned to the site, so the link
 * works even for someone who closed the tab at Stripe's confirmation screen.
 * That is the entire failure this page exists to prevent.
 */
export default async function ReportLinkPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const clean = decodeURIComponent(token || '').trim();
  const wanted = typeof sp.v === 'string' ? sp.v.trim().toUpperCase() : '';

  let target: string | null = null;

  // `redirect` throws by design, so it must not be called inside a try block:
  // the catch would swallow the redirect and render the fallback instead.
  if (isValidReportToken(clean)) {
    const sessionId = await getSessionIdByToken(clean);
    if (sessionId) {
      // Read the VIN back off the paid Stripe session rather than storing it.
      // cwi_purchases deliberately keeps only a salted hash of the VIN, and
      // Stripe already holds the plaintext in the session metadata it was
      // created with.
      const vins = await peekOrderVins(sessionId);
      if (vins.length > 0) {
        // `?v=` picks one car out of a multi-vehicle order. It is only ever a
        // hint: a VIN that is not in this paid order is ignored in favour of
        // the first, so a tampered link cannot unlock a car nobody paid for.
        const vin = wanted && vins.includes(wanted) ? wanted : vins[0];
        target = `/report/${encodeURIComponent(vin)}?paid=${encodeURIComponent(sessionId)}`;
      }
    }
  }

  if (target) redirect(target);

  // Anything that did not resolve. Deliberately not a bare 404: whoever is
  // here has almost certainly paid us, so the page has to give them a way to
  // reach a human rather than a dead end.
  return (
    <Shell>
      <div>
        <h1 className="text-2xl font-bold">We could not open that report link</h1>
        <p className="mt-3 text-ink-2">
          The link may have been broken across two lines by your email app, or copied without its
          last few characters. Try clicking it again from the original email rather than pasting it.
        </p>
        <p className="mt-4 text-ink-2">
          If it still will not open, email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-brand hover:underline">
            {SUPPORT_EMAIL}
          </a>{' '}
          from the address you bought with and we will send your report straight back, or refund
          you. You will not need to pay again.
        </p>
        <div className="mt-8 max-w-xl">
          <p className="mb-2 text-sm font-semibold">Checking a different car?</p>
          <SearchBox />
        </div>
      </div>
    </Shell>
  );
}
