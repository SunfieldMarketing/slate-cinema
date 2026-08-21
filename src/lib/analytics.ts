/**
 * Client-side conversion tracking helpers.
 *
 * `pushConversion` writes to `window.dataLayer` (the standard Google Tag
 * Manager / gtag.js queue) so both GA4 and Google Ads pick it up once a
 * container/tag is installed — same env-var-gated "no-op until configured"
 * pattern as `src/lib/ghl.ts`, so this is safe to call today even though
 * no Google Ads Conversion ID has been supplied yet (see GoogleAdsTag.tsx).
 *
 * Added 2026-08-13 per the audit doc: "No /thank-you page after forms =
 * Google Ads conversions cannot track." Call this at the same moment each
 * form shows its own success state — no navigation required, so none of
 * the existing inline "thanks, we got it" UX has to change.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export type ConversionEvent = 'lead_form_submitted' | 'call_booked' | 'intake_submitted' | 'newsletter_signup'

export function pushConversion(event: ConversionEvent, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}
