// Appends a batch of safe informational guides to articles.json.
// bodyHtml is written as plain HTML here and single-encoded on write (the
// render decodes it). faqs are plain text. No NMVTIS/official/Carfax-grade
// claims. Run: node scratchpad/cwi-add.mjs
import fs from "node:fs";
const PATH = "src/content/articles.json";
const enc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cta = `<p><strong>Before you buy:</strong> run a free VIN check to see the specs, open recalls and safety ratings for the exact vehicle, then decide whether a full history report is worth it. <a href="/">Check a VIN</a>.</p>`;

const NEW = [
  {
    slug: "what-does-a-vehicle-history-report-show",
    title: "What Does a Vehicle History Report Show?",
    metaTitle: "What Does a Vehicle History Report Show? (2026)",
    metaDescription: "A vehicle history report can show title brands, reported accidents, odometer readings, prior use and open recalls. What it does and does not include before you buy.",
    body: `<p>A vehicle history report pulls together records tied to a car's VIN so you can spot problems that are invisible on a test drive. No single report is complete, and the data comes from many sources, so it is one tool in your due diligence, not the whole job.</p>
<h2>What a report typically shows</h2>
<ul>
<li><strong>Title brands:</strong> whether the car has a clean, salvage, rebuilt, flood or junk title.</li>
<li><strong>Reported accidents and damage:</strong> incidents that were reported to an insurer, body shop or DMV. Minor unreported knocks will not appear.</li>
<li><strong>Odometer readings:</strong> mileage recorded at title transfers and inspections, which helps flag rollback.</li>
<li><strong>Prior use:</strong> markers for rental, fleet, taxi or lease use.</li>
<li><strong>Theft records</strong> and, on some reports, lien or auction history.</li>
<li><strong>Open safety recalls</strong> for that model, which you can also check free at the NHTSA.</li>
</ul>
<h2>What a report does not show</h2>
<p>A history report cannot see current mechanical condition, hidden rust, an unreported fender bender, or the quality of past repairs. That is why a report should always be paired with a test drive and, ideally, a pre-purchase inspection by a mechanic.</p>
<h2>Where the data comes from</h2>
<p>Reports aggregate DMV title records, insurance and salvage databases, auction data and recall notices. Different providers license different sources, so two reports on the same car can differ. Carfax and AutoCheck are the best known; there are also cheaper aggregated reports and free tools like NHTSA recalls and the NICB VINCheck for theft and salvage.</p>
${cta}`,
    faqs: [
      { q: "What does a vehicle history report tell you?", a: "It can show title brands, reported accidents, odometer readings, prior rental or fleet use, theft records and open recalls. It cannot show current mechanical condition or unreported damage." },
      { q: "Is a vehicle history report accurate?", a: "It is only as good as the records it receives. Reported accidents and title brands are usually reliable, but unreported incidents will not appear, so pair the report with an inspection." },
      { q: "Do I need to pay for a vehicle history report?", a: "Not always. Free tools like NHTSA recalls and the NICB VINCheck cover recalls and theft or salvage. A paid report adds aggregated accident, odometer and title history in one place." },
    ],
  },
  {
    slug: "how-to-check-a-car-for-odometer-fraud",
    title: "How to Check a Car for Odometer Fraud",
    metaTitle: "How to Check a Car for Odometer Fraud (Rollback)",
    metaDescription: "Odometer fraud costs used-car buyers billions. How to spot a rolled-back odometer using title history, wear-and-tear clues and service records before you buy.",
    body: `<p>Odometer fraud, or mileage rollback, is when a seller winds back the odometer to make a car look less used and worth more. It is illegal, and it costs American buyers an estimated billion dollars or more every year. Here is how to catch it.</p>
<h2>Check the recorded mileage history</h2>
<p>Every time a car changes hands or passes a state inspection, the mileage is often recorded. A vehicle history report plots these readings. If a later reading is lower than an earlier one, or the numbers jump around, that points to a rolled-back or replaced odometer.</p>
<h2>Match the mileage to the wear</h2>
<ul>
<li>Worn pedals, a shiny steering wheel and a sagging driver's seat on a car claiming very low miles.</li>
<li>Tire wear and replacement stickers that do not match the odometer.</li>
<li>Oil-change and service stickers or records showing higher mileage than the dash.</li>
<li>A digital odometer that has been tampered with can still be caught by the recorded history.</li>
</ul>
<h2>Cross-check the paperwork</h2>
<p>Service records, past inspection certificates and the title itself often list mileage. If the title shows a mileage that is higher than the current reading, walk away. You can also verify recorded readings against the VIN.</p>
${cta}`,
    faqs: [
      { q: "How can you tell if an odometer has been rolled back?", a: "Compare the recorded mileage history from title transfers and inspections. A later reading that is lower than an earlier one is a clear sign. Also match the mileage to the physical wear and service records." },
      { q: "Is odometer rollback illegal?", a: "Yes. Tampering with an odometer to misrepresent mileage is a federal crime in the United States. If you suspect it, do not buy the car and consider reporting it." },
      { q: "Can digital odometers be rolled back?", a: "Yes, digital odometers can be altered with the right tools, but the recorded mileage history from past title transfers and inspections can still expose the fraud." },
    ],
  },
  {
    slug: "how-to-check-a-car-title-status",
    title: "How to Check a Car's Title Status Before Buying",
    metaTitle: "How to Check a Car Title Status: Clean, Salvage, Rebuilt",
    metaDescription: "A car's title status tells you if it is clean, salvage, rebuilt, flood or junk. How to check the title before buying and why a branded title changes the value.",
    body: `<p>A car's title status is one of the most important things to check before buying. It tells you whether the vehicle has a clean history or a brand that warns of serious past damage. A branded title can cut a car's value in half and make it harder to insure and resell.</p>
<h2>The main title brands</h2>
<ul>
<li><strong>Clean:</strong> no reported major damage or write-off.</li>
<li><strong>Salvage:</strong> declared a total loss by an insurer, usually not roadworthy until rebuilt and re-inspected.</li>
<li><strong>Rebuilt or reconstructed:</strong> a salvage car repaired and passed a state inspection to return to the road.</li>
<li><strong>Flood or water damage:</strong> damaged by flooding, which causes long-term electrical and corrosion problems.</li>
<li><strong>Junk:</strong> fit only for parts or scrap, should never be driven.</li>
</ul>
<h2>How to check the title</h2>
<p>Ask to see the physical title and confirm the VIN on it matches the car and the seller's name. Run the VIN through a history report to reveal title brands from any state, and use the free NICB VINCheck for theft and salvage flags. Some states also let you verify a title directly with the DMV.</p>
<h2>Should you buy a branded-title car?</h2>
<p>A rebuilt-title car can be a bargain if it was repaired well and inspected, but expect to pay much less, face higher insurance hurdles and get less back at resale. A salvage or junk title being sold as roadworthy is a serious red flag.</p>
${cta}`,
    faqs: [
      { q: "How do I check a car's title status?", a: "Inspect the physical title and confirm the VIN and seller name match, then run the VIN through a history report and the free NICB VINCheck to reveal any salvage, rebuilt or flood brands from any state." },
      { q: "Is it bad to buy a car with a rebuilt title?", a: "It can be fine if the car was repaired well and passed inspection, but it is worth much less than a clean-title car, can be harder to insure, and sells for less, so pay accordingly." },
      { q: "What is the difference between salvage and rebuilt titles?", a: "A salvage title means an insurer declared the car a total loss. A rebuilt title means that salvage car was repaired and passed a state inspection to legally return to the road." },
    ],
  },
  {
    slug: "how-to-check-if-a-car-has-a-lien",
    title: "How to Check If a Used Car Has a Lien",
    metaTitle: "How to Check If a Used Car Has a Lien Before Buying",
    metaDescription: "A lien means money is still owed on a car and the lender has a claim to it. How to check for a lien before buying so you do not inherit someone else's debt.",
    body: `<p>A lien means a lender still has a legal claim on a car because money is owed on it. If you buy a car with an open lien, you can end up unable to transfer a clean title, or worse, dealing with a lender who wants the loan paid off. Always check before you pay.</p>
<h2>How to check for a lien</h2>
<ul>
<li><strong>Look at the title:</strong> a lienholder is usually listed on the title. If the seller cannot produce a clear title, ask why.</li>
<li><strong>Run the VIN:</strong> many vehicle history reports flag an active lien.</li>
<li><strong>Check with the state DMV:</strong> some states let you look up title and lien status by VIN.</li>
</ul>
<h2>Buying a car that still has a loan</h2>
<p>It is common and can be done safely. The cleanest way is to pay the lender directly for the payoff amount and have them release the lien, then pay the seller any remaining balance. Never hand over the full price to a private seller and trust them to clear the loan afterward.</p>
${cta}`,
    faqs: [
      { q: "How do I know if a car has a lien on it?", a: "Check the title for a listed lienholder, run the VIN through a history report that flags liens, and where available look up the title and lien status with the state DMV." },
      { q: "Can I buy a car that still has a loan on it?", a: "Yes, but do it safely: pay the lender the payoff amount directly so they release the lien, then pay the seller any remaining balance. Do not rely on the seller to clear the loan after you pay in full." },
    ],
  },
  {
    slug: "certified-pre-owned-vs-used",
    title: "Certified Pre-Owned vs Used: Which Should You Buy?",
    metaTitle: "Certified Pre-Owned vs Used Car: Worth the Extra Cost?",
    metaDescription: "Certified pre-owned cars cost more but add a manufacturer inspection and warranty. When CPO is worth it versus a regular used car, and how to decide.",
    body: `<p>Certified pre-owned, or CPO, cars sit between a regular used car and a new one. A manufacturer-backed CPO car has passed a multi-point inspection and comes with an extended warranty, for a higher price. Whether it is worth it depends on the car and your risk tolerance.</p>
<h2>What CPO adds</h2>
<ul>
<li>A manufacturer inspection to a set checklist.</li>
<li>An extended limited warranty beyond the original coverage.</li>
<li>Often extras like roadside assistance or a loaner during repairs.</li>
<li>Usually only newer, lower-mileage cars qualify.</li>
</ul>
<h2>The trade-off</h2>
<p>CPO cars typically cost a few hundred to a couple of thousand dollars more than an equivalent regular used car. You are paying for peace of mind and a warranty. A well-chosen regular used car, checked with a history report and a mechanic's inspection, can be much cheaper and just as sound.</p>
<h2>How to decide</h2>
<p>CPO makes most sense on complex or expensive vehicles where a big repair would hurt, and if you value warranty coverage. For a simple, reliable model, a regular used car with a clean history and an inspection is often the better value. Either way, check the VIN: a CPO badge is not a substitute for verifying the history yourself.</p>
${cta}`,
    faqs: [
      { q: "Is certified pre-owned worth the extra money?", a: "It can be, on complex or expensive cars where a warranty and inspection reduce risk. For simple, reliable models, a regular used car with a clean history and a mechanic's inspection is often better value." },
      { q: "Does certified pre-owned mean no problems?", a: "No. CPO means the car passed the manufacturer's inspection and carries a warranty, but you should still check the VIN history and have it inspected, because inspections and reports can miss things." },
    ],
  },
  {
    slug: "used-car-inspection-checklist",
    title: "Used Car Inspection Checklist (Before You Buy)",
    metaTitle: "Used Car Inspection Checklist: What to Check Before Buying",
    metaDescription: "A practical used-car inspection checklist: exterior, interior, engine, tires, test drive and paperwork. Everything to check before you hand over money.",
    body: `<p>A careful inspection catches problems that a listing photo hides. Use this checklist when you view a used car, and pair it with a VIN history check and, for anything expensive, a professional pre-purchase inspection.</p>
<h2>Exterior</h2>
<ul>
<li>Panel gaps that line up evenly, and paint that matches, which can reveal past accident repairs.</li>
<li>Rust around wheel arches, sills and under the car.</li>
<li>Tires: even tread wear and a matching set. Uneven wear points to alignment or suspension issues.</li>
<li>All lights and the windshield for chips or cracks.</li>
</ul>
<h2>Interior</h2>
<ul>
<li>Wear on the seat, pedals and steering wheel that matches the mileage.</li>
<li>Electronics: windows, locks, AC, infotainment and warning lights.</li>
<li>Signs of water damage or a musty smell, which can mean flood history.</li>
</ul>
<h2>Under the hood and the test drive</h2>
<ul>
<li>Oil and coolant condition, and no obvious leaks.</li>
<li>Cold start: listen for knocks and watch for smoke.</li>
<li>Test drive: brakes, steering, transmission shifts, and any vibration or pulling.</li>
</ul>
<h2>Paperwork</h2>
<ul>
<li>Title in the seller's name with a matching VIN and no unexpected lien.</li>
<li>Service records and a VIN history report clear of major title brands.</li>
<li>Open recalls, which you can check free at the NHTSA.</li>
</ul>
${cta}`,
    faqs: [
      { q: "What should I check when buying a used car?", a: "Inspect the exterior for accident and rust signs, the interior for wear and water damage, the engine and a test drive for mechanical issues, and the paperwork including title, VIN history and open recalls." },
      { q: "Should I get a used car inspected by a mechanic?", a: "For anything expensive or complex, yes. A pre-purchase inspection by an independent mechanic catches mechanical problems that a history report and a test drive can miss, and often pays for itself." },
    ],
  },
  {
    slug: "how-to-check-a-cars-accident-history",
    title: "How to Check a Car's Accident History",
    metaTitle: "How to Check a Car's Accident History Before Buying",
    metaDescription: "How to check whether a used car has been in an accident: history reports, physical signs of repair and paint work, and why unreported damage may not appear.",
    body: `<p>Past accident damage can hide serious structural problems and slash a car's value. Checking accident history takes a history report plus a careful look for repair signs, because not every crash is reported.</p>
<h2>Run a history report</h2>
<p>A vehicle history report can show accidents that were reported to an insurer, body shop, police or DMV, along with airbag deployments and structural damage flags. Remember that a minor unreported fender bender fixed privately will not show up.</p>
<h2>Look for physical repair signs</h2>
<ul>
<li>Paint that does not match between panels, or overspray on trim and rubber seals.</li>
<li>Uneven panel gaps and misaligned doors, hood or trunk.</li>
<li>Fresh undercoating or bolts that look disturbed, suggesting replaced panels.</li>
<li>Ripples in the metal or a body line that does not run straight.</li>
</ul>
<h2>When in doubt, inspect</h2>
<p>A body shop or a mechanic can spot repaired structural damage that a report misses. On an expensive car, a pre-purchase inspection is cheap insurance against buying a poorly repaired wreck.</p>
${cta}`,
    faqs: [
      { q: "How do I find out if a used car has been in an accident?", a: "Run a VIN history report, which shows reported accidents and structural or airbag flags, and inspect the car for mismatched paint, uneven panel gaps and signs of replaced panels. Unreported damage may not appear in a report." },
      { q: "Will a history report show every accident?", a: "No. It shows accidents that were reported to an insurer, body shop, police or DMV. A minor crash fixed privately without a claim will not appear, which is why a physical inspection matters." },
    ],
  },
  {
    slug: "how-to-buy-a-used-car-safely-online",
    title: "How to Buy a Used Car Safely Online",
    metaTitle: "How to Buy a Used Car Safely Online (Avoid Scams)",
    metaDescription: "Buying a used car online is convenient but scam-prone. How to verify the seller, the car and the price, and the red flags that mean you should walk away.",
    body: `<p>Buying a used car online opens up more choice, but it also attracts scammers. A few checks protect you from fake listings, curbstoners and cars that are not what they seem.</p>
<h2>Verify the car</h2>
<ul>
<li>Get the VIN from the seller and run a history check for title brands, mileage and recalls.</li>
<li>Ask for extra photos of the VIN plate, odometer, tires and any damage.</li>
<li>Confirm the seller's name matches the title and registration.</li>
</ul>
<h2>Spot the red flags</h2>
<ul>
<li>A price well below market value, with pressure to act fast.</li>
<li>A seller who refuses a video call, an in-person viewing or an independent inspection.</li>
<li>Requests for payment by wire transfer, gift cards or a third-party "escrow" you did not choose.</li>
<li>A story about being deployed or overseas and needing to ship the car sight unseen.</li>
</ul>
<h2>Complete the sale safely</h2>
<p>See the car in person or send a local mechanic for a pre-purchase inspection. Pay in a traceable way, ideally at the bank when handling the title. Never send a deposit for a car you have not verified, and never pay in full before the title is in hand.</p>
${cta}`,
    faqs: [
      { q: "How do I avoid scams when buying a car online?", a: "Verify the VIN with a history check, insist on an in-person viewing or a local inspection, confirm the seller matches the title, and never pay by wire, gift card or unverified escrow, or send a deposit for a car you have not seen." },
      { q: "Is it safe to buy a used car sight unseen?", a: "It is risky. If you cannot view the car yourself, pay for a local pre-purchase inspection and verify the VIN and title first. Be very wary of any seller who discourages inspection." },
    ],
  },
];

const arr = JSON.parse(fs.readFileSync(PATH, "utf8"));
const have = new Set(arr.map((a) => a.slug));
let added = 0;
for (const n of NEW) {
  if (have.has(n.slug)) { console.log("skip (exists):", n.slug); continue; }
  arr.push({ slug: n.slug, title: n.title, metaTitle: n.metaTitle, metaDescription: n.metaDescription, bodyHtml: enc(n.body), faqs: n.faqs });
  added++;
}
fs.writeFileSync(PATH, JSON.stringify(arr, null, 2));
console.log(`added ${added}, total now ${arr.length}`);
