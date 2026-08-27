'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Check } from 'lucide-react'
import type { IndustryServiceCard } from '@/lib/industries'
import SmartVideo from '@/components/ui/SmartVideo'

gsap.registerPlugin(ScrollTrigger)

/*
  IndustryServices — the "what you can hire us for" bento. One featured
  card runs large with a looping video background; the rest are image
  cards. Every card is results-first (outcome stat up top), lists its
  deliverables, and carries an explicit booking CTA — this is a menu of
  services someone buys, not a sitemap.
*/
export default function IndustryServices({ services, accent }: { services: IndustryServiceCard[]; accent: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.svc-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.09, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.svc-grid', start: 'top 82%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  if (!services.length) return null
  const featured = services.find((s) => s.featured) ?? services[0]
  const rest = services.filter((s) => s !== featured)

  return (
    <section ref={ref} id="services" className="relative w-full overflow-hidden py-20 md:py-24 bg-ink-raised/40">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>
              <span className="w-8 h-px" style={{ background: `${accent}66` }} /> What We Make
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
              Five ways it shows up <span className="font-serif-accent italic text-white/60">— pick yours.</span>
            </h2>
          </div>
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-black transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            style={{ background: accent }}
          >
            Book a call <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="svc-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
          {/* Featured card — spans 2x2 with a looping video backdrop */}
          <a
            href="/contact"
            className="svc-card group relative md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-end min-h-[420px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            style={{ ['--acc' as string]: accent }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${accent}80`)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
          >
            {/* Image always paints first; the looping video layers over it
                once it can play, so the card never renders empty. */}
            <img
              src={featured.image}
              alt={featured.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            {(featured.video || featured.videoVimeoUrl) && (
              <SmartVideo
                src={featured.video}
                vimeo={featured.videoVimeoUrl}
                variant="background"
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1.5 rounded-full border backdrop-blur-md text-white" style={{ borderColor: `${accent}55`, backgroundColor: 'rgba(5,7,12,0.7)' }}>
                Most booked
              </span>
            </div>

            {/* pt-14 (not just p-6's own 24px) -- found 2026-08-26 mobile
                audit: with longer industry copy (this card's real content
                measured ~416px tall, nearly the full 420px card height on
                its own), this block started only ~3px below the card's
                top edge, directly under the "Most booked" badge above --
                confirmed via getBoundingClientRect on both elements (17px
                of real vertical overlap). The badge is absolutely
                positioned (top-4, ~27.5px tall) so it takes no space in
                this flex layout on its own; nothing stopped content from
                starting underneath it whenever a given industry's copy
                ran long enough. Reserving the badge's own clearance here
                fixes this for every industry's content length, not just
                this one -- md:pt-8 keeps the original spacing where the
                card is much larger/wider and this was never a risk. */}
            <div className="relative p-6 pt-14 md:p-8">
              <div data-cms-field={`serviceCards.${services.indexOf(featured)}.outcome`} className="font-mono text-sm md:text-base font-bold tracking-tight mb-2" style={{ color: accent }}>
                {featured.outcome}
              </div>
              <h3 data-cms-field={`serviceCards.${services.indexOf(featured)}.title`} className="text-2xl md:text-3xl font-bold text-white mb-2.5">{featured.title}</h3>
              <p data-cms-field={`serviceCards.${services.indexOf(featured)}.description`} className="text-sm text-white/60 leading-relaxed font-light max-w-md mb-5">{featured.description}</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                {featured.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-1.5 text-xs text-white/70">
                    <Check className="w-3.5 h-3.5" style={{ color: accent }} /> {d}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                  Book this <ArrowRight className="w-4 h-4" style={{ color: accent }} />
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase">{featured.meta}</span>
              </div>
            </div>
          </a>

          {rest.map((s) => (
            <a
              key={s.title}
              href="/contact"
              className="svc-card group relative rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-end min-h-[240px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${accent}80`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
            >
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-[1200ms] ease-out group-hover:scale-110 group-hover:opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />

              <div className="relative p-5">
                <div data-cms-field={`serviceCards.${services.indexOf(s)}.outcome`} className="font-mono text-xs font-bold tracking-tight mb-1.5" style={{ color: accent }}>
                  {s.outcome}
                </div>
                <h3 data-cms-field={`serviceCards.${services.indexOf(s)}.title`} className="text-lg font-bold text-white mb-1.5">{s.title}</h3>
                <p data-cms-field={`serviceCards.${services.indexOf(s)}.description`} className="text-xs text-white/55 leading-relaxed font-light mb-3">{s.description}</p>

                {/* Always shown -- was a hover-triggered max-height expand
                    that grew/shrank the whole card on hover; removed per
                    request while keeping the deliverables list itself. */}
                <ul className="mb-3">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-1.5 text-[11px] text-white/65 py-0.5">
                      <Check className="w-3 h-3 shrink-0" style={{ color: accent }} /> {d}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:gap-2.5 transition-all">
                    Book this <ArrowRight className="w-3.5 h-3.5" style={{ color: accent }} />
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.12em] text-white/55 uppercase">{s.meta}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
