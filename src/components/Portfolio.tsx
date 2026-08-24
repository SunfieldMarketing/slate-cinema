'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Play, ArrowUpRight } from 'lucide-react'
import type { PortfolioProjectLocal } from '@/lib/normalize'
import { PLACEHOLDER_IMAGE } from '@/lib/media-url'
import ProjectCardModal from '@/components/ProjectCardModal'

gsap.registerPlugin(ScrollTrigger)

/*
  Explicit bento placement, hand-tiled per 8-project block (4-col x 3-row,
  zero leftover gaps) — this is the original "All" view mosaic. The project
  list has grown past 8 since that design, so this now CYCLES: every
  complete group of 8 gets the same mixed wide/tall/normal tiling, each
  group's row-starts shifted down by 3 to stack under the previous group.
  Any trailing partial group (list length not a multiple of 8) falls back
  to plain uniform cards, which can never gap regardless of count.

  Tailwind class names must appear as literal source text for the compiler
  to pick them up -- they can't be assembled from runtime numbers -- so
  each group below is spelled out in full rather than computed.
*/
const bentoGroups = [
  [ // rows 1-3
    'lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-1', // wide
    'lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2', // tall
    'lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-2 lg:row-span-1',
    'lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:row-span-2', // tall
    'lg:col-start-4 lg:col-span-1 lg:row-start-2 lg:row-span-1',
    'lg:col-start-3 lg:col-span-2 lg:row-start-3 lg:row-span-1', // wide
    'lg:col-start-1 lg:col-span-1 lg:row-start-3 lg:row-span-1',
  ],
  [ // rows 4-6
    'lg:col-start-1 lg:col-span-2 lg:row-start-4 lg:row-span-1',
    'lg:col-start-3 lg:col-span-1 lg:row-start-4 lg:row-span-2',
    'lg:col-start-4 lg:col-span-1 lg:row-start-4 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-5 lg:row-span-1',
    'lg:col-start-2 lg:col-span-1 lg:row-start-5 lg:row-span-2',
    'lg:col-start-4 lg:col-span-1 lg:row-start-5 lg:row-span-1',
    'lg:col-start-3 lg:col-span-2 lg:row-start-6 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-6 lg:row-span-1',
  ],
  [ // rows 7-9
    'lg:col-start-1 lg:col-span-2 lg:row-start-7 lg:row-span-1',
    'lg:col-start-3 lg:col-span-1 lg:row-start-7 lg:row-span-2',
    'lg:col-start-4 lg:col-span-1 lg:row-start-7 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-8 lg:row-span-1',
    'lg:col-start-2 lg:col-span-1 lg:row-start-8 lg:row-span-2',
    'lg:col-start-4 lg:col-span-1 lg:row-start-8 lg:row-span-1',
    'lg:col-start-3 lg:col-span-2 lg:row-start-9 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-9 lg:row-span-1',
  ],
  [ // rows 10-12 -- headroom past today's 23 projects
    'lg:col-start-1 lg:col-span-2 lg:row-start-10 lg:row-span-1',
    'lg:col-start-3 lg:col-span-1 lg:row-start-10 lg:row-span-2',
    'lg:col-start-4 lg:col-span-1 lg:row-start-10 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-11 lg:row-span-1',
    'lg:col-start-2 lg:col-span-1 lg:row-start-11 lg:row-span-2',
    'lg:col-start-4 lg:col-span-1 lg:row-start-11 lg:row-span-1',
    'lg:col-start-3 lg:col-span-2 lg:row-start-12 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-12 lg:row-span-1',
  ],
]
const BENTO_GROUP_SIZE = 8
// How many items at the front of the list get mosaic-tiled -- every
// complete group of 8, capped by how many groups are spelled out above.
function bentoCoveredCount(total: number): number {
  const fullGroups = Math.min(Math.floor(total / BENTO_GROUP_SIZE), bentoGroups.length)
  return fullGroups * BENTO_GROUP_SIZE
}

export default function Portfolio({
  projects,
  limit,
}: {
  projects: PortfolioProjectLocal[]
  limit?: number
}) {
  const sectionRef = useRef<HTMLElement>(null)
  // The grid's cards had no click handler at all -- the cursor-pointer
  // styling and hover play button implied you could open one, but nothing
  // was wired up. Reuse the same modal the reel carousel already opens.
  const [openProject, setOpenProject] = useState<number | null>(null)

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

  const visible = limit ? projects.slice(0, limit) : projects
  const bentoCovered = limit ? 0 : bentoCoveredCount(visible.length)

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
              A Gallery of Impact
            </h2>
          </div>
        </div>

        {/* Cinematic bento grid — hand-tiled in cycles of 8 so it fills
            every cell with no gaps; any trailing partial group falls back
            to plain squares, which can never gap regardless of count. */}
        <div className="pf-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] sm:auto-rows-[260px] gap-4">
          {visible.map((p, i) => (
            <article
              key={p.title}
              onClick={() => setOpenProject(i)}
              className={`pf-card group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#00AEEF]/50 ${i < bentoCovered ? bentoGroups[Math.floor(i / BENTO_GROUP_SIZE)][i % BENTO_GROUP_SIZE] : ''}`}
            >
              {/* Image */}
              <img
                src={p.url}
                alt={p.title}
                loading="lazy"
                onError={(e) => {
                  // The media doc can exist and still 404/403 at the storage
                  // layer (e.g. a since-migrated bucket) -- catch that at
                  // render time, not just "doc is unset", so the grid never
                  // shows a browser's broken-image icon.
                  if (e.currentTarget.src !== PLACEHOLDER_IMAGE) e.currentTarget.src = PLACEHOLDER_IMAGE
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              {/* Grade + gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-0 mix-blend-overlay bg-[#00AEEF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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

      <ProjectCardModal
        project={openProject === null ? null : visible[openProject]}
        accent="#00AEEF"
        onClose={() => setOpenProject(null)}
      />
    </section>
  )
}
