'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import type { ReadyToTalk } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

/*
  Slim CTA band for visitors who land on the calendar but already know
  exactly what they want — routes them to the project intake page
  instead of booking a call, same compact language as NextStepBand on
  How It Works. Uses the site's primary brand blue rather than a
  stage-specific color, since this band renders on two pages with
  different neighboring section colors (Get Started, Schedule a Call)
  and needs to read as a default UI element on both rather than clash.

  Copy: Shared Sections > Ready To Talk > Intake form band (2026-10-02);
  the fallbacks are the original wording, for a database that predates it.
*/
export default function IntakeCTABand({ copy }: { copy?: ReadyToTalk['intakeBand'] | null }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.icb-in', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  const accent = '#00AEEF'
  const eyebrow = copy?.eyebrow ?? '// Already Know?'
  const headline = copy?.headline ?? 'Already know exactly what you want?'
  const body = copy?.body ?? "Skip the call — walk us through the project details directly and we'll follow up with a plan."
  const buttonLabel = copy?.buttonLabel || 'Start the Intake Form'
  const buttonHref = copy?.buttonHref || '/contact/project'

  return (
    <section ref={ref} data-cms-global="ready-to-talk" className="relative w-full overflow-hidden py-12 md:py-14">
      <div className="icb-in relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border bg-white/[0.05] backdrop-blur-md p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8"
          style={{ borderColor: `${accent}33` }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ backgroundImage: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
          />
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 45% 140% at 8% 50%, ${accent}44, transparent 65%)` }}
          />
          <div className="relative text-center sm:text-left">
            {eyebrow && (
              <span data-cms-field="intakeBand.eyebrow" className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase block mb-3" style={{ color: accent }}>
                {eyebrow}
              </span>
            )}
            <div data-cms-field="intakeBand.headline" className="text-xl sm:text-2xl font-bold text-white leading-snug">{headline}</div>
            {body && (
              <p data-cms-field="intakeBand.body" className="mt-2 text-white/55 font-light text-sm sm:text-base max-w-md">
                {body}
              </p>
            )}
          </div>
          <a
            href={buttonHref}
            data-cms-field="intakeBand.buttonLabel"
            className="relative group inline-flex items-center justify-center gap-2.5 shrink-0 px-8 py-4 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            style={{ background: accent, boxShadow: `0 0 32px ${accent}55` }}
          >
            {buttonLabel} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
