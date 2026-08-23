import { Resend } from 'resend';
import { PRODUCTS, SITE_NAME, SITE_URL, SUPPORT_EMAIL, isProductId, type ProductId } from './constants';
import { buildReportUrl, buildVehicleUrl, buildCompareUrl } from './report-token';

/**
 * Delivery of the thing the customer actually bought.
 *
 * Before this existed, a paid report lived only in whichever browser tab
 * Stripe redirected back into. The first sale (23 Aug 2026) was made on a
 * phone at midnight and we had no way to send the buyer their own report.
 *
 * Two rules, both learned on CarCostCheck:
 *
 *   1. The email is a DELIVERY ENVELOPE, not a second copy of the report. It
 *      carries a link and almost nothing else. The report at that link is
 *      canonical, so it always shows current data including any correction
 *      made after delivery, and there is no second rendering of the figures
 *      to drift out of step with the first.
 *   2. It must never throw into the webhook. A send failure is worth knowing
 *      about, but it is not worth a 500 that makes Stripe retry a payment.
 *      Every path here returns a status instead.
 */

const RESEND_KEY = (process.env.RESEND_API_KEY || '').replace(/\\n$/, '').trim();

export const HAS_EMAIL = !!RESEND_KEY;

const resend = HAS_EMAIL ? new Resend(RESEND_KEY) : null;

/**
 * Sender address.
 *
 * Overridable by env so the address can be pointed somewhere deliverable
 * while carworthit.com is still verifying in Resend, without a redeploy.
 * The default is the address we want on every email once it is verified.
 */
const FROM_EMAIL = (process.env.RESEND_FROM || `${SITE_NAME} <reports@carworthit.com>`)
  .replace(/\\n$/, '')
  .trim();

export type EmailStatus = 'sent' | 'no_email' | 'failed' | 'skipped_disabled';

/** Values interpolated into the HTML are customer-controlled. Escape them. */
function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Resend tag values must match /^[A-Za-z0-9_-]+$/. */
function sanitiseTag(v: string): string {
  return v.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 256);
}

/** Last 6 of a VIN, which is how people read one aloud without the whole string. */
function vinTail(vin: string): string {
  return vin.length > 6 ? vin.slice(-6) : vin;
}

export interface ReportEmailArgs {
  to: string;
  product: ProductId;
  /** Every vehicle the payment covers, in order, with its report link. */
  vehicles: Array<{ vin: string; name: string | null; url: string | null }>;
  /** Present only for a multi-vehicle order. */
  compareUrl?: string | null;
  stripeSessionId: string;
  /** Tag only, so a resend can be told apart from the original in Resend. */
  retryAttempt?: string;
}

/**
 * Send the report link. Never throws.
 */
export async function sendReportEmail(args: ReportEmailArgs): Promise<EmailStatus> {
  const { to, product, vehicles, compareUrl, stripeSessionId, retryAttempt } = args;

  if (!to || !to.includes('@')) return 'no_email';
  if (!resend) {
    console.error('[cwi:email] RESEND_API_KEY not set, cannot deliver', stripeSessionId);
    return 'skipped_disabled';
  }
  if (!isProductId(product)) return 'failed';

  const label = PRODUCTS[product].name;
  const multi = vehicles.length > 1;
  const first = vehicles[0];
  const subject = multi
    ? `Your ${vehicles.length} ${label} reports are ready`
    : `Your ${label}: ${first?.name || `VIN ${vinTail(first?.vin || '')}`}`;

  const tags = [
    { name: 'product', value: sanitiseTag(product) },
    { name: 'session_id', value: sanitiseTag(stripeSessionId) },
    { name: 'vehicles', value: String(vehicles.length) },
  ];
  if (retryAttempt) tags.push({ name: 'retry_attempt', value: sanitiseTag(retryAttempt) });

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: SUPPORT_EMAIL,
      to,
      subject,
      html: buildReportEmailHtml({ product, vehicles, compareUrl }),
      text: buildReportEmailText({ product, vehicles, compareUrl }),
      tags,
      headers: {
        'List-Unsubscribe': `<mailto:${SUPPORT_EMAIL}>`,
      },
    });
    if (error) {
      // Resend reports most failures in the body rather than by throwing, so
      // without this check a rejected send looks identical to a delivered one.
      console.error('[cwi:email] send rejected', stripeSessionId, JSON.stringify(error).slice(0, 300));
      return 'failed';
    }
    return 'sent';
  } catch (err) {
    console.error('[cwi:email] send threw', stripeSessionId, err instanceof Error ? err.message : String(err));
    return 'failed';
  }
}

