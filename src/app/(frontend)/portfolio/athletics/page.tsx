import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import Portfolio from '@/components/Portfolio'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import TrustBanner from '@/components/TrustBanner'
import MidCtaBand from '@/components/MidCtaBand'
import IndustryServices from '@/components/IndustryServices'
import IndustryProcess from '@/components/IndustryProcess'
import CinematicStatement from '@/components/ui/CinematicStatement'
import AthleticsClientShowcase from '@/components/athletics/AthleticsClientShowcase'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getFinalCTA } from '@/lib/payload-data'
import { notFound } from 'next/navigation'

/*
  Dedicated page (not the shared [industry]/IndustryPageContent template)
  per Jake's Aug 12 call: "the athletics page, the animation page are
  different designs entirely" — Athletics first since he called it
  "fully flushed out" already. Real anchors: Gotham Rugby, Kids of
  Courage marathons, Camp Slapshots, APEX NYC (see
  AthleticsClientShowcase.tsx for sourcing notes). No "Same-Day
  Turnaround" claim — that was TNR-specific per the audit doc, and TNR
  remains an open collections dispute, not resolved here.

  Media: real client names/copy, but no real photo/video assets could be
  pulled (Wix's video player isn't scrapeable by automated tools) --
  generic placeholder video/imagery stays until real footage is handed
  over, per Kauan's explicit call to keep moving rather than block on it.
*/

export const metadata: Metadata = {
  title: 'Athletics Video Production',
  description:
    'High-energy sports and fitness content built for retention — hype reels, athlete features, and live event capture for Gotham Rugby, Kids of Courage, Camp Slapshots, and APEX NYC.',
}

export default async function AthleticsPage() {
  const [industries, portfolioProjects, finalCta] = await Promise.all([
    getNormalizedIndustries(),
    getNormalizedPortfolioProjects(),
    getFinalCTA(),
  ])
  const industry = industries.find((i) => i.slug === 'athletics')
  if (!industry) notFound()

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#f97316] selection:text-white">
      <AmbientBackdrop accent="#f97316" />

      <div className="relative z-10 w-full">
        <Nav />

        <PageHero
          eyebrow="Athletics"
          title={['Fast cuts.', 'Real competition.']}
          subtitle="Sports content lives or dies in the first second. Hype reels, athlete features, and live event capture — built for people who scroll fast and stop for even faster."
          videoSrc={industry.heroVideo}
          accent="#f97316"
          stats={industry.stats}
          cta={{ label: 'Get Started', href: '/contact' }}
          trustNote="174+ projects since 2023 · Replies within minutes"
        />

        <TrustBanner />

        <AthleticsClientShowcase />

        {industry.serviceCards && <IndustryServices services={industry.serviceCards} accent={industry.accent} />}

        <CinematicStatement
          eyebrow="Why Speed Matters"
          lines={['Content built for', 'people who scroll fast.']}
          body="A hype reel has less than a second to earn the next second. Every cut, every beat, every frame is built around that one job — hold attention through the scroll, not just look good after it stops."
          videoSrc="/videos/hero-camera.mp4"
          accent="#f97316"
        />

        <MidCtaBand accent={industry.accent} />

        {industry.process && <IndustryProcess steps={industry.process} accent={industry.accent} />}

        <div id="gallery">
          <Portfolio projects={portfolioProjects} />
        </div>

        <FinalCTA data={finalCta} />

        <Footer />
      </div>
    </main>
  )
}
