import { NextRequest, NextResponse } from 'next/server';
import { plateToVin, isValidPlate, isValidState } from '@/lib/plate';
import { PLATE_ENABLED } from '@/lib/constants';

export async function POST(req: NextRequest) {
  if (!PLATE_ENABLED) return NextResponse.json({ error: 'License-plate lookup is launching soon. Please use the VIN.' }, { status: 403 });
  let plate = '';
  let state = '';
  try {
    const body = await req.json();
    plate = String(body.plate || '').trim();
    state = String(body.state || '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (!isValidPlate(plate) || !isValidState(state)) {
    return NextResponse.json({ error: 'Enter a valid plate and state.' }, { status: 400 });
  }
  const vin = await plateToVin(plate, state);
  if (!vin) return NextResponse.json({ error: 'We couldn’t find a vehicle for that plate. Try the VIN instead.' }, { status: 404 });
  return NextResponse.json({ vin });
}
