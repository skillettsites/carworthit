import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { isValidVin } from '@/lib/nhtsa';
import { buildFreeReport } from '@/lib/report';
import { getMarketValuation, getFactoryData } from '@/lib/apis/oneauto';
import { getPaidSession } from '@/lib/stripe';
import { buildVerdict } from '@/lib/worthit-report';
import { logLookup, logPurchase, getCachedReport, cacheReport } from '@/lib/db';
import type { FactoryData, MarketValuation } from '@/lib/types';
import WorthItReport from '@/components/report/WorthItReport';
import ValuationUnlock from '@/components/report/ValuationUnlock';
import SearchBox from '@/components/SearchBox';

export const dynamic = 'force-dynamic';

type Params = Promise<{ vin: string }>;
type Search = Promise<{ paid?: string; utm_source?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { vin } = await params;
  return {
    title: `Vehicle report, VIN ${decodeURIComponent(vin).toUpperCase()}`,
    // Never indexed. These are per-vehicle pages with no search value, they
    // would bloat the crawl budget, and a paid report should not be public.
    robots: { index: false, follow: false },
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
    return (
      <Shell>
        <h1 className="text-2xl font-bold">We couldn&apos;t decode that VIN</h1>
        <p className="mt-2 text-ink-2">
          The VIN <span className="font-mono">{vin}</span> didn&apos;t return a vehicle from the NHTSA database. Check
          the characters and try again.
        </p>
        <div className="mt-6 max-w-xl"><SearchBox /></div>
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
    const token = sp.paid as string;

    // Serve a previously purchased report from cache. Without this, every
    // revisit re-calls the paid APIs: a buyer who bookmarks their report and
    // checks it weekly while car shopping costs more than the report sold for.
    const cached = await getCachedReport<{ valuation: MarketValuation | null; factory: FactoryData | null }>(token);
    if (cached) {
      valuation = cached.valuation ?? null;
      factory = cached.factory ?? null;
    } else {
      const wantsFactory = paid.product === 'worthit';
      [valuation, factory] = await Promise.all([
        getMarketValuation(vin, paid.ctx.zip, paid.ctx.mileage),
        wantsFactory ? getFactoryData(vin) : Promise.resolve(null),
      ]);
      // Only cache a result worth serving again. Caching a failed lookup would
      // permanently freeze a paying customer's report as empty.
      if (valuation) cacheReport(token, vin, paid.product, { valuation, factory });
    }

    logPurchase({
      sessionId: sp.paid as string,
      product: paid.product,
      amountCents: paid.product === 'worthit' ? 699 : 299,
      email: paid.email,
      vin,
      state: h.get('x-vercel-ip-country-region'),
    });
  }

  const verdict = buildVerdict(paid?.ctx.asking ?? null, valuation);

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
        unlock={
          <ValuationUnlock
            vin={vin}
            tier={paid?.product ?? null}
            defaults={paid ? { mileage: paid.ctx.mileage, zip: paid.ctx.zip, asking: paid.ctx.asking } : undefined}
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
