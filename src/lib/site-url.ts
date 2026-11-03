/*
  The site's one canonical address (2026-11-03, Oct 27 audit #14). The
  apex domain (slatecinema.com) permanently redirects to www, so sitemap
  URLs, canonical tags and share links must all use the www form -- they
  used to be hardcoded to the apex in three places (layout, sitemap,
  robots), which made every sitemap entry a redirect.

  NEXT_PUBLIC_SITE_URL still wins when set (a preview or staging
  domain), but a bare apex value is upgraded to www so a stale env var
  can't bring the redirecting form back.
*/
const FALLBACK = 'https://www.slatecinema.com'

function normalize(raw: string | undefined): string {
  const value = (raw ?? '').trim().replace(/\/+$/, '')
  if (!value) return FALLBACK
  return value.replace(/^(https?:\/\/)slatecinema\.com$/i, '$1www.slatecinema.com')
}

export const SITE_URL = normalize(process.env.NEXT_PUBLIC_SITE_URL)

/** Absolute URL for a site path: absoluteUrl('/contact') -> https://www.slatecinema.com/contact */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path === '/' ? '' : path.startsWith('/') ? path : `/${path}`}`
}
