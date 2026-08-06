'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import Pipeline from '@/components/Pipeline'
import BehindTheScenes from '@/components/BehindTheScenes'
import StoryboardHero from '@/components/StoryboardHero'
import StatsBand from '@/components/ui/StatsBand'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import { resolveIcon } from '@/lib/icon-map'
import { mediaUrl } from '@/lib/media-url'
import type { HowItWorksPage, FinalCta } from '@/payload-types'
import type { Category } from '@/lib/pipeline-data'

gsap.registerPlugin(ScrollTrigger)

const fallbackTimelineSteps = [
  { title: 'Pre-Production', color: '#00AEEF', line: 'Scripts, boards, and a locked plan before anything rolls.' },
  { title: 'Production', color: '#a855f7', line: 'Cameras roll — the shoot captures every frame on set.' },
  { title: 'Post-Production', color: '#10b981', line: 'Edit, grade, and sound turn footage into a finished film.' },
  { title: 'Distribution', color: '#f97316', line: 'Platform-native cuts get it in front of the right audience.' },
]

/* ── Horizontal summary timeline — a quick-glance map of the 4 phases,
   sitting right after the hero. Deliberately short: it's an at-a-glance
   overview, not a retelling — Pipeline further down the page is already
   the full, one-screen-per-phase walkthrough. Visual language (diamond
   nodes + filling connector line) borrowed from IndustryProcess for
   consistency with the rest of the site instead of inventing a new one. */
