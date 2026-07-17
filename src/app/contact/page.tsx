'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Mail, Phone, MapPin, ArrowRight, FileText, PhoneCall, FileCheck2, Clapperboard, Clock, Navigation } from 'lucide-react'
import posthog from 'posthog-js'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CustomCalendar from '@/components/CustomCalendar'
import PageHero from '@/components/ui/PageHero'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import { MagicCard } from '@/components/ui/magic-card'

gsap.registerPlugin(ScrollTrigger)

/* ── What happens next — response steps ────────────────────────────── */
const nextSteps = [
  { icon: FileText, step: '01', title: 'Share Your Scope', desc: 'Fill the scope form or reach out directly with your goals and timeline.' },
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
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase block mb-4">// After You Reach Out</span>
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
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-4">// The Studio</span>
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
    <section ref={ref} className="relative w-full overflow-hidden py-16">
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

function DontBeAStranger() {
  const ref = useRef<HTMLElement>(null)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dbs-inner', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-28 md:py-36">
      {/* Swirl video/gradient backdrop */}
      <div className="absolute inset-0 z-0">
        <video src="/videos/hero.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-[#0a1428]/60 to-ink/90" />
      </div>
      <div className="dbs-inner relative z-10 max-w-2xl mx-auto px-6 text-center">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.35em] text-[#00AEEF] uppercase block mb-5">// Stay In The Loop</span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.05]">
          Don&apos;t Be A Stranger!
        </h2>
        <p className="text-white/60 font-light mb-10 max-w-lg mx-auto">
          Behind-the-scenes cuts, new work, and the occasional production secret — straight to your inbox.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (email) {
              setSent(true)
              posthog.capture('newsletter_signed_up', { source: 'contact_page' })
            }
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-white/5 border border-white/15 rounded-full px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00AEEF] transition-colors"
          />
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 bg-[#00AEEF] text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-colors whitespace-nowrap"
          >
            {sent ? 'Subscribed ✓' : 'Sign Up'}
            {!sent && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent="#00AEEF" />

      <div className="relative z-10 w-full">
        <Nav />
        <PageHero
          eyebrow="Get In Touch"
          title={['Let’s make', 'something great']}
          subtitle="Ready to schedule a call? Pick a time that works, or reach us directly. We reply within one business day."
          accent="#00AEEF"
        />

        <ContactMethods />

        <WhatHappensNext />

        {/* Scheduler — reuse the cinematic CustomCalendar */}
        <CustomCalendar />

        <StudioLocation />

        <DontBeAStranger />
        <Footer />
      </div>
    </main>
  )
}
