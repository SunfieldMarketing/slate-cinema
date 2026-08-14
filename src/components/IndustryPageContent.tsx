'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ExternalLink } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import Portfolio from '@/components/Portfolio'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import IndustryServices from '@/components/IndustryServices'
import IndustryProcess from '@/components/IndustryProcess'
import IndustryClientShowcase from '@/components/IndustryClientShowcase'
import CinematicStatement from '@/components/ui/CinematicStatement'
import TrustBanner from '@/components/TrustBanner'
import MidCtaBand from '@/components/MidCtaBand'
import StickyCta from '@/components/StickyCta'
import type { IndustryData, PortfolioProjectLocal } from '@/lib/normalize'
import type { FinalCta } from '@/payload-types'
import posthog from 'posthog-js'

gsap.registerPlugin(ScrollTrigger)

/*
  Healthcare doesn't get Slate Cinema's own industry template — it routes
  visitors to WaveCare, our sister brand that handles healthcare marketing.
  A stripped page (Nav + a short message + one external CTA + Footer),
  reusing PageHero for the header so it still feels like part of the site.
*/
function WaveCareRedirect({ industry }: { industry: IndustryData }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.wc-fade', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent={industry.accent} />

      <div className="relative z-10 w-full">
        <Nav />

        <PageHero
          eyebrow="Our Work"
          title={[industry.label]}
          subtitle={industry.blurb}
          videoSrc={industry.heroVideo}
          posterSrc={industry.heroImage}
          accent={industry.accent}
        />

        <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-28">
          <div className="wc-fade relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <span
              className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-6"
              style={{ color: industry.accent }}
            >
              <span className="w-8 h-px" style={{ background: `${industry.accent}66` }} /> Sister Brand
              <span className="w-8 h-px" style={{ background: `${industry.accent}66` }} />
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Want to see what our healthcare marketing does?
            </h2>
            <p className="text-white/60 font-light leading-relaxed mb-10 text-lg">
              We operate under Wavecare, our sister brand.
            </p>
            <a
              href="https://wavecare.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm text-black bg-white hover:text-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              Visit Wavecare
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

export default function IndustryPageContent({
  industry,
  portfolioProjects,
  finalCta,
}: {
  industry: IndustryData
  portfolioProjects: PortfolioProjectLocal[]
  finalCta: FinalCta | null
}) {
  useEffect(() => {
    posthog.capture('portfolio_industry_viewed', { industry: industry.slug, industry_label: industry.label })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry.slug])

  if (industry.slug === 'healthcare') {
    return <WaveCareRedirect industry={industry} />
  }

  // "The Athletics format" (2026-08-13, generalized to every industry
  // page per Kauan): PageHero -> TrustBanner -> real client showcase ->
  // Services -> a CinematicStatement video "beat" -> MidCta -> Process ->
  // Portfolio grid -> FinalCTA. Same section order as
  // portfolio/athletics/page.tsx (kept as its own file since Payload's
  // healthcare-redirect branch above already makes this component
  // conditional per-industry) -- IndustryHeroSequence and the old
  // two-column IntroSection are gone; Athletics never had them either.
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent={industry.accent} />

      <div className="relative z-10 w-full">
        <Nav />

        <PageHero
          eyebrow="Our Work"
          title={[industry.label]}
          subtitle={industry.blurb}
          videoSrc={industry.heroVideo}
          accent={industry.accent}
          stats={industry.stats}
          cta={{ label: 'Get Started', href: '/contact' }}
          trustNote="174+ projects since 2023 · Replies within minutes"
        />

        <TrustBanner />

        {industry.clientShowcase && (
          <IndustryClientShowcase clients={industry.clientShowcase} accent={industry.accent} />
        )}

        {industry.serviceCards && <IndustryServices services={industry.serviceCards} accent={industry.accent} />}

        {industry.cinematicStatement && (
          <CinematicStatement
            eyebrow={industry.cinematicStatement.eyebrow}
            lines={industry.cinematicStatement.lines}
            body={industry.cinematicStatement.body}
            videoSrc={industry.cinematicStatement.videoSrc}
            accent={industry.accent}
          />
        )}

        <MidCtaBand accent={industry.accent} />

        {industry.process && <IndustryProcess steps={industry.process} accent={industry.accent} />}

        <div id="gallery">
          <Portfolio projects={portfolioProjects} />
        </div>

        <FinalCTA data={finalCta} />

        <Footer />

        <StickyCta accent={industry.accent} />
      </div>
    </main>
  )
}
