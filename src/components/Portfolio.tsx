'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Play, ArrowUpRight } from 'lucide-react'
import type { PortfolioProjectLocal } from '@/lib/normalize'

gsap.registerPlugin(ScrollTrigger)

const defaultFilters = ['All', 'Commercial', 'Social', 'Documentary', 'Event', 'Action']

/*
  Explicit bento placement for the full, unfiltered 8-project set — hand
  tiled (not auto-packed) so the mixed wide/tall/normal cards fill every
  cell of a 4-col x 3-row grid exactly, with zero leftover gaps. Only
  applies to that exact 8-item "All" view; a filtered subset falls back
  to plain uniform cards, which can never gap regardless of count.
*/
const bentoPlacement = [
  'lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-1', // wide
  'lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2', // tall
  'lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-1',
  'lg:col-start-1 lg:col-span-1 lg:row-start-2 lg:row-span-1',
  'lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:row-span-2', // tall
  'lg:col-start-4 lg:col-span-1 lg:row-start-2 lg:row-span-1',
  'lg:col-start-3 lg:col-span-2 lg:row-start-3 lg:row-span-1', // wide
  'lg:col-start-1 lg:col-span-1 lg:row-start-3 lg:row-span-1',
]

export default function Portfolio({
  projects,
  limit,
  showFilters = true,
  filters,
}: {
  projects: PortfolioProjectLocal[]
  limit?: number
  showFilters?: boolean
  filters?: string[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState('All')
  const filterOptions = filters && filters.length ? filters : defaultFilters

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pf-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      // Wipe reveal — a curtain opens left-to-right per card, like a film
      // gate clearing, instead of another slide-up.
      gsap.fromTo('.pf-card', { clipPath: 'inset(0 100% 0 0)', opacity: 0 }, {
        clipPath: 'inset(0 0% 0 0)', opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: '.pf-grid', start: 'top 90%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const visible = limit ? filtered.slice(0, limit) : filtered
  const useBento = filter === 'All' && !limit && visible.length === bentoPlacement.length

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden py-24 md:py-28">

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="pf-head flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-4">
              <span className="w-8 h-px bg-[#00AEEF]/40" /> Our Work
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
              {showFilters ? 'A Gallery of Impact' : 'Selected Work'}
            </h2>
          </div>
          {/* Filter chips */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all duration-300 border ${
                    filter === f
                      ? 'bg-[#00AEEF] text-black border-[#00AEEF]'
                      : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cinematic bento grid — hand-tiled for the full set so it fills
            every cell with no gaps; falls back to plain squares when
            filtered down to a smaller, variable count. */}
        <div className="pf-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] sm:auto-rows-[260px] gap-4">
          {visible.map((p, i) => (
            <article
              key={p.title}
              className={`pf-card group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#00AEEF]/50 ${useBento ? bentoPlacement[i] : ''}`}
            >
              {/* Image */}
              <img
                src={p.url}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              {/* Grade + gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-0 mix-blend-overlay bg-[#00AEEF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80">
                  {p.category}
                </span>
              </div>

              {/* Play button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                </div>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">{p.title}</h3>
                    <p className="text-white/50 text-xs font-mono truncate">{p.company}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-[#00AEEF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
                {/* Metrics reveal */}
                <div className="flex gap-4 mt-3 max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="text-[#00AEEF] font-bold text-sm">{m.value}</div>
                      <div className="text-white/40 text-[10px] font-mono uppercase tracking-wide">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <a
            href="/portfolio"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <span className="relative text-sm font-semibold tracking-widest text-white group-hover:text-black transition-colors uppercase">
              View Full Portfolio
            </span>
            <ArrowUpRight className="relative w-4 h-4 text-white group-hover:text-black transition-colors" />
          </a>
        </div>
      </div>
    </section>
  )
}
