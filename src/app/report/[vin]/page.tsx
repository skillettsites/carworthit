import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { isValidVin } from '@/lib/nhtsa';
import { logLookup } from '@/lib/db';
import { buildFreeReport } from '@/lib/report';
import { getHistory, getValuation } from '@/lib/vehicledatabases';
import { getPaidProduct } from '@/lib/stripe';
import ReportView from '@/components/report/ReportView';
import SearchBox from '@/components/SearchBox';

export const dynamic = 'force-dynamic';

type Params = Promise<{ vin: string }>;
type Search = Promise<{ paid?: string; utm_source?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { vin } = await params;
  return { title: `Vehicle report, VIN ${decodeURIComponent(vin).toUpperCase()}`, robots: { index: false } };
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
          The VIN <span className="font-mono">{vin}</span> didn&apos;t return a vehicle from the NHTSA database. Check the
          characters and try again.
        </p>
        <div className="mt-6 max-w-xl"><SearchBox /></div>
      </Shell>
    );
  }

  // Log the lookup. Not awaited: a logging outage must never slow or break a
  // report. The aggregate this builds (year/make/model/state) is the only
  // proprietary dataset this site will ever have and it cannot be backfilled.
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

  const paidToken = typeof sp.paid === 'string' ? sp.paid : '';
  const product = paidToken ? await getPaidProduct(vin, paidToken) : null;
  const unlockedHistory = product === 'history' || product === 'bundle';
  const unlockedValuation = product === 'valuation' || product === 'bundle';

  const [history, valuation] = await Promise.all([
    unlockedHistory ? getHistory(vin) : Promise.resolve(undefined),
    unlockedValuation ? getValuation(vin, free.specs.year) : Promise.resolve(undefined),
  ]);

  return (
    <ReportView
      free={free}
      history={history}
      valuation={valuation}
      unlockedHistory={unlockedHistory}
      unlockedValuation={unlockedValuation}
      vin={vin}
    />
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
