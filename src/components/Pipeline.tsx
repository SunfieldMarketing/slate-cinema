'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'

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
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // Calculate which step should be active based on scroll progress (0 to 1)
          const progress = self.progress
          const stepIndex = Math.min(Math.floor(progress * 4), 3)
          setActiveStep(stepIndex)
        }
      }
    })
    
    // Animate background elements based on scroll
    tl.to('.pipeline-bg-mark', {
      rotate: 180,
      opacity: 0.1,
      ease: 'none'
    })

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center bg-[#030305] overflow-hidden">
      {/* Background rotating mark */}
      <div className="pipeline-bg-mark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 pointer-events-none text-[#00AEEF] flex items-center justify-center">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="10 10" />
          <path d="M40,30 L70,50 L40,70 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left Side: Static Text */}
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            How We Turn Ideas Into <span className="text-[#00AEEF]">Campaigns</span>
          </h2>
          <p className="text-lg text-[#8E96AA] max-w-md leading-relaxed">
            Every project moves through a clear production system, built to keep the process simple for clients while our team handles the strategy, visuals, editing, and distribution details.
          </p>
        </div>

        {/* Right Side: Scroll-driven Accordion */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx
            return (
              <div 
                key={step.id} 
                className={clsx(
                  'glass-panel rounded-2xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  isActive ? 'h-[240px] border-white/20' : 'h-[72px] cursor-pointer hover:border-white/10'
                )}
                onClick={() => setActiveStep(idx)}
              >
                <div className="flex items-center gap-6 p-6 h-[72px]">
                  <span className={clsx("font-mono text-sm tracking-widest transition-colors duration-300", isActive ? "text-[#00AEEF]" : "text-[#8E96AA]")}>{step.id}</span>
                  <h3 className={clsx("text-xl font-bold tracking-wide transition-colors duration-300", isActive ? "text-white" : "text-[#8E96AA]")}>{step.title}</h3>
                </div>
                
                <div className={clsx(
                  "px-6 pb-6 pt-2 transition-all duration-700 delay-100",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <p className="text-[#8E96AA] leading-relaxed pr-8">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
        
      </div>
    </section>
  )
}
