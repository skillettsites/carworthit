import type { Metadata } from 'next';
import SearchBox from '@/components/SearchBox';
import { PRODUCTS, SITE_URL, SITE_NAME, upgradePriceCents } from '@/lib/constants';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `Pricing, car value reports from $${PRODUCTS.valuation.price}`,
  description:
    `Free VIN report for any US car. Valuation $${PRODUCTS.valuation.price}, Full Report $${PRODUCTS.worthit.price}, Negotiation Bundle $${PRODUCTS.negotiation.price}. One-off payment, no subscription and no account.`,
  alternates: { canonical: `${SITE_URL}/pricing` },
};

const tiers = [
  {
    name: 'Free VIN report',
    price: '$0',
    highlight: false,
    blurb: 'Everything we can tell you for nothing, for any valid VIN.',
    features: [
      'Full vehicle specification',
      'Open safety recalls (NHTSA)',
      'NHTSA 5-star crash-test ratings',
      'EPA fuel economy and annual fuel cost',
      'Estimated 5-year running costs',
      'No signup, no card',
    ],
  },
  {
    name: PRODUCTS.valuation.name,
    price: `$${PRODUCTS.valuation.price}`,
    highlight: false,
    blurb: PRODUCTS.valuation.blurb,
    features: [
      'What it’s worth near your ZIP code',
      'Priced at your car’s real mileage',
      'The local price range, low to high',
      'A verdict on the seller’s asking price',
      'Everything in the free report',
    ],
  },
  {
    name: PRODUCTS.worthit.name,
    price: `$${PRODUCTS.worthit.price}`,
    highlight: false,
    blurb: PRODUCTS.worthit.blurb,
    features: [
      'Everything in the Valuation',
      'What it cost new, for this exact VIN',
      'The factory options it was built with',
      'Dealer invoice price when new',
      'Total depreciation since new',
      'Full standard equipment list',
      'Original factory warranty terms',
    ],
  },
  {
    name: PRODUCTS.negotiation.name,
    price: `$${PRODUCTS.negotiation.price}`,
    highlight: true,
    badge: 'Most useful',
    blurb: PRODUCTS.negotiation.blurb,
    features: [
      'Everything in the Full Report',
      'Your opening offer, target and walk-away price',
      'Your case for paying less, every claim sourced',
      'What the seller will argue, and the counter',
      'The conversation, in the order to have it',
      'The checks to make before any money moves',
    ],
  },
];

const faqs = [
  {
    q: 'How much does a car valuation cost?',
    a: `A CarWorthIt Valuation is $${PRODUCTS.valuation.price}, a Full Report is $${PRODUCTS.worthit.price} and the Negotiation Bundle is $${PRODUCTS.negotiation.price}. All are one-off payments with no subscription and no account. The VIN report, covering specs, open recalls, safety ratings and running costs, is free for any valid VIN.`,
  },
  {
    q: 'What is the Negotiation Bundle?',
    a: `It is the top tier, at $${PRODUCTS.negotiation.price}, and it contains both other reports. On top of them it gives you three prices for the car in front of you: where to open, what to aim to pay, and the point above which you should walk away. Each is derived from what comparable cars are listed at near you, so you can say it out loud and defend it. It also sets out your case for paying less with every claim sourced, what the seller is likely to argue back, the order to say things in, and the checks to make before any money changes hands.`,
  },
  {
    q: 'Why do you need my mileage and ZIP code?',
    a: 'Because a car’s value depends on both. We price your car against comparable cars actually for sale near you, at your car’s real mileage, rather than giving a national average for the year and model. That is the whole point of the product, and it is why we ask before you pay rather than after.',
  },
  {
    q: 'Is there a subscription?',
    a: 'No. You pay once for one report. There is no account to create, no recurring charge and nothing to cancel.',
  },
  {
    q: 'What if I buy one report and then want a higher one?',
    a: `You pay only the difference. The tiers stack, so upgrading from the Valuation to the Negotiation Bundle costs $${(upgradePriceCents('negotiation', 'valuation') / 100).toFixed(2)}, not $${PRODUCTS.negotiation.price} again. Open your report from the link you were given after paying and the upgrade will be priced with the credit already applied.`,
  },
  {
    q: 'What is the difference between the paid reports?',
    a: 'They stack. The Valuation tells you what the car is worth now and whether the asking price is fair. The Full Report adds the original factory record for that exact VIN: what it cost new, the options it was built with, the dealer invoice price, how much it has depreciated, and its full standard equipment. The Negotiation Bundle adds everything you need to act on it: what to offer, what to settle at, when to walk, and the words to use.',
  },
  {
    q: 'What if you can’t value my car?',
    a: 'If we cannot find comparable cars near you, we tell you plainly and refund you. We would rather do that than show you a made-up number.',
  },
];

export default function Pricing() {
  return (
    <div className="container-x py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqSchema(faqs),
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'Pricing', url: `${SITE_URL}/pricing` },
            ]),
          ]),
        }}
      />

      <h1 className="text-4xl font-extrabold text-center">Simple pricing</h1>
      <p className="mt-3 text-center text-ink-2 text-lg max-w-2xl mx-auto">
        The VIN report is free for any car. Pay once for a valuation, no subscription and no account.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border p-7 ${t.highlight ? 'border-2 border-brand bg-white ring-2 ring-brand/20 shadow-lg' : 'border-border bg-white'}`}
          >
            {t.badge && (
              <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-3 py-0.5 text-xs font-bold text-amber-900">
                {t.badge}
              </span>
            )}
            <div className={`font-semibold ${t.highlight ? 'text-brand' : 'text-ink'}`}>{t.name}</div>
            <div className="mt-2 text-3xl font-extrabold">{t.price}</div>
            <p className="mt-2 text-sm text-ink-2 leading-relaxed">{t.blurb}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink-2">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-good font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-2 max-w-2xl mx-auto">
        We don&apos;t quote our competitors&apos; prices because they change them without notice. Carfax is the
        priciest of the mainstream single-report options and AutoCheck sits below it; check their sites for what they
        charge today.
      </p>

      <div className="mt-12 max-w-xl mx-auto">
        <h2 className="text-center text-lg font-bold mb-4">Check a car now</h2>
        <SearchBox />
      </div>

      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="mt-5 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1 text-ink-2 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
