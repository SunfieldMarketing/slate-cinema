'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'

gsap.registerPlugin(ScrollTrigger)

/*
  One unified trust section — flagship partners (Meta, Alo, B&H) leading
  straight into the full collaborations marquee, instead of two separate
  stacked sections that read as disconnected. Meta uses its real brand
  mark (public/images/clients/meta-icon.svg, sourced from Simple Icons,
  CC0); Alo and B&H render as clean text wordmarks until real logo files
  are provided — swap in <img>/<Image> the moment those assets land.
*/
const flagship = ['Alo', 'B&H']

const clients = [
  { src: '/images/clients/dream-testimonials.webp', alt: 'Dream', width: 2000, height: 118 },
  { src: '/images/clients/healing-partners.webp', alt: 'Healing Partners', width: 1965, height: 104 },
  { src: '/images/clients/inhale-testimonails.webp', alt: 'Inhale', width: 1991, height: 104 },
  { src: '/images/clients/lucida-testimonials.webp', alt: 'Lucida', width: 1948, height: 132 },
  { src: '/images/clients/workplace-realty.webp', alt: 'Workplace Realty', width: 1953, height: 114 },
]

export default function TrustSection() {
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
    <section ref={sectionRef} className="relative w-full py-14 md:py-16 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <span className="font-mono text-[10px] tracking-[0.35em] text-white/40 uppercase">
          Join the leaders working with Slate Cinema
        </span>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 sm:gap-x-20">
          <span className="fc-mark inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-500">
            <img src="/images/clients/meta-icon.svg" alt="" className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: 'currentColor' }} />
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Meta</span>
          </span>
          {flagship.map((name) => (
            <span
              key={name}
              className="fc-mark text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white/70 hover:text-white transition-colors duration-500"
            >
              {name}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" fill="#00AEEF" stroke="#00AEEF" />
              ))}
            </div>
            <span className="font-mono text-[11px] text-white/50 tracking-wide">5.0/5 · 44 Google reviews</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">More collaborations &amp; partnerships</span>
        </div>
      </div>

      {/* Masked (not painted) edge fade — logos dissolve via alpha, so
          the persistent background never gets an opaque strip over it. */}
      <div className="mt-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee pauseOnHover className="[--duration:38s] [--gap:4rem]">
          {clients.map((c) => (
            <Image
              key={c.src}
              src={c.src}
              alt={c.alt}
              width={c.width}
              height={c.height}
              className="h-10 sm:h-14 w-auto shrink-0 grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
            />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
