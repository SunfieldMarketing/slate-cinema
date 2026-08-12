'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import posthog from 'posthog-js'
import type { FinalCta } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA({ data }: { data?: FinalCta | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrow = data?.eyebrow || '// Ready To Scale?'
  const headlineLine1 = data?.headlineLine1 || 'Your next era'
  const headlineLine2 = data?.headlineLine2 || 'starts here'
  const description =
    data?.description ||
    "Don't let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI."
  const buttonLabel = data?.buttonLabel || 'Get Started'
  const buttonHref = data?.buttonHref || '/contact'
  const trustNote = data?.trustNote || 'Replies within minutes'

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 1,
        },
      })

      // The card arrives from depth — the camera "settling" on the final shot
      tl.fromTo('.cta-card',
        { opacity: 0, scale: 0.85, y: 120, rotateX: 8 },
        { opacity: 1, scale: 1, y: 0, rotateX: 0, ease: 'power2.out', duration: 0.7 },
        0
      )

      // Headline lines slide up under a mask, staggered
      tl.fromTo('.cta-line',
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.12, ease: 'power3.out', duration: 0.5 },
        0.25
      )

      tl.fromTo('.cta-fade',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, ease: 'power2.out', duration: 0.4 },
        0.45
      )
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  // Magnetic CTA — same physical language as the footer buttons
  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(e.currentTarget, { x: x * 0.25, y: y * 0.25, duration: 0.3 })
  }
  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <section ref={sectionRef} className="relative w-full pt-16 pb-28 md:pt-20 md:pb-32 px-6 flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Background Grid Pattern (matches calendar vibe) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Geometric Glassmorphism Card */}
        <div className="cta-card relative w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl p-12 md:p-24 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
          <BorderBeam size={140} duration={10} colorFrom="#00AEEF" colorTo="#7FA88A" />

          {/* Subtle Ambient Light inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-[#00AEEF]/10 blur-[80px] pointer-events-none rounded-full" />

          <span className="cta-fade font-mono text-xs md:text-sm text-white/50 tracking-[0.4em] uppercase mb-8">
            {eyebrow}
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            <span className="block overflow-hidden"><span className="cta-line block">{headlineLine1}</span></span>
            <span className="block overflow-hidden">
              <span className="cta-line block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic font-serif-accent">
                {headlineLine2}
              </span>
            </span>
          </h2>

          <p className="cta-fade text-white/60 text-lg md:text-xl font-light mb-12 max-w-2xl">
            {description}
          </p>

          <div className="cta-fade flex items-center justify-center gap-4 flex-wrap">
            <a
              href={buttonHref}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              onClick={() => posthog.capture('book_call_clicked', { source: 'final_cta' })}
              className="group relative px-10 py-5 bg-[#00AEEF] text-black font-semibold rounded-full overflow-hidden transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 shadow-[0_0_40px_rgba(0,174,239,0.35)] hover:shadow-[0_0_56px_rgba(0,174,239,0.55)]"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center transition-colors">
                {buttonLabel}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="/portfolio"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="group relative px-10 py-5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              <div className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
              <span className="relative z-10 flex items-center text-white group-hover:text-black font-semibold transition-colors">
                View Full Portfolio
              </span>
            </a>
          </div>

          <p className="cta-fade mt-8 font-mono text-[10px] tracking-[0.22em] uppercase text-white/55">
            {trustNote}
          </p>
        </div>
      </div>
    </section>
  )
}
