import wmiData from '@/content/vin-tools/wmi.json';
import samples from '@/content/vin-tools/sample-decodes.json';

/**
 * The twelve make decoder pages. Everything factual on those pages comes from
 * the two JSON files (vPIC WMI tables and one sample vPIC decode per make,
 * both fetched September 15, 2026) or from the regulation cited in
 * sources.ts. The prose here is limited to what those sources support.
 */
export interface WmiRow {
  wmi: string;
  type: string;
  manufacturer: string;
  country: string;
  sharedWith: string[];
  since: string;
}

export interface MakeWmiTable {
  fetched: string;
  method: string;
  searches: string[];
  decodeWmiEndpoint: string;
  wmis: WmiRow[];
}

export interface SampleDecode {
  vin: string;
  vinMasked: string;
  fetched: string;
  endpoint: string;
  fields: Record<string, string>;
  blank: string[];
}

export interface MakeDef {
  slug: string;
  name: string;
  /** vPIC "Make" value, upper case. */
  vpicMake: string;
  /** Short possessive-free label used in titles, e.g. "Ford". */
  kind: 'car' | 'motorcycle';
  /** One or two sentences of make-specific context grounded in the data. */
  context: string;
  /** Where the VIN is on this make, with the source it comes from. */
  vinLocation: { text: string; sourceId: 'cfr565' | 'harleyRecalls' };
  /** Whether the sample VIN was a real listing VIN or a pattern-valid test VIN. */
  sampleIsReal: boolean;
  sampleDescription: string;
}

const CAR_LOCATION =
  'On the dashboard at the base of the windshield on the driver side, readable from outside through the glass (49 CFR 565.13(f) requires this for passenger cars, SUVs and trucks up to 10,000 lb GVWR), and on the certification label at the driver door hinge pillar, latch post or door edge (49 CFR 567.4). The title, registration and insurance card repeat it.';

