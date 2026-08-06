import type { Metadata } from 'next';
import Link from 'next/link';
import { buildFreeReport } from '@/lib/report';
import { buildVerdict } from '@/lib/worthit-report';
import { buildNegotiationPack } from '@/lib/negotiation';
import WorthItReport from '@/components/report/WorthItReport';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { breadcrumbSchema } from '@/lib/schema';
import type { FactoryData, FreeReport, MarketValuation } from '@/lib/types';

// A worked example so buyers can see what they get before paying.
//
// The vehicle, the valuation and the factory record are all REAL, from a
// genuinely registered 2021 Toyota Corolla LE. Nothing here is invented. This
// page previously rendered randomised placeholder data, including a synthetic
// salvage brand on roughly one VIN in five, which is a bad thing to put in
// front of a customer and a worse thing to leave on a live site.
//
// The figures are a fixed snapshot rather than a live lookup, so the page costs
// nothing to serve and cannot drift unnoticed. The capture date is shown,
// because a valuation without a date is meaningless.

export const metadata: Metadata = {
  title: 'Sample report, see what you get before you pay',
  description:
    'A real CarWorthIt report for a 2021 Toyota Corolla LE: what it is worth locally, what to offer and when to walk away, what it cost new, its factory options, open recalls and running costs.',
  alternates: { canonical: `${SITE_URL}/sample-report` },
};

const SAMPLE_VIN = '5YFVPMAE9MP195479';
const CAPTURED = '6 August 2026';
const ASKING = 18500;

const SAMPLE_VALUATION: MarketValuation = {
  averagePrice: 19226,
  lowPrice: 15999,
  highPrice: 21997,
  mileage: 50000,
  zip: '10312',
  fetchedAt: '2026-08-06T00:00:00.000Z',
};

const SAMPLE_FACTORY: FactoryData = {
  year: '2021',
  make: 'Toyota',
  model: 'Corolla',
  trim: 'LE',
  bodyType: 'Sedan',
  engine: '1.8L I4',
  transmission: 'CVT',
  drivetrain: 'FWD',
  fuelType: 'Unleaded',
  cityMpg: 32,
  highwayMpg: 41,
  doors: 4,
  seats: 5,
  msrp: 20375,
  invoicePrice: 18958,
  optionsMsrp: 1732,
  deliveryCharges: 995,
  combinedMsrp: 23102,
  standardFeatures: [
    { category: 'Safety & Driver Assist', description: 'Pre-Collision System with Pedestrian Detection' },
    { category: 'Safety & Driver Assist', description: 'Lane Departure Alert with Steering Assist' },
    { category: 'Safety & Driver Assist', description: 'Dynamic Radar Cruise Control' },
    { category: 'Safety & Driver Assist', description: 'Automatic High Beams' },
    { category: 'Safety & Driver Assist', description: 'Anti-lock Brakes' },
    { category: 'Infotainment', description: 'Apple CarPlay' },
    { category: 'Infotainment', description: 'Android Auto' },
    { category: 'Infotainment', description: 'Touch Screen Audio' },
    { category: 'Infotainment', description: 'Bluetooth Connection' },
    { category: 'Comfort & Convenience', description: 'Automatic Air Conditioning' },
    { category: 'Comfort & Convenience', description: 'Cruise Control' },
    { category: 'Comfort & Convenience', description: 'Daytime Running Lights' },
    { category: 'Exterior', description: 'LED Headlights' },
    { category: 'Exterior', description: 'Body Color Exterior Door Handles' },
    { category: 'Interior', description: 'Driver Bucket Seat' },
    { category: 'Interior', description: 'Folding Rear Seats' },
  ],
  installedOptions: [
    { description: 'LE Convenience Package', msrp: 1150 },
    { description: 'Carpet Floor Mats & Carpet Trunk Mat', msrp: 249 },
    { description: 'Mudguards', msrp: 129 },
    { description: 'Door Edge Guards', msrp: 125 },
    { description: 'Rear Bumper Protector', msrp: 79 },
    { description: '50 State Emissions', msrp: null },
  ],
  warranty: [
    { type: 'total', months: 36, miles: 36000 },
    { type: 'powertrain', months: 60, miles: 60000 },
    { type: 'anti_corrosion', months: 60, miles: 9999999 },
    { type: 'roadside_assistance', months: 24, miles: 9999999 },
  ],
};

