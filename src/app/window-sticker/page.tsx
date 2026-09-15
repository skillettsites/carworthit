import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { STICKER_OEMS, NO_STICKER_MAKES } from '@/lib/vin-tools/window-sticker';

export const metadata: Metadata = {
  title: 'Window Sticker by VIN: Free OEM Lookups',
  description:
    'Get the original window sticker by VIN. Ford, Jeep, Ram, Dodge and Chrysler publish stickers (tested with real VINs on September 15, 2026); Toyota, Honda, GM, Hyundai, Kia, Nissan, Subaru, BMW and Audi do not. Where none exists, the $6.99 build record.',
  alternates: { canonical: `${SITE_URL}/window-sticker` },
};

/*
 * Verification is recorded in src/lib/vin-tools/window-sticker.ts: every
 * endpoint was fetched on September 15, 2026 with real VINs from public
 * listings and the returned PDFs were opened and read. The "no sticker"
 * list records the paths tried and the HTTP status each returned.
 *
 * The claim that the paid report includes the factory build record (MSRP,
 * options, standard equipment, warranty) is checked against
 * src/lib/apis/oneauto.ts parseFactoryData (msrp, invoicePrice,
 * installedOptions, standardFeatures, warranty) and the renderer in
 * src/components/report/WorthItReport.tsx. That feed does not include paint
 * color, so the page does not promise it.
 */

