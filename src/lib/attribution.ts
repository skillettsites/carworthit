/**
 * Traffic-source classification shared by the browser (first-touch capture)
 * and the checkout route (Stripe metadata).
 *
 * Pure module: no imports, no window, no env, so the browser and the server
 * classify a visit the same way. Ported from HomeBuyerCheck's version, with
 * the UK-only referrers dropped and the US search engines and assistants that
 * actually send this site traffic named explicitly.
 */

export type TrafficSource = 'ai' | 'organic' | 'paid' | 'social' | 'referral' | 'direct' | 'other';

export const TRAFFIC_SOURCES: readonly TrafficSource[] = ['ai', 'organic', 'paid', 'social', 'referral', 'direct', 'other'];

/** AI assistants that send referral traffic. Matched on host. */
const AI_HOSTS = [
  'chatgpt.com',
  'chat.openai.com',
  'copilot.microsoft.com',
  'copilot.com',
  'perplexity.ai',
  'claude.ai',
  'gemini.google.com',
];

/** utm_source / utm_medium values that name an AI assistant (ChatGPT appends utm_source=chatgpt.com). */
const AI_UTM_PATTERN = /^(chatgpt|openai|chat\.openai|copilot|microsoft[-_ ]?copilot|perplexity|claude|anthropic|gemini|bing[-_ ]?chat)(\.|$|[-_ ])/;

const SEARCH_HOSTS = [
  'google.',
  'bing.com',
  'yahoo.',
  'duckduckgo.com',
  'ecosia.org',
  'search.brave.com',
  'yandex.',
  'qwant.com',
  'startpage.com',
  'ask.com',
  'aol.com',
  'baidu.com',
];

const SOCIAL_HOSTS = [
  'facebook.com',
  'fb.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  't.co',
  'reddit.com',
  'linkedin.com',
  'tiktok.com',
  'pinterest.',
  'youtube.com',
  'youtu.be',
  'nextdoor.',
  'threads.net',
];

const PAID_MEDIUMS = new Set(['cpc', 'ppc', 'paid', 'paidsearch', 'paid_search', 'paid-search', 'paid_social', 'paid-social', 'display', 'cpm']);

function parseUrl(referrer: string | null | undefined): { host: string; path: string } | null {
  if (!referrer) return null;
  try {
    const u = new URL(referrer);
    return { host: u.hostname.toLowerCase().replace(/^www\./, ''), path: u.pathname.toLowerCase() };
  } catch {
    return null;
  }
}

function hostMatches(host: string, needle: string): boolean {
  // "google." matches google.com and google.co.uk; "bing.com" matches bing.com and cn.bing.com.
  if (needle.endsWith('.')) return host === needle.slice(0, -1) || host.startsWith(needle) || host.includes('.' + needle);
  return host === needle || host.endsWith('.' + needle);
}

/** True when the referrer is one of the named AI assistants (including bing.com/chat). */
export function isAiReferrer(referrer: string | null | undefined): boolean {
  const u = parseUrl(referrer);
  if (!u) return false;
  if (AI_HOSTS.some((h) => hostMatches(u.host, h))) return true;
  return hostMatches(u.host, 'bing.com') && (u.path.startsWith('/chat') || u.path.startsWith('/copilot'));
}

/** True when a utm_source (or utm_medium) names an AI assistant. */
export function isAiUtm(value: string | null | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return !!v && AI_UTM_PATTERN.test(v);
}

/**
 * Short, stable label for where the visit came from: chatgpt, copilot,
 * perplexity, bing, duckduckgo, yahoo, google and so on. Unknown hosts fall
 * through to the bare hostname. A utm_source naming an assistant wins, because
 * ChatGPT often sends no referrer at all but does tag its links.
 */
