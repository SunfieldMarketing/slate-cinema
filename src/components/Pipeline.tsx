'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    id: '01',
    title: 'Pre-Production',
    desc: 'We map the idea before the camera turns on. Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.'
  },
  {
    id: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.'
  },
  {
    id: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.'
  },
  {
    id: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.'
  }
]

export default function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const stepIndex = Math.min(Math.floor(progress * 4), 3)
          setActiveStep(stepIndex)
        }
      }
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center bg-[#030305] overflow-hidden">
      {/* Background rotating mark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#00AEEF]" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="40" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
          <polygon points="43,32 43,68 70,50" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row items-start gap-12 lg:gap-20 relative z-10">
        
        {/* Left Side */}
        <div className="flex-1 lg:sticky lg:top-1/3 space-y-6 pt-8">
          <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase">Our Process</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            How It Works
          </h2>
          <p className="text-lg text-[#8E96AA] max-w-lg leading-relaxed">
            At Slate Cinema, our values shape our work. With integrity, creativity, and collaboration at our core, we deliver exceptional video production. Transparency, innovation, and teamwork drive us forward, ensuring every project exceeds expectations.
          </p>

          {/* Step counter */}
          <div className="flex items-center gap-4 pt-4">
            <span className="text-5xl font-mono font-bold text-[#00AEEF]">{String(activeStep + 1).padStart(2, '0')}</span>
            <div className="w-12 h-[1px] bg-white/20" />
            <span className="text-sm font-mono text-white/30">04</span>
          </div>
        </div>

        {/* Right Side: Accordion */}
        <div className="flex-1 w-full flex flex-col gap-3">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx
            return (
              <div 
                key={step.id} 
                className={clsx(
                  'rounded-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer',
                  isActive 
                    ? 'bg-white/[0.04] border border-white/10' 
                    : 'bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08]'
                )}
                style={isActive ? { boxShadow: '0 0 40px rgba(0,174,239,0.05)' } : undefined}
                onClick={() => setActiveStep(idx)}
              >
                {/* Active indicator line */}
                <div className={clsx(
                  'absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-all duration-500',
                  isActive ? 'bg-[#00AEEF]' : 'bg-transparent'
                )} />

                <div className="flex items-center gap-5 p-5 md:p-6 relative">
                  <span className={clsx(
                    "font-mono text-xs tracking-[0.2em] transition-colors duration-500",
                    isActive ? "text-[#00AEEF]" : "text-white/20"
                  )}>{step.id}</span>
                  <h3 className={clsx(
                    "text-lg md:text-xl font-bold tracking-wide transition-colors duration-500",
                    isActive ? "text-white" : "text-white/40"
                  )}>{step.title}</h3>
                  
                  {/* Chevron */}
                  <svg className={clsx("w-4 h-4 ml-auto transition-all duration-500", isActive ? "rotate-180 text-[#00AEEF]" : "text-white/20")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                <div className={clsx(
                  "overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-5 md:px-6 pb-6 pt-0">
                    <div className="w-8 h-[1px] bg-[#00AEEF]/30 mb-4" />
                    <p className="text-[#8E96AA] leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
      </div>
    </section>
  )
}
