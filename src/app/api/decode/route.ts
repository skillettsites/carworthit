import { NextRequest, NextResponse } from 'next/server';
import { decodeVin } from '@/lib/nhtsa';

/**
 * Free VIN decode for the /vin-decoder tool.
 *
 * Calls NHTSA vPIC and nothing else. No paid vehicle API is reachable from
 * this route, so however much traffic the page attracts it costs nothing to
 * serve. That invariant is the reason this page can exist at all.
 */

export const dynamic = 'force-dynamic';

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export async function GET(req: NextRequest) {
  const vin = (req.nextUrl.searchParams.get('vin') || '').trim().toUpperCase();
  if (!VIN_RE.test(vin)) {
    return NextResponse.json({ error: 'That does not look like a valid 17-character VIN.' }, { status: 400 });
  }

  try {
    const specs = await decodeVin(vin);
    if (!specs) {
      // vPIC returns a 200 with an empty Make for a VIN it does not recognise,
      // so "no record" and "outage" have to be told apart for the user.
      return NextResponse.json(
        { error: 'NHTSA has no record for that VIN. Check it against the windshield or door jamb.' },
        { status: 404 },
      );
    }
    return NextResponse.json(specs);
  } catch {
    return NextResponse.json({ error: 'The NHTSA service did not respond. Try again in a moment.' }, { status: 502 });
  }
}
