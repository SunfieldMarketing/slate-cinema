'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Play, Star } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import Portfolio from '@/components/Portfolio'
import ReelShowcase from '@/components/ReelShowcase'
import TopWorkShowcase from '@/components/TopWorkShowcase'
import IndustryWheel from '@/components/IndustryWheel'
import StatsBand from '@/components/ui/StatsBand'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { Lens } from '@/components/ui/lens'
import ScrollExpandMedia from '@/components/ui/scroll-expand-media'
import { industries } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

const impactStats = [
  { value: 340, suffix: 'M+', label: 'Total Views Generated' },
  { value: 120, suffix: '+', label: 'Campaigns Delivered' },
  { value: 45, suffix: '%', label: 'Avg. Brand Lift' },
  { value: 18, suffix: '', label: 'Industry Awards' },
]

/* ── Featured case study spotlight — same dark card language as the rest
   of the site, no separate "concept" of its own ─────────────────────── */
function FeaturedCase() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fc-media', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })
      gsap.fromTo('.fc-fade', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="fc-fade flex items-center gap-3 mb-8">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase">Featured Campaign</span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-stretch">
          <div className="fc-media group relative rounded-2xl overflow-hidden border border-white/10 min-h-[340px] lg:min-h-[480px]">
            <div className="absolute inset-0 [&>div]:h-full [&>div]:w-full">
              <Lens zoomFactor={1.3} lensSize={180} ariaLabel="Inspect The Blueprint campaign still">
                <img src="/images/portfolio-production.png" alt="The Blueprint campaign" className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
              </Lens>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute top-5 left-5 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80">Documentary · Nexus Architecture</div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="fc-fade text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.1] mb-5">The Blueprint</h2>
            <p className="fc-fade text-white/60 font-light leading-relaxed mb-8">
              A short-form documentary following a landmark build from groundbreaking to ribbon-cutting — a brand film that doubled as a case study for winning future clients.
            </p>
            <div className="fc-fade grid grid-cols-3 gap-4 mb-8">
              {[{ v: '+45%', l: 'Brand Lift' }, { v: '1:45', l: 'Watch Time' }, { v: '2', l: 'Awards' }].map((m) => (
                <div key={m.l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <div className="text-2xl font-bold text-brand-blue">{m.v}</div>
                  <div className="font-mono text-[9px] tracking-widest text-white/40 uppercase mt-1">{m.l}</div>
                </div>
              ))}
            </div>
            <div className="fc-fade flex items-center gap-2 mb-8">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4" fill="#00AEEF" stroke="#00AEEF" />)}
              <span className="text-white/50 text-sm ml-2">&ldquo;It plays like a landmark, not an ad.&rdquo;</span>
            </div>
            <a href="/contact" className="fc-fade group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-brand-blue hover:text-white transition-colors duration-300 w-max">
              Start a campaign like this
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// A compact donut selector instead of the old tab-grid-plus-image-panel —
// that version doubled as a second "filter" sitting right above Portfolio's
// own filter chips below. This is just a browsable "who we serve" moment;
// the actual filtering stays the one real filter on the page.
function Industries() {
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
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase block mb-4">Who We Work With</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            Cinematic work for every industry
          </h2>
        </div>

        <div className="ind-wheel">
          <IndustryWheel industries={industries} accent="#00AEEF" />
        </div>
      </div>
    </section>
  )
}

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent="#a855f7" />

      <div className="relative z-10 w-full">
        <Nav />

        <ScrollExpandMedia
          mediaType="video"
          mediaSrc="/videos/hero.mp4"
          accent="#a855f7"
          title="Our Work"
          date="Selected Campaigns"
          scrollToExpand="Scroll To Explore"
        >
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed mb-8">
              Discover a world of captivating storytelling. From immersive brand journeys to campaigns that dominate the feed — this is Slate Cinema&apos;s showcase.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#a855f7] hover:text-white transition-colors duration-300"
            >
              Start Your Project
            </a>
          </div>
        </ScrollExpandMedia>

        <StatsBand stats={impactStats} />

        <Industries />

        <ReelShowcase />

        <TopWorkShowcase />

        {/* Reuse the interactive project card grid — untouched, shared
            with the homepage. */}
        <Portfolio />

        <FeaturedCase />

        <FinalCTA />

        <Footer />
      </div>
    </main>
  )
}
