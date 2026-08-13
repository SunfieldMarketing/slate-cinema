import Script from 'next/script'

/**
 * Loads gtag.js + wires window.dataLayer only when a real Google Ads tag
 * ID is configured (NEXT_PUBLIC_GOOGLE_ADS_ID, format "AW-XXXXXXXXX" —
 * from Google Ads > Tools > Conversions > the account-level tag). Renders
 * nothing otherwise, same no-op-until-configured pattern as GHL webhooks
 * (src/lib/ghl.ts) — safe to ship before the client hands over an ID.
 *
 * pushConversion() (src/lib/analytics.ts) writes to dataLayer regardless
 * of whether this tag is present, so nothing needs to change in the forms
 * once a real ID is added here — it'll just start actually reporting.
 */
export default function GoogleAdsTag() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  if (!id) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  )
}