function ProcessOverview({ copy }: { copy?: HowItWorksPage['processOverview'] }) {
  const ref = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const eyebrow = copy?.eyebrow || 'At A Glance'
  const headline = copy?.headline || 'Four phases, start to finish'
  const timelineSteps = copy?.timelineSteps?.length ? copy.timelineSteps : fallbackTimelineSteps

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.po-fade', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })

      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { width: '0%' },
          {
            width: '100%',
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
            onUpdate(this: gsap.core.Tween) {
              const idx = Math.min(timelineSteps.length - 1, Math.floor(this.progress() * timelineSteps.length))
              nodeRefs.current.forEach((el, i) => {
                if (!el) return
                const active = i <= idx
                el.style.background = active ? timelineSteps[i].color : '#1b2534'
                el.style.borderColor = active ? timelineSteps[i].color : 'rgba(255,255,255,0.25)'
              })
            },
          }
        )
      }
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden pt-16 pb-6 md:pt-20 md:pb-8">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
        <div className="po-fade text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase mb-3">
            <span className="w-8 h-px bg-brand-blue/40" /> {eyebrow} <span className="w-8 h-px bg-brand-blue/40" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-[1.1]">
            {headline}
          </h2>
        </div>

        {/* Connector line + diamond nodes — the nodes are positioned along a
            single 4-across line, which only lines up with the labels below
            when those labels are also in one row. On narrow screens the
            label grid wraps to 2x2 (below), so the nodes would drift out
            of alignment with their labels; hidden until the label grid is
            back to a single row at sm:. */}
        <div className="po-fade relative hidden sm:block h-1 bg-white/10 rounded-full mx-2 mb-5">
          <div ref={fillRef} className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/40 to-brand-blue" style={{ width: '0%' }} />
          {timelineSteps.map((s, i) => (
            <div
              key={s.title}
              ref={(el) => {
                nodeRefs.current[i] = el
              }}
              className="absolute top-1/2 w-3 h-3 -translate-y-1/2 -translate-x-1/2 rotate-45 border transition-colors duration-300"
              style={{ left: `${((i + 0.5) / timelineSteps.length) * 100}%`, background: '#1b2534', borderColor: 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>

        {/* Labels + one-liners — kept to a single row, one line each */}
        <div className="po-fade grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-3">
          {timelineSteps.map((s) => (
            <div key={s.title} className="text-center px-1">
              <div className="font-bold text-base sm:text-lg tracking-tight mb-1.5" style={{ color: s.color }}>
                {s.title}
              </div>
              <p className="text-white/50 text-xs font-light leading-snug">{s.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Process walkthrough — a real scrollytelling sequence through the 4
   production phases instead of another card grid. Pinned phase video on
   one side, descriptions scrolling past on the other; reuses the same
   phase footage and colors as the Pipeline filmstrip above for continuity. */
const fallbackProcessPhases = [
  {
    title: 'Pre-Production',
    color: '#00AEEF',
    video: '/videos/pre-production.mp4',
    description: 'Every shoot starts on paper. Scripts, storyboards, shotlists, casting, locations, and a full production schedule — locked before a single camera rolls.',
  },
  {
    title: 'Production',
    color: '#a855f7',
    video: '/videos/production.mp4',
    description: 'Directors, camera crew, sound, talent, and set design come together on set. This is where the raw footage is captured, frame by frame.',
  },
  {
    title: 'Post-Production',
    color: '#10b981',
    video: '/videos/post-production.mp4',
    description: 'Editing, color grading, sound design, motion graphics, and VFX turn raw footage into a finished film — the phase most of the craft lives in.',
  },
  {
    title: 'Distribution',
    color: '#f97316',
    video: '/videos/distribution.mp4',
    description: 'Platform-native cuts, ad management, and social strategy get the finished piece in front of the right audience, on every channel that matters.',
  },
]

function ProcessWalkthrough({ copy }: { copy?: HowItWorksPage['processWalkthrough'] }) {
  const ref = useRef<HTMLElement>(null)
  const eyebrow = copy?.eyebrow || 'Every Project Includes'
  const headline = copy?.headline || 'Watch it move through every phase'
  const subhead = copy?.subhead || "A complete production — not just raw footage. Scroll through to see what's actually happening at each stage."
  const processPhases = copy?.phases?.length
    ? copy.phases.map((p) => ({ title: p.title, color: p.color, video: mediaUrl(p.video) || '', description: p.description }))
    : fallbackProcessPhases

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pw-head', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="pw-head text-center mb-14 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase block mb-4">{eyebrow}</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-5">{headline}</h2>
          <p className="text-white/55 text-sm sm:text-base font-light">{subhead}</p>
        </div>

        <StickyScroll
          content={processPhases.map((p) => ({
            title: p.title,
            description: p.description,
            color: p.color,
            content: (
              <video
                key={p.video}
                src={p.video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            ),
          }))}
        />
      </div>
    </section>
  )
}

const fallbackGuarantees = [
  { icon: 'Clock', title: '1-Day Response', desc: 'A custom execution plan within one business day of your scope form.' },
  { icon: 'ShieldCheck', title: 'Fixed Pricing', desc: 'Locked proposal before we roll — no hourly surprises, ever.' },
  { icon: 'RefreshCw', title: 'Revision Rounds', desc: 'Structured revision rounds built into every timeline until it lands.' },
  { icon: 'Handshake', title: 'One Team, End-to-End', desc: 'The same team from first idea to final export — no handoffs, no drift.' },
]

// No own <section>/padding — this renders directly beneath StatsBand and is
// meant to read as the bottom half of one combined trust section, not a
// second thin strip stacked on top of the first.
function Guarantees({ items }: { items?: HowItWorksPage['guarantees'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const guarantees = items?.length ? items : fallbackGuarantees

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gt-badge', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.7)', scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <div ref={ref} className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 -mt-8 md:-mt-10 pb-8 md:pb-10">
      <div className="w-full h-px bg-white/[0.06] mb-10 md:mb-12" />
      {/* Compact badge strip — deliberately not another card grid */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {guarantees.map((g, i) => {
          const Icon = resolveIcon(g.icon)
          return (
            <div key={g.title} className="flex items-center gap-8 sm:gap-14">
              <div className="gt-badge flex items-center gap-3">
                <Icon className="w-4 h-4 text-brand-blue shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-white leading-tight">{g.title}</div>
                  <div className="text-white/40 text-xs font-light leading-tight">{g.desc}</div>
                </div>
              </div>
              {i < guarantees.length - 1 && <div className="hidden sm:block w-px h-8 bg-white/10" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const fallbackStats = [
  { value: 1, suffix: 'hr', label: 'Avg. Response Time' },
  { value: 3, suffix: 'wk', label: 'Avg. Turnaround' },
  { value: 90, suffix: '%', label: 'Client Retention' },
  { value: 50, suffix: '+', label: 'Brands Served' },
]

export default function HowItWorksPageContent({
  page,
  pipelineCategories,
  pipelineHeading,
  finalCta,
}: {
  page: HowItWorksPage
  pipelineCategories: Category[]
  pipelineHeading?: { eyebrow?: string | null; title?: string | null; description?: string | null }
  finalCta: FinalCta | null
}) {
  const hero = page?.hero
  const stats = page?.statsBand?.length
    ? page.statsBand.map((s) => ({ value: s.value, suffix: s.suffix || '', label: s.label }))
    : fallbackStats

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent="#00AEEF" />

      <div className="relative z-10 w-full">
        <Nav />

        <StoryboardHero
          eyebrow={hero?.eyebrow || 'The Process'}
          title={[hero?.title || 'How It Works']}
          subtitle={hero?.subtitle || 'A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically.'}
          accent="#00AEEF"
          cta={{ label: hero?.ctaLabel || 'Get Started', href: hero?.ctaHref || '/contact' }}
        />

        {/* Quick-glance map of the 4 phases — horizontal, short, and up
            top so a visitor gets the whole shape of the process before
            scrolling into Pipeline's full per-phase breakdown below. */}
        <ProcessOverview copy={page?.processOverview} />

        {/* The centerpiece — open a phase, pick a service, see the breakdown */}
        <Pipeline categories={pipelineCategories} heading={pipelineHeading} />

        <BehindTheScenes data={page?.behindTheScenes} />

        <ProcessWalkthrough copy={page?.processWalkthrough} />

        <StatsBand stats={stats} />

        <Guarantees items={page?.guarantees} />

        <FinalCTA data={finalCta} />

        <Footer />
      </div>
    </main>
  )
}
