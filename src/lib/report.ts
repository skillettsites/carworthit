// Combines the free (NHTSA + fueleconomy) and paid (VinAudit) layers into reports.
import type { FreeReport, FullReport, OwnershipCostEstimate, RunningCosts, VehicleSpecs } from './types';
import { decodeVin, getRecalls } from './nhtsa';
import { getRunningCosts } from './fueleconomy';
import { getSafety } from './nhtsaSafety';
import { getHistory } from './vinaudit';

// US national-average ownership costs (AAA-style). Fuel is the car's REAL EPA figure;
// the rest are national averages, clearly labelled as estimates in the UI.
function estimateOwnership(specs: VehicleSpecs, running: RunningCosts | null): OwnershipCostEstimate | null {
  if (!specs.year) return null;
  const age = Math.max(0, new Date().getUTCFullYear() - Number(specs.year));
  const annualFuel = running?.annualFuelCost ?? 2200;
  const fuel = annualFuel * 5;
  const insurance = 1750 * 5;
  // maintenance + repairs rise with age
  const maintenance = Math.round((700 + age * 90) * 5);
  const repairs = Math.round((300 + age * 120) * 5);
  const taxesFees = 550 * 5;
  // depreciation eases as the car ages (older cars lose less in absolute terms)
  const dep5 = Math.max(7500, Math.round((5200 - age * 450) * 5));
  const fiveYearTotal = fuel + insurance + maintenance + repairs + taxesFees + dep5;
  return {
    fiveYearTotal,
    depreciation: dep5,
    fuel,
    insurance,
    maintenance,
    repairs,
    taxesFees,
  };
}

// Rough free value range for the "how much is it worth" teaser (exact value is paid).
function estimateFreeValue(year: string): { low: number; high: number } | null {
  if (!year) return null;
  const age = Math.max(0, new Date().getUTCFullYear() - Number(year));
  const mean = Math.max(1500, Math.round(30000 * Math.pow(0.86, age)));
  return { low: Math.round(mean * 0.82), high: Math.round(mean * 1.12) };
}

export async function buildFreeReport(vin: string): Promise<FreeReport | null> {
  const specs = await decodeVin(vin);
  if (!specs) return null;
  const [running, recalls, safety] = await Promise.all([
    getRunningCosts(specs.year, specs.make, specs.model),
    getRecalls(specs.make, specs.model, specs.year),
    getSafety(specs.year, specs.make, specs.model),
  ]);
  return {
    specs,
    runningCosts: running,
    recalls,
    safety,
    ownership: estimateOwnership(specs, running),
    freeValue: estimateFreeValue(specs.year),
    fetchedAt: new Date().toISOString(),
  };
}

export async function buildFullReport(vin: string): Promise<FullReport | null> {
  const free = await buildFreeReport(vin);
  if (!free) return null;
  const history = await getHistory(vin);
  return { ...free, history };
}
