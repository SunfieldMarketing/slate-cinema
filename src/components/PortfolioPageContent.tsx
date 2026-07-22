'use client'

/*
  Portfolio page — cut down to roughly one screen per client feedback:
  "there's not gonna be any all-projects [grid]... this is just a big open
  blank space... I like that spinning gallery you did, when you click
  portfolio, it can be that thing." The page's job is routing (which
  industry/who we serve) plus one flagship visual moment (the 3D reel),
  not reselling the studio a second time — that's what the rest of the
  site already does.
*/

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import IndustryWheel from '@/components/IndustryWheel'
import IndustryReel from '@/components/IndustryReel'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import ScrollExpandMedia from '@/components/ui/scroll-expand-media'
import { industries } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

const PORTFOLIO_ACCENT = '#a855f7'

// A compact donut selector instead of a tab-grid-plus-image-panel — just a
// browsable "who we serve" moment that routes into each industry's own page.
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

export default function PortfolioPageContent() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent={PORTFOLIO_ACCENT} />

      <div className="relative z-10 w-full">
        <Nav />

        <ScrollExpandMedia
          mediaType="video"
          mediaSrc="/videos/hero.mp4"
          accent={PORTFOLIO_ACCENT}
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
              Get Started
            </a>
          </div>
        </ScrollExpandMedia>

        {/* Who we serve — the main routing interaction on this page */}
        <Industries />

        {/* The flagship 3D reel, unfiltered — every project from the shared
            portfolio-projects source, as the one big visual moment client
            asked to bring back to the portfolio page. */}
        <IndustryReel accent={PORTFOLIO_ACCENT} />

        <Footer />
      </div>
    </main>
  )
}
