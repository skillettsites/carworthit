import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { STICKER_OEMS } from '@/lib/vin-tools/window-sticker';

/*
 * One child page per make whose manufacturer sticker service verifiably
 * resolved on September 15, 2026 (see src/lib/vin-tools/window-sticker.ts).
 * Makes without a verified service do not get a page; the hub explains why.
 */

export function generateStaticParams() {
  return STICKER_OEMS.map((o) => ({ make: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make } = await params;
  const o = STICKER_OEMS.find((x) => x.slug === make);
  if (!o) return {};
  return {
    title: `${o.make} Window Sticker by VIN: Free Lookup, Tested`,
    description: `Get the original ${o.make} window sticker by VIN from ${o.endpointHost}, free. Tested with real VINs on September 15, 2026: ${o.verification.realStickers} of ${o.verification.tested} returned the sticker. What worked, what did not, and the fallback.`,
    alternates: { canonical: `${SITE_URL}/window-sticker/${o.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ make: string }> }) {
  const { make } = await params;
  const o = STICKER_OEMS.find((x) => x.slug === make);
  if (!o) notFound();
  const v = o.verification;
  const stellantis = o.slug !== 'ford';

  const faqs = [
    {
      q: `Is the ${o.make} window sticker lookup free?`,
      a: `Yes. ${o.endpointHost} returns the original Monroney label as a PDF for any VIN it holds, with no account. We tested it on September 15, 2026 with ${v.tested} VINs and received a real sticker for ${v.realStickers} of them.`,
    },
    {
      q: `Which ${o.make} model years does it cover?`,
      a: stellantis
        ? `In our tests the Stellantis service (shared by Jeep, Ram, Dodge and Chrysler) returned stickers for every 2017-or-newer VIN and nothing for 2014 to 2016. For ${o.make} specifically: worked for ${v.modelYearsWorked}; did not for ${v.modelYearsFailed}. Treat 2017 as the practical cutoff.`
        : `Coverage is patchy rather than age-based: real stickers came back for ${v.modelYearsWorked} trucks, while other VINs from ${v.modelYearsFailed} returned Ford's "not yet released" placeholder, including three 2023 trucks. A blank result means the service does not hold that VIN.`,
    },
    {
      q: `What does the ${o.make} sticker show?`,
      a: stellantis
        ? 'The 2023 Grand Cherokee sticker we retrieved lists the model year and trim, base price, exterior and interior color, engine and transmission, standard equipment by category, optional equipment with prices, destination charge, total price, warranty coverage (5-year/60,000-mile powertrain and 3-year/36,000-mile basic on that vehicle), the EPA fuel economy panel and the assembly point.'
        : 'The 2018 F-150 sticker we retrieved lists the dealer and shipping block, the vehicle description (cab, wheelbase, engine, transmission), exterior paint by name and interior trim, the EPA fuel economy panel with the annual fuel cost estimate, the standard equipment, the optional equipment with prices, the warranty block (3 years/36,000 miles bumper to bumper, 5 years/60,000 miles powertrain and roadside assistance on that truck) and the price block: base price $41,725, options $9,500, destination and delivery $1,295, total before discounts $52,520.',
    },
    {
      q: 'What if it comes back blank?',
      a: `Then ${o.make}'s service does not hold that VIN, and no other free source has the label. The manufacturer's build record carries the same MSRP, options and equipment; a dealer can look it up, and the CarWorthIt ${PRODUCTS.worthit.name} ($${PRODUCTS.worthit.price}) reproduces it (MSRP, invoice, options, standard equipment, warranty terms) with a local-market valuation.`,
    },
    {
      q: 'Does the sticker show the car\'s history?',
      a: 'No. It is the new-car price label. For title brands, liens, odometer and theft, use the title check, lien check, odometer check and stolen vehicle check pages, which route you to NICB VINCheck and NMVTIS providers. CarWorthIt does not sell vehicle history.',
    },
  ];

  return (
    <ToolPage
      h1={`${o.make} Window Sticker by VIN`}
      path={`/window-sticker/${o.slug}`}
      crumbs={[
        { name: 'Window sticker', path: '/window-sticker' },
        { name: o.make, path: `/window-sticker/${o.slug}` },
      ]}
      intro={
        <>
          <p>
            <strong>
              {o.make} publishes original window stickers by VIN at {o.endpointHost}, free. Enter the VIN below and the tool links you to
              the PDF.
            </strong>{' '}
            On September 15, 2026 we tested the service with {v.tested} VINs, most taken from public used listings: {v.realStickers}{' '}
            returned the full sticker (model years {v.modelYearsWorked}); the rest returned a placeholder. {v.notes}
          </p>
        </>
      }
      tool={<VinDecodeTool mode="sticker" expectedMake={o.vpicMakes[0]} inputId={`vin-sticker-${o.slug}`} buttonLabel={`Find the ${o.make} sticker`} />}
      faqs={faqs}
      freeCan={[
        `The original ${o.make} Monroney label as a PDF, for VINs the service holds: MSRP, options with prices, standard equipment, colors, engine, transmission, EPA panel.`,
        'The free decode: year, make, model, trim, engine and plant, to check the sticker against the car.',
        'The free CarWorthIt report: open recalls, crash-test ratings and running costs.',
      ]}
      freeCannot={[
        `A sticker for every VIN: ${v.tested - v.realStickers} of ${v.tested} test VINs returned a placeholder.`,
        stellantis ? 'Stickers for 2016 and older vehicles (none of the 2014 to 2016 VINs we tried worked).' : 'A predictable cutoff: 2023 trucks failed while a 2018 succeeded.',
        'History: the label is the new-car price sheet, not a title, lien or theft record.',
      ]}
      sourceIds={[stellantis ? 'stellantisSticker' : 'fordSticker', 'vpicApi']}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">If the service has no sticker for your {o.make}</h2>
          <p className="mt-2 text-ink-2">
            The CarWorthIt {PRODUCTS.worthit.name} (${PRODUCTS.worthit.price}) reproduces the manufacturer&apos;s build record for the exact
            VIN: MSRP when new, dealer invoice, installed options with prices, standard equipment by category, engine and transmission,
            and the original factory warranty terms where the record holds them, plus what the vehicle is worth at its mileage near
            you. It does not include paint color or the original EPA panel.{' '}
            <Link href="/sample-report" className="text-brand underline">
              See a sample report
            </Link>
            .
          </p>
        </div>
      }
      related={[
        { href: '/window-sticker', label: 'Window sticker by VIN (all makes)' },
        ...STICKER_OEMS.filter((x) => x.slug !== o.slug).map((x) => ({ href: `/window-sticker/${x.slug}`, label: `${x.make} window sticker` })),
        { href: '/check-warranty-by-vin', label: 'Warranty by VIN' },
      ]}
    >
      <h2>How the {o.make} lookup works</h2>
      <p>
        The service lives at <code>{o.endpoint}</code> followed by the 17-character VIN. It responds with an HTTP {v.httpStatus} and a PDF
        whether or not it holds the VIN: a real sticker when it does, a one-page notice when it does not. The tool above builds the
        address for you after decoding the VIN, so you also see the year, model and trim NHTSA has on file and can check the sticker
        against them.
      </p>

      <h2>What we tested, and what came back</h2>
      <ul>
        <li>
          <strong>Tested:</strong> {v.tested} VINs, {v.checked === '2026-09-15' ? 'September 15, 2026' : v.checked}.
        </li>
        <li>
          <strong>Real stickers:</strong> {v.realStickers} (model years {v.modelYearsWorked}).
        </li>
        <li>
          <strong>Placeholder returned:</strong> {v.tested - v.realStickers} (model years {v.modelYearsFailed}).
        </li>
        <li>
          <strong>Response:</strong> HTTP {v.httpStatus}, {v.contentType}.
        </li>
      </ul>
      <p>{v.notes}</p>

      <h2>Reading a {o.make} sticker</h2>
      <p>
        Start with the total price and the option list: the difference between base price and total is what the first buyer paid for
        options, and it tells you which equipment on the car is factory and which was added later. Check the engine and transmission
        lines against the decode above and against the car. Then the warranty block: the sticker states the original coverage in
        years and miles, and the in-service date from the dealer or the manufacturer&apos;s owner portal tells you how much of it is
        left; see <Link href="/check-warranty-by-vin">warranty by VIN</Link>.
      </p>
    </ToolPage>
  );
}
