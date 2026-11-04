'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { extractVimeoId, vimeoEmbedUrl } from '@/lib/vimeo'
import { mobileMediaUrl, useIsMobile } from '@/lib/mobile-media'

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
const PLACEHOLDER_VIDEO = '/videos/production-web.mp4'

/*
  Exact "cover" box for a Vimeo embed (2026-10-02, "the hero section video on mobile should
  fit size of hero section"): Vimeo letterboxes its 16:9 picture inside the iframe, so the
  iframe itself has to be wide enough for the box's height and tall enough for its width.

  2026-11-04 re-audit: this used to be measured in JavaScript after hydration, with a 200%
  oversize until then -- on a phone the iframe snapped to its real size ~2.7s in, which
  Lighthouse scored as a 0.42-0.67 layout shift on every industry page (good is < 0.1).
  It's now pure CSS from the first paint: a size container around the iframe, and
  container-query units (cqw/cqh = 1% of that box) for the same max() maths, so nothing
  ever resizes. Positioned with left/top, not a transform, so scroll animations that
  transform the iframe (CinematicStatement's parallax) still compose.
*/
const COVER_BOX: CSSProperties = { position: 'absolute', inset: 0, overflow: 'hidden', containerType: 'size' }
const COVER_W = 'max(100cqw, 177.78cqh)'
const COVER_H = 'max(100cqh, 56.25cqw)'
const COVER_IFRAME: CSSProperties = {
  border: 0,
  position: 'absolute',
  width: `calc(${COVER_W} + 2px)`,
  height: `calc(${COVER_H} + 2px)`,
  left: `calc((100cqw - ${COVER_W}) / 2 - 1px)`,
  top: `calc((100cqh - ${COVER_H}) / 2 - 1px)`,
}
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

  // Mobile swap (Jake, 2026-09-18): some of the files that flow through here
  // (the pipeline loops: 5-28MB each) have ~1MB phone-sized siblings on S3.
  // On a phone we (a) point at the small file, (b) don't set any src until we
  // KNOW whether this is a phone -- a `src` in the server HTML would start
  // the big download before hydration could correct it -- and (c) only keep
  // the file attached while the video is actually near the viewport, so at
  // most one decoder is alive at a time. Files with no mobile sibling behave
  // exactly as before.
  const isMobile = useIsMobile()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const mobileSrc = src ? mobileMediaUrl(src) : undefined
  const swappable = !!mobileSrc
  const resolvedSrc = swappable
    ? isMobile === null
      ? undefined
      : isMobile
        ? inView
          ? mobileSrc
          : undefined
        : src
    : src

  useEffect(() => {
    const el = videoRef.current
    if (!swappable || isMobile !== true || !el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '200px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [swappable, isMobile])

  useEffect(() => {
    const el = videoRef.current
    // Out of view (or not yet decided): release the file and its decoder
    // rather than leaving a paused-but-loaded video sitting in memory.
    if (el && swappable && !resolvedSrc) {
      el.pause()
      el.removeAttribute('src')
      el.load()
    }
  }, [swappable, resolvedSrc])

  // 2026-10-01, "photos and videos aren't loading or take forever": every
  // ambient video used to start loading the moment its page did, wherever it
  // sat -- an industry page booted six 1080p Vimeo players at once (hero,
  // four client cards, the statement), all fighting the hero and the page's
  // photos for bandwidth. Background media below the fold now waits until
  // it's about to scroll into view; the hero (`priority`) and click-to-play
  // players still load immediately.
  const [nearView, setNearView] = useState(priority || variant === 'player')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (nearView) return
    const el = vimeoId ? iframeRef.current : videoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNearView(true)
        io.disconnect()
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [nearView, vimeoId, src])

  if (vimeoId) {
    // CSS object-fit only affects replaced elements (<video>/<img>), never
    // an <iframe>'s content -- a plain w-full/h-full className just
    // stretches or letterboxes the player instead of covering. coverFit
    // makes it an exact "cover" box (see COVER_IFRAME below). Opt-in rather
    // than automatic, since Hero.tsx's own className already does its own
    // (viewport-relative) version of this and an inline style here would
    // win specificity and clobber it.
    const iframe = (
      <iframe
        ref={iframeRef}
        // No src until it's near the viewport (see nearView above). The
        // element itself stays the same, so scroll animations aimed at it
        // (CinematicStatement's parallax) keep working once it loads. Only
        // the hero forces 1080p; smaller embeds (client cards, the
        // statement) let Vimeo pick a size that fits the box.
        src={nearView ? vimeoEmbedUrl(vimeoId, variant, { hd: priority }) : undefined}
        className={className}
        style={coverFit ? COVER_IFRAME : { border: 0 }}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        loading={priority ? 'eager' : 'lazy'}
        // @ts-expect-error -- React's types only list fetchPriority on
        // img/link/script, but it renders the attribute on any element and
        // every Chromium/Firefox browser that matters honors it on iframes.
        // (camelCase: the lowercase spelling logs an invalid-DOM-property
        // warning in development.)
        fetchPriority={priority ? 'high' : undefined}
        title="Vimeo video"
        // Previously ignored on this path (see the prop doc above) -- an
        // iframe's own "loaded" signal is exactly what a caller wiring up
        // a loading spinner around a player-variant embed needs.
        onLoad={onLoadedData}
      />
    )
    return coverFit ? <div style={COVER_BOX}>{iframe}</div> : iframe
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
        ref={videoRef}
        src={nearView ? resolvedSrc : undefined}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        controls={variant === 'player'}
        // Ambient (background) videos get the .bg-video class, which hides
        // any native play button WebKit paints when autoplay is blocked.
        className={variant === 'player' ? className : `bg-video ${className ?? ''}`}
        onLoadedData={onLoadedData}
        preload={priority ? 'auto' : swappable && isMobile ? 'metadata' : undefined}
        // @ts-expect-error -- same as the iframe path above.
        fetchPriority={priority ? 'high' : undefined}
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
      ref={videoRef}
      src={nearView ? PLACEHOLDER_VIDEO : undefined}
      autoPlay
      loop
      muted
      playsInline
      controls={variant === 'player'}
      className={className}
    />
  )
}
