'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PenTool, Video, Edit3, Send } from 'lucide-react'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'We map the idea before the camera turns on. Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.',
    icon: PenTool,
    videoSrc: '/videos/pre-production.mp4',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: Video,
    videoSrc: '/videos/production.mp4',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: Edit3,
    videoSrc: '/videos/post-production.mp4',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: Send,
    videoSrc: '/videos/distribution.mp4',
  }
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const totalSteps = steps.length
    
    // Main scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=4000vh', // Massive scroll distance for slow cinematic transitions
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    })

    // Text animations and video wipes
    // Each step gets an equal fraction of the timeline
    const stepDuration = 1 / totalSteps

    steps.forEach((step, i) => {
      const startTime = i * stepDuration
      
      // The video wipe-in
      if (i > 0) {
        tl.fromTo(`.step-video-${i}`, 
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(150% at 50% 50%)', ease: 'power2.inOut', duration: stepDuration * 0.4 },
          startTime
        )
      }

      // The text fly-in and fade-out
      tl.fromTo(`.step-text-${i}`,
        { opacity: 0, scale: 0.8, y: 100, rotateX: 20 },
        { opacity: 1, scale: 1, y: 0, rotateX: 0, ease: 'power3.out', duration: stepDuration * 0.3 },
        startTime + (i > 0 ? stepDuration * 0.2 : 0) // Delay text until wipe is halfway
      )

      // Fade out text if not the last step
      if (i < totalSteps - 1) {
        tl.to(`.step-text-${i}`,
          { opacity: 0, scale: 1.1, y: -100, rotateX: -20, ease: 'power2.in', duration: stepDuration * 0.3 },
          startTime + stepDuration * 0.7
        )
      }
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* Background Videos Stacked */}
      {steps.map((step, i) => (
        <div 
          key={`video-${i}`}
          className={`step-video-${i} absolute inset-0 w-full h-full z-0 overflow-hidden`}
          style={{ zIndex: i }}
        >
          <video
            src={step.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          {/* Deep cinematic gradient overlay to make text legible */}
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
      ))}

      {/* Floating Centered Text Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Section Header (Fixed at top) */}
        <div className="absolute top-12 md:top-24 left-0 right-0 text-center z-30 px-6">
          <span className="font-mono text-sm md:text-base text-[#00AEEF] tracking-[0.4em] uppercase block mb-4 filter drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]">
            // Production Pipeline
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
            How It Works
          </h2>
        </div>

        {/* Dynamic Step Text */}
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div 
              key={`text-${i}`}
              className={`step-text-${i} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-6 flex flex-col items-center text-center`}
              style={{ opacity: 0 }} // Initial state for GSAP
            >
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#00AEEF] mb-8 shadow-[0_0_40px_rgba(0,174,239,0.3)]">
                <Icon strokeWidth={1.5} className="w-10 h-10 md:w-14 md:h-14" />
              </div>
              
              <div className="font-mono text-lg md:text-xl text-[#00AEEF] tracking-[0.3em] mb-4 drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]">
                STEP {step.num}
              </div>
              
              <h3 className="text-5xl md:text-8xl font-bold text-white mb-6 md:mb-8 tracking-tighter drop-shadow-2xl">
                {step.title}
              </h3>
              
              <p className="text-white/80 text-xl md:text-3xl leading-relaxed max-w-3xl font-light drop-shadow-lg">
                {step.desc}
              </p>
            </div>
          )
        })}

      </div>
    </section>
  )
}
