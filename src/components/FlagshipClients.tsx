'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/*
  Flagship clients — Meta, Alo, B&H get their own standalone moment right
  under the hero, ahead of the broader TrustBanner marquee below it. Logo
  files aren't wired in yet (placeholder wordmarks), swap the `marks` array
  for real logo <Image>s the moment the assets land.
*/
const marks = ['Meta', 'Alo', 'B&H']

export default function FlagshipClients() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fc-mark', { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full py-12 md:py-16 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <span className="font-mono text-[10px] tracking-[0.35em] text-white/40 uppercase">
          Join the leaders working with Slate Cinema
        </span>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 sm:gap-x-20">
          {marks.map((name) => (
            <span
              key={name}
              className="fc-mark text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white/70 hover:text-white transition-colors duration-500"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
