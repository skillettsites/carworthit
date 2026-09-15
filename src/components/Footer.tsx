import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-x grid gap-8 py-12 text-sm sm:grid-cols-2 lg:grid-cols-5">
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
            <li><Link href="/about" className="hover:text-ink">About</Link></li>
            <li><Link href="/press" className="hover:text-ink">Press</Link></li>
          </ul>
          {/* The VIN tool cluster (September 15, 2026): free NHTSA-data pages
              that route history questions to the official sources. Sitewide
              links so each new page has an inbound link from every page. */}
          <div className="mb-3 mt-6 font-semibold text-ink">Free VIN tools</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/vin-decoder" className="hover:text-ink">VIN decoder</Link></li>
            <li><Link href="/title-check" className="hover:text-ink">Title check</Link></li>
            <li><Link href="/lien-check" className="hover:text-ink">Lien check</Link></li>
            <li><Link href="/stolen-vehicle-check" className="hover:text-ink">Stolen vehicle check</Link></li>
            <li><Link href="/window-sticker" className="hover:text-ink">Window sticker by VIN</Link></li>
            <li><Link href="/vin-year-chart" className="hover:text-ink">VIN year chart</Link></li>
            <li><Link href="/tools" className="hover:text-ink">All tools</Link></li>
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
          {/* The state tax and fee cluster: four hubs on one verified dataset. */}
          <div className="mb-3 mt-6 font-semibold text-ink">Taxes and fees</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/car-sales-tax-calculator" className="hover:text-ink">Car sales tax by state</Link></li>
            <li><Link href="/out-the-door-price-calculator" className="hover:text-ink">Out-the-door price</Link></li>
            <li><Link href="/dealer-doc-fee-by-state" className="hover:text-ink">Dealer doc fees by state</Link></li>
            <li><Link href="/car-registration-fees-by-state" className="hover:text-ink">Registration fees by state</Link></li>
          </ul>
        </div>
        <div>
          {/* The history-report cluster: the pages that say, with dated prices,
              what the history providers charge and that we are not one. */}
          <div className="mb-3 font-semibold text-ink">Checking a used car</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/best-vehicle-history-report" className="hover:text-ink">Best vehicle history report</Link></li>
            <li><Link href="/vehicle-history-faq" className="hover:text-ink">Vehicle history FAQ</Link></li>
            <li><Link href="/blog/carfax-report-cost" className="hover:text-ink">Carfax report cost</Link></li>
            <li><Link href="/guides/used-car-checklist" className="hover:text-ink">Used-car checklist</Link></li>
            <li><Link href="/vin-decoder" className="hover:text-ink">Free VIN decoder</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold text-ink">What a car is worth</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/blog/how-to-price-a-used-car-by-vin" className="hover:text-ink">Pricing a car by VIN</Link></li>
            <li><Link href="/blog/kelley-blue-book-alternatives" className="hover:text-ink">KBB alternatives</Link></li>
            <li><Link href="/blog/kbb-vs-edmunds-vs-nada" className="hover:text-ink">KBB vs Edmunds vs NADA</Link></li>
            <li><Link href="/blog/carvana-vs-carmax-offer" className="hover:text-ink">Carvana vs CarMax</Link></li>
            <li><Link href="/negotiate-used-car-price" className="hover:text-ink">Negotiate a used car price</Link></li>
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
          {/* Trimmed to the two things that actually have to be here: values
              are estimates, and we are nobody else's brand. The old version
              also narrated where the data came from, which belongs on
              /methodology for editors rather than under every customer page. */}
          <p className="mb-2">
            © {year} {SITE_NAME}. Market values are estimates, not appraisals. {SITE_NAME} does not provide vehicle
            history reports, is not an approved NMVTIS data provider, and is not affiliated with Carfax, AutoCheck,
            Experian or Kelley Blue Book.
          </p>
        </div>
      </div>
    </footer>
  );
}
