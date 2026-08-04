# CarWorthIt: Master Build Plan

*Compiled 4 August 2026. Supersedes `CARWORTHIT-BUILD-PLAN.md` (14 July) entirely. Sits alongside `BACKLINKS-AND-AUTHORITY-HANDOFF.md` (4 August), which is an authority/links plan, not a build plan, and alongside the authoritative 3 August product plan held in memory as `carworthit_plan_2026-08-03`.*

*Everything in section 1 was verified against the repo and the live site on 4 August 2026. Nothing in section 1 is quoted from another document.*

---

## 0. What the handoff document is, and what it is missing

`BACKLINKS-AND-AUTHORITY-HANDOFF.md` is 724 lines and roughly 70% of it is CarCostCheck. It is a good document and its CarWorthIt sections (5.1 to 5.5) are accurate. But it answers "how does this site earn authority", not "how does this site get built and start taking money".

It is missing three things a build plan needs:

1. **No data-supply decision.** It repeatedly says "checkout disabled" is a blocker but never says what the site should sell or where that data comes from. The 3 August product plan answers that; the handoff does not reference the answer.
2. **No engineering sequence.** It lists "add query logging" as the highest-priority item but does not say what the database is, what the schema is, or where it plugs in.
3. **It defers the one thing that unblocks everything.** Its own logic is circular: no PR until checkout works, no checkout until the product settles, and it does not schedule the product work.

This plan fills those gaps. The link strategy in sections 5.3 to 5.5 of the handoff is adopted wholesale and not repeated here.

---

## 1. Verified current state (checked 4 August 2026)

**Live:** carworthit.com returns 200 on `/`, `/pricing`, `/sitemap.xml`. Title renders. Site is up.

**Repo:** `C:\Users\daves\claude\carworthit`, remote `skillettsites/carworthit`, production branch **`master`**. Last commit `8ea8bac` "Add About page for trust and E-E-A-T". Three research `.md` files and `qa-harness.ts` are untracked.

**Stack:** Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind 4, Stripe 22.3.1, `@react-pdf/renderer`. That is the entire dependency list.

**No database.** `package.json` has no Supabase, Prisma, Postgres, Drizzle, Mongo or Redis. There is no client anywhere in `src/`. **Zero query data has ever been captured.**

**Only two API routes:** `src/app/api/checkout/route.ts` and `src/app/api/plate/route.ts`.

**Both kill switches are off** in `src/lib/constants.ts:5-6`: `CHECKOUT_ENABLED = false`, `PLATE_ENABLED = false`. The site cannot take money.

**The product line in code is the one the 3 August plan kills.** `constants.ts:20-24` still defines `valuation` $2.99, `history` $6.99, `bundle` $8.99. The history report has no legal affordable supply and is supposed to be removed.

**The wrong Carfax price is in the site metadata, not just the articles.** `constants.ts:12-13` `SITE_DESCRIPTION` hardcodes *"the essential checks Carfax charges $44.99 for"*. The handoff flags six articles; this is a seventh occurrence and it is the sitewide meta description.

**Data layer is still Vehicle Databases.** `src/lib/vehicledatabases.ts` (344 lines) is the live paid path, called from `src/app/report/[vin]/page.tsx:57-60`. `src/lib/valuation.ts` and `src/lib/vinaudit.ts` are 3-line and 4-line deprecation shims. The 3 August plan pivots supply to OneAuto US / Carketa and says explicitly **do not buy the Vehicle Databases $375 plan**. That pivot is not started.

**Env (`.env.local`, gitignored, verified at `.gitignore:34`):** `VEHICLEDATABASES_KEY` (sandbox), `STRIPE_SECRET_KEY` + publishable (live), `NEXT_PUBLIC_SITE_URL`, `EIA_API_KEY`. **There is no `ONEAUTO_API_KEY` in this project.** CarCostCheck has one.

**Content:** 42 articles in `src/content/articles.json`. 28 are `[make]-[model]-common-problems` or best-of listicles, 14 are VIN/history explainers. **Zero diminished-value articles.** The wedge the entire strategy rests on has no content at all.

