import type { Metadata } from 'next';
import VinForm from '@/components/VinForm';
import { REPORT_PRICE_USD } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'Enter a VIN, see a free preview of specs, recalls and running costs, then unlock the full history and cost-to-own report for $6.99.',
};

const price = `$${REPORT_PRICE_USD.toFixed(2)}`;

export default function HowItWorks() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <h1 className="text-4xl font-extrabold">How CarWorthIt works</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        No account, no subscription. Enter a VIN, see what&apos;s free instantly, and pay once only if you want the full
        report.
      </p>

      <ol className="mt-10 space-y-8">
        <Step n="1" title="Find the VIN">
          The 17-character Vehicle Identification Number is on the seller&apos;s listing, the lower corner of the
          windshield, the driver&apos;s door jamb, or the title. It uniquely identifies that exact car.
        </Step>
        <Step n="2" title="See the free preview">
          We instantly decode the VIN with NHTSA to show the year, make, model, engine and specs, list every open safety
          recall, and pull the EPA&apos;s real running costs, all free, no signup.
        </Step>
        <Step n="3" title={`Unlock the full report, ${price}`}>
          One payment reveals the full title history: salvage, junk, flood and rebuilt brands, the theft and total-loss
          checks, salvage-auction damage records, every reported odometer reading (to catch rollback), the ownership
          timeline, and the true 5-year cost to own. This is the part that stops you buying a bad car.
        </Step>
      </ol>

      <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold">Where the data comes from</h2>
        <ul className="mt-3 space-y-2 text-ink-2 text-sm leading-relaxed">
          <li><strong className="text-ink">A licensed vehicle-data provider</strong>, for title brands, salvage, junk, theft, odometer and salvage-auction records.</li>
          <li><strong className="text-ink">NHTSA</strong>, for VIN decoding and open safety recalls.</li>
          <li><strong className="text-ink">EPA fueleconomy.gov</strong>, for official MPG and annual fuel cost.</li>
        </ul>
        <p className="mt-3 text-xs text-ink-2">CarWorthIt is not an approved NMVTIS data provider; our history report is not an official NMVTIS report.</p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Check a car now</h2>
        <VinForm size="md" />
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-5">
      <div className="h-10 w-10 shrink-0 rounded-full bg-brand text-white flex items-center justify-center font-bold">{n}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-ink-2 leading-relaxed">{children}</p>
      </div>
    </li>
  );
}
