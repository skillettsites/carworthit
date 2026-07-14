import type { Metadata } from 'next';
import SearchBox from '@/components/SearchBox';
import { PRODUCTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Free preview for any car. Valuation $4.99, full history report $9.99, or both in a bundle for $12.99. No subscription.',
};

const tiers = [
  {
    name: 'Free preview',
    price: '$0',
    highlight: false,
    features: ['Vehicle specs', 'Open safety recalls', 'NHTSA 5-star safety ratings', 'Running costs (MPG & fuel/yr)', '5-year cost-to-own estimate'],
  },
  {
    name: PRODUCTS.valuation.name,
    price: `$${PRODUCTS.valuation.price}`,
    highlight: false,
    features: ['Fair market value + range', 'Trade-in, private & retail values', 'Insurance cost by age', 'Depreciation outlook'],
  },
  {
    name: PRODUCTS.history.name,
    price: `$${PRODUCTS.history.price}`,
    highlight: false,
    badge: 'Popular',
    features: ['Full title & salvage history', 'Salvage, junk & flood brands', 'Theft & total-loss checks', 'Salvage-auction damage records', 'Every odometer reading', 'Ownership timeline'],
  },
  {
    name: PRODUCTS.bundle.name,
    price: `$${PRODUCTS.bundle.price}`,
    strike: `$${PRODUCTS.bundle.strike}`,
    highlight: true,
    badge: 'Best value',
    features: ['Everything in History', 'Everything in Valuation', 'One report, one payment', 'Save $2 vs buying separately'],
  },
];

export default function Pricing() {
  return (
    <div className="container-x py-14">
      <h1 className="text-4xl font-extrabold text-center">Simple pricing</h1>
      <p className="mt-3 text-center text-ink-2 text-lg">Free preview for any car. Pay once, no subscription, no account.</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border p-7 ${t.highlight ? 'border-2 border-brand bg-white ring-2 ring-brand/20 shadow-lg' : 'border-border bg-white'}`}
          >
            {t.badge && (
              <span className={`absolute -top-3 left-6 rounded-full px-3 py-0.5 text-xs font-bold ${t.highlight ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900' : 'bg-slate-700 text-white'}`}>
                {t.badge}
              </span>
            )}
            <div className={`font-semibold ${t.highlight ? 'text-brand' : 'text-ink'}`}>{t.name}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${t.highlight ? 'text-brand' : 'text-ink'}`}>{t.price}</span>
              {t.strike && <span className="text-ink-2 line-through text-sm">{t.strike}</span>}
            </div>
            <ul className="mt-5 space-y-2 text-sm text-ink-2">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-good font-bold">✓</span>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-ink-2">Compare: Carfax charges $44.99 and AutoCheck $24.99 for a single history report.</p>

      <div className="mt-12 max-w-2xl mx-auto">
        <SearchBox />
      </div>
    </div>
  );
}
