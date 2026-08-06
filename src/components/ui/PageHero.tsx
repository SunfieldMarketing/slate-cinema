'use client'

import React, { useRef } from 'react'
import { preload } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { NumberTicker } from '@/components/ui/number-ticker'

/*
  Shared cinematic hero for interior pages. A full-viewport video/gradient
  banner with a film-slate eyebrow, big masked headline, subcopy, optional CTA,
  and an integrated animated-stat strip pinned to the bottom — matching the
  home Hero's language so every route feels like one film.
*/

export interface HeroStat {
  value: number
  suffix: string
  label: string
}

interface Props {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  videoSrc?: string
  accent?: string
  cta?: { label: string; href: string }
  /** Optional low-commitment secondary action (e.g. "Watch the reel"). */
  secondaryCta?: { label: string; href: string }
  /** Optional one-line trust note rendered under the CTAs. */
  trustNote?: string
  /** Optional poster image to show instantly before video loads. */
  posterSrc?: string
  /** Optional stat row — when provided, renders inside the hero at the bottom. */
  stats?: HeroStat[]
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  videoSrc,
  posterSrc,
  accent = '#00AEEF',
  cta,
  secondaryCta,
  trustNote,
  stats,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  // Preload media immediately with high priority so it's ready instantly
  if (posterSrc) {
    preload(posterSrc, { as: 'image', fetchPriority: 'high' })
  }
  if (videoSrc) {
    preload(videoSrc, { as: 'video', fetchPriority: 'high' })
  }

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-line',  { yPercent: 120 }, { yPercent: 0, stagger: 0.1,  duration: 0.9, ease: 'power4.out', delay: 0.1 })
      gsap.fromTo('.ph-fade',  { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.4 })
      gsap.fromTo('.ph-stat',  { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1,  duration: 0.7, ease: 'power3.out', delay: 0.7 })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className={`relative w-full flex flex-col justify-between overflow-hidden ${
        stats && stats.length > 0 ? 'min-h-screen' : 'min-h-[62vh] md:min-h-[68vh]'
      }`}
    >
      {/* ── Video / imagery backdrop ── */}
      {videoSrc && (
        <div className="absolute inset-0 z-0">
          <video
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink" />
        </div>
      )}

      {/* ── Main content centred in the upper portion ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-4xl mx-auto px-5 sm:px-8 text-center pt-24 pb-8">
        <div className="w-full">
          <span
            className="ph-fade inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-6"
            style={{ color: accent }}
          >
            <span className="w-8 h-px" style={{ background: `${accent}66` }} />
            {eyebrow}
            <span className="w-8 h-px" style={{ background: `${accent}66` }} />
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.02]">
            {React.Children.map(
              Array.isArray(title) ? title : [title],
              (child, i) => (
                <span key={i} className="block overflow-hidden">
                  <span className="ph-line block">{child}</span>
                </span>
              )
            )}
          </h1>

          {subtitle && (
            <p className="ph-fade mt-6 md:mt-8 text-white/55 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}

          {(cta || secondaryCta) && (
            <div className="ph-fade mt-10 flex items-center justify-center gap-4 flex-wrap">
              {cta && (
                <a
                  href={cta.href}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm text-black bg-white hover:text-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                  style={{ ['--acc' as string]: accent }}
                >
                  <span className="absolute" />
                  {cta.label}
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm text-white border border-white/25 bg-white/[0.04] backdrop-blur-md hover:border-white/60 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}

          {trustNote && (
            <p className="ph-fade mt-6 font-mono text-[10px] tracking-[0.2em] uppercase text-white/55">
              {trustNote}
            </p>
          )}
        </div>
      </div>

      {/* ── Integrated stats strip pinned to the hero bottom ── */}
      {stats && stats.length > 0 && (
        <div className="relative z-10 w-full border-t border-white/[0.07]">
          <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="ph-stat text-center"
                  style={i < stats.length - 1 ? { borderRight: '1px solid rgba(255,255,255,0.07)' } : {}}
                >
                  <div
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-none"
                    style={{ textShadow: `0 0 40px ${accent}44` }}
                  >
                    <NumberTicker value={s.value} className="font-bold text-white" />
                    <span style={{ color: accent }}>{s.suffix}</span>
                  </div>
                  <div className="mt-2 font-mono text-[10px] sm:text-[11px] tracking-widest text-white/45 uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Scroll hint (only visible when no stats strip) ── */}
      {(!stats || stats.length === 0) && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="animate-bounce" style={{ color: `${accent}99` }}>
            <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </section>
  )
}
