# CarWorthIt.com — Build Plan & Handoff

*US used-car valuation site. Free valuation as the hook, monetised via affiliates/leads/ads, plus a paid history report. This doc is a complete handoff: strategy, the data stack, live-tested API details, costs, and next steps. Compiled 14 July 2026.*

---

## 1. What we're building
**carworthit.com** — a US consumer site that answers "is this car worth it / what's it worth."
- **Free valuation** (the hook) + free basic data.
- **Monetise the intent** (someone valuing a car is about to buy/sell): affiliate/lead-gen + display ads.
- **Paid history report** as the upsell (~$9.99), where the valuation is bundled with a full NMVTIS history check.

## 2. Why this model (market reality — validated)
- **Nobody charges consumers for a standalone valuation.** KBB, Edmunds, CarGurus, TrueCar, iSeeCars all give values away **free** and monetise via **dealer leads, sell-your-car offers, and ads**. Competing on a paid valuation vs KBB-at-$0 is a losing pitch.
- **What people DO pay for is HISTORY** (trust/safety at purchase): Carfax ~$45, AutoCheck ~$25, budget VIN sites $1-40 (Bumper, EpicVIN). The valuation is bundled in as a *feature*.
- **So:** free valuation = magnet; monetise the intent; sell a paid history report where value is the sweetener. This is exactly how CarCostCheck (Dave's UK site) already works: free tools + £4.99 history + £2.99 valuation bundle.

## 3. The data stack (all consumer-facing-legal, cheap)
| Layer | Source | Cost | Notes |
|---|---|---|---|
| VIN decode | **NHTSA vPIC** (vpic.nhtsa.dot.gov/api) | **Free** | year/make/model/trim/engine. Use for the free layer. |
| Recalls | **NHTSA** (also in Vehicle Databases) | **Free** | |
| Safety ratings | **NHTSA NCAP** | **Free** | free-layer content |
| Fuel economy / running cost | **EPA fueleconomy.gov API** | **Free** | free-layer content |
| **Valuation + History** | **Vehicle Databases** (chosen) | ~$0.05-0.25/credit | one integration for both; see §5 |
| (alt valuation) | MarketCheck Price API | $0.07-0.13/call | listings-based; build-your-own from listings = ~$0.005/call |

### Why Vehicle Databases (and NOT VinAudit)
- **VinAudit is OUT:** their Vehicle History Report API is **"strictly B2B, not for resale or consumer-facing distribution"** (ticket #760890, Marinel, 14 Jul). That's the whole reason we switched.
- **Vehicle Databases:** only provider with **published per-credit pricing AND explicit consumer white-label resale**; does **both** value + history; NMVTIS-backed; a real company (**Detailed Vehicle History**, a $19.99 consumer report site) runs on exactly this API. Bumper is also a listed customer.
- **Backup for better title data later:** **ClearVin** (NMVTIS-direct, reseller program, but pricing is "contact sales"). **AutoCheck (Experian)** only at scale.
- **Carfax-grade ACCIDENT data is nobody's to license cheaply** — it's Carfax/AutoCheck's proprietary moat. Our report is honest: title brands, salvage, odometer, theft, auction, recalls (NMVTIS essentials) at a fraction of Carfax's price. That's the same product the successful budget players sell.

---

## 4. Account + auth (LIVE)
- **Provider portal:** https://vehicledatabases.com/portal (login) — account under **davidskillett@hotmail.co.uk**, signed up 14 Jul 2026, **100 free trial credits**.
- **API key (trial):** `a92fd5527faf11f1b80c0242ac120003`  *(labelled "Sandbox" in the portal; it returns REAL data. Get a production key before launch.)*
- **Auth header:** `x-AuthKey: <key>`
- **Base URL:** `https://api.vehicledatabases.com`
- **Docs:** https://vehicledatabases.com/docs/api-documentation/{slug}/ (JS-rendered SPA). Credit-usage meter doc: /docs/credit-usages/.

## 5. Endpoints — LIVE-TESTED (14 Jul 2026)
⚠️ **Path quirk:** some endpoints have a `/v2/` version segment, others have **none**. Confirmed by testing:

| Purpose | Method + Path | Status | Response shape (confirmed) |
|---|---|---|---|
| **Market Value** | `GET /market-value/v2/{vin}` | ✅ 200 | `data.basic{make,model,year,trim}` + `data.market_value.market_value_data[0]["market value"][]` = array of `{Condition: Outstanding/Clean/Average/Rough, "Trade-In", "Private Party", "Dealer Retail"}` (KBB-style) |
| **Advanced VIN decode** | `GET /advanced-vin-decode/v2/{vin}` | ✅ 200 | full specs |
| **Title / salvage check** | `GET /title-check/{vin}` *(NO version)* | ✅ 200 | `{status, vin, data:{salvage: bool, salvage_details: []}}` |
| **Stolen check** | `GET /stolen-check/{vin}` *(NO version)* | ✅ | 200 with record; **400 "Record(s) were not found"** when clean |
| **Auction history** | `GET /auction/{vin}` *(NO version)* | ✅ | 400 "Record(s) were not found" when none |
| **Recalls** | `GET /vehicle-recalls/{vin}` *(NO version)* | ✅ 200 | `data.recall[]` = `{campaign_id, recall_no, recall_date, component_affected, summary}` (detailed) |
| **Sales history** | `GET /sales-history/{vin}` | ❌ 404 | **path wrong — fix from docs** (doc slug is `sales-history`; try alternates / read /docs/api-documentation/sales-history/) |
| **Credit meter** | `GET /info` | ❌ 503 | was down at test time; retry — this is how you read remaining credits |

**A full history report = ~4-5 calls** (title-check + stolen-check + auction + recalls + sales-history) assembled into one report. **There is no single "history report" endpoint.**

**Full service slug list** (from docs nav, for reference): basic-vin-decode, advanced-vin-decode, europe-vin-decode, license-plate-ocr, vin-ocr, us-plate-decode, us-truck-plate-decode, vin-suggestions, vin-information-decode, electric-vehicle-specifications, motorcycle-decoder-by-vin, motorcycle-decode-by-ymmt, premium-plus-by-ymmt, ymmt-specifications, auction, market-value-by-vin, market-value-by-ymmt, sales-history, owners-manual-by-vin, stolen-check, vehicle-recalls, title-check, vehicle-maintenance, vehicle-repair, vehicle-warranty.

### Curl examples
```bash
KEY="a92fd5527faf11f1b80c0242ac120003"; H="x-AuthKey: $KEY"; B="https://api.vehicledatabases.com"
curl -sS "$B/market-value/v2/1HGCM82633A004352" -H "$H"     # valuation
curl -sS "$B/title-check/1HGCM82633A004352" -H "$H"          # salvage/title
curl -sS "$B/stolen-check/1HGCM82633A004352" -H "$H"         # theft
curl -sS "$B/vehicle-recalls/1HGCM82633A004352" -H "$H"      # recalls
```

## 6. Accuracy test (5 real VINs, live)
Valuation returned real, varied, sensible KBB-style values (private-party, "clean"):
| VIN | Vehicle | Private-party |
|---|---|---|
| 1HGCM82633A004352 | 2003 Honda Accord 2.4 EX | ~$2,989 |
| 1FTFW1ET5DFC10312 | 2013 Ford F-150 XL 4x4 | ~$8,641 |
| 1G1YY22G965105073 | 2006 Chevrolet Corvette | ~$13,017 |
| 5YJ3E1EA7HF000337 | 2017 Tesla Model 3 Long Range | ~$13,920 |
| JH4KA7561PC008269 | 1993 Acura Legend L | ~$5,616 |

Recalls returned detailed real data (e.g. F-150 transmission recall 19V075000). Title/stolen/auction returned "clean" (all 5 were clean-titled). **NOT yet tested:** a known-salvage / known-stolen VIN to confirm it correctly FLAGS bad cars — do this before trusting the history product.

## 7. Costs & unit economics
- **Live credit meter (`/info`) was down (503)** and there's **no credit info in response headers**, so exact credits-per-call is UNCONFIRMED. Read it from the portal dashboard (started at 100 credits) or retry `/info`.
- **Structural estimate:** free valuation ≈ **1 credit**; full history ≈ **4-5 credits** (one per sub-check). At Vehicle Databases' **~$0.05-0.25/credit** (PAYG $125-5,000 = $0.25→$0.10/credit; subscription $100-2,500/mo = $0.20→$0.05/credit):
  - **Valuation ≈ $0.05-0.25 each**
  - **Full history report ≈ $0.20-1.25 each**
- **Margins:** sell the report at **$9.99** → ~90-97% gross margin. Data is a rounding error.

## 8. The "free valuation could bleed money" problem — SOLVED
Dave's key concern: if lots use the free valuation and few buy, the per-call cost leaks.
- **History NEVER leaks:** call the history endpoints **only after payment** → its cost is always covered by the sale.
- **Free valuation is the only thing that could accrue cost.** Fix it:
  1. **Cache valuations** by year/make/model/trim/mileage-band/region — repeat lookups cost $0 (high hit rate on popular cars).
  2. Optionally show a **rougher free estimate** (or a build-your-own model on MarketCheck listings at ~$0.005/call) as the hook, and reserve the premium Vehicle Databases valuation for the **paid report**.
  3. **Ads + leads** on the free page cover the few cents regardless.
- Net: **no scenario where free traffic bankrupts you.**

## 9. Product & pricing
- **Free:** quick value estimate (cached), VIN decode/specs (vPIC), open recalls (NHTSA), safety ratings (NCAP), fuel economy/running cost (EPA), "how many like it are for sale / typical range."
- **Paid $9.99 (one-time):** full NMVTIS history (title brands, salvage, odometer, theft, auction) + recalls + the detailed KBB-style valuation (condition tiers × private/dealer/trade).

## 10. Monetisation (beyond the report)
Auto-intent traffic monetises well: **sell-your-car affiliates (Carvana, Peddle, CarMax — pay per lead), auto-insurance + finance lead-gen, and display ads.** Free valuation → route to these + upsell the $9.99 report.

## 11. Compliance / must-do
- **Get Vehicle Databases' consumer-facing resale permission in writing** before launch (the VinAudit lesson — don't assume). Their marketing says white-label resale is allowed; confirm the "display as-is" clause + that bulk-DB resale (forbidden) isn't what we're doing.
- Move to a **production API key** (current one is the trial/sandbox key).
- Standard: privacy policy, terms, "not affiliated with Carfax/KBB," honest "essentials, not accident-level" framing.

## 12. Tech stack (per Dave's defaults)
Next.js 16 App Router + ISR, TypeScript strict, Tailwind, Vercel. Valuation cache in Postgres (Supabase/Neon). VIN input → vPIC decode (free) → cached/VDB value → free page; paid unlock calls the VDB history stack post-payment (Stripe).

## 13. Open items / immediate next steps
1. **Confirm exact per-call credit cost** — read portal dashboard credit balance (started 100; ~13 test calls made) or retry `/info`.
2. **Test a known-salvage + known-stolen VIN** to prove the history flags bad cars (currently only clean cars tested).
3. **Fix the `sales-history` endpoint path** (404'd; get correct path from /docs/api-documentation/sales-history/).
4. **Get written consumer-resale confirmation** from Vehicle Databases.
5. **Build the valuation cache** (the money-leak fix) before opening the free tool to traffic.
6. Buy/confirm carworthit.com domain, scaffold, wire vPIC + VDB, Stripe for the $9.99 report.

## 14. Competitor context (for positioning)
- Free + lead-gen: KBB, Edmunds, CarGurus (~$900M rev, IMV built from listings), TrueCar, iSeeCars.
- Paid history: Carfax (~$45), AutoCheck (~$25), Bumper/EpicVIN ($1-40). Position carworthit as: **free honest market-data valuation + a $9.99 essentials history report** — cheaper than Carfax, more transparent than the guidebooks.
