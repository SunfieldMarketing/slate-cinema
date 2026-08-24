'use client'

import type { CSSProperties } from 'react'
import { extractVimeoId, vimeoEmbedUrl } from '@/lib/vimeo'

/*
  Drop-in replacement for a raw <video> tag that can also point at a
  Vimeo video instead of an uploaded/local file. Added 2026-08-19 -- see
  src/lib/vimeo.ts's header comment for why.

  Every existing call site keeps working unchanged if it never passes
  `vimeo` -- this only branches into the iframe path when a real Vimeo
  URL/ID is present, so this is purely additive, not a rewrite of how
  video already renders everywhere.

  2026-08-22 -- a slot with no `vimeo`, `src`, or `poster` at all used to
  render nothing: an empty box (see Pipeline's "Live Preview" badge over
  a blank panel whenever a phase has no video assigned yet). Per
  "every piece of media on site should be using placeholder media if
  there's no direct piece of media for it yet", fall back to one of the
  site's existing generic B-roll clips instead of rendering nothing --
  same placeholder-over-blank principle already applied to images via
  PLACEHOLDER_IMAGE in media-url.ts.
*/
const PLACEHOLDER_VIDEO = '/videos/production.mp4'
interface SmartVideoProps {
  /** Local file path or Payload-Media/Vercel-Blob URL -- today's behavior. */
  src?: string
  /** Vimeo URL or bare ID. Wins over `src` when both are present. */
  vimeo?: string
  poster?: string
  /**
   * "background": no Vimeo chrome, autoplays muted/looped, fills the
   *   container like the site's existing ambient/hero videos.
   * "player": Vimeo's own poster + play button + controls -- for
   *   testimonials and the portfolio card modal, where a visitor clicks
   *   to watch rather than it playing ambiently.
   */
  variant?: 'background' | 'player'
  className?: string
  /** Fires once the media is ready to show -- the file-based `<video>`'s
      own loadeddata event, or an iframe's load event on the Vimeo path
      (note: iframe `load` fires once the embed document is up, not once
      the video itself is playable, but it's the earliest DOM signal
      available and enough to know the player's own chrome has replaced
      a blank/loading state). */
  onLoadedData?: () => void
  /** Set on every page's actual hero -- the one video that should win the
      race against everything else on the page (frame sequences, gallery
      thumbnails, etc.) instead of loading whenever the browser gets to it. */
  priority?: boolean
  /** object-fit:cover only works on <video>/<img>, never on an <iframe> --
      a plain w-full/h-full className just stretches or letterboxes a Vimeo
      embed instead of covering. Set this on a "background" usage whose
      container isn't already handling its own oversize-and-crop sizing
      (Hero.tsx's viewport-relative vw/vh math already does this itself,
      so it deliberately leaves this off). Requires the immediate parent
      to be position:relative + overflow:hidden, same as every existing
      video-backdrop wrapper already is. */
  coverFit?: boolean
}

export default function SmartVideo({
  src,
  vimeo,
  poster,
  variant = 'background',
  className,
  onLoadedData,
  priority = false,
  coverFit = false,
}: SmartVideoProps) {
  const vimeoId = extractVimeoId(vimeo)

  if (vimeoId) {
    // CSS object-fit only affects replaced elements (<video>/<img>), never
    // an <iframe>'s content -- a plain w-full/h-full className just
    // stretches or letterboxes the player instead of covering. Oversizing
    // by a fixed percentage covers regardless of the parent's actual
    // aspect ratio. Opt-in via coverFit rather than automatic, since
    // Hero.tsx's own className already does its own (more precise,
    // viewport-relative) version of this and an inline style here would
    // win specificity and clobber it.
    const coverStyle: CSSProperties = coverFit
      ? { border: 0, position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%' }
      : { border: 0 }
    return (
      <iframe
        src={vimeoEmbedUrl(vimeoId, variant)}
        className={className}
        style={coverStyle}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        loading={priority ? 'eager' : undefined}
        // @ts-expect-error -- fetchpriority isn't in React's iframe attribute
        // types yet, but every Chromium/Firefox browser that matters honors it.
        fetchpriority={priority ? 'high' : undefined}
        title="Vimeo video"
        // Previously ignored on this path (see the prop doc above) -- an
        // iframe's own "loaded" signal is exactly what a caller wiring up
        // a loading spinner around a player-variant embed needs.
        onLoad={onLoadedData}
      />
    )
  }

  if (src) {
    // File-based path is unchanged either way -- autoplay/loop/muted plus
    // visible controls together, exactly what every existing call site
    // already did before SmartVideo existed. Only the Vimeo path above
    // actually differs by variant (a Vimeo iframe can't be told to both
    // autoplay ambiently AND show its own controls at once the way a
    // native <video> element can).
    return (
      <video
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        controls={variant === 'player'}
        className={className}
        onLoadedData={onLoadedData}
        preload={priority ? 'auto' : undefined}
        // @ts-expect-error -- same as the iframe path above.
        fetchpriority={priority ? 'high' : undefined}
      />
    )
  }

  if (poster) {
    // eslint-disable-next-line @next/next/no-img-element -- poster-only fallback, not a real <Image> use case
    return <img src={poster} alt="" className={className} />
  }

  // Nothing set at all -- generic B-roll instead of a blank box.
  return (
    <video
      src={PLACEHOLDER_VIDEO}
      autoPlay
      loop
      muted
      playsInline
      controls={variant === 'player'}
      className={className}
    />
  )
}
