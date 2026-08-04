# Backlinks & Authority: Complete Handoff
### CarCostCheck (UK) and CarWorthIt (US)

*Compiled 4 August 2026. Written to be handed to another AI or person with no prior context. Everything needed to execute is in this file. Where something is unverified, it says so explicitly rather than being smoothed over.*

---

## 0. Read this first

**What this document is.** A working plan for earning backlinks and authority for two car websites owned by the same person (Dave Skillett). It covers what actually works in 2026, verified against primary sources, and what to do in what order for each site.

**The two sites get deliberately unequal effort.** That is the central judgement in this document and section 2 explains why. Do not treat them as symmetrical.

**Evidence standard used throughout.** Every price, contact and policy claim was checked against a primary source on 3 or 4 August 2026. Claims that could not be verified are labelled `UNVERIFIED`. Do not upgrade an unverified claim to a fact without rechecking it.

**Security note.** No API keys, secret keys or credentials appear in this document, deliberately. CarWorthIt's Stripe live keys live in `carworthit/.env.local`, which is gitignored (`.env*` at `.gitignore:34`, verified). Never copy a secret key into a document, a memory file, a commit or a chat.

---

## 1. The two sites at a glance

| | **CarCostCheck** | **CarWorthIt** |
|---|---|---|
| Domain | carcostcheck.co.uk | carworthit.com |
| Market | UK | US |
| Repo | `C:\Users\daves\claude\carcostcheck` | `C:\Users\daves\claude\carworthit` |
| Age | Live since ~March 2026 | Live since ~13 July 2026 |
| Product | Free car check, £4.99 premium report, trade credit packs | Free VIN report, paid tiers under restructure |
| Stack | Next.js 16 App Router, TS strict, Tailwind, Vercel, Supabase | Same |
| Sitemap | ~22,000 URLs | 58 URLs |
| Indexed | ~43% as of 17 Apr 2026 (`STALE`, recheck) | Indexed, but ~1 lifetime click from 1,547 impressions |
| Revenue | £3,038 gross in 28 days to 2 Aug 2026, 533 sales, £5.70 AOV | £0. Checkout is disabled |
| Backlinks | Effectively zero | Effectively zero |
| Proprietary data | **Yes: 62.5m MOT tests** | **No.** All data is licensed or public |

**The single most important difference:** CarCostCheck owns a dataset nobody else has. CarWorthIt does not. That one fact drives the entire strategy split, because data is what earns links.

---

## 2. The decision: unequal effort, and why

**CarCostCheck gets the full link campaign. CarWorthIt does not, yet.**

Reasoning, from evidence rather than preference:

1. **CarWorthIt is three weeks old with no authority.** It has 1 lifetime click from 1,547 impressions and 3 impressions in the twelve days to 3 August. This is normal for a three-week-old domain, not a fault. Authority takes six to twelve months. Digital PR aimed at a site with no product to sell yet converts nothing.
2. **CarWorthIt cannot take money.** `CHECKOUT_ENABLED = false` and `PLATE_ENABLED = false` in `src/lib/constants.ts`. Driving press coverage to a site that cannot transact wastes the coverage, and coverage is a one-shot asset. You cannot re-pitch the same story.
3. **CarWorthIt's product line is mid-restructure.** The 3 August product plan removes the history report entirely (no legal affordable NMVTIS supply) and introduces a $29 diminished value report as the lead product. Pitching journalists on a product line that is about to change is a way to burn contacts.
4. **CarWorthIt has no proprietary data to pitch.** Its data is NHTSA, EPA and a paid commercial API. Every US competitor has the same public sources. There is no "our data shows X" story available until it builds one.
5. **CarCostCheck has all four of those things.** Real revenue, a working checkout, a settled product, and 62.5 million MOT tests nobody else can quote.

**One correction to point 4, added after later research.** Owning no proprietary data is *not* a blocker to data PR. Bumper.com owns none either and earned links from Newsweek, Jalopnik, MotorTrend, Electrek, Business Insider and others from a single 50-state ranking built on free federal data. See 5.3. The real blocker for CarWorthIt is that **it cannot take money yet**, so coverage would be wasted. Build the data asset now, pitch it after checkout works.

**So the split is:**
- **CarCostCheck:** full campaign. Data PR, named journalist outreach, the regional story, directories, journalist platforms.
- **CarWorthIt:** the cheap, high-leverage subset only. Fix the AI-citation errors, publish the wedge content, claim the free directory listings. **No press outreach until the wedge proves out and checkout is live.** Total spend: about £2.

This is a sequencing decision, not a judgement that CarWorthIt is unimportant. It is three weeks old and has cost almost nothing. Keep it on a low-effort, time-boxed track.

---

## 3. Shared playbook

Applies to both sites. Read before doing anything site-specific.

### 3.1 What actually earns links in 2026

Google's own position, from [Search Central, AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), quoted:

> "The best practices for SEO remain relevant for AI features in Google Search."
> "There are no additional requirements to appear in AI Overviews or AI Mode."
> "You don't need to create new machine readable files, AI text files, or markup to appear in these features. There's also no special schema.org structured data that you need to add."

