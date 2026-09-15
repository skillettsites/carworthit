import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import samples from '@/content/vin-tools/sample-decodes.json';
import type { SampleDecode } from '@/lib/vin-tools/makes';

export const metadata: Metadata = {
  title: 'Engine by VIN (Free): Size, Cylinders, HP',
  description:
    'Find the engine by VIN, free: NHTSA vPIC returns displacement, cylinders, engine model and horsepower when the manufacturer filed them. Blank means not filed. What 12 makes returned, and the 8th character explained.',
  alternates: { canonical: `${SITE_URL}/engine-by-vin` },
};

/*
 * Sources: vPIC DecodeVinValues fields EngineModel, DisplacementL,
 * EngineCylinders, EngineHP ("Engine Brake (hp) From", the lower value of the
 * range, variable 71), EngineConfiguration, FuelTypePrimary; variable list
 * fetched September 15, 2026. Sample decodes in
 * src/content/vin-tools/sample-decodes.json, same date. 49 CFR 565.15 Table
 * VIII: "engine type" is a required attribute of positions 4 to 8 for cars,
 * MPVs, trucks, buses and motorcycles.
 */

const S = samples as Record<string, SampleDecode>;
const ORDER = ['ford', 'toyota', 'honda', 'chevrolet', 'nissan', 'bmw', 'audi', 'jeep', 'subaru', 'hyundai', 'kia', 'harley-davidson'];
const NAMES: Record<string, string> = {
  ford: 'Ford',
  toyota: 'Toyota',
  honda: 'Honda',
  chevrolet: 'Chevrolet',
  nissan: 'Nissan',
  bmw: 'BMW',
  audi: 'Audi',
  jeep: 'Jeep',
  subaru: 'Subaru',
  hyundai: 'Hyundai',
  kia: 'Kia',
  'harley-davidson': 'Harley-Davidson',
};
const withDisp = ORDER.filter((k) => S[k].fields.DisplacementL);
const withCyl = ORDER.filter((k) => S[k].fields.EngineCylinders);
const withHP = ORDER.filter((k) => S[k].fields.EngineHP);
const withModel = ORDER.filter((k) => S[k].fields.EngineModel);