interface BodyArgs {
  product: ProductId;
  vehicles: Array<{ vin: string; name: string | null; url: string | null }>;
  compareUrl?: string | null;
}

/**
 * Plain-text alternative.
 *
 * Not decoration: a text/plain part measurably helps a transactional email
 * reach the inbox rather than the spam folder, and it is the only version some
 * clients will show. If the buyer only ever sees this, the link still works.
 */
export function buildReportEmailText({ product, vehicles, compareUrl }: BodyArgs): string {
  const label = PRODUCTS[product].name;
  const lines: string[] = [];
  lines.push(`Your ${SITE_NAME} ${label} is ready.`);
  lines.push('');
  for (const v of vehicles) {
    lines.push(v.name ? `${v.name} (VIN ${v.vin})` : `VIN ${v.vin}`);
    lines.push(v.url ? v.url : 'Link unavailable, reply to this email and we will send it.');
    lines.push('');
  }
  if (compareUrl) {
    lines.push('Side-by-side comparison of all of them:');
    lines.push(compareUrl);
    lines.push('');
  }
  const many = vehicles.length > 1;
  lines.push(`Keep this email. The ${many ? 'links do' : 'link does'} not expire and ${many ? 'need' : 'needs'} no login,`);
  lines.push(`so you can open your ${many ? 'reports' : 'report'} on any device whenever you need ${many ? 'them' : 'it'}.`);
  lines.push('');
  lines.push(`${SITE_NAME} - ${SITE_URL}`);
  lines.push('Market values are estimates, not appraisals, and this is not a');
  lines.push('mechanical inspection. Always verify before you buy.');
  return lines.join('\n');
}

