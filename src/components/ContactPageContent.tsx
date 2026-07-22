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
} from 'lucide-react'
import posthog from 'posthog-js'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { MagicCard } from '@/components/ui/magic-card'
import { industries } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

/* ── Stage router — the three intent tiers ─────────────────────────── */
const stages = [
  {
    icon: HelpCircle,
    step: '01',
    title: 'Not Sure Yet',
    desc: 'Not sure what you need? Leave your info and we’ll reach out.',
    cta: 'Send a Quick Note',
    href: '#lead-form',
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Know What You Need',
    desc: 'Have a project in mind? Walk us through the details and we’ll follow up with a plan.',
    cta: 'Start the Intake Form',
    href: '#project-form',
  },
  {
    icon: CalendarClock,
    step: '03',
    title: 'Ready to Talk',
    desc: 'Prefer to talk it through live? Grab a time on our calendar.',
    cta: 'Schedule a Call',
    href: '/schedule-a-call',
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
    <section ref={ref} id="get-started" className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sr-head text-center mb-14 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">{'// Get Started'}</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">What stage are you at?</h2>
          <p className="mt-5 text-white/55 font-light text-base sm:text-lg">Pick the option that fits and we&rsquo;ll route you to the right next step.</p>
        </div>

        <div className="sr-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {stages.map((s) => {
            return (
              <MagicCard
                key={s.step}
                className="sr-card rounded-3xl transition-transform duration-300 hover:-translate-y-1"
                gradientFrom="#00AEEF"
                gradientTo="#0369A1"
                gradientColor="#00AEEF"
                gradientOpacity={0.15}
                gradientSize={220}
              >
                <div className="flex flex-col h-full p-8 sm:p-9">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                      <s.icon className="w-5 h-5 text-[#00AEEF]" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-white/25">{s.step}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{s.title}</h3>
                  <p className="text-white/55 text-sm font-light leading-relaxed mb-8 flex-1">{s.desc}</p>
                  {s.href.startsWith('#') ? (
                    <a
                      href={s.href}
                      onClick={() => posthog.capture('stage_router_clicked', { stage: s.title, destination: s.href })}
                      className="group inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300"
                    >
                      {s.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      href={s.href}
                      onClick={() => posthog.capture('stage_router_clicked', { stage: s.title, destination: s.href })}
                      className="group inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300"
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
    <section ref={ref} id="lead-form" className="relative w-full overflow-hidden py-12 md:py-16 scroll-mt-24">
      <div className="lf-inner relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 sm:p-10">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">{'// Not Sure Yet'}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-3">Drop us a line</h2>
          <p className="text-white/55 font-light mb-8 max-w-lg">Not sure what you need? Leave your info and we&rsquo;ll reach out. Takes about ten seconds.</p>

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

/* ── Project intake form — the "know what you want" option ─────────── */
const projectTypes = ['Brand Film', 'Commercial', 'Social Content Series', 'Event Coverage', 'Documentary', 'Animation / Motion', 'Music Video', 'Full Campaign', 'Not sure yet']
const timelineOptions = ['ASAP', 'Within 1 month', '1–3 months', '3–6 months', 'Flexible / no rush']
const budgetOptions = ['Under $5k', '$5k–$15k', '$15k–$50k', '$50k+', 'Not sure yet']

interface ProjectFormData {
  name: string
  company: string
  email: string
  phone: string
  projectType: string
  industry: string
  goals: string
  deliverables: string
  timeline: string
  budget: string
  notes: string
}

const emptyProjectForm: ProjectFormData = {
  name: '', company: '', email: '', phone: '', projectType: '', industry: '', goals: '', deliverables: '', timeline: '', budget: '', notes: '',
}

function ProjectForm() {
  const ref = useRef<HTMLElement>(null)
  const [data, setData] = useState<ProjectFormData>(emptyProjectForm)
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pf-inner', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  const set = (key: keyof ProjectFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const required: (keyof ProjectFormData)[] = ['name', 'company', 'email', 'phone', 'projectType', 'industry', 'goals', 'timeline', 'budget']
    if (required.some((k) => !data[k])) return
    posthog.capture('project_form_submitted', { projectType: data.projectType, industry: data.industry, budget: data.budget })
    setSubmitted(true)
  }

  return (
    <section ref={ref} id="project-form" className="relative w-full overflow-hidden py-12 md:py-16 scroll-mt-24">
      <div className="pf-inner relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 sm:p-10">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">{'// Know What You Need'}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-3">Tell us about the project</h2>
          <p className="text-white/55 font-light mb-8 max-w-lg">The more detail you give us, the sharper our first proposal will be.</p>

          {submitted ? (
            <SuccessNote text="We’ll review your details and be in touch within one business day with next steps." />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="proj-name">Name *</label>
                  <input id="proj-name" required type="text" value={data.name} onChange={set('name')} placeholder="Jane Doe" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="proj-company">Company *</label>
                  <input id="proj-company" required type="text" value={data.company} onChange={set('company')} placeholder="Company name" className={fieldClass} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="proj-email">Email *</label>
                  <input id="proj-email" required type="email" value={data.email} onChange={set('email')} placeholder="jane@company.com" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="proj-phone">Phone *</label>
                  <input id="proj-phone" required type="tel" value={data.phone} onChange={set('phone')} placeholder="(555) 000-0000" className={fieldClass} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="proj-type">Project Type *</label>
                  <select id="proj-type" required value={data.projectType} onChange={set('projectType')} className={fieldClass}>
                    <option value="" disabled className="bg-ink">Select a project type</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t} className="bg-ink">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="proj-industry">Industry *</label>
                  <select id="proj-industry" required value={data.industry} onChange={set('industry')} className={fieldClass}>
                    <option value="" disabled className="bg-ink">Select your industry</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.label} className="bg-ink">{ind.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="proj-goals">Goals *</label>
                <textarea id="proj-goals" required rows={3} value={data.goals} onChange={set('goals')} placeholder="What are you trying to achieve with this video?" className={`${fieldClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass} htmlFor="proj-deliverables">Deliverables / Platforms Needed</label>
                <input id="proj-deliverables" type="text" value={data.deliverables} onChange={set('deliverables')} placeholder="e.g. 1 hero video, 6 social cutdowns, YouTube + Instagram" className={fieldClass} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="proj-timeline">Timeline *</label>
                  <select id="proj-timeline" required value={data.timeline} onChange={set('timeline')} className={fieldClass}>
                    <option value="" disabled className="bg-ink">Select a timeline</option>
                    {timelineOptions.map((t) => (
                      <option key={t} value={t} className="bg-ink">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="proj-budget">Budget Range *</label>
                  <select id="proj-budget" required value={data.budget} onChange={set('budget')} className={fieldClass}>
                    <option value="" disabled className="bg-ink">Select a budget range</option>
                    {budgetOptions.map((b) => (
                      <option key={b} value={b} className="bg-ink">{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="proj-notes">Anything Else</label>
                <textarea id="proj-notes" rows={3} value={data.notes} onChange={set('notes')} placeholder="References, inspiration, constraints — anything that helps (optional)" className={`${fieldClass} resize-none`} />
              </div>
              <button
                type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-2.5 self-start px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300"
              >
                Send Project Details
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
    <div ref={ref} className="relative w-full flex items-center justify-center py-10 md:py-16">
      <div className="sd-line w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
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
    <section ref={ref} id="ready-to-talk" className="relative w-full overflow-hidden py-12 md:py-16 scroll-mt-24">
      <div className="rt-inner relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 sm:p-10">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">{'// Ready to Talk'}</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-3">Book a time on our calendar</h2>
          <p className="text-white/55 font-light mb-8 max-w-lg">
            Prefer to talk it through live? Grab a 20-minute slot — no pitch deck, just an honest read on scope,
            timeline, and budget.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
            {prepItems.map((p) => (
              <div key={p.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="w-9 h-9 rounded-full border border-[#00AEEF]/40 bg-ink flex items-center justify-center mb-3.5 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                  <p.icon className="w-4 h-4 text-[#00AEEF]" />
                </div>
                <div className="text-white font-bold text-sm mb-1">{p.label}</div>
                <p className="text-white/50 text-xs font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/schedule-a-call"
            onClick={() => posthog.capture('ready_to_talk_clicked', { source: 'contact_page' })}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#00AEEF] hover:text-white transition-colors duration-300"
          >
            Schedule a Call
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
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
    <section ref={ref} className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="whn-head text-center mb-14 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">{'// After You Reach Out'}</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">What happens next</h2>
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
    <section ref={ref} className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sl-inner grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Stylized map / studio visual */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[320px] group">
            <img src="/images/contact_bg_bright.png" alt="Brooklyn, NY" className="absolute inset-0 w-full h-full object-cover opacity-45 transition-transform duration-[1400ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            {/* map grid overlay */}
            <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(0,174,239,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(0,174,239,0.6)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-[#00AEEF] shadow-[0_0_20px_#00AEEF] animate-pulse" />
              <div className="absolute inset-0 -m-4 rounded-full border border-[#00AEEF]/40 animate-ping" />
            </div>
            <div className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[11px] tracking-widest text-white/80 uppercase">
              <Navigation className="w-4 h-4 text-[#00AEEF]" /> 40.6782° N, 73.9442° W
            </div>
          </div>

          {/* Studio details */}
          <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 sm:p-10">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-4">{'// The Studio'}</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-6">Based in Brooklyn,<br />shooting everywhere.</h2>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#00AEEF] mt-0.5 shrink-0" />
                <div><div className="text-white font-medium text-sm">Slate Cinema Studio</div><div className="text-white/50 text-sm">Brooklyn, New York</div></div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#00AEEF] mt-0.5 shrink-0" />
                <div><div className="text-white font-medium text-sm">Studio Hours</div><div className="text-white/50 text-sm">Mon–Fri · 9am – 7pm ET · On-location by appointment</div></div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#00AEEF] mt-0.5 shrink-0" />
                <a href="mailto:info@slatecinema.com" className="text-white/70 text-sm hover:text-[#00AEEF] transition-colors">info@slatecinema.com</a>
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
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {contactCards.map((c) => (
          <MagicCard
            key={c.label}
            className="cm-card rounded-2xl transition-transform duration-300 hover:-translate-y-0.5"
            gradientFrom="#00AEEF"
            gradientTo="#0369A1"
            gradientColor="#00AEEF"
            gradientOpacity={0.15}
            gradientSize={180}
          >
            <a href={c.href} onClick={() => posthog.capture('contact_method_clicked', { method: c.label })} className="group flex items-center gap-4 p-5">
              <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center group-hover:border-[#00AEEF]/50 group-hover:bg-[#00AEEF]/10 transition-colors shrink-0">
                <c.icon className="w-5 h-5 text-white/80 group-hover:text-[#00AEEF] transition-colors" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase mb-0.5">{c.label}</div>
                <div className="text-white font-medium text-sm truncate">{c.value}</div>
              </div>
            </a>
          </MagicCard>
        ))}
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
        <PageHero
          eyebrow="Get Started"
          title={['Let’s get', 'you started']}
          subtitle="Tell us where you’re at and we’ll point you to the right next step. We reply within one business day."
          accent="#00AEEF"
        />

        <StageRouter />
        <StageDivider />
        <LeadForm />
        <StageDivider />
        <ProjectForm />
        <StageDivider />
        <ReadyToTalk />

        <WhatHappensNext />

        <ContactMethods />

        <StudioLocation />

        <Footer />
      </div>
    </main>
  )
}