const faqs = [
  {
    q: 'Can you tell the engine size from the VIN?',
    a: `Usually. Engine type is one of the attributes 49 CFR 565.15 requires the VIN to make decipherable for cars, SUVs, trucks and motorcycles, so most manufacturers file it. For twelve makes decoded on September 15, 2026, ${withDisp.length} of 12 returned displacement, ${withCyl.length} returned the cylinder count, ${withHP.length} returned horsepower and ${withModel.length} returned an engine model code.`,
  },
  {
    q: 'Which character of the VIN is the engine code?',
    a: 'There is no fixed position. The regulation says positions 4 to 8 together must make the engine type decipherable "with information supplied by the manufacturer", and each maker lays those five characters out its own way. On many US-market cars the 8th character is the engine code, but that is convention, not rule, which is why the decoder reads the whole pattern rather than one character.',
  },
  {
    q: 'What does the horsepower figure mean?',
    a: 'vPIC\'s field is "Engine Brake (hp) From": brake horsepower at the engine output shaft, and where the manufacturer filed a range, the lower end of it. Treat it as the manufacturer\'s filed figure for the engine family, not a dyno result for this car.',
  },
  {
    q: 'Why is the engine blank for my VIN?',
    a: 'The manufacturer did not file that attribute for the pattern. In our sample the Nissan Kicks VIN returned displacement and fuel but no cylinder count, horsepower or engine model, and the Hyundai and Kia VINs returned displacement and an engine family name but no cylinders or horsepower. A blank is a blank filing; the decoder says so rather than guessing.',
  },
  {
    q: 'Does the decode show if the engine was replaced or modified?',
    a: 'No. It is the build record: the engine the vehicle left the factory with. A swap, a rebuild or a tune is not reported to NHTSA. The engine block casting and the emissions label under the hood are the physical checks; service records are the paper trail.',
  },
  {
    q: 'What about electric vehicles?',
    a: 'vPIC returns an electrification level (BEV, PHEV, strong hybrid) and, for some EVs, notes in "other engine info" (a Tesla Model S pattern we decoded returned "Dual Motor - Standard"). Displacement and cylinders are blank because there are none; that is correct, not a fault.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Engine by VIN"
      path="/engine-by-vin"
      crumbs={[
        { name: 'VIN decoder', path: '/vin-decoder' },
        { name: 'Engine by VIN', path: '/engine-by-vin' },
      ]}
      intro={
        <>
          <p>
            <strong>
              Enter a VIN and NHTSA returns the engine the manufacturer filed for it, free: displacement in liters, cylinders, engine
              model code, horsepower, configuration and fuel. A blank field means the manufacturer did not file that attribute, not
              that the engine is missing.
            </strong>{' '}
            Engine type is one of the attributes the VIN standard requires, so it is on file far more often than the transmission:
            for twelve makes decoded on September 15, 2026, {withDisp.length} returned displacement and {withHP.length} returned
            horsepower.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="engine" inputId="vin-engine" buttonLabel="Show the engine" placeholder={S.honda.vin} />}
      faqs={faqs}
      freeCan={[
        'Displacement (liters), cylinder count, engine model code, horsepower, configuration (in-line, V), fuel and turbo flag, where filed.',
        'Electrification level for hybrids and EVs, and manufacturer notes in "other engine info".',
        'The rest of the decode: year, make, model, trim, body, transmission, plant.',
        'EPA fuel economy for the year, make, model and engine, on the free CarWorthIt report.',
      ]}
      freeCannot={[
        'An engine the manufacturer did not file: a blank stays blank.',
        'Whether the engine was replaced, rebuilt or modified since the car was built.',
        'Torque, compression ratio or the exact engine option code on the window sticker (the build record has the option).',
        'The condition of the engine: that is an inspection, not a decode.',
      ]}
      sourceIds={['vpicApi', 'cfr565']}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">The engine as it was sold, and what the car is worth with it</h2>
          <p className="mt-2 text-ink-2">
            The CarWorthIt {PRODUCTS.worthit.name} (${PRODUCTS.worthit.price}) reproduces the manufacturer&apos;s build record for the
            exact VIN, including the engine and transmission as specified, the sticker price when new and the installed options,
            plus the local-market valuation at the car&apos;s mileage. The free report already shows recalls, safety ratings and EPA
            running costs for the engine.{' '}
            <Link href="/sample-report" className="text-brand underline">
              See a sample
            </Link>
            .
          </p>
        </div>
      }
      related={[
        { href: '/transmission-by-vin', label: 'Transmission by VIN' },
        { href: '/vin-decoder', label: 'Free VIN decoder' },
        { href: '/fuel-cost-calculator', label: 'Fuel cost calculator' },
        { href: '/window-sticker', label: 'Window sticker by VIN' },
      ]}
    >
      <h2>What came back for twelve makes</h2>
      <p>
        One VIN per make, decoded through NHTSA vPIC on September 15, 2026 (public-listing VINs for ten makes; pattern-valid test
        VINs for Subaru and Harley-Davidson).
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Make (sample)</th>
              <th className="py-2 pr-4 font-semibold">Displacement</th>
              <th className="py-2 pr-4 font-semibold">Cylinders</th>
              <th className="py-2 pr-4 font-semibold">HP</th>
              <th className="py-2 pr-4 font-semibold">Engine model</th>
              <th className="py-2 font-semibold">Fuel</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {ORDER.map((k) => {
              const f = S[k].fields;
              const nf = <span className="italic">not filed</span>;
              return (
                <tr key={k} className="border-b border-border">
                  <td className="py-1.5 pr-4 font-semibold text-ink">
                    {NAMES[k]} ({f.ModelYear} {f.Model})
                  </td>
                  <td className="py-1.5 pr-4">{f.DisplacementL ? `${f.DisplacementL} L` : nf}</td>
                  <td className="py-1.5 pr-4">{f.EngineCylinders || nf}</td>
                  <td className="py-1.5 pr-4">{f.EngineHP || nf}</td>
                  <td className="py-1.5 pr-4">{f.EngineModel || nf}</td>
                  <td className="py-1.5">{f.FuelTypePrimary || nf}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>How the engine gets into a VIN</h2>
      <p>
        49 CFR 565.15 says positions 4 to 8 of a passenger-car VIN must uniquely identify the line, series, body type, engine type and
        restraint system; for SUVs and trucks the list includes engine type and GVWR; for motorcycles it includes engine type and net
        brake horsepower, within 10 percent of the actual figure. The manufacturer decides which of the five characters carries
        which attribute and files the key with NHTSA. vPIC is that key, which is why the decode returns exactly what the maker filed
        and nothing more.
      </p>

      <h2>Reading the fields</h2>
      <ul>
        <li>
          <strong>Displacement.</strong> Liters, as filed. vPIC also converts to cubic centimeters and cubic inches; the tool shows
          liters to one decimal.
        </li>
        <li>
          <strong>Cylinders and configuration.</strong> Count and layout (in-line, V). The Ford sample returned 8 cylinders and 6.7 L;
          the Honda returned 4 and 2.0 L.
        </li>
        <li>
          <strong>Horsepower.</strong> &quot;Engine Brake (hp) From&quot;, the lower value where a range was filed.
        </li>
        <li>
          <strong>Engine model.</strong> The maker&apos;s engine family code (A25A-FKS on the Toyota sample, K20C2 on the Honda, U5 on the Subaru). Useful
          for parts and for reading a service history.
        </li>
        <li>
          <strong>Fuel and turbo.</strong> Primary fuel; a turbo flag where filed (a 2015 Grand Cherokee pattern we decoded returned &quot;No&quot; explicitly, and the Chevrolet sample spelled TURBO out in its engine model string).
        </li>
      </ul>
    </ToolPage>
  );
}
