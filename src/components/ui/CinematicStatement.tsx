'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SmartVideo from '@/components/ui/SmartVideo'

gsap.registerPlugin(ScrollTrigger)

/*
  CinematicStatement — a full-bleed video-backed manifesto moment. One big
  masked-reveal headline over a dimmed looping video, used to punctuate a
  page's story between content sections (an Apple-style "beat" in the flow).
*/
interface Props {
  eyebrow: string
  /** headline lines — the last line is rendered in the italic accent style */
  lines: string[]
  body: string
  videoSrc: string
  accent?: string
}

export default function CinematicStatement({ eyebrow, lines, body, videoSrc, accent = '#00AEEF' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cs-line', { yPercent: 115 }, {
        yPercent: 0, stagger: 0.1, duration: 0.9, ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      })
      gsap.fromTo('.cs-fade', { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      })
      // Slow parallax drift on the backing video for depth
      gsap.fromTo('.cs-media', { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-ink py-28">
      {/* Video backdrop, dimmed and graded dark so text stays crisp */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* videoSrc doubles as the Vimeo source too -- IndustryCinematicStatement.videoSrc
            is a plain string in src/lib/industries.ts, so a Vimeo URL/ID pasted directly
            into that same field works with zero interface change (extractVimeoId returns
            null for an ordinary local path like "/videos/hero.mp4" and this falls through
            to the file-based video exactly as before). */}
        <SmartVideo
          src={videoSrc}
          vimeo={videoSrc}
          variant="background"
          coverFit
          className="cs-media absolute inset-0 w-full h-full object-cover scale-110 opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink/90" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${accent}14 0%, transparent 70%)` }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        <span className="cs-fade inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-8" style={{ color: accent }}>
          <span className="w-8 h-px" style={{ background: `${accent}66` }} /> {eyebrow} <span className="w-8 h-px" style={{ background: `${accent}66` }} />
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.15]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className={`cs-line block ${i === lines.length - 1 ? 'italic font-serif-accent text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50' : ''}`}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        <p className="cs-fade mt-8 text-white/55 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          {body}
        </p>
      </div>
    </section>
  )
}
