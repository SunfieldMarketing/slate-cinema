'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

/**
 * Initializes PostHog once, client-side. Was missing entirely — every
 * `posthog.capture(...)` call sprinkled across the site (lead form,
 * calendar, industry CTAs, etc.) was a silent no-op with no `init()`
 * anywhere to actually start the client. Fixed 2026-08-13.
 *
 * Reads NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN — still blank in .env.local as
 * of this writing, so this safely no-ops until that's supplied. `/ingest`
 * proxy already exists (next.config.ts rewrites), used here instead of
 * hitting PostHog's domain directly so ad-blockers are less likely to
 * strip the requests.
 */
export default function PostHogInit() {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
    if (!token || posthog.__loaded) return
    posthog.init(token, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: 'history_change',
    })
  }, [])

  return null
}
