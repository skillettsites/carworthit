import type { Metadata } from 'next';
import Article from '@/components/Article';
import { SITE_NAME, SUPPORT_EMAIL, SITE_URL, PRODUCTS } from '@/lib/constants';

export const metadata: Metadata = { title: 'Terms of Service', description: `Terms of Service for ${SITE_NAME}.`, alternates: { canonical: `${SITE_URL}/terms` } };

export default function Page() {
  return (
    <Article title="Terms of Service" subtitle="Last updated: August 6, 2026">
      <p>By using {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) you agree to these terms.</p>

      <h2>The service</h2>
      <p>
        We provide vehicle valuation and information reports compiled from third-party and public data sources. A free
        report is available for any valid VIN that NHTSA can decode. There are three paid tiers, each a one-time
        payment with no subscription and no account to cancel:
      </p>
      <ul>
        <li><strong>{PRODUCTS.valuation.name}</strong>, ${PRODUCTS.valuation.price}. {PRODUCTS.valuation.blurb}</li>
        <li><strong>{PRODUCTS.worthit.name}</strong>, ${PRODUCTS.worthit.price}. {PRODUCTS.worthit.blurb}</li>
        <li><strong>{PRODUCTS.negotiation.name}</strong>, ${PRODUCTS.negotiation.price}. {PRODUCTS.negotiation.blurb}</li>
      </ul>
      <p>The tiers stack: each one contains everything in the tiers below it.</p>

      <h2>How you get your report</h2>
      <p>
        <strong>We do not email reports.</strong> When your payment goes through, Stripe returns you to your report and
        it appears in your browser straight away, at a unique link that ends in the identifier for your payment. That
        link is your access to the report, so save or bookmark it before you close the tab.
      </p>
      <p>
        We store your finished report against that identifier, so returning to the link later shows you the same report
        rather than starting from scratch. Anyone holding the link can open the report, so treat it like a receipt you
        would not post in public. If you lose it, email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the address you paid with and we will get it back
        to you.
      </p>

      <h2>What a report is not</h2>
      <p>
        A {SITE_NAME} report values a car and describes it. It is <strong>not a vehicle history report</strong>. It
        contains no title history, no title brands, no salvage or flood records, no theft records and no accident or
        damage history, and {SITE_NAME} is not an approved NMVTIS data provider. If you need any of that, buy a report
        from an approved provider; our <a href="/disclaimer">data &amp; disclaimer</a> page says where.
      </p>
      <p>
        The valuation is a statistical estimate measured against what comparable vehicles are currently listed for near
        you. It is not an appraisal, not a mechanical inspection and not a guarantee of a vehicle&apos;s condition,
        safety or value. We compile it from data supplied by third parties and do not warrant that it is complete,
        accurate or current. Always pair a report with a test drive and, for anything expensive, an inspection by an
        independent mechanic.
      </p>

      <h2>Guidance is not professional advice</h2>
      <p>
        The {PRODUCTS.negotiation.name} gives you an opening offer, a target and a walk-away price, along with the
        arguments behind them. That is guidance derived from pricing data, and it is useful, but it is not legal,
        financial or tax advice, and it is not a promise about what any seller will accept. What you offer, what you
        pay and whether you buy the car are your decisions.
      </p>

      <h2>Payments and refunds</h2>
      <p>Payments are processed securely by Stripe. Our refund position is the same one we state everywhere else on the site:</p>
      <ul>
        <li>
          <strong>If we cannot value your car, we refund you.</strong> When there are no comparable vehicles listed
          near your ZIP code, we tell you plainly rather than showing you a made-up number, and you get your money
          back. Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we will process it. There are no
          conditions on this one.
        </li>
        <li>
          <strong>If a report fails to generate or is materially defective</strong>, the same applies. Contact support
          and we will fix it or refund it.
        </li>
        <li>
          <strong>Otherwise, a delivered report is a delivered report.</strong> Once we have produced your report and
          shown it to you, we have paid for the underlying data, so we do not refund it simply because you did not like
          what it said about the car.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        A report is licensed to you for your own use in buying or selling a vehicle. You may not resell, redistribute,
        republish, scrape or bulk-download reports or the data in them, and you may not use the service for any
        unlawful purpose.
      </p>

      <h2>Liability</h2>
      <p>
        To the fullest extent permitted by law, our total liability for any claim relating to a report is limited to
        the amount you paid for that report.
      </p>

      <h2>Contact</h2>
      <p>Questions? <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </Article>
  );
}
