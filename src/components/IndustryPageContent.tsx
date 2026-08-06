'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star, ExternalLink } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import Portfolio from '@/components/Portfolio'
import PageHero from '@/components/ui/PageHero'
import IndustryHeroSequence from '@/components/IndustryHeroSequence'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { Lens } from '@/components/ui/lens'
import IndustryServices from '@/components/IndustryServices'
import IndustryProcess from '@/components/IndustryProcess'
import IndustryFaq from '@/components/IndustryFaq'
import IndustryVideoTestimonials from '@/components/IndustryVideoTestimonials'
import TrustBanner from '@/components/TrustBanner'
import MidCtaBand from '@/components/MidCtaBand'
import StickyCta from '@/components/StickyCta'
import type { IndustryData, PortfolioProjectLocal } from '@/lib/normalize'
import type { FinalCta } from '@/payload-types'
import posthog from 'posthog-js'

gsap.registerPlugin(ScrollTrigger)

function IntroSection({ industry }: { industry: IndustryData }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.intro-fade', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="intro-fade relative rounded-2xl overflow-hidden border border-white/10 min-h-[300px] lg:min-h-[380px]">
          <Lens zoomFactor={1.3} lensSize={160} ariaLabel={`Inspect ${industry.label} work`}>
            <img src={industry.gallery[0] ?? industry.heroImage} alt={industry.label} className="w-full h-full object-cover" />
          </Lens>
        </div>
        <div>
          <span className="intro-fade inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: industry.accent }}>
            <span className="w-8 h-px" style={{ background: `${industry.accent}66` }} /> What We Do
          </span>
          <h2 className="intro-fade text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            {industry.label} content, done right
          </h2>
          <p className="intro-fade text-white/60 font-light leading-relaxed mb-8">{industry.description}</p>
          <div className="intro-fade flex flex-wrap gap-2.5">
            {industry.services.map((s) => (
              <span key={s} className="text-xs font-mono px-3.5 py-2 rounded-full border text-white/75" style={{ borderColor: `${industry.accent}40`, background: `${industry.accent}12` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/*
  Simple image gallery for industries that don't yet have client story
  cards — the built-out pages carry their work proof inside the merged
  Client Stories section instead.
*/
function GallerySection({ industry }: { industry: IndustryData }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gal-tile', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.gal-grid', start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase block mb-4" style={{ color: industry.accent }}>The Work</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">A closer look</h2>
        </div>

        <div className="gal-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
          {industry.gallery.map((src, i) => (
            <div key={i} className="gal-tile relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5]">
              <img src={src} alt={`${industry.label} shot ${i + 1}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialSection({ industry }: { industry: IndustryData }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.tm-fade', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="tm-fade relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="flex items-center justify-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4" fill={industry.accent} stroke={industry.accent} />)}
        </div>
        <p className="text-xl sm:text-2xl font-medium text-white/90 leading-relaxed mb-6">&ldquo;{industry.testimonial.quote}&rdquo;</p>
        <div className="text-sm text-white/50">
          <span className="text-white font-semibold">{industry.testimonial.name}</span> · {industry.testimonial.role}, {industry.testimonial.company}
        </div>
      </div>
    </section>
  )
}

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
              We operate under WaveCare, our sister brand.
            </p>
            <a
              href="https://wavecare.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm text-black bg-white hover:text-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              Visit WaveCare
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

  const heroRef = useRef<HTMLDivElement>(null)

  if (industry.slug === 'healthcare') {
    return <WaveCareRedirect industry={industry} />
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent={industry.accent} />

      <div className="relative z-10 w-full">
        <Nav />

        <div className="relative" ref={heroRef}>
          <IndustryHeroSequence containerRef={heroRef} />
          <PageHero
            eyebrow="Our Work"
            title={[industry.label]}
            subtitle={industry.blurb}
            accent={industry.accent}
            stats={industry.stats}
            cta={{ label: 'Get Started', href: '/contact' }}
            secondaryCta={{ label: 'Watch the work', href: '/portfolio' }}
            trustNote="40+ projects shipped · Replies within one business day"
          />
        </div>

        {/* Trust cluster: stats + logos back-to-back, right under the hero,
            before anything else is asked of the visitor. */}
        <TrustBanner />

        <IntroSection industry={industry} />

        {/* The sell: what you can actually hire us for. Moved directly
            after the intro — a visitor should see the menu before being
            walked through proof, not after. */}
        {industry.serviceCards && <IndustryServices services={industry.serviceCards} accent={industry.accent} />}

        {/* Proof cluster: client stories (case study + testimonial merged
            into one card: outcome stat, video, quote), capped by a single
            re-ask. Industries without story cards show their plain image
            gallery instead. The film-strip reel used to lead this cluster
            but the client didn't like the look on individual industry
            pages — that drag-to-spin format now lives on the general
            /portfolio page instead. */}
        {industry.videoTestimonials ? (
          <IndustryVideoTestimonials testimonials={industry.videoTestimonials} accent={industry.accent} />
        ) : (
          <>
            <GallerySection industry={industry} />
            <TestimonialSection industry={industry} />
          </>
        )}

        <MidCtaBand accent={industry.accent} />

        {/* Logistics: how it works, then the full archive for anyone still
            browsing, then objection-handling right before the close. */}
        {industry.process && <IndustryProcess steps={industry.process} accent={industry.accent} />}

        {/* Reuse the shared filterable grid — same "everything we've made"
            view as the main Portfolio page. Carries the #gallery anchor the
            reel's "View project" link points at. */}
        <div id="gallery">
          <Portfolio projects={portfolioProjects} />
        </div>

        {industry.faqs && <IndustryFaq faqs={industry.faqs} accent={industry.accent} />}

        <FinalCTA data={finalCta} />

        <Footer />

        <StickyCta accent={industry.accent} />
      </div>
    </main>
  )
}
