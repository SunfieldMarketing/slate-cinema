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

/** Payload field validation for a hex color. */
export function validateHex(value: unknown): true | string {
  if (value == null || value === '') return true
  return HEX.test(String(value).trim()) || 'Use a 6-digit hex color code, e.g. #00AEEF.'
}
