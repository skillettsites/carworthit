import { classifyTrafficSource, isTrafficSource, parseReferrerSource, stripQuery, type Attribution } from './attribution';

/**
 * First-touch attribution, captured in the browser on the first page of a
 * visit and sent with the checkout request so it lands in the Stripe session's
 * metadata.
 *
 * Why this exists: Stripe held no source for any sale, and GA never sees the
 * post-payment landing with its query string (GoogleAnalytics.tsx strips it on
 * purpose), so there was no way to say which channel a buyer came from. The
 * first sale (23 August 2026) landed straight on /report/<VIN> and GA recorded
 * it as unattributed.
 *
 * Stored in localStorage for 30 days, so a reader who finds a guide through
 * Bing and comes back two days later to paste a VIN is still credited to Bing.
 * The first touch wins; later visits never overwrite it. Every storage access
 * is guarded: private windows and blocked storage throw, and attribution must
 * never break the page or the checkout.
 */

const KEY = 'cwi_attribution';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Our own pages and the Stripe return trip are not referrers. */
const SELF_OR_CHECKOUT = /(^|\.)carworthit\.com$|(^|\.)stripe\.com$|(^|\.)vercel\.app$|^localhost$/;

function read(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Attribution;
    const seen = a.first_seen ? Date.parse(a.first_seen) : NaN;
    if (!Number.isFinite(seen) || Date.now() - seen > TTL_MS) return null;
    return a;
  } catch {
    return null;
  }
}

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  if (read()) return;

  const params = new URLSearchParams(window.location.search);
  const a: Attribution = {};
  const utm = (k: string) => params.get(k)?.trim().slice(0, 200) || undefined;
  a.utm_source = utm('utm_source');
  a.utm_medium = utm('utm_medium');
  a.utm_campaign = utm('utm_campaign');
  a.utm_content = utm('utm_content');
  a.utm_term = utm('utm_term');

  let refHost = '';
  try {
    refHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '';
  } catch {
    refHost = '';
  }
  if (refHost && !SELF_OR_CHECKOUT.test(refHost)) {
    a.referrer = stripQuery(document.referrer);
  }
  a.referrer_source = parseReferrerSource(a.referrer, a.utm_source);
  a.landing_page = window.location.pathname;
  a.traffic_source = classifyTrafficSource({ referrer: a.referrer, utm_source: a.utm_source, utm_medium: a.utm_medium });
  a.first_seen = new Date().toISOString();

  // Drop empty keys so the stored object stays small.
  for (const k of Object.keys(a) as (keyof Attribution)[]) if (a[k] === undefined) delete a[k];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage unavailable: this visit simply goes unattributed */
  }
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  const a = read();
  if (!a) return null;
  if (!isTrafficSource(a.traffic_source)) {
    a.traffic_source = classifyTrafficSource({ referrer: a.referrer, utm_source: a.utm_source, utm_medium: a.utm_medium });
  }
  return a;
}
