'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Mail, Phone, MessageSquare, Globe, Clock, ShieldCheck, RefreshCw, Handshake } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'
import Pipeline from '@/components/Pipeline'
import BehindTheScenes from '@/components/BehindTheScenes'
import StoryboardHero from '@/components/StoryboardHero'
import StatsBand from '@/components/ui/StatsBand'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { MagicCard } from '@/components/ui/magic-card'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'

gsap.registerPlugin(ScrollTrigger)

const processStats = [
  { value: 24, suffix: 'hr', label: 'Avg. Response Time' },
  { value: 3, suffix: 'wk', label: 'Avg. Turnaround' },
  { value: 98, suffix: '%', label: 'Client Retention' },
  { value: 50, suffix: '+', label: 'Brands Served' },
]

/* ── Ways to reach the team — a plain card grid, same language as every
   other card grid on the site ─────────────────────────────────────── */
const methods = [
  { icon: Mail, title: 'Email', desc: 'Send your project details and references to our team.', meta: 'info@slatecinema.com' },
  { icon: Phone, title: 'Phone', desc: 'Talk through your project directly with a producer.', meta: '+1 732 930 1934' },
  { icon: MessageSquare, title: 'Text', desc: 'Start a quick conversation on your schedule.', meta: 'Fast replies' },
  { icon: Globe, title: 'Website', desc: 'Submit your project online through our scope form.', meta: 'Scope form' },
]

function SubmissionMethods() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sm-head', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
      gsap.fromTo('.sm-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.sm-grid', start: 'top 88%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sm-head text-center mb-14 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase block mb-4">Get In Touch</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-5">
            Submit Your Project
          </h2>
          <p className="text-white/55 text-sm sm:text-base font-light leading-relaxed">
            Every production starts with a clear point of contact. Reach out by email, phone, text, or through our website — we&apos;ll gather your goals, timeline, and scope.
          </p>
        </div>

        <div className="sm-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methods.map((m) => (
            <MagicCard
              key={m.title}
              className="sm-card rounded-2xl transition-transform duration-500 hover:-translate-y-1"
              gradientFrom="#00AEEF"
              gradientTo="#0369A1"
              gradientColor="#00AEEF"
              gradientOpacity={0.15}
              gradientSize={180}
            >
              <div className="relative z-10 flex flex-col items-center p-6 text-center">
                <div className="w-14 h-14 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center mb-5 group-hover:border-brand-blue/50 group-hover:bg-brand-blue/10 transition-colors duration-500">
                  <m.icon className="w-6 h-6 text-white/80 group-hover:text-brand-blue transition-colors" />
                </div>
                <h3 className="font-semibold text-sm text-white mb-2">{m.title}</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed mb-4">{m.desc}</p>
                <span className="font-mono text-[11px] tracking-wide text-brand-blue/80">{m.meta}</span>
              </div>
            </MagicCard>
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
          <p className="text-white/55 text-sm sm:text-base font-light">A complete production — not just raw footage. Scroll through to see what's actually happening at each stage.</p>
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
          cta={{ label: 'Start Your Project', href: '/contact' }}
        />

        {/* The centerpiece — open a phase, pick a service, see the breakdown */}
        <Pipeline />

        <BehindTheScenes />

        <ProcessWalkthrough />

        <StatsBand stats={processStats} />

        <Guarantees />

        {/* How to actually start — belongs right before the ask, not before
            we've even explained what we do. */}
        <SubmissionMethods />

        <FinalCTA />

        <Footer />
      </div>
    </main>
  )
}
