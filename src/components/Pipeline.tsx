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
    desc: 'Concept development, campaign planning, scripting, shot lists, storyboards.',
    icon: PenTool,
    videoSrc: '/videos/pre-production.mp4',
    color: 'from-blue-500/10 to-cyan-400/5',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'On-location shooting, lighting, directing, interviews, social-first content capture.',
    icon: Video,
    videoSrc: '/videos/production.mp4',
    color: 'from-purple-500/10 to-pink-500/5',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'Editing, color grading, sound design, motion graphics, captions, VFX.',
    icon: Edit3,
    videoSrc: '/videos/post-production.mp4',
    color: 'from-emerald-500/10 to-teal-400/5',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'Platform-specific cuts, ad-ready exports, campaign deliverables, analytics review.',
    icon: Send,
    videoSrc: '/videos/distribution.mp4',
    color: 'from-orange-500/10 to-red-500/5',
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

    // Setup initial twisted states for the "ribbon" segments
    steps.forEach((step, i) => {
      if (i !== 0) {
        // Starts twisted deep in the background
        gsap.set(`.ribbon-segment-${i}`, { 
          rotationX: 60, 
          rotationY: 45, 
          rotationZ: -10,
          z: -1500, 
          opacity: 0 
        })
        gsap.set(`.text-layer-${i}`, { z: -2000, opacity: 0 })
      } else {
        // First segment starts flat and ready
        gsap.set(`.ribbon-segment-0`, { rotationX: 0, rotationY: 0, rotationZ: 0, z: 0, opacity: 1 })
        gsap.set(`.text-layer-0`, { z: 200, opacity: 1 }) // Floating text
      }
    })

    // Float animation for typography
    gsap.to('.floating-text', {
      y: -20,
      rotationX: 5,
      rotationY: 5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    steps.forEach((step, i) => {
      // 1. Untwist and bring forward (if not the first one)
      if (i !== 0) {
        tl.to(`.ribbon-segment-${i}`, {
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          z: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        }, '>')
        
        tl.to(`.text-layer-${i}`, {
          z: 200,
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        }, '<')
      }

      // 2. Pause so the user can watch the video and read the massive floating text
      tl.to({}, { duration: 0.8 })

      // 3. Twist away to the other side (if not the last one)
      if (i !== steps.length - 1) {
        tl.to(`.ribbon-segment-${i}`, {
          rotationX: -60,
          rotationY: -45,
          rotationZ: 10,
          z: -1500,
          opacity: 0,
          duration: 1,
          ease: 'power2.in'
        })
        
        tl.to(`.text-layer-${i}`, {
          z: 500, // Flies forward past camera
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in'
        }, '<')
      }
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex items-center justify-center perspective-[2000px]">
      
      {/* Abstract Ambient Void Background */}
      <div className="absolute inset-0 bg-[#030305] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Ribbon Segments */}
      <div className="relative w-full h-full flex items-center justify-center transform-style-3d pointer-events-none">
        
        {steps.map((step, i) => {
          return (
            <div key={i} className="absolute inset-0 w-full h-full flex items-center justify-center transform-style-3d">
              
              {/* The Cinematic "Ribbon" Video Canvas */}
              <div 
                className={`ribbon-segment-${i} absolute w-[120vw] h-[60vh] md:w-[80vw] md:h-[70vh] flex items-center justify-center overflow-hidden transform-style-3d shadow-[0_0_150px_rgba(0,0,0,0.9)]`}
                style={{ 
                  // Borderless gradient edge for a seamless ribbon feel
                  maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.8)' 
                }}
              >
                {/* Colored Ambient Tint */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} z-10 mix-blend-screen opacity-50`} />
                
                <video
                  src={step.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-70 scale-110" // scale up slightly to hide edges when twisted
                />
              </div>

              {/* Massive Floating 3D Typography Layer */}
              <div className={`text-layer-${i} floating-text absolute inset-0 flex items-center justify-center pointer-events-none z-50 transform-style-3d`}>
                <div className="relative w-full max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center md:items-end">
                  
                  {/* Left Side: Number & Title */}
                  <div className="flex flex-col text-left drop-shadow-[0_20px_30px_rgba(0,0,0,1)]">
                    <span className="font-mono text-6xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-transparent leading-none">
                      {step.num}
                    </span>
                    <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase mt-[-20px] md:mt-[-40px]">
                      {step.title}
                    </h3>
                  </div>

                  {/* Right Side: Description */}
                  <div className="mt-8 md:mt-0 md:max-w-md text-right md:text-left backdrop-blur-md bg-black/20 p-6 rounded-2xl border border-white/5 drop-shadow-2xl">
                    <p className="text-white/80 text-lg md:text-2xl font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )
        })}

      </div>
      
    </section>
  )
}
