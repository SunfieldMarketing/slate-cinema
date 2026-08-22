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
*/
const getClient = cache(async () => getPayload({ config }))

export const getNavigation = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'navigation' })
})

export const getFooterGlobal = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'footer' })
})

export const getSiteSettings = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'site-settings' })
})

export const getPipeline = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'pipeline' })
})

export const getFinalCTA = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'final-cta' })
})

export const getReadyToTalk = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'ready-to-talk' })
})

export const getHomePageGlobal = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'home-page', depth: 2 })
})

export const getHowItWorksPageGlobal = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'how-it-works-page', depth: 2 })
})

export const getPortfolioIndexPageGlobal = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'portfolio-index-page', depth: 2 })
})

export const getContactPageGlobal = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'contact-page' })
})

export const getScheduleACallPageGlobal = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'schedule-a-call-page' })
})

export const getIndustriesCollection = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'industries', limit: 100, depth: 2 })
  return result.docs
})

export const getPortfolioProjectsCollection = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'portfolio-projects', limit: 100, depth: 1, sort: 'order' })
  return result.docs
})

export const getJournalPostsCollection = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'journal-posts', limit: 100, depth: 1 })
  return result.docs
})
