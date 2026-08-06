'use client';
import { useState } from 'react';
import { CHECKOUT_ENABLED, PRODUCTS, type ProductId } from '@/lib/constants';

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
}: {
  vin: string;
  tier: ProductId | null;
  /** What an existing purchase was priced at, so an upgrade reuses it. */
  defaults?: { mileage?: number; zip?: string; asking?: number | null };
}) {
  const [mileage, setMileage] = useState(defaults?.mileage ? String(defaults.mileage) : '');
  const [zip, setZip] = useState(defaults?.zip ?? '');
  const [asking, setAsking] = useState(defaults?.asking ? String(defaults.asking) : '');
  const [product, setProduct] = useState<ProductId>('worthit');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already bought the top tier, nothing left to sell.
  if (tier === 'worthit') return null;

  const upgrade = tier === 'valuation';

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
          product: upgrade ? 'worthit' : product,
          mileage: miles,
          zip: zip.trim(),
          asking: askNum,
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
        {upgrade ? 'Add what it cost new' : 'What is this car actually worth?'}
      </h2>
      <p className="mt-2 text-sm text-ink-2 leading-relaxed">
        {upgrade
          ? 'Upgrade to see the original window sticker for this exact VIN: what it cost new, the factory options it was built with, and its full standard equipment.'
          : 'Priced against cars actually for sale near you, at this car’s real mileage. Tell us those two things and we’ll tell you what it’s worth, and whether the asking price is fair.'}
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
            Asking price <span className="font-normal text-ink-2">(optional, but it’s how you get a verdict)</span>
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

        {!upgrade && (
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Choose a report</legend>
            {(['valuation', 'worthit'] as ProductId[]).map((id) => {
              const p = PRODUCTS[id];
              const on = product === id;
              return (
                <label
                  key={id}
                  className={`cursor-pointer rounded-xl border-2 bg-white p-4 transition-colors ${on ? 'border-brand' : 'border-border'}`}
                >
                  <input
                    type="radio"
                    name="product"
                    value={id}
                    checked={on}
                    onChange={() => setProduct(id)}
                    className="sr-only"
                  />
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold">{p.name}</span>
                    <span className={`text-lg font-extrabold ${on ? 'text-brand' : 'text-ink'}`}>${p.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-2 leading-relaxed">{p.blurb}</p>
                </label>
              );
            })}
          </fieldset>
        )}

        {error && <p className="text-sm font-medium text-bad">{error}</p>}

        {CHECKOUT_ENABLED ? (
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500 disabled:opacity-60"
          >
            {loading
              ? 'Taking you to checkout…'
              : `Get the ${PRODUCTS[upgrade ? 'worthit' : product].name}, $${PRODUCTS[upgrade ? 'worthit' : product].price}`}
          </button>
        ) : (
          <div className="rounded-xl border border-border bg-white px-6 py-4 text-center text-sm font-semibold text-ink-2">
            Paid reports are launching shortly
          </div>
        )}

        <p className="text-center text-xs text-ink-2">
          One-off payment, no account and no subscription. We only look your car up after you pay.
        </p>
      </form>
    </section>
  );
}
