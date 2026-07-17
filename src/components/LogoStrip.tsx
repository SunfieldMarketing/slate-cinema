'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const CLIENT_LOGOS = [
  { src: '/images/clients/dream-testimonials.webp', alt: 'Dream' },
  { src: '/images/clients/healing-partners.webp', alt: 'Healing Partners' },
  { src: '/images/clients/inhale-testimonails.webp', alt: 'Inhale' },
  { src: '/images/clients/lucida-testimonials.webp', alt: 'Lucida' },
  { src: '/images/clients/workplace-realty.webp', alt: 'Workplace Realty' },
]

/* Slim trust strip — real client logos, muted until hover. */
export default function LogoStrip() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ls-item',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full py-12 border-y border-white/5">
      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 flex flex-col items-center gap-7">
        <span className="ls-item font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">
          Trusted by teams at
        </span>
        <div className="flex flex-col items-center gap-4 w-full">
          {CLIENT_LOGOS.map((l) => (
            <img
              key={l.alt}
              src={l.src}
              alt={l.alt}
              loading="lazy"
              className="ls-item h-6 sm:h-7 w-auto max-w-full object-contain opacity-45 hover:opacity-80 transition-opacity duration-500"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
