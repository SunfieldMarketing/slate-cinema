'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, CalendarCheck } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import type { IndustryFaqItem, IndustrySectionHeading } from '@/lib/normalize'
import type { SectionCmsPaths } from '@/lib/cms-paths'

gsap.registerPlugin(ScrollTrigger)

export interface FaqAside {
  title: string
  body: string
  buttonLabel: string
  buttonHref: string
  note: string
}

const DEFAULT_HEADING: IndustrySectionHeading = {
  eyebrow: 'Common Questions',
  headline: 'Before you ask',
  accent: '— answered.',
}

const DEFAULT_ASIDE: FaqAside = {
  title: 'Still deciding?',
  body: 'Bring your questions to a 20-minute call. No pitch, no pressure — just a straight answer on whether this is a fit.',
  buttonLabel: 'Book a call',
  buttonHref: '/contact',
  note: 'Replies within minutes',
}

/*
  FAQ accordion with a "still deciding?" side card. Heading, side card and
  click-to-edit paths are props (2026-10-01) so the page builder's FAQ
  block can supply its own copy; an empty aside title hides the card.
*/
export default function IndustryFaq({
  faqs,
  accent,
  heading = DEFAULT_HEADING,
  aside = DEFAULT_ASIDE,
  paths,
  asidePath,
}: {
  faqs: IndustryFaqItem[]
  accent: string
  heading?: IndustrySectionHeading
  aside?: FaqAside
  paths?: SectionCmsPaths
  /** Click-to-edit path of the side card's group, e.g. "layout.4.aside". */
  asidePath?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-fade',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  if (!faqs.length) return null
  const field = (name: string) => (asidePath ? `${asidePath}.${name}` : undefined)

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div
        className={`relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 grid gap-12 lg:gap-16 items-start ${aside.title ? 'lg:grid-cols-[1fr_320px]' : ''}`}
      >
        <div className="faq-fade">
          {heading.eyebrow && (
            <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: accent }}>
              <span className="w-8 h-px" style={{ background: `${accent}66` }} /> <span data-cms-field={paths?.eyebrow}>{heading.eyebrow}</span>
            </span>
          )}
          {(heading.headline || heading.accent) && (
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] ${heading.intro ? 'mb-5' : 'mb-10'}`}>
              <span data-cms-field={paths?.headline}>{heading.headline}</span>
              {heading.accent && (
                <>
                  {' '}
                  <span data-cms-field={paths?.accent} className="font-serif-accent italic text-white/60">{heading.accent}</span>
                </>
              )}
            </h2>
          )}
          {heading.intro && (
            <p data-cms-field={paths?.intro} className="mb-10 max-w-2xl text-white/55 text-base sm:text-lg font-light leading-relaxed whitespace-pre-line">
              {heading.intro}
            </p>
          )}

          <Accordion className="border-t border-white/10">
            {faqs.map((f, i) => (
              <AccordionItem key={`${i}-${f.question}`} value={String(i)} className="border-white/10 py-1.5">
                <AccordionTrigger className="text-base sm:text-lg font-medium text-white py-5 hover:no-underline">
                  <span data-cms-field={paths ? `${paths.items}.${i}.question` : undefined}>{f.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p data-cms-field={paths ? `${paths.items}.${i}.answer` : undefined} className="text-sm text-white/55 leading-relaxed font-light max-w-xl">
                    {f.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Objection-handling exit ramp: if the FAQ didn't close it, a human will. */}
        {aside.title && (
          <aside className="faq-fade lg:sticky lg:top-28">
            <div
              className="rounded-2xl border p-7 relative overflow-hidden"
              style={{ borderColor: `${accent}40`, background: `linear-gradient(160deg, ${accent}14, rgba(5,7,12,0.6))` }}
            >
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center mb-5"
                style={{ borderColor: `${accent}50`, background: `${accent}1a` }}
              >
                <CalendarCheck className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 data-cms-field={field('title')} className="text-xl font-bold text-white mb-2">{aside.title}</h3>
              {aside.body && (
                <p data-cms-field={field('body')} className="text-sm text-white/55 font-light leading-relaxed mb-6">
                  {aside.body}
                </p>
              )}
              {aside.buttonLabel && (
                <a
                  href={aside.buttonHref || '/contact'}
                  data-cms-field={field('buttonLabel')}
                  className="group inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                  style={{ background: accent }}
                >
                  {aside.buttonLabel} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              {aside.note && (
                <p data-cms-field={field('note')} className="mt-4 text-center font-mono text-[9px] tracking-[0.18em] uppercase text-white/55">
                  {aside.note}
                </p>
              )}
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}
