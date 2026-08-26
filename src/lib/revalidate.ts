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
  try {
    revalidatePath('/', 'layout')
    console.info(`[revalidate] ${reason} -- full site cache invalidated`)
  } catch (e) {
    // Found 2026-08-26: a data-population migration's payload.updateGlobal()
    // call hit this hook and threw "Invariant: static generation store
    // missing in revalidatePath /", aborting the whole migration.
    // revalidatePath only works inside an active Next.js request context
    // (API route, Server Action, Server Component render) -- a plain
    // `node .../bin.js migrate` run has no such context. Real admin saves
    // always run inside one, so this is never expected to actually catch
    // anything there; it's specifically for Local API callers outside
    // Next's runtime, where skipping a revalidation that the very next
    // deploy's build will make moot anyway is harmless, but aborting the
    // caller's actual write isn't.
    console.warn(`[revalidate] ${reason} -- skipped (not in a Next.js request context): ${e instanceof Error ? e.message : String(e)}`)
  }
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