**Missing pages:** no `/press`, no `/methodology`, no named human analyst on `/about`, no `media@` address.

**Still present:** `src/app/llms.txt/route.ts`, which hardcodes prices that are about to change.

**Reusable asset found:** CarCostCheck has a working OneAuto client at `carcostcheck/src/lib/apis/oneauto.ts`. Pattern is `https://api.oneautoapi.com/{provider}/{service}/v{n}?params` with an `x-api-key` header, and it handles OneAuto's habit of returning HTTP 206 with the real error in the body. Port this rather than writing a new client.

---

## 2. The strategy this plan builds to

Taken from the 3 August product plan, which is authoritative and which I am not reopening.

**The core tension:** the tier CarWorthIt can supply best (valuation) is the one nobody buys, because KBB, Edmunds, Carvana and CarMax all give it away free. The tier Americans do buy (history) cannot be supplied legally and affordably, and its floor price is $0 from Carsforsale.com.

**The resolution:** valuation is the front door and the brand promise. It is also sold, at $2.99, as the entry rung of a ladder (see the decision below).

### Decision, 4 August: the valuation is paid at $2.99, not email-gated

Dave's call, overriding the 3 August plan on this one point. The reasoning holds up better than that plan allowed:

1. **It removes an unverified assumption rather than adding one.** Email-gating trades a certain $2.28 of profit for a lead worth an unknown amount. The only figure anyone has is $2 per lead for Carvana, which is single-sourced and unverified (open question 5). Charging is the option that does not rest on a guess.
2. **The data cost can never leak.** At $0.32 a call the whole objection to a free valuation was that it fires on unqualified visits at $320 per 1,000 with no revenue. A paid call is covered by definition. This is the safest unit economics available.
3. **There is a working precedent in the same hands.** CarCostCheck sells a £2.99 valuation inside a £4.99 / £6.99 ladder and turned over £3,038 in 28 days. The structure is proven; only the market is different.
4. **It creates the ladder.** $2.99 valuation to $6.99 Worth-It report to $29 DV report. Without a paid entry rung there is nothing to upsell from.

**The risk that does not go away:** demand. KBB is free at 13.3m visits a month, Edmunds is free with no signup, and Carvana and CarMax give real offers. No paid US consumer valuation product currently exists. That is unchanged by pricing it well, and it is what G3 tests.

**⚠️ The claim needs substantiating before it is made.** "The most accurate valuation around" is an objective superiority claim about a competitor, which under FTC advertising rules needs evidence in hand before publication, not after. We do not have that evidence yet. What is defensible today is the mechanism, not the ranking: Carketa prices from VIN plus mileage plus ZIP against comparables from 60,000+ dealers, where KBB is year/make/model/trim driven and asks a stack of questions. Say what it does differently. **G1 becomes the gate on the pricing claim as well as the product**: if the Corvette test does not show Carketa beating the alternatives, we sell it on being VIN-native and local, not on being the most accurate.

**The number that decides everything.** To clear $500/month profit at a 3% click-to-sale rate:

**The number that decides everything.** To clear $500/month profit at a 3% click-to-sale rate:

| Product | Profit per sale | Clicks per month needed |
|---|---|---|
| $2.99 valuation | $2.28 | 7,300 |
| $6.99 worth-it report | $5.98 | 2,800 |
| **$29 diminished value report** | **$27.21** | **620** |

A 12x difference in required traffic, purely from price per sale. For a site with no authority on a 12-month ramp, that decides the strategy on its own.

**Target product line:**

| Tier | Price | Data cost | Status |
|---|---|---|---|
| Free VIN report (specs, recalls, safety, running costs) | $0 | $0 | Live, keep |
| **Valuation** (Carketa, VIN + mileage + ZIP) | **$2.99 paid** | $0.32 | Build. Entry rung |
| Worth-It Report (value + MSRP + options + above/below market) | $6.99 | $0.51 | Build |
| Diminished Value Report | $29 | $0.65 | Build, phase 2 |
| History report | — | — | **Remove** |
| Bundle | — | — | **Remove** |

