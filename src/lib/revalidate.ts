import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/*
  Real-time publish: without this, a save in /admin only reaches visitors
  once the frontend's own ISR window naturally elapses AND a request
  happens to land after it -- up to 5 minutes (src/app/(frontend)/layout.tsx's
  `revalidate = 300`), and in practice often longer, since ISR only
  regenerates on the request AFTER the window closes, serving one more
  stale hit first. Every collection/global gets this same hook so a save
  or publish invalidates the site immediately instead of waiting on that
  window.

  `revalidatePath('/', 'layout')` invalidates the root layout and every
  route nested under it -- i.e. the whole site -- rather than trying to
  hand-maintain a slug -> which-pages-consume-it map for each of the 15
  collections/globals here. That map is exactly the kind of thing that
  silently drifts out of date (this session found two separate cases of
  a component quietly reading from the wrong/a duplicate data source --
  StatsBand vs PageHero, TrustSection vs TrustBanner -- that a hand-built
  path map would have gotten wrong in the same way). A full-site
  revalidation on every save is cheap (it just marks cache entries stale;
  pages still only regenerate on their next actual request) and always
  correct.
*/
function revalidateSite(reason: string) {
  revalidatePath('/', 'layout')
  console.info(`[revalidate] ${reason} -- full site cache invalidated`)
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ global, doc }) => {
  revalidateSite(`global "${global.slug}" saved`)
  return doc
}

export const revalidateCollectionAfterChange: CollectionAfterChangeHook = ({ collection, doc }) => {
  revalidateSite(`"${collection.slug}" doc ${doc?.id ?? ''} saved`)
  return doc
}

export const revalidateCollectionAfterDelete: CollectionAfterDeleteHook = ({ collection, doc }) => {
  revalidateSite(`"${collection.slug}" doc ${doc?.id ?? ''} deleted`)
  return doc
}