const faqs = [
  {
    q: 'Can I get a window sticker by VIN for free?',
    a: `For some makes. Ford, Jeep, Ram, Dodge and Chrysler run public lookups that return the original Monroney label as a PDF; we tested each with real VINs on September 15, 2026 and got real stickers back for ${STICKER_OEMS.reduce((n, o) => n + o.verification.realStickers, 0)} of ${STICKER_OEMS.reduce((n, o) => n + o.verification.tested, 0)} VINs. For Toyota, Honda, Chevrolet and the other GM brands, Hyundai, Kia, Nissan, Subaru, BMW, Audi and Harley-Davidson we found no public lookup: every path we tried returned 404, 403 or timed out.`,
  },
  {
    q: 'What is on a window sticker?',
    a: 'The Monroney label is the price label a new car wears on the lot. The stickers we retrieved list the model year and trim, base price (MSRP), exterior and interior color, engine and transmission, standard equipment by category, optional equipment with prices, destination charge, total price, the warranty coverage (the 2023 Jeep sticker reads "5-year or 60,000-mile Powertrain Limited Warranty. 3-year or 36,000-mile Basic Limited Warranty."), the EPA fuel economy panel and the assembly point. It is the only document that shows exactly how a specific VIN was optioned when it was sold.',
  },
  {
    q: 'Why does the Ford lookup say "not yet released" for a used truck?',
    a: 'That is Ford\'s placeholder for any VIN its service does not hold, and it returned it for nine of the fourteen F-150 VINs we tried, including three 2023 trucks, while returning real stickers for five others from 2018 to 2023. Coverage is patchy rather than age-based. A blank result means the service does not have that VIN, nothing more.',
  },
  {
    q: 'How far back do the Jeep, Ram, Dodge and Chrysler stickers go?',
    a: 'In our tests, 2017 and newer worked every time (Ram 2017, 2018, 2021, 2023; Dodge 2019 to 2025; Jeep 2023; a 2017 Journey via chrysler.com), and every 2014 to 2016 VIN returned "We are unable to retrieve a window sticker for this VIN at this time." Treat 2017 as the practical cutoff for the Stellantis service.',
  },
  {
    q: 'Is there a window sticker lookup for Toyota, Honda, Chevrolet, Hyundai or Kia?',
    a: 'Not a public one that we could find on September 15, 2026. Toyota, Honda, GM, Hyundai and Kia owner portals sit behind an account and offer manuals and warranty details rather than a sticker; the sticker paths on their sites returned 404 or 403. Third-party services sell reconstructed labels (we did not verify their prices). The manufacturer\'s build record is the underlying data, and it is what the CarWorthIt Full Report reproduces.',
  },
  {
    q: 'What does the CarWorthIt report include instead of a sticker?',
    a: `The ${PRODUCTS.worthit.name} ($${PRODUCTS.worthit.price}) is built on the manufacturer's build record for the exact VIN: the sticker price when new (MSRP), the dealer invoice price, the installed options with their prices, the standard equipment by category, the engine and transmission as specified, and the original factory warranty terms, where the record holds them. It does not include the paint color or the EPA fuel economy panel from the original label; the free report shows current EPA figures instead. It also includes the local-market valuation at the car's mileage.`,
  },
  {
    q: 'Does the window sticker show accidents or title history?',
    a: 'No. It is the price label from the day the car was new. Title brands, liens, odometer readings and theft records are covered on the title check, lien check, odometer check and stolen vehicle check pages, which route you to NICB VINCheck and NMVTIS providers. CarWorthIt does not sell vehicle history.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Window Sticker by VIN"
      path="/window-sticker"
      crumbs={[
        { name: 'Calculators', path: '/tools' },
        { name: 'Window sticker', path: '/window-sticker' },
      ]}
      intro={
        <>
          <p>
            <strong>
              Five makes publish original window stickers by VIN today: Ford, Jeep, Ram, Dodge and Chrysler. Enter the VIN below, the
              decoder reads the make, and if it is one of those five you get a direct link to the manufacturer&apos;s PDF.
            </strong>{' '}
            We tested every lookup with real used-car VINs on September 15, 2026 and opened the PDFs; the results per make are below.
            For every other make there is no free sticker, and the honest substitute is the manufacturer&apos;s build record, which is
            what the {PRODUCTS.worthit.name} (${PRODUCTS.worthit.price}) reproduces: MSRP, options, standard equipment and warranty.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="sticker" inputId="vin-sticker" buttonLabel="Find the window sticker" placeholder="1FTEW1EG1JFE44843" />}
      faqs={faqs}
      howTo={{
        name: 'How to get the original window sticker for a used car',
        description: 'Free where the manufacturer publishes it; the build record where it does not.',
        steps: [
          { name: 'Decode the VIN', text: 'The tool above reads the make from the VIN and tells you whether a manufacturer lookup exists.' },
          {
            name: 'Open the manufacturer PDF',
            text: 'For Ford, Jeep, Ram, Dodge and Chrysler the link goes straight to the manufacturer\'s sticker service with the VIN filled in. A placeholder page means the service does not hold that VIN.',
          },
          {
            name: 'Fall back to the build record',
            text: 'For every other make, or when the service returns nothing, the manufacturer\'s build record carries the same MSRP, options and equipment. A dealer can look it up; the CarWorthIt Full Report reproduces it with a valuation.',
          },
          {
            name: 'Read it against the car',
            text: 'Check the options listed are the options fitted, and that the trim, engine and plant match the decode. A sticker is what the car was; the car in front of you is what it is now.',
          },
        ],
      }}
      freeCan={[
        'Ford, Jeep, Ram, Dodge and Chrysler: the original Monroney label as a PDF from the manufacturer, for the VINs their services hold.',
        'The free decode: year, make, model, trim, engine, plant, so you know which lookup applies and can check the sticker against the car.',
        'From a retrieved sticker: MSRP, options with prices, standard equipment, colors, destination charge, EPA panel.',
        'The free CarWorthIt report: open recalls, crash-test ratings and current EPA running costs.',
      ]}
      freeCannot={[
        'A sticker for Toyota, Honda, GM brands, Hyundai, Kia, Nissan, Subaru, BMW, Audi or Harley-Davidson: no public lookup verified.',
        'A sticker for every Ford: nine of fourteen test VINs returned "not yet released".',
        'Stellantis stickers for 2016 and older: all six 2014 to 2016 Rams returned "unable to retrieve".',
        'History: a sticker is the new-car price label, not a title, lien or theft record.',
      ]}
      sourceIds={['fordSticker', 'stellantisSticker', 'vpicApi']}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">No free sticker for your make? The build record is the same data</h2>
          <p className="mt-2 text-ink-2">
            A Monroney label is printed from the manufacturer&apos;s build record. The CarWorthIt {PRODUCTS.worthit.name} (
            ${PRODUCTS.worthit.price}) reproduces that record for the exact VIN: MSRP when new, dealer invoice, installed options with
            prices, standard equipment by category, engine and transmission, and the original factory warranty terms where the
            record holds them, plus what the car is worth today at its mileage near you. It does not include paint color or the
            original EPA panel.{' '}
            <Link href="/sample-report" className="text-brand underline">
              See a sample report
            </Link>{' '}
            or{' '}
            <Link href="/pricing" className="text-brand underline">
              pricing
            </Link>
            .
          </p>
        </div>
      }
      related={[
        ...STICKER_OEMS.map((o) => ({ href: `/window-sticker/${o.slug}`, label: `${o.make} window sticker lookup` })),
        { href: '/check-warranty-by-vin', label: 'Warranty by VIN' },
        { href: '/paint-code-by-vin', label: 'Paint code by VIN' },
        { href: '/vin-decoder', label: 'Free VIN decoder' },
      ]}
    >
      <h2>Makes with a working public lookup</h2>
      <p>
        Each row is a manufacturer service we fetched on September 15, 2026 with real VINs taken from public used-car listings. &quot;Real
        stickers&quot; counts the PDFs that contained the model year, trim, MSRP and equipment list; the rest returned the service&apos;s
        own placeholder page.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Make</th>
              <th className="py-2 pr-4 font-semibold">Service</th>
              <th className="py-2 pr-4 font-semibold">Real stickers / tested</th>
              <th className="py-2 pr-4 font-semibold">Model years that worked</th>
              <th className="py-2 font-semibold">Model years that did not</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {STICKER_OEMS.map((o) => (
              <tr key={o.slug} className="border-b border-border align-top">
                <td className="py-2 pr-4 font-semibold text-ink">
                  <Link href={`/window-sticker/${o.slug}`}>{o.make}</Link>
                </td>
                <td className="py-2 pr-4">{o.endpointHost} (HTTP {o.verification.httpStatus}, PDF)</td>
                <td className="py-2 pr-4">
                  {o.verification.realStickers} / {o.verification.tested}
                </td>
                <td className="py-2 pr-4">{o.verification.modelYearsWorked}</td>
                <td className="py-2">{o.verification.modelYearsFailed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Makes with no public lookup we could verify</h2>
      <p>
        For each of these we requested the addresses a sticker service would live at and recorded the response. A 404 or 403 on
        the day is not proof that no service will ever exist, but it is why this page does not link one.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Make</th>
              <th className="py-2 pr-4 font-semibold">What we tried</th>
              <th className="py-2 font-semibold">Result on September 15, 2026</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {NO_STICKER_MAKES.map((r) => (
              <tr key={r.make} className="border-b border-border align-top">
                <td className="py-2 pr-4 font-semibold text-ink">{r.make}</td>
                <td className="py-2 pr-4">{r.tried}</td>
                <td className="py-2">{r.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What a retrieved sticker looks like</h2>
      <p>
        The 2023 Jeep Grand Cherokee Limited sticker we retrieved reads, in order: the model year and model, the statement that the
        vehicle was manufactured for United States sale, &quot;Manufacturer&apos;s suggested retail price of this model including dealer
        preparation&quot; with a base price of $49,020, exterior color, interior color and trim, engine (3.6L V6 24V VVT with ESS) and
        transmission (8-speed automatic 8HP50), then standard equipment by category and optional equipment with prices. The 2018 Ford
        F-150 sticker adds the dealer and shipping block, the wheelbase, the exterior paint by name (Magma Red), the EPA fuel economy
        panel (18 mpg combined) and the assembly plant. That level of detail is what no VIN decode can give you, and it is why the
        sticker, or the build record behind it, is worth having before you negotiate.
      </p>
    </ToolPage>
  );
}
