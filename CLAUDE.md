@AGENTS.md

# CarWorthIt project notes

US used-car valuation site (carworthit.com, apex; www 308s to apex via Vercel). Never target UK terms or link to carcostcheck.co.uk.

## Content built 15 Sep 2026 (159 sitemap URLs)
- Every fact page carries a "verified/checked <date>" line and per-row sources. Datasets: `src/content/state-fees.json` (51 states x 6 fee groups, each cell has source URL + verbatim quote + checked date; refresh quarterly, next due 15 Dec 2026; see `src/lib/state-fees.ts` header), `src/lib/vhr-providers.ts` (history-report prices, re-check on each provider's own site), `src/content/vin-tools/wmi.json` (WMIs pulled from NHTSA vPIC, never hand-typed), `src/lib/vin-tools/window-sticker.ts` (OEM sticker endpoints with verification status; children only where verified).
- Hubs: /vehicle-history-faq (first in llms.txt), /best-vehicle-history-report, /car-sales-tax-calculator (+51 state pages), /out-the-door-price-calculator, /dealer-doc-fee-by-state, /car-registration-fees-by-state, /negotiate-used-car-price, /title-check, /lien-check, /odometer-check, /stolen-vehicle-check, /vin-decoder/[make] x12, five vehicle-type decoders, /transmission-by-vin, /engine-by-vin, /vin-year-chart, /paint-code-by-vin, /window-sticker (+5 makes), /check-warranty-by-vin.
- 8 permanent redirects in next.config.ts consolidate thin duplicates; do not recreate the old slugs.
- Article bodies in `src/content/articles.json` are stored entity-escaped; the blog renderer decodes them. The 17 common-problems posts carry a NHTSA complaints table (built from api.nhtsa.gov) and `updated` dates.
- Honesty rules: not an NMVTIS provider, no history data, no affiliation claims; the free decode is vPIC and pages must not promise fields vPIC does not return.

## Ops
- Deploy = push master (Vercel). Commit as skillettsites / davidskillett@hotmail.co.uk.
- Submissions: IndexNow key `public/a3f9c7e21b8d4f6098e5c1a7d2b4f60e.txt` (Bing, no cap); Google Indexing API via the commandcenter service account (siteOwner on sc-domain:carworthit.com), ~10-12 URLs/day.
- Full-site QA script used for the 15 Sep launch: scratchpad `cwi/qa_all.py <base-url>` (sitemap 200s, titles, canonicals, JSON-LD, redirects, llms.txt, UK-term scan).
