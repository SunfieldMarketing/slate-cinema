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
import PageSections from '@/components/blocks/PageSections'
import type { BlocksData } from '@/components/blocks/types'
import type { IndustryData, IndustryRedirect, PortfolioProjectLocal } from '@/lib/normalize'
import type { FinalCta } from '@/payload-types'
import { useSiteLabels } from '@/lib/site-data-context'
import posthog from 'posthog-js'

gsap.registerPlugin(ScrollTrigger)

/*
  An industry whose doc has "Send visitors to a sister brand instead"
  switched on (Healthcare -> Wavecare) doesn't get the industry template:
  a stripped page (Nav + a short message + one external CTA + Footer),
  reusing PageHero for the header so it still feels like part of the site.
  Used to be special-cased on slug === 'healthcare' with the copy typed in
  here; all of it lives on the industry doc now.
*/
function SisterBrandRedirect({ industry, redirect }: { industry: IndustryData; redirect: IndustryRedirect }) {
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

        <div data-cms-collection="industries" data-cms-doc-id={industry.id}>
          <PageHero
            eyebrow={industry.stat || 'Our Work'}
            title={[industry.label]}
            subtitle={industry.blurb}
            videoSrc={industry.heroVideo}
            videoVimeoUrl={industry.heroVideoVimeoUrl}
            posterSrc={industry.heroImage}
            accent={industry.accent}
            eyebrowFieldPath="stat"
            titleFieldPaths={['label']}
            subtitleFieldPath="blurb"
          />

          <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-28">
            <div className="wc-fade relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-8 text-center">
              {redirect.eyebrow && (
                <span
                  className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-6"
                  style={{ color: industry.accent }}
                >
                  <span className="w-8 h-px" style={{ background: `${industry.accent}66` }} />
                  <span data-cms-field="redirectEyebrow">{redirect.eyebrow}</span>
                  <span className="w-8 h-px" style={{ background: `${industry.accent}66` }} />
                </span>
              )}
              {redirect.headline && (
                <h2 data-cms-field="redirectHeadline" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                  {redirect.headline}
                </h2>
              )}
              {redirect.body && (
                <p data-cms-field="redirectBody" className="text-white/60 font-light leading-relaxed mb-10 text-lg">
                  {redirect.body}
                </p>
              )}
              {redirect.url && redirect.buttonLabel && (
                <a
                  href={redirect.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cms-field="redirectButtonLabel"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm text-black bg-white hover:text-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                >
                  {redirect.buttonLabel}
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </main>
  )
}

export default function IndustryPageContent({
  industry,
  portfolioProjects,
  finalCta,
  blocksData,
}: {
  industry: IndustryData
  portfolioProjects: PortfolioProjectLocal[]
  finalCta: FinalCta | null
  blocksData?: BlocksData
}) {
  const labels = useSiteLabels()

  useEffect(() => {
    posthog.capture('portfolio_industry_viewed', { industry: industry.slug, industry_label: industry.label })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry.slug])

  if (industry.redirect) {
    return <SisterBrandRedirect industry={industry} redirect={industry.redirect} />
  }

  // "The Athletics format" (2026-08-13, generalized to every industry
  // page per Kauan): PageHero -> TrustBanner -> real client showcase ->
  // Services -> a CinematicStatement video "beat" -> MidCta -> Process ->
  // Portfolio grid -> FinalCTA -- now the default order of the industry's
  // Sections list (2026-10-02), which editors can rearrange per industry.
  // Every piece of copy in it comes from the industry doc (or Site Settings
  // > Labels for the shared button text); each wrapper below tells Live
  // Preview's click-to-edit which doc a click belongs to.
  const cms = { 'data-cms-collection': 'industries', 'data-cms-doc-id': industry.id }
  const builtIns = {
    hero: (
      <div {...cms}>
        <PageHero
          // The industry's short tag (e.g. "Team & athlete films") --
          // it used to render only on the /portfolio wheel card.
          eyebrow={industry.stat || 'Our Work'}
          title={[industry.label]}
          subtitle={industry.blurb}
          videoSrc={industry.heroVideo}
          videoVimeoUrl={industry.heroVideoVimeoUrl}
          accent={industry.accent}
          stats={industry.stats}
          cta={{ label: labels.getStarted, href: labels.getStartedHref }}
          trustNote={labels.trustLine}
          eyebrowFieldPath="stat"
          titleFieldPaths={['label']}
          subtitleFieldPath="blurb"
          ctaFieldPath="labels.getStarted"
          ctaGlobal="site-settings"
          trustNoteFieldPath="labels.trustLine"
          trustNoteGlobal="site-settings"
        />
      </div>
    ),
    trust: <TrustBanner />,
    clients: (
      <div {...cms}>
        <IndustryClientShowcase clients={industry.clients} heading={industry.clientsHeading} accent={industry.accent} />
      </div>
    ),
    services:
      industry.serviceCards && industry.serviceCards.length > 0 ? (
        <div {...cms}>
          <IndustryServices services={industry.serviceCards} heading={industry.servicesHeading} accent={industry.accent} />
        </div>
      ) : null,
    statement: industry.statement ? (
      <div {...cms}>
        <CinematicStatement
          eyebrow={industry.statement.eyebrow}
          lines={industry.statement.lines}
          body={industry.statement.body}
          videoSrc={industry.statement.video}
          accent={industry.accent}
          fieldPaths={{ eyebrow: 'statementEyebrow', lines: 'statementHeadline', body: 'statementBody' }}
        />
      </div>
    ) : null,
    midCta: (
      <div {...cms}>
        <MidCtaBand accent={industry.accent} cta={industry.cta} />
      </div>
    ),
    process:
      industry.process && industry.process.length > 0 ? (
        <div {...cms}>
          <IndustryProcess steps={industry.process} heading={industry.processHeading} accent={industry.accent} />
        </div>
      ) : null,
    gallery: (
      <div id="gallery" {...cms}>
        <Portfolio
          projects={portfolioProjects}
          heading={industry.galleryHeading}
          headingFieldPaths={{ eyebrow: 'galleryEyebrow', headline: 'galleryHeadline' }}
        />
      </div>
    ),
    finalCta: <FinalCTA data={finalCta} />,
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent={industry.accent} />

      <div className="relative z-10 w-full">
        <Nav />

        <PageSections
          page="industry"
          layout={industry.layout}
          builtIns={builtIns}
          accent={industry.accent}
          cms={{ collection: 'industries', docId: industry.id }}
          data={blocksData}
        />

        <Footer />

        <StickyCta accent={industry.accent} />
      </div>
    </main>
  )
}
