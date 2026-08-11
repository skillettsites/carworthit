import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/db';

/**
 * Email capture.
 *
 * There was no email input anywhere on the site, so every visitor who was not
 * ready to pay $2.99 today left no trace. At the volume this site gets, that is
 * the cheapest thing we were throwing away.
 *
 * Costs nothing to serve: it writes one row through the anon key and calls no
 * paid vehicle API. Nothing here may ever trigger a priced lookup — the whole
 * point is that a free visitor never costs money.
 */

export const dynamic = 'force-dynamic';

// Deliberately permissive. Rejecting odd-but-valid addresses loses a real lead
// to protect a text column, and the address is verified by whether the mail
// arrives, not by a regex.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const vin = typeof body.vin === 'string' && body.vin.length === 17 ? body.vin : undefined;
  const product = typeof body.product === 'string' ? body.product.slice(0, 40) : undefined;
  const path = typeof body.path === 'string' ? body.path.slice(0, 200) : undefined;

  // Awaited, unlike the analytics writes in db.ts. Telling someone their
  // address is saved when it was dropped is worse than telling them to try
  // again, and it is silent, so nobody ever finds out.
  const result = await saveLead(email, { vin, product, path });
  if (!result.ok) {
    return NextResponse.json(
      { error: 'We could not save that just now. Please try again in a moment.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
