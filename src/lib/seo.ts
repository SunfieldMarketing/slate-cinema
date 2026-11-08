import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/payload-data'
import { mediaUrl } from '@/lib/media-url'

/** Branded 1200x630 card used when neither the page nor Site Settings > SEO sets a share image. */
export const DEFAULT_SHARE_IMAGE = '/images/og-default.jpg'

/** Used when Site Settings > SEO is empty (a fresh database). */
// Says what the studio does and where (2026-11-07, Levi's AI-search list #1).
export const DEFAULT_TITLE = 'Slate Cinema | Video Production and Video Editing in Brooklyn, NYC'
export const DEFAULT_DESCRIPTION =
  'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.'

/** A document's "Search engines & sharing" fields (src/fields/seo.ts). */
export interface SeoValues {
  metaTitle?: string | null
  metaDescription?: string | null
  metaImage?: unknown
  noIndex?: boolean | null
}

/*
  Server-only. Title, description, share card and indexing for one page
  (2026-10-02): what an editor set under "Search engines & sharing", else
  the page's own defaults, else Site Settings > SEO.

  Builds the whole Open Graph / Twitter card for the page. Next replaces a
  layout's `openGraph` wholesale when a page sets one, and before this
  every original page inherited the homepage's -- so a shared /contact
  link previewed as "Slate Cinema" with the homepage description.
*/
export async function pageMetadata({
  path,
  seo,
  title,
  description,
  image,
  absoluteTitle = false,
  noIndex = false,
}: {
  /** The page's address, e.g. "/how-it-works". */
  path: string
  seo?: SeoValues | null
  /** Default title, before Site Settings' "%s | Slate Cinema" template. */
  title: string
  description?: string
  /** Default share image URL. */
  image?: string
  /** Use the title as-is, without the template (the homepage). */
  absoluteTitle?: boolean
  /** Always keep this page out of search engines. */
  noIndex?: boolean
}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const pageTitle = seo?.metaTitle?.trim() || title
  // Never undefined: a page's `description: undefined` would wipe out the
  // layout's instead of inheriting it.
  const pageDescription = seo?.metaDescription?.trim() || description || settings.seo?.defaultDescription || DEFAULT_DESCRIPTION
  // Never imageless: a link with no picture previews as a bare text row in
  // iMessage, Slack and social feeds (Oct 27 audit #14).
  const shareImage = mediaUrl(seo?.metaImage) || image || mediaUrl(settings.seo?.ogImage) || DEFAULT_SHARE_IMAGE
  const template = settings.seo?.titleTemplate || '%s | Slate Cinema'
  const shareTitle = absoluteTitle ? pageTitle : template.replace('%s', pageTitle)
  const hidden = noIndex || Boolean(seo?.noIndex)

  return {
    title: absoluteTitle ? { absolute: pageTitle } : pageTitle,
    description: pageDescription,
    // One canonical address per page, on the www host the apex redirects to.
    alternates: { canonical: path },
    ...(hidden ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: shareTitle,
      description: pageDescription,
      url: path,
      siteName: 'Slate Cinema',
      locale: 'en_US',
      type: 'website',
      images: [{ url: shareImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: pageDescription,
      images: [shareImage],
    },
  }
}
