'use client';
import { useState } from 'react';
import {
  CHECKOUT_ENABLED,
  PRODUCTS,
  TIER_ORDER,
  tierRank,
  upgradePriceCents,
  type ProductId,
} from '@/lib/constants';

// Collects the three things a real valuation needs, then sends the buyer to
// Stripe. Mileage and ZIP are mandatory because the pricing feed takes both:
// that is precisely why it beats a year/make/model guess, and why the previous
// provider priced a 2006 Corvette 40% low.
//
// Nothing is looked up until payment succeeds. At 20p to 32p a report, firing
// the API on an unqualified visit is the one way this product loses money.

const US_STATES_ZIP = /^\d{5}$/;

export default function ValuationUnlock({
  vin,
  tier,
  defaults,
  paidToken,
}: {
  vin: string;
  tier: ProductId | null;
  /** What an existing purchase was priced at, so an upgrade reuses it. */
  defaults?: { mileage?: number; zip?: string; asking?: number | null };
  /**
   * The Stripe session id proving the current tier was paid for. Sent so the
   * server can credit it against an upgrade. It is a claim, not proof: the
   * checkout route re-verifies it against Stripe before allowing any credit.
   */
  paidToken?: string | null;
}) {
  // Only tiers above whatever they already hold are on offer. Listing a tier
  // someone has already paid for is how you sell the same report twice.
  const offered = TIER_ORDER.filter((t) => (tier === null ? true : tierRank(t) > tierRank(tier)));
  // The Negotiation Bundle is the flagship and contains both other tiers, so it
  // is the default selection rather than the middle one.
  const topOffered = offered[offered.length - 1] ?? 'negotiation';

  const [mileage, setMileage] = useState(defaults?.mileage ? String(defaults.mileage) : '');
  const [zip, setZip] = useState(defaults?.zip ?? '');
  const [asking, setAsking] = useState(defaults?.asking ? String(defaults.asking) : '');
  const [product, setProduct] = useState<ProductId>(topOffered);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already on the top tier, nothing left to sell.
  if (offered.length === 0) return null;

  const upgrade = tier !== null;
  // A single remaining tier needs no chooser: the button already names it.
  const chooser = offered.length > 1;
  const selected: ProductId = offered.includes(product) ? product : topOffered;

  // On an upgrade the buyer pays only the difference, so quote the difference.
  //
  // Uses the SAME function the checkout API uses, so the price shown here and
  // the price Stripe charges cannot drift apart. Gated on paidToken because
  // that is what the server requires before it will credit anything: quoting a
  // discount we cannot honour at checkout is the worst possible surprise.
  const creditFrom: ProductId | null = upgrade && paidToken ? tier : null;
  const centsOf = (id: ProductId) => upgradePriceCents(id, creditFrom);
  const priceOf = (id: ProductId) => centsOf(id) / 100;
  const money = (n: number) => `$${n.toFixed(2)}`;
  const creditCents = creditFrom ? PRODUCTS[selected].cents - centsOf(selected) : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const miles = Number(mileage.replace(/[^0-9]/g, ''));
    if (!Number.isFinite(miles) || miles <= 0 || miles > 999999) {
      setError('Enter the mileage on the odometer, in miles.');
      return;
    }
    if (!US_STATES_ZIP.test(zip.trim())) {
      setError('Enter a 5-digit US ZIP code. Values are local, so this matters.');
      return;
    }
    const askNum = asking ? Number(asking.replace(/[^0-9.]/g, '')) : null;
    if (asking && (!Number.isFinite(askNum) || (askNum as number) <= 0)) {
      setError('Asking price should be a number, or leave it blank.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin,
          product: selected,
          mileage: miles,
          zip: zip.trim(),
          asking: askNum,
          upgradeFrom: upgrade && paidToken ? paidToken : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const field =
    'w-full rounded-xl border border-border bg-white px-4 py-3 text-ink outline-none focus:border-brand';

  return (
    <section className="rounded-2xl border-2 border-brand/40 bg-brand/5 p-6 md:p-8" id="valuation">
      <h2 className="text-xl font-bold">
        {upgrade ? 'Get the rest of the picture' : 'What is this car actually worth?'}
      </h2>
      <p className="mt-2 text-sm text-ink-2 leading-relaxed">
        {upgrade
          ? 'Upgrade to add what it cost new, the factory options it was built with, and the Negotiation Bundle: your opening offer, your walk-away price and the evidence to argue for them.'
          : 'Priced for this VIN at its real mileage, in your local market. Tell us the mileage and your ZIP and we’ll tell you what it’s worth, whether the asking price is fair, and what to pay.'}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {/* One set of fields for both paths. On an upgrade these arrive
            pre-filled from the purchase being upgraded, so the buyer gets a
            valuation on the same basis they already paid for rather than
            retyping it and silently getting a different answer. */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mileage" className="mb-1 block text-sm font-medium">
              Mileage on the odometer
            </label>
            <input
              id="mileage"
              inputMode="numeric"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="e.g. 50000"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="zip" className="mb-1 block text-sm font-medium">
              Your ZIP code
            </label>
            <input
              id="zip"
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 10312"
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="asking" className="block text-sm font-medium mb-1">
            Asking price{' '}
            <span className="font-normal text-ink-2">
              {tierRank(selected) >= tierRank('negotiation')
                ? '(optional, but it sharpens the verdict and your negotiation case)'
                : '(optional, but it’s how you get a verdict)'}
            </span>
          </label>
          <input
            id="asking"
            inputMode="decimal"
            value={asking}
            onChange={(e) => setAsking(e.target.value)}
            placeholder="e.g. 18500"
            className={field}
          />
        </div>

        {chooser && (
          <fieldset className={`grid gap-3 ${offered.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            <legend className="sr-only">Choose a report</legend>
            {offered.map((id) => {
              const p = PRODUCTS[id];
              const on = selected === id;
              const best = id === 'negotiation';
              // focus-within surfaces the keyboard focus ring from the sr-only
              // radio onto the visible card, and the ✓ means the selected tier
              // is not signalled by border colour alone.
              return (
                <label
                  key={id}
                  className={`relative cursor-pointer rounded-xl border-2 bg-white p-4 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand ${on ? 'border-brand ring-1 ring-brand' : 'border-border'}`}
                >
                  {best && (
                    <span className="absolute -top-2 right-3 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Most useful
                    </span>
                  )}
                  <input
                    type="radio"
                    name="product"
                    value={id}
                    checked={on}
                    onChange={() => setProduct(id)}
                    className="sr-only"
                  />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold">
                      {on && <span aria-hidden="true" className="mr-1 text-brand">✓</span>}
                      {p.name}
                    </span>
                    <span className={`text-lg font-extrabold ${on ? 'text-brand' : 'text-ink'}`}>
                      {centsOf(id) < p.cents && (
                        <span className="mr-1 text-sm font-semibold text-ink-2 line-through">${p.price}</span>
                      )}
                      {money(priceOf(id))}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-2 leading-relaxed">{p.blurb}</p>
                </label>
              );
            })}
          </fieldset>
        )}

        {/* role="alert" so a screen reader is told the form rejected the input.
            Without it the error appears silently and the user just sees the
            button do nothing. */}
        <p role="alert" aria-live="polite" className="text-sm font-medium text-bad empty:hidden">
          {error}
        </p>

        {CHECKOUT_ENABLED ? (
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500 disabled:opacity-60"
          >
            {loading
              ? 'Taking you to checkout…'
              : `Get the ${PRODUCTS[selected].name}, ${money(priceOf(selected))}`}
          </button>
        ) : (
          <div className="rounded-xl border border-border bg-white px-6 py-4 text-center text-sm font-semibold text-ink-2">
            Paid reports are launching shortly
          </div>
        )}

        <p className="text-center text-xs text-ink-2">
          {creditCents > 0
            ? `The $${(creditCents / 100).toFixed(2)} you already paid is credited, so you only pay the difference. No account and no subscription.`
            : 'One-off payment, no account and no subscription. We only look your car up after you pay.'}
        </p>
      </form>
    </section>
  );
}