The valuation must be gated somehow: at $0.32 a call, serving it to every visitor costs $320 per 1,000 visits with zero revenue. Per the 4 August decision above, the gate is a $2.99 charge rather than an email.

**Traffic strategy:** "is this car worth it" is the promise, not the keyword (50 searches a month). The traffic is `kelley blue book vin lookup` (14,800/mo at only M52 competition) and `price my car by vin` (14,800, H77). Carketa is VIN + mileage + ZIP native, so the site can do in one step what people are already searching for KBB to do. That is a real product gap, not a positioning claim.

**Channel:** AI citation, because it does not weight domain age the way Google ranking does. CarCostCheck earned £884 over 60 days from AI-attributed traffic, 15.5% of revenue, from exactly one tactic: neutral, honestly-priced comparison articles. CarWorthIt has six of these already, all publishing wrong prices.

---

## 3. Blockers only Dave can clear

These gate Phase 1. Everything in Phase 0 proceeds without them.

| # | Blocker | Action | Why it matters |
|---|---|---|---|
| **B1** | **OneAuto US services are not enabled** | Portal login, `Account > Your Plan`, change United Kingdom to United States, toggle on: Carketa Market Pricing, VIN Decode Plus (US), Plate to VIN (US), Image Search. Only Dave has portal access | Nothing paid can be built or tested without it |
| **B2** | **OneAuto account is at its credit ceiling** | 1 Aug invoice **£958.14** against a **£950 ex-VAT** limit. Request a limit raise before adding a US spend line | A new spend line on a maxed account will fail, and it will fail on CarCostCheck first, which is the £3k/month site |
| **B3** | **Stripe live secret key was pasted into a chat transcript** | Roll it in the Stripe dashboard, update `.env.local` and the Vercel production env | Live key, live account (`acct_1U0cQ4IeNG3uNMwY`, charges and payouts enabled) |
| **B4** | Two questions for Rebecca at OneAuto | (a) Is Carketa Market Pricing licensed for **B2C consumer display and resale**? (b) Does "Per Result" billing mean charged only when data returns, or charged per record? | (a) is a legal gate on the whole paid line. This is the exact question that was not asked of VinAudit, and the answer was no |

**B4 is the one to send first.** It costs nothing, it takes a day to come back, and a "no" on (a) invalidates Phase 1 entirely. It is the same question whose absence killed the VinAudit route in July.

---

## 4. Phase 0: foundations (this week, £0, no external dependencies)

Everything here is unblocked and should ship as **one deploy** at the end of the phase, not seven.

### 0.1 Query logging (highest priority item on the whole plan)

Every day without this is a day of lost data, and it gates six of the story angles in the handoff plus any future "our data shows" pitch.

- Add `@supabase/supabase-js`. Use the **existing Supabase Pro project** (`noxczmrnyyosgvvjlqca`, already paid for) with `cwi_`-prefixed tables rather than a new project, which is £0 and live today.
- Tables:
  - `cwi_lookups`: `id, created_at, vin_hash, year, make, model, trim, body, state, mileage, referrer, utm_source, user_agent_class`
  - `cwi_leads`: `id, created_at, email, vin_hash, product_interest, source_path`
  - `cwi_purchases`: `id, created_at, stripe_session_id, product, amount_cents, email, vin_hash`
- **Store a hash of the VIN, not the VIN.** A VIN is arguably personal data tied to a vehicle; the aggregate analysis only ever needs year/make/model/state/mileage. Hashing removes the retention question entirely without losing a single story angle.
- Insert on every `/report/[vin]` render, server side, fire-and-forget so it can never slow or break the page.
- Service-role key server-only, never `NEXT_PUBLIC_`.

### 0.2 Fix the wrong competitor prices

Seven places, not six: the six comparison articles **plus `constants.ts:12-13`**.

Reported correct figures are Carfax **$49.99** (site says $44.99) and AutoCheck **$29.99** with the 25-report pack discontinued (site says $25 with a pack). **Both are currently single-sourced through a text proxy and unverified**, because carfax.com 301-redirects to carfax.eu from a UK IP. Verify from a genuine US IP before editing. A wrong number is worse than a stale one, and this whole exercise exists because a model that cites you and gets burned stops citing you.

