'use client'

import { useState, useRef } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type StepId = 'service' | 'scope' | 'budget' | 'contact'

export default function LeadMagnet() {
  const containerRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState<StepId>('service')

  const steps = [
    { id: 'service', label: 'Service' },
    { id: 'scope', label: 'Scope' },
    { id: 'budget', label: 'Budget' },
    { id: 'contact', label: 'Contact' },
  ]

  const options = {
    service: ['Pre-Production', 'Production', 'Post-Production', 'Distribution', 'Full Campaign'],
    scope: ['Single Video', 'Social Content Series', 'Brand Campaign', 'Event Coverage', 'Ongoing Retainer'],
    budget: ['$5k-$10k', '$10k-$25k', '$25k-$50k', '$50k+']
  }

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'top 20%',
        scrub: 1,
      }
    })

    // Background gradient expands
    tl.fromTo('.lm-bg', { scale: 0 }, { scale: 1, ease: 'none' }, 0)

    // Lines rotate
    tl.fromTo('.lm-lines', { rotation: 0 }, { rotation: 180, ease: 'none' }, 0)

    // Form flies in 3D
    tl.fromTo('.lm-form',
      { y: 300, z: -500, rotateX: 45, opacity: 0 },
      { y: 0, z: 0, rotateX: 0, opacity: 1, ease: 'power2.out' },
      0.2
    )

    // Submit button pulse
    gsap.to('.lm-submit', {
      boxShadow: '0 0 20px rgba(0,174,239,0.5)',
      scale: 1.02,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'power1.inOut'
    })
  }, { scope: containerRef })

  const handleStepChange = (nextStep: StepId) => {
    // 3D Exit current
    gsap.to('.lm-step-content', {
      rotateY: -90,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentStep(nextStep)
        // 3D Enter next
        gsap.fromTo('.lm-step-content',
          { rotateY: 90, opacity: 0 },
          { rotateY: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
        )
      }
    })
  }

  const handleOptionHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { z: 10, scale: 1.02, duration: 0.2 })
  }
  const handleOptionLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { z: 0, scale: 1, duration: 0.2 })
  }

  const renderStep = () => {
    if (currentStep === 'contact') {
      return (
        <div className="lm-step-content flex flex-col gap-4" style={{ transformStyle: 'preserve-3d' }}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF] transition-colors" />
            <input type="text" placeholder="Last Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF] transition-colors" />
          </div>
          <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF] transition-colors" />
          <input type="text" placeholder="Company" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF] transition-colors" />
          <button className="lm-submit mt-4 w-full bg-[#00AEEF] text-white font-bold py-4 rounded-lg hover:bg-[#00AEEF]/80 transition-colors">
            Get Custom Proposal
          </button>
        </div>
      )
    }

    const currentOptions = options[currentStep as keyof typeof options]
    return (
      <div className="lm-step-content flex flex-col gap-3" style={{ transformStyle: 'preserve-3d' }}>
        {currentOptions.map((opt, i) => (
          <button 
            key={i} 
            onMouseEnter={handleOptionHover}
            onMouseLeave={handleOptionLeave}
            onClick={() => {
              if (currentStep === 'service') handleStepChange('scope')
              else if (currentStep === 'scope') handleStepChange('budget')
              else if (currentStep === 'budget') handleStepChange('contact')
            }}
            className="w-full text-left px-6 py-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white transition-colors"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {opt}
          </button>
        ))}
      </div>
    )
  }

  const stepIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <section ref={containerRef} className="w-full py-32 bg-[#030305] relative overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* Background Entrance */}
      <div className="lm-bg absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-full max-w-4xl aspect-square rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, #00AEEF 0%, #6b21a8 50%, transparent 80%)' }} />
      </div>
      
      <div className="lm-lines absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center mb-12">
        <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-6">Project Discovery</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">Build Your Scope</h2>
        <p className="text-lg text-[#8E96AA]">Answer a few quick questions to help us understand your vision. We&apos;ll prepare a custom execution plan.</p>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <div className="lm-form p-8 md:p-10 rounded-2xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden" style={{ background: 'rgba(10,11,14,0.7)', transformStyle: 'preserve-3d' }}>
          
          {/* Progress bar glowing trail */}
          <div className="w-full h-1 bg-white/10 rounded-full mb-8 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-[#00AEEF] transition-all duration-500 shadow-[0_0_10px_#00AEEF]"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="flex justify-between mb-8 text-sm font-mono uppercase tracking-wider text-white/40">
            {steps.map((step, i) => (
              <span key={step.id} className={clsx("transition-colors duration-300", i <= stepIndex ? "text-[#00AEEF]" : "")}>
                {step.label}
              </span>
            ))}
          </div>

          <div className="relative min-h-[300px]" style={{ perspective: '800px' }}>
            {renderStep()}
          </div>
          
        </div>
      </div>
    </section>
  )
}
