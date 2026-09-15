import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import WmiTable from '@/components/tools/WmiTable';
import YearCodeTable from '@/components/tools/YearCodeTable';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { MAKES, makeBySlug, wmiTableFor, sampleFor, VPIC_FIELD_LABELS } from '@/lib/vin-tools/makes';
import { SOURCES } from '@/lib/vin-tools/sources';

/*
 * One decoder page per make. Nothing here is typed by hand beyond the
 * make-specific context in src/lib/vin-tools/makes.ts, which is limited to
 * what the vPIC data supports. The WMI table, the sample decode and the
 * year-code table are all generated from data fetched September 15, 2026.
 */

export function generateStaticParams() {
  return MAKES.map((m) => ({ make: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make } = await params;
  const m = makeBySlug(make);
  if (!m) return {};
  return {
    title: `${m.name} VIN Decoder (Free): Decode Any ${m.name} VIN`,
    description: `Free ${m.name} VIN decoder using NHTSA data: year, model, trim, engine, plant and every ${m.name} WMI code vPIC lists. Where the VIN is on a ${m.name}, the model-year chart, and what a decode cannot show.`,
    alternates: { canonical: `${SITE_URL}/vin-decoder/${m.slug}` },
  };
}

const fmtDate = (iso: string) => {
  const [y, mo, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[mo - 1]} ${d}, ${y}`;
};

export default async function Page({ params }: { params: Promise<{ make: string }> }) {
  const { make } = await params;
  const m = makeBySlug(make);
  const table = wmiTableFor(make);
  const sample = sampleFor(make);
  if (!m || !table || !sample) notFound();

  const wmis = table.wmis;
  const countries = Array.from(new Set(wmis.map((w) => w.country).filter(Boolean)));
  const usWmis = wmis.filter((w) => w.country === 'United States').map((w) => w.wmi);
  const shared = wmis.filter((w) => w.sharedWith.length > 0);
  const blankLabels = sample.blank.map((k) => VPIC_FIELD_LABELS[k] || k);
  const returnedKeys = Object.keys(sample.fields).filter((k) => k !== 'ErrorCode');
  const isBike = m.kind === 'motorcycle';

  const faqs = [
    {
      q: `Where is the VIN on a ${m.name}?`,
      a: m.vinLocation.text,
    },
    {
      q: `What do the first three characters of a ${m.name} VIN mean?`,
      a: `They are the World Manufacturer Identifier. NHTSA vPIC lists ${wmis.length} WMIs that decode to ${m.name}${
        countries.length ? `, registered in these countries: ${countries.join(', ')}` : ''
      }. ${usWmis.length ? `The US-registered ${usWmis.length === 1 ? 'one is' : 'ones are'} ${usWmis.join(', ')}.` : ''} The full table is on this page and comes straight from vPIC.`,
    },
    {
      q: `Can a ${m.name} VIN start with a WMI that also belongs to another brand?`,
      a: shared.length
        ? `Yes. vPIC lists ${shared.length} of ${m.name}'s ${wmis.length} WMIs as shared with another make (for example ${shared
            .slice(0, 3)
            .map((w) => `${w.wmi} with ${w.sharedWith.join(' and ')}`)
            .join('; ')}). That is why the decoder reads positions 4 to 8 and the model year rather than trusting the first three characters alone.`
        : `Not according to vPIC: every ${m.name} WMI in the table decodes to ${m.name} only. The decoder still reads the whole VIN, because positions 4 to 8 carry the model, body and engine.`,
    },
    {
      q: `What does the free ${m.name} VIN decode show?`,
      a: `Whatever ${m.name} filed with NHTSA for that VIN pattern. For ${m.sampleDescription}, vPIC returned ${returnedKeys.length} fields including ${[
        'model',
        sample.fields.Trim ? 'trim' : sample.fields.Series ? 'series' : null,
        sample.fields.EngineCylinders ? 'engine' : null,
        sample.fields.TransmissionStyle ? 'transmission' : null,
        'plant',
      ]
        .filter(Boolean)
        .join(', ')}${blankLabels.length ? `, and left these blank: ${blankLabels.join(', ').toLowerCase()}` : ''}. A blank means ${m.name} did not file that attribute for the pattern, not that the vehicle lacks it.`,
    },
    {
      q: `How do I read the model year in a ${m.name} VIN?`,
      a: `The 10th character. A is 2010, B 2011, and so on to Y for 2030; the digits 1 to 9 are 2001 to 2009 (and 2031 to 2039). The same letters were used for 1980 to 2000, and for cars, SUVs and light trucks a numeric 7th character means the earlier cycle while a letter means 2010 onward (49 CFR 565.15). The decoder above resolves it for you.`,
    },
    {
      q: `Does decoding a ${m.name} VIN show accidents, title brands or theft?`,
      a: `No. A decode reads the build record: what the ${isBike ? 'bike' : 'vehicle'} is, not what has happened to it. Title brands, liens, odometer readings and theft records sit with state agencies, NMVTIS providers, insurers (NICB VINCheck) and law enforcement. CarWorthIt is not an NMVTIS provider and does not sell history; the title, lien, odometer and stolen-vehicle checks on this site route you to the right free source.`,
    },
    {
      q: `Is this ${m.name} VIN decoder really free?`,
      a: `Yes. It reads NHTSA's vPIC database, which is public US federal data, with no account and no card. NHTSA's own decoder at vpic.nhtsa.dot.gov gives the same answer. What CarWorthIt charges for is a local-market valuation of the exact VIN at its mileage (from $${PRODUCTS.valuation.price}) and the factory build record (from $${PRODUCTS.worthit.price}).`,
    },
  ];

  const locSource = SOURCES[m.vinLocation.sourceId];

  return (
    <ToolPage
      h1={`Free ${m.name} VIN Decoder`}
      path={`/vin-decoder/${m.slug}`}
      crumbs={[
        { name: 'VIN decoder', path: '/vin-decoder' },
        { name: m.name, path: `/vin-decoder/${m.slug}` },
      ]}
      intro={
        <>
          <p>
            <strong>
              Enter any 17-character {m.name} VIN to see the year, model, {isBike ? 'series, engine size' : 'trim, engine'} and plant
              NHTSA has on file for it, free.
            </strong>{' '}
            {m.context}
          </p>
        </>
      }
      tool={
        <VinDecodeTool
          mode="make"
          expectedMake={m.vpicMake}
          inputId={`vin-${m.slug}`}
          placeholder={sample.vin}
          buttonLabel={`Decode this ${m.name} VIN`}
        />
      }
      faqs={faqs}
      freeCan={[
        `Year, model, ${isBike ? 'series' : 'trim or series'}, body, engine, fuel, drive, plant and GVWR class, as ${m.name} filed them with NHTSA.`,
        'Whether the VIN is valid: length, allowed characters and the position-9 check digit.',
        `Which of ${m.name}'s ${wmis.length} WMIs it carries, and therefore which company and country registered it.`,
        'The free CarWorthIt report: open recalls, crash-test ratings and running costs.',
      ]}
      freeCannot={[
        `Attributes ${m.name} did not file for the pattern (a blank field is a blank filing, not a missing part).`,
        'Options, MSRP or the window sticker (the build record, in the paid report), or the paint code (a label on the car, never the VIN).',
        'Accidents, title brands, liens, odometer readings or theft (NMVTIS providers, NICB VINCheck, state agencies).',
        'Mileage, condition or what it is worth (the valuation is the paid product).',
      ]}
      sourceIds={['vpicApi', 'vpic', 'cfr565', ...(m.vinLocation.sourceId === 'harleyRecalls' ? (['harleyRecalls'] as const) : [])]}
      related={[
        { href: '/vin-decoder', label: 'Free VIN decoder (any make)' },
        { href: '/vin-year-chart', label: 'VIN model year chart' },
        { href: '/engine-by-vin', label: 'Engine by VIN' },
        { href: '/transmission-by-vin', label: 'Transmission by VIN' },
        { href: '/window-sticker', label: 'Window sticker by VIN' },
        { href: '/paint-code-by-vin', label: 'Paint code by VIN' },
        ...(isBike ? [{ href: '/motorcycle-vin-check', label: 'Motorcycle VIN check' }] : [{ href: '/title-check', label: 'Title check' }]),
      ]}
    >
      <h2>{m.name} WMI codes (the first three characters)</h2>
      <p>
        Every row below was returned by NHTSA vPIC on {fmtDate(table.fetched)}. The method: query vPIC&apos;s GetWMIsForManufacturer
        endpoint for the manufacturer names that build {m.name}{' '}vehicles, then confirm each candidate with vPIC&apos;s DecodeWMI endpoint
        and keep it only when DecodeWMI names {m.name}{' '}as a make for that WMI. Nothing was added by hand. &quot;Also decodes as&quot; lists
        the other makes vPIC returns for the same three characters.
      </p>
      <WmiTable rows={wmis} make={m.name} />

      <h2>Where the VIN is on a {m.name}</h2>
      <p>{m.vinLocation.text}</p>
      <p className="text-sm">
        Source:{' '}
        <a href={locSource.url} target="_blank" rel="nofollow noopener">
          {locSource.name}
        </a>
        , checked {fmtDate(locSource.checked)}.
      </p>

      <h2>What vPIC returned for a real {m.name} VIN</h2>
      <p>
        To show what to expect, we decoded {m.sampleDescription} on {fmtDate(sample.fetched)} (VIN {sample.vinMasked}). vPIC returned
        the fields below and left <strong>{blankLabels.length ? blankLabels.join(', ') : 'nothing'}</strong> blank
        {blankLabels.length ? `; those are attributes ${m.name} did not file for this pattern` : ''}.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Field</th>
              <th className="py-2 font-semibold">Value returned</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {returnedKeys.map((k) => (
              <tr key={k} className="border-b border-border">
                <td className="py-1.5 pr-4 font-semibold text-ink">{VPIC_FIELD_LABELS[k] || k}</td>
                <td className="py-1.5">{sample.fields[k]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{m.name} model year by the 10th character</h2>
      <p>
        The 10th character of every {m.name} VIN is the model-year code from 49 CFR 565.15. The letters repeat every 30 years, so a
        &quot;D&quot; is 1983 or 2013; for cars, SUVs and trucks up to 10,000 lb the 7th character settles it (a digit means the
        1980 to 2009 cycle, a letter means 2010 to 2039). The decoder above applies the rule for you. Full chart on the{' '}
        <Link href="/vin-year-chart">VIN year chart</Link>.
      </p>
      <YearCodeTable from={2001} to={2030} compact />

      <h2>What a {m.name} decode does not tell you</h2>
      <p>
        The decode is the manufacturer&apos;s build record. It says nothing about the {isBike ? 'bike' : 'vehicle'}&apos;s life since:
        no accidents, no title brands, no liens, no odometer history, no theft record. Those sit behind NMVTIS providers, NICB
        VINCheck and state agencies, and the <Link href="/title-check">title check</Link>, <Link href="/lien-check">lien check</Link>,{' '}
        <Link href="/odometer-check">odometer check</Link> and <Link href="/stolen-vehicle-check">stolen vehicle check</Link> pages
        explain how to use each. CarWorthIt does not sell vehicle history and is not an NMVTIS-approved provider.
      </p>
    </ToolPage>
  );
}
