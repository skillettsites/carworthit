/**
 * Detect common typos in popular email-domain endings and suggest a
 * correction. Triggered after a checkout completes so the report email
 * can be re-delivered to the corrected address even when the buyer
 * mistyped their inbox.
 *
 * Ported unchanged from CarCostCheck, where it was written against real
 * observed cases (a @gnail.com and a @gmail.co, both of whom would otherwise
 * have paid and received nothing). The failure it prevents is the worst one
 * this site has: a buyer whose only copy of the report is an email that was
 * never deliverable.
 *
 * Conservative by design: returns null unless the typo is unambiguous
 * (single-edit-distance from a known major-provider domain). Never
 * "corrects" a real but unfamiliar TLD like .co.uk.
 */

const DOMAIN_TYPOS: Record<string, string> = {
  // Gmail
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cmo": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.comm": "gmail.com",
  "gnail.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmali.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmaill.com": "gmail.com",
  // Googlemail
  "googlemail.co": "googlemail.com",
  "googlemail.cm": "googlemail.com",
  "googlemail.con": "googlemail.com",
  // Hotmail
  "hotmail.co": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.cmo": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotnail.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  // Yahoo
  "yaho.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yaohoo.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  "yahoo.co": "yahoo.com",
  // Outlook
  "outloook.com": "outlook.com",
  "outlock.com": "outlook.com",
  "outlok.com": "outlook.com",
  "outloook.co": "outlook.com",
  "outlook.co": "outlook.com",
  "outlook.cm": "outlook.com",
  // iCloud
  "iclooud.com": "icloud.com",
  "iclud.com": "icloud.com",
  "icould.com": "icloud.com",
  "icloud.co": "icloud.com",
  // Live
  "live.cm": "live.com",
  "live.con": "live.com",
  "live.co": "live.com",
  // AOL
  "aol.co": "aol.com",
  "aol.con": "aol.com",
  "aol.cm": "aol.com",
};

/**
 * Returns a corrected email address if the input contains a recognised
 * domain typo, otherwise null.
 *
 * Examples:
 *   detectEmailTypo("foo@gmail.co")      // "foo@gmail.com"
 *   detectEmailTypo("foo@gnail.com")     // "foo@gmail.com"
 *   detectEmailTypo("foo@gmail.com")     // null (no typo)
 *   detectEmailTypo("foo@bar.co.uk")     // null (real domain, untouched)
 */
export function detectEmailTypo(email: string): string | null {
  if (!email || typeof email !== "string") return null;
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase().trim();
  const corrected = DOMAIN_TYPOS[domain];
  if (!corrected || corrected === domain) return null;
  return `${local}@${corrected}`;
}
