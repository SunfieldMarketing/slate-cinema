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
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return

    const totalScroll = trackRef.current.offsetWidth - window.innerWidth

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalScroll}px`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    })

    // Move track horizontally
    tl.to(trackRef.current, {
      x: -totalScroll,
      ease: 'none',
    }, 0)

    // Progress wire
    tl.to('.progress-wire-fill', {
      width: '100%',
      ease: 'none'
    }, 0)

    // 3D Parallax on cards - rotate slightly based on horizontal position
    steps.forEach((_, i) => {
      // Create a specific scrollTrigger for each card to animate it as it enters/exits the viewport horizontally
      // Since we're in a pinned container, we can use containerAnimation
      gsap.fromTo(`.pipeline-card-${i}`, 
        { rotateY: 15, scale: 0.8, opacity: 0.5 },
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: `.pipeline-card-${i}`,
            containerAnimation: tl,
            start: 'left right',
            end: 'center center',
            scrub: true,
          }
        }
      )

      gsap.to(`.pipeline-card-${i}`, {
        rotateY: -15,
        scale: 0.8,
        opacity: 0.5,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: `.pipeline-card-${i}`,
          containerAnimation: tl,
          start: 'center center',
          end: 'right left',
          scrub: true,
        }
      })
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1500px' }}>
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,174,239,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Progress Wire */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0 pointer-events-none">
        <div className="progress-wire-fill h-full bg-[#00AEEF] w-0 shadow-[0_0_20px_#00AEEF]" />
      </div>

      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <span className="font-mono text-sm text-[#00AEEF] tracking-[0.4em] uppercase block mb-4 filter drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]">
          // Production Pipeline
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
          How It Works
        </h2>
      </div>

      {/* Horizontal Track */}
      <div ref={trackRef} className="flex h-full w-[400vw] items-center relative z-10">
        
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={`step-${i}`} className="w-screen h-full flex items-center justify-center p-8 md:p-24 shrink-0">
              
              {/* The Glass Panel Card */}
              <div 
                className={`pipeline-card-${i} relative w-full h-[70vh] max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {/* Video Side */}
                <div className="w-full md:w-[55%] h-[40%] md:h-full relative overflow-hidden shrink-0">
                  <video
                    src={step.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Gradients to fade video into the text panel */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#030305]/40 to-[#030305] mix-blend-multiply opacity-80" />
                  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/50 to-transparent hidden md:block" />
                </div>

                {/* Text Side */}
                <div className="w-full md:w-[45%] h-[60%] md:h-full p-8 md:p-16 flex flex-col justify-center relative z-10 bg-gradient-to-br from-black/60 to-black/90">
                  <div className="w-16 h-16 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 flex items-center justify-center text-[#00AEEF] mb-8 shadow-[0_0_30px_rgba(0,174,239,0.2)]">
                    <Icon strokeWidth={1.5} className="w-8 h-8" />
                  </div>
                  
                  <div className="font-mono text-sm md:text-base text-[#00AEEF] tracking-[0.3em] mb-4">
                    STEP {step.num}
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
                    {step.title}
                  </h3>
                  
                  <p className="text-white/70 text-lg md:text-2xl leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

              </div>
            </div>
          )
        })}

      </div>
    </section>
  )
}
