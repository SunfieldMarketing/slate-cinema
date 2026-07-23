'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  FileText,
  PhoneCall,
  FileCheck2,
  Clapperboard,
  Clock,
  Navigation,
  HelpCircle,
  ClipboardList,
  CalendarClock,
  CheckCircle2,
  Target,
  Clock3,
  Wallet,
  ChevronDown,
  ShieldCheck,
  Timer,
  MessageCircleMore,
  Sparkles,
  Users,
  BadgeCheck,
  Receipt,
  Repeat,
  type LucideIcon,
} from 'lucide-react'
import posthog from 'posthog-js'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { MagicCard } from '@/components/ui/magic-card'

gsap.registerPlugin(ScrollTrigger)

/* ── One continuous backdrop for the whole page flow — cinematic rather
   than mechanical: soft light-leak sweeps, an asymmetric chain of glows,
   scattered bokeh, and film-strip sprocket-hole edges instead of a hard
   engineering grid. Rendered once, absolutely positioned behind the
   whole Hero→Studio stack, so it reads as one woven surface. ───────── */
const bokehDots = [
  { top: '6%', left: '78%', size: 10, opacity: 0.22 },
  { top: '14%', left: '18%', size: 6, opacity: 0.18 },
  { top: '24%', left: '88%', size: 8, opacity: 0.2 },
  { top: '33%', left: '10%', size: 14, opacity: 0.15 },
  { top: '41%', left: '92%', size: 7, opacity: 0.2 },
  { top: '48%', left: '25%', size: 5, opacity: 0.22 },
  { top: '57%', left: '85%', size: 11, opacity: 0.16 },
  { top: '66%', left: '15%', size: 7, opacity: 0.2 },
  { top: '74%', left: '95%', size: 9, opacity: 0.17 },
  { top: '83%', left: '8%', size: 6, opacity: 0.22 },
  { top: '90%', left: '70%', size: 12, opacity: 0.14 },
]

/* Each glow is tuned to the section that actually sits at that scroll
   depth, so the wash of color shifts to match what's on screen —
   blue through the orientation sections, purple for the intake form,
   emerald for Ready to Talk, amber for direct contact, teal for the
   studio — while still overlapping enough (huge blur radii) that one
   never hard-cuts into the next. */
const glowChain = [
  { top: '3%', pos: 'left-[22%]', size: 42, color: '#00AEEF', opacity: 0.14 }, // Hero
  { top: '13%', pos: 'right-[10%]', size: 32, color: '#00AEEF', opacity: 0.12 }, // What Happens Next
  { top: '25%', pos: 'left-[4%]', size: 38, color: '#00AEEF', opacity: 0.13 }, // Stage Router
  { top: '36%', pos: 'right-[14%]', size: 34, color: '#00AEEF', opacity: 0.12 }, // Lead Form
  { top: '48%', pos: 'left-[8%]', size: 40, color: '#c084fc', opacity: 0.13 }, // Project Form
  { top: '65%', pos: 'right-[10%]', size: 40, color: '#34d399', opacity: 0.13 }, // Ready to Talk
  { top: '80%', pos: 'left-[16%]', size: 34, color: '#fbbf24', opacity: 0.1 }, // Contact Methods
  { top: '94%', pos: 'right-[8%]', size: 36, color: '#22d3ee', opacity: 0.12 }, // Studio
]

function PageBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Hero backdrop video — capped to exactly one viewport height so it
          never bleeds into the next section, and dissolves out over the
          last quarter of the hero so it still reads as a soft transition
          rather than a hard-edged rectangle by the time you hit the
          bottom. Sits underneath those layers so the color and texture
          stay fully visible over it, never washed out. */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 inset-x-0 h-screen w-full object-cover opacity-[0.18]"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0, black 75vh, transparent 100vh)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0, black 75vh, transparent 100vh)',
        }}
        src="/videos/performance.mp4"
      />
      {/* Extra darkening over just the hero, on top of the video but
          beneath the dot/glow/bokeh layers below. */}
      <div className="absolute top-0 inset-x-0 h-screen bg-black/25" />

      {/* faint dot texture — grain-like, not graph paper */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:34px_34px]" />

      {/* diagonal light-leak sweeps, angled like light hitting a lens —
          color-matched to the zone they cross so the sweep itself
          carries the blue → purple → emerald/teal story */}
      <div className="absolute -top-[8%] -left-[25%] w-[150%] h-[42%] bg-gradient-to-br from-[#00AEEF]/[0.09] via-transparent to-transparent -rotate-6 blur-[110px]" />
      <div className="absolute top-[38%] -right-[25%] w-[150%] h-[38%] bg-gradient-to-bl from-[#c084fc]/[0.08] via-transparent to-transparent rotate-6 blur-[110px]" />
      <div className="absolute top-[64%] -left-[20%] w-[140%] h-[38%] bg-gradient-to-tr from-[#34d399]/[0.07] via-transparent to-transparent -rotate-4 blur-[110px]" />
      <div className="absolute top-[86%] -right-[20%] w-[140%] h-[30%] bg-gradient-to-bl from-[#22d3ee]/[0.08] via-transparent to-transparent rotate-4 blur-[110px]" />

      {/* the color-matched glow chain */}
      {glowChain.map((g, i) => (
        <div
          key={i}
          className={`absolute ${g.pos} rounded-full blur-[150px]`}
          style={{ top: g.top, width: `${g.size}rem`, height: `${g.size}rem`, backgroundColor: g.color, opacity: g.opacity }}
        />
      ))}

      {/* scattered bokeh — soft out-of-focus points, a camera-glass motif */}
      {bokehDots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[5px]"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size, background: `rgba(127,224,255,${d.opacity})` }}
        />
      ))}

      {/* film-strip sprocket holes tracing both edges — the one motif no
          generic template has, and it says "cinema" instead of "SaaS" */}
      <div className="absolute left-3 md:left-6 top-0 bottom-0 w-[3px] opacity-[0.16] [background-image:radial-gradient(circle,rgba(255,255,255,0.95)_1.5px,transparent_1.5px)] [background-size:100%_28px]" />
      <div className="absolute right-3 md:right-6 top-0 bottom-0 w-[3px] opacity-[0.16] [background-image:radial-gradient(circle,rgba(255,255,255,0.95)_1.5px,transparent_1.5px)] [background-size:100%_28px]" />

      {/* vignette for depth — lighter than before so the page doesn't read dark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_45%,rgba(0,0,0,0.22)_100%)]" />

      {/* fade into the hero above and the footer below rather than cutting */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
    </div>
  )
}

/* ── Shared: trust badge — a small credibility pill ─────────────────── */
function TrustBadge({ icon: Icon, label, accent = '#00AEEF' }: { icon: LucideIcon; label: string; accent?: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.16] bg-white/[0.06] backdrop-blur-sm text-white/70 text-[11px] font-mono tracking-wide uppercase shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
      {label}
    </span>
  )
}

/* ── Stage router — the three intent tiers ─────────────────────────── */
const stages = [
  {
    icon: HelpCircle,
    step: '01',
    title: 'Not Sure Yet',
    desc: 'Not sure what you need? Leave your info and we’ll reach out.',
    cta: 'Send a Quick Note',
    href: '#lead-form',
    accent: '#00AEEF',
    accentClass: 'text-[#00AEEF]',
    borderClass: 'border-[#00AEEF]/40',
    glow: '0 0 20px rgba(0,174,239,0.2)',
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Know What You Need',
    desc: 'Have a project in mind? Walk us through the details and we’ll follow up with a plan.',
    cta: 'Start the Intake Form',
    href: '/contact/project',
    accent: '#c084fc',
    accentClass: 'text-purple-400',
    borderClass: 'border-purple-400/40',
    glow: '0 0 20px rgba(192,132,252,0.25)',
  },
  {
    icon: CalendarClock,
    step: '03',
    title: 'Ready to Talk',
    desc: 'Prefer to talk it through live? Grab a time on our calendar.',
    cta: 'Schedule a Call',
    href: '/schedule-a-call',
    accent: '#34d399',
    accentClass: 'text-emerald-400',
    borderClass: 'border-emerald-400/40',
    glow: '0 0 20px rgba(52,211,153,0.25)',
  },
]

