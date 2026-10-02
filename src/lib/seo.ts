import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/payload-data'
import { mediaUrl } from '@/lib/media-url'

/** Used when Site Settings > SEO is empty (a fresh database). */
export const DEFAULT_TITLE = 'Slate Cinema | Video Marketing at Your Fingertips'
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
  const shareImage = mediaUrl(seo?.metaImage) || image || mediaUrl(settings.seo?.ogImage)
  const template = settings.seo?.titleTemplate || '%s | Slate Cinema'
  const shareTitle = absoluteTitle ? pageTitle : template.replace('%s', pageTitle)
  const hidden = noIndex || Boolean(seo?.noIndex)

  return {
    title: absoluteTitle ? { absolute: pageTitle } : pageTitle,
    description: pageDescription,
    ...(hidden ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: shareTitle,
      description: pageDescription,
      url: path,
      siteName: 'Slate Cinema',
      locale: 'en_US',
      type: 'website',
      ...(shareImage ? { images: [{ url: shareImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: pageDescription,
      ...(shareImage ? { images: [shareImage] } : {}),
    },
  }
}
