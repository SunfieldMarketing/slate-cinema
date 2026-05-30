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
  const [currentStep, setCurrentStep] = useState<StepId>('service')
  const [selections, setSelections] = useState<Record<string, string>>({})

  const stepIndex = allSteps.indexOf(currentStep)

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

  const selectOption = (option: string) => {
    setSelections(prev => ({ ...prev, [currentStep]: option }))

    // 3D flip transition
    gsap.to('.step-content', {
      rotateY: -90, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        const next = allSteps[stepIndex + 1]
        if (next) setCurrentStep(next)
        gsap.fromTo('.step-content',
          { rotateY: 90, opacity: 0 },
          { rotateY: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' }
        )
      }
    })
  }

  const goBack = () => {
    if (stepIndex > 0) {
      gsap.to('.step-content', {
        rotateY: 90, opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
          setCurrentStep(allSteps[stepIndex - 1])
          gsap.fromTo('.step-content',
            { rotateY: -90, opacity: 0 },
            { rotateY: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' }
          )
        }
      })
    }
  }

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#030305] overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* Background clapperboard stripe pattern */}
      <div className="clap-pattern absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.015] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={i * 12.5} y="0" width="6.25" height="100" fill={i % 2 === 0 ? '#fff' : '#000'} />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Project Discovery</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Build Your Scope</h2>
          <p className="text-sm text-white/30">Answer a few quick questions. We&apos;ll prepare a custom execution plan.</p>
        </div>

        {/* The form card */}
        <div className="lm-form rounded-2xl overflow-hidden relative" style={{
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}>
          {/* Top bar - like an editing panel header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="font-mono text-[10px] text-white/30 tracking-widest">PROJECT_SCOPE.FORM</span>
            </div>
            <span className="font-mono text-[10px] text-white/20">{stepIndex + 1} / {allSteps.length}</span>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] bg-white/[0.04] relative">
            <div className="absolute top-0 left-0 h-full bg-[#00AEEF] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,174,239,0.4)]" style={{ width: `${((stepIndex + 1) / allSteps.length) * 100}%` }} />
          </div>

          <div className="p-8 md:p-10">
            {/* Step indicators */}
            <div className="flex gap-4 mb-8">
              {allSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                    i <= stepIndex ? 'bg-[#00AEEF]/20 text-[#00AEEF] border border-[#00AEEF]/30' : 'bg-white/5 text-white/20 border border-white/10'
                  }`}>
                    {i < stepIndex ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
                  </div>
                  {i < allSteps.length - 1 && <div className={`w-8 h-[1px] transition-colors duration-300 ${i < stepIndex ? 'bg-[#00AEEF]/30' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="step-content min-h-[280px]" style={{ transformStyle: 'preserve-3d' }}>
              <h3 className="text-2xl font-bold text-white mb-6">{stepConfig[currentStep].title}</h3>

              {currentStep === 'contact' ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3.5 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00AEEF]/50 transition-colors" />
                    <input type="text" placeholder="Last Name" className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3.5 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00AEEF]/50 transition-colors" />
                  </div>
                  <input type="email" placeholder="Email" className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3.5 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00AEEF]/50 transition-colors" />
                  <input type="text" placeholder="Company / Brand" className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3.5 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00AEEF]/50 transition-colors" />
                  <textarea placeholder="Tell us about your project..." rows={3} className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3.5 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00AEEF]/50 transition-colors resize-none" />
                  <button className="mt-2 w-full bg-[#00AEEF] text-white font-bold py-4 rounded-lg hover:bg-[#00AEEF]/80 transition-all duration-300 shadow-[0_0_30px_rgba(0,174,239,0.2)] hover:shadow-[0_0_40px_rgba(0,174,239,0.4)] text-sm tracking-wider uppercase">
                    Get Custom Proposal →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {stepConfig[currentStep].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => selectOption(option)}
                      className="group w-full text-left px-5 py-4 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-between"
                    >
                      <span className="text-sm text-white/60 group-hover:text-white transition-colors font-medium">{option}</span>
                      <svg className="w-4 h-4 text-white/10 group-hover:text-[#00AEEF] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Back button */}
            {stepIndex > 0 && (
              <button onClick={goBack} className="mt-6 text-xs font-mono text-white/20 hover:text-white/50 transition-colors tracking-widest uppercase flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