export function buildReportEmailHtml({ product, vehicles, compareUrl }: BodyArgs): string {
  const label = PRODUCTS[product].name;
  const multi = vehicles.length > 1;

  const button = (url: string, text: string) => `
        <a href="${esc(url)}" target="_blank" style="display:inline-block;padding:16px 36px;background:#0074d4;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;border-radius:8px;box-shadow:0 4px 12px rgba(0,116,212,0.25);">
          ${text}
        </a>`;

  // Single vehicle: one badge, one big button. This is the overwhelmingly
  // common shape and it should not look like a list of one.
  const singleHtml = !multi
    ? `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="display:inline-block;background:#0b1220;border:2px solid #0074d4;border-radius:8px;padding:8px 22px;font-size:15px;font-weight:700;letter-spacing:2px;font-family:'Courier New',monospace;color:#ffffff;">
          ${esc(vehicles[0]?.vin || '')}
        </div>
        ${vehicles[0]?.name ? `<p style="margin:12px 0 0;color:#111827;font-size:17px;font-weight:600;">${esc(vehicles[0].name)}</p>` : ''}
      </div>
      <div style="text-align:center;margin:24px 0 20px;">
        ${vehicles[0]?.url ? button(vehicles[0].url, 'View your report &rarr;') : ''}
        <p style="margin:10px 0 0;font-size:12px;color:#6b7280;">Opens on any device, no login</p>
        ${vehicles[0]?.url ? `<p style="margin:6px 0 0;font-size:10px;color:#9ca3af;word-break:break-all;">${esc(vehicles[0].url)}</p>` : ''}
      </div>`
    : '';

  // Multi-vehicle: a row per car, each with its own link, then the comparison.
  const multiHtml = multi
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:8px 0 20px;">
        ${vehicles
          .map(
            (v) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
            <div style="font-size:14px;font-weight:600;color:#111827;">${esc(v.name || 'Vehicle')}</div>
            <div style="font-size:11px;color:#6b7280;font-family:'Courier New',monospace;letter-spacing:1px;">${esc(v.vin)}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:right;">
            ${
              v.url
                ? `<a href="${esc(v.url)}" style="display:inline-block;background:#0074d4;color:#ffffff;font-size:13px;font-weight:700;padding:8px 14px;border-radius:7px;text-decoration:none;">View report</a>`
                : `<span style="font-size:12px;color:#6b7280;">Reply and we will send this one</span>`
            }
          </td>
        </tr>`,
          )
          .join('')}
      </table>
      ${compareUrl ? `<div style="text-align:center;margin:0 0 20px;">${button(compareUrl, 'Compare all of them &rarr;')}</div>` : ''}`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <div style="text-align:center;padding:24px;background:linear-gradient(135deg,#0b1220,#132030);border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">${SITE_NAME}</h1>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">${esc(label)}${multi ? `, ${vehicles.length} vehicles` : ''}</p>
    </div>

    <div style="background:#fff;padding:28px 24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
      ${singleHtml}
      ${multiHtml}

      <div style="border-top:1px solid #e5e7eb;margin:24px 0 16px;"></div>

      <p style="text-align:center;font-size:11px;color:#6b7280;margin:0;line-height:1.5;">
        Keep this email. Your ${multi ? 'reports live' : 'report lives'} online at the ${multi ? 'links' : 'link'} above, so ${multi ? 'they' : 'it'} always ${multi ? 'show' : 'shows'} the latest data including anything we correct after delivery. ${multi ? 'They do' : 'It does'} not expire and ${multi ? 'need' : 'needs'} no login.
      </p>
    </div>

    <div style="text-align:center;padding:18px 16px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;margin-top:12px;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Delivered by <a href="${SITE_URL}" style="color:#0074d4;text-decoration:none;">carworthit.com</a>
      </p>
      <p style="margin:6px 0 0;font-size:10px;color:#c4c8cf;line-height:1.5;">
        Market values are estimates, not appraisals, and this is not a mechanical inspection or a title history search.
        We are not an approved NMVTIS data provider. Always verify independently before you buy.
        See our <a href="${SITE_URL}/disclaimer" style="color:#9ca3af;text-decoration:underline;">full disclaimer</a>.
      </p>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Work out where each car in an order should link to.
 *
 * A single-vehicle order gets the bare token, which is the shortest and
 * tidiest link we can send. A multi-vehicle order gets one link per car,
 * because the email lists them individually and three rows pointing at the
 * same URL reads as a broken email even when the report behind it is fine.
 *
 * Exported so the QA harness renders exactly what a buyer receives rather
 * than its own approximation of it. That distinction is not academic: the
 * harness quietly built its own links first time round and hid this bug.
 */
export function buildOrderVehicles(
  stripeSessionId: string,
  vins: string[],
  names: Array<string | null>,
): Array<{ vin: string; name: string | null; url: string | null }> {
  const multi = vins.length > 1;
  return vins.map((vin, i) => ({
    vin,
    name: names[i] ?? null,
    url: multi ? buildVehicleUrl(stripeSessionId, vin) : buildReportUrl(stripeSessionId),
  }));
}

/**
 * Assemble the per-vehicle links for an order and send it.
 *
 * Kept next to the sender so the webhook stays a webhook: it verifies the
 * signature, works out who to email, and hands off.
 */
export async function sendOrderEmail(args: {
  to: string;
  product: ProductId;
  vins: string[];
  names: Array<string | null>;
  stripeSessionId: string;
  retryAttempt?: string;
}): Promise<EmailStatus> {
  const { to, product, vins, names, stripeSessionId, retryAttempt } = args;

  const vehicles = buildOrderVehicles(stripeSessionId, vins, names);

  return sendReportEmail({
    to,
    product,
    vehicles,
    compareUrl: vins.length > 1 ? buildCompareUrl(stripeSessionId) : null,
    stripeSessionId,
    retryAttempt,
  });
}
