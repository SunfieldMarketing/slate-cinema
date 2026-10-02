'use client'

import React, { createContext, useContext } from 'react'
import type { Navigation, Footer, SiteSetting } from '@/payload-types'
import type { IndustryData } from '@/lib/normalize'

/*
  Nav and Footer are both 'use client' (dropdown state, scroll-linked
  animations, magnetic hover) but are rendered deep inside other client
  component trees (HomePageContent, ContactPageContent, etc.), not
  directly by a server component -- so they can't each fetch their own
  Payload data server-side. The root (frontend) layout fetches
  navigation/footer/industries/settings once and provides them here;
  Nav/Footer/StudioLocation read via useSiteData() instead of importing
  static arrays.
*/
type SiteData = {
  navigation: Navigation
  footer: Footer
  industries: IndustryData[]
  settings: SiteSetting
}

const SiteDataContext = createContext<SiteData | null>(null)

export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData(): SiteData {
  const ctx = useContext(SiteDataContext)
  if (!ctx) {
    throw new Error('useSiteData() must be used within <SiteDataProvider> (see src/app/(frontend)/layout.tsx)')
  }
  return ctx
}

/*
  Site Settings > Labels: short copy repeated across pages (2026-10-01).
  The defaults only cover a database that predates those fields -- a
  button can't usefully be blank, so an empty value falls back too. The
  hero trust line and the hero scroll cue are the exceptions: clearing
  one hides it.
*/
const LABEL_DEFAULTS = {
  trustLine: '174+ projects since 2023 · Replies within minutes',
  getStarted: 'Get Started',
  getStartedHref: '/contact',
  bookCall: 'Book a call',
  bookThis: 'Book this',
  mostBooked: 'Most booked',
  viewFullPortfolio: 'View Full Portfolio',
  startProject: 'Start a project like this',
  backToReel: 'Back to the reel',
  exploreIndustry: 'Explore {industry} Work',
  selectIndustry: 'Select Industry',
  scrollCue: 'Scroll',
}
export type SiteLabels = typeof LABEL_DEFAULTS

export function useSiteLabels(): SiteLabels {
  const labels = useSiteData().settings?.labels
  const out = { ...LABEL_DEFAULTS }
  for (const key of Object.keys(LABEL_DEFAULTS) as (keyof SiteLabels)[]) {
    out[key] = labels?.[key] || LABEL_DEFAULTS[key]
  }
  if (labels) {
    out.trustLine = labels.trustLine ?? ''
    out.scrollCue = labels.scrollCue ?? LABEL_DEFAULTS.scrollCue
  }
  return out
}

/** Marks an element as Site Settings > Labels copy for Live Preview's
    click-to-edit (it lives in a different document from the page). */
export function labelField(key: keyof SiteLabels) {
  return { 'data-cms-global': 'site-settings', 'data-cms-field': `labels.${key}` } as const
}
