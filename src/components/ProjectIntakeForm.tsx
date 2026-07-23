'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, CheckCircle2, ClipboardList, ListChecks, Receipt, ShieldCheck, type LucideIcon } from 'lucide-react'
import posthog from 'posthog-js'
import { industries } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

function TrustBadge({ icon: Icon, label, accent = '#c084fc' }: { icon: LucideIcon; label: string; accent?: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.16] bg-white/[0.06] backdrop-blur-sm text-white/70 text-[11px] font-mono tracking-wide uppercase shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
      {label}
    </span>
  )
}

function SuccessNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-purple-400/30 bg-purple-400/10 p-6 sm:p-8">
      <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
      <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed">{text}</p>
    </div>
  )
}

const fieldClass =
  'w-full bg-white/5 border border-white/15 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors'
const labelClass = 'block font-mono text-[10px] tracking-widest text-white/40 uppercase mb-2'

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

/*
  Project intake — the "know what you want" option, pulled out to its own
  page (was previously an anchor-scroll section on /contact) so it reads
  as a real destination rather than something buried mid-page.
*/
export default function ProjectIntakeForm() {
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
    <section ref={ref} id="project-form" className="relative w-full overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20 scroll-mt-24">
      <div className="pf-inner relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8 md:mb-9">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-12 shrink-0 rounded-full border border-purple-400/40 bg-ink flex items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.25)]">
              <ClipboardList className="w-5 h-5 text-purple-400" />
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-purple-400 uppercase">{'// Know What You Need'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-5">Tell us about the project</h1>
          <p className="text-white/55 font-light text-sm sm:text-base max-w-xl mx-auto mb-6">
            Already know roughly what you want? The more detail you give us here, the sharper and more accurate
            our first proposal will be — no back-and-forth just to scope the basics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TrustBadge icon={ListChecks} label="9 Quick Fields" />
            <TrustBadge icon={Receipt} label="Fixed-Price Proposal" />
            <TrustBadge icon={ShieldCheck} label="Kept Confidential" />
          </div>
        </div>

        <div className="relative rounded-3xl border border-white/[0.14] bg-white/[0.05] backdrop-blur-md p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
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
                className="group mt-2 inline-flex items-center justify-center gap-2.5 self-start px-8 py-4 rounded-full text-sm font-semibold text-black bg-white hover:bg-purple-400 hover:text-white transition-colors duration-300"
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
