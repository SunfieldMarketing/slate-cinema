'use client'

import { useSyncExternalStore } from 'react'

/*
  Mobile-only lightweight media (Jake, 2026-09-18, "mobile crash on the
  homepage is not hosting"): phones were crashing because of what the page
  asks them to hold -- the hero scroll sequence decodes to ~3MB of bitmap
  RAM per frame -- not because of the host. Every file below already lives
  in the CMS media library and on S3 (media ids 226-237), sized for phones
  (~1MB videos, 800px images). Desktop assets are untouched; this only
  changes what a <=767px viewport is pointed at.
*/
export const MOBILE_QUERY = '(max-width: 767px)'

const S3 = 'https://s3.us-east-1.amazonaws.com/slate-cinema-media/slate/'

// The phone hero. Jake's spec named hero-mobile-1mb.mp4 (480x270, 0.97MB) --
// but a portrait phone fills its HEIGHT with a 16:9 clip, so only the center
// ~26% of the frame's width is ever visible: that file leaves ~125 real
// pixels across the screen, which is why it looked smeared ("video was
// blurry"). This is the SAME 68s reel (public/videos/hero.mp4, the 1080p
// master) pre-cropped to that center window and encoded at 400x866 -- same
// framing, every visible pixel real, 3.3MB. Served from the site's own
// static files. Jake's S3 version stays as the constant below if we ever
// want to compare or fall back.
// 2026-09-18 follow-up ("make it full res, not blurry"): the first cut was
// downscaled to 400px wide to match CSS pixels, but phones are 3x -- a
// 375pt-wide iPhone screen is 1125 real pixels, so 400 still looked soft.
// The master's visible window is natively 500x1080, the most real detail
// that exists in the source, so this is that window UNSCALED (8.3MB).
export const HERO_MOBILE_VIDEO = '/videos/hero-mobile-hq.mp4'
export const HERO_MOBILE_POSTER = '/videos/hero-mobile-hq-poster.webp'
export const HERO_MOBILE_VIDEO_1MB = `${S3}hero-mobile-1mb.mp4`

export const REEL_MOBILE_VIDEO = `${S3}reel-mobile-1mb.mp4`
export const REEL_MOBILE_POSTER = `${S3}reel-poster-mobile.webp`

// Original S3 filename -> its phone-sized sibling in the same folder.
const MOBILE_FILES: Record<string, string> = {
  'pipeline-pre-production.mp4': 'pipeline-pre-production-mobile.mp4',
  'pipeline-production.mp4': 'pipeline-production-mobile.mp4',
  'pipeline-post-production.mp4': 'pipeline-post-production-mobile.mp4',
  'pipeline-distribution.mp4': 'pipeline-distribution-mobile.mp4',
  'sleepy-hollow-hotel.jpg': 'sleepy-hollow-hotel-mobile.webp',
  'meta-logo.webp': 'meta-logo-mobile.webp',
  'alo-logo.webp': 'alo-logo-mobile.webp',
  'bh-logo.webp': 'bh-logo-mobile.webp',
}

/**
 * The phone-sized replacement for `url`, or undefined when there isn't one
 * (in which case callers keep using `url` as-is). Deliberately only matches
 * our own S3 copies by exact filename -- it never guesses at other hosts.
 */
export function mobileMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  const clean = url.split('?')[0]
  if (clean === '/videos/performance.mp4') return REEL_MOBILE_VIDEO
  if (!clean.startsWith(S3)) return undefined
  const mapped = MOBILE_FILES[clean.slice(S3.length)]
  return mapped ? S3 + mapped : undefined
}

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

/**
 * true on phones, false otherwise, and **null until the client knows**
 * (server render + hydration). Callers that would otherwise fetch a heavy
 * desktop file should render nothing for `null` rather than guess --
 * guessing desktop on a phone means the big download has already started
 * by the time we correct it.
 */
export function useIsMobile(): boolean | null {
  return useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => null
  )
}
