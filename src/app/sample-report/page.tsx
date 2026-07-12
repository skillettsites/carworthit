import type { Metadata } from 'next';
import Link from 'next/link';
import { buildFreeReport } from '@/lib/report';
import { getHistory } from '@/lib/vinaudit';
import { getValuation } from '@/lib/valuation';
import ReportView from '@/components/report/ReportView';

export const metadata: Metadata = {
  title: 'Sample report',
  description: 'See exactly what a full CarWorthIt report looks like, history and valuation, before you buy one.',
};

export const dynamic = 'force-dynamic';

const DEMO_VIN = '1HGCV1F30LA000000';

export default async function SampleReport() {
  const free = await buildFreeReport(DEMO_VIN);
  if (!free) {
    return <div className="container-x py-16 max-w-3xl"><p className="text-ink-2">Sample temporarily unavailable, please try a live VIN.</p></div>;
  }
  const [history, valuation] = await Promise.all([getHistory(DEMO_VIN), getValuation(DEMO_VIN, free.specs.year)]);

  return (
    <>
      <div className="bg-brand/10 border-b border-brand/30 py-3 text-center text-sm">
        <strong className="text-brand">Sample report.</strong> Every section shown unlocked.{' '}
        <Link href="/#check" className="text-brand font-semibold hover:underline">Check your own car →</Link>
      </div>
      <ReportView free={free} history={history} valuation={valuation} unlockedHistory unlockedValuation vin={DEMO_VIN} />
    </>
  );
}
