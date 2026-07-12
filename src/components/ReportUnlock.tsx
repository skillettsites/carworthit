'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { PRODUCTS, CHECKOUT_ENABLED, type ProductId } from '@/lib/constants';

type ModalType = ProductId | null;

// 3-product buy cards (.cxc) + modals (.cxm), ported from CarCostCheck's
// PremiumHeaderButton. When CHECKOUT_ENABLED is false, every purchase CTA
// shows "Coming soon" and no checkout is attempted.
export default function ReportUnlock({
  vin,
  hasHistory = false,
  hasValuation = false,
}: {
  vin: string;
  hasHistory?: boolean;
  hasValuation?: boolean;
}) {
  const [modal, setModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState<ProductId | null>(null);
  const [error, setError] = useState('');
  const ctaRef = useRef<HTMLButtonElement>(null);
  const cc = CHECKOUT_ENABLED;

  const openModal = (m: ProductId) => { if (cc) setModal(m); };
  const close = useCallback(() => { if (!loading) setModal(null); }, [loading]);
  useEffect(() => {
    const open = (e: Event) => {
      const p = (e as CustomEvent).detail?.product;
      if (cc && (p === 'valuation' || p === 'history' || p === 'bundle')) setModal(p);
    };
    window.addEventListener('open-buy-modal', open);
    return () => window.removeEventListener('open-buy-modal', open);
  }, [cc]);
  useEffect(() => { if (modal) ctaRef.current?.focus({ preventScroll: true }); }, [modal]);
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [modal, close]);

  async function checkout(product: ProductId) {
    if (!cc) return;
    setLoading(product);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin, product }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setError(data.error || 'Something went wrong. Please try again.'); setLoading(null); }
    } catch {
      setError('Network error. Please try again.');
      setLoading(null);
    }
  }

  const showBundle = !hasHistory && !hasValuation;
  const showValuation = !hasValuation;
  const showHistory = !hasHistory;
  if (!showBundle && !showValuation && !showHistory) return null;

  return (
    <>
      <div className="cxc">
        <div className="grid">
          {showBundle && (
            <div className="card featured" onClick={() => openModal('bundle')} style={{ cursor: cc ? 'pointer' : 'default' }}>
              <span className="ribbon">★ Best value · Save $2</span>
              <div className="row">
                <div className="title">Complete Bundle</div>
                <div><span className="price">${PRODUCTS.bundle.price}</span><span className="strike">${PRODUCTS.bundle.strike}</span></div>
              </div>
              <ul className="feats">
                <li><span className="tick">✓</span> Full title &amp; brand history</li>
                <li><span className="tick">✓</span> Market value &amp; price range</li>
                <li><span className="tick">✓</span> Salvage, theft &amp; total-loss</li>
                <li><span className="tick">✓</span> Trade-in &amp; retail values</li>
                <li><span className="tick">✓</span> Odometer &amp; ownership</li>
                <li><span className="tick">✓</span> Insurance &amp; depreciation</li>
              </ul>
              <CardBtn cc={cc} className="cta primary cta-pulse-soft" onClick={() => openModal('bundle')} label="Get complete report" />
            </div>
          )}
          {showValuation && (
            <div className="card" onClick={() => openModal('valuation')} style={{ cursor: cc ? 'pointer' : 'default' }}>
              <div className="row"><span className="title" style={{ fontSize: 16 }}>Valuation</span><span className="price" style={{ fontSize: 22 }}>${PRODUCTS.valuation.price}</span></div>
              <ul className="feats" style={{ gridTemplateColumns: '1fr' }}>
                <li><span className="tick">✓</span> Fair market value + range</li>
                <li><span className="tick">✓</span> Trade-in, private &amp; retail</li>
                <li><span className="tick">✓</span> Insurance &amp; depreciation</li>
              </ul>
              <CardBtn cc={cc} className="cta primary" style={{ background: 'linear-gradient(90deg,#1aa653,#2fd06e)' }} onClick={() => openModal('valuation')} label="More info" />
            </div>
          )}
          {showHistory && (
            <div className="card" onClick={() => openModal('history')} style={{ cursor: cc ? 'pointer' : 'default' }}>
              <span className="ribbon" style={{ background: '#2a3547', color: '#e8eef7', left: 'auto', right: 16, boxShadow: 'none' }}>Popular</span>
              <div className="row"><span className="title" style={{ fontSize: 16 }}>History Report</span><span className="price" style={{ fontSize: 22 }}>${PRODUCTS.history.price}</span></div>
              <ul className="feats" style={{ gridTemplateColumns: '1fr' }}>
                <li><span className="tick">✓</span> Salvage, junk &amp; flood brands</li>
                <li><span className="tick">✓</span> Theft &amp; total-loss checks</li>
                <li><span className="tick">✓</span> Odometer &amp; ownership timeline</li>
              </ul>
              <CardBtn cc={cc} className="cta primary" onClick={() => openModal('history')} label="More info" />
            </div>
          )}
        </div>
        <div className="trust">
          {cc ? <><span>🔒 Secure checkout</span><span>✓ NMVTIS data</span><span>⚡ Instant</span></> : <span>Paid reports launching soon · free preview available now</span>}
        </div>
      </div>

      {cc && modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3" onClick={close}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="cxm" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close" onClick={close} disabled={loading !== null} aria-label="Close">✕</button>

            {modal === 'valuation' && (
              <>
                <h2>Vehicle Valuation</h2>
                <p className="lede">Real market value for {vin}</p>
                <div className="grid2" style={{ marginTop: 14 }}>
                  <div className="feat"><span className="ic green">$</span><span>Fair market value</span></div>
                  <div className="feat"><span className="ic green">◎</span><span>Low-high price range</span></div>
                  <div className="feat"><span className="ic green">⇄</span><span>Trade-in value</span></div>
                  <div className="feat"><span className="ic green">▤</span><span>Private &amp; retail value</span></div>
                  <div className="feat"><span className="ic green">⛨</span><span>Insurance by age</span></div>
                  <div className="feat"><span className="ic green">↘</span><span>Depreciation outlook</span></div>
                </div>
                <BuyBox product="valuation" ctaRef={ctaRef} loading={loading} error={error} onBuy={checkout} anchor="Live market data · shown instantly" />
              </>
            )}

            {modal === 'history' && (
              <>
                <h2>Full History Report</h2>
                <p className="lede">Complete title &amp; history check for {vin}</p>
                <div className="callout"><b>Why this matters:</b> A salvage or flood title can hide unsafe damage. A rolled-back odometer hides the real mileage.</div>
                <div className="grid2" style={{ marginTop: 14 }}>
                  <div className="feat"><span className="ic blue">⌕</span><span>Salvage check <span className="note">(NMVTIS)</span></span></div>
                  <div className="feat"><span className="ic amber">⚠</span><span>Title brands <span className="note">(junk/flood)</span></span></div>
                  <div className="feat"><span className="ic blue">#</span><span>Odometer / rollback</span></div>
                  <div className="feat"><span className="ic blue">⌕</span><span>Theft check</span></div>
                  <div className="feat"><span className="ic amber">⚠</span><span>Total-loss check</span></div>
                  <div className="feat"><span className="ic blue">☺</span><span>Ownership history</span></div>
                </div>
                <BuyBox product="history" ctaRef={ctaRef} loading={loading} error={error} onBuy={checkout} anchor={<><b>80% cheaper</b> than Carfax ($44.99) · same NMVTIS data</>} />
              </>
            )}

            {modal === 'bundle' && (
              <>
                <h2>Complete Report + Valuation</h2>
                <p className="lede">Everything for {vin} in one report</p>
                <div style={{ color: '#34d17a', fontSize: 11, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', margin: '12px 0 7px' }}>Valuation includes</div>
                <div className="grid2">
                  <div className="feat"><span className="ic green">$</span><span>Fair market value</span></div>
                  <div className="feat"><span className="ic green">⇄</span><span>Trade-in &amp; retail</span></div>
                  <div className="feat"><span className="ic green">⛨</span><span>Insurance by age</span></div>
                  <div className="feat"><span className="ic green">↘</span><span>Depreciation</span></div>
                </div>
                <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', margin: '12px 0 7px' }}>History includes</div>
                <div className="grid2">
                  <div className="feat"><span className="ic blue">⌕</span><span>Salvage &amp; theft</span></div>
                  <div className="feat"><span className="ic amber">⚠</span><span>Title brands</span></div>
                  <div className="feat"><span className="ic blue">#</span><span>Odometer / rollback</span></div>
                  <div className="feat"><span className="ic blue">☺</span><span>Ownership history</span></div>
                </div>
                <BuyBox product="bundle" ctaRef={ctaRef} loading={loading} error={error} onBuy={checkout} blue anchor={<>Save $2 vs buying separately</>} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CardBtn({ cc, className, onClick, label, style }: { cc: boolean; className: string; onClick: () => void; label: string; style?: React.CSSProperties }) {
  if (!cc) {
    return <button type="button" className={className} style={{ ...style, opacity: 0.65, cursor: 'not-allowed' }} disabled>Coming soon</button>;
  }
  return <button type="button" className={className} style={style} onClick={(e) => { e.stopPropagation(); onClick(); }}>{label} <span className="arr">→</span></button>;
}

function BuyBox({ product, ctaRef, loading, error, onBuy, anchor, blue }: {
  product: ProductId;
  ctaRef: React.RefObject<HTMLButtonElement | null>;
  loading: ProductId | null;
  error: string;
  onBuy: (p: ProductId) => void;
  anchor: React.ReactNode;
  blue?: boolean;
}) {
  const p = PRODUCTS[product];
  return (
    <div className="buy">
      <div className="price-row"><span className="price">${p.price}</span>{p.strike && <span className="strike">${p.strike}</span>}</div>
      <div className="anchor-line">{anchor}</div>
      <button ref={ctaRef} type="button" className={`cta ${blue ? 'blue' : 'green'} ${loading === null ? 'cta-pulse-soft' : ''}`}
        style={blue ? { background: 'linear-gradient(90deg,#2f6bff,#4b7bff)' } : undefined}
        onClick={() => onBuy(product)} disabled={loading !== null}>
        {loading === product ? 'Redirecting…' : <>Get my report <span>→</span></>}
      </button>
      {error && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 8 }}>{error}</p>}
      <div className="fine">🔒 Secure checkout <span className="dot">·</span> One-time payment <span className="dot">·</span> Powered by Stripe</div>
    </div>
  );
}
