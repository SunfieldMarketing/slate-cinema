'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/*
  Short positioning statement — what Slate Cinema is and why it's different,
  in one breath, before Pipeline goes deep on how the work actually happens.
*/
export default function Positioning() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pos-fade', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full py-20 md:py-28 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <span className="pos-fade inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-6">
          <span className="w-8 h-px bg-[#00AEEF]/40" /> Who We Are <span className="w-8 h-px bg-[#00AEEF]/40" />
        </span>
        <h2 className="pos-fade text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-6">
          We don&apos;t just make videos.
          <br />
          <span className="font-serif-accent italic font-normal text-white/60">We make people watch.</span>
        </h2>
        <p className="pos-fade text-white/55 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Slate Cinema is a full-service production and marketing studio — strategy, filming, editing, and
          distribution under one roof. We build content that holds attention, gets shared, and moves the
          numbers that matter, generating millions of views for the brands we work with.
        </p>
      </div>
    </section>
  )
}
