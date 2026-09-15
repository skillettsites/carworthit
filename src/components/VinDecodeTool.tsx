'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/constants';
import { stickerOemForMake } from '@/lib/vin-tools/window-sticker';

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
 *
 * `mode` changes which fields the result panel leads with, so the same tool
 * serves /transmission-by-vin, /engine-by-vin, the make and type decoders and
 * the title, lien, odometer and window-sticker pages. Every mode still shows
 * the full decode underneath; the highlight block is the answer to the query
 * that brought the visitor here, including the honest "not filed" state.
 */

export type DecodeMode =
  | 'default'
  | 'transmission'
  | 'engine'
  | 'history'
  | 'sticker'
  | 'type'
  | 'make'
  | 'year'
  | 'warranty';

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
  manufacturer?: string;
  series?: string;
  transmissionSpeeds?: string;
  engineModel?: string;
  engineHP?: string;
  engineConfiguration?: string;
  engineManufacturer?: string;
  turbo?: string;
  otherEngineInfo?: string;
  electrificationLevel?: string;
  plantCity?: string;
  plantState?: string;
  plantCompany?: string;
  trailerType?: string;
  trailerBodyType?: string;
  trailerLength?: string;
  axles?: string;
  errorCode?: string;
  errorText?: string;
}

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/i;
const NOT_FILED = 'Not filed with NHTSA by the manufacturer';

interface Props {
  mode?: DecodeMode;
  /** vPIC Make value (upper case) the page is about; mismatches are pointed out. */
  expectedMake?: string;
  /** vPIC VehicleType values the page is about, e.g. ['TRAILER']. */
  expectedTypes?: string[];
  /** Plain label for the expected type, e.g. "trailer". */
  expectedTypeLabel?: string;
  placeholder?: string;
  buttonLabel?: string;
  inputId?: string;
}

function Highlight({ title, rows, note }: { title: string; rows: [string, string | undefined][]; note?: string }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-blue-900">{title}</h3>
      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-muted">{k}</dt>
            <dd className={`text-sm font-semibold ${v ? '' : 'text-ink-2 italic'}`}>{v || NOT_FILED}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-3 text-xs leading-relaxed text-ink-2">{note}</p>}
    </div>
  );
}

