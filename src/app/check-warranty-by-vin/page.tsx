import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { SOURCES } from '@/lib/vin-tools/sources';

export const metadata: Metadata = {
  title: 'Check Warranty by VIN: Free Decode vs Build Record',
  description:
    'How to check a car warranty by VIN: the free decode gives the model year (the warranty clock), the $6.99 report gives the original factory warranty terms from the build record, and the manufacturer owner portal gives the in-service date. Verified links.',
  alternates: { canonical: `${SITE_URL}/check-warranty-by-vin` },
};

/*
 * What the paid report includes: src/lib/apis/oneauto.ts parseFactoryData
 * maps warranty_data (warranty_type, warranty_months, warranty_miles) into
 * FactoryData.warranty, and src/components/report/WorthItReport.tsx renders
 * "Original factory warranty" rows when that array is non-empty. It is the
 * ORIGINAL terms (type, months, miles), not the in-service date and not the
 * remaining coverage, and this page says so.
 *
 * OEM links below were fetched September 15, 2026; each one's status is in
 * sources.ts. Pages that returned 403/404/timeouts are not linked.
 */

const OEM_LINKS: { make: string; sourceId: keyof typeof SOURCES; what: string }[] = [
  { make: 'Toyota', sourceId: 'toyotaOwners', what: 'Toyota Owners: "Manuals & Warranties" for a registered vehicle, behind a sign-in.' },
  { make: 'Kia', sourceId: 'kiaOwners', what: 'Kia Owner Portal: "Have access to your vehicle\'s warranty information", behind a sign-in. Kia\'s public warranty page states 10-year/100,000-mile powertrain and 5-year/60,000-mile basic coverage for the original purchaser or certified pre-owned buyer.' },
  { make: 'Hyundai', sourceId: 'hyundaiOwners', what: 'MyHyundai owner portal with a Warranty section, behind a sign-in; Hyundai\'s public warranty page describes the coverage.' },
  { make: 'Chevrolet, Buick, GMC, Cadillac', sourceId: 'gmOwners', what: 'GM owner account (experience.gm.com) with a "GM Recall & Warranty Center", behind a sign-in; Chevrolet publishes a warranty information page.' },
  { make: 'Nissan', sourceId: 'nissanOwners', what: 'Nissan Owners portal, behind a sign-in.' },
  { make: 'Subaru', sourceId: 'subaruOwners', what: 'Subaru owners site (benefits of ownership); the warranty-specific path returned 404 to us.' },
  { make: 'Honda', sourceId: 'hondaFind', what: 'Honda MyGarage "find your Honda" page (the owners.honda.com vehicle link redirects here).' },
  { make: 'Harley-Davidson', sourceId: 'harleyRecalls', what: 'Recall lookup by VIN on harley-davidson.com; warranty status is through a dealer.' },
];

