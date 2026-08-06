#!/usr/bin/env node
// Notify Google of new/changed CarWorthIt URLs via the Indexing API.
//
// Same mechanism CarCostCheck uses (service account from commandcenter's
// .env.local, JWT -> access token -> urlNotifications:publish), so there is one
// pattern to maintain rather than two.
//
// ⚠️ Two things to be honest about:
//   1. Google's Indexing API is officially scoped to JobPosting and
//      BroadcastEvent. For other pages it is a supplementary nudge, not a
//      guarantee. Sitemap + internal links remain the primary route in.
//   2. The service account must be an owner of the property in Search Console,
//      otherwise every call returns 403. That is the usual failure here.
//
// Bing/Yandex are handled separately by IndexNow, which Google does not join.
//
// Usage: node scripts/gsc-submit.mjs [--all]

import crypto from 'crypto';
import https from 'https';
import { readFileSync, existsSync } from 'fs';

const BASE = 'https://carworthit.com';

// The 10 genuinely new pages. Deliberately first, because Google's per-project
// quota is finite and new URLs benefit far more than re-submitted ones.
const NEW = [
  '/blog/what-is-diminished-value',
  '/blog/how-to-calculate-diminished-value',
  '/blog/how-to-file-a-diminished-value-claim',
  '/blog/diminished-value-by-state',
  '/blog/does-an-accident-lower-car-value',
  '/blog/trade-in-value-after-accident',
  '/blog/kelley-blue-book-alternatives',
  '/blog/kbb-vs-edmunds-vs-nada',
  '/blog/carvana-vs-carmax-offer',
  '/blog/how-to-price-a-used-car-by-vin',
];

// Pages whose canonical previously pointed at the homepage, so Google was being
// told they were duplicates. Worth re-submitting now that is fixed.
const CANONICAL_FIXED = [
  '/guides',
  '/guides/what-is-a-vin',
  '/guides/used-car-checklist',
  '/guides/salvage-title-explained',
  '/privacy',
  '/terms',
];

const CHANGED = ['/', '/pricing', '/how-it-works', '/about', '/methodology', '/press', '/blog', '/sample-report'];

const urls = (process.argv.includes('--all') ? [...NEW, ...CANONICAL_FIXED, ...CHANGED] : [...NEW, ...CANONICAL_FIXED]).map(
  (p) => `${BASE}${p}`,
);

function loadEnv() {
  const p = 'C:/Users/daves/claude/commandcenter/.env.local';
  if (!existsSync(p)) throw new Error('commandcenter/.env.local not found');
  const content = readFileSync(p, 'utf-8');
  const CLIENT_EMAIL = content.match(/GA_CLIENT_EMAIL=(.+)/)?.[1]?.trim();
  const keyMatch = content.match(/GA_PRIVATE_KEY="([\s\S]*?)"/);
  const PRIVATE_KEY = keyMatch ? keyMatch[1].replace(/\\n/g, '\n') : null;
  if (!CLIENT_EMAIL || !PRIVATE_KEY) throw new Error('GA_CLIENT_EMAIL / GA_PRIVATE_KEY missing');
  return { CLIENT_EMAIL, PRIVATE_KEY };
}

const b64 = (s) => Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function getAccessToken({ CLIENT_EMAIL, PRIVATE_KEY }) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64(
    JSON.stringify({
      iss: CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(PRIVATE_KEY, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = `${header}.${payload}.${signature}`;
  const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'oauth2.googleapis.com',
        path: '/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': body.length },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            j.access_token ? resolve(j.access_token) : reject(new Error(j.error_description || d.slice(0, 200)));
          } catch {
            reject(new Error(d.slice(0, 200)));
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function submit(token, url) {
  const body = JSON.stringify({ url, type: 'URL_UPDATED' });
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'indexing.googleapis.com',
        path: '/v3/urlNotifications:publish',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve({ status: res.statusCode, body: d }));
      },
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.write(body);
    req.end();
  });
}

(async () => {
  const creds = loadEnv();
  console.log(`Submitting ${urls.length} CarWorthIt URLs to the Google Indexing API\n`);
  const token = await getAccessToken(creds);
  let ok = 0;
  let fail = 0;
  for (const url of urls) {
    const r = await submit(token, url);
    if (r.status === 200) {
      ok++;
      console.log(`  ok    ${url.replace(BASE, '')}`);
    } else {
      fail++;
      let why = r.body.slice(0, 120).replace(/\s+/g, ' ');
      try {
        why = JSON.parse(r.body).error?.message || why;
      } catch {}
      console.log(`  ${r.status}   ${url.replace(BASE, '')}  ${why}`);
    }
    await new Promise((r2) => setTimeout(r2, 350));
  }
  console.log(`\n${ok} accepted, ${fail} failed`);
  if (fail) {
    console.log(
      'A 403 here almost always means the service account is not an owner of the\n' +
        'property in Search Console. Add it under Settings > Users and permissions.',
    );
  }
})();
