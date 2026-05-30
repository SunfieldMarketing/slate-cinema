'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ClipboardList, Clapperboard, Film, Radio } from 'lucide-react'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'We map the idea before the camera turns on. Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.',
    icon: ClipboardList,
    videoSrc: '/videos/pipeline-pre.mp4',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: Clapperboard,
    videoSrc: '/videos/production.mp4',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: Film,
    videoSrc: '/videos/post-production.mp4',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: Radio,
    videoSrc: '/videos/distribution.mp4',
  },
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const stepElements = gsap.utils.toArray<HTMLElement>('.step-item')
      const videoElements = gsap.utils.toArray<HTMLElement>('.video-item')
      const totalSteps = steps.length

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150vh',
          pin: true,
          scrub: 1,
        }
      })

      stepElements.forEach((step, i) => {
        if (i > 0) {
          // Crossfade videos
          tl.to(videoElements[i], { opacity: 1, duration: 1 }, i - 0.5)
          tl.to(videoElements[i - 1], { opacity: 0, duration: 1 }, i - 0.5)

          // Dim previous step, highlight current step
          tl.to(stepElements[i - 1], { opacity: 0.3, scale: 0.95, duration: 1 }, i - 0.5)
          tl.to(stepElements[i], { opacity: 1, scale: 1, duration: 1 }, i - 0.5)
        }
      })

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col md:flex-row">
      
      {/* Right Side - Videos (Background on mobile, right half on desktop) */}
      <div className="absolute inset-0 md:left-1/2 w-full md:w-1/2 h-full z-0 overflow-hidden pointer-events-none">
        
        {/* Desktop Gradient overlay to blend left and right */}
        <div className="absolute inset-0 z-10 hidden md:block bg-gradient-to-r from-[#030305] via-[#030305]/40 to-transparent w-full" />
        
        {/* Dark cinematic overlay for videos */}
        <div className="absolute inset-0 z-10 bg-[#030305]/40 md:bg-[#030305]/40 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#030305] via-transparent to-[#030305] opacity-90" />

        {steps.map((step, i) => (
          <div 
            key={i} 
            className={clsx(
              "video-item absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden",
              i === 0 ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="absolute top-1/2 left-1/2 w-full h-full min-h-[100vh] min-w-[100vw] -translate-x-1/2 -translate-y-1/2">
              <video
                src={step.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left Side - Text Content */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center relative z-20 px-8 md:px-16 lg:px-24 pt-20 md:pt-0">
        <div className="mb-10 md:mb-16">
          <span className="font-mono text-xs text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Production Pipeline</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">How It Works</h2>
        </div>
        
        <div className="flex flex-col gap-6 md:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div 
                key={i} 
                className={clsx(
                  "step-item flex items-start gap-4 md:gap-6 transform origin-left transition-all duration-300",
                  i === 0 ? "opacity-100 scale-100" : "opacity-30 scale-95"
                )}
              >
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00AEEF]">
                  <Icon size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#00AEEF] tracking-[0.2em] mb-1 md:mb-2">STEP {step.num}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
    </section>
  )
}
