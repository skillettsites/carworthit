import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { isValidVin } from '@/lib/nhtsa';
import { buildFreeReport } from '@/lib/report';
import { getMarketValuation, getFactoryData } from '@/lib/apis/oneauto';
import { getPaidSession } from '@/lib/stripe';
import { buildVerdict } from '@/lib/worthit-report';
import { buildNegotiationPack, type NegotiationPack } from '@/lib/negotiation';
import { SITE_URL, includesFactory, includesNegotiation } from '@/lib/constants';
import { logLookup, logPurchase, getCachedReport, cacheReport, healCachedReport } from '@/lib/db';
import type { FactoryData, MarketValuation } from '@/lib/types';
import WorthItReport from '@/components/report/WorthItReport';
import BuyCards from '@/components/report/BuyCards';
import SearchBox from '@/components/SearchBox';

export const dynamic = 'force-dynamic';

type Params = Promise<{ vin: string }>;
type Search = Promise<{ paid?: string; utm_source?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { vin } = await params;
  const v = decodeURIComponent(vin).toUpperCase();
  return {
    title: `Vehicle report, VIN ${v}`,
    // Never indexed. These are per-vehicle pages with no search value, they
    // would bloat the crawl budget, and a paid report should not be public.
    robots: { index: false, follow: false },
    // Self-canonical, not the inherited one. Without this the page inherited
    // the layout's canonical and told Google "do not index me" while also
    // pointing at the homepage as the canonical version of itself, which are
    // contradictory instructions about two different URLs.
    alternates: { canonical: `${SITE_URL}/report/${encodeURIComponent(v)}` },
    // Per-VIN pages are private. Inheriting the site-wide card meant a shared
    // link previewed as the homepage.
    openGraph: { title: `Vehicle report, VIN ${v}`, url: `${SITE_URL}/report/${encodeURIComponent(v)}` },
  };
}

