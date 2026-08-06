import Script from 'next/script';
import { GA_ID } from '@/lib/constants';

// GA4 tag. Renders nothing when no measurement ID is configured.
//
// ⚠️ `page_location` is set explicitly with the query string stripped.
//
// GA4 sends the full URL by default, and a paid report lives at
// /report/{vin}?paid=cs_live_... where that Stripe session id is the bearer
// token for the purchase. Left alone, every paid unlock token would be written
// into the GA property, visible to anyone with Viewer access or a BigQuery
// export, and replayable to open someone else's paid report.
//
// Campaign attribution still works: gtag reads utm_* from the real
// document.location before this override is applied to the reported value.
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_location: window.location.origin + window.location.pathname
          });
        `}
      </Script>
    </>
  );
}
