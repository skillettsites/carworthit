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
  mpgCombined?: number;
  annualFuelCost?: number; // USD, per fueleconomy.gov (15k mi/yr)
  fuelType?: string;
  co2?: number;
  source: 'fueleconomy.gov' | 'estimated';
}

export interface Recall {
  campaign: string;
  component: string;
  summary: string;
  remedy?: string;
  date?: string;
}

export interface TitleRecord {
  state: string;
  date: string;
  type: string; // e.g. "Original", "Transfer"
  mileage?: number;
  meta?: string;
}

export interface TitleBrand {
  label: string; // e.g. "Salvage", "Flood", "Junk", "Lemon", "Rebuilt"
  state?: string;
  date?: string;
}

// The paid data layer (NMVTIS via VinAudit)
export interface HistoryData {
  titles: TitleRecord[];
  brands: TitleBrand[];
  odometer: { date: string; reading: number; source?: string }[];
  salvage: boolean;
  theft: boolean;
  totalLoss: boolean;
  jsiRecords?: number; // junk/salvage/insurance records count
  ownersEstimate?: number;
  isSample: boolean; // true when using placeholder data (no key yet)
}

export interface Valuation {
  mean: number;
  low: number;
  high: number;
  tradeIn: number;
  privateParty: number;
  dealerRetail: number;
  insuranceByAge: { band: string; annual: number }[];
  isSample: boolean;
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
  recalls: Recall[];
  safety: SafetyRatings | null;
  ownership: OwnershipCostEstimate | null;
  freeValue: { low: number; high: number } | null; // rough range for the valuation teaser
  fetchedAt: string;
}

export interface FullReport extends FreeReport {
  history: HistoryData;
}
