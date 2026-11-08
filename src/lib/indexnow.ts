import { SITE_URL } from '@/lib/site-url'

/*
  IndexNow (2026-11-07, Levi's AI-search list #9): tells Bing -- whose index feeds ChatGPT
  search and Copilot -- that a page changed, the moment it's published, instead of waiting
  for a recrawl. Google doesn't use IndexNow; the sitemap's real lastmod covers Google.

  The key is public by design: Bing proves ownership by fetching it from the site root
  (public/indexnow-key.txt), which covers every URL on the host. Only production pings --
  a local or preview save must never announce live URLs.
*/
export const INDEXNOW_KEY = '20ad672c14e9d7a1832198f328b3511c'

export async function notifyIndexNow(paths: string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production' || !paths.length) return
  const host = new URL(SITE_URL).host
  const urlList = [...new Set(paths)].map((p) => `${SITE_URL}${p === '/' ? '' : p}`)
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/indexnow-key.txt`, urlList }),
      // Never hold up an admin save on a slow third party.
      signal: AbortSignal.timeout(3000),
    })
    console.info(`[indexnow] ${res.status} for ${urlList.join(', ')}`)
  } catch (e) {
    console.warn(`[indexnow] skipped: ${e instanceof Error ? e.message : String(e)}`)
  }
}

/** Public URL(s) a saved global appears at; site-wide globals announce the home page. */
export function globalPaths(slug: string): string[] {
  const map: Record<string, string> = {
    'home-page': '/',
    'portfolio-index-page': '/portfolio',
    'how-it-works-page': '/how-it-works',
    'contact-page': '/contact',
    'schedule-a-call-page': '/schedule-a-call',
    'journal-page': '/journal',
    'social-media-management-page': '/social-media-management',
    'privacy-policy-page': '/privacy-policy',
    'terms-of-service-page': '/terms-of-service',
  }
  return map[slug] ? [map[slug]] : []
}

/** Public URL(s) a saved collection document appears at. */
export function docPaths(collection: string, doc: Record<string, unknown>): string[] {
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  switch (collection) {
    case 'journal-posts':
      return slug ? [`/journal/${slug}`, '/journal'] : []
    case 'industries':
      return slug ? [`/portfolio/${slug}`] : []
    case 'pages':
      return typeof doc.path === 'string' && doc.path ? [`/${doc.path.replace(/^\/+/, '')}`] : []
    case 'portfolio-projects':
      return ['/portfolio']
    default:
      return []
  }
}
