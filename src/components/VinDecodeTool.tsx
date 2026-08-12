'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * VIN decoder, above the fold.
 *
 * The competitor teardown found this SERP is winnable in a way the valuation
 * terms are not: a 236-word page with no H2s ranks, an insurance agency ranks,
 * and NHTSA's own decoder comes back LAST. What every ranking page has in
 * common is an input box you can use immediately, not an article about VINs.
 *
 * Runs entirely on NHTSA vPIC, which is free federal data, so this costs
 * nothing to serve however much traffic it gets. No paid API is reachable from
 * here. That is the whole point: it is a free top-of-funnel tool that hands
 * people to the paid report only if they want a price.
 */

interface Decoded {
  vin: string;
  year?: string;
  make?: string;
  model?: string;
  trim?: string;
  bodyClass?: string;
  engine?: string;
  cylinders?: string;
  displacementL?: string;
  fuelType?: string;
  driveType?: string;
  transmission?: string;
  doors?: string;
  plantCountry?: string;
  vehicleType?: string;
  gvwr?: string;
}

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/i;

export default function VinDecodeTool() {
  const [vin, setVin] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<Decoded | null>(null);

  async function decode(e: React.FormEvent) {
    e.preventDefault();
    const clean = vin.trim().toUpperCase();
    if (!VIN_RE.test(clean)) {
      // I, O and Q are never used in a VIN, so this catches the most common
      // transcription slip rather than just saying "invalid".
      setMessage(
        /[IOQ]/i.test(clean)
          ? 'A VIN never contains the letters I, O or Q. Check those against 1 and 0.'
          : 'A VIN is exactly 17 characters. Check for a missing or extra one.',
      );
      setState('error');
      return;
    }
    setState('loading');
    try {
      const res = await fetch(`/api/decode?vin=${encodeURIComponent(clean)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(j.error || 'That VIN could not be decoded just now. Try again in a moment.');
        setState('error');
        return;
      }
      const j = await res.json();
      setResult(j);
      setState('done');
    } catch {
      setMessage('That VIN could not be decoded just now. Try again in a moment.');
      setState('error');
    }
  }

  const rows: [string, string | undefined][] = result
    ? [
        ['Year', result.year],
        ['Make', result.make],
        ['Model', result.model],
        ['Trim', result.trim],
        ['Body', result.bodyClass],
        ['Engine', result.engine],
        ['Cylinders', result.cylinders],
        ['Displacement', result.displacementL ? `${result.displacementL} L` : undefined],
        ['Fuel', result.fuelType],
        ['Drive', result.driveType],
        ['Transmission', result.transmission],
        ['Doors', result.doors],
        ['Vehicle type', result.vehicleType],
        ['Built in', result.plantCountry],
        ['GVWR', result.gvwr],
      ]
    : [];

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <form onSubmit={decode}>
        <label htmlFor="vin-decode" className="block text-sm font-semibold">
          Enter a VIN
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="vin-decode"
            value={vin}
            onChange={(e) => {
              setVin(e.target.value);
              if (state === 'error') setState('idle');
            }}
            placeholder="1HGCM82633A004352"
            maxLength={17}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 rounded-xl border border-border px-4 py-3 font-mono text-base uppercase tracking-wide outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {state === 'loading' ? 'Decoding…' : 'Decode VIN free'}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">Free, no account, no card. Data from the NHTSA vPIC database.</p>
        {state === 'error' && <p className="mt-2 text-sm text-red-600">{message}</p>}
      </form>

      {state === 'done' && result && (
        <div className="mt-5 border-t border-border pt-5">
          <h2 className="font-bold">
            {[result.year, result.make, result.model].filter(Boolean).join(' ') || 'Decoded'}
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="text-sm font-semibold">{v}</dd>
                </div>
              ))}
          </dl>
          {/* The honest handoff. A decode says what the car IS; it says nothing
              about what it is worth or whether it has open recalls, and the
              free report covers both without payment. */}
          <div className="mt-5 rounded-xl bg-surface p-4">
            <p className="text-sm">
              A decode tells you what the vehicle is. The free report on this VIN also shows{' '}
              <strong>open safety recalls, crash-test ratings and running costs</strong>, still without an account.
            </p>
            <Link
              href={`/report/${result.vin}`}
              className="mt-3 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              See the free report for {result.vin}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
