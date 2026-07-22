'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import posthog from 'posthog-js'

gsap.registerPlugin(ScrollTrigger)

/*
  Slim mid-page conversion band — re-offers the booking action while the
  case studies are still fresh, without the weight of a full CTA section.
*/
export default function MidCtaBand({ accent, label }: { accent: string; label?: string }) {
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
            <div className="text-lg sm:text-xl font-bold text-white leading-snug">
              {label ?? 'Have a project like this in mind?'}
            </div>
            <div className="text-sm text-white/55 font-light mt-1">
              20 minutes, no pitch deck — just an honest read on scope, timeline and budget.
            </div>
          </div>
          <a
            href="/contact"
            onClick={() => posthog.capture('book_call_clicked', { source: 'mid_cta_band', label: label ?? 'Have a project like this in mind?' })}
            className="relative group inline-flex items-center gap-2.5 shrink-0 px-7 py-3.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            style={{ background: accent, boxShadow: `0 0 32px ${accent}55` }}
          >
            Book a call <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
