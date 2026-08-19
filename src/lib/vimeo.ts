/*
  Shared Vimeo-URL/ID detection, used everywhere a media slot needs to
  choose between an uploaded file and an embedded Vimeo video. Added
  2026-08-19 per Kauan's request ("make sure every piece of media on the
  site has ability to be replaced with vimeo video iframe") -- real
  client footage lives on Jake's public Vimeo account
  (vimeo.com/user58842347, 281 videos) and this is the single place that
  turns whatever an editor pastes (a bare ID, a full vimeo.com URL, a
  player.vimeo.com URL) into the numeric ID the embed URL needs.

  Accepts:
    "862067416"                              -> "862067416"
    "https://vimeo.com/862067416"             -> "862067416"
    "vimeo.com/862067416"                     -> "862067416"
    "https://player.vimeo.com/video/862067416" -> "862067416"
  Returns null for anything else (a local file path like "/videos/hero.mp4",
  empty string, undefined) -- callers use that to fall back to the existing
  file-based rendering unchanged.
*/
export function extractVimeoId(input?: string | null): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^\d+$/.test(trimmed)) return trimmed
  const match = trimmed.match(/vimeo(?:\.com)?\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

/*
  Builds the player.vimeo.com embed URL.
  - "background" variant: no chrome, autoplays muted/looped -- matches how
    every ambient/hero/beat video on the site already behaves via
    <video autoPlay loop muted playsInline>.
  - "player" variant: Vimeo's own native poster + play button + controls --
    matches how a testimonial/portfolio video is meant to be clicked and
    watched, no controls to reimplement ourselves.
*/
export function vimeoEmbedUrl(id: string, variant: 'background' | 'player' = 'background') {
  const params =
    variant === 'background'
      ? 'background=1&autoplay=1&loop=1&muted=1&byline=0&title=0&portrait=0'
      : 'byline=0&title=0&portrait=0&dnt=1'
  return `https://player.vimeo.com/video/${id}?${params}`
}
