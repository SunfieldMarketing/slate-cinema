'use client'

import React, { useRef, useEffect } from 'react'
import { preload } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/*
  Shared cinematic hero for interior pages. A tall video/gradient banner with a
  film-slate eyebrow, big masked headline, subcopy, and optional CTA — matching
  the home Hero's language so every route feels like one film.
*/
interface Props {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  videoSrc?: string
  accent?: string
  cta?: { label: string; href: string }
}

export default function PageHero({ eyebrow, title, subtitle, videoSrc, accent = '#00AEEF', cta }: Props) {
  const ref = useRef<HTMLElement>(null)

  // Preload the video immediately with high priority so it's ready instantly
  if (videoSrc) {
    preload(videoSrc, { as: 'video', fetchPriority: 'high' })
  }

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-line', { yPercent: 120 }, { yPercent: 0, stagger: 0.1, duration: 0.9, ease: 'power4.out', delay: 0.1 })
      gsap.fromTo('.ph-fade', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.4 })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Video / imagery backdrop */}
      {videoSrc && (
        <div className="absolute inset-0 z-0">
          {/* @ts-expect-error fetchPriority not in React 18 types */}
          <video src={videoSrc} autoPlay loop muted playsInline preload="auto" fetchPriority="high" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <span className="ph-fade inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-6" style={{ color: accent }}>
          <span className="w-8 h-px" style={{ background: `${accent}66` }} /> {eyebrow} <span className="w-8 h-px" style={{ background: `${accent}66` }} />
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

        {cta && (
          <div className="ph-fade mt-10">
            <a
              href={cta.href}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm text-black bg-white hover:text-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              style={{ ['--acc' as string]: accent }}
            >
              <span className="absolute" />
              {cta.label}
            </a>
          </div>
        )}
      </div>

      {/* bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="animate-bounce" style={{ color: `${accent}99` }}>
          <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
