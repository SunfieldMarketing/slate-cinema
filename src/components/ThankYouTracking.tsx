'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { pushConversion } from '@/lib/analytics'

/**
 * Fires once, on landing here. Each form already pushes its own specific
 * conversion event inline at submit time (ContactPageContent, CustomCalendar,
 * IntakeFrame) so their existing "thanks, we got it" UX never had to change
 * for this — this page exists as the *other* half of the doc's either/or
 * ask ("a /thank-you page (or a generate_lead dataLayer event)"): a
 * standalone, reachable conversion landing page for anything that prefers
 * a real redirect (e.g. a future GHL workflow's "redirect to" URL, or a
 * Google Ads landing page pointed here directly).
 */
export default function ThankYouTracking() {
  const params = useSearchParams()

  useEffect(() => {
    const source = params.get('from') || 'direct'
    posthog.capture('thank_you_page_viewed', { source })
    pushConversion('lead_form_submitted', { source, page: 'thank-you' })
  }, [params])

  return null
}
