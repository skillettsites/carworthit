import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import { breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Free Car Calculators and VIN Tools',
  description: 'Free car tools: VIN decoder by make, title, lien, odometer and stolen vehicle checks, window sticker lookup, engine and transmission by VIN, diminished value, fuel cost and depreciation calculators.',
  alternates: { canonical: `${SITE_URL}/tools` },
};

const tools = [
  {
    href: '/vin-decoder',
    title: 'Free VIN Decoder',
    desc: 'Decode any 17-character VIN to its year, make, model, trim, engine and drivetrain. No account.',
    icon: '🔍',
  },
  {
    href: '/diminished-value-calculator',
    title: 'Diminished Value Calculator',
    desc: 'What an insurer will offer for the value your car lost in an accident, using the 17c formula they apply.',
    icon: '📉',
  },
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

// VIN checks and decoders added September 15, 2026. All free, all NHTSA
// data; none of them sells or shows vehicle history, and each says so.
const vinTools = [
  { href: '/title-check', title: 'Title Check', desc: 'Free sources for title status (NICB VINCheck, NMVTIS providers) and a table of title brands.', icon: '📄' },
  { href: '/lien-check', title: 'Lien Check', desc: 'How to find out if money is still owed on a car: the title, the lender, and the state lookups we verified.', icon: '🏦' },
  { href: '/odometer-check', title: 'Odometer Rollback Check', desc: 'The federal odometer statement rule, which vehicles are exempt, and how to read mileage history.', icon: '🧮' },
  { href: '/stolen-vehicle-check', title: 'Stolen Vehicle Check', desc: 'NICB VINCheck explained: five free searches a day, what it covers, what to do if a VIN hits.', icon: '🚨' },
  { href: '/window-sticker', title: 'Window Sticker by VIN', desc: 'Ford, Jeep, Ram, Dodge and Chrysler publish original stickers by VIN; tested with real VINs.', icon: '🏷️' },
  { href: '/check-warranty-by-vin', title: 'Warranty by VIN', desc: 'What the free decode shows, what the report adds, and the manufacturer owner portals.', icon: '🛡️' },
  { href: '/transmission-by-vin', title: 'Transmission by VIN', desc: 'Transmission style and speeds as filed with NHTSA; a blank means the maker did not file it.', icon: '⚙️' },
  { href: '/engine-by-vin', title: 'Engine by VIN', desc: 'Displacement, cylinders, engine model and horsepower as filed with NHTSA.', icon: '🔧' },
  { href: '/vin-year-chart', title: 'VIN Year Chart', desc: 'The 10th-character model year codes 1980 to 2030 and the 7th-character rule.', icon: '📅' },
  { href: '/paint-code-by-vin', title: 'Paint Code by VIN', desc: 'The VIN does not encode paint. Where the paint code label is on 15 makes.', icon: '🎨' },
  { href: '/classic-car-vin-decoder', title: 'Classic Car VIN Decoder', desc: 'Why pre-1981 serial numbers do not decode, and what to do instead.', icon: '🚗' },
  { href: '/motorcycle-vin-check', title: 'Motorcycle VIN Check', desc: 'Make, model, series, engine and horsepower for any 17-character bike VIN.', icon: '🏍️' },
  { href: '/rv-vin-lookup', title: 'RV VIN Lookup', desc: 'A motorhome VIN decodes to its chassis, not its coach. What you get.', icon: '🚐' },
  { href: '/trailer-vin-lookup', title: 'Trailer VIN Lookup', desc: 'Builder, body type, length and axles for travel trailers and campers.', icon: '🛻' },
  { href: '/atv-vin-lookup', title: 'ATV VIN Lookup', desc: 'What NHTSA returns for Polaris, Can-Am and Yamaha VINs, and why it is thin.', icon: '🏁' },
];

const makeDecoders = ['ford', 'toyota', 'honda', 'chevrolet', 'nissan', 'bmw', 'audi', 'jeep', 'subaru', 'hyundai', 'kia', 'harley-davidson'];

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

        <h2 className="mt-14 text-2xl font-extrabold">VIN checks and decoders</h2>
        <p className="mt-2 max-w-2xl text-ink-2">
          Free, built on NHTSA data, and honest about the limits: none of these shows accident, title or theft history, and each one
          says where the free official sources are.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {vinTools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:border-brand hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="text-2xl">{t.icon}</div>
              <h3 className="mt-2 text-lg font-bold text-ink group-hover:text-brand">{t.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{t.desc}</p>
            </Link>
          ))}
        </div>
        <h3 className="mt-8 text-lg font-bold">VIN decoder by make</h3>
        <p className="mt-1 text-sm text-ink-2">Each page lists the make&apos;s WMI codes as NHTSA vPIC returns them, where the VIN is, and a sample decode.</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {makeDecoders.map((m) => (
            <li key={m}>
              <Link
                href={`/vin-decoder/${m}`}
                className="inline-block rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                {m === 'bmw' ? 'BMW' : m === 'harley-davidson' ? 'Harley-Davidson' : m.charAt(0).toUpperCase() + m.slice(1)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold">Check a specific car</h2>
          <p className="mt-2 text-ink-2">Run a VIN free for real EPA running costs, safety ratings, recalls and a 5-year cost to own.</p>
          <div className="mt-5 max-w-xl mx-auto"><SearchBox /></div>
        </div>
      </div>
    </>
  );
}
