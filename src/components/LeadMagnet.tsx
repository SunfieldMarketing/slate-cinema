'use client'

import { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'

const steps = [
  {
    id: 'service',
    title: 'What do you need?',
    options: ['Pre-Production', 'Production', 'Post-Production', 'Distribution', 'Full Campaign']
  },
  {
    id: 'scope',
    title: 'Project Scope',
    options: ['Single Video', 'Social Content Series', 'Brand Campaign', 'Event Coverage', 'Ongoing Retainer']
  },
  {
    id: 'budget',
    title: 'Budget Range',
    options: ['$5k - $10k', '$10k - $25k', '$25k - $50k', '$50k+']
  },
  {
    id: 'contact',
    title: 'Your Details',
    options: [] // Special case for inputs
  }
]

export default function LeadMagnet() {
  const containerRef = useRef<HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})

  useGSAP(() => {
    gsap.fromTo('.lead-magnet-card',
      { y: 60, opacity: 0, rotateX: 10 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    )
  }, { scope: containerRef })

  const handleSelect = (option: string) => {
    setSelections(prev => ({ ...prev, [steps[currentStep].id]: option }))
    
    // Animate out current step
    gsap.to('.step-content', {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(s => s + 1)
          // Animate in next step
          gsap.fromTo('.step-content', 
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
          )
        }
      }
    })
  }

  return (
    <section id="quote" ref={containerRef} className="w-full py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #030305 0%, #0d0520 30%, #150a30 50%, #0d0520 70%, #030305 100%)' }}>
      
      {/* 3D Floating Particles / Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] opacity-40" style={{ background: 'radial-gradient(circle, rgba(120,50,200,0.4) 0%, transparent 70%)' }} />
        
        {/* Abstract floating geo lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/20 to-transparent w-full opacity-30" style={{ top: `${20 + i * 15}%`, transform: `rotate(${i % 2 === 0 ? 3 : -3}deg)` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-4">Project Discovery</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Build Your Scope</h2>
          <p className="text-xl text-[#8E96AA] max-w-2xl mx-auto">
            Answer a few quick questions to help us understand your vision. We&apos;ll prepare a custom execution plan.
          </p>
        </div>

        {/* Lead Magnet Interactive Form */}
        <div className="lead-magnet-card relative w-full max-w-2xl mx-auto">
          {/* Glowing border effect */}
          <div className="absolute -inset-[1px] rounded-2xl opacity-50" style={{ background: 'linear-gradient(135deg, rgba(120,50,200,0.6), rgba(0,174,239,0.4), rgba(120,50,200,0.6))', filter: 'blur(8px)' }} />
          
          <div className="relative rounded-2xl overflow-hidden glass-panel p-8 md:p-12" style={{ background: 'rgba(11,20,40,0.7)' }}>
            
            {/* Progress Bar */}
            <div className="w-full flex gap-2 mb-12">
              {steps.map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00AEEF] to-purple-500 transition-all duration-500"
                    style={{ width: i <= currentStep ? '100%' : '0%' }}
                  />
                </div>
              ))}
            </div>

            <div className="step-content">
              <h3 className="text-3xl font-bold text-white mb-8">{steps[currentStep].title}</h3>
              
              {currentStep < 3 ? (
                <div className="flex flex-col gap-4">
                  {steps[currentStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt)}
                      className="w-full text-left px-6 py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#00AEEF]/50 transition-all duration-300 group flex items-center justify-between"
                    >
                      <span className="text-white/80 group-hover:text-white font-medium tracking-wide">{opt}</span>
                      <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-[#00AEEF] flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <input type="text" placeholder="First Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF]/60 transition-colors" />
                    <input type="text" placeholder="Last Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF]/60 transition-colors" />
                  </div>
                  <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF]/60 transition-colors" />
                  <input type="text" placeholder="Company" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00AEEF]/60 transition-colors" />
                  <button className="w-full mt-4 bg-gradient-to-r from-[#00AEEF] to-purple-600 text-white font-bold tracking-wider uppercase py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,174,239,0.4)] transition-all duration-300">
                    Get Custom Proposal
                  </button>
                </div>
              )}
            </div>
            
            {/* Back button */}
            {currentStep > 0 && (
              <button 
                onClick={() => {
                  gsap.to('.step-content', {
                    opacity: 0, x: 20, duration: 0.2, onComplete: () => {
                      setCurrentStep(s => s - 1)
                      gsap.fromTo('.step-content', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 })
                    }
                  })
                }}
                className="mt-8 text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            )}
            
          </div>
        </div>
      </div>
    </section>
  )
}
