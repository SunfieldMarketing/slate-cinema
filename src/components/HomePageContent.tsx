'use client'

import React from 'react'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import TrustSection from '@/components/TrustSection'
import Pipeline from '@/components/Pipeline'
import MediaVoid from '@/components/MediaVoid'
import IndustryStandards from '@/components/IndustryStandards'
import Reviews from '@/components/Reviews'
import PortfolioCarousel from '@/components/PortfolioCarousel'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import type { HomePage, FinalCta } from '@/payload-types'
import type { PortfolioProjectLocal } from '@/lib/normalize'
import type { Category } from '@/lib/pipeline-data'

export default function HomePageContent({
  homePage,
  pipelineCategories,
  pipelineHeading,
  portfolioProjects,
  finalCta,
}: {
  homePage: HomePage
  pipelineCategories: Category[]
  pipelineHeading?: { eyebrow?: string | null; title?: string | null; description?: string | null }
  portfolioProjects: PortfolioProjectLocal[]
  finalCta: FinalCta | null
}) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      {/* Global Cinematic Overlays */}

      <div className="fixed inset-0 z-50 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,12,14,0.4)_100%)]" />

      <AmbientBackdrop accent="#00AEEF" />

      <Nav />

      <div className="relative z-10 w-full">
        <div data-scroll-section="hero"><Hero data={homePage?.hero} /></div>
        <div data-scroll-section="trust"><TrustSection data={homePage?.trustSection} /></div>
        <div id="how" data-scroll-section="pipeline"><Pipeline categories={pipelineCategories} heading={pipelineHeading} /></div>
        <div data-scroll-section="mediavoid"><MediaVoid data={homePage?.mediaVoid} /></div>
        {/* "Results" (fake 120M-views / 98.2%-reach counter) removed
            2026-08-13 per the audit doc's explicit instruction -- no real
            aggregate view/reach/like/comment numbers exist to back it, and
            substituting real (much smaller) project/review counts into a
            component built to dramatize millions of views would still be
            misleading in framing even with technically-true numbers. The
            site's real stats live honestly on How It Works and each
            industry page instead. Component file kept, unused, in case a
            real aggregate-performance case study is added later. */}
        <div data-scroll-section="standards"><IndustryStandards data={homePage?.industryStandards} /></div>
        <div data-scroll-section="reviews"><Reviews data={homePage?.reviews} /></div>
        <div id="reel" data-scroll-section="portfolio"><PortfolioCarousel projects={portfolioProjects} /></div>
        <div data-scroll-section="finalcta"><FinalCTA data={finalCta} /></div>
        <div data-scroll-section="footer"><Footer /></div>
      </div>
    </main>
  )
}
