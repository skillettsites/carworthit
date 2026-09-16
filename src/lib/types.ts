// Shared types for the vehicle report

export interface VehicleSpecs {
  vin: string;
  year: string;
  make: string;
  model: string;
  trim?: string;
  bodyClass?: string;
  engine?: string;
  cylinders?: string;
  displacementL?: string;
  fuelType?: string;
  driveType?: string;
  transmission?: string;
  doors?: string;
  plantCountry?: string;
  vehicleType?: string;
  gvwr?: string;
  // Additional vPIC fields for the VIN tool pages (transmission, engine, plant,
  // trailer and motorcycle decoders). All optional: a blank means the
  // manufacturer did not file that attribute with NHTSA, and the pages say so.
  manufacturer?: string;
  series?: string;
  transmissionSpeeds?: string;
  engineModel?: string;
  engineHP?: string;
  engineConfiguration?: string;
  engineManufacturer?: string;
  turbo?: string;
  otherEngineInfo?: string;
  electrificationLevel?: string;
  plantCity?: string;
  plantState?: string;
  plantCompany?: string;
  trailerType?: string;
  trailerBodyType?: string;
  trailerLength?: string;
  axles?: string;
  motorcycleChassisType?: string;
  motorcycleSuspensionType?: string;
  /** vPIC ErrorCode, "0" when the VIN decoded clean. */
  errorCode?: string;
  errorText?: string;
}

export interface RunningCosts {
  mpgCity?: number;
  mpgHighway?: number;
  mpgCombined?: number; // MPG, or MPGe for electric vehicles
  annualFuelCost?: number; // USD, per fueleconomy.gov (15k mi/yr)
  fuelType?: string;
  co2?: number;
  isElectric?: boolean;
  rangeMiles?: number; // total EPA range for EVs
  displ?: string; // engine displacement (L) - used to backfill specs.engine
  cylinders?: string;
  source: 'fueleconomy.gov' | 'estimated';
}

export interface Recall {
  campaign: string;
  component: string;
  summary: string;
  remedy?: string;
  date?: string;
}

// ---------------------------------------------------------------------------
// OneAuto US layer (Carketa market pricing + VIN Decode Plus). Replaces the
// Vehicle Databases valuation, which took no mileage or location and priced a
// 2006 Corvette ~40% low as a result.
// ---------------------------------------------------------------------------

/**
 * Carketa market pricing, reduced to the three fields the licence permits us
 * to show a consumer. The API also returns comparable listings, days on market
 * and the comparables' mileage range; those are trade-only and are dropped at
 * the client so they cannot be rendered by mistake.
 */
export interface MarketValuation {
  averagePrice: number;
  /** null when the feed returned no range. Never faked from the average. */
  lowPrice: number | null;
  highPrice: number | null;
  mileage: number; // what we asked for, so the report can state its own basis
  zip: string;
  fetchedAt: string;
  /**
   * 'local' is Carketa's ZIP-scaled figure (the default). 'national' means
   * Carketa had nothing for this car and the Retail Market Value national
   * figures stand in, which the report says in words wherever it quotes them.
   */
  basis?: 'local' | 'national';
}

/** The original factory record, from OneAuto VIN Decode Plus (US). */
export interface FactoryData {
  year: string;
  make: string;
  model: string;
  trim?: string;
  bodyType?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  cityMpg?: number;
  highwayMpg?: number;
  doors?: number;
  seats?: number;
  msrp: number | null;
  invoicePrice: number | null;
  optionsMsrp: number | null;
  deliveryCharges: number | null;
  combinedMsrp: number | null;
  standardFeatures: { category: string; description: string }[];
  installedOptions: { description: string; msrp: number | null }[];
  warranty: { type: string; months: number | null; miles: number | null }[];
}

/**
 * VIN-level recall status, from OneAuto's paid US Recall Report.
 *
 * Materially better than the free NHTSA feed, which only lists campaigns ever
 * ISSUED for a year/make/model. This says whether the work is still
 * OUTSTANDING on this specific car, and includes manufacturer service
 * campaigns that are never reported to NHTSA at all. It turns "there were
 * recalls for this model, go ask a dealer" into an actual answer.
 */
export interface RecallReport {
  checkedAt: string;
  outstanding: boolean;
  total: number;
  nhtsaCount: number;
  manufacturerCount: number;
  items: { source: 'NHTSA' | 'Manufacturer'; campaign?: string; component?: string; summary?: string; remedy?: string }[];
}

/** The verdict the whole brand rests on: is this car worth it. */
export interface WorthItVerdict {
  /** Where the asking price sits against the local market range. */
  standing: 'below' | 'fair' | 'above' | 'unknown';
  headline: string;
  detail: string;
  /** Asking price minus the market average. Negative is a saving. */
  differenceFromAverage: number | null;
}

export interface OwnershipCostEstimate {
  fiveYearTotal: number;
  depreciation: number;
  fuel: number;
  insurance: number;
  maintenance: number;
  repairs: number;
  taxesFees: number;
}

export interface SafetyRatings {
  overall?: number;
  frontal?: number;
  side?: number;
  rollover?: number;
  complaints?: number;
  investigations?: number;
  esc: boolean; // electronic stability control
  fcw: boolean; // forward collision warning
  ldw: boolean; // lane departure warning
}

export interface FreeReport {
  specs: VehicleSpecs;
  runningCosts: RunningCosts | null;
  /** null means NHTSA was unreachable, [] means it reported none. */
  recalls: Recall[] | null;
  safety: SafetyRatings | null;
  ownership: OwnershipCostEstimate | null;
  fetchedAt: string;
}

/**
 * One listing behind a Retail Market Value figure. From VIN Audit via OneAuto.
 * Unlike Carketa's comparables these MAY be shown to a consumer inside a paid
 * report (confirmed in writing by OneAuto, 15 September 2026). The listing's
 * own VIN is dropped at the client: it identifies somebody else's car and the
 * report has no use for it.
 */
export interface MarketListing {
  /** ISO date the listing was observed. */
  date: string;
  mileage: number;
  /** Advertised asking price, USD. */
  price: number;
  /** The asking price adjusted to the subject car's mileage, USD. */
  adjPrice: number;
  zip: string;
  state: string;
  lat: number;
  lng: number;
}

/**
 * Retail Market Value (US) from VIN Audit via OneAuto: a NATIONAL retail value
 * for this exact year, make, model and trim, at the stated mileage, built from
 * live sales listings and refreshed daily. The local number in the report is
 * still Carketa; this is the evidence behind it.
 */
export interface MarketEvidence {
  /** "2018 Chevrolet Equinox LT" as the feed describes the VIN. */
  vehicleDesc: string;
  /** Odometer reading the figures were struck at. */
  mileage: number;
  mean: number;
  standardDeviation: number;
  /** Listings the feed counted. May exceed listings.length, which is capped. */
  count: number;
  /** 0 to 100, the feed's own confidence in the figure. */
  confidence: number;
  /** Observation window of the listings, ISO dates. */
  from: string;
  to: string;
  low: number;
  avg: number;
  high: number;
  /** Ten price bands with the number of listings in each. */
  bands: { min: number; max: number; count: number }[];
  /** Dollars the feed moved the value for this car's mileage against the pool. */
  mileageAdjustment: number;
  listings: MarketListing[];
  fetchedAt: string;
}
