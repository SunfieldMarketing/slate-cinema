'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import posthog from 'posthog-js'
import type { IndustryCta } from '@/lib/normalize'

gsap.registerPlugin(ScrollTrigger)

/*
  Slim mid-page conversion band — re-offers the booking action while the
  case studies are still fresh, without the weight of a full CTA section.
  Copy comes from the industry doc's "Mid-page call to action" fields
  (2026-10-01); the band hides when both its headline and button are blank.
*/
export default function MidCtaBand({ accent, cta }: { accent: string; cta: IndustryCta }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mcb-in',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  if (!cta.headline && !cta.buttonLabel) return null

  return (
    <section ref={ref} className="relative w-full py-6">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div
          className="mcb-in relative overflow-hidden rounded-2xl border px-6 sm:px-10 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ borderColor: `${accent}40`, background: `linear-gradient(100deg, ${accent}1f 0%, rgba(5,7,12,0.6) 55%, ${accent}14 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 40% 130% at 8% 50%, ${accent}44, transparent 65%)` }}
          />
          <div className="relative text-center sm:text-left">
            {cta.headline && (
              <div data-cms-field="ctaHeadline" className="text-lg sm:text-xl font-bold text-white leading-snug">
                {cta.headline}
              </div>
            )}
            {cta.subhead && (
              <div data-cms-field="ctaSubhead" className="text-sm text-white/55 font-light mt-1">
                {cta.subhead}
              </div>
            )}
          </div>
          {cta.buttonLabel && (
            <a
              href={cta.buttonHref}
              data-cms-field="ctaButtonLabel"
              onClick={() => posthog.capture('get_started_clicked', { source: 'mid_cta_band', label: cta.headline })}
              className="relative group inline-flex items-center gap-2.5 shrink-0 px-7 py-3.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              style={{ background: accent, boxShadow: `0 0 32px ${accent}55` }}
            >
              {cta.buttonLabel} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
