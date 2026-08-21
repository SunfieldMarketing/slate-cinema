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
