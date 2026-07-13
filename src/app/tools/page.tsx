import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import { breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Free Car Cost Calculators & Tools',
  description: 'Free tools to estimate what a car really costs: fuel cost calculator and car depreciation calculator. Plus a free VIN check for any US used car.',
  alternates: { canonical: `${SITE_URL}/tools` },
};

const tools = [
  {
    href: '/fuel-cost-calculator',
    title: 'Fuel Cost Calculator',
    desc: 'See what any car costs to fuel per month, per year and over five years from your miles, MPG and gas price.',
    icon: '⛽',
  },
  {
    href: '/depreciation-calculator',
    title: 'Depreciation Calculator',
    desc: 'Project what a car will be worth in 1 to 15 years and how much value it loses each year.',
    icon: '📉',
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Calculators', url: `${SITE_URL}/tools` },
          ]),
        ]}
      />
      <div className="container-x max-w-4xl py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Car Cost Calculators</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed max-w-2xl">
          Free tools to work out what a car really costs before you buy. Estimate fuel and depreciation, then run the
          exact vehicle&apos;s VIN for its real figures.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:border-brand hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="text-3xl">{t.icon}</div>
              <h2 className="mt-3 text-xl font-bold text-ink group-hover:text-brand">{t.title}</h2>
              <p className="mt-2 text-sm text-ink-2 leading-relaxed">{t.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand">Open calculator →</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold">Check a specific car</h2>
          <p className="mt-2 text-ink-2">Run a VIN free for real EPA running costs, safety ratings, recalls and a 5-year cost to own.</p>
          <div className="mt-5 max-w-xl mx-auto"><SearchBox /></div>
        </div>
      </div>
    </>
  );
}
