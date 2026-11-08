/*
  The site's brand color (2026-10-02): Site Settings > Brand color. The
  root layout sets it as --color-brand-blue on <html>, so every
  `brand-blue` utility and every color-mix() on that variable follows it;
  components that need the actual hex (gradients built with hex alpha
  suffixes, SVG fills, the glow chain) read it through useBrandColor() in
  site-data-context.tsx, or brandColor() on the server.

  Client-safe: plain data, no Payload imports.
*/

export const DEFAULT_BRAND = '#00AEEF'

const HEX = /^#[0-9a-fA-F]{6}$/

/** The configured brand color, or the original blue if it's empty or not a 6-digit hex. */
export function brandColor(value?: string | null): string {
  const trimmed = value?.trim() ?? ''
  return HEX.test(trimmed) ? trimmed : DEFAULT_BRAND
}

/*
  Industry accents double as small-text colours (eyebrows, "Keyframe 01" labels) on the
  near-black page. A picked colour can be too dark for that -- Education's indigo #6366F1
  measured 4.38:1, under the 4.5:1 minimum (2026-11-04 re-audit). This lifts a colour
  towards white in small steps until it clears 4.6:1 on the page background, so it stays
  recognisably the same hue (#6366F1 -> #696CF2, 4.69:1). Colours that already pass are returned
  unchanged.
*/
const PAGE_BG = '#15171B'
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
export function readableAccent(value?: string | null): string {
  const hex = value?.trim() ?? ''
  if (!HEX.test(hex)) return value ?? ''
  let out = hex
  for (let mix = 0.04; contrast(out, PAGE_BG) < 4.6 && mix <= 1; mix += 0.04) {
    out =
      '#' +
      [1, 3, 5]
        .map((i) => {
          const c = parseInt(hex.slice(i, i + 2), 16)
          return Math.round(c + (255 - c) * mix).toString(16).padStart(2, '0')
        })
        .join('')
  }
  return out
}

/** Payload field validation for a hex color. */
export function validateHex(value: unknown): true | string {
  if (value == null || value === '') return true
  return HEX.test(String(value).trim()) || 'Use a 6-digit hex color code, e.g. #00AEEF.'
}
