import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="container-x py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="font-bold text-ink mb-2">Car<span className="text-brand">Worth</span>It</div>
          <p className="text-ink-2 leading-relaxed">
            The essential used-car checks and true cost to own, for a fraction of what the big brands charge.
          </p>
        </div>
        <div>
          <div className="font-semibold text-ink mb-3">Product</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/how-it-works" className="hover:text-ink">How it works</Link></li>
            <li><Link href="/sample-report" className="hover:text-ink">Sample report</Link></li>
            <li><Link href="/pricing" className="hover:text-ink">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink mb-3">Guides</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/guides" className="hover:text-ink">All guides</Link></li>
            <li><Link href="/guides/what-is-a-vin" className="hover:text-ink">What is a VIN?</Link></li>
            <li><Link href="/guides/used-car-checklist" className="hover:text-ink">Used car checklist</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink mb-3">Legal</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/terms" className="hover:text-ink">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">Privacy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-ink">Data & disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-6 text-xs text-ink-2 leading-relaxed">
          <p className="mb-2">
            © {year} {SITE_NAME}. Vehicle history data is supplied by a licensed commercial vehicle-data provider.
            {SITE_NAME} is not affiliated with Carfax or AutoCheck and is not an approved NMVTIS data provider; reports
            are not official NMVTIS reports. Reports are for informational purposes and do not guarantee a
            vehicle&apos;s condition.
          </p>
        </div>
      </div>
    </footer>
  );
}
