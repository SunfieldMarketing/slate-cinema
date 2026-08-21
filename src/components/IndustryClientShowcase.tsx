'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'
import type { IndustryClient } from '@/lib/industries'
import SmartVideo from '@/components/ui/SmartVideo'

gsap.registerPlugin(ScrollTrigger)

/*
  Generalized 2026-08-13 from AthleticsClientShowcase.tsx (Athletics was
  the first industry page to get this treatment; Kauan then asked for
  "the new athletics industry format for all the industry pages") --
  same component, now data-driven per industry instead of hardcoded to
  Athletics' 4 clients.
*/
export default function IndustryClientShowcase({
  clients,
  accent,
  eyebrow = 'Who We Shoot For',
}: {
  clients: IndustryClient[]
  accent: string
  eyebrow?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.acs-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: '.acs-grid', start: 'top 82%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  if (!clients.length) return null

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase block mb-4" style={{ color: accent }}>{eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            Real clients. Real work. <span className="font-serif-accent italic text-white/60">Real footage.</span>
          </h2>
        </div>

        <div className="acs-grid grid grid-cols-1 sm:grid-cols-2 gap-5">
          {clients.map((c) => (
            <MagicCard
              key={c.name}
              className="acs-card rounded-2xl overflow-hidden relative"
              gradientColor={`${accent}22`}
              gradientFrom={accent}
              gradientTo={accent}
            >
              <div className="relative aspect-video">
                <BorderBeam size={100} duration={6} colorFrom={accent} colorTo={accent} />
                {/* c.video doubles as the Vimeo source too -- see the matching
                    comment in CinematicStatement.tsx for why that's safe. */}
                <SmartVideo src={c.video} vimeo={c.video} variant="background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-white font-bold text-lg">{c.name}</h3>
                  {c.year && <span className="font-mono text-[10px] text-white/40 uppercase tracking-wide shrink-0">{c.year}</span>}
                </div>
                <p className="text-white/55 text-sm font-light leading-relaxed">{c.body}</p>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}
