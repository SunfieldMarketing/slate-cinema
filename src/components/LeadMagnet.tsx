'use client'

import { useState, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type StepId = 'service' | 'scope' | 'budget' | 'contact'

const stepConfig = {
  service: {
    title: 'What do you need?',
    options: ['Full Campaign', 'Brand Video', 'Social Content', 'Event Coverage', 'Post-Production Only'],
  },
  scope: {
    title: 'Project scope?',
    options: ['Single Video', 'Content Series (3-5)', 'Full Campaign (10+)', 'Ongoing Retainer'],
  },
  budget: {
    title: 'Investment range?',
    options: ['$5K — $10K', '$10K — $25K', '$25K — $50K', '$50K+'],
  },
  contact: {
    title: 'Your details',
    options: [],
  },
}

const allSteps: StepId[] = ['service', 'scope', 'budget', 'contact']

export default function LeadMagnet() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Form entrance from below
      gsap.fromTo('.lm-form',
        { y: 200, rotateX: 30, opacity: 0 },
        {
          y: 0, rotateX: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 70%', end: 'top 30%', scrub: 1 }
        }
      )

      // Background clapperboard pattern
      gsap.to('.clap-pattern', {
        rotation: 360,
        ease: 'none',
        duration: 120,
        repeat: -1,
      })
    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full py-32 overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* Background clapperboard stripe pattern */}
      <div className="clap-pattern absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.015] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={i * 12.5} y="0" width="6.25" height="100" fill={i % 2 === 0 ? '#fff' : '#000'} />
          ))}
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Project Discovery</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Project Brief</h2>
          <p className="text-sm text-white/30">Answer a few quick questions. We&apos;ll prepare a custom execution plan.</p>
        </div>

        {/* The form card */}
        <div className="lm-form rounded-2xl overflow-hidden relative w-full h-[800px]" style={{
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}>
          <iframe 
            src="/Slate Cinema Intake.html" 
            className="w-full h-full border-none outline-none"
            title="Slate Cinema Project Intake Form"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </section>
  )
}
