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
  displ?: string; // engine displacement (L) — used to backfill specs.engine
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
