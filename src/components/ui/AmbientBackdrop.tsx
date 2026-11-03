'use client'

import { useBrandColor } from '@/lib/site-data-context'

/*
  AmbientBackdrop — a quiet, mostly-static backdrop mounted once per page so
  sections share one continuous canvas instead of each painting its own
  opaque box. Deliberately restrained: no drifting orbs, no motion, just a
  faint wash so it reads as atmosphere rather than a visual element in its
  own right.
*/
interface Props {
  accent?: string
}

export default function AmbientBackdrop({ accent: accentProp }: Props) {
  const brand = useBrandColor()
  const accent = accentProp ?? brand
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-ink" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${accent}, transparent 70%)` }}
      />
    </div>
  )
}
