'use client'

import React from 'react'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import TrustSection from '@/components/TrustSection'
import Results from '@/components/Results'
import Pipeline from '@/components/Pipeline'
import MediaVoid from '@/components/MediaVoid'
import IndustryStandards from '@/components/IndustryStandards'
import Reviews from '@/components/Reviews'
import PortfolioCarousel from '@/components/PortfolioCarousel'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import PageSections from '@/components/blocks/PageSections'
import type { BlocksData } from '@/components/blocks/types'
import type { HomePage, FinalCta } from '@/payload-types'
import type { PortfolioProjectLocal } from '@/lib/normalize'
import type { Category } from '@/lib/pipeline-data'

export default function HomePageContent({
  homePage,
  pipelineCategories,
  pipelineHeading,
  portfolioProjects,
  finalCta,
  blocksData,
}: {
  homePage: HomePage
  pipelineCategories: Category[]
  pipelineHeading?: { eyebrow?: string | null; title?: string | null; description?: string | null }
  portfolioProjects: PortfolioProjectLocal[]
  finalCta: FinalCta | null
  blocksData?: BlocksData
}) {
  // Each built-in section, drawn in the order of the page's Sections list
  // (Home Page > Sections in /admin).
  const builtIns = {
    hero: <div data-scroll-section="hero" data-cms-global="home-page"><Hero data={homePage?.hero} /></div>,
    trust: <div data-scroll-section="trust" data-cms-global="home-page"><TrustSection data={homePage?.trustSection} /></div>,
    pipeline: <div id="how" data-scroll-section="pipeline" data-cms-global="pipeline"><Pipeline categories={pipelineCategories} heading={pipelineHeading} /></div>,
    mediaVoid: <div data-scroll-section="mediavoid" data-cms-global="home-page"><MediaVoid data={homePage?.mediaVoid} /></div>,
    // Restored 2026-08-13 at Kauan's explicit request after being removed in
    // the previous pass over the fake-stats audit finding -- the specific
    // 120,000,000-views/98.2%-reach numbers are still unverified/placeholder
    // pending real aggregate figures. Update `viewsTarget`/`reachPercent`
    // via the HomePage global once real numbers exist.
    results: <div data-scroll-section="results" data-cms-global="home-page"><Results data={homePage?.results} /></div>,
    standards: <div data-scroll-section="standards" data-cms-global="home-page"><IndustryStandards data={homePage?.industryStandards} /></div>,
    reviews: <div data-scroll-section="reviews" data-cms-global="home-page"><Reviews data={homePage?.reviews} /></div>,
    selectedWork: <div id="reel" data-scroll-section="portfolio"><PortfolioCarousel projects={portfolioProjects} copy={homePage?.selectedWork} /></div>,
    finalCta: <div data-scroll-section="finalcta" data-cms-global="final-cta"><FinalCTA data={finalCta} /></div>,
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      {/* Global Cinematic Overlays */}

      <div className="fixed inset-0 z-50 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,12,14,0.4)_100%)]" />

      <AmbientBackdrop accent="#00AEEF" />

      <Nav />

      <div className="relative z-10 w-full">
        <PageSections page="home" layout={homePage?.layout} builtIns={builtIns} accent="#00AEEF" cms={{ global: 'home-page' }} data={blocksData} />
        <div data-scroll-section="footer"><Footer /></div>
      </div>
    </main>
  )
}