export const MAKES: MakeDef[] = [
  {
    slug: 'ford',
    name: 'Ford',
    vpicMake: 'FORD',
    kind: 'car',
    context:
      'Ford VINs come from Ford Motor Company plants in the United States (1F prefixes), Canada (2F), Mexico (3F) and several overseas Ford companies, plus two joint-venture WMIs that vPIC assigns to Ford: 1ZV (Auto Alliance International) and 1F6 (Detroit Chassis LLC, which vPIC decodes as a Ford motorhome chassis).',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2019 F-250 Super Duty from a public used listing',
  },
  {
    slug: 'toyota',
    name: 'Toyota',
    vpicMake: 'TOYOTA',
    kind: 'car',
    context:
      'A Toyota VIN tells you which plant built the car: 4T1 is Kentucky, 5TF is Texas, 5TD Indiana, 5YF Mississippi, 2T1 and 2T3 Canada, 3TM and 3TY Mexico, and the JT prefixes are Japan. Two WMIs are shared with other badges in vPIC: 5TD and JTE also cover Lexus, and 7MM, registered to Mazda Toyota Manufacturing USA, also covers Mazda.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2021 Camry SE from a public used listing',
  },
  {
    slug: 'honda',
    name: 'Honda',
    vpicMake: 'HONDA',
    kind: 'car',
    context:
      'Honda uses separate WMIs for cars, SUVs, trucks and motorcycles, and vPIC lists 34 of them under the Honda make, from 1HG (US-built cars) and 2HG (Canada) to JH2 and 1HF (motorcycles). Acura shares one Mexico WMI, 3HD, with Honda in vPIC.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2023 Civic Sport from a public used listing',
  },
  {
    slug: 'chevrolet',
    name: 'Chevrolet',
    vpicMake: 'CHEVROLET',
    kind: 'car',
    context:
      'Chevrolet does not have its own manufacturer record in vPIC: its WMIs are registered to General Motors LLC. The table below is every General Motors, Isuzu, CAMI and NUMMI WMI that vPIC\'s DecodeWMI endpoint returns with CHEVROLET as the make. 1G1 is a US-registered Chevrolet car WMI, 1GC a truck WMI and 1GN an SUV WMI; the country column is vPIC\'s own and is not always what the first digit suggests, so read it rather than assume.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2020 Equinox Premier from a public used listing',
  },
  {
    slug: 'nissan',
    name: 'Nissan',
    vpicMake: 'NISSAN',
    kind: 'car',
    context:
      'Nissan VINs starting 1N4 (cars), 1N6 (trucks) and 5N1 (SUVs) are US-built; 3N1, 3N6 and 3N8 are Mexico; JN1, JN6 and JN8 are Japan. Most of these WMIs are shared with Infiniti in vPIC, and two (JN6 and 3N6) are also listed for Chevrolet.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2021 Kicks SR from a public used listing',
  },
  {
    slug: 'bmw',
    name: 'BMW',
    vpicMake: 'BMW',
    kind: 'car',
    context:
      'A BMW VIN starting WBA is a German-built car, WBS is a BMW M car, WBX a German-built SUV, and 5UX or 5YM an SUV registered to BMW Manufacturer Corporation in the United States. WB1, WB3 and WB4 are BMW motorcycles; 3MW and 3MF are further BMW AG passenger-car WMIs.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2011 550i xDrive from a public used listing',
  },
  {
    slug: 'audi',
    name: 'Audi',
    vpicMake: 'AUDI',
    kind: 'car',
    context:
      'Audi has only five WMIs in vPIC: WAU (German-built cars), WA1 (German-built SUVs), WUA and WU1 (Audi Sport cars and SUVs) and TRU (Audi AG cars registered in Hungary).',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2016 A6 quattro Prestige from a public used listing',
  },
  {
    slug: 'jeep',
    name: 'Jeep',
    vpicMake: 'JEEP',
    kind: 'car',
    context:
      'Modern Jeep VINs start 1C4 (SUVs) or 1C6 (trucks), and vPIC lists those WMIs for Dodge, Chrysler, Ram, Fiat, Volkswagen and Lancia as well, so the first three characters alone do not prove a vehicle is a Jeep. The 1J prefixes (1J4, 1J8 and others) are older FCA US Jeep WMIs, 2BC is registered to American Motors Corp., and ZAC and ZFB to FCA Italy.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2021 Wrangler Unlimited Rubicon 4xe from a public used listing',
  },
  {
    slug: 'subaru',
    name: 'Subaru',
    vpicMake: 'SUBARU',
    kind: 'car',
    context:
      'Subaru has five WMIs in vPIC: 4S3 (US-built cars) and 4S4 (US-built SUVs) from Subaru of America\'s Indiana plant, and JF1, JF2 and JF3 from Japan. vPIC also lists JF1 for Toyota.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: false,
    sampleDescription: 'a pattern-valid 2020 Outback test VIN (correct WMI, descriptor and check digit; no public Subaru listing VIN was available to us)',
  },
  {
    slug: 'hyundai',
    name: 'Hyundai',
    vpicMake: 'HYUNDAI',
    kind: 'car',
    context:
      'KMH (cars) and KM8 (SUVs) are Hyundai Motor Company in South Korea; 5NM (SUVs) and 5NT (trucks) are Hyundai Motor Manufacturing Alabama; 5NP is registered to the Hyundai-Kia America Technical Center; 7YA is Hyundai Motor Group Metaplant America. Several Hyundai WMIs are shared with Kia and Genesis in vPIC, which is why the decoder reads the whole VIN rather than the first three characters.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2025 Tucson SEL from a public used listing',
  },
  {
    slug: 'kia',
    name: 'Kia',
    vpicMake: 'KIA',
    kind: 'car',
    context:
      'KNA (cars) and KND (SUVs) are Kia Corporation in South Korea; 5XX and 5XY are Kia Georgia; 3KP and 3KM are Kia Mexico. vPIC lists six of Kia\'s eight WMIs as shared with Hyundai.',
    vinLocation: { text: CAR_LOCATION, sourceId: 'cfr565' },
    sampleIsReal: true,
    sampleDescription: 'a 2025 Niro EX from a public used listing',
  },
  {
    slug: 'harley-davidson',
    name: 'Harley-Davidson',
    vpicMake: 'HARLEY-DAVIDSON',
    kind: 'motorcycle',
    context:
      'Harley-Davidson has four WMIs in vPIC: 1HD (US-built, also used by LiveWire), 5HD, 932 (Harley-Davidson do Brasil) and HDR (Harley-Davidson Off-Road). For a 2007 Street Glide test VIN, vPIC returned the model, the FLHX series, engine size, horsepower and the York, Pennsylvania plant.',
    vinLocation: {
      text: 'Stamped on the steering head, and repeated on a label on the right front down tube (Harley-Davidson\'s own instruction on its recall lookup page). The title and registration carry it too.',
      sourceId: 'harleyRecalls',
    },
    sampleIsReal: false,
    sampleDescription: 'a pattern-valid 2007 Street Glide test VIN (correct WMI, descriptor and check digit)',
  },
];

export const makeBySlug = (slug: string) => MAKES.find((m) => m.slug === slug);

export function wmiTableFor(slug: string): MakeWmiTable | undefined {
  return (wmiData as Record<string, MakeWmiTable>)[slug];
}

export function sampleFor(slug: string): SampleDecode | undefined {
  return (samples as Record<string, SampleDecode>)[slug];
}

/** Human labels for vPIC field names shown in the sample-decode table. */
export const VPIC_FIELD_LABELS: Record<string, string> = {
  Make: 'Make',
  Manufacturer: 'Manufacturer',
  Model: 'Model',
  ModelYear: 'Model year',
  Trim: 'Trim',
  Series: 'Series',
  BodyClass: 'Body class',
  VehicleType: 'Vehicle type',
  EngineModel: 'Engine model',
  EngineCylinders: 'Cylinders',
  DisplacementL: 'Displacement (L)',
  EngineHP: 'Horsepower',
  FuelTypePrimary: 'Fuel',
  TransmissionStyle: 'Transmission',
  TransmissionSpeeds: 'Transmission speeds',
  DriveType: 'Drive',
  Doors: 'Doors',
  PlantCity: 'Plant city',
  PlantState: 'Plant state',
  PlantCountry: 'Plant country',
  PlantCompanyName: 'Plant name',
  GVWR: 'GVWR class',
  ErrorCode: 'vPIC error code',
};
