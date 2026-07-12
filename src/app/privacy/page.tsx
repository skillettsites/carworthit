import type { Metadata } from 'next';
import Article from '@/components/Article';
import { SITE_NAME, SUPPORT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = { title: 'Privacy Policy', description: `Privacy Policy for ${SITE_NAME}.` };

export default function Page() {
  return (
    <Article title="Privacy Policy" subtitle="Last updated: 2026">
      <p>{SITE_NAME} respects your privacy. This policy explains what we collect and why.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>VINs you search</strong>, to generate your report.</li>
        <li><strong>Payment details</strong>, handled entirely by Stripe; we never see or store your card number.</li>
        <li><strong>Basic analytics</strong>, pages visited and general usage, to improve the service.</li>
      </ul>

      <h2>What we don&apos;t do</h2>
      <p>We don&apos;t sell your personal information. We don&apos;t require an account, and we don&apos;t build advertising profiles from your searches.</p>

      <h2>Third parties</h2>
      <p>
        We use Stripe for payments and vehicle-data providers (including NMVTIS-approved sources, NHTSA and the EPA) to
        compile reports. Each processes data under its own terms.
      </p>

      <h2>Cookies</h2>
      <p>We use only essential cookies needed to run the site and complete a purchase.</p>

      <h2>Your rights</h2>
      <p>To access or delete any personal data we hold, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </Article>
  );
}
