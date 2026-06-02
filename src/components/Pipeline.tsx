'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PenTool, Video, Edit3, Send } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'We map the idea before the camera turns on. Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.',
    icon: PenTool,
    videoSrc: '/videos/pre-production.mp4',
    color: 'from-blue-500 to-cyan-400',
    orbColor: 'rgba(6,182,212,0.8)',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: Video,
    videoSrc: '/videos/production.mp4',
    color: 'from-purple-500 to-pink-500',
    orbColor: 'rgba(236,72,153,0.8)',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: Edit3,
    videoSrc: '/videos/post-production.mp4',
    color: 'from-emerald-500 to-teal-400',
    orbColor: 'rgba(16,185,129,0.8)',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: Send,
    videoSrc: '/videos/distribution.mp4',
    color: 'from-orange-500 to-red-500',
    orbColor: 'rgba(239,68,68,0.8)',
  }
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    })

    // Initial state: Orb is small and floating. Text is hidden.
    
    steps.forEach((step, index) => {
      // 1. Orb scales up violently to cover the container (Shatter/Expand)
      tl.to(`.liquid-orb`, {
        scale: 25, // Massive scale to cover the screen
        backgroundColor: step.orbColor,
        duration: 0.5,
        ease: 'power3.in'
      })
      
      // 2. Fade in the video and content for this step
      tl.to(`.step-${index}-content`, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '<0.2') // Start fading in right before orb finishes expanding

      // 3. Hold the step on screen for a bit
      tl.to({}, { duration: 1 })

      // 4. Shrink back if not the last step
      if (index !== steps.length - 1) {
        tl.to(`.step-${index}-content`, {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'power2.in'
        })
        tl.to(`.liquid-orb`, {
          scale: 1, // Shrink back to orb
          duration: 0.6,
          ease: 'power3.out'
        }, '<')
      }
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex items-center justify-center">
      
      {/* CSS Keyframes for the Liquid Morphing Orb Effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes liquid-morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
      `}} />

      {/* SVG filter to give the DOM a "gooey" liquid look when expanding */}
      <svg className="hidden">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>

      {/* Header outside */}
      <div className="absolute top-12 md:top-20 w-full text-center z-50 pointer-events-none">
        <span className="font-mono text-sm text-[#00AEEF] tracking-[0.4em] uppercase block mb-2 filter drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]">
          // Production Pipeline
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl">
          How It Works
        </h2>
      </div>

      {/* Liquid Orb Container - uses the gooey filter */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ filter: 'url(#gooey)' }}>
        <div 
          className="liquid-orb w-32 h-32 md:w-48 md:h-48 shadow-[0_0_60px_rgba(255,255,255,0.4)] mix-blend-screen"
          style={{ 
            backgroundColor: steps[0].orbColor,
            animation: 'liquid-morph 8s ease-in-out infinite',
            transformOrigin: 'center center'
          }}
        />
      </div>

      {/* Steps Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div 
              key={i} 
              className={`step-${i}-content absolute inset-0 w-full h-full opacity-0 scale-110 flex flex-col md:flex-row`}
            >
              
              {/* Left Side: Video */}
              <div className="relative w-full h-1/2 md:h-full md:w-1/2 overflow-hidden">
                <video
                  src={step.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#030305] to-transparent opacity-80`} />
              </div>

              {/* Right Side: Text & Typography */}
              <div className="relative w-full h-1/2 md:h-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-[#030305]">
                
                {/* Background ambient color for this step */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 blur-[100px]`} />

                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      <Icon strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <span className="font-mono text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-transparent">
                      {step.num}
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tighter leading-none">
                    {step.title}
                  </h3>
                  
                  <p className="text-white/60 text-lg md:text-xl lg:text-2xl leading-relaxed font-light max-w-xl">
                    {step.desc}
                  </p>

                  {/* Aesthetic Line */}
                  <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent mt-12" />
                </div>
              </div>

            </div>
          )
        })}
      </div>
      
    </section>
  )
}
