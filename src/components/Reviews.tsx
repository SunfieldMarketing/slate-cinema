'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star, Quote } from 'lucide-react'
import { MagicCard } from '@/components/ui/magic-card'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  rating: number
  featured?: boolean
}

const testimonials: Testimonial[] = [
  {
    quote: "Slate Cinema didn't just make us a video — they built us a content engine. Our launch reel hit 4.2M views in a week and conversions jumped 34%.",
    name: 'Priya Sharma',
    role: 'VP Marketing',
    company: 'HyperDrive Motors',
    rating: 5,
    featured: true,
  },
  {
    quote: 'The most intuitive creative partner we\'ve worked with. From brief to final cut in days, not weeks.',
    name: 'Marcus Johnson',
    role: 'Head of Ops',
    company: 'Synergy Corp',
    rating: 5,
  },
  {
    quote: 'It feels like a true partnership. They\'re invested in our numbers, not just the footage.',
    name: 'Isabella Rossi',
    role: 'Client Success',
    company: 'Horizon',
    rating: 5,
  },
  {
    quote: 'Every frame is intentional. The color grade alone lifted our brand perception overnight.',
    name: 'Kenji Tanaka',
    role: 'Brand Director',
    company: 'CodeCrafters',
    rating: 5,
  },
  {
    quote: 'The ROI was almost immediate — we cut project delivery times by nearly 30% and doubled our social output.',
    name: 'Fatima Al-Jamil',
    role: 'CFO',
    company: 'Apex Financial',
    rating: 5,
    featured: true,
  },
  {
    quote: 'Cinematic quality with a social-first brain. Rare combination, huge results.',
    name: 'David Chen',
    role: 'Founder',
    company: 'Apex Athletics',
    rating: 5,
  },
]

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5" fill={i < n ? '#00AEEF' : 'transparent'} stroke={i < n ? '#00AEEF' : 'rgba(255,255,255,0.25)'} strokeWidth={1.5} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // fromTo (not from) so a mis-fired trigger can never leave content
      // permanently invisible; once:true keeps it a one-shot reveal.
      gsap.fromTo('.rv-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      // Iris-in reveal — cards settle from a slight zoom rather than sliding
      // up, so this grid doesn't read as the same entrance as every other one.
      gsap.fromTo('.rv-card', { scale: 0.9, opacity: 0 }, {
        scale: 1, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.rv-grid', start: 'top 90%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center py-24 md:py-28">

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="rv-head text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-5">
            <span className="w-8 h-px bg-[#00AEEF]/40" /> Client Feedback <span className="w-8 h-px bg-[#00AEEF]/40" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
            Trusted by leaders
            <br className="hidden sm:block" /> across industries
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 text-white/50 text-sm">
            <StarRow n={5} />
            <span className="font-mono">4.9/5 average · 120+ campaigns delivered</span>
          </div>
        </div>

        {/* Masonry-style card grid */}
        <div className="rv-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <MagicCard
              key={i}
              className={`rv-card rounded-2xl transition-transform duration-500 hover:-translate-y-1 ${
                t.featured ? 'lg:row-span-1 md:col-span-1' : ''
              }`}
              gradientFrom="#00AEEF"
              gradientTo="#0369A1"
              gradientColor="#00AEEF"
              gradientOpacity={0.15}
              gradientSize={220}
            >
              <article className="relative z-10 flex flex-col h-full p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-7 h-7 text-[#00AEEF]/40" fill="currentColor" />
                  <StarRow n={t.rating} />
                </div>

                <p className={`text-white/80 font-light leading-relaxed mb-6 flex-1 ${t.featured ? 'text-lg sm:text-xl' : 'text-[15px]'}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-11 h-11 rounded-full border border-white/15 bg-[#00AEEF]/10 flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs font-bold text-[#00AEEF]">{initials(t.name)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{t.name}</div>
                    <div className="text-white/40 text-xs truncate">{t.role} · {t.company}</div>
                  </div>
                </div>
              </article>
            </MagicCard>
          ))}
        </div>

        {/* Logo strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-40">
          {['HyperDrive', 'Synergy', 'Horizon', 'Apex', 'CodeCrafters', 'Lumiere'].map((brand) => (
            <span key={brand} className="font-mono text-sm tracking-widest text-white/60 uppercase">{brand}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
