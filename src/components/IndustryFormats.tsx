'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { IndustryFormat } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

export default function IndustryFormats({ formats, accent }: { formats: IndustryFormat[]; accent: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fmt-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.fmt-grid', start: 'top 85%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  if (!formats.length) return null

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24 bg-ink-raised/40">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>
              <span className="w-8 h-px" style={{ background: `${accent}66` }} /> Formats
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">Five ways it shows up</h2>
          </div>
          <a href="#contact" className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: accent }}>
            Start a project →
          </a>
        </div>

        <div className="fmt-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {formats.map((f, i) => (
            <a
              key={f.title}
              href="/contact"
              className="fmt-card group bg-ink p-6 transition-colors hover:bg-white/[0.03]"
            >
              <div className="font-mono text-[10px] tracking-[0.2em] mb-9" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-white/55 leading-relaxed mb-4 font-light">{f.description}</p>
              <div className="font-mono text-[9px] tracking-[0.14em] text-white/35 uppercase">{f.meta}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