Rewrite the sentences so they do not hardcode a competitor's price where a range or "around $50" carries the same argument. That removes the recurring maintenance liability.

### 0.3 Delete `src/app/llms.txt/route.ts`

Google's documentation (updated 10 July 2026) says such files neither harm nor help because Search ignores them. No AI system uses them. It hardcodes prices that are about to change. Delete the route.

**Keep `src/app/robots.ts` exactly as it is.** GPTBot, OAI-SearchBot, ChatGPT-User and PerplexityBot are all explicitly allowed with `Disallow: /report/`. That posture is the AI-citation channel and blocking it would kill the only channel available to a no-authority site.

### 0.4 Three new pages

- **`/methodology`** — the single clearest lesson from CarEdge: editors will link a methodology page as sourcing and resist linking a commercial tool page. Two of CarEdge's four trade placements linked methodology specifically. Content: exactly which data comes from NHTSA vPIC, NHTSA recalls, NCAP, EPA fueleconomy.gov and the commercial pricing feed; what is measured versus estimated; how the ownership-cost model works (currently national averages in `src/lib/report.ts:10-32` and it must say so); update cadence.
- **`/press`** — `media@carworthit.com`, a named analyst with a real bio and a job title, a one-paragraph company description, a big round number for the methodology line, and downloadable assets. Every journalist platform and every data study needs a quotable named human. CarEdge, Bumper and iSeeCars all have this page; it is the cheapest item on the list.
- **`/about` rewrite** — add the named human. Currently no person, no bio, no editorial policy.

### 0.5 Email capture, demoted to a recovery tool

The valuation is now sold, so email capture is no longer the gate. Keep `cwi_leads` and build a much smaller version: an optional "email me this valuation" tick on the Stripe checkout, plus an abandoned-checkout capture. That is worth having and costs almost nothing, but it is no longer on the critical path and must not delay the deploy.

Needs a plain-English privacy line and nothing pre-ticked.

### 0.6 Free directory listings (about an hour, £0)

US-relevant and verified followed: **Launching Next** (dofollow, no `rel` at all) and **Fazier** (verified followed, 79 `noopener`, zero `nofollow`). Then Product Hunt, AlternativeTo and SaaSHub for the branded-anchor baseline rather than for equity.

**Refuse any launch directory that requires a reciprocal footer link.** That is a link exchange and it is named in Google's spam policies. Check Fazier's current terms before submitting.

Skip FreeIndex and Hotfrog: both are UK directories and this is a US site.

**Do not create a Google Business Profile.** Google's eligibility rules exclude online-only businesses, and the stated consequence is suspension of the Business Profile **and/or the Google Account**, which is the account holding Search Console, GA4 and Ads.

### 0.7 Housekeeping

Commit the three untracked research docs and `qa-harness.ts`. Commit as the authorised identity or the deploy will be blocked:

```
git -c user.name="skillettsites" -c user.email="davidskillett@hotmail.co.uk" commit ...
```

Push to **`master`**, not `main`.

---

## 5. Phase 1: the paid product line (blocked on B1 and B4)

### 1.1 Port the OneAuto client

Copy `carcostcheck/src/lib/apis/oneauto.ts` to `carworthit/src/lib/apis/oneauto.ts` and strip the UK Experian AutoCheck types. Keep the error handling: OneAuto returns HTTP 206 with the real reason in the body, so parse first and decide after. Add `ONEAUTO_API_KEY` to `.env.local` and to Vercel production.

**Confirm the actual US endpoint paths from OneAuto's docs once the services are toggled on.** The UK client only proves the base URL, the header name and the response envelope. Do not guess the Carketa or VIN Decode Plus paths.

### 1.2 Validate Carketa before building anything on it

Run the eight VINs in `qa-harness.ts` through Carketa **with real mileage and ZIP**, and compare against the recorded Vehicle Databases numbers and against KBB. Cost about £1.60.

**The 2006 Corvette is the test case.** Vehicle Databases priced it roughly 40% low because it accepts no mileage or ZIP input at all. If Carketa does not fix that, the $6.99 report has no reason to exist and Phase 1 stops here.

