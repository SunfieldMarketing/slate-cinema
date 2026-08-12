'use client'

/*
  Portfolio page — routing (which industry/who we serve) plus the full
  project archive as one filterable grid, rather than reselling the
  studio a second time — that's what the rest of the site already does.
*/

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import IndustryWheel from '@/components/IndustryWheel'
import Portfolio from '@/components/Portfolio'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import ScrollExpandMedia from '@/components/ui/scroll-expand-media'
import ThreeDPhotoCarousel from '@/components/ui/three-d-carousel'
import ProjectCardModal from '@/components/ProjectCardModal'
import type { IndustryData, PortfolioProjectLocal } from '@/lib/normalize'
import type { FinalCta, PortfolioIndexPage } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

const PORTFOLIO_ACCENT = '#a855f7'

// The original drag-to-spin 3D reel, brought back specifically for the
// general portfolio page — the client didn't like it as a per-industry
// section (too heavy repeated 8 times) but wanted it as the showcase
// centerpiece here, where it's a one-time "browse everything" moment.
function ReelCarousel({
  projects,
  copy,
}: {
  projects: PortfolioProjectLocal[]
  copy: PortfolioIndexPage['reelCarousel']
}) {
  const ref = useRef<HTMLElement>(null)
  const [openProject, setOpenProject] = useState<number | null>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rc-head', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
      gsap.fromTo('.rc-carousel', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  const cards = projects.map((p) => ({
    image: p.url,
    title: p.title,
    subtitle: `${p.category} · ${p.company}`,
  }))

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="rc-head text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#a855f7] uppercase mb-4">
            <span className="w-8 h-px bg-[#a855f7]/40" /> {copy?.eyebrow || 'The Reel'} <span className="w-8 h-px bg-[#a855f7]/40" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
            {copy?.headline || 'Spin through the work'}
          </h2>
          <p className="mt-4 text-white/50 text-sm font-mono">{copy?.subhead || 'Drag to spin the reel · click a frame to open it'}</p>
        </div>

        <div className="rc-carousel">
          <ThreeDPhotoCarousel cards={cards} onSelect={setOpenProject} />
        </div>
      </div>

      <ProjectCardModal
        project={openProject === null ? null : projects[openProject]}
        accent={PORTFOLIO_ACCENT}
        onClose={() => setOpenProject(null)}
      />
    </section>
  )
}

// A compact donut selector instead of a tab-grid-plus-image-panel — just a
// browsable "who we serve" moment that routes into each industry's own page.
function Industries({
  industries,
  copy,
}: {
  industries: IndustryData[]
  copy: PortfolioIndexPage['industriesSection']
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ind-head', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } })
      gsap.fromTo('.ind-wheel', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.ind-wheel', start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
        <div className="ind-head text-center mb-14 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase block mb-4">{copy?.eyebrow || 'Who We Work With'}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            {copy?.headline || 'Cinematic work for every industry'}
          </h2>
        </div>

        <div className="ind-wheel">
          <IndustryWheel industries={industries} accent="#00AEEF" />
        </div>
      </div>
    </section>
  )
}

export default function PortfolioPageContent({
  industries,
  projects,
  page,
  finalCta,
}: {
  industries: IndustryData[]
  projects: PortfolioProjectLocal[]
  page: PortfolioIndexPage
  finalCta: FinalCta | null
}) {
  const hero = page?.hero
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent={PORTFOLIO_ACCENT} />

      <div className="relative z-10 w-full">
        <Nav />

        <ScrollExpandMedia
          mediaType="video"
          mediaSrc="/videos/hero.mp4"
          accent={PORTFOLIO_ACCENT}
          title={hero?.title || 'Our Work'}
          date={hero?.date || 'Selected Campaigns'}
          scrollToExpand={hero?.scrollToExpandLabel || 'Scroll To Explore'}
        >
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed mb-8">
              {hero?.description ||
                "Discover a world of captivating storytelling. From immersive brand journeys to campaigns that dominate the feed — this is Slate Cinema's showcase."}
            </p>
            <a
              href={hero?.ctaHref || '/contact'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#a855f7] hover:text-white transition-colors duration-300"
            >
              {hero?.ctaLabel || 'Get Started'}
            </a>
          </div>
        </ScrollExpandMedia>

        {/* The showcase centerpiece — drag-to-spin reel of actual work */}
        <ReelCarousel projects={projects} copy={page?.reelCarousel} />

        {/* Who we serve — the main routing interaction on this page */}
        <Industries industries={industries} copy={page?.industriesSection} />

        {/* The full project archive -- no category filter chips, per the
            client's call: with only a handful of projects per category,
            filtering makes the grid look sparse rather than deep. */}
        <Portfolio projects={projects} />

        <FinalCTA data={finalCta} />

        <Footer />
      </div>
    </main>
  )
}
