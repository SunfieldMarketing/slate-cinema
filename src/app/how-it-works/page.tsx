'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Clock, ShieldCheck, RefreshCw, Handshake } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import Pipeline from '@/components/Pipeline'
import BehindTheScenes from '@/components/BehindTheScenes'
import StoryboardHero from '@/components/StoryboardHero'
import StatsBand from '@/components/ui/StatsBand'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'

gsap.registerPlugin(ScrollTrigger)

const processStats = [
  { value: 1, suffix: 'hr', label: 'Avg. Response Time' },
  { value: 3, suffix: 'wk', label: 'Avg. Turnaround' },
  { value: 90, suffix: '%', label: 'Client Retention' },
  { value: 50, suffix: '+', label: 'Brands Served' },
]

/* ── Horizontal summary timeline — a quick-glance map of the 4 phases,
   sitting right after the hero. Deliberately short: it's an at-a-glance
   overview, not a retelling — Pipeline further down the page is already
   the full, one-screen-per-phase walkthrough. Visual language (diamond
   nodes + filling connector line) borrowed from IndustryProcess for
   consistency with the rest of the site instead of inventing a new one. */
const timelineSteps = [
  { title: 'Pre-Production', color: '#00AEEF', line: 'Scripts, boards, and a locked plan before anything rolls.' },
  { title: 'Production', color: '#a855f7', line: 'Cameras roll — the shoot captures every frame on set.' },
  { title: 'Post-Production', color: '#10b981', line: 'Edit, grade, and sound turn footage into a finished film.' },
  { title: 'Distribution', color: '#f97316', line: 'Platform-native cuts get it in front of the right audience.' },
]

function ProcessOverview() {
  const ref = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])

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
            <span className="w-8 h-px bg-brand-blue/40" /> At A Glance <span className="w-8 h-px bg-brand-blue/40" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-[1.1]">
            Four phases, start to finish
          </h2>
        </div>

        {/* Connector line + diamond nodes */}
        <div className="po-fade relative h-1 bg-white/10 rounded-full mx-2 mb-5">
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
          {timelineSteps.map((s, i) => (
            <div key={s.title} className="text-center px-1">
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ color: s.color }}>
                {String(i + 1).padStart(2, '0')} · {s.title}
              </div>
              <p className="text-white/50 text-xs font-light leading-snug">{s.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Slim transitional CTA bar — same compact "have a project in mind"
   language as MidCtaBand (used on industry pages), rebuilt here so the
   copy and button text can follow this page's own context and the
   site's "Get Started" CTA rule. ─────────────────────────────────────── */
function NextStepBand() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.nsb-in', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  const accent = '#00AEEF'

  return (
    <section ref={ref} className="relative w-full py-6">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div
          className="nsb-in relative overflow-hidden rounded-2xl border px-6 sm:px-10 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ borderColor: `${accent}40`, background: `linear-gradient(100deg, ${accent}1f 0%, rgba(5,7,12,0.6) 55%, ${accent}14 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 40% 130% at 8% 50%, ${accent}44, transparent 65%)` }}
          />
          <div className="relative text-center sm:text-left">
            <div className="text-lg sm:text-xl font-bold text-white leading-snug">Ready to get started?</div>
            <div className="text-sm text-white/55 font-light mt-1">
              Reach out and we&apos;ll walk your project through this exact process.
            </div>
          </div>
          <a
            href="/contact"
            className="relative group inline-flex items-center gap-2.5 shrink-0 px-7 py-3.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            style={{ background: accent, boxShadow: `0 0 32px ${accent}55` }}
          >
            Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Process walkthrough — a real scrollytelling sequence through the 4
   production phases instead of another card grid. Pinned phase video on
   one side, descriptions scrolling past on the other; reuses the same
   phase footage and colors as the Pipeline filmstrip above for continuity. */
const processPhases = [
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

function ProcessWalkthrough() {
  const ref = useRef<HTMLElement>(null)
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
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase block mb-4">Every Project Includes</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-5">Watch it move through every phase</h2>
          <p className="text-white/55 text-sm sm:text-base font-light">A complete production — not just raw footage. Scroll through to see what&apos;s actually happening at each stage.</p>
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

/* ── Guarantees / why-us band ──────────────────────────────────────── */
const guarantees = [
  { icon: Clock, title: '1-Day Response', desc: 'A custom execution plan within one business day of your scope form.' },
  { icon: ShieldCheck, title: 'Fixed Pricing', desc: 'Locked proposal before we roll — no hourly surprises, ever.' },
  { icon: RefreshCw, title: 'Revision Rounds', desc: 'Structured revision rounds built into every timeline until it lands.' },
  { icon: Handshake, title: 'One Team, End-to-End', desc: 'The same team from first idea to final export — no handoffs, no drift.' },
]

// No own <section>/padding — this renders directly beneath StatsBand and is
// meant to read as the bottom half of one combined trust section, not a
// second thin strip stacked on top of the first.
function Guarantees() {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gt-badge', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.7)', scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <div ref={ref} className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 -mt-8 md:-mt-10 pb-20 md:pb-24">
      <div className="w-full h-px bg-white/[0.06] mb-10 md:mb-12" />
      {/* Compact badge strip — deliberately not another card grid */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {guarantees.map((g, i) => (
          <div key={g.title} className="flex items-center gap-8 sm:gap-14">
            <div className="gt-badge flex items-center gap-3">
              <g.icon className="w-4 h-4 text-brand-blue shrink-0" />
              <div>
                <div className="font-semibold text-sm text-white leading-tight">{g.title}</div>
                <div className="text-white/40 text-xs font-light leading-tight">{g.desc}</div>
              </div>
            </div>
            {i < guarantees.length - 1 && <div className="hidden sm:block w-px h-8 bg-white/10" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-brand-blue selection:text-white">
      <AmbientBackdrop accent="#00AEEF" />

      <div className="relative z-10 w-full">
        <Nav />

        <StoryboardHero
          eyebrow="The Process"
          title={['How It Works']}
          subtitle="A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically."
          accent="#00AEEF"
          cta={{ label: 'Get Started', href: '/contact' }}
        />

        {/* Quick-glance map of the 4 phases — horizontal, short, and up
            top so a visitor gets the whole shape of the process before
            scrolling into Pipeline's full per-phase breakdown below. */}
        <ProcessOverview />

        {/* The centerpiece — open a phase, pick a service, see the breakdown */}
        <Pipeline />

        <BehindTheScenes />

        <ProcessWalkthrough />

        <StatsBand stats={processStats} />

        <Guarantees />

        {/* How to actually start — a slim transitional bar, not a full
            section of buttonless contact cards. */}
        <NextStepBand />

        <FinalCTA />

        <Footer />
      </div>
    </main>
  )
}