### 1.3 Rewrite the product line

- `constants.ts`: remove `history` and `bundle`. Keep `valuation` at **$2.99**. Add `worthit` at $6.99. Add `dv` at $29 in phase 2.
- **Watch the Stripe fixed fee on the $2.99 tier.** US Stripe is 2.9% + $0.30, so $0.39 of a $2.99 sale is fees, roughly 13%. Profit is $2.28 after data. That is fine, but it is the strongest argument for pushing the $6.99 upsell hard on the report page, where the same $0.30 is spread over more than twice the revenue.
- Update `/pricing` and `/sample-report` to match.
- Replace the Vehicle Databases call path in `src/app/report/[vin]/page.tsx:57-60` with Carketa plus VIN Decode Plus.
- Leave `src/lib/vehicledatabases.ts` in place but unreferenced until Carketa is proven, then delete it along with the two shim files.
- **Do not buy the Vehicle Databases $375 plan.** It needs 162 sales to repay, which at realistic volumes is 300+ months, and it bans resale and carries a no-competing-services clause.

### 1.4 Enable checkout

`CHECKOUT_ENABLED = true` **only after 1.2 passes and B4 comes back clean.** Add a Stripe webhook writing to `cwi_purchases`. Test end to end with a real card.

This is the point at which the site is "up and working" in the sense the question asked. Everything before it is preparation and everything after it is growth.

### 1.5 Leave `PLATE_ENABLED` off for now

Plate to VIN is 5p a call and it is a nice-to-have, not a revenue path. Turn it on once the paid line is stable.

---

## 6. Phase 2: the wedge (weeks 2 to 8, £0)

This is the test the entire project lives or dies on, and it costs nothing.

**Publish five to eight diminished-value articles** through the existing `src/content/articles.json` pipeline: what diminished value is, how to file a claim, a DV calculator, DV by state (Georgia alone is 260 searches a month), does an accident lower value, selling a damaged car.

**Content must be state-aware.** Some states bar first-party DV claims entirely, and a page that tells someone in the wrong state to file a claim they cannot file is both wrong and a liability.

**Why DV:** it is the only cell green on both axes of the rankability-versus-value matrix. 15,000 to 20,000 searches a month, M41 to M59 competition, $8 to $11 CPC, and completely unserved by KBB, Carfax, Edmunds and CarGurus. Average claim is $5,000 to $6,000 and appraisers charge $350 to $699, so a $29 report is trivially justified. It also fits the domain name: is your car still worth it after a crash.

**Compliance guardrail.** The site already has about 40 near-templated `[make]-[model]-common-problems` posts. Mechanically generating 50 states multiplied by N models is scaled content abuse, which is named directly in Google's spam policies alongside doorway pages, and it is a bigger risk to this site than anything in link building. Each state page must carry genuinely different data (that state's DV claim law, its statute of limitations, its first-party position) or it must not be built.

**Also in this window, and this is the item most likely to be dropped:** retarget the existing page titles and H1s at `kelley blue book vin lookup` and `price my car by vin`. The traffic thesis is worthless if no page targets the queries.

**Success test: diminished-value impressions appearing in Search Console within six to eight weeks.** Not clicks. Impressions.

---

## 7. Phase 3: authority assets, built now, pitched later

Build during Phase 2 so they are ready the moment checkout goes live. Do not pitch anything yet, because coverage is a one-shot asset and you cannot re-pitch the same story.

**The state-ranking study (the Bumper play).** Bumper owns no proprietary data either, and one URL, a 50-state ranking built entirely from free federal data, earned links from Newsweek, Jalopnik, MotorTrend, Electrek, CleanTechnica, Deseret News and Business Insider. The mechanism is that 50 states manufacture 50 separately pitchable local angles from one dataset, and it re-cuts annually.

Best available angle: **"The Most Stolen Car in Your State"**, from FBI Crime Data Explorer 2025 divided by FHWA registrations. NICB killed its 50-state "Hot Wheels" file after 2021 and now publishes top-ten tables only, so this fills a gap that a major body vacated. "Per 1,000 registered" beats NICB's raw counts methodologically. The FBI data is free, keyless and monthly.