function StageRouter() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sr-head', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
      gsap.fromTo('.sr-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.sr-grid', start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} id="get-started" className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sr-head text-center mb-10 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">{'// Get Started'}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">What stage are you at?</h2>
          <p className="mt-5 text-white/55 font-light text-sm sm:text-base">
            No wrong answer here, pick whichever fits where you&rsquo;re at now.
          </p>
        </div>

        <div className="sr-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {stages.map((s) => {
            return (
              <MagicCard
                key={s.step}
                className="sr-card rounded-3xl transition-transform duration-300 hover:-translate-y-1"
                gradientFrom={s.accent}
                gradientTo={s.accent}
                gradientColor={s.accent}
                gradientOpacity={0.2}
                gradientSize={240}
              >
                <div className="relative flex flex-col h-full p-8 sm:p-9 border-t-2 rounded-t-3xl overflow-hidden" style={{ borderColor: `${s.accent}55` }}>
                  <span className="absolute top-8 right-8 sm:top-9 sm:right-9 font-mono text-[10px] tracking-widest text-white/25">{s.step}</span>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`w-16 h-16 rounded-full border ${s.borderClass} bg-ink flex items-center justify-center`} style={{ boxShadow: s.glow }}>
                      <s.icon className={`w-7 h-7 ${s.accentClass}`} />
                    </div>
                    {/* Fixed-height slot so a two-line title (e.g. "Know What
                        You Need") doesn't push its card's description and
                        button lower than the single-line titles either side. */}
                    <div className="flex items-center justify-center min-h-[3.75rem] sm:min-h-[4.75rem] mt-5 mb-3">
                      <h3 className="text-white font-black text-2xl sm:text-3xl tracking-tight">{s.title}</h3>
                    </div>
                    <p className="text-white/55 text-sm font-light leading-relaxed mb-8 flex-1">{s.desc}</p>
                  </div>
                  {s.href.startsWith('#') ? (
                    <a
                      href={s.href}
                      onClick={() => posthog.capture('stage_router_clicked', { stage: s.title, destination: s.href })}
                      className="group inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-sm font-semibold text-black bg-white transition-colors duration-300"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = s.accent; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      {s.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      href={s.href}
                      onClick={() => posthog.capture('stage_router_clicked', { stage: s.title, destination: s.href })}
                      className="group inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-sm font-semibold text-black bg-white transition-colors duration-300"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = s.accent; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      {s.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </MagicCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Shared field styles ───────────────────────────────────────────── */
const fieldClass =
  'w-full bg-white/5 border border-white/15 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00AEEF] transition-colors'
const labelClass = 'block font-mono text-[10px] tracking-widest text-white/40 uppercase mb-2'

function SuccessNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#00AEEF]/30 bg-[#00AEEF]/10 p-6 sm:p-8">
      <CheckCircle2 className="w-6 h-6 text-[#00AEEF] shrink-0 mt-0.5" />
      <div>
        <div className="text-white font-bold text-lg mb-1">Thanks — we&rsquo;re on it.</div>
        <p className="text-white/60 text-sm font-light">{text}</p>
      </div>
    </div>
  )
}

/* ── Lead form — the ~10-second, low-friction option ───────────────── */
interface LeadFormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

function LeadForm() {
  const ref = useRef<HTMLElement>(null)
  const [data, setData] = useState<LeadFormData>({ name: '', email: '', phone: '', company: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.lf-inner', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  const set = (key: keyof LeadFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.name || !data.email || !data.phone) return
    posthog.capture('lead_form_submitted', { has_company: !!data.company })
    setSubmitted(true)
  }

  return (
    <section ref={ref} id="lead-form" className="relative w-full overflow-hidden py-12 md:py-14 scroll-mt-24">
      <div className="lf-inner relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8 md:mb-9">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-12 shrink-0 rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center shadow-[0_0_20px_rgba(0,174,239,0.2)]">
              <HelpCircle className="w-5 h-5 text-[#00AEEF]" />
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">{'// Not Sure Yet'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-5">Drop us a line</h2>
          <p className="text-white/55 font-light text-sm sm:text-base max-w-xl mx-auto mb-6">
            Not sure exactly what you need yet? Totally fine — most people aren&rsquo;t at first. Leave your info
            and a real person on our team will reach out with the right next step, no matter how vague the ask.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TrustBadge icon={Timer} label="~10 Seconds" />
            <TrustBadge icon={ShieldCheck} label="No Spam, Ever" />
            <TrustBadge icon={Mail} label="Reply Within 1 Business Day" />
          </div>
        </div>

        <div className="relative rounded-3xl border border-white/[0.14] bg-white/[0.05] backdrop-blur-md p-8 sm:p-10 max-w-2xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00AEEF] to-transparent" />
          {submitted ? (
            <SuccessNote text="We’ll be in touch within one business day." />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="lead-name">Name *</label>
                  <input id="lead-name" required type="text" value={data.name} onChange={set('name')} placeholder="Jane Doe" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="lead-company">Company</label>
                  <input id="lead-company" type="text" value={data.company} onChange={set('company')} placeholder="Optional" className={fieldClass} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="lead-email">Email *</label>
                  <input id="lead-email" required type="email" value={data.email} onChange={set('email')} placeholder="jane@company.com" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="lead-phone">Phone *</label>
                  <input id="lead-phone" required type="tel" value={data.phone} onChange={set('phone')} placeholder="(555) 000-0000" className={fieldClass} />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="lead-message">Message</label>
                <input id="lead-message" type="text" value={data.message} onChange={set('message')} placeholder="One line on what you have in mind (optional)" className={fieldClass} />
              </div>
              <button
                type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-2.5 self-start px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300"
              >
                Send Message
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Divider — a real beat between stages, not a hairline squeeze ──── */
function StageDivider() {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sd-line', { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'top', scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } })
      gsap.fromTo('.sd-dot', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <div ref={ref} className="relative w-full flex items-center justify-center py-6 md:py-9">
      <div className="sd-line w-px h-10 md:h-14 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      <div className="sd-dot absolute w-9 h-9 rounded-full border border-white/15 bg-ink flex items-center justify-center shadow-[0_0_20px_rgba(0,174,239,0.12)]">
        <ChevronDown className="w-4 h-4 text-white/40" />
      </div>
    </div>
  )
}

/* ── Ready to Talk — the high-intent, "just book it" option ────────── */
const prepItems = [
  { icon: Target, label: 'Your goals', desc: 'What the video needs to do for your business.' },
  { icon: Clock3, label: 'Your timeline', desc: 'When you need it shot, edited, and live.' },
  { icon: Wallet, label: 'A budget ballpark', desc: 'Rough range is fine — it keeps the call efficient.' },
  { icon: Sparkles, label: 'Any references', desc: 'Links or examples you like are a bonus, not required.' },
]

function ReadyToTalk() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rt-inner', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} id="ready-to-talk" className="relative w-full overflow-hidden py-12 md:py-14 scroll-mt-24">
      <div className="rt-inner relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8 md:mb-9">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-12 shrink-0 rounded-full border border-emerald-400/40 bg-ink flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <CalendarClock className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-emerald-400 uppercase">{'// Ready to Talk'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-5">Book a time on our calendar</h2>
          <p className="text-white/55 font-light text-sm sm:text-base max-w-xl mx-auto mb-6">
            Prefer to talk it through live? Grab a 20-minute slot with our team — no pitch deck, no sales script,
            just an honest read on scope, timeline, and budget so you know exactly where you stand.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TrustBadge icon={Clock3} label="20-Minute Call" accent="#34d399" />
            <TrustBadge icon={Users} label="Talk to a Real Producer" accent="#34d399" />
            <TrustBadge icon={ShieldCheck} label="No Pitch Deck" accent="#34d399" />
          </div>
        </div>

        <div className="relative rounded-3xl border border-emerald-400/20 bg-white/[0.05] backdrop-blur-md p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
            {prepItems.map((p) => (
              <div key={p.label} className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-5">
                <div className="w-9 h-9 rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-3.5 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                  <p.icon className="w-4 h-4 text-[#00AEEF]" />
                </div>
                <div className="text-white font-bold text-sm mb-1">{p.label}</div>
                <p className="text-white/50 text-xs font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/schedule-a-call"
              onClick={() => posthog.capture('ready_to_talk_clicked', { source: 'contact_page' })}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300"
            >
              Schedule a Call
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-white/40 text-xs font-light">No commitment — reschedule or cancel anytime.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── What happens next — response steps ────────────────────────────── */
const nextSteps = [
  { icon: FileText, step: '01', title: 'Share Your Scope', desc: 'Fill out a form above or reach out directly with your goals and timeline.' },
  { icon: PhoneCall, step: '02', title: 'Discovery Call', desc: 'We hop on a call within one business day to align on vision and budget.' },
  { icon: FileCheck2, step: '03', title: 'Custom Proposal', desc: 'You get a fixed-price execution plan tailored to your campaign.' },
  { icon: Clapperboard, step: '04', title: 'We Roll Camera', desc: 'Approve and we move straight into pre-production. Lights, camera, launch.' },
]

function WhatHappensNext() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.whn-head', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
      gsap.fromTo('.whn-step', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.whn-grid', start: 'top 85%', once: true } })
      gsap.fromTo('.whn-line', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', transformOrigin: 'left', scrollTrigger: { trigger: '.whn-grid', start: 'top 80%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden mt-6 md:mt-12 pt-28 md:pt-40 pb-16 md:pb-20">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="whn-head text-center mb-12 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">{'// After You Reach Out'}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">What happens next</h2>
          <p className="mt-5 text-white/55 font-light text-sm sm:text-base">
            From hello until final delivery, here&rsquo;s the road map laid out.
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.15em] text-[#00AEEF] uppercase">
            Fill out a form below
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <TrustBadge icon={Receipt} label="Fixed-Price Proposals" />
            <TrustBadge icon={Repeat} label="Revision Rounds Included" />
            <TrustBadge icon={BadgeCheck} label="One Team End-to-End" />
          </div>
        </div>
        <div className="whn-grid relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* connecting line on desktop */}
          <div className="whn-line hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#00AEEF]/50 via-white/20 to-[#00AEEF]/50" />
          {nextSteps.map((s) => (
            <div key={s.step} className="whn-step relative text-center">
              <div className="relative z-10 w-14 h-14 mx-auto rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                <s.icon className="w-6 h-6 text-[#00AEEF]" />
              </div>
              <div className="font-mono text-[10px] tracking-widest text-white/30 mb-2">{s.step}</div>
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Studio / location ─────────────────────────────────────────────── */
function StudioLocation() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sl-inner', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sl-inner grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Real studio location */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[320px] group">
            <iframe
              title="Slate Cinema Studio location"
              src="https://www.google.com/maps?q=132+32nd+St,+Brooklyn,+NY+11232&output=embed"
              className="absolute inset-0 w-full h-full grayscale-[0.3] opacity-90"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[11px] tracking-widest text-white/80 uppercase pointer-events-none [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
              <Navigation className="w-4 h-4 text-[#22d3ee]" /> 132 32nd St, Brooklyn, NY 11232
            </div>
          </div>

          {/* Studio details */}
          <div className="relative flex flex-col justify-center rounded-3xl border border-white/[0.14] bg-white/[0.05] backdrop-blur-md p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#22d3ee] uppercase mb-4">{'// The Studio'}</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-5">Based in Brooklyn,<br />shooting everywhere.</h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <TrustBadge icon={Navigation} label="On-Location Nationwide" accent="#22d3ee" />
              <TrustBadge icon={Clock} label="Mon–Fri, 9am–7pm ET" accent="#22d3ee" />
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#22d3ee] mt-0.5 shrink-0" />
                <div><div className="text-white font-medium text-sm">Slate Cinema Studio</div><div className="text-white/50 text-sm">Brooklyn, New York</div></div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#22d3ee] mt-0.5 shrink-0" />
                <div><div className="text-white font-medium text-sm">Studio Hours</div><div className="text-white/50 text-sm">Mon–Fri · 9am – 7pm ET · On-location by appointment</div></div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#22d3ee] mt-0.5 shrink-0" />
                <a href="mailto:info@slatecinema.com" className="text-white/70 text-sm hover:text-[#22d3ee] transition-colors">info@slatecinema.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const contactCards = [
  { icon: Mail, label: 'Email', value: 'info@slatecinema.com', href: 'mailto:info@slatecinema.com' },
  { icon: Phone, label: 'Phone', value: '+1 732 930 1934', href: 'tel:+17329301934' },
  { icon: MapPin, label: 'Studio', value: 'Brooklyn, NY', href: '#' },
]

function ContactMethods() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cm-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-14 md:py-16">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
        <div className="cm-head text-center mb-10 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#fbbf24] uppercase mb-4">
            <span className="w-8 h-px bg-[#fbbf24]/40" /> Or Reach Us Directly <span className="w-8 h-px bg-[#fbbf24]/40" />
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-[1.1] mb-4">Real Humans. Real Work.</h2>
          <p className="text-white/55 font-light text-sm sm:text-base max-w-lg mx-auto">
            No forms, no queue — email, call, or stop by the studio directly. Whatever&rsquo;s easiest for you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <TrustBadge icon={MessageCircleMore} label="We Reply Fast" accent="#fbbf24" />
            <TrustBadge icon={Users} label="No Bots, Ever" accent="#fbbf24" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {contactCards.map((c) => (
          <MagicCard
            key={c.label}
            className="cm-card rounded-2xl transition-transform duration-300 hover:-translate-y-0.5"
            gradientFrom="#fbbf24"
            gradientTo="#f59e0b"
            gradientColor="#fbbf24"
            gradientOpacity={0.15}
            gradientSize={180}
          >
            <a href={c.href} onClick={() => posthog.capture('contact_method_clicked', { method: c.label })} className="group flex items-center gap-4 p-5">
              <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center group-hover:border-[#fbbf24]/50 group-hover:bg-[#fbbf24]/10 transition-colors shrink-0">
                <c.icon className="w-5 h-5 text-white/80 group-hover:text-[#fbbf24] transition-colors" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase mb-0.5">{c.label}</div>
                <div className="text-white font-medium text-sm truncate">{c.value}</div>
              </div>
            </a>
          </MagicCard>
        ))}
        </div>
      </div>
    </section>
  )
}

export default function ContactPageContent() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent="#00AEEF" />

      <div className="relative z-10 w-full">
        <Nav />

        <div className="relative">
          <PageBackdrop />

          <PageHero
            eyebrow="Get Started"
            title={['Let’s get', 'you started']}
            subtitle="Tell us where you’re at and we’ll point you to the right next step. We reply within one business day."
            accent="#00AEEF"
          />

          <WhatHappensNext />

          <StageRouter />
          <StageDivider />
          <LeadForm />
          <StageDivider />
          <ReadyToTalk />

          <ContactMethods />

          <StudioLocation />
        </div>

        <Footer />
      </div>
    </main>
  )
}
