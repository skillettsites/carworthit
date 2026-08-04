# Side note: the NMVTIS route onto the Department of Justice page

*Companion to `BACKLINKS-AND-AUTHORITY-HANDOFF.md`. Investigated and closed 4 August 2026.*

> ## Verdict in one line
> **Getting listed under someone else is closed. Getting listed yourself costs about $31,000 and the substance bar is remarkably low.** Additional domains must be **legally owned** by the approved provider, so there is no partner route. But direct approval has no size, revenue or experience test, and a site with no named legal entity and 404ing terms pages was approved in **July 2026**.

⚠️ **Read section 4 before quoting any cost figure.** Two research passes produced conflicting numbers ($31,000 versus $121,000) and the lower one has the better source. An earlier version of this file led with $121,000. **That was probably wrong.**

---

## 1. What was being chased, and why it collapsed

[vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory](https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory) is a US Department of Justice page listing approved vehicle-history providers, carrying followed links alongside Carfax and Experian. It mirrors to [AAMVA](https://www.aamva.org/vehicles/nmvtis/nmvtis-for-general-public-consumers) and [Kansas DoR](https://www.ksrevenue.gov/dovnmvtis.html).

Two prizes were in play: a .gov followed link no competitor can buy, and a restored paid history product. **They have opposite answers and must be separated.**

⚠️ **First deflation, before anything else.** The premise that all listings are followed is **not reliably true**. **BeenVerified and VehicleHistoryReport.com carry `rel="nofollow"` on the DOJ page.** So even a successful secondary listing might deliver no link equity at all. The link case was weaker than the main handoff document originally implied.

---

## 2. The decisive finding: "owned by" means legal ownership

**NMVTIS FY2019 Annual Report, page 50, verbatim** (extracted from the DOJ-hosted PDF):

> "In response to requests to allow Providers to expand their coverage, a new policy was established allowing existing Providers to add **up to three additional domains/URLs under their name**. This policy was considered as a way to increase Providers **while maintaining the same contractual controls with an existing known entity**. The policy requires the Provider to make a formal application and **provide proof of legal ownership of the additional domains/URLs**."

That is the rule behind the DOJ page's "owned by" wording, and it is **stricter than a licence**. To get `carworthit.com` onto that page under VinAudit, **VinAudit would have to legally own carworthit.com**. You would be selling the domain, not licensing a brand.

The stated rationale, "maintaining the same contractual controls with an existing known entity", exists **precisely to stop independent third parties appearing on the list**. This is not an oversight to be negotiated around; it is the policy's purpose.

**There is no reseller listing route. Section closed.**

**Capacity, for completeness:** the cap is three additional domains per provider. GoodCar is already full at three (InfoTracer, RecordsFinder, StateRecords.org). EpicVin has two. VinAudit, Bumper and CarsForSale have one each.

---

## 3. The second finding: consumer resale is prohibited by policy

**NMVTIS FY2016 Annual Report, verbatim:**

> "Added more definition, structure and controls around resellers:
> » Providers required to audit resellers
> » **Resale restricted to companies that sell to businesses for internal use only; no resales to individual consumers**
> » Resellers must comply with provisions of AAMVA/Provider agreement, including flow-down terms from the Cooperative Agreement"

**This retrospectively vindicates VinAudit.** Support ticket **#760890** (Marinel, 14 July 2026) said their API is *"strictly B2B, not for resale or consumer-facing distribution."* That was not an unhelpful support agent or a negotiable position. **It matches published AAMVA policy exactly.** Assume every other approved provider is bound by the same rule.

⚠️ **One unresolved tension, flagged rather than smoothed over.** VinAudit's own Partner Agreement clause 2.1 refers to *"eligibility for the Partner to begin marketing and reselling the Product **to the public**"*, subject to AAMVA approval. Either the 2016 policy was later relaxed, or "AAMVA approval of a partner" is the same process as approving an additional domain, which loops straight back to the ownership requirement. **This could not be resolved from public sources. Only AAMVA can answer it.**

---

## 4. The cost: two conflicting figures, and which to believe

**Believe $31,000, not $121,000.** Here is why, laid out so you can judge it yourself.

### The current, operative source says ~$31,000

AAMVA publishes a flyer linked from the DOJ site, **"Become an Approved NMVTIS Data Provider" (REV 10-2023)**:
[NMVTIS Data Provider Flyer (PDF)](https://www.aamva.org/nmvtis-annualreport/appendix/FY2023%20NMVTIS%20Annual%20Report/NMVTIS-Info-Materials/NMVTIS%20Data%20Provider%20Flyer%20Print%2010.27.2023.pdf)

Verbatim:
> "The development cost of the web interface to request and receive the NMVTIS data is **$30,000**. This fee must be paid before development work can begin and is due at contract execution."
> "Non-refundable application fee of **$1,000** payable by Electronic Funds Transfer (EFT) or check."
> "Notes: ... **2. Interested parties must be a U.S.-based commercial entity. 3.** Approved NMVTIS Data Providers must agree all NMVTIS data will be stored on computer servers physically located in the U.S."
> "Application structured testing and certification by AAMVA personnel is required before the application is permitted to go 'live.'"
> "*Lack of financial documentation or length of credit history may require a deposit at contract execution."

**What is conspicuously absent from the current flyer: no minimum headcount, no minimum revenue, no bonding, no insurance, no industry-experience requirement, no minimum volume commitment.**

### The $121,000 figure came from a 2016 document

The higher number was built by adding a **$7,500 monthly revenue minimum** quoted in the **FY2016 Annual Report** ($1,000 + $30,000 + $90,000). That minimum **does not appear in the 2023 flyer**, which is seven years more recent and is the document AAMVA actually gives to applicants.

| Figure | Source | Date | Status |
|---|---|---|---|
| **~$31,000** | AAMVA applicant flyer | **Oct 2023** | ✅ Current, operative, published |
| ~$121,000 | FY2016 annual report + inference | 2016 | ⚠️ Ten years old, minimum not restated since |
| ~$125,000 | OneAuto (Mark Fretwell, 29 Jul 2026) | 2026 | ⚠️ Second-hand, may describe bulk licensing at scale rather than provider approval |

`UNVERIFIED`: whether the $7,500/month minimum was formally dropped or simply omitted from the flyer. **This is one of the three questions to ask AAMVA (section 7).**

**Per-VIN wholesale rate:** the flyer says only *"single rate pricing structure based on volume"* and publishes no schedule. Two indirect corroborations: the FY2024 accounts imply ~$0.28/VIN ($7.32m over 26m transactions), and VinAudit's blog says *"starts at about $1 per report and drops to roughly $0.25 at high volumes."* Neither is a primary rate card.

**Applications go to `helpdesk@aamva.org`.** Providers contract with **AAMVA**, not DOJ.

### The cheap alternative that needs no approval at all

**Yassi.com (Yotta Automated Software Solutions Inc.)**, an approved provider, sells NMVTIS records wholesale on published terms: *"**No minimums. No setup fees. No monthly fees. Just pay per record.**"*

That is a route to the **data** without the $31,000 gate. It does **not** get you onto the DOJ list, and it does not resolve the consumer-resale question in section 3, but it is the cheapest way to test whether a paid history product sells at all before committing capital.

---

## 5. Counter-evidence, in fairness: the substance bar is genuinely low

This is the one part that argues the other way, and it is worth knowing.

- **VinReport.com was added to the DOJ list in July 2026**, within the last five weeks. It names **no legal entity** anywhere (just "© 2026 VinReport"), its `/terms` and `/privacy` links **return HTTP 404** while sitting in the footer, it was a "Coming soon." placeholder as recently as 29 July 2024, and it prices at **$3.95**.
- **VinSmart.com** went from domain registration (4 July 2011) to DOJ listing (27 March 2012), about eight months. It publishes a **residential Rumson, New Jersey address**, runs hand-coded static HTML, names no entity, and has held its listing for 14 years.
- **EpicVin** is "owned and operated by INFOSPHERE W.L.L.", a **Bahraini** company form with a Manama address. **ClearVin** publishes only a Delaware mass-registered-agent mail drop.

**So AAMVA is not screening for scale, staff, track record, or even a working terms page. The gate is cash and a US corporate wrapper.** A solo operator is not disqualified by being small. They are disqualified by ~$121,000.

**Two corrections to earlier assumptions:** CheckThatVIN is **not** a small operation, it is **CARCO Group, Inc.** (founded 1977, now Cisive), a large background-screening firm. TitleCheck.us is **Auto Data Direct, Inc.** of Tallahassee, privately owned but promoted by TxDMV, which is where the "state-run" impression came from.

**Programme churn:** 2 providers (FY2009) → 10 (FY2012) → 15 (FY2019) → 13 (FY2020) → **19 providers / 26 approved websites** (FY2023 and FY2024). Documented exits include autotitleinfo, RigDig, instaVIN, usacarrecord, liendex, MVSCusa, DMVdesk and polarisxchange. FY2016 records that two providers *"exited the program and became resellers under other providers"*, so provider-to-reseller demotion is a real, documented path.

---

## 6. Revised verdict: split the two goals

**Goal 1, a paid NMVTIS-derived product on carworthit.com: achievable, weeks, near-zero cost, with one condition.**
VinAudit's Partner Agreement and VinData's white-label page both exist and are live. **But get consumer-facing permission in writing, citing the FY2016 "no resales to individual consumers" policy by name**, because that policy is the likely origin of the refusal already received. **If a provider will not confirm consumer-facing resale in writing, do not build on it.**

**Goal 2, a followed .gov link: no partner route, but direct approval is more achievable than first thought.**

- **Via someone else's listing: closed.** The additional-domain slot requires the provider to legally own the domain (section 2). You would be selling `carworthit.com`, not licensing a brand.
- **Direct approval: open, and the substance bar is low.** ~$31,000, a US entity, US-hosted servers and a business plan. **No size, revenue, headcount or experience test in the current flyer.** Timeline `UNVERIFIED`, but the FY2024 report notes four providers were approved in FY2023-24 and **had not yet gone into production**, which suggests AAMVA approves faster than applicants can build.

**Decisive constraints, in order:**
1. Additional domains must be **legally owned** by the provider (FY2019 policy). This kills the partner route outright
2. **Consumer resale appears prohibited** (FY2016 reseller rules), though possibly superseded. Unresolved, see section 3
3. US entity and US data residency, absolute
4. **~$31,000 cash** up front, plus your own build
5. **Secondary listings are not reliably dofollow anyway.** BeenVerified and VehicleHistoryReport.com carry `rel="nofollow"` on the DOJ page, so the link prize is smaller than assumed even on success

**The honest framing:** $31,000 to buy a .gov link is absurd on its own. $31,000 to unlock a legitimate paid history product **and** get the link is a different question, and one that only becomes worth asking once the site has proven it can sell anything at all. It cannot currently take money.

---

## 7. The single next action, if you want certainty

One email to **`helpdesk@aamva.org`**, copying **`NMVTIS@usdoj.gov`**, asking three questions:

1. Does the FY2016 restriction *"no resales to individual consumers"* still apply in 2026?
2. Does the **$7,500 monthly revenue minimum** still apply?
3. Is the FY2019 **three-additional-domain policy still limited to domains legally owned by the Provider**?

Those three answers settle everything and cost nothing. **Anything short of a clear "yes" to question 3 being relaxed means the link goal stays closed.**

---

## 8. ⚠️ Separate finding that affects the product, not the link

**`carworthit-project.md` (memory) records Vehicle Databases as chosen for "explicit consumer white-label resale". Their published terms say the opposite:**

> "You may not resell, redistribute, or share the database with any third party."

They are also **not** an Approved NMVTIS Data Provider, so nothing built on them can carry the NMVTIS logo or reach the DOJ list. **Their own marketing page is titled "NMVTIS API Alternative: Skip the $30,000 Approval Process"**, which is an accurate description of what they are: a way around NMVTIS, not a route into it.

This does not necessarily kill them as a supplier, since "the database" may mean bulk data rather than individual report display. **But the reason recorded for choosing them is wrong, and that should be resolved in writing before any paid history product ships.** The memory file has been corrected to flag this.

---

## 9. What could not be verified

1. Whether the FY2016 consumer-resale prohibition and the $7,500/month minimum remain in force in 2026
2. The current per-VIN rate card
3. The approval timeline
4. EpicVin's US contracting entity
5. Headcounts for any provider
6. Whether any approval has ever been formally **revoked** (exits are documented, revocations are not)
7. VinSmart and CheckThatVIN sites: hard WAF blocks, never reachable

---

## 10. When each provider was approved (Wayback evidence)

Useful because it shows the cadence and that the list is genuinely open. Reconstructed from ~40 archived captures of the legacy `vehiclehistory.gov` page and the current DOJ URL.

| Provider | First appears on the DOJ list |
|---|---|
| add123.com (Auto Data Direct) | by Nov 2009 |
| CheckThatVIN (CARCO/Cisive) | by May 2010 |
| DMVdesk, InstaVIN | by Jun 2011 |
| **VinAudit and VinSmart** | between 23 Jan and 27 Mar 2012 |
| TitleCheck.us | by Jul 2015 |
| ClearVin, Carsforsale, VinGurus | between Nov 2016 and Jul 2017 |
| carVertical | by Nov 2019 |
| Bumper | between Dec 2020 and May 2021 |
| VinData | between May and Sep 2021 |
| EpicVin | between Jan and May 2022 |
| GoodCar, PolarisXchange | between Oct 2022 and Jul 2023 |
| Yassi | between Jul and Dec 2023 |
| Vitu | by Apr 2024 |
| oneaib | by Nov 2024 |
| **VinReport** | **between 30 Jun 2026 and 4 Aug 2026** |

**Removals happen but look commercial, not punitive.** Gone from the list: autotitleinfo, RigDig, InstaVIN, USACarRecord, Liendex, MVSC, DMVdesk, CVR, PolarisXchange. Several are dealer-software firms that were acquired or consolidated. **No evidence of any punitive revocation was found.**

**FY2024 Annual Report, verbatim:** *"nineteen Providers were in operation... One Provider was approved in FY2024 but deferred moving into production until FY2025. Furthermore, AAMVA continued to support three Providers that were Approved in FY2023 but deferred their production until FY2025. Nineteen Approved NMVTIS Data Providers represent twenty-six approved websites."*

Four approved but not yet live is a strong signal that **approval is not the bottleneck; building is.**

---

## 11. Update log

| Date | Change |
|---|---|
| 4 Aug 2026 | Created, provisional. |
| 4 Aug 2026 | First research pass. FY2019 and FY2016 annual reports resolved the ownership and consumer-resale questions. Cost stated as ~$121k year one. Verdict: "effectively closed". |
| 4 Aug 2026 | **Second research pass corrected the first on cost and feasibility.** AAMVA's own current applicant flyer (REV 10-2023) puts entry at **~$31,000** with no revenue, size or experience test; the $7,500/month minimum behind the $121k figure comes from a **2016** report and is absent from the current flyer. Added the VinReport July 2026 precedent, the Wayback approval timeline, and Yassi's no-minimum wholesale route. **Verdict revised: the partner route is closed, but direct approval is materially more achievable than first stated.** The ownership finding in section 2 was unaffected and still holds. |