export function parseReferrerSource(referrer: string | null | undefined, utmSource?: string | null): string | undefined {
  const utm = (utmSource ?? '').trim().toLowerCase();
  if (utm && isAiUtm(utm)) {
    if (utm.startsWith('chatgpt') || utm.startsWith('openai') || utm.startsWith('chat.openai')) return 'chatgpt';
    if (utm.includes('copilot') || utm.startsWith('bing')) return 'copilot';
    if (utm.startsWith('perplexity')) return 'perplexity';
    if (utm.startsWith('claude') || utm.startsWith('anthropic')) return 'claude';
    if (utm.startsWith('gemini')) return 'gemini';
  }
  const u = parseUrl(referrer);
  if (!u) return undefined;
  const host = u.host;
  if (hostMatches(host, 'chatgpt.com') || hostMatches(host, 'chat.openai.com')) return 'chatgpt';
  if (hostMatches(host, 'copilot.microsoft.com') || hostMatches(host, 'copilot.com')) return 'copilot';
  if (hostMatches(host, 'bing.com') && (u.path.startsWith('/chat') || u.path.startsWith('/copilot'))) return 'copilot';
  if (hostMatches(host, 'perplexity.ai')) return 'perplexity';
  if (hostMatches(host, 'claude.ai')) return 'claude';
  if (hostMatches(host, 'gemini.google.com')) return 'gemini';
  if (host.includes('google')) return 'google';
  if (host.includes('bing')) return 'bing';
  if (host.includes('duckduckgo')) return 'duckduckgo';
  if (host.includes('yahoo')) return 'yahoo';
  if (host.includes('ecosia')) return 'ecosia';
  if (host.includes('brave')) return 'brave';
  if (host.includes('facebook') || host === 'fb.com') return 'facebook';
  if (host.includes('reddit')) return 'reddit';
  if (host.includes('twitter') || host === 'x.com' || host === 't.co') return 'twitter';
  return host;
}

export interface ClassifyInput {
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
}

/**
 * Classify a visit into a channel. Order matters:
 *  1. AI named in utm_source / utm_medium
 *  2. paid utm_medium
 *  3. AI referrer host
 *  4. search engine referrer
 *  5. social referrer
 *  6. any other referrer -> referral; any other utm -> other; nothing -> direct
 */
export function classifyTrafficSource(input: ClassifyInput): TrafficSource {
  const medium = (input.utm_medium ?? '').trim().toLowerCase();
  const source = (input.utm_source ?? '').trim().toLowerCase();
  if (isAiUtm(source) || isAiUtm(medium)) return 'ai';
  if (PAID_MEDIUMS.has(medium)) return 'paid';
  if (isAiReferrer(input.referrer)) return 'ai';
  const u = parseUrl(input.referrer);
  if (u) {
    if (SEARCH_HOSTS.some((h) => hostMatches(u.host, h))) return 'organic';
    if (SOCIAL_HOSTS.some((h) => hostMatches(u.host, h))) return 'social';
    return 'referral';
  }
  if (source || medium) return 'other';
  return 'direct';
}

export function isTrafficSource(value: unknown): value is TrafficSource {
  return typeof value === 'string' && (TRAFFIC_SOURCES as readonly string[]).includes(value);
}

/** Drop the query string and fragment: a referrer or landing URL can carry search terms or tokens. */
export function stripQuery(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return undefined;
  }
}

/** The attribution fields the browser sends with a checkout request. */
export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  referrer_source?: string;
  landing_page?: string;
  traffic_source?: TrafficSource;
  /** ISO timestamp of the first touch. */
  first_seen?: string;
}

const FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'referrer',
  'referrer_source',
  'landing_page',
  'first_seen',
] as const;

/**
 * Normalise whatever the browser sent into Stripe-safe metadata: strings only,
 * each at most 200 characters (Stripe's limit is 500), the referrer without its
 * query string, and the channel classified server-side when the browser's
 * value is missing or unknown. Every key is always present so a session with
 * no attribution reads as "direct" rather than as missing data.
 */
export function attributionMetadata(raw: unknown): Record<string, string> {
  const a = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const s = (k: string) => (typeof a[k] === 'string' ? (a[k] as string).trim().slice(0, 200) : '');
  const out: Record<string, string> = {};
  for (const k of FIELDS) out[k] = s(k);
  out.referrer = stripQuery(out.referrer)?.slice(0, 200) ?? '';
  // A landing page is a path. Anything else (a full URL, a query string) is trimmed to the path.
  out.landing_page = out.landing_page.split(/[?#]/)[0];
  if (!out.referrer_source) out.referrer_source = parseReferrerSource(out.referrer, out.utm_source) ?? '';
  out.traffic_source = isTrafficSource(a.traffic_source)
    ? a.traffic_source
    : classifyTrafficSource({ referrer: out.referrer, utm_source: out.utm_source, utm_medium: out.utm_medium });
  return out;
}