**Structure it the iSeeCars way, which costs nothing and compounds:** one evergreen URL per topic, versioned by fragment (`#v=2026`), `dateModified` bumped annually and re-pitched on each refresh. Never dated blog posts. Years of link equity land on one URL instead of scattering.

**Known data traps that will each waste a day:** `FLAT_RCL.zip` is 404, use the pre-2010 and post-2010 files. vPIC bulk downloads are at `/downloads/`, not `/api/downloads/`. `DRUNK_DR` does not exist in FARS 2023 or 2024, use `DR_DRINK`. CRSS has no state, county or city fields, so any CRSS-based state ranking is invalid, use FARS. A Census API key is now mandatory. data.gov's CKAN API is removed. fueleconomy.gov returns XML unless you send `Accept: application/json`. NHTSA, BLS, BTS and NICB all 403 automated fetchers, so send a browser user agent with a contact email. IIHS forbids commercial republication; FARS is public domain.

**Do not cite NHTSA's odometer-fraud dollar figure.** Their page currently shows "$1.06M" where "$1.06 billion" belongs.

**LibGuides outreach** is the single most uncontested route found. Thousands of US libraries run the same template with a named librarian and an "Email Me" button, the Library of Congress guide links KBB, Edmunds, TrueCar and Carfax, and `site:libguides.com` returns nothing for all seven competitors. Completely open ground, zero cost.

**Free journalist platforms:** HARO (free for all users, relaunched by Featured.com after Cision sold the brand in April 2025), Connectively free tier (includes one bylined article a month), Featured free tier, Source of Sources. Pitch under "Business and Finance", there is no automotive category. Never ask for a link in a HARO pitch, it breaches their guidelines and repeated "No" ratings get you quarantined.

**Add `sameAs` to the Organization schema only once real profiles exist** (Trustpilot, X, LinkedIn). It is currently absent, which is correct. **Do not copy CarCostCheck's pattern**, which lists 13 unrelated sites and therefore asserts that CarCostCheck *is* PostcodeCheck.

---

## 8. Phase 4: only if the wedge ranks (month 3+)

In order: ship the $29 DV report, then pitch.

Approach **Scripps and Nexstar about a content partnership, not a press release**. The followed links on KTLA and WCPO are real, but the iSeeCars byline there resolves to a Nexstar contributor profile, so that is a syndication relationship rather than earned pickup. One pitch to the Scripps national consumer desk (`jmatarese@wcpo.com`) yields many station URLs; a single Carfax odometer segment ran on WTVR, KGUN9 and KERO.

Pitch the mid-tier outlets that verifiably give followed links: AutoWeek, Electrek, MotorTrend, CleanTechnica, Torque News, CarScoops, Motor1, Automotive News, Auto Remarketing. **Do not chase Forbes, Fox Business, Business Insider, Newsweek or The Drive**, all verified nofollow.

Highest-value single named target: **Jamie L. Lareau**, Detroit Free Press and USA Today, who wrote both verified USA Today iSeeCars pieces.

`iseecars.com/news-coverage` runs to 12 pages and was scraped to 529 press URLs across 214 domains. That is a free, complete prospect list for the entire niche, published by the market leader. Start there.

**Anchor text stays 100% branded.** "CarWorthIt", "a study by CarWorthIt". Zero commercial-keyword anchors.

**Then and only then**, lead-gen to DV appraisal firms (best value per lead, but it is unverified that they buy leads at all) and affiliates to Peddle, CarBrain and Wheelzy.

**Never** run the $1-trial-into-subscription model that Bumper and EpicVIN use. It works commercially, it generates "scam" and "cannot cancel" reviews, and the FTC has an open Negative Option rulemaking.

---

## 9. What this costs

| Item | Cost |
|---|---|
| Supabase | £0, Pro already paid |
| Vercel | £0, Pro already paid |
| Domain | £0, owned |
| Carketa validation, 8 VINs | ~£1.60 |
| Directory listings, journalist platforms, LibGuides | £0 |
| Federal data for the study | £0 |
| Per-sale data cost at launch | $0.51 on a $6.99 sale, $0.65 on a $29 sale |
| **Total to reach "taking money"** | **about £2 plus time** |

