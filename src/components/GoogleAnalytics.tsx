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
//
// The VIN is kept out of GA as well. Report pages live at /report/<VIN> and
// their title names the VIN, so both are reported generically as
// /report/vin and "Vehicle report". Every report view still counts, grouped
// under one path, and the purchase event fired there carries no VIN either.
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
          var cwiReport = window.location.pathname.indexOf('/report/') === 0;
          gtag('config', '${GA_ID}', cwiReport ? {
            page_location: window.location.origin + '/report/vin',
            page_title: 'Vehicle report'
          } : {
            page_location: window.location.origin + window.location.pathname
          });
        `}
      </Script>
    </>
  );
}
