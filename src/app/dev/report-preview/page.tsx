import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import { buildFreeReport } from '@/lib/report';
import { parseFactoryData } from '@/lib/apis/oneauto';
import { buildVerdict } from '@/lib/worthit-report';
import WorthItReport from '@/components/report/WorthItReport';
import type { MarketValuation } from '@/lib/types';

// DEV ONLY. Renders the real Worth-It report from cached API responses so the
// layout can be worked on without spending a credit per reload.
//
// Returns 404 in production, and the fixtures it reads are gitignored: the
// repo is public and the raw Carketa payload contains comparable listings we
// are licensed to use but not to redistribute.

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

const VIN = '5YFVPMAE9MP195479';
const ZIP = '10312';
const MILEAGE = 50000;

function fixture(name: string): Record<string, unknown> | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'fixtures', name), 'utf8'));
  } catch {
    return null;
  }
}

export default async function DevReportPreview({
  searchParams,
}: {
  searchParams: Promise<{ asking?: string }>;
}) {
  if (process.env.NODE_ENV === 'production') notFound();

  const sp = await searchParams;
  const asking = sp.asking ? Number(sp.asking) : 18500;

  const free = await buildFreeReport(VIN);
  if (!free) return <div className="container-x py-16">Free layer failed to build.</div>;

  const carketa = fixture('carketa-corolla.json');
  const decode = fixture('decodeplus-corolla.json');
  if (!carketa || !decode) {
    return (
      <div className="container-x py-16 max-w-2xl">
        <h1 className="text-xl font-bold">Fixtures missing</h1>
        <p className="mt-2 text-ink-2">
          Expected <code>fixtures/carketa-corolla.json</code> and <code>fixtures/decodeplus-corolla.json</code>.
        </p>
      </div>
    );
  }

  // Mirror exactly what getMarketValuation() returns, three fields only. The
  // comparables in the fixture are deliberately not read.
  const d = (carketa.result as Record<string, unknown>).market_pricing_data as Record<string, number>;
  const valuation: MarketValuation = {
    averagePrice: Math.round(d.average_market_price_usd),
    lowPrice: Math.round(d.low_price_usd),
    highPrice: Math.round(d.high_price_usd),
    mileage: MILEAGE,
    zip: ZIP,
    fetchedAt: new Date().toISOString(),
  };

  const factory = parseFactoryData(decode);
  const verdict = buildVerdict(asking, valuation);

  return <WorthItReport report={{ free, valuation, factory, verdict, askingPrice: asking }} />;
}
