import Link from 'next/link';
import ToolPage, { type Faq } from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { PRODUCTS } from '@/lib/constants';
import type { VehicleTypeDef } from '@/lib/vin-tools/vehicle-types';
import type { SOURCES } from '@/lib/vin-tools/sources';
import type { ReactNode } from 'react';

/**
 * Shared renderer for the motorcycle, RV, trailer and ATV decoders. The
 * "what vPIC returned" table is generated from the recorded test decodes so
 * each page states, from evidence, which fields to expect and which come back
 * blank for that type.
 */
export default function VehicleTypePage({
  def,
  intro,
  faqs,
  freeCan,
  freeCannot,
  sourceIds,
  related,
  children,
  nextStep,
}: {
  def: VehicleTypeDef;
  intro: ReactNode;
  faqs: Faq[];
  freeCan: string[];
  freeCannot: string[];
  sourceIds: (keyof typeof SOURCES)[];
  related: { href: string; label: string }[];
  children: ReactNode;
  nextStep?: ReactNode;
}) {
  return (
    <ToolPage
      h1={def.h1}
      path={`/${def.slug}`}
      crumbs={[
        { name: 'VIN decoder', path: '/vin-decoder' },
        { name: def.title, path: `/${def.slug}` },
      ]}
      intro={intro}
      tool={
        <VinDecodeTool
          mode="type"
          expectedTypes={def.vpicTypes}
          expectedTypeLabel={def.shortName}
          inputId={`vin-${def.slug}`}
          placeholder={def.tests[0].vin}
          buttonLabel={`Decode this ${def.shortName} VIN`}
        />
      }
      faqs={faqs}
      freeCan={freeCan}
      freeCannot={freeCannot}
      sourceIds={sourceIds}
      related={related}
      nextStep={
        nextStep === undefined ? (
          <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
            <h2 className="text-xl font-bold">Where CarWorthIt stops, honestly</h2>
            <p className="mt-2 text-ink-2">
              The decode above is free for any 17-character VIN. CarWorthIt&apos;s paid valuation (from ${PRODUCTS.valuation.price}) is
              built on retail listings of cars and light trucks, so it is not the right tool for pricing a {def.shortName}; we would
              rather say that than sell you a number. For history (title brands, theft, liens) use the free and official sources on
              the <Link href="/title-check" className="text-brand underline">title check</Link> and{' '}
              <Link href="/stolen-vehicle-check" className="text-brand underline">stolen vehicle check</Link> pages.
            </p>
          </div>
        ) : (
          nextStep
        )
      }
    >
      {children}

      <h2>What NHTSA returned for {def.shortName} VINs we tested</h2>
      <p>
        These are pattern-valid test VINs (a real manufacturer WMI, a plausible descriptor and a correct check digit) decoded on
        September 15, 2026. vPIC decodes from the patterns each manufacturer files, so a real VIN with the same pattern returns the
        same fields. The point is what to expect: which fields a {def.shortName} decode fills in, and which come back blank.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Test VIN</th>
              <th className="py-2 pr-4 font-semibold">vPIC type</th>
              <th className="py-2 pr-4 font-semibold">Returned</th>
              <th className="py-2 font-semibold">Blank</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {def.tests.map((t) => (
              <tr key={t.vin} className="border-b border-border align-top">
                <td className="py-2 pr-4">
                  <span className="font-mono text-xs text-ink">{t.vin}</span>
                  <br />
                  <span className="text-xs">{t.description}</span>
                  <br />
                  <span className="text-xs">NHTSA: {t.errorText}</span>
                </td>
                <td className="py-2 pr-4">{t.vpicVehicleType}</td>
                <td className="py-2 pr-4">{t.returned.join('; ')}</td>
                <td className="py-2">{t.blank.join('; ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolPage>
  );
}
