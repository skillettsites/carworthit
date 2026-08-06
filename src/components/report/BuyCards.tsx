'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CHECKOUT_ENABLED,
  PRODUCTS,
  TIER_ORDER,
  tierRank,
  upgradePriceCents,
  type ProductId,
} from '@/lib/constants';
import { MAX_VINS, ladderPriceCents, ladderTotalCents, ladderFullCents } from '@/lib/multi-vin';

// The buy cards that sit at the top of a report, ported from CarCostCheck's
// PremiumHeaderButton. The .cxc card and .cxm modal styles were already in
// globals.css, copied across months ago and never wired to anything.
//
// Shape kept deliberately faithful: three cards, the top tier featured with a
// ribbon, a tick-list per card, the whole card clickable, and a modal carrying
// the real explanation. What changed is the inputs. CarCostCheck asks for a
// postcode and looks the mileage up from MOT history; there is no US equivalent,
// so we ask for the odometer reading per vehicle, and a ZIP once for the buyer.

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

interface Extra {
  vin: string;
  mileage: string;
  asking: string;
}

export default function BuyCards({
  vin,
  vehicle,
  tier,
  paidToken,
  defaults,
}: {
  vin: string;
  /** "2021 Toyota Corolla LE", for the modal heading. */
  vehicle: string;
  /** What they already own, if anything. */
  tier: ProductId | null;
  paidToken?: string | null;
  defaults?: { mileage?: number; zip?: string; asking?: number | null };
}) {
  const offered = TIER_ORDER.filter((t) => (tier === null ? true : tierRank(t) > tierRank(tier)));

  const [modal, setModal] = useState<ProductId | null>(null);
  const [mileage, setMileage] = useState(defaults?.mileage ? String(defaults.mileage) : '');
  const [zip, setZip] = useState(defaults?.zip ?? '');
  const [asking, setAsking] = useState(defaults?.asking ? String(defaults.asking) : '');
  const [extras, setExtras] = useState<Extra[]>([]);
  const [mvOpen, setMvOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    if (!loading) {
      setModal(null);
      setError('');
    }
  }, [loading]);

  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Escape closes, and the page behind must not scroll while a modal is open.
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus INTO the dialog. aria-modal tells assistive tech the rest of
    // the page does not exist, so leaving focus on the card behind the overlay
    // strands a keyboard user outside the only thing they are allowed to reach.
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [modal, close]);

  if (offered.length === 0) return null;

  const upgrade = tier !== null;
  const creditFrom: ProductId | null = upgrade && paidToken ? tier : null;
  // An upgrade covers one vehicle, so the basket is unavailable on that path.
  const canAddVehicles = !upgrade;
  const count = 1 + extras.length;

  const priceCents = (id: ProductId) =>
    canAddVehicles && count > 1 ? ladderTotalCents(id, count) : upgradePriceCents(id, creditFrom);

  function addExtra() {
    if (extras.length >= MAX_VINS - 1) return;
    setExtras((p) => [...p, { vin: '', mileage: '', asking: '' }]);
  }

  async function buy(product: ProductId) {
    const miles = Number(mileage.replace(/[^0-9]/g, ''));
    if (!Number.isFinite(miles) || miles <= 0 || miles > 999999) {
      setError('Enter the mileage on the odometer, in miles.');
      return;
    }
    if (!/^\d{5}$/.test(zip.trim())) {
      setError('Enter a 5-digit US ZIP code. Values are local, so this matters.');
      return;
    }
    const askNum = asking ? Number(asking.replace(/[^0-9.]/g, '')) : null;
    if (asking && (!Number.isFinite(askNum) || (askNum as number) <= 0)) {
      setError('Asking price should be a number, or leave it blank.');
      return;
    }
    // Validate the basket here as well as on the server, so a typo in the fifth
    // VIN is caught before the buyer is sent to a payment page.
    const cleanExtras: { vin: string; mileage: number; asking: number | null }[] = [];
    const seen = new Set([vin]);
    for (const e of extras) {
      const v = e.vin.toUpperCase().replace(/\s/g, '');
      if (!VIN_RE.test(v)) {
        setError(`That VIN doesn’t look right: ${v || '(blank)'}. It is 17 characters, no I, O or Q.`);
        return;
      }
      if (seen.has(v)) {
        setError(`${v} is already in this order.`);
        return;
      }
      const m = Number(e.mileage.replace(/[^0-9]/g, ''));
      if (!Number.isFinite(m) || m <= 0 || m > 999999) {
        setError(`Enter the mileage for ${v}.`);
        return;
      }
      const a = e.asking ? Number(e.asking.replace(/[^0-9.]/g, '')) : null;
      if (e.asking && (!Number.isFinite(a) || (a as number) <= 0)) {
        setError(`Asking price for ${v} should be a number, or leave it blank.`);
        return;
      }
      seen.add(v);
      cleanExtras.push({ vin: v, mileage: m, asking: a });
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin,
          product,
          mileage: miles,
          zip: zip.trim(),
          asking: askNum,
          upgradeFrom: upgrade && paidToken ? paidToken : undefined,
          extras: cleanExtras.length ? cleanExtras : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const FEATURES: Record<ProductId, { ic: string; text: string }[]> = {
    valuation: [
      { ic: '$', text: 'What this exact VIN is worth, at its mileage' },
      { ic: '◎', text: 'Priced in the market around your ZIP code' },
      { ic: '▤', text: 'The local range, lowest to highest asking price' },
      { ic: '⚖', text: 'A straight verdict on the seller’s price' },
      { ic: '⛨', text: 'Open safety recalls and crash-test ratings' },
      { ic: '⛽', text: 'EPA fuel economy and five-year running costs' },
    ],
    worthit: [
      { ic: '✓', text: 'Everything in the Valuation' },
      { ic: '🏷', text: 'What it cost new, for this exact VIN' },
      { ic: '⚙', text: 'The factory options it was built with' },
      { ic: '▤', text: 'Dealer invoice price when new' },
      { ic: '↓', text: 'Total depreciation since new' },
      { ic: '⛨', text: 'Original factory warranty terms' },
    ],
    negotiation: [
      { ic: '✓', text: 'Everything in the Full Report' },
      { ic: '◎', text: 'Your opening offer, target and walk-away price' },
      { ic: '💬', text: 'Your case for paying less, every claim sourced' },
      { ic: '⚔', text: 'What the seller will argue, and the counter' },
      { ic: '№', text: 'The conversation, in the order to have it' },
      { ic: '⛨', text: 'The checks to make before any money moves' },
    ],
  };

  const CARD_SUB: Record<ProductId, string> = {
    valuation: 'What it’s worth locally, and a verdict on the price',
    worthit: 'Adds what it cost new and its factory options',
    negotiation: 'Adds what to offer, when to walk, and the words to use',
  };

  return (
    <>
      <div className="border-b border-border bg-surface">
        <div className="container-x max-w-4xl py-6">
      <div className="cxc print:hidden">
        <div className="grid">
          {offered
            .slice()
            .reverse()
            .map((id) => {
              const p = PRODUCTS[id];
              const featured = id === 'negotiation';
              const cents = priceCents(id);
              const full = canAddVehicles && count > 1 ? ladderFullCents(id, count) : p.cents;
              return (
                // Not role="button" + tabIndex. The card contains a real
                // <button>, and nesting one interactive control inside another
                // is invalid and announces as "button inside button". Clicking
                // the card is a convenience for pointer users; the inner button
                // is the actual control and provides the keyboard path.
                <div
                  key={id}
                  className={`card${featured ? ' featured' : ''}`}
                  onClick={() => setModal(id)}
                >
                  {featured && <span className="ribbon">★ Most useful</span>}
                  <div className="row">
                    <div>
                      <div className="title">{p.name}</div>
                    </div>
                    <div>
                      <span className="price">{usd(cents)}</span>
                      {cents < full && <span className="strike">{usd(full)}</span>}
                    </div>
                  </div>
                  <div className="sub">{CARD_SUB[id]}</div>
                  <ul className={`feats${featured ? ' two' : ''}`}>
                    {FEATURES[id].slice(0, featured ? 6 : 3).map((f) => (
                      <li key={f.text}>
                        <span className="tick">✓</span> {f.text}
                      </li>
                    ))}
                    {!featured && FEATURES[id].length > 3 && (
                      <li>
                        <span className="tick">✓</span> and {FEATURES[id].length - 3} more
                      </li>
                    )}
                  </ul>
                  <button
                    type="button"
                    className={`cta ${featured ? 'primary cta-pulse-soft' : 'ghost'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal(id);
                    }}
                  >
                    {featured ? 'Get the full picture' : 'More info'} <span className="arr">→</span>
                  </button>
                </div>
              );
            })}
        </div>
        <div className="trust">
          <span>🔒 Secure checkout</span>
          <span>✓ No subscription</span>
          <span>⚡ Instant</span>
        </div>
      </div>
        </div>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 print:hidden"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${PRODUCTS[modal].name} details`}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="cxm" onClick={(e) => e.stopPropagation()}>
            <button ref={closeRef} type="button" className="close" onClick={close} disabled={loading} aria-label="Close">
              ✕
            </button>

            <h2>{PRODUCTS[modal].name}</h2>
            <p className="lede">{vehicle || `VIN ${vin}`}</p>

            {modal === 'negotiation' && (
              <div className="callout">
                <b>Why this matters:</b> knowing what a car is worth is not the same as getting it for that.
                This is the number to open at, the number to hold at, and the point where you leave.
              </div>
            )}

            <div className="grid2" style={{ marginTop: 14 }}>
              {FEATURES[modal].map((f) => (
                <div className="feat" key={f.text}>
                  <span className="ic green">{f.ic}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="field-label">Mileage on the odometer</div>
            <input
              className="postcode"
              inputMode="numeric"
              value={mileage}
              onChange={(e) => {
                setMileage(e.target.value);
                setError('');
              }}
              placeholder="e.g. 50000"
            />

            <div className="field-label">Your ZIP code</div>
            <input
              className="postcode"
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={(e) => {
                setZip(e.target.value);
                setError('');
              }}
              placeholder="e.g. 10312"
            />
            <div className="field-hint">Used to price against cars actually for sale near you.</div>

            <div className="field-label">Asking price, optional</div>
            <input
              className="postcode"
              inputMode="decimal"
              value={asking}
              onChange={(e) => {
                setAsking(e.target.value);
                setError('');
              }}
              placeholder="e.g. 18500"
            />
            <div className="field-hint">
              {modal === 'negotiation'
                ? 'Sharpens the verdict and your whole negotiation case.'
                : 'It is how you get a verdict on whether the price is fair.'}
            </div>

            {canAddVehicles && (
              <div className="mv">
                <button type="button" className="mv-toggle" onClick={() => setMvOpen((o) => !o)}>
                  <span>
                    🚗 Checking more than one car?
                    <small>Extra cars are cheaper, and you get a side-by-side comparison</small>
                  </span>
                  <span className={`chev${mvOpen ? ' open' : ''}`}>▼</span>
                </button>

                {mvOpen && (
                  <div className="mv-body">
                    <p className="mv-note">
                      Each extra car is cheaper: second car 50c off, third onwards $1 off each. You get every
                      car&apos;s full individual report, plus a side-by-side comparison with our verdict on which
                      to buy.
                    </p>

                    <div className="mv-row">
                      <span className="mv-vin">{vin}</span>
                      <span className="mv-price">{usd(ladderPriceCents(modal, 0))}</span>
                      {/* Spacer, not a button. The car you are already looking
                          at cannot be removed from its own order. */}
                      <span className="mv-spacer" />
                    </div>

                    {extras.map((e, i) => (
                      <div className="mv-item" key={i}>
                        <div className="mv-row">
                          <input
                            className="mv-input"
                            value={e.vin}
                            maxLength={17}
                            placeholder="Add another VIN"
                            onChange={(ev) => {
                              const v = ev.target.value.toUpperCase();
                              setExtras((p) => p.map((x, j) => (j === i ? { ...x, vin: v } : x)));
                              setError('');
                            }}
                          />
                          <span className="mv-price">
                            <small>{usd(ladderPriceCents(modal, 0))}</small>
                            {usd(ladderPriceCents(modal, i + 1))}
                          </span>
                          <button
                            type="button"
                            className="mv-x"
                            aria-label="Remove this vehicle"
                            onClick={() => setExtras((p) => p.filter((_, j) => j !== i))}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="mv-row sub">
                          <input
                            className="mv-input"
                            inputMode="numeric"
                            value={e.mileage}
                            placeholder="Its mileage"
                            onChange={(ev) => {
                              const v = ev.target.value;
                              setExtras((p) => p.map((x, j) => (j === i ? { ...x, mileage: v } : x)));
                              setError('');
                            }}
                          />
                          <input
                            className="mv-input"
                            inputMode="decimal"
                            value={e.asking}
                            placeholder="Asking price, optional"
                            onChange={(ev) => {
                              const v = ev.target.value;
                              setExtras((p) => p.map((x, j) => (j === i ? { ...x, asking: v } : x)));
                              setError('');
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {count < MAX_VINS ? (
                      <button type="button" className="mv-add" onClick={addExtra}>
                        + Add another car
                      </button>
                    ) : (
                      <p className="mv-note">Up to {MAX_VINS} cars per order.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && <div className="err">{error}</div>}

            <div className="buy val">
              <div className="price-row">
                <span className="price">{usd(priceCents(modal))}</span>
                {priceCents(modal) < (canAddVehicles && count > 1 ? ladderFullCents(modal, count) : PRODUCTS[modal].cents) && (
                  <span className="strike">
                    {usd(canAddVehicles && count > 1 ? ladderFullCents(modal, count) : PRODUCTS[modal].cents)}
                  </span>
                )}
              </div>
              <div className="anchor-line">
                {count > 1 ? (
                  <>
                    {count} cars, each with a full report, <b>plus a side-by-side comparison</b>
                  </>
                ) : upgrade && paidToken ? (
                  <>
                    You already paid {usd(PRODUCTS[tier].cents)}, <b>so this is the difference only</b>
                  </>
                ) : (
                  <>
                    One-off payment, <b>no account and no subscription</b>
                  </>
                )}
              </div>

              {CHECKOUT_ENABLED ? (
                <button type="button" className="cta green" onClick={() => buy(modal)} disabled={loading}>
                  {loading ? 'Redirecting…' : count > 1 ? `Get ${count} reports` : `Get the ${PRODUCTS[modal].name}`}{' '}
                  <span>→</span>
                </button>
              ) : (
                <div className="fine" style={{ marginTop: 10 }}>
                  Paid reports are launching shortly
                </div>
              )}
              <div className="fine">
                🔒 Secure checkout <span className="dot">·</span> Instant results <span className="dot">·</span>{' '}
                Powered by Stripe
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