There is no shortcut being withheld. What correlates with visibility, from the only large-sample study available ([Ahrefs, 75,000 brands, May 2025](https://ahrefs.com/blog/ai-overview-brand-correlation/)):

| Factor | Correlation with AI visibility |
|---|---|
| Branded web mentions | 0.664 |
| Branded anchors | 0.527 |
| Branded search volume | 0.392 |
| Domain Rating | 0.326 |
| Referring domains | 0.295 |
| Backlinks | 0.218 |

The authors' own caveat, which most people quoting this drop: correlation is not causation and all the correlations are moderate to weak. But the direction is consistent and useful: **being talked about off-site matters more than raw link count.** A brand mention with no hyperlink still has value for AI citation, which changes how you value nofollow coverage.

**`llms.txt` is not used by anyone. Delete CarWorthIt's and do not build one for CarCostCheck.**

- **Google's own documentation** (updated 10 July 2026) states such files *"neither harm nor help... as Google Search ignores them."*
- **John Mueller**, [reported by Search Engine Journal on 2 June 2026](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/): *"I don't think anyone knows, it's purely speculative for now (the file has existed for years, yet none of the AI systems use it, what does it mean?)."* Cite this as "reported by SEJ, 2 June 2026", not as a dated Mueller quote, because SEJ does not give the original comment date.
- **[llmstxt.org](https://llmstxt.org/) itself makes zero adoption claims** by OpenAI, Anthropic, Google or Perplexity. Verified directly.

**Action:** remove `carworthit/src/app/llms.txt/route.ts`. Beyond being ignored, it is an active maintenance liability because it **hardcodes product prices** that are about to change (see 5.2). A stale price in a machine-readable file is worse than no file.

**Keep `robots.ts` exactly as it is.** The explicit AI-crawler allowances are the part that demonstrably matters.

### 3.2 The followed versus nofollow reality

This was checked in raw HTML, not assumed. **It is the most commercially important finding in this document, because it changes what "success" means.**

**UK:**
- **Honest John:** followed. Verified `<a href="https://www.cargarages.co.uk/car-problems" title="CarGarages">` with no `rel` attribute.
- **Motoring Research:** followed. Verified `<a href="https://bookmygarage.com/">` with no `rel`.
- **All Reach plc titles** (Mirror, Express, BirminghamLive, Manchester Evening News, Liverpool Echo): `rel="nofollow"` at platform level.
- Across 15 verified Reach articles: linked to a commercial brand in 2 of 15 (both nofollow), named the brand without linking in 8 of 15, produced it in-house crediting nobody in 2 of 15.
- **Newsquest, National World and independent local radio give followed links.** This is why the regional campaign matters more than the national one.

**Plan accordingly:** Reach coverage is a brand-mention and AI-citation play. Newsquest, National World, Honest John and Motoring Research are the actual link targets.

### 3.3 Journalist request platforms, 2026 status

⚠️ **CORRECTION.** An earlier draft of this document said "HARO is dead". **That is wrong and is corrected here.** The accurate sequence: Cision rebranded HARO as Connectively, then **shut Connectively down on 9 December 2024**. On **15 April 2025 Cision sold the HARO brand to Featured.com** ([Cision press release](https://www.cision.com/about/press-releases/2025-press-releases/cision-announces-sale-of-help-a-reporter-out-haro-to-featuredcom-3)), which relaunched helpareporter.com. Featured then **also bought the Connectively name** and relaunched it as a sister platform on 2 June 2026.

**So HARO is alive, and free for all users.** Start there.

| Platform | Price (verified on live pricing page) | Verdict |
|---|---|---|
| **[HARO](https://www.helpareporter.com/)** | **FREE, all users** | ✅ **Start here.** Three digests a day, Mon to Fri. Outlet floor is DA 20+ or 10k visits. **No automotive category, so pitch under "Business and Finance."** ⚠️ Asking for a link breaches their guidelines; journalists now rate pitches Yes/No and repeated "No" gets you quarantined |
| **[Connectively](https://connectively.us/pricing)** | **Free tier**, then $11 to $59/mo annual | ✅ The free tier includes **one bylined article a month**, the most underrated free link mechanism on this list |
| [Featured](https://featured.com/pricing) | **Free forever** tier; Lite $29/mo; Pro $79/mo | Largest query volume, US-skewed. Free tier is a no-brainer for both sites |
| **Source of Sources** | **FREE** | ✅ Has a Business and Finance category. Donation funded |
| [Newspage](https://newspage.media) | **Free** (1 response/mo); Premium £49.99; Platinum £199.99 | **Strongest UK national signal.** BBC, Sky, ITV, FT, Telegraph, Mail, Sun. Skews personal finance, so pitch running costs / VED / EV costs |
| [PressPlugs](https://www.pressplugs.co.uk/) | 7-day free trial. `UNVERIFIED`: pricing published nowhere, `/pricing` 404s | Most UK-native daily feed of the cheap options |
| [Qwoted](https://qwoted.com/pricing) | Free (2 pitches/mo, 2-hour response delay); Pro $149/mo | Thin UK presence. Free tier only |
| [ResponseSource](https://www.responsesource.com/pr/pricing/) | From £625 + VAT per category per year | The genuine UK incumbent. A Motoring category fits exactly. Best paid option |
| [JournoLink](https://journolink.com/prices) | £59/mo Starter; £119/mo Unlimited | UK-native. Ignore the press-release distribution half |
| Muck Rack, Roxhill, Vuelio, Cision, Prowly | Quote-only | Agency-priced. Buy ResponseSource instead |
| SourceBottle | Free | Australia-focused. Skip |
| Help a B2B Writer | Gone, redirects to mentionmatch.com | Watch, do not rely on |

`UNVERIFIED`: `#journorequest` on X and Bluesky. Both blocked when logged out. Both are free, so check manually at zero cost.

**Does it still work?** Google's spam policies (last updated 15 May 2026) make no mention of journalist quotes or digital PR. What is named is paid placements, exchanges and press-release syndication. The mechanism is fine; the easy arbitrage is gone. Mass-answering generic queries with AI filler is what got devalued.

### 3.4 Directories that actually pass a link

Most UK directories now withhold the link on the free tier. **Only three were verified as giving a followed link in raw HTML:**

| Directory | Link type | URL |
|---|---|---|
| **FreeIndex** | **Dofollow, confirmed** | https://www.freeindex.co.uk/signup.htm |
| **Hotfrog UK** | **Dofollow, confirmed** | https://www.hotfrog.co.uk/add |
| **Launching Next** | **Dofollow, confirmed** (no `rel` at all) | https://www.launchingnext.com/submit/ |

Worth doing anyway, but not for equity: Trustpilot (do it for conversion), **Product Hunt** (verified `rel="noreferrer noopener ugc"`, which is **not** nofollow, but Google treats `ugc` in the same family, so expect little PageRank and real launch-day traffic), AlternativeTo (`rel="nofollow noopener"`), SaaSHub (verified `rel="nofollow"`).

**Two more verified followed and free, US-relevant:**
- **Hacker News (Show HN):** `/newest` links carry `rel="nofollow"`, but **front page and `/show` links have zero `rel`**. HN strips nofollow above a score threshold. A flop costs nothing; a hit is a followed link from a top-authority domain plus secondary coverage.
- **[Fazier](https://fazier.com/):** verified **followed**, 79 `noopener` and zero `nofollow` on a live launch page. Free, two-minute job. ⚠️ Check the current terms: some launch directories require a reciprocal footer link, which is a link exchange and must be refused.

⚠️ **Verified dead end:** SiteJabber is `rel="nofollow noopener"` **plus** an internal redirect, so it is double-killed.

**Notes:** Hotfrog blocks automated fetchers, so submit in a real browser. FreeIndex needs a landline and a mobile but lets you hide address line 1.

**Confirmed dead ends, do not spend time:** Thomson Local, UK Small Business Directory and Approved Business all explicitly withhold the website link on free tiers ("Website link is available when purchasing a backlink product"). Yell buries the free option. Enrol Business is dead (DNS failure). The entire UK motoring directory niche has collapsed: of 30 checked, motoringdirectory, motasearch, carpages, ukcarclubs, motorcodes and six others are DNS failures, and ukmotorists.com is a GoDaddy parking page despite still appearing in SEO listicles.

**Google Business Profile is not available to either site.** [Google's eligibility guidelines](https://support.google.com/business/answer/13763036) state: *"To qualify for a Business Profile, a business must make in-person contact with customers during its stated hours"*, and the ineligible list explicitly names *"Brands, organisations, artists and other online-only businesses."* Consequence: *"Failure to adhere to these policies may result in a suspension for the Business Profile and/or Google Account"*, which is the account holding Search Console, GA4 and Ads. Do not create one. Bing Places and Apple Business Connect fail on the same test.

### 3.5 Wikipedia: read before touching

Every Wikipedia external link is `nofollow`, verified in raw HTML as `rel="mw:ExtLink nofollow"`. Wikipedia's own guideline says outright that adding your site will not help SEO.

Do not add your own links. WP:ELNO item 5 excludes pages that primarily exist to sell products, and both sites have paid products. Adding a domain to three or more articles is textbook WP:REFSPAM and the escalation path ends at the Meta spam blacklist, which is permanent, cross-project and publicly searchable against the brand. **Neither `carcostcheck` nor `carworthit` is currently on the blacklist. Do not burn a clean slate.** The only legitimate route is declaring a conflict of interest and using `{{edit COI}}` on Talk pages. The fastest legitimate path to a Wikipedia citation is press coverage, not editing.

### 3.6 The story structure that actually gets picked up

Derived from reading every verified regional pickup. All seven beats were present in every successful example:

1. National hook with a big round number
2. Local flip by sentence three, naming the worst local place and its figure
3. A contrast pair with the gap quantified, ideally with distance ("six miles along the A58")
4. **A ranked table or list. Present in every single verified example, non-negotiable**
5. National extremes as colour, giving the desk a fallback headline
6. A named spokesperson with two quote blocks
7. A service payoff, i.e. the tool

Headline formulas that verified: `The [town] [test centres] where cars are most likely to fail` and `[National number] including [local number] in [town]`. **The brand never appears in the headline.** In every verified case it landed in paragraph two or three.

**Two tactics worth stealing:**
- **Branded charts beat hyperlinks.** [PlymouthLive](https://www.plymouthherald.co.uk/news/plymouth-news/plymouths-pothole-hotspot-revealed-thousands-10660666) embedded supplied infographics each carrying a `(Image: www.personalinjuryclaimsuk.org.uk/)` credit, which survived even though the piece contained no hyperlink anywhere.
- **Put the tool name inside the spokesperson quote.** MoneySuperMarket's expert named their MOT Fail Checker within a quote and it survived subbing, where a bare URL would not have.

### 3.7 Two Reach gotchas that cost competitors their links

1. **Whatever URL is in your email is what lands on the page.** BirminghamLive's carVertical story links via `https://u7061146.ct.sendgrid.net/ls/click?upn=...` because the journalist pasted the PR agency's HTML email straight in. carVertical's link equity went to sendgrid.net. **Put one clean, unwrapped URL in the pitch body. No UTM, no shortener, no email-tool tracking.**
2. **BirminghamLive's contact page has stale `mailto:` hrefs** still pointing at `@trinitymirror.com` addresses from before the 2018 rename. **Type the visible-text addresses; do not click the links.**

### 3.8 What not to do

From [Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies), last updated 15 May 2026. Link spam is defined as "creating links to or from a site primarily for the purpose of manipulating search rankings." Named violations that intersect with what you will be offered:

- Buying or selling links for ranking purposes, including exchanging money, goods **or services**
- *"Advertorials or native advertising where payment is received for articles that include links that pass ranking credit, or links with optimized anchor text in articles, guest posts, or press releases distributed on other sites"* (this one clause covers paid guest posts, sponsored roundups **and** press-release wires)
- *"Excessive link exchanges ('Link to me and I'll link to you') or partner pages exclusively for cross-linking"*
- Low-quality directory or bookmark site links
- Forum comments with optimized links in the post or signature
- *"Creating low-value content primarily for manipulating linking and ranking signals"*
- Automated link creation, widget links, widely distributed footer or template links

Also named in the same document: scaled content abuse, site reputation abuse (parasite SEO), and expired domain abuse.

**Concrete things to refuse:**
- Any "dofollow backlink, DR 60+" offer
- Any free tier that requires a reciprocal footer link (that is a link exchange)
- Press-release distribution wires bought for links
- Paid guest posts and "we'll add you to our roundup for £X" emails, which arrive constantly once outreach starts

Where paid or sponsored links are legitimate, qualify them per [Google's outbound link guidance](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links): `rel="sponsored"` for paid placements, `rel="ugc"` for user-generated content, `rel="nofollow"` otherwise.

### 3.9 Measurement

Do not measure this campaign on referring domains alone, because the highest-value UK placements are nofollow. Track four things:

1. **Referring domains** (Search Console links report), for the followed links
2. **Branded search volume** in Search Console, which is the strongest AI-visibility correlate
3. **AI-attributed sessions** in GA4. CarCostCheck runs about 115 AI sessions per week (ChatGPT 80, Copilot 22, Claude 5, Perplexity 5, Gemini 3) and earned **£884 over 60 days from AI-attributed traffic, 15.5% of revenue**
4. **Unlinked brand mentions**, which are the AI-citation asset

---

## 4. CarCostCheck (UK): the full campaign

### 4.1 Site facts

- **Repo:** `C:\Users\daves\claude\carcostcheck`, production branch `master`
- **Domain:** www.carcostcheck.co.uk (all URLs standardised to `www`)
- **Product:** free car check; £4.99 premium; £2.99 valuation; £6.99 bundle; trade credit packs
- **Revenue benchmark:** 3,137 Google clicks from 357,366 impressions, 533 sales, **17.0% click-to-sale**, £3,038 gross, £5.70 AOV, £0.97 revenue per click (28 days, 6 July to 2 August 2026)
- **Data sources:** DVSA MOT History API (OAuth 2.0), DVLA VES, Experian (premium provenance), CarQuery, OneAuto
- **Existing schema:** WebSite + SearchAction and Organization in `src/app/layout.tsx`; Car, Review, FAQPage, Article, BreadcrumbList, HowTo across page types

### 4.2 P0 BLOCKER: fix this before contacting a single journalist

**File:** `src/app/mot-failure-rates/page.tsx`, function `getFailureCategory()` at **lines 36 to 46**, rendered at **lines 468 and 711** under a column header reading **"Common Failure"** (lines 433 and 674).

The function is a hardcoded if/else chain:

```ts
function getFailureCategory(m: ModelStat): string {
  // Estimate most common failure category based on car characteristics
  if (m.engineSize >= 2500) return "Emissions";
  if (m.year <= 2012) return "Suspension";
  if (m.fuelType === "DI") return "Emissions";
  if (m.engineSize <= 1200) return "Lights";
  if (m.passRate < 60) return "Brakes";
  if (m.passRate < 70) return "Suspension";
  if (m.passRate < 80) return "Tyres";
  return "Lights";
}
```

**It is not derived from any DVSA defect data.** It is presented in a user-facing column headed "Common Failure", sitting beside genuinely real Fail Rate and Tests columns, on a page whose meta description reads *"Unique data: every car model ranked by MOT failure rate."* A reader, and a journalist, would reasonably take it as real.

**The fail rates themselves are real and fine.** Only this column is fabricated.

**Fix, choose one:**
- **Preferred:** download the DVSA `test_item` file for the latest year and join it to the existing `item_detail.csv` lookups to produce genuine per-model defect categories. This also unlocks story angle 6 below, which is the one that won a competitor a followed link.
- **Minimum:** delete the column and both render sites.

**Do not pitch anyone until this is done.** A journalist who spot-checks it kills the story and the relationship permanently.

### 4.3 The data asset (verified 3 August 2026)

Computed directly from `data/processed/`:

- `model-stats.json`: **21,457 model-year records**
- `make-stats.json`: **145 makes**
- **62,494,097 total MOT tests**, covering vehicle years **1990 to 2024**
- **2,561 model-years have 5,000+ tests**, which is the threshold for publishing safely

**Framing that won a competitor its link:** cargarages.co.uk used *"X million UK MOT test records from the DVSA, covering every test from [year] to [year]"* and took the Honest John followed link on 28 May 2026.

**Caveat:** the local dataset is a March 2026 snapshot covering vehicle years to 2024. **Refresh from the latest DVSA bulk release before pitching**, because "2026 analysis" that stops at 2024 is a question you do not want asked.

### 4.4 Story angles, with the real numbers already computed

**Brand league table** (weighted by test volume, makes with 200,000+ tests):

| Worst | Fail rate | Tests | | Best | Fail rate | Tests |
|---|---|---|---|---|---|---|
| Renault | 23.5% | 1,867,662 | | Porsche | 7.2% | 455,550 |
| Citroen | 22.3% | 1,838,293 | | Lexus | 10.0% | 292,949 |
| Vauxhall | 21.2% | 5,390,621 | | BMW | 12.6% | 4,035,075 |
| Peugeot | 20.9% | 2,571,159 | | Jaguar | 12.9% | 789,035 |
| Fiat | 20.7% | 1,445,508 | | Land Rover | 13.0% | 2,238,337 |
| Nissan | 20.1% | 2,994,609 | | Audi | 13.3% | 3,572,164 |
| Ford | 19.2% | 8,110,306 | | Mercedes | 14.1% | 3,639,682 |

**The mass-market shock list** (20,000+ tests, so unarguable sample sizes). This is the strongest national angle because the Qashqai is one of Britain's best-selling family cars:

| Vehicle | Fail rate | Tests |
|---|---|---|
| Nissan Qashqai 2009 | 34% | 45,532 |
| Nissan Qashqai 2008 | 34% | 26,413 |
| Nissan Qashqai 2010 | 32% | 60,994 |
| Renault Clio 2007 | 32% | 41,223 |
| VW Polo 2004 | 32% | 26,290 |
| Nissan Qashqai 2011 | 31% | 65,488 |
| Peugeot 207 2008 | 31% | 40,789 |

**The age curve** (one clean chart, very linkable): 2021 cars fail 7.3%, 2019 9.2%, 2017 12.5%, 2015 16.3%, 2013 19.8%, 2011 22.9%, 2009 25.0%.

**Twelve concrete pitches.** The regional ones are the priority because local press links are numerous and often followed.

*Regional (requires reprocessing `test_result` retaining `postcode_area`):*
1. **"The [town] MOT centres where your car is most likely to fail."** Precedent: CompareNI ranked just 15 Northern Ireland test centres and earned [Belfast Live](https://www.belfastlive.co.uk/news/northern-ireland/mot-test-centres-northern-ireland-31854279) with a live link plus [Derry Now](https://www.derrynow.com/news/coleraine-revealed-as-lowest-mot-pass-rate-in-ni-6818203) with three links including a deep link. You have 120+ postcode areas, so 45 to 60 localised versions.
2. **"Mapped: the UK postcodes where most cars fail their MOT."** Precedent: A-Plan Insurance, early 2023, 118 postcode areas, landed [The Independent](https://www.independent.co.uk/news/uk/home-news/mot-map-pass-rates-uk-rated-b2315506.html) and the [Daily Mirror](https://www.mirror.co.uk/news/uk-news/easiest-part-uk-pass-your-29302417). **No GB-wide town-level MOT story has run from a commercial PR since. The angle is proven and currently dormant.**
3. **"The [county] postcodes where cars are clocked most."** Mileage regressions by vehicle across years, by postcode area. Genuinely novel; nobody has run mileage-discrepancy geography.
4. **"The oldest cars still on [town]'s roads."** First-use-date distribution by postcode area. Light, warm, very high local pickup.

*National:*
5. **"The EVs most likely to fail their first MOT."** The Express ran this unattributed on 2 August 2026; claim the next cycle.
6. **"The number one reason for MOT failures revealed."** Requires the `test_item` join from section 4.2. Precedent: cargarages.co.uk won the Honest John **followed** link with exactly this.
7. **"The £X billion MOT repair bill."** Failure counts by category multiplied by published repair costs. Precedent: [Motoring Research, 4 June 2026](https://www.motoringresearch.com/car-news/mot-failure-repair-costs-increase/), BookMyGarage, followed link.
8. **"Ten cars that cost the most to get through an MOT."** The Sun runs this format repeatedly; route via SWNS.
9. **"Does car colour predict MOT failure?"** Uses the `colour` column nobody touches. Quirky, high syndication, low authority. Good filler.
10. **"Diesel vs petrol vs EV: which ages worst?"** Failure rate by fuel type and age. Auto Express, Motor Trader.
11. **"Depreciation vs reliability: cars that hold value but cost you."** Your depreciation curves crossed with failure rates. This is Money, Car Dealer.
12. **"One in X cars fails on tyres alone."** Garage Wire solicits exactly this.

**Seasonal calendar:** March and September are plate-change months with peak MOT volume and news appetite. April is VED changes, the reliable annual hook. October to November is lights and winter readiness. Any live DVSA MOT policy consultation is an instant hook.

### 4.5 Named contacts, in priority order

| # | Target | Contact | Realistic outcome |
|---|---|---|---|
| 1 | **Honest John** | `editor@honestjohn.co.uk` | Coverage plus a **followed link** |
| 2 | **Rob Hull, This is Money** | `rob.hull@dailymail.com` | Highest authority. Ex-Which?, so lead with methodology. Offer an embargoed exclusive |
| 3 | **Luke Chillingsworth, Express** | `luke.chillingsworth@reachplc.com` | His profile publicly invites motoring stories. Fastest yes |
| 4 | **Motoring Research** | [Contact form](https://www.motoringresearch.com/contact/), tag Tim Pitt or John Redfern | Coverage plus a **followed link**. No email published anywhere |
| 5 | **Christian Abbott, BirminghamLive** | `christian.abbott@reachplc.com`, cc `newsdesk@birminghamlive.co.uk` | Wrote both of BirminghamLive's linked MOT stories. 278 MOT articles in 12 months |
| 6 | **John Kirwan, Motor Trader** | `john.kirwan@emap.com` | Personally wrote the Feb 2026 carVertical MOT story. Trade authority, no link |
| 7 | **Christopher Sharp** | `christopher.sharp@reachplc.com` | One filing lands on both Mirror and Express |
| 8 | **Tom Jervis, Auto Express** | `tom.jervis@autoexpress.co.uk`, cc `steve.walker@autoexpress.co.uk` | Named credit, link unlikely |

**Cheap runner-up:** `editor@garagewire.co.uk`. Their [submit page](https://garagewire.co.uk/submit-your-content/) literally solicits "Dangerous defects and MOT horrors" and they do link out to tools.

**Separate, non-competing:** `david.dubas-fisher@reachplc.com`, Data Investigations Editor at the Reach Data Unit, 183 bylines in 12 months. Offer the regional cut **pre-built**. Expect no link; ask up front for an "in partnership with CarCostCheck" credit line, which they demonstrably publish.

**Full Auto Express desk** (verified in page source at [autoexpress.co.uk/contact-us](https://www.autoexpress.co.uk/contact-us)): `richard.ingram@`, `phil.mcnamara@`, `peter.baiden@`, `sarah.perks@`. Chris Rosamond writes their MOT pieces but his address is not published; `chris.rosamond@autoexpress.co.uk` is inferred from the pattern and is `UNVERIFIED`.

**Routing notes:** Car Dealer Magazine explicitly says do not send press releases via the contact form; route via X or LinkedIn DM to James Baggott (@CarDealerEd). AM-online is contact-form only and has zero MOT data stories, so reframe for dealers or skip. The Sun publishes no staff emails and its motoring data content arrives via **SWNS**, so distribute via the newswire.

**Skip:** Which? is a direct competitor with a paywalled reliability product. MoneySavingExpert's press contacts state that non-media enquiries will not be answered, and their beat is car finance, not reliability. PistonHeads editorial does no data journalism.

**Useful tool:** Reach's undocumented internal article search API, no auth needed, for checking byline freshness before pitching:
```
https://api.mantis-intelligence.com/reach/search?search_text_all=MOT&domains=birminghammail&limit=30&sort=date&indexAlias=12-months
```
with header `Origin: https://www.mynewsassistant.com`. Site keys: `birminghammail`, `liverpoolecho`, `men`, `mirror`, `express`.

`UNVERIFIED`: whether Claire Miller and David Ottewell are still at Reach. Two research streams conflicted. Verify before pitching either.

### 4.6 Forums and communities (nofollow, treat as referral and AI-citation)

PistonHeads is the richest vein, with threads live into late 2025:
- [t=2036824 "Useful Free Websites When Assessing Potential Cars"](https://www.pistonheads.com/gassing/topic.asp?h=0&f=255&t=2036824), best fit for the free tier
- [t=2068658 "What's the go-to car history checking service?"](https://www.pistonheads.com/gassing/topic.asp?h=0&f=255&t=2068658), last reply 6 Nov 2025

**Competitive intelligence from reading these:** the community favourite is `vcheck.uk`, not any of the nine competitors on the radar. Total Car Check dominates mentions. Carveto appears with explicitly negative sentiment. **carcostcheck.co.uk appears in zero threads.**

MSE forum has five open threads including [Vehicle history check scam](https://forums.moneysavingexpert.com/discussion/6632018/vehicle-history-check-scam), where a free legitimate alternative is genuinely on topic. **MSE moderates promotion aggressively; a ban is a real risk.** Participate as a person, not a brand.

Reddit r/CarTalkUK has relevant threads including [Are there any other free car checking websites?](https://www.reddit.com/r/CarTalkUK/comments/12yuzys/are_there_any_other_free_car_checking_websites/). `UNVERIFIED`: thread contents, Reddit was unfetchable during research.

### 4.7 Other legitimate routes

- **schema.org `Dataset` markup plus real CSV downloads** at a `/data` or `/press` page. No gatekeeper, fully in your control, and it enters Google Dataset Search, a vertical almost no UK car site occupies. Spec: [developers.google.com/search/docs/appearance/structured-data/dataset](https://developers.google.com/search/docs/appearance/structured-data/dataset). **Derive from the OGL bulk file, not the API cache**, for licensing cleanliness.
- **Hugging Face datasets**, [huggingface.co/new-dataset](https://huggingface.co/new-dataset), self-serve, no review.
- **[github.com/public-apis/public-apis](https://github.com/public-apis/public-apis)** (454k stars, actively merging). The `### Vehicle` section has 10 entries and **not one UK entry**: no MOT, no DVLA, no DVSA. The US has NHTSA; the UK has nothing. **Requires exposing a documented free-tier API first**; a website alone is explicitly rejected.
- **IAAF** [member directory](https://iaaf.co.uk/member-directory/) is the one eligible trade body; members get clickable website links and its Service Providers category already includes WhoCanFixMyCar, a direct precedent for a pure web platform. Cost not published, +44 (0)121 748 4600. Do not confuse with `theiaaf.org`, a different organisation.
- **Local Citizens Advice charities** (separate registered charities with their own sites) have "get a private history check" pages with nothing linked: [Havering](https://citizensadvicehavering.org.uk/buy-secondhand-car/), [Salford](https://salfordcab.org.uk/avoid-trouble-buying-used-car/), [Cheshire West](https://www.citizensadvicecw.org.uk/buying-a-used-car/). Higher reply rate than councils.
- **CEnTSA**, one email reaching 14 councils: `centsa@warwickshire.gov.uk` / `nick.harrison@warwickshire.gov.uk`. Hook their "Stop Check Go" used-car campaign.
- **[Devon & Somerset Trading Standards](https://www.devonsomersettradingstandards.gov.uk/consumer/buying-a-second-hand-vehicle-heres-what-you-need-to-know/)** is the one council page found that **does** link out to a commercial site, which is the precedent that matters.

**Deprioritise .gov.uk generally.** Five council and government pages were checked and the pattern is consistent: they name "HPI Check" as a generic noun and do not hyperlink it.

⚠️ **Do not pursue:** the Which? used-car-checks URL 404s. `wrasse.plymouth.ac.uk` and a NERC-BAS subdomain carrying used-car content are almost certainly compromised spam-injected university subdomains.

### 4.8 CarCostCheck sequence

**Week 1, engineering (unlocks everything else):**
1. Fix or delete `getFailureCategory()` (section 4.2). **Non-negotiable, blocks all outreach.**
2. Download the latest DVSA `test_item` file and join to `item_detail.csv` for real defect data.
3. Reprocess `test_result` retaining `postcode_area`: pass rate by postcode area, by area × make, by area × age.
4. Build a `/press` or `/data` page: methodology, record count, date range, a **named spokesperson with a job title**, and a downloadable CSV. There is currently no such page.
5. Refresh the dataset to the latest DVSA year.

**Week 1, parallel (about one hour):** FreeIndex, Hotfrog, Launching Next, SaaSHub, AlternativeTo, Trustpilot, Product Hunt. This builds the branded-anchor baseline that competitors' referring-domain profiles largely consist of.

**Week 2:** Featured free tier, Newspage free tier, PressPlugs 7-day trial. Manually check `#journorequest` on X and Bluesky.

**Weeks 2 to 3, the five emails that matter:** Honest John, Rob Hull (embargoed exclusive), Motoring Research, Christian Abbott, Garage Wire.

**Week 4+, the regional campaign:** one national master under embargo at 00:01 with a half-day head start, then 45 to 60 localised cuts (roughly 250 to 350 bespoke words over a shared 400-word core), prioritising Newsquest, National World and independent local radio for the followed links, with Reach for brand mentions. Offer the pre-built regional cut to the Reach Data Unit.

⚠️ **The one real risk:** if the data is straight DVSA open data, the Reach Data Unit will simply do the analysis themselves and credit nobody. **Your defence is the pre-built local cut plus a named spokesperson.**

---

## 5. CarWorthIt (US): deliberately smaller

### 5.1 Current state, verified 4 August 2026

- **Repo:** `C:\Users\daves\claude\carworthit`. Live: carworthit.com returns 200.
- **Content:** 42 articles in `src/content/articles.json`, 3 guides, blog, tools, about, pricing, sample-report. Sitemap has 58 URLs.
- **Schema:** present and decent. Organization, WebSite + SearchAction, Service with Offers, FAQPage, AboutPage. Four JSON-LD blocks on the live homepage. **No `sameAs`**, which is correct (see section 6).
- **robots.txt explicitly welcomes AI crawlers:** GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot all `Allow: /` with `Disallow: /report/`. This is good practice and should be preserved.
- **`CHECKOUT_ENABLED = false` and `PLATE_ENABLED = false`** in `src/lib/constants.ts`. **The site cannot take money.**
- **Stripe is live and working.** Keys are in `.env.local` (gitignored). Account verified via API: `acct_1U0cQ4IeNG3uNMwY`, "Car Worth It", country **GB**, default currency **GBP**, `charges_enabled: true`, `payouts_enabled: true`.
  - **Currency check done and cleared:** the site prices in USD from a GB account. USD **is** chargeable; `supported_payment_currencies` for GB includes `usd` (134 currencies). Payouts convert to GBP with Stripe's FX fee, roughly 2%, about 14 cents on a $6.99 sale. Not a blocker.
  - **Gotcha for whoever checks this again:** the field is `supported_payment_currencies`. There is no `supported_presentment_currencies` field on the country_specs object, and querying it returns a false negative.
  - **The live secret key was pasted into a chat transcript, so it should be rotated in the Stripe dashboard.**
- **Search performance:** 1 lifetime click from 1,547 impressions (0.06% CTR), 3 impressions in the twelve days to 3 August. Indexed correctly, robots allowed, canonicals correct. **This is new-domain honeymoon expiry, not a penalty.** Nothing to appeal.

### 5.1a Five blockers, all verified in the repo on 4 August 2026

Fix these before any outreach. They are cheap and they gate everything else.

| Blocker | Evidence | Why it blocks PR |
|---|---|---|
| **No database at all** | `package.json` has no Supabase, Prisma, Postgres, Drizzle, Mongo or Redis dependency. No client anywhere in `src/`. Only two API routes exist: `/api/checkout` and `/api/plate` | **This kills every "our own data shows" angle.** Aggregated query data does not exist and is not being collected. **Add query logging on day one**: VIN-decoded make/model/year/mileage plus state. Every day without it is a day of lost data |
| **No named human expert** | `/about` has no person, no bio, no editorial policy | Every journalist platform and every data study needs a quotable named analyst. This is iSeeCars' entire moat (see 5.3e) |
| **No press page, no media email** | Not in the 58-URL sitemap; no `media@` or `press@` anywhere | CarEdge, Bumper and iSeeCars all have one. Cheapest item on this list |
| **Checkout disabled** | `CHECKOUT_ENABLED = false` in `src/lib/constants.ts` | Do not drive PR traffic to a site that cannot transact |
| **`llms.txt` hardcodes prices** | `src/app/llms.txt/route.ts` | Ignored by every AI system and about to go stale. Delete it (section 3.1) |

### 5.2 Strategy context you must not contradict

A product and revenue plan dated 3 August 2026 supersedes `CARWORTHIT-BUILD-PLAN.md` on several points. **Read it before touching the product.** Its load-bearing conclusions:

- **The history report is being removed.** No supply route that is both legal and affordable. OneAuto Wave 2 is B2B only; licensing NMVTIS directly costs $125k upfront and still forbids resale; Vehicle Databases wants $375 upfront while banning resale. Meanwhile Carsforsale.com, an actual NMVTIS-approved provider, gives full reports away free. **This means `constants.ts` still advertises a product that is being withdrawn.**
- **The data provider pivots** from Vehicle Databases to OneAuto US / Carketa Market Pricing (about $0.32 a call) plus VIN Decode Plus (about $0.19).
- **New product line:** free VIN report ($0 data cost), valuation gated behind an **email not a card** (US market norm), a **$6.99 worth-it report** (85% margin), and a **$29 diminished value report** (94% margin, only 19 sales a month to clear $500 profit).
- **SEO pivot:** do not target "is this car worth it" (50 searches a month). Target `kelley blue book vin lookup` (14,800 a month at only M52 competition) and `price my car by vin` (14,800, H77). Plus a soft "worth it" category cluster: extended warranties (1,900, M48, $5.24 CPC), hybrids (1,900), CPO (590, L19), leasing (480, L18).
- **Never** run the $1-trial-into-subscription model that Bumper and EpicVIN use. It works commercially, generates "scam" and "cannot cancel" reviews, and the FTC has an open Negative Option rulemaking.

### 5.3 Why the press campaign waits, and a correction

All four reasons from section 2 apply: no working checkout, product line mid-restructure, three weeks old, no authority.

**But one thing I said earlier was wrong and is corrected here.** I initially concluded that CarWorthIt has no data story available because it owns no proprietary dataset. **That is too strong, and the competitor evidence disproves it.**

Bumper.com has no proprietary dataset either. One single URL, [bumper.com/analysis/best-states-for-electric-cars/](https://www.bumper.com/analysis/best-states-for-electric-cars/), earned links from Newsweek, Jalopnik, CleanTechnica, Deseret News, MotorTrend, Electrek and Business Insider, plus a long local tail. The mechanism: **a 50-state ranking built entirely from free federal data** (DOE AFDC charger counts, NHTSA FARS), which manufactures **50 separately pitchable local angles from one dataset**, then gets re-cut annually. There are three vintages of best-states-for-EVs, three of teen-driving fatalities, and a speed-camera ranking.

So the correct statement is: **CarWorthIt has no proprietary data, but it does not need any.** The US federal data it already uses (NHTSA, EPA, FARS, DOE) supports exactly this play. What it lacks is a working checkout and a settled product line, which is a sequencing problem, not a capability problem.

**Revised recommendation: still do not spend money on US digital PR in 2026, but the reason is sequencing, not absence of an angle.** Build the state-ranking asset during the wedge test so it is ready the moment checkout goes live.

### 5.3a The US link market is materially better than the UK one

This is the single most useful finding for CarWorthIt and it reverses the UK conclusion. Across verified US placements, checked by reading `rel` attributes in raw HTML: **15 followed versus 4 nofollow.**

- **Nofollow by policy:** Business Insider (`rel="noopener nofollow"`), Newsweek (`rel="nofollow"`), The Drive (`rel="noreferrer noopener nofollow"`).
- **Followed:** AutoWeek, Electrek, Deseret News, MotorTrend, Jalopnik, Torque News, Car Talk, Automotive News, Auto Remarketing, Auto Dealer Today, CleanTechnica, CEO Weekly, US Insider, AI Dealer News.

Pattern: large US nationals nofollow, but **enthusiast blogs, trade press and regional papers do not.** Zero `rel="sponsored"` anywhere. Unlike the UK, where Reach nofollows everything at platform level, a US campaign can realistically earn followed links from mid-tier outlets. That makes the eventual CarWorthIt campaign more attractive than the UK equivalent per unit of effort.

### 5.3b Competitor scale, for calibration

Semrush public data, June 2026. Read **referring domains**, not backlinks: VinAudit's 102.72m backlinks from 1,650 domains and ClearVin's 1.06m from 1,840 are sitewide widget patterns, not editorial.

| Domain | Authority | Referring domains | Organic traffic |
|---|---|---|---|
| caredge.com | 49 | 10,050 | 458,720 |
| epicvin.com | 53 | 4,320 | 336,880 |
| clearvin.com | 37 | 1,840 | 17,860 |
| vinaudit.com | 43 | 1,650 | 36,710 |

`UNVERIFIED`: iseecars.com, carcomplaints.com and detailedvehiclehistory.com metrics could not be retrieved (Semrush 404s across four URL variants). Bumper's link metrics are login-gated.

**Note:** caredge.com, the closest competitor to CarWorthIt's model, has **zero .gov presence and zero Wikipedia links**. The routes in 5.3c are open ground.

### 5.3c The federal and institutional link routes (US only, no UK equivalent)

These do not exist in the UK and are the highest-value US-specific opportunity.

**1. The NMVTIS Approved Data Provider list.** Verified `href`s to clearvin.com, vinaudit.com, epicvin.com and bumper.com on a **US Department of Justice domain**:
- [vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory](https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory) (DOJ/BJA)
- [aamva.org/vehicles/nmvtis/nmvtis-for-general-public-consumers](https://www.aamva.org/vehicles/nmvtis/nmvtis-for-general-public-consumers)
- [ksrevenue.gov/dovnmvtis.html](https://www.ksrevenue.gov/dovnmvtis.html). **Kansas is the only state outlier**; DC, Vermont, Florida, Virginia and Texas DMV pages were all checked and link only to the DOJ site, never to providers. Do not waste time on other DMVs.

**The possible path in, with a serious caveat.** The DOJ page has a second category for *"an additional website **owned by** the Approved NMVTIS Data Provider and authorized to sell NMVTIS reports"*: vincheck.info (VinAudit), vingurus.com and vininspect.com (EpicVin), beenverified.com (Bumper), **all followed**.

⚠️ **Do not treat this as an easy win. Two problems, both material:**

1. **The wording says "owned by".** Every listed secondary site appears to be a brand the approved provider already owns, not an independent partner operating under licence. If that is strict, an unrelated company cannot be added at all without being acquired or becoming a subsidiary.
2. **VinAudit has already refused this exact request.** Per `CARWORTHIT-BUILD-PLAN.md` §3, support ticket **#760890** (Marinel, 14 July 2026): their Vehicle History Report API is *"strictly B2B, not for resale or consumer-facing distribution."* That is precisely why the project moved to Vehicle Databases in the first place. **An earlier draft of this document named VinAudit as the partner to approach. That was wrong and is corrected here.**

**This route is being researched separately.** See `NMVTIS-RESELLER-ROUTE.md` in this folder for the full assessment of whether it is achievable at all, at what cost, and with whom. **Do not act on this section until that document says so.**

Raw HTML was audited independently by two agents: **exactly one `nofollow` on the entire DOJ page** (oneaib.com). Every provider gets **two followed links**, a logo tile and a "Go to X.com" button, sitting alongside Carfax and Experian.

**Becoming an approved provider directly is expensive:** roughly **$1,000 application plus about $30,000 development at contract execution**, plus per-VIN fees, and all data must be stored on US servers. There is **no public application form**; it is a privately negotiated AAMVA contract. Direct route: `NMVTIS@usdoj.gov`. The reseller path is the realistic one.

**Telling correlation:** DetailedVehicleHistory is the one competitor **not** on this list, and it is also the one with no editorial link profile at all (SimilarWeb rank #1,509,394).

⚠️ **This interacts directly with the history-report decision.** The 3 August plan removes the history report because no legal affordable supply exists. A provider partnership is the one route that would both restore that product line **and** unlock federal links. It is worth pricing before the removal is treated as permanent. VinAudit sells this API.

**2. The FTC.** [consumer.ftc.gov/features/feature-0040-used-cars](https://consumer.ftc.gov/features/feature-0040-used-cars) carries a verified `href` to vinaudit.com alongside AutoCheck, Carfax, Edmunds, KBB and NADAguides. The page text reads: *"Reports from other providers sometimes have additional information... (Note: The FTC doesn't endorse any specific services.)"* An editorial slot with explicit non-endorsement, so genuinely open.

**3. Library LibGuides.** The highest-yield template found. Same structure across thousands of US libraries, each with a named librarian and an "Email Me" button:
- [guides.loc.gov/automotive-industry/retail-car-buying](https://guides.loc.gov/automotive-industry/retail-car-buying) (**Library of Congress**) links KBB, Edmunds, TrueCar, Carfax
- [slcl.libguides.com](https://slcl.libguides.com/c.php?g=1365624&p=10088387) (St Louis County Library), [sd57.libguides.com](https://sd57.libguides.com/c.php?g=300648&p=2008107), [manateelibrary.libguides.com](https://manateelibrary.libguides.com/auto-and-home-repair/websites)

**No competitor has a single LibGuide link.** Both `site:libguides.com` checks returned nothing for all seven competitors. Completely open.

**4. Federal dockets via regulations.gov.** Verified HTTP 200: an iSeeCars study filed as an attachment to a NHTSA docket, [downloads.regulations.gov/NHTSA-2025-0490-0047/attachment_13.pdf](https://downloads.regulations.gov/NHTSA-2025-0490-0047/attachment_13.pdf), sitting permanently on a federal domain. Free, no gatekeeper. VinAudit has done the same with two FTC Data Quality Act filings.

**5. Wikipedia, earned not added.** iSeeCars has **24** Wikipedia links and CarComplaints **23**, both earned by publishing original data studies that editors chose to cite. CarEdge and ClearVin have zero. Do not add your own (section 3.5); this is a downstream effect of the data-study play.

### 5.3d Three competitor playbooks, ranked by how copyable they are

1. **Bumper: copy this first.** One free-federal-data state ranking, 50 local angles, re-cut annually. Days to build, no proprietary data needed, no audience needed. Press contact `press@bumper.com` (Cloudflare-obfuscated on their page). They also run PR Newswire and ACCESS Newswire; note their press page **overstates**, since the USA Today and 24/7 Wall St pages listed on it contain zero bumper.com anchors.
2. **CarComplaints: second, but it needs years.** Their replicable tactic is **URL depth, four levels**: `/Brand/` → `/Brand/Model/` → `/Brand/Model/Year/` → `/Brand/Model/Year/category/specific-problem.shtml`. Jalopnik linked one page because it was the only URL on the internet proving that one claim. NHTSA and Consumer Reports bury the same fact behind a search box, so CarComplaints wins by default. They have **no press email at all** and get cited constantly anyway. (They also run a 32-domain exact-match brand network under Autobeef LLC, a 2000s tactic; do not copy that part.)
3. **CarEdge: last, needs a bookable human.** Their links come from trade press covering their data tool, and note the target is **[caredge.com/methodology](https://caredge.com/methodology), not the commercial tool page**. Two of four trade placements linked methodology specifically, because editors will link a methodology page as sourcing while resisting a product page. **Directly applicable lesson for CarWorthIt: build and link a methodology page.** CarEdge has no PR wire presence (prnewswire 404) and instead uses paid syndication (CEO Weekly, US Insider, near-identical stories, same window, both followed).

### 5.3e iSeeCars: the market leader's method, reverse-engineered

**They publish their own backlink list.** [iseecars.com/news-coverage](https://www.iseecars.com/news-coverage) runs to 12 pages and was scraped to **529 unique press URLs across 214 domains**. Press contact **`media@iseecars.com`**, found in raw HTML. This is a free, complete prospect list for the entire niche. Start here.

Verified mechanism:
- **No PR wire at all.** PRNewswire and EIN Presswire both return zero iSeeCars releases.
- **Direct email pitching, proven.** A KROC-AM article contains a link of the form `iseecars-com.smailroute.net/x/d?c=...` wrapped in an Outlook **Safelinks** URL with the reporter's address still embedded, 302-ing to the study. That is a pitch email pasted straight into copy.
- **One evergreen URL per topic, versioned by fragment.** Forbes 2024 links `#v=2024`, Road & Track 2025 links `#v=202510`, 2026 links `#v=2026`, all on the *same path*. Years of equity compound on one URL instead of scattering across dated posts. **This is the single most copyable tactic here and it costs nothing.**
- **Refresh then re-pitch, with a 0 to 14 day lag.** `dateModified` maps onto press waves exactly: `car-recall-study` updated 8 April 2026, then Road & Track 8 April, Motor Illustrated 9 April, HowToGeek 12 April, 24/7 Wall St 17 April, Free Press 21 April.
- **A big round number in the methodology line**, e.g. "analyzed almost 400 million cars".
- **Anchor text is 100% branded.** "iSeeCars", "a study conducted by iSeeCars". Zero commercial-keyword anchors. Copy this exactly.

⚠️ **The part you cannot copy, and should know about:** they hired the journalist. Karl Brauer, their "Executive Analyst", is the former Editor-in-Chief of Edmunds and Executive Publisher of KBB and Autotrader, **and an active Forbes contributor**. He wrote the Forbes piece about his own employer's study, and his Forbes bio does not disclose the iSeeCars role. Do not treat their Forbes placements as a repeatable route.

### 5.3f US local TV: genuinely followed, but it is a partnership not a pitch

Verified followed across four of the five major station groups: **Nexstar** (KTLA, WREG, WFLA, WGNTV), **Scripps** (WCPO), **Sinclair** (WCIV), **Gray** (WAFB). On KTLA, seven iSeeCars links sit inside `div.article-content` with `rel: null`, including one to the commercial `/vin` page. Syndication is real: the identical slug runs live on four Nexstar stations, each repeating the full followed link set.

⚠️ **The caveat that changes the strategy.** On KTLA the byline is `rel="author"` pointing at `nxsttv.com/nmw/?post_type=profile`, author name **"iSeeCars"**. That is a **Nexstar content-partnership contributor slot, not organic earned pickup.** Scripps behaves the same way through its "Don't Waste Your Money" franchise. The links are genuinely followed, but the route in is a syndication conversation with Nexstar Media Wire, **not a cold press release.** Budget accordingly.

**The Scripps multiplier is proven:** one identical Carfax odometer segment ran on WTVR, KGUN9 *and* KERO. One pitch to the Scripps national consumer desk yields many station URLs. Contact: `jmatarese@wcpo.com`.

**Named journalists on this exact beat:**
- **Jamie L. Lareau**, Detroit Free Press and USA Today, wrote both verified USA Today iSeeCars pieces. [Staff page](https://www.freep.com/staff/2647441001/jamie-l-lareau/), X @jlareauan. **Highest-value single target.**
- **John Matarese**, Scripps "Don't Waste Your Money", syndicates network-wide.
- Natalie Neff (Car and Driver), Sebastian Blanco (Autoweek), Brad Anderson (CarScoops), Brian Silvestro (Motor1).

**Published tip lines**, all seen on a live page: `tips@carscoops.com`, `CNBCtipline@versantmedia.com`, `staff@jalopnik.com`, `personalfinance@newsweek.com`, `inbounds@businessinsider.com`.

**Cheap credentialing:** RMAP $50/yr (explicitly welcomes people new to automotive media), APA Detroit $60/yr, WAJ Content Creator $65, IMPA $75/yr (⚠️ excludes purely tabular material, so publish bylined analysis first). NIADA is the most relevant used-car body: `membership@niada.com`. NADA is structurally closed to franchised new-car dealers only.

### 5.4 What to do instead, in priority order

**P0. Fix the wrong competitor prices in the six comparison articles.**
These articles are the AI-citation asset, built on the template that earned CarCostCheck £884 over 60 days (15.5% of revenue). They currently publish wrong figures: the site says Carfax is $44.99 (reportedly $49.99) and AutoCheck is $25 with a 25-report pack (reportedly $29.99, pack discontinued). **A model that cites you and gets burned stops citing you.**

⚠️ **Those corrected figures are `UNVERIFIED` and single-sourced via a US text proxy.** I attempted to verify them on 4 August and **could not**: carfax.com 301-redirects to carfax.eu from a UK IP. **Verify on a genuine US IP before editing.** A wrong number is worse than a stale one.

**P1. Claim the free listings.** FreeIndex and Hotfrog are UK-oriented, so for a US site use Launching Next (dofollow, verified), Product Hunt, AlternativeTo, SaaSHub. About an hour, zero cost.

**P2. Publish the two content clusters** from the product plan: the diminished value cluster (five to eight pages, state-aware because some states bar first-party claims) and the "worth it" category cluster. Both use the existing article pipeline, so cost is zero.

**P3. Preserve and extend the AI-crawler posture.** The robots.txt already welcomes GPTBot, OAI-SearchBot, ChatGPT-User and PerplexityBot. **Never block these.** CarCostCheck deliberately left Vercel's AI Bots ruleset on "Allow" for exactly this reason, because blocking GPTBot would kill the ChatGPT referral channel that produced two sales in a single day.

**P4. Add a correct `sameAs` to the Organization schema** once real profiles exist (a Trustpilot page, an X account, a LinkedIn page). Currently absent, which is better than wrong. See section 6 for why.

**P5. Build a `/methodology` page.** This is the single clearest lesson from CarEdge: editors link a methodology page because it reads as sourcing, and resist linking a commercial tool page. Two of CarEdge's four trade placements linked methodology specifically. Cost: one page.

**P6. Build the state-ranking data asset** (the Bumper play, section 5.3). Free federal data, 50 local angles, ready to pitch the moment checkout is live. Candidate cuts from data CarWorthIt already touches: cheapest states to run an EV (EPA plus DOE AFDC), states with the most open safety recalls per registered vehicle (NHTSA), states where cars hold value best. **Build it during the wedge test, pitch it after checkout works.**

**Success test, six to eight weeks:** diminished value impressions appearing in Search Console. No product built, no data spend, no legal exposure. If it does not rank, the wedge is closed and nothing was spent.

### 5.4a Three data gaps that just opened, and the best story angles

**Three gaps opened at once, which is the strategic opening:**
1. **NICB killed its "Hot Wheels" report.** Last edition 12 October 2021; "Hot Spots" last ran 2019. They now publish top-ten tables only, **no 50-state file**.
2. **The FBI Crime Data Explorer now has free, keyless, monthly, city-level 2025 theft data** that almost nobody is mining. Verified: `https://cde.ucr.cjis.gov/LATEST/summarized/state/CA/motor-vehicle-theft?from=01-2025&to=12-2025` (national total 663,049 offences in 2025).
3. **The federal odometer-fraud statistic is roughly 24 years old.** [NHTSA](https://www.nhtsa.gov/vehicle-safety/odometer-fraud) still cites "more than 450,000 vehicles" from a DOT HS 809-series study dating to about 2002, predating universal digital odometers. ⚠️ Confirm the exact publication year before making "24 years old" a headline.

**Two brand-new datasets nobody has touched:** FARS 2024 `vpicdecode.csv` (55,087 rows, 204 columns) includes ForwardCollisionWarning, BlindSpotWarning, LaneKeepingAssistance and SAEAutomationLevel, letting you join fatal crashes to trim-level safety kit. And NHTSA complaints fields #50 `STATE_OF_INCIDENT` and #51 `VEHICLE_OPERATOR` were **added 30 April 2026** and are unmined.

**Best angles, all state or city sliced:**

| Headline | Data | Why it works |
|---|---|---|
| **"The Most Stolen Car in Your State"** | FBI CDE 2025 ÷ FHWA MV-1 registrations | **Fills the 50-state file NICB no longer publishes.** "Per 1,000 registered" beats NICB's raw counts methodologically. No proprietary data needed |
| **"The Government's Only Odometer-Fraud Estimate Is From 2002"** | NHTSA 450k figure + your own repeat-VIN anomalies | Carfax's proven format (KOMO, KSL, WTVR, KGUN9, KERO). Pitch the Scripps consumer desk for the multiplier |
| **"Worst Cities to Own a Car"** | FARS 2024 city/county + FBI CDE by agency + EIA city gas prices | Exact ConsumerAffairs playbook, got USA Today twice in eight days. Every mid-size city gets a headline |
| **"Where Americans' Cars Actually Break Down"** | NHTSA `FLAT_CMPL.zip`, new `STATE_OF_INCIDENT` field | Field is three months old. First mover earns "according to a new analysis" |
| **"The States Where Cars Live Longest"** | Own query logs + [NY registrations](https://data.ny.gov/resource/w4pv-hbkt.json) (12.6m rows, full 17-char VIN) | **iSeeCars' longevity study has no state breakdown. Unclaimed** |
| **"$1 in Arkansas, $10 in Alaska to Check Your Own Car"** | NMVTIS state fee PDF | Under-reported: consumers cannot buy NMVTIS reports from Carfax or Experian (dealer only). Hawaii is the only non-participating jurisdiction |

**Best flagship slot: late January** (best-deal window, tax-refund run-up, peak "what's my car worth"). NICB's annual lands mid-March, so front-run it.

**The decisive lesson:** iSeeCars' pure depreciation study got heavy enthusiast-blog coverage and **almost zero local TV**. Its *state-segmented* fuel-cost study got Fox 5 San Diego twice. Jerry.ai is the counter-example: national survey data, no state cuts, essentially zero local pickup. **State and city cuts are the whole game for followed local links.**

### 5.4b Verified data gotchas (these will waste days each)

1. `FLAT_RCL.zip` is **dead, 404**. Use `FLAT_RCL_PRE_2010.zip` plus `FLAT_RCL_POST_2010.zip`.
2. vPIC bulk downloads are at `/downloads/`, **not** `/api/downloads/`. Current file: `vPICList_lite_2026_07`.
3. **`DRUNK_DR` does not exist in FARS 2023 or 2024.** Use `DR_DRINK` or `DRINKING`. Anything citing it is running on pre-2023 docs.
4. **CRSS has no state, county or city fields.** Any CRSS-based state ranking is invalid. Use FARS.
5. A **Census API key is now mandatory**; the old unkeyed 500/day allowance is gone.
6. **data.gov's CKAN API is removed (404)** and its search is JS-rendered. Go to source agencies.
7. BLS metro CPI is `CUURS{area}SETA02`, NSA only, and 20 of 23 metros are bimonthly on split odd/even schedules, so a clean all-metro table is impossible. **Use the AP dollar-price series `APUS{area}74714` instead**: monthly, all 23, no gaps, more quotable.
8. Motor vehicle insurance is **SETE**, not SEHC. October 2025 is missing (appropriations lapse).
9. fueleconomy.gov returns **XML unless you send `Accept: application/json`**. There is no `?format=json`.
10. `download.bls.gov`, `www.bls.gov`, `www.bts.gov`, `www.nhtsa.gov`, nicb.org and insurify.com all **403 automated fetchers**. Send a browser user agent with a contact email.
11. **IIHS forbids commercial republication without written permission.** Use FARS, which is public domain.
12. **No US open dataset of VIN-level title brands or salvage exists.** Do not promise one.
13. ⚠️ **NHTSA's odometer page currently shows "$1.06M" where "$1.06 billion" belongs. Do not cite that figure.**

### 5.4c Four compliance risks specific to this site

1. **Scaled content abuse is a bigger Google risk here than anything in link building.** The site already has about 40 near-templated `[make]-[model]-common-problems` posts. Mechanically generating 50 state pages multiplied by N models is the real exposure, and it is named directly in Google's spam policies alongside doorway abuse. Differentiate each page with genuinely different data or do not build it.
2. **FTC disclosure.** "Affiliate link" and "commissionable link" are **explicitly inadequate** per the [FTC endorsement FAQ](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Use **"paid link"**. And 16 CFR 465.1(c)(4) is binding rule text: *"A disclosure is not clear and conspicuous if a consumer must take any action, such as clicking on a hyperlink or hovering over an icon, to see it."* That rules out tooltips, modals, accordions and footer-only disclosure.
3. ⚠️ **NMVTIS reuse terms are unpublished.** 28 CFR §§25.51 to 25.57 contains **no provision at all** on resale, redistribution, caching or statistical and press use. It is entirely contractual via an unpublished AAMVA agreement. **Get those terms in writing before planning any "we analysed X million VINs" content.** Report scope is fixed at five indicators and you may not display the NMVTIS logo as a reseller.
4. **Never add credit pre-qualification of any kind.** That is the FCRA line. A vehicle valuation is not a consumer report; a credit-band estimate makes it one.

### 5.5 CarWorthIt sequence

**Week 1 (about £2 total, mostly engineering):**
- **Add query logging** (state plus VIN-decoded make/model/year/mileage). Every day without it is lost data and it gates six of the story angles. Highest priority item on this list.
- Publish `/press` with `media@carworthit.com`, a **named analyst with a bio**, and a `/methodology` page.
- **Delete `src/app/llms.txt/route.ts`.**
- Verify and fix the competitor prices on a US IP.
- Claim the free listings: Fazier, Product Hunt, AlternativeTo, SaaSHub, Launching Next.
- Do **not** buy the Vehicle Databases plan.

**Weeks 1 to 2:** open the **VinAudit reseller conversation** for the NMVTIS listing. It is the single highest-value link available and it may also restore the paid history product.

**Week 2:** free-tier signups at HARO, Connectively, Qwoted and Source of Sources. Modmail r/UsedCars (`/u/jaxspider`) about the sidebar "Free Vin check" list, which already carries NICB, VehicleHistory.com and vincheck.info and is verified followed on old.reddit.

**Weeks 3 to 8 (£0):** ship the product-line changes from the 3 August plan; retarget titles at the VIN valuation queries; publish both content clusters; **build the most-stolen-by-state study** (FBI CDE, no proprietary data needed, fills the gap NICB vacated, yields 50 local headlines); email the LibGuides librarians, which is completely uncontested.

**Month 3+, only if the wedge ranks:** enable checkout, ship the $29 report, then pitch. Approach **Scripps and Nexstar about a content partnership, not a press release** (see 5.3f), and pitch the mid-tier outlets that actually give followed links: AutoWeek, Electrek, MotorTrend, CleanTechnica, Torque News, CarScoops, Motor1, Automotive News, Auto Remarketing. **Do not chase Forbes, Fox Business or The Drive**, all verified nofollow.

**Ongoing:** one evergreen `/xxx-study` URL per topic with `dateModified` bumped annually and re-pitched on each refresh, never dated blog posts (the iSeeCars method, 5.3e).

**Note:** a free **EIA API key** was registered during research and is stored in `.env.local` as `EIA_API_KEY` for state and city gasoline price data.

---

## 6. A cross-site schema issue

**CarCostCheck's `sameAs` is wrong and should be fixed.** `src/app/layout.tsx` lists 13 of Dave's other sites in the Organization `sameAs` array (postcodecheck, findyourstay, askyourstay, aicareerswap, guardmybusiness, helpafterloss, helpafterlife, bestlondontours, the-best-tours, daveknowsai, davidskillett, aibetfinder, briefmynews).

[Google defines `sameAs`](https://developers.google.com/search/docs/appearance/structured-data/organization) as *"The URL of a page on another website with additional information about your organization... For example, a URL to your organization's profile page on a social media or review site."* It asserts identity. As written, it tells Google that CarCostCheck **is** PostcodeCheck.

**Calibrated severity: low.** `sameAs` is recommended, not required, is not a ranking factor, and Google's documentation does not claim it drives any specific feature. Google routinely ignores markup it does not trust. There is a low, non-zero manual-action risk because [the structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) say *"Don't use structured data to deceive or mislead users. Don't impersonate any person or organization, or misrepresent your ownership, affiliation, or primary purpose"*, but that policy targets deception and the worst case costs rich-result eligibility, not rankings.

**So: fix it because it is wrong and free to fix, not because it is holding anything back.** Replace with genuine profiles of the same entity (Companies House, LinkedIn, X, Trustpilot). The pattern is estate-wide, since the QA process checks that `sameAs` is present on all sites. **CarWorthIt has no `sameAs` at all, which is correct; do not copy the CarCostCheck pattern into it.**

---

## 7. Open questions and unverified items

Listed explicitly so nobody treats them as settled.

**CarCostCheck:**
1. **Indexation figures are stale.** 43% of sitemap indexed, `/common-problems/*` at 2.1% (about 2,694 dark pages), `/compare/*` at 8%, all as of **17 April 2026**. Recheck before deciding whether the fix is crawl-budget consolidation or culling thin pages. This is arguably a bigger revenue lever than links.
2. Whether Claire Miller and David Ottewell are still at Reach.
3. Whether Mike Ruff is still Garage Wire editor (confirming byline dates to 2017).
4. `chris.rosamond@autoexpress.co.uk` is inferred from a pattern, not published.
5. The MOT History API bulk-data terms: the docs nav lists "Download vehicle and MOT history data" but both plausible slugs 404. **Check before publishing anything derived from the API rather than the OGL file.**
6. No competitor referring-domain lists were obtained; Majestic paywalls them. All prospects came from forward prospecting.
7. The Vercel firewall is still in **log mode**, so the Singapore scraper (34,470 sessions over five days) continues to pollute the analytics being used to make these decisions.

**CarWorthIt:**
8. **Carfax and AutoCheck current US prices.** Blocked by geo-redirect from a UK IP: carfax.com 301s to carfax.eu. **Verify on a US IP before editing the comparison articles.**
9. Whether Carketa Market Pricing is licensed for B2C consumer display and resale, and whether "Per Result" billing charges only when data returns.
10. Whether diminished value appraisal firms buy leads. No published figures exist.
11. What a CarWorthIt email address is actually worth. The $2 per lead figure for Carvana is single-sourced and unverified.
12. **The cost of partnering with an NMVTIS approved provider** to get listed under their entry on the DOJ page (section 5.3c). Unpriced, and potentially the highest-value single move available to this site.
13. iSeeCars, CarComplaints and DetailedVehicleHistory link metrics (Semrush 404s). Bumper's are login-gated.
14. Reddit wikis as a link source: Reddit 403s automated access, so this is neither confirmed nor ruled out.
15. CarEdge's YouTube-to-TV-booking funnel is observable but **no subscriber, view or referral figures were obtainable**. Do not quote numbers on it.

**Both:**
12. `#journorequest` current status on X and Bluesky. Both free, so check manually.
13. PressPlugs pricing, published nowhere public.

---

## 8. Appendix

### Commands used to verify the CarCostCheck dataset

```bash
cd C:/Users/daves/claude/carcostcheck
python - << 'EOF'
import json, collections
m = json.load(open('data/processed/model-stats.json'))
print(f"records: {len(m):,}")
print(f"total MOT tests: {sum(r.get('totalTests',0) for r in m):,}")
big = [r for r in m if r.get('totalTests',0) >= 5000]
print(f"publishable model-years (>=5k tests): {len(big):,}")
EOF
```

### Verifying the Stripe account (CarWorthIt)

```bash
cd C:/Users/daves/claude/carworthit
KEY=$(grep '^STRIPE_SECRET_KEY=' .env.local | cut -d= -f2-)
curl -s https://api.stripe.com/v1/account -u "$KEY:"
curl -s https://api.stripe.com/v1/country_specs/GB -u "$KEY:"   # use supported_payment_currencies
```

### Key file paths

| What | Where |
|---|---|
| CCC fabricated column | `carcostcheck/src/app/mot-failure-rates/page.tsx:36-46, 433, 468, 674, 711` |
| CCC MOT dataset | `carcostcheck/data/processed/model-stats.json`, `make-stats.json` |
| CCC Organization schema / `sameAs` | `carcostcheck/src/app/layout.tsx:94-119` |
| CWI product flags and prices | `carworthit/src/lib/constants.ts` |
| CWI schema | `carworthit/src/lib/schema.ts` |
| CWI articles | `carworthit/src/content/articles.json` |
| CWI superseded build plan | `carworthit/CARWORTHIT-BUILD-PLAN.md` |

### One-line summary for whoever picks this up

> **CarCostCheck:** fix the fabricated "Common Failure" column first, then run the regional MOT data story to local press. 62 million MOT tests is a genuine asset and nobody has done the town-level cut since 2023. Expect nofollow from Reach and followed links from Newsquest, National World, Honest John and Motoring Research.
>
> **CarWorthIt:** correct the wrong competitor prices (verify on a US IP first), publish the wedge content, build a `/methodology` page and a 50-state ranking from free federal data. Hold all press outreach until checkout is enabled, because coverage is one-shot and the site cannot currently take money. The US link market gives followed links far more readily than the UK one, and the federal routes (NMVTIS provider listing, FTC, LibGuides, regulations.gov) are completely uncontested by its competitors.
