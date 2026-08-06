import { ImageResponse } from 'next/og';

// Generated at build time rather than shipped as a PNG, so it can never drift
// out of sync with the positioning. Social previews and several AI crawlers
// use this as the card image; without one, links render as a bare grey box.

export const runtime = 'edge';
export const alt = 'CarWorthIt, price any used car by its VIN';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #0f172a 45%, #12233f 100%)',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#3b82f6,#22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* A drawn tick, not the ✓ character. Satori's default font has no
                glyph for it and renders a tofu box. */}
            <div
              style={{
                width: 22,
                height: 11,
                borderLeft: '5px solid white',
                borderBottom: '5px solid white',
                transform: 'rotate(-45deg)',
                marginTop: -6,
              }}
            />
          </div>
          {/* Satori requires an explicit display on any element with more
              than one child, so this is a flex row of spans rather than
              mixed text and markup. */}
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: 'white' }}>
            <span>Car</span>
            <span style={{ color: '#38bdf8' }}>Worth</span>
            <span>It</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 68,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Price your car by VIN,
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: '#38bdf8',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          and see if it&apos;s worth it.
        </div>

        <div style={{ marginTop: 36, fontSize: 30, color: '#94a3b8' }}>
          Valued at your mileage, against cars for sale near you.
        </div>
      </div>
    ),
    size,
  );
}
