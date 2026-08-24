import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
export { mediaUrl, mediaUrlOrPlaceholder } from '@/lib/media-url'

/*
  Server-only data-fetch layer for the frontend. Every function here uses
  Payload's local API (no HTTP round trip) and is wrapped in React's
  cache() so multiple components fetching the same global/collection in
  one render pass share a single DB read instead of duplicating it.

  Only ever import this from Server Components (layout.tsx, page.tsx) --
  it pulls in Payload's Node-only internals and will break if imported
  into a 'use client' file.

  Every function takes an optional `draft` flag, passed straight through
  to Payload's local API. Without it, Payload only ever returns the
  currently-PUBLISHED version of a doc -- which is correct for real site
  visitors, but means Live Preview's iframe (payload.config.ts's
  livePreviewURL appends ?draft=true) would only ever show what's
  already live, never an in-progress edit. Each previewable page.tsx
  reads its own `draft` searchParam and threads it down to these calls;
  everywhere else (layout.tsx, any page without that param) it's simply
  omitted/false, so ordinary visitors are entirely unaffected.
*/
const getClient = cache(async () => getPayload({ config }))

export const getNavigation = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'navigation', draft })
})

export const getFooterGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'footer', draft })
})

export const getSiteSettings = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'site-settings', draft })
})

export const getPipeline = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'pipeline', draft })
})

export const getFinalCTA = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'final-cta', draft })
})

export const getReadyToTalk = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'ready-to-talk', draft })
})

export const getHomePageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'home-page', depth: 2, draft })
})

export const getHowItWorksPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'how-it-works-page', depth: 2, draft })
})

export const getPortfolioIndexPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'portfolio-index-page', depth: 2, draft })
})

export const getContactPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'contact-page', draft })
})

export const getScheduleACallPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'schedule-a-call-page', draft })
})

export const getIndustriesCollection = cache(async (draft = false) => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'industries', limit: 100, depth: 2, draft })
  return result.docs
})

export const getPortfolioProjectsCollection = cache(async (draft = false) => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'portfolio-projects', limit: 100, depth: 1, sort: 'order', draft })
  return result.docs
})

export const getJournalPostsCollection = cache(async (draft = false) => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'journal-posts', limit: 100, depth: 1, draft })
  return result.docs
})
