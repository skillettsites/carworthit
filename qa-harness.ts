// Deep-QA harness: runs the ACTUAL site pipeline (free NHTSA/EPA layer + paid
// Vehicle Databases layer) for a batch of VINs and dumps structured JSON.
// Run: npx tsx qa-harness.ts <VIN1> <VIN2> ...
import { readFileSync } from 'node:fs';
import { buildFreeReport } from './src/lib/report';
import { getValuation, getHistory } from './src/lib/vehicledatabases';

// Load .env.local (VEHICLEDATABASES_KEY) without a dep.
try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {}

const vins = process.argv.slice(2);

async function main() {
for (const vin of vins) {
  const out: Record<string, unknown> = { vin };
  try {
    const free = await buildFreeReport(vin);
    if (!free) {
      out.error = 'VIN did not decode (no free report)';
      console.log(JSON.stringify(out));
      continue;
    }
    const [val, hist] = await Promise.all([
      getValuation(vin, free.specs.year),
      getHistory(vin),
    ]);
    out.specs = free.specs;
    out.recalls = free.recalls.length;
    out.recallList = free.recalls.slice(0, 3).map((r) => `${r.campaign}: ${r.component}`);
    out.safety = free.safety;
    out.running = free.runningCosts;
    out.freeValue = free.freeValue;
    out.valuation = val
      ? { mean: val.mean, low: val.low, high: val.high, tradeIn: val.tradeIn, privateParty: val.privateParty, dealerRetail: val.dealerRetail, isSample: val.isSample, conditions: val.conditions }
      : null;
    out.history = hist
      ? { salvage: hist.salvage, theft: hist.theft, totalLoss: hist.totalLoss, soldAtSalvageAuction: hist.soldAtSalvageAuction, brands: hist.brands, auctionRecords: hist.auctionRecords, odometerReadings: hist.odometer.length, isSample: hist.isSample }
      : null;
  } catch (e) {
    out.error = String(e);
  }
  console.log(JSON.stringify(out));
}
}
main();
