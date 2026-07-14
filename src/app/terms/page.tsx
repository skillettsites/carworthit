import type { Metadata } from 'next';
import Article from '@/components/Article';
import { SITE_NAME, SUPPORT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = { title: 'Terms of Service', description: `Terms of Service for ${SITE_NAME}.` };

export default function Page() {
  return (
    <Article title="Terms of Service" subtitle="Last updated: 2026">
      <p>By using {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) you agree to these terms.</p>

      <h2>The service</h2>
      <p>
        We provide vehicle information reports compiled from third-party and public data sources. A free preview is
        available for any valid VIN; a full report is available for a one-time fee. Reports are delivered electronically
        immediately after payment.
      </p>

      <h2>No guarantee</h2>
      <p>
        Reports are for informational purposes only and are compiled from data supplied by third parties. We do not
        warrant that the information is complete, accurate, or current, and a report is not a substitute for an
        independent inspection. See our <a href="/disclaimer">data &amp; disclaimer</a> page.
      </p>

      <h2>Payments &amp; refunds</h2>
      <p>
        Payments are processed securely by Stripe. Because a report delivers data instantly on payment, sales are
        generally final. If a report fails to generate or is materially defective, contact{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we&apos;ll make it right.
      </p>

      <h2>Acceptable use</h2>
      <p>You may not resell, scrape, or bulk-download reports, or use the service for any unlawful purpose.</p>

      <h2>Liability</h2>
      <p>
        To the fullest extent permitted by law, our total liability for any claim relating to a report is limited to the
        amount you paid for that report.
      </p>

      <h2>Contact</h2>
      <p>Questions? <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </Article>
  );
}