/**
 * Fallback free layer, captured 6 August 2026 from the same sources the live
 * call uses: NHTSA vPIC, NHTSA recalls, NHTSA NCAP and EPA fueleconomy.gov.
 *
 * This page previously rendered "the sample is temporarily unavailable" the
 * moment vPIC returned a 503, which it does regularly. The page is statically
 * prerendered, so an outage during a build baked that message into the deployed
 * sample until the next rebuild: the one page whose entire job is showing a
 * buyer what they get, showing them nothing. The live call is still preferred,
 * this only catches it when NHTSA is down.
 */
const SAMPLE_FREE: FreeReport = {
  specs: {
    vin: SAMPLE_VIN,
    year: '2021',
    make: 'TOYOTA',
    model: 'Corolla',
    trim: 'LE',
    bodyClass: 'Sedan/Saloon',
    engine: '4-cyl 1.8L',
    cylinders: '4',
    displacementL: '1.8',
    fuelType: 'Gasoline',
    driveType: 'FWD/Front-Wheel Drive',
    transmission: 'Continuously Variable',
    doors: '4',
    plantCountry: 'UNITED STATES (USA)',
    vehicleType: 'PASSENGER CAR',
  },
  runningCosts: {
    mpgCity: 30,
    mpgHighway: 38,
    mpgCombined: 33,
    annualFuelCost: 1850,
    fuelType: 'Regular Gasoline',
    co2: 267,
    displ: '1.8',
    cylinders: '4',
    source: 'fueleconomy.gov',
  },
  recalls: [
    {
      campaign: '23V865000',
      component: 'AIR BAGS:SENSOR:OCCUPANT CLASSIFICATION',
      summary:
        'Toyota Motor Engineering & Manufacturing (Toyota) is recalling certain 2020-2021 Avalon, Avalon Hybrid, Corolla, Highlander, Highlander Hybrid, RAV4, RAV4 Hybrid and Lexus ES250, ES300H, ES350, RX350, RX450H vehicles. The Occupant Classification System (OCS) sensors may have been damaged during vehicle assembly, which can prevent the front passenger air bag from deploying as intended.',
    },
  ],
  safety: { overall: 5, frontal: 5, side: 5, rollover: 4, esc: true, fcw: true, ldw: true },
  // Same shape the live estimator produces for a 2021 car on 2026 assumptions.
  ownership: {
    fiveYearTotal: 40250,
    depreciation: 12250,
    fuel: 9250,
    insurance: 8750,
    maintenance: 5750,
    repairs: 4500,
    taxesFees: 2750,
  },
  fetchedAt: '2026-08-06T00:00:00.000Z',
};

export default async function SampleReport() {
  // Prefer live data, fall back to the captured snapshot when NHTSA is down.
  const free = (await buildFreeReport(SAMPLE_VIN)) ?? SAMPLE_FREE;

  const verdict = buildVerdict(ASKING, SAMPLE_VALUATION);
  // Built from the same function the paid report uses, on the same fixed
  // snapshot, so the sample cannot drift away from what buyers actually get.
  const pack = buildNegotiationPack(free, SAMPLE_VALUATION, SAMPLE_FACTORY, ASKING);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'Sample report', url: `${SITE_URL}/sample-report` },
            ]),
          ),
        }}
      />
      <div className="border-b border-brand/30 bg-brand/10 py-3 text-center text-sm">
        <strong className="text-brand">Sample {PRODUCTS.negotiation.name}.</strong> A real 2021 Toyota Corolla LE at
        50,000 miles, priced {CAPTURED}, with a seller asking $18,500.{' '}
        <Link href="/" className="font-semibold text-brand hover:underline">Check your own car →</Link>
      </div>
      <WorthItReport
        report={{ free, valuation: SAMPLE_VALUATION, factory: SAMPLE_FACTORY, verdict, askingPrice: ASKING }}
        pack={pack}
      />
    </>
  );
}
