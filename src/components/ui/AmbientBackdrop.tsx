'use client'

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

export default function AmbientBackdrop({ accent = '#00AEEF' }: Props) {
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
