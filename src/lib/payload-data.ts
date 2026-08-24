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
  to Payload's local API, ALWAYS paired with `overrideAccess: draft`.
  Corrected 2026-08-24: `draft` alone does NOT restrict a plain read to
  published-only content -- confirmed directly against Payload's own
  source (collections/operations/find.js, globals/operations/findOne.js)
  after this session's e2eTest caught a saved-but-unpublished draft
  showing up on a draft:false read. The Local API's own default
  (overrideAccess:true for collections, false for globals) makes this
  inconsistent unless set explicitly here every time. Passing
  overrideAccess: draft means: ordinary visitors (draft=false) get
  overrideAccess:false, which enforces each collection/global's
  access.read -- now written to return `{ _status: { equals: 'published' } }`
  for anonymous requests (see Industries.ts et al) -- so drafts stay
  invisible until published. Live Preview (draft=true, via
  payload.config.ts's livePreviewURL -> /api/preview's draftMode cookie)
  gets overrideAccess:true, bypassing that restriction entirely so an
  in-progress edit actually shows up in the iframe.
*/
const getClient = cache(async () => getPayload({ config }))

export const getNavigation = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'navigation', draft, overrideAccess: draft })
})

export const getFooterGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'footer', draft, overrideAccess: draft })
})

export const getSiteSettings = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'site-settings', draft, overrideAccess: draft })
})

export const getPipeline = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'pipeline', draft, overrideAccess: draft })
})

export const getFinalCTA = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'final-cta', draft, overrideAccess: draft })
})

export const getReadyToTalk = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'ready-to-talk', draft, overrideAccess: draft })
})

export const getHomePageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'home-page', depth: 2, draft, overrideAccess: draft })
})

export const getHowItWorksPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'how-it-works-page', depth: 2, draft, overrideAccess: draft })
})

export const getPortfolioIndexPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'portfolio-index-page', depth: 2, draft, overrideAccess: draft })
})

export const getContactPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'contact-page', draft, overrideAccess: draft })
})

export const getScheduleACallPageGlobal = cache(async (draft = false) => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'schedule-a-call-page', draft, overrideAccess: draft })
})

export const getIndustriesCollection = cache(async (draft = false) => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'industries', limit: 100, depth: 2, draft, overrideAccess: draft })
  return result.docs
})

export const getPortfolioProjectsCollection = cache(async (draft = false) => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'portfolio-projects', limit: 100, depth: 1, sort: 'order', draft, overrideAccess: draft })
  return result.docs
})

export const getJournalPostsCollection = cache(async (draft = false) => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'journal-posts', limit: 100, depth: 1, draft, overrideAccess: draft })
  return result.docs
})