export default async function ReportPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { vin: raw } = await params;
  const sp = await searchParams;
  const vin = decodeURIComponent(raw).trim().toUpperCase();

  if (!isValidVin(vin)) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold">That doesn&apos;t look like a valid VIN</h1>
        <p className="mt-2 text-ink-2">A VIN is exactly 17 characters (no I, O or Q). Double-check and try again.</p>
        <div className="mt-6 max-w-xl"><SearchBox /></div>
      </Shell>
    );
  }

  const free = await buildFreeReport(vin);
  if (!free) {
    // A paying customer must never hit a dead end here.
    //
    // This branch fires whenever NHTSA vPIC cannot decode the VIN, and vPIC
    // returns 503 often enough that we already carry a snapshot fallback on
    // /sample-report for exactly that reason. Because `success_url` always
    // points at the FIRST vehicle, a five-car buyer whose first VIN failed to
    // decode lost the only door into their order: no sibling links, no
    // comparison, no refund route. So resolve the payment before bailing, and
    // if there is one, hand back the rest of the order and a way to reach us.
    const paidOnFail = typeof sp.paid === 'string' ? await getPaidSession(vin, sp.paid) : null;
    return (
      <Shell>
        <h1 className="text-2xl font-bold">We couldn&apos;t decode that VIN</h1>
        <p className="mt-2 text-ink-2">
          The VIN <span className="font-mono">{vin}</span> didn&apos;t return a vehicle from the NHTSA database. That
          usually means a typo, but NHTSA also goes down from time to time, so it is worth trying again shortly.
        </p>
        {paidOnFail ? (
          <div className="mt-6 rounded-2xl border border-brand/40 bg-brand/5 p-5">
            <p className="text-sm font-semibold text-ink">Your purchase is safe.</p>
            {paidOnFail.vins.length > 1 && (
              <>
                <p className="mt-2 text-sm text-ink-2">The other vehicles in this order are ready:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {paidOnFail.vins
                    .filter((v) => v !== vin)
                    .map((v) => (
                      <Link
                        key={v}
                        href={`/report/${v}?paid=${encodeURIComponent(sp.paid as string)}`}
                        className="rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs text-ink-2 hover:border-brand hover:text-ink"
                      >
                        {v}
                      </Link>
                    ))}
                  <Link
                    href={`/compare?paid=${encodeURIComponent(sp.paid as string)}`}
                    className="rounded-lg border-2 border-brand bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark"
                  >
                    Compare all →
                  </Link>
                </div>
              </>
            )}
            <p className="mt-3 text-sm text-ink-2">
              Keep this page&apos;s link. If this VIN still will not decode, email{' '}
              <a href="mailto:support@carworthit.com" className="font-semibold text-brand hover:underline">
                support@carworthit.com
              </a>{' '}
              and we will sort it out or refund you.
            </p>
          </div>
        ) : (
          <div className="mt-6 max-w-xl"><SearchBox /></div>
        )}
      </Shell>
    );
  }

  // Log the lookup. Not awaited: a logging outage must never slow or break a
  // report. The aggregate this builds is the only proprietary dataset this
  // site will ever have and it cannot be backfilled.
  const h = await headers();
  const ua = h.get('user-agent') || '';
  logLookup({
    vin,
    year: free.specs.year,
    make: free.specs.make,
    model: free.specs.model,
    trim: free.specs.trim,
    bodyClass: free.specs.bodyClass,
    fuelType: free.specs.fuelType,
    state: h.get('x-vercel-ip-country-region'),
    country: h.get('x-vercel-ip-country'),
    referrer: h.get('referer'),
    utmSource: typeof sp.utm_source === 'string' ? sp.utm_source : null,
    isBot: /bot|crawl|spider|headless|preview|monitor/i.test(ua),
  });

  // Paid data is fetched only for a verified, paid Stripe session, and only
  // for the VIN that session was created against.
  const paid = typeof sp.paid === 'string' ? await getPaidSession(vin, sp.paid) : null;

  let valuation: MarketValuation | null = null;
  let factory: FactoryData | null = null;
  if (paid) {
    // The cache key, NOT the raw session id. One payment can cover five
    // vehicles, and `cwi_reports` is keyed on this value, so sharing the raw
    // session id across them would give all five the first vehicle's report.
    const token = paid.cacheKey;

    // Serve a previously purchased report from cache. Without this, every
    // revisit re-calls the paid APIs: a buyer who bookmarks their report and
    // checks it weekly while car shopping costs more than the report sold for.
    // The Negotiation Bundle leans on the build record (warranty terms, sticker
    // price, factory options), so it needs the factory call as much as the
    // Full Report does.
    const wantsFactory = includesFactory(paid.product);

    const cached = await getCachedReport<{ valuation: MarketValuation | null; factory: FactoryData | null }>(token);
    // A cache entry is only usable if it holds everything this tier paid for.
    // `cwi_reports` is keyed on the session id, the anon role has INSERT only
    // and there is no upsert, so the first write wins permanently. A row cached
    // with `factory: null` used to brick the paid half of the report forever:
    // the buyer paid for "what it cost new, its factory options and full
    // standard equipment" and could never be served it, on any later visit.
    // VIN Decode Plus misses are not rare, it returns a 200 with an empty
    // payload for vehicles it has no record of.
    const cacheUsable = !!cached && (!wantsFactory || cached.factory != null);

    if (cached && cacheUsable) {
      valuation = cached.valuation ?? null;
      factory = cached.factory ?? null;
    } else {
      [valuation, factory] = await Promise.all([
        getMarketValuation(vin, paid.ctx.zip, paid.ctx.mileage),
        wantsFactory ? getFactoryData(vin) : Promise.resolve(null),
      ]);
      // Fall back to a partial cached row rather than showing less than a
      // previous visit did, in case this retry is the one that failed.
      if (!valuation && cached?.valuation) valuation = cached.valuation;
      if (!factory && cached?.factory) factory = cached.factory;

      // Only write a row we would be happy to serve forever. An incomplete
      // result is retried on the next visit instead of being frozen in.
      const worthCaching = !!valuation && (!wantsFactory || factory != null);
      if (worthCaching) {
        // Heal rather than insert when a poisoned row is already there, since
        // the session id is the primary key and anon cannot upsert.
        if (cached) healCachedReport(token, { valuation, factory });
        else cacheReport(token, vin, paid.product, { valuation, factory });
      }
    }

    // Log the sale ONCE per order, against the first vehicle. Viewing vehicles
    // two through five must not each insert a row for the same payment: the
    // unique index would reject the duplicates anyway, but only after this had
    // reported one $22 basket as five separate $22 sales.
    if (paid.index === 0) {
      logPurchase({
        sessionId: sp.paid as string,
        // What Stripe actually collected, not the tier's list price. The old
        // inline ternary logged every non-worthit sale at 299, a list price
        // would over-report every upgrade, and neither knew about baskets.
        amountCents: paid.amountCents,
        product: paid.product,
        email: paid.email,
        vin,
        state: h.get('x-vercel-ip-country-region'),
      });
    }
  }

  const verdict = buildVerdict(paid?.ctx.asking ?? null, valuation);

  // Built server-side, and only for a tier that paid for it.
  const pack: NegotiationPack | null =
    paid && includesNegotiation(paid.product) && valuation
      ? buildNegotiationPack(free, valuation, factory, paid.ctx.asking)
      : null;

  return (
    <>
      {paid && !valuation && (
        <div className="bg-warn/10 border-b border-warn/30 py-3 text-center text-sm">
          <strong className="text-warn">We couldn&apos;t price this one.</strong> No comparable cars were listed near
          ZIP {paid.ctx.zip}. Email{' '}
          <a href="mailto:support@carworthit.com" className="font-semibold underline">support@carworthit.com</a> and
          we&apos;ll refund you.
        </div>
      )}
      <WorthItReport
        report={{ free, valuation, factory, verdict, askingPrice: paid?.ctx.asking ?? null }}
        pack={pack}
        siblings={
          paid && paid.vins.length > 1
            ? { vins: paid.vins, index: paid.index, token: sp.paid as string }
            : undefined
        }
        // Cards at the top of the report, the way CarCostCheck does it.
        buy={
          <BuyCards
            vin={vin}
            vehicle={[free.specs.year, free.specs.make, free.specs.model, factory?.trim || free.specs.trim]
              .filter(Boolean)
              .join(' ')}
            tier={paid?.product ?? null}
            defaults={paid ? { mileage: paid.ctx.mileage, zip: paid.ctx.zip, asking: paid.ctx.asking } : undefined}
            paidToken={paid ? (sp.paid as string) : null}
          />
        }
      />
    </>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface min-h-screen">
      <div className="container-x py-10 max-w-3xl">
        <div className="mb-6"><Link href="/" className="text-sm text-brand hover:underline">← New search</Link></div>
        {children}
      </div>
    </div>
  );
}
