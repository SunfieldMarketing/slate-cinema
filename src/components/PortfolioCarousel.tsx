'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { PortfolioProjectLocal } from '@/lib/normalize'
import ThreeDPhotoCarousel from '@/components/ui/three-d-carousel'
import ProjectCardModal from '@/components/ProjectCardModal'

gsap.registerPlugin(ScrollTrigger)

/*
  Homepage-only "Selected Work" — the interactive drag-to-spin 3D carousel
  instead of the static grid, so the reel format the client liked carries
  through to the front page too. Clicking a card opens the same project
  breakdown modal used on the film reel, so both interactions feel like
  one system.
*/
export default function PortfolioCarousel({ projects }: { projects: PortfolioProjectLocal[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [openProject, setOpenProject] = useState<number | null>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pc-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      gsap.fromTo('.pc-carousel', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  const cards = projects.map((p) => ({
    image: p.url,
    title: p.title,
    subtitle: `${p.category} · ${p.company}`,
  }))

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="pc-head text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-4">
            <span className="w-8 h-px bg-[#00AEEF]/40" /> Our Work <span className="w-8 h-px bg-[#00AEEF]/40" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
            Selected Work
          </h2>
          <p className="mt-4 text-white/50 text-sm font-mono">Drag to spin the reel · click a frame to open it</p>
        </div>

        <div className="pc-carousel">
          <ThreeDPhotoCarousel cards={cards} onSelect={setOpenProject} />
        </div>

        {/* "View Full Portfolio" removed from here 2026-08-22 -- the Final
            CTA right below now carries that exact link/label instead, so
            this section no longer needed its own duplicate button. */}
      </div>

      <ProjectCardModal
        project={openProject === null ? null : projects[openProject]}
        accent="#00AEEF"
        onClose={() => setOpenProject(null)}
      />
    </section>
  )
}