const faqs = [
  {
    q: 'Can I check a car\'s warranty by VIN for free?',
    a: 'Partly. The free decode returns the model year, which starts the warranty clock, and the make, which tells you whose terms apply. It does not return the warranty itself: NHTSA vPIC does not hold warranty data. The manufacturer owner portals linked on this page show a registered vehicle\'s coverage, but every one we checked on September 15, 2026 sits behind an account. The dealer can read the in-service date and remaining coverage from the VIN.',
  },
  {
    q: 'What does the $6.99 report say about warranty?',
    a: `The ${PRODUCTS.worthit.name} reproduces the manufacturer's build record, and where that record includes warranty data the report lists each coverage type with its months and miles, under "Original factory warranty". That is the coverage the vehicle was sold with, not what remains: the report does not know the in-service date, so it cannot say whether the coverage is still active. Where the build record has no warranty data, the section does not appear and nothing is invented.`,
  },
  {
    q: 'How do I find out how much warranty is left?',
    a: 'Three numbers: the original term (from the window sticker, the build record or the manufacturer\'s warranty page), the in-service date (the day the first owner took delivery, held by the dealer and the manufacturer), and today\'s mileage. Ask any franchised dealer for the make to run the VIN; the service department sees the in-service date and any open coverage.',
  },
  {
    q: 'Does the warranty transfer to a used-car buyer?',
    a: 'It depends on the manufacturer and the coverage type. Kia\'s public warranty page, for example, says its 10-year/100,000-mile powertrain limited warranty is "available for the original purchaser and purchaser of a Certified Pre-Owned Kia", which means a private-sale buyer does not get the full powertrain term. Read the manufacturer\'s warranty booklet for the make; the sticker and the build record state the original terms, not who inherits them.',
  },
  {
    q: 'Does the window sticker show the warranty?',
    a: 'Yes, on the stickers we retrieved. The 2023 Jeep Grand Cherokee sticker reads "5-year or 60,000-mile Powertrain Limited Warranty. 3-year or 36,000-mile Basic Limited Warranty." The 2018 Ford F-150 sticker lists 3 years/36,000 miles bumper to bumper and 5 years/60,000 miles powertrain and roadside assistance. Ford, Jeep, Ram, Dodge and Chrysler publish stickers by VIN; see the window sticker page.',
  },
  {
    q: 'Is a recall the same as a warranty?',
    a: 'No. A safety recall is a separate program run through NHTSA and the manufacturer; it does not depend on the warranty being in force. The free CarWorthIt report lists NHTSA recall campaigns for the year, make and model; the manufacturer\'s own recall lookup by VIN (Harley-Davidson has one on its site) says whether the work was done on that vehicle.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Check Warranty by VIN"
      path="/check-warranty-by-vin"
      crumbs={[
        { name: 'Calculators', path: '/tools' },
        { name: 'Warranty by VIN', path: '/check-warranty-by-vin' },
      ]}
      intro={
        <>
          <p>
            <strong>
              A VIN gives you the model year (the warranty clock) and the make (whose terms apply), free. It does not give you the
              warranty: NHTSA holds no warranty data, and every manufacturer owner portal we checked on September 15, 2026 sits behind
              an account.
            </strong>{' '}
            The original terms are on the window sticker and in the manufacturer&apos;s build record, which the{' '}
            {PRODUCTS.worthit.name} (${PRODUCTS.worthit.price}) reproduces where the record holds them. What remains depends on the
            in-service date, which only the dealer or the manufacturer can tell you. Decode the VIN below to start.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="warranty" inputId="vin-warranty" buttonLabel="Decode this VIN free" />}
      faqs={faqs}
      howTo={{
        name: 'How to check a used car\'s warranty by VIN',
        description: 'Original term, in-service date, current mileage.',
        steps: [
          { name: 'Decode the VIN', text: 'Confirm the model year and make. The model year sets the terms that applied when the car was new.' },
          {
            name: 'Get the original terms',
            text: 'From the window sticker where the manufacturer publishes one (Ford, Jeep, Ram, Dodge, Chrysler), from the manufacturer\'s warranty page for the make, or from the build record in the CarWorthIt Full Report, which lists each coverage with months and miles where the record has it.',
          },
          {
            name: 'Get the in-service date',
            text: 'Ask a franchised dealer for the make to run the VIN, or sign in to the manufacturer\'s owner portal if the car is registered to you. The in-service date is the day coverage started.',
          },
          {
            name: 'Do the arithmetic',
            text: 'Term minus time since in-service, and miles minus current odometer, whichever runs out first. Then read the booklet for what transfers to a second owner.',
          },
        ],
      }}
      freeCan={[
        'The model year and make from the VIN, which fix the warranty clock and whose terms apply.',
        'The manufacturer\'s published warranty terms for the make (Kia\'s and Hyundai\'s public pages are linked below).',
        'The original coverage printed on the window sticker, for makes that publish stickers by VIN.',
        'Open NHTSA recall campaigns for the year, make and model, on the free report; recalls do not depend on the warranty.',
      ]}
      freeCannot={[
        'The in-service date or the remaining coverage: that is the dealer or the owner portal, both by VIN.',
        'Warranty data from NHTSA: vPIC does not hold it, so no free decoder can return it.',
        'Whether a specific coverage transfers to you: read the manufacturer\'s booklet for the make.',
        'Extended or dealer-sold service contracts: those are private contracts, not in any database on this page.',
      ]}
      sourceIds={['vpicApi', 'kiaWarranty', 'kiaOwners', 'hyundaiWarranty', 'hyundaiOwners', 'toyotaOwners', 'gmOwners', 'chevroletWarranty', 'nissanOwners', 'subaruOwners', 'hondaFind', 'harleyRecalls', 'fordSticker', 'stellantisSticker']}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">What the {PRODUCTS.worthit.name} shows about warranty, exactly</h2>
          <p className="mt-2 text-ink-2">
            The ${PRODUCTS.worthit.price} report is built on the manufacturer&apos;s build record for the exact VIN. Where that record
            includes warranty data, the report lists each coverage type with its months and miles under &quot;Original factory
            warranty&quot;: the terms the vehicle was sold with. It does not include the in-service date and does not say whether
            coverage remains; nothing is invented where the record is silent. The rest of the report is the sticker price when new,
            installed options, standard equipment and the local-market valuation at the car&apos;s mileage.{' '}
            <Link href="/sample-report" className="text-brand underline">
              See a sample report
            </Link>
            .
          </p>
        </div>
      }
      related={[
        { href: '/window-sticker', label: 'Window sticker by VIN' },
        { href: '/vin-decoder', label: 'Free VIN decoder' },
        { href: '/vin-year-chart', label: 'VIN model year chart' },
        { href: '/title-check', label: 'Title check' },
      ]}
    >
      <h2>Why the VIN alone cannot answer it</h2>
      <p>
        Warranty coverage is a contract between the manufacturer and the first owner, measured from the in-service date. Neither
        the contract nor the date is in the VIN, and NHTSA&apos;s vPIC database, which the free decode reads, holds vehicle
        specifications, not warranties. What the VIN does is identify the vehicle so that the manufacturer&apos;s own systems, which a
        dealer and the owner portals query, can return the in-service date and the coverage that applies.
      </p>

      <h2>Manufacturer owner portals and warranty pages, checked</h2>
      <p>
        Each link below was fetched on September 15, 2026 and returned HTTP 200. Vehicle-specific status on every portal is behind
        an account; the public pages describe the terms for the make. Manufacturer pages that returned 403, 404 or timed out that
        day (Ford support, BMW, Audi, Mopar, Jeep owners) are not listed rather than guessed.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Make</th>
              <th className="py-2 pr-4 font-semibold">Page</th>
              <th className="py-2 font-semibold">What it offers</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {OEM_LINKS.map((r) => {
              const s = SOURCES[r.sourceId];
              return (
                <tr key={r.make} className="border-b border-border align-top">
                  <td className="py-2 pr-4 font-semibold text-ink">{r.make}</td>
                  <td className="py-2 pr-4">
                    <a href={s.url} target="_blank" rel="nofollow noopener">
                      {s.name}
                    </a>
                  </td>
                  <td className="py-2">{r.what}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>Original terms versus remaining coverage</h2>
      <p>
        The original terms are fixed when the car is sold: so many years or so many miles per coverage type, whichever comes first.
        The window sticker states them (the Jeep and Ford stickers we retrieved both carry a warranty block), the manufacturer&apos;s
        warranty page states them for the make, and the build record behind the paid report lists them per coverage where the
        manufacturer supplied them. Remaining coverage is arithmetic on top: the in-service date and today&apos;s odometer. Only the
        dealer and the manufacturer hold the in-service date for a car you do not yet own, so for a used car the question ends with
        a dealer phone call, not a database.
      </p>
    </ToolPage>
  );
}