**Do not spend on:** Vehicle Databases' $375 plan, US digital PR agencies, ResponseSource (£625 per category, UK-only anyway), or any "dofollow DR 60+" offer.

**NMVTIS is a background option, not a plan.** Becoming an approved provider is quoted at figures ranging from $1,000 + $30,000 to $125,000 across two conflicting sources, the reseller wording says "owned by", the one obvious partner has already refused in writing (VinAudit ticket #760890), the governing terms are unpublished, and an approved competitor gives the product away free. Send the three emails in `NMVTIS-RESELLER-ROUTE.md` section 5, cost £0, then close it or revisit. **It must not block anything above.**

---

## 10. Decision gates

| Gate | When | Test | If it fails |
|---|---|---|---|
| **G1** | Phase 1 step 1.2 | Carketa prices the 2006 Corvette sensibly with mileage and ZIP, and beats KBB and the old VDB numbers on the other 7 VINs | Nothing is sellable on accuracy. Drop the superiority claim, sell on VIN-native and local instead, and reconsider whether the $2.99 tier stands at all |
| **G2** | B4 response | Carketa is licensed for B2C display and resale | No paid line is possible. This is the VinAudit failure repeating, and the whole paid strategy ends |
| **G3** | 8 weeks (early October) | Diminished-value impressions appear in Search Console | Wedge closed. Park the domain. **Do not pivot again** |
| **G4** | 6 months (February 2027) | Organic clicks above 200/month | Content alone cannot solve the authority problem at this budget |

**The honest argument against all of it:** CarCostCheck earned £3,038 in the last 28 days on identical skills, and its OE service-history tier has a verified £6.99 to £9.99 market with no mainstream UK competitor. The opportunity cost is the strongest case against CarWorthIt, which is why this plan is deliberately cheap and time-boxed rather than abandoned. The site is three weeks old and has cost almost nothing.

---

## 11. Open questions, listed so nobody treats them as settled

1. **Carfax and AutoCheck current US prices.** Blocked by geo-redirect from a UK IP. Verify on a US IP before editing anything.
2. **Is Carketa Market Pricing licensed for B2C consumer display and resale?** Unanswered. Gates the entire paid line (B4).
3. **Does OneAuto "Per Result" billing charge only when data returns?** Unanswered. Changes the unit economics of the free-tier gate.
4. **Do diminished-value appraisal firms buy leads?** No published figures exist anywhere. The best-value monetisation route in Phase 4 rests on an assumption.
5. **What a CarWorthIt email address is actually worth.** The $2-per-lead Carvana figure is single-sourced and unverified.
6. **The correct Carketa and VIN Decode Plus endpoint paths.** Only the base URL, header and envelope are known from the UK client.
7. **What drove the OneAuto July to August jump** (£756.00 to £958.14). That is a CarCostCheck cost line, but it is the account CarWorthIt would be adding to.
8. **The exact publication year of NHTSA's 450,000-vehicle odometer-fraud figure** before making "24 years old" a headline.

---

## 12. Immediate next actions

**Dave, today, about 15 minutes:**
1. Enable the five US services in the OneAuto portal (B1).
2. Email Rebecca the two licensing questions (B4). Send this first, it has the longest lead time and the biggest consequence.
3. Request an OneAuto credit-limit raise (B2).
4. Roll the Stripe live secret key (B3).

**Me, this week, no dependencies:**
5. Supabase tables plus query logging on `/report/[vin]`.
6. Verify Carfax and AutoCheck prices on a US IP, then fix all seven occurrences.
7. Delete `llms.txt`; keep `robots.ts` untouched.
8. Build `/methodology`, `/press`, rewrite `/about` with a named analyst.
9. Wire the $2.99 valuation into the buy path (Stripe already handles it; `CHECKOUT_ENABLED` stays off until G1 passes).
10. Retarget titles and H1s at the VIN valuation queries.
11. One deploy at the end, committed as `skillettsites`, pushed to `master`.
