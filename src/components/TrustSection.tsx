'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'
import type { HomePage } from '@/payload-types'
import { mediaUrl } from '@/lib/media-url'

gsap.registerPlugin(ScrollTrigger)

/*
  One unified trust section — flagship partners (Meta, Alo, B&H) leading
  straight into the full collaborations marquee, instead of two separate
  stacked sections that read as disconnected. Real logo files for all
  three (client-provided) — forced to a white silhouette via filter since
  Alo's and Meta's wordmarks are print-dark and would be nearly invisible
  on the page's near-black background otherwise; this also keeps them
  visually consistent with the white/light client marks in the marquee
  below rather than clashing brand colors against each other.
*/
const fallbackFlagship = [
  { name: 'Meta', src: '/images/clients/meta-logo.webp' },
  { name: 'Alo', src: '/images/clients/alo-logo.webp' },
  { name: 'B&H', src: '/images/clients/bh-logo.webp' },
]

const fallbackClients = [
  { src: '/images/clients/dream-testimonials.webp', alt: 'Dream', width: 2000, height: 118 },
  { src: '/images/clients/healing-partners.webp', alt: 'Healing Partners', width: 1965, height: 104 },
  { src: '/images/clients/inhale-testimonails.webp', alt: 'Inhale', width: 1991, height: 104 },
  { src: '/images/clients/lucida-testimonials.webp', alt: 'Lucida', width: 1948, height: 132 },
  { src: '/images/clients/workplace-realty.webp', alt: 'Workplace Realty', width: 1953, height: 114 },
]

export default function TrustSection({ data }: { data?: HomePage['trustSection'] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrow = data?.eyebrow || 'Join the leaders who worked with Slate Cinema'
  const ratingText = data?.ratingText || '5.0/5 · 44 Google reviews'
  const marqueeLabel = data?.marqueeLabel || 'More collaborations & partnerships'
  const flagship = data?.flagshipLogos?.length
    ? data.flagshipLogos.map((f) => ({ name: f.name, src: mediaUrl(f.logo) || '' }))
    : fallbackFlagship
  const clients = data?.marqueeClients?.length
    ? data.marqueeClients.map((c) => ({ src: mediaUrl(c.logo) || '', alt: c.name, width: 2000, height: 118 }))
    : fallbackClients

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
    <section ref={sectionRef} className="relative w-full py-16 md:py-20 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <span data-cms-field="trustSection.eyebrow" className="font-mono text-sm sm:text-base tracking-[0.2em] text-white/50 uppercase">
          {eyebrow}
        </span>

        {/* Mobile: the first logo (Meta) gets its own full-width row so it
            can't share a line with whichever of the rest happens to fit --
            natural flex-wrap put Meta+Alo on row 1 and B&H alone on row 2,
            not the Meta-alone/Alo+B&H split requested. sm:contents drops
            the wrapper from layout entirely at the sm breakpoint, so
            desktop's existing single-row appearance (all three together)
            is completely unchanged. */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-24">
          {flagship.map((f, i) =>
            i === 0 ? (
              <span key={f.name} className="w-full flex justify-center sm:contents">
                <img
                  src={f.src}
                  alt={f.name}
                  className="fc-mark h-16 sm:h-20 w-auto opacity-70 hover:opacity-100 transition-opacity duration-500 [filter:brightness(0)_invert(1)]"
                />
              </span>
            ) : (
              <img
                key={f.name}
                src={f.src}
                alt={f.name}
                className="fc-mark h-16 sm:h-20 w-auto opacity-70 hover:opacity-100 transition-opacity duration-500 [filter:brightness(0)_invert(1)]"
              />
            )
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" fill="#00AEEF" stroke="#00AEEF" />
              ))}
            </div>
            <span data-cms-field="trustSection.ratingText" className="font-mono text-[11px] text-white/50 tracking-wide">{ratingText}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <span data-cms-field="trustSection.marqueeLabel" className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">{marqueeLabel}</span>
        </div>
      </div>

      {/* Masked (not painted) edge fade — logos dissolve via alpha, so
          the persistent background never gets an opaque strip over it. */}
      <div className="mt-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee pauseOnHover className="[--duration:38s] [--gap:4rem]">
          {clients.map((c) => (
            // eslint-disable-next-line @next/next/no-img-element -- plain
            // <img>, matching every other image on the site (see
            // TrustBanner.tsx for the matching fix + why: next/image's
            // /_next/image optimizer route was missing its handler file
            // in the deployed Vercel function, 2026-08-20).
            <img
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
