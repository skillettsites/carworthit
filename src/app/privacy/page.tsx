import type { Metadata } from 'next';
import Article from '@/components/Article';
import { SITE_NAME, SUPPORT_EMAIL, SITE_URL, GA_ID } from '@/lib/constants';

export const metadata: Metadata = { title: 'Privacy Policy', description: `Privacy Policy for ${SITE_NAME}.`, alternates: { canonical: `${SITE_URL}/privacy` } };

export default function Page() {
  return (
    <Article title="Privacy Policy" subtitle="Last updated: August 6, 2026">
      <p>
        This policy describes what {SITE_NAME} actually does, not what a template says a website does. It covers what
        you type in, what we record, what we set cookies for and who else sees any of it.
      </p>

      <h2>What you type in</h2>
      <ul>
        <li>
          <strong>The VIN.</strong> We send it to NHTSA to decode the vehicle, and we use the decoded year, make and
          model to look up open recalls, crash-test ratings and EPA fuel economy.
        </li>
        <li>
          <strong>Mileage, ZIP code and, if you enter one, the seller&apos;s asking price.</strong> These are only
          needed for a paid report. They go to our vehicle-data provider to price the car, and they are carried
          through Stripe checkout so we can rebuild your report when you come back from paying.
        </li>
      </ul>
      <p>
        There is no account, no signup and no password. We never ask for your name, your address or your phone number.
      </p>

      <h2>What we record when you run a lookup</h2>
      <p>Every VIN lookup, free or paid, writes one row to our database. That row holds:</p>
      <ul>
        <li>
          <strong>A salted hash of the VIN, not the VIN itself.</strong> We take a SHA-256 hash of the VIN combined
          with a secret salt that only our server holds. It is one-way, so the row cannot be turned back into a VIN,
          and the salt is what stops anyone testing candidate VINs against it. If that salt is not configured we log
          nothing at all rather than log a weak hash.
        </li>
        <li>The decoded vehicle: year, make, model, trim, body type and fuel type.</li>
        <li>
          The country and state our host derives from your IP address. This is coarse, region level at best. We do not
          store your IP address and we do not store a precise location.
        </li>
        <li>The mileage, when you have given us one.</li>
        <li>The page that referred you and the <code>utm_source</code> on the link, so we know which channels work.</li>
        <li>Whether the request looked like a bot or a crawler.</li>
      </ul>
      <p>
        We use this <strong>in aggregate</strong>: which models get searched most, in which states, and how that moves
        over time. Aggregate figures from it may appear in our data studies and buying guides. There is no name, no
        account and no email address attached to any of these rows, and we do not publish individual lookups.
      </p>

      <h2>If you buy a report</h2>
      <ul>
        <li>
          <strong>Card details go to Stripe and never to us.</strong> Payment happens on Stripe&apos;s own hosted
          checkout page. We never see, handle or store a card number.
        </li>
        <li>
          <strong>Stripe collects your email address at checkout, and we store it.</strong> It is saved alongside the
          Stripe session id, the product you bought, the amount, the hashed VIN and your state. We use it to identify
          you if you contact support, to process a refund, and to reconcile payments against our own records. We do not
          add it to a mailing list and we do not send you marketing.
        </li>
        <li>
          <strong>We store your finished report.</strong> It is saved against your Stripe session id so that revisiting
          your link serves the same report instead of re-querying the paid data services. That stored copy does include
          the full VIN, because it is your report. It can only be read back by someone who already holds the session id
          from your URL, which is unguessable, and the table cannot be listed or browsed.
        </li>
      </ul>

      <h2>Cookies and analytics</h2>
      <p>
        We do not use only essential cookies, and we are not going to claim otherwise. We run{' '}
        <strong>Google Analytics 4</strong> (measurement ID <code>{GA_ID}</code>) on every page. It sets its own
        cookies, typically <code>_ga</code> and <code>_ga_*</code>, to count visits and tell a returning visitor from a
        new one. Stripe also sets cookies on its checkout pages, which it uses for fraud prevention and to hold your
        session together.
      </p>
      <p>
        One thing worth knowing about our analytics setup: we deliberately strip the query string before reporting a
        page to Google. Your paid report URL contains the Stripe session id that unlocks it, and that token has no
        business sitting in an analytics property where it could be read or replayed.
      </p>
      <p>
        We run no advertising cookies, no retargeting pixels and no ad networks. You can block or delete cookies in
        your browser, or use Google&apos;s official opt-out browser add-on, and the site still works normally.
      </p>

      <h2>Who else handles your data</h2>
      <ul>
        <li><strong>Stripe</strong>, for payments, checkout and the email address collected there.</li>
        <li><strong>Google Analytics 4</strong>, for the site analytics and cookies described above.</li>
        <li>
          <strong>Vercel</strong>, which hosts and serves the site, keeps standard server logs, and supplies the coarse
          country and state signal we record.
        </li>
        <li>
          <strong>Supabase</strong>, the database that holds the lookup rows, the purchase records and the stored
          reports described above.
        </li>
        <li>
          <strong>A licensed US vehicle-data provider</strong>, which receives the VIN, ZIP code and mileage for a paid
          report and returns the market pricing and the factory build record. Its responses are cached for 24 hours so
          a refresh does not re-query it. We will name the provider if you ask us at the address below.
        </li>
        <li>
          <strong>NHTSA</strong>, a US government service, which receives the VIN to decode the vehicle, and the year,
          make and model to return recalls and crash-test ratings.
        </li>
        <li>
          <strong>EPA fueleconomy.gov</strong>, a US government service, queried by year, make and model. It never
          receives your VIN.
        </li>
      </ul>
      <p>Each of these processes data under its own terms.</p>

      <h2>What we don&apos;t do</h2>
      <p>
        We don&apos;t sell your personal information. We don&apos;t require an account, we don&apos;t build advertising
        profiles from your searches, and we don&apos;t hand your email address to anyone to market to you.
      </p>

      <h2>Your rights</h2>
      <p>
        To ask what we hold about you, or to have it deleted, email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. For a purchase, include the email address you paid
        with or your Stripe receipt so we can find it. For a free lookup, give us the VIN: we can hash it the same way
        and find the matching row, which is the only way that row can ever be traced back to a vehicle.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about any of this, including anything here you think is wrong or incomplete, go to{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </Article>
  );
}
