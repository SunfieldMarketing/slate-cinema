'use client'

import { extractVimeoId, vimeoEmbedUrl } from '@/lib/vimeo'

/*
  Drop-in replacement for a raw <video> tag that can also point at a
  Vimeo video instead of an uploaded/local file. Added 2026-08-19 -- see
  src/lib/vimeo.ts's header comment for why.

  Every existing call site keeps working unchanged if it never passes
  `vimeo` -- this only branches into the iframe path when a real Vimeo
  URL/ID is present, so this is purely additive, not a rewrite of how
  video already renders everywhere.
*/
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
  /** Only meaningful on the file-based path; a Vimeo iframe ignores this
      (its own poster/play-button UI stands in for it in "player" mode). */
  onLoadedData?: () => void
}

export default function SmartVideo({
  src,
  vimeo,
  poster,
  variant = 'background',
  className,
  onLoadedData,
}: SmartVideoProps) {
  const vimeoId = extractVimeoId(vimeo)

  if (vimeoId) {
    return (
      <iframe
        src={vimeoEmbedUrl(vimeoId, variant)}
        className={className}
        style={{ border: 0 }}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        title="Vimeo video"
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
      />
    )
  }

  if (poster) {
    // eslint-disable-next-line @next/next/no-img-element -- poster-only fallback, not a real <Image> use case
    return <img src={poster} alt="" className={className} />
  }

  return null
}