export default function VinDecodeTool({
  mode = 'default',
  expectedMake,
  expectedTypes,
  expectedTypeLabel,
  placeholder = '1HGCM82633A004352',
  buttonLabel = 'Decode VIN free',
  inputId = 'vin-decode',
}: Props) {
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
          : clean.length > 0 && clean.length < 17 && mode === 'type'
            ? 'A VIN is exactly 17 characters. Vehicles built before the 1981 model year use shorter serial numbers that NHTSA cannot decode.'
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
        ['Displacement', result.displacementL ? `${Number(result.displacementL).toFixed(1)} L` : undefined],
        ['Fuel', result.fuelType],
        ['Drive', result.driveType],
        ['Transmission', result.transmission],
        ['Doors', result.doors],
        ['Vehicle type', result.vehicleType],
        ['Built in', [result.plantCity, result.plantState, result.plantCountry].filter(Boolean).join(', ') || undefined],
        ['GVWR', result.gvwr],
      ]
    : [];

  const title = result ? [result.year, result.make, result.model].filter(Boolean).join(' ') || 'Decoded' : '';
  const makeMismatch = !!(result && expectedMake && result.make && result.make.toUpperCase() !== expectedMake.toUpperCase());
  const typeMismatch = !!(
    result &&
    expectedTypes &&
    expectedTypes.length > 0 &&
    result.vehicleType &&
    !expectedTypes.includes(result.vehicleType.toUpperCase())
  );
  const sticker = result && mode === 'sticker' ? stickerOemForMake(result.make) : undefined;
  const cleanVin = result?.vin || '';

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <form onSubmit={decode}>
        <label htmlFor={inputId} className="block text-sm font-semibold">
          Enter a VIN
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id={inputId}
            value={vin}
            onChange={(e) => {
              setVin(e.target.value);
              if (state === 'error') setState('idle');
            }}
            placeholder={placeholder}
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
            {state === 'loading' ? 'Decoding…' : buttonLabel}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">Free, no account, no card. Data from the NHTSA vPIC database.</p>
        {state === 'error' && <p className="mt-2 text-sm text-red-600">{message}</p>}
      </form>

      {state === 'done' && result && (
        <div className="mt-5 border-t border-border pt-5">
          <h2 className="font-bold">{title}</h2>

          {makeMismatch && (
            <p className="mt-2 rounded-lg border border-warn/40 bg-warn/5 p-3 text-sm text-warn">
              NHTSA decodes this VIN as {result.make}, not {expectedMake}. The decode below is still correct for the VIN you entered.
            </p>
          )}
          {typeMismatch && (
            <p className="mt-2 rounded-lg border border-warn/40 bg-warn/5 p-3 text-sm text-warn">
              NHTSA files this VIN as {result.vehicleType?.toLowerCase()}, not as a {expectedTypeLabel || 'vehicle of this type'}. The decode
              below is still correct for the VIN you entered.
            </p>
          )}

          {mode === 'transmission' && (
            <div className="mt-3">
              <Highlight
                title="Transmission, as filed with NHTSA"
                rows={[
                  ['Transmission style', result.transmission],
                  ['Speeds', result.transmissionSpeeds],
                  ['Drive type', result.driveType],
                  ['Electrification', result.electrificationLevel],
                ]}
                note="A blank means the manufacturer did not include that attribute in the VIN pattern it filed with NHTSA. It does not mean the vehicle has no transmission data anywhere; the build sheet, window sticker or dealer can still tell you."
              />
            </div>
          )}

          {mode === 'engine' && (
            <div className="mt-3">
              <Highlight
                title="Engine, as filed with NHTSA"
                rows={[
                  ['Engine model', result.engineModel],
                  ['Displacement', result.displacementL ? `${Number(result.displacementL).toFixed(1)} L` : undefined],
                  ['Cylinders', result.cylinders],
                  ['Horsepower', result.engineHP],
                  ['Configuration', result.engineConfiguration],
                  ['Fuel', result.fuelType],
                  ['Turbo', result.turbo],
                  ['Engine maker', result.engineManufacturer],
                  ['Other engine info', result.otherEngineInfo],
                ]}
                note="A blank means the manufacturer did not file that attribute with NHTSA for this VIN pattern. Horsepower, when present, is the figure the manufacturer filed and may be rounded."
              />
            </div>
          )}

          {mode === 'type' && (
            <div className="mt-3">
              <Highlight
                title="How NHTSA classifies this VIN"
                rows={[
                  ['Vehicle type', result.vehicleType],
                  ['Body class', result.bodyClass],
                  ['Manufacturer', result.manufacturer],
                  ['Series', result.series],
                  ...(result.trailerBodyType || result.trailerLength || result.axles || result.trailerType
                    ? ([
                        ['Trailer type', result.trailerType],
                        ['Trailer body', result.trailerBodyType],
                        ['Length (ft)', result.trailerLength],
                        ['Axles', result.axles],
                      ] as [string, string | undefined][])
                    : []),
                ]}
                note="Blank fields were not filed with NHTSA by the manufacturer for this VIN pattern."
              />
            </div>
          )}

          {mode === 'year' && (
            <div className="mt-3">
              <Highlight
                title="Model year"
                rows={[
                  ['Model year (NHTSA)', result.year],
                  ['10th character', cleanVin[9]],
                  ['7th character', cleanVin[6]],
                ]}
                note="The 10th character is the model-year code. For cars, SUVs and light trucks a numeric 7th character puts it in 1980 to 2009 and a letter puts it in 2010 to 2039 (49 CFR 565.15)."
              />
            </div>
          )}

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
          {result.errorCode && result.errorCode !== '0' && result.errorText && (
            <p className="mt-3 text-xs text-ink-2">NHTSA note: {result.errorText}</p>
          )}

          {mode === 'sticker' && (
            <div className="mt-5 rounded-xl bg-surface p-4">
              {sticker ? (
                <>
                  <p className="text-sm">
                    <strong>{sticker.make} publishes window stickers.</strong> Open the manufacturer&apos;s PDF for this VIN (it may say
                    &quot;not released&quot; if they do not hold it; on September 15, 2026 it returned a real sticker for{' '}
                    {sticker.verification.realStickers} of {sticker.verification.tested} VINs we tried).
                  </p>
                  <a
                    href={`${sticker.endpoint}${cleanVin}`}
                    target="_blank"
                    rel="nofollow noopener"
                    className="mt-3 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                  >
                    Open the {sticker.make} window sticker for {cleanVin}
                  </a>
                  <p className="mt-3 text-xs text-ink-2">
                    If it comes back blank, the {PRODUCTS.worthit.name} (${PRODUCTS.worthit.price}) includes the factory build record for
                    this VIN: sticker price when new, installed options, standard equipment and warranty terms.{' '}
                    <Link href={`/report/${cleanVin}`} className="text-brand underline">
                      See the free report first
                    </Link>
                    .
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    <strong>{result.make || 'This manufacturer'} has no public window-sticker lookup we could verify</strong> (checked
                    September 15, 2026). The {PRODUCTS.worthit.name} (${PRODUCTS.worthit.price}) rebuilds the sticker from the
                    manufacturer&apos;s build record: MSRP when new, installed options, standard equipment and the original factory
                    warranty terms, where the record holds them.
                  </p>
                  <Link
                    href={`/report/${cleanVin}`}
                    className="mt-3 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                  >
                    See the free report for {cleanVin}
                  </Link>
                </>
              )}
            </div>
          )}

          {mode === 'history' && (
            <div className="mt-5 rounded-xl bg-surface p-4 text-sm">
              <p>
                <strong>That is the whole decode.</strong> It confirms what the vehicle is. It cannot show title brands, liens, theft or
                odometer records; those live in other databases. Next steps for {cleanVin}:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-2">
                <li>
                  <a href="https://www.nicb.org/vincheck" target="_blank" rel="nofollow noopener" className="text-brand underline">
                    NICB VINCheck
                  </a>{' '}
                  (free): theft-and-not-recovered, salvage and flood records from participating insurers.
                </li>
                <li>
                  <a
                    href="https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory"
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand underline"
                  >
                    An NMVTIS-approved provider
                  </a>{' '}
                  (paid): current state of title, brand history, odometer readings, total loss and salvage history.
                </li>
                <li>
                  <Link href={`/report/${cleanVin}`} className="text-brand underline">
                    The free CarWorthIt report
                  </Link>
                  : open recalls, crash-test ratings and running costs, still no account.
                </li>
              </ul>
            </div>
          )}

          {mode !== 'sticker' && mode !== 'history' && (
            /* The honest handoff. A decode says what the car IS; it says nothing
               about what it is worth or whether it has open recalls, and the
               free report covers both without payment. */
            <div className="mt-5 rounded-xl bg-surface p-4">
              <p className="text-sm">
                A decode tells you what the vehicle is. The free report on this VIN also shows{' '}
                <strong>open safety recalls, crash-test ratings and running costs</strong>, still without an account.
              </p>
              <Link
                href={`/report/${cleanVin}`}
                className="mt-3 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                See the free report for {cleanVin}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
