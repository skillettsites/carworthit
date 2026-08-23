import { SITE_URL } from './constants';

/**
 * Short, shareable handle for a paid report, derived from its Stripe session id.
 *
 * Stripe session ids look like this (illustrative, not a real one: a real id
 * is the bearer credential for somebody's paid report and this repo is public):
 *   cs_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 *
 * The canonical report URL is /report/<VIN>?paid=<that whole thing>, which is
 * fine for a redirect the browser performs but poor in an email: it wraps
 * across lines, it looks like tracking junk, and some clients truncate it.
 * So the email carries the last 12 characters as /r/<token> instead, and
 * `get_cwi_session_by_token` (migration 005) turns it back into the session id.
 *
 * This is deliberately NOT a cryptographic credential. Anyone holding the
 * token could equally hold the session id, which is already the access
 * credential for the report. It is a handle that is unguessable at any volume
 * this site will ever see: 12 characters from Stripe's alphabet is on the
 * order of 10^21 combinations against a table currently holding one row.
 */
const TOKEN_LENGTH = 12;

export function deriveReportToken(stripeSessionId: string | null | undefined): string | null {
  if (!stripeSessionId) return null;
  const trimmed = stripeSessionId.trim();
  if (trimmed.length < TOKEN_LENGTH) return null;
  return trimmed.slice(-TOKEN_LENGTH);
}

/**
 * Check a token's shape before it reaches the database.
 *
 * Not security (the function is parameterised and checks the length itself),
 * just keeping obvious junk (favicon requests, truncated links, scanner noise)
 * out of the round trip.
 */
export function isValidReportToken(token: string | null | undefined): token is string {
  if (!token) return false;
  if (token.length !== TOKEN_LENGTH) return false;
  return /^[A-Za-z0-9]+$/.test(token);
}

/** The short link that goes in the email. Resolves to the order's first VIN. */
export function buildReportUrl(
  stripeSessionId: string | null | undefined,
  origin: string = SITE_URL,
): string | null {
  const token = deriveReportToken(stripeSessionId);
  if (!token) return null;
  return `${origin.replace(/\/$/, '')}/r/${token}`;
}

/**
 * The short link for one specific vehicle in a multi-vehicle order.
 *
 * One payment can cover five cars, and the email lists them individually, so
 * each row needs its own destination. Pointing all five at the bare token
 * would send every row to the first car, which reads as a broken email even
 * though the report itself is fine.
 *
 * The VIN is a hint, not a credential: /r/<token> re-checks it against the
 * paid order before redirecting, so a tampered value falls back to the first
 * vehicle rather than unlocking a car nobody paid for.
 */
export function buildVehicleUrl(
  stripeSessionId: string | null | undefined,
  vin: string,
  origin: string = SITE_URL,
): string | null {
  const base = buildReportUrl(stripeSessionId, origin);
  if (!base) return null;
  return `${base}?v=${encodeURIComponent(vin)}`;
}

/**
 * The canonical report URL, used as the redirect target once /r/<token> has
 * resolved and as a fallback anywhere the token cannot be derived.
 */
export function buildDirectReportUrl(
  vin: string,
  stripeSessionId: string,
  origin: string = SITE_URL,
): string {
  return `${origin.replace(/\/$/, '')}/report/${encodeURIComponent(vin)}?paid=${encodeURIComponent(stripeSessionId)}`;
}

/** The side-by-side page for a multi-vehicle order. */
export function buildCompareUrl(stripeSessionId: string, origin: string = SITE_URL): string {
  return `${origin.replace(/\/$/, '')}/compare?paid=${encodeURIComponent(stripeSessionId)}`;
}
