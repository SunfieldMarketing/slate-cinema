'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, CalendarCheck } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import type { IndustryFaq as IndustryFaqItem } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

export default function IndustryFaq({ faqs, accent }: { faqs: IndustryFaqItem[]; accent: string }) {
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

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 items-start">
        <div className="faq-fade">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: accent }}>
            <span className="w-8 h-px" style={{ background: `${accent}66` }} /> Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] mb-10">
            Before you ask <span className="font-serif-accent italic text-white/60">— answered.</span>
          </h2>

          <Accordion className="border-t border-white/10">
            {faqs.map((f, i) => (
              <AccordionItem key={f.question} value={String(i)} className="border-white/10 py-1.5">
                <AccordionTrigger className="text-base sm:text-lg font-medium text-white py-5 hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="text-sm text-white/55 leading-relaxed font-light max-w-xl">{f.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Objection-handling exit ramp: if the FAQ didn't close it, a human will. */}
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
            <h3 className="text-xl font-bold text-white mb-2">Still deciding?</h3>
            <p className="text-sm text-white/55 font-light leading-relaxed mb-6">
              Bring your questions to a 20-minute call. No pitch, no pressure — just a straight answer on whether this is a fit.
            </p>
            <a
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              style={{ background: accent }}
            >
              Book a call <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-4 text-center font-mono text-[9px] tracking-[0.18em] uppercase text-white/55">
              Replies within minutes
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
