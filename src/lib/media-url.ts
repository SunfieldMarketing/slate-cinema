/*
  Pure, client-safe helper -- deliberately split out of payload-data.ts so
  'use client' components can narrow a Payload upload relation (populated
  Media doc or bare numeric ID) to a URL string without pulling in
  payload-data.ts's module-level `getPayload()`/`@/payload.config` imports,
  which are Node-only and break the client bundle.
*/
export function mediaUrl(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'url' in value) {
    return (value as { url?: string }).url ?? undefined
  }
  return undefined
}

// A slot with no real image assigned yet used to render an empty <img>
// (broken icon) or nothing at all. Per "every piece of media on site
// should be using placeholder media if there's no direct piece of media
// for it yet", every still-image slot without real media falls back to
// this instead -- a plain local SVG, so it always resolves even before
// any CMS media exists.
export const PLACEHOLDER_IMAGE = '/images/placeholder.svg'

/** mediaUrl(), but falls back to PLACEHOLDER_IMAGE instead of undefined. */
export function mediaUrlOrPlaceholder(value: unknown): string {
  return mediaUrl(value) || PLACEHOLDER_IMAGE
}
