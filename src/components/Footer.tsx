import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-x grid gap-8 py-12 text-sm md:grid-cols-4">
        <div>
          <div className="mb-2 font-bold text-ink">
            Car<span className="text-brand">Worth</span>It
          </div>
          <p className="leading-relaxed text-ink-2">
            What a used car is really worth, priced at its mileage against cars actually for sale near you.
          </p>
        </div>
        <div>
          <div className="mb-3 font-semibold text-ink">Product</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/how-it-works" className="hover:text-ink">How it works</Link></li>
            <li><Link href="/sample-report" className="hover:text-ink">Sample report</Link></li>
            <li><Link href="/pricing" className="hover:text-ink">Pricing</Link></li>
            <li><Link href="/methodology" className="hover:text-ink">Methodology</Link></li>
            <li><Link href="/about" className="hover:text-ink">About</Link></li>
            <li><Link href="/press" className="hover:text-ink">Press</Link></li>
          </ul>
        </div>
        <div>
          {/* The diminished-value cluster is the strategic bet, so it gets a
              sitewide link rather than being buried in the blog index. */}
          <div className="mb-3 font-semibold text-ink">Diminished value</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/blog/what-is-diminished-value" className="hover:text-ink">What is diminished value?</Link></li>
            <li><Link href="/blog/how-to-calculate-diminished-value" className="hover:text-ink">How to calculate it</Link></li>
            <li><Link href="/blog/how-to-file-a-diminished-value-claim" className="hover:text-ink">Filing a claim</Link></li>
            <li><Link href="/blog/diminished-value-by-state" className="hover:text-ink">Rules by state</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold text-ink">What a car is worth</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/blog/how-to-price-a-used-car-by-vin" className="hover:text-ink">Pricing a car by VIN</Link></li>
            <li><Link href="/blog/kelley-blue-book-alternatives" className="hover:text-ink">KBB alternatives</Link></li>
            <li><Link href="/blog/kbb-vs-edmunds-vs-nada" className="hover:text-ink">KBB vs Edmunds vs NADA</Link></li>
            <li><Link href="/blog/carvana-vs-carmax-offer" className="hover:text-ink">Carvana vs CarMax</Link></li>
            <li><Link href="/blog" className="hover:text-ink">All guides</Link></li>
          </ul>
          <div className="mb-3 mt-6 font-semibold text-ink">Legal</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/terms" className="hover:text-ink">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">Privacy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-ink">Data &amp; disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-6 text-xs leading-relaxed text-ink-2">
          <p className="mb-2">
            © {year} {SITE_NAME}. Market values are supplied by a licensed US vehicle-pricing provider and are
            estimates based on comparable vehicles currently listed for sale, not appraisals. {SITE_NAME} does not
            provide vehicle history reports, is not an approved NMVTIS data provider, and is not affiliated with
            Carfax, AutoCheck, Experian or Kelley Blue Book.
          </p>
        </div>
      </div>
    </footer>
  );
}
