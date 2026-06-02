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
    color: 'from-blue-500/20 to-cyan-400/5',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: Video,
    videoSrc: '/videos/production.mp4',
    color: 'from-purple-500/20 to-pink-500/5',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: Edit3,
    videoSrc: '/videos/post-production.mp4',
    color: 'from-emerald-500/20 to-teal-400/5',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: Send,
    videoSrc: '/videos/distribution.mp4',
    color: 'from-orange-500/20 to-red-500/5',
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
        end: '+=400%', // 4 panels, so 400% scroll distance
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    })

    // Setup initial positions deep in the Z-axis
    gsap.set('.tunnel-panel', { z: -4000, opacity: 0, scale: 0.2 })

    steps.forEach((step, index) => {
      // 1. Fly from deep space (-4000) to the center (0)
      tl.to(`.panel-${index}`, {
        z: 0,
        opacity: 1,
        scale: 1,
        ease: 'power2.inOut',
        duration: 1
      })

      // 2. Pause/hold perfectly in the center so the user can read it
      tl.to(`.panel-${index}`, {
        z: 100, // Move very slightly forward during the pause for parallax
        ease: 'none',
        duration: 0.5
      })

      // 3. Fly past the camera and disappear
      tl.to(`.panel-${index}`, {
        z: 1500, // Move past the screen
        opacity: 0,
        scale: 1.5,
        ease: 'power2.in',
        duration: 0.8
      })
    })

    // Background tunnel motion
    tl.to('.tunnel-grid', {
      backgroundPosition: '0px 1000px',
      ease: 'none',
      duration: tl.totalDuration()
    }, 0)

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex items-center justify-center perspective-[1500px]">
      
      {/* Infinite Space Background */}
      <div className="absolute inset-0 bg-[#030305] z-0" />
      
      {/* Dynamic Tunnel Grid */}
      <div className="tunnel-grid absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
        transform: 'rotateX(60deg) scale(3) translateY(-20%)',
        transformOrigin: 'top center'
      }} />

      {/* Header outside of the 3D space */}
      <div className="absolute top-12 md:top-20 w-full text-center z-50 pointer-events-none">
        <span className="font-mono text-sm text-[#00AEEF] tracking-[0.4em] uppercase block mb-2 filter drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]">
          // Production Pipeline
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl">
          How It Works
        </h2>
      </div>

      {/* Z-Axis Container */}
      <div className="relative w-full h-full flex items-center justify-center transform-style-3d pointer-events-none">
        
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div 
              key={i} 
              className={`tunnel-panel panel-${i} absolute w-[90%] md:w-[80vw] lg:w-[70vw] max-w-6xl aspect-[4/3] md:aspect-[16/9] flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] will-change-transform`}
            >
              
              {/* Colored Glow overlay inside the panel */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} z-0`} />

              {/* Left Side: Video */}
              <div className="relative w-full h-1/2 md:h-full md:w-1/2 overflow-hidden z-10 border-b md:border-b-0 md:border-r border-white/10">
                <video
                  src={step.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent" />
              </div>

              {/* Right Side: Text */}
              <div className="relative w-full h-1/2 md:h-full md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-center z-10 text-white">
                
                <div className="flex items-center gap-4 md:gap-6 mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <Icon strokeWidth={1.5} className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <span className="font-mono text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                    {step.num}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter leading-none">
                  {step.title}
                </h3>
                
                <p className="text-white/60 text-base md:text-lg lg:text-xl leading-relaxed font-light">
                  {step.desc}
                </p>

              </div>
            </div>
          )
        })}

      </div>
      
    </section>
  )
}
