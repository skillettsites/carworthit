import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { PAINT_LOCATIONS } from '@/lib/vin-tools/paint-codes';
import type { Source } from '@/lib/vin-tools/sources';

export const metadata: Metadata = {
  title: 'Paint Code by VIN: Where the Label Is, by Make',
  description:
    'The VIN does not contain the paint code. Here is where the paint code label is on Ford, Chevrolet, Toyota, Honda, Nissan, Jeep, BMW, Audi, Subaru, Hyundai, Kia, Mazda, Mercedes, Tesla and Harley-Davidson, with sources, and the two free routes (dealer, window sticker) when the label is gone.',
  alternates: { canonical: `${SITE_URL}/paint-code-by-vin` },
};

/*
 * Sources (all fetched September 15, 2026): PaintScratch's per-make locator
 * pages and its guide ("The VIN identifies the vehicle, but it does not
 * include the paint code"); AutomotiveTouchup's per-make locator pages; 49
 * CFR 565.15 for what a VIN must encode (paint is not on the list); 49 CFR
 * 567.4 for the certification label. Manufacturer support pages could not be
 * fetched that day (timeouts, 403 and 404), so the locations are retailer
 * guidance and the page says so.
 */

const faqs = [
  {
    q: 'Can I find my paint code from the VIN?',
    a: 'Not from the VIN itself. The 17 characters encode the manufacturer, the line, body, engine and restraint system, the check digit, the model year, the plant and a serial number (49 CFR 565.15); paint is not one of the attributes. PaintScratch, one of the two largest US touch-up paint retailers, says the same: "The VIN identifies the vehicle, but it does not include the paint code." What the VIN does is point a dealer, or the manufacturer\'s build record, at the color that car was built in.',
  },
  {
    q: 'So where is the paint code?',
    a: 'On a label on the car. For most makes it is the certification or color ID label in the driver door jamb; GM uses a service-parts label in the glove box or spare tire well; Audi and Volkswagen use a paper tag in the trunk; BMW and Subaru often use the strut tower or under-hood area; older Chrysler, Dodge and Jeep vehicles used the radiator support or firewall. The table on this page lists each make with the two retailer sources that describe it.',
  },
  {
    q: 'How do I get the paint code by VIN if the label is gone?',
    a: 'Two routes. A dealer\'s parts desk can read the color from the VIN in the manufacturer\'s system, which holds the build record for every car it made. And for Ford, Jeep, Ram, Dodge and Chrysler the window sticker lookup on this site returns the original Monroney label, which names the exterior paint. The CarWorthIt Full Report reproduces the build record\'s MSRP, options, standard equipment and warranty terms, but its data feed does not carry the paint color, so it is not a paint-code source and we do not sell it as one.',
  },
  {
    q: 'What does a paint code look like?',
    a: 'It varies by make. Ford uses two characters (PM, FL, SH), Toyota three after C/TR (3P1), Honda a letter-number string with a suffix (NH731P), GM a WA number shown on the label as BC/CC U316N, Chrysler-family makes three characters starting with P (PX8), BMW three digits (475), Audi and VW an L-prefixed code (LY9H). Examples are from the two retailers\' locator pages.',
  },
  {
    q: 'Why does the same code have different color names?',
    a: 'Because manufacturers reuse a paint across models and give it a marketing name per model. Both retailers make the same point: order by the code, not the name, because the code is what the paint is mixed from.',
  },
  {
    q: 'Does the window sticker show the paint code?',
    a: 'It shows the exterior color by name; whether the code appears as well depends on the make. The Jeep and Ram stickers we retrieved on September 15, 2026 listed "Exterior Color: Baltic Gray Metallic Clear-Coat Exterior Paint" and "Bright White Clear-Coat" by name; the Ford sticker listed "MAGMA RED". Where the manufacturer publishes stickers (Ford, Jeep, Ram, Dodge, Chrysler) that is a free route to at least the color name.',
  },
];

const extraSources: Source[] = PAINT_LOCATIONS.flatMap((r) =>
  r.sources.map((s) => ({ id: `${r.make}-${s.name}`, name: `${s.name}: ${r.make} paint code location`, url: s.url, checked: s.checked })),
);

