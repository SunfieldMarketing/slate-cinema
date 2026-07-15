'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
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
      <div className="faq-fade relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8">
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
    </section>
  )
}
