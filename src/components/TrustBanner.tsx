'use client'

import { Star } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'
import { useSiteData } from '@/lib/site-data-context'
import { mediaUrl } from '@/lib/media-url'

/*
  TrustBanner — a slim, continuously-flowing credibility strip right under
  the Hero on every industry page. No section background of its own (the
  persistent 3D scene reads straight through it); the marquee's motion is
  the connective tissue that carries the eye from the Hero into the rest
  of the page.

  Was fully hardcoded (rating text, tagline, all 5 client logos on local
  /public files, no CMS wiring at all) until SiteSettings.trustBanner was
  added -- see that global for the field shape. Mirrors TrustSection.tsx's
  (Home page) fallback-array pattern: these exact 5 local files stay as
  the safe default whenever the CMS field is empty, so nothing ever
  regresses to a blank strip.
*/
const fallbackClients = [
  { src: '/images/clients/dream-testimonials.webp', alt: 'Dream', width: 2000, height: 118 },
  { src: '/images/clients/healing-partners.webp', alt: 'Healing Partners', width: 1965, height: 104 },
  { src: '/images/clients/inhale-testimonails.webp', alt: 'Inhale', width: 1991, height: 104 },
  { src: '/images/clients/lucida-testimonials.webp', alt: 'Lucida', width: 1948, height: 132 },
  { src: '/images/clients/workplace-realty.webp', alt: 'Workplace Realty', width: 1953, height: 114 },
]

export default function TrustBanner() {
  const { settings } = useSiteData()
  const data = settings?.trustBanner
  const ratingText = data?.ratingText || '5.0/5 · 44 Google reviews'
  const marqueeLabel = data?.marqueeLabel || 'More collaborations & partnerships'
  const clients = data?.clients?.length
    ? data.clients.map((c) => ({ src: mediaUrl(c.logo) || '', alt: c.name, width: 2000, height: 118 }))
    : fallbackClients

  return (
    <section className="relative w-full py-8 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-5">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5" fill="#00AEEF" stroke="#00AEEF" />
            ))}
          </div>
          <span className="font-mono text-[11px] text-white/50 tracking-wide">{ratingText}</span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-white/15" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">{marqueeLabel}</span>
      </div>

      {/* Masked (not painted) edge fade — logos dissolve via alpha, so
          the persistent background never gets an opaque strip over it. */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee pauseOnHover className="[--duration:38s] [--gap:4rem]">
          {clients.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- plain
            // <img>, matching every other image on the site -- see
            // TrustSection.tsx for why (next/image's /_next/image
            // optimizer route was missing its handler file in the
            // deployed Vercel function, 2026-08-20).
            <img
              key={`${c.src}-${i}`}
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