export default function Page() {
  return (
    <ToolPage
      h1="Paint Code by VIN"
      path="/paint-code-by-vin"
      crumbs={[
        { name: 'VIN decoder', path: '/vin-decoder' },
        { name: 'Paint code by VIN', path: '/paint-code-by-vin' },
      ]}
      intro={
        <>
          <p>
            <strong>The VIN does not encode the paint code.</strong> Federal rule 49 CFR 565.15 fixes what the 17 characters carry
            (manufacturer, line, body, engine, restraints, check digit, model year, plant, serial) and paint is not on the list, so
            no decoder, including this one, can read it out. The code is on a label on the car, and the table below says where for
            15 makes. The VIN is still the key: decode it to confirm the year and make, then read the right label, or have a dealer or
            the build record look up the color that VIN was built in.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="default" inputId="vin-paint" buttonLabel="Decode this VIN free" />}
      faqs={faqs}
      freeCan={[
        'Confirm the year, make, model and plant behind the VIN, so you read the right label for the right car.',
        'Find the paint code label on the car: the locations by make are below, with sources.',
        'For Ford, Jeep, Ram, Dodge and Chrysler, retrieve the original window sticker, which names the exterior color.',
        'A dealer parts desk can read the color from the VIN in the manufacturer\'s system, free.',
      ]}
      freeCannot={[
        'Read the paint code out of the VIN: it is not encoded there, on any make.',
        'Tell you whether the car has been repainted or color-changed since it was built.',
        'Give a manufacturer statement of label location: no manufacturer site served one to us on September 15, 2026, so the table is retailer guidance.',
        'Match paint by eye from a photo: both retailers say order by the code.',
        'Get the paint code from the CarWorthIt report: its build-record feed carries MSRP, options and warranty, not paint.',
      ]}
      sourceIds={['cfr565', 'cfr567', 'paintScratch', 'automotiveTouchup']}
      extraSources={extraSources}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">The build record route, and what ours does not include</h2>
          <p className="mt-2 text-ink-2">
            If the label is missing or painted over, the manufacturer&apos;s build record for the VIN is the source a dealer uses, and
            the dealer is the free route to it. To be clear about our own product: the CarWorthIt {PRODUCTS.worthit.name} (
            ${PRODUCTS.worthit.price}) reproduces the build record&apos;s sticker price when new, installed options, standard equipment,
            engine, transmission and factory warranty terms, alongside a local-market valuation, but the feed behind it does not
            include paint color. Buy it for the price and the options, not for the paint code.{' '}
            <Link href="/sample-report" className="text-brand underline">
              See a sample
            </Link>
            .
          </p>
        </div>
      }
      related={[
        { href: '/window-sticker', label: 'Window sticker by VIN' },
        { href: '/vin-decoder', label: 'Free VIN decoder' },
        { href: '/vin-year-chart', label: 'VIN model year chart' },
        { href: '/guides/what-is-a-vin', label: 'What is a VIN?' },
      ]}
    >
      <h2>Why a VIN cannot hold a paint code</h2>
      <p>
        49 CFR 565.15 sets the content of every section of the VIN: positions 1 to 3 identify the manufacturer, make and type; 4 to 8
        must make decipherable the line, series, body type, engine type and restraint system for a passenger car (with GVWR, cab type
        and brake system for other types); 9 is the check digit; 10 the model year; 11 the plant; 12 to 17 the serial number. Paint
        is not an attribute in that list, and no manufacturer encodes it. What the VIN does is identify the individual vehicle, and
        the manufacturer&apos;s own build record for that vehicle includes the color, which is why a dealer can tell you the paint from
        the VIN while a public decoder cannot.
      </p>

      <h2>Where the paint code label is, by make</h2>
      <p>
        The locations below are what the two largest US touch-up paint retailers, PaintScratch and AutomotiveTouchup, publish on
        their per-make locator pages; both were fetched and read on September 15, 2026, and the source links for each row are in the
        list at the end of the page. They are retailer guidance, not manufacturer statements: no manufacturer support page served a
        paint-code article to our requests that day. Where the two retailers differ, both locations are given.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Make</th>
              <th className="py-2 pr-4 font-semibold">Where the label is</th>
              <th className="py-2 font-semibold">Code format</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {PAINT_LOCATIONS.map((r) => (
              <tr key={r.make} className="border-b border-border align-top">
                <td className="py-2 pr-4 font-semibold text-ink">{r.make}</td>
                <td className="py-2 pr-4">{r.location}</td>
                <td className="py-2">{r.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Reading the label</h2>
      <ul>
        <li>
          <strong>Look for the abbreviation.</strong> PaintScratch&apos;s guide says to look for a sticker or plate marked PAINT, PNT,
          COLOR, C or EXT. On a Ford label the code sits next to EXT PNT; on a Toyota it follows C/TR; on a GM service-parts label it
          follows BC/CC.
        </li>
        <li>
          <strong>Do not use the VIN, the trim code or the barcode.</strong> The same label carries the VIN, interior trim, tire and
          emissions codes; only the paint code mixes paint.
        </li>
        <li>
          <strong>Two-tone vehicles have two codes.</strong> GM labels use U for the upper (body) color and L for the lower; Subaru
          lists both codes for two-tone cars.
        </li>
        <li>
          <strong>Paper tags fall off.</strong> Audi, Volkswagen and some GM labels are paper stickers in the trunk or spare-tire area;
          if it is gone, the dealer or build record is the route.
        </li>
      </ul>
    </ToolPage>
  );
}
