'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, TrendingUp, Users, Activity } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function IndustryStandards() {
  const containerRef = useRef<HTMLElement>(null)
  const morphTlRef = useRef<gsap.core.Timeline | null>(null)
  
  useGSAP(() => {
    if (!containerRef.current) return

    // Create the independent morphing timeline (running continuously)
    morphTlRef.current = gsap.timeline({ repeat: -1 })
    const mTl = morphTlRef.current

    // Use '<' to make the fade-out and fade-in happen simultaneously so there's no empty pause
    mTl.to('.morph-word-1', { opacity: 0, y: -20, duration: 0.4, delay: 2 })
    mTl.fromTo('.morph-word-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, '<')
    
    mTl.to('.morph-word-2', { opacity: 0, y: -20, duration: 0.4, delay: 2 })
    mTl.fromTo('.morph-word-3', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, '<')
    
    mTl.to('.morph-word-3', { opacity: 0, y: -20, duration: 0.4, delay: 2 })
    mTl.fromTo('.morph-word-1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, '<')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Play morphing continuously without pausing
        }
      }
    })

    // Text phases
    tl.to('.phase-1', { opacity: 0, y: -100, duration: 1, ease: 'power2.inOut' }, 0)
    
    tl.fromTo('.phase-2', { opacity: 0, y: 100, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0.5)
    
    tl.to('.phase-2', { opacity: 0, y: -100, scale: 1.2, duration: 1, ease: 'power2.inOut' }, 2)
    
    // Scale phase 3 in to be massive and impactful
    tl.fromTo('.phase-3', { opacity: 0, scale: 0.3, rotateX: 20 }, { opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'back.out(1.2)' }, 2.5)

    // Visual elements - expanding boundaries well beyond 100vh/vw to prevent margin cutoff issues
    tl.to('.bg-visual-1', { opacity: 0, scale: 1.5, duration: 1 }, 0)
    tl.fromTo('.bg-visual-2', { opacity: 0, rotateZ: 45 }, { opacity: 1, rotateZ: 0, duration: 1.5 }, 0.2)
    tl.to('.bg-visual-2', { opacity: 0, scale: 2, duration: 1 }, 1.8)
    
    // Massive light burst for phase 3
    tl.fromTo('.bg-visual-3', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.2, duration: 1.5 }, 2.2)



  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-visible text-white flex items-center justify-center" style={{ perspective: '1000px' }}>
      
      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="bg-visual-1 absolute min-w-[150vw] min-h-[150vh] border-[1px] border-[#00AEEF]/10 rounded-full flex items-center justify-center">
           <div className="w-[120vw] h-[120vh] border-[1px] border-[#00AEEF]/20 rounded-full flex items-center justify-center">
             <div className="w-[80vw] h-[80vh] border-[1px] border-[#00AEEF]/30 rounded-full bg-[#00AEEF]/5 blur-3xl" />
           </div>
        </div>
        
        <div className="bg-visual-2 absolute min-w-[200vw] min-h-[200vh] opacity-0 flex items-center justify-center mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)]" />
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_30px_rgba(168,85,247,0.8)]" />
          <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-transparent shadow-[0_0_30px_rgba(168,85,247,0.8)] absolute" />
        </div>

        {/* Huge Emerald Light Burst for Phase 3 */}
        <div className="bg-visual-3 absolute inset-0 opacity-0 flex items-center justify-center pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_60%)] blur-[100px]" />
           {/* Grid effect inside the burst */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-8 flex flex-col items-center justify-center text-center">
        
        {/* Phase 1 */}
        <div className="phase-1 absolute flex flex-col items-center max-w-7xl">
          <span className="font-mono text-[10px] md:text-xs text-[#00AEEF] tracking-[0.5em] uppercase mb-8">
            // The Standard
          </span>
          <h2 className="text-6xl md:text-[8rem] font-light leading-none tracking-tighter">
            WE ENGINEER
            <br />
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              ATTENTION
            </span>
          </h2>
          <p className="mt-8 text-white/60 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
            In a crowded digital landscape, being 'good enough' means being invisible. We build content systems designed specifically to hijack feeds, halt thumbs, and demand viewer retention from the very first frame.
          </p>
          <button className="mt-12 group inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-[#00AEEF] hover:text-white transition-all duration-300">
            See Our Work
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Phase 2 */}
        <div className="phase-2 absolute flex flex-col items-center opacity-0 pointer-events-none w-full max-w-7xl">
          <span className="font-mono text-[10px] md:text-xs text-purple-400 tracking-[0.5em] uppercase mb-8">
            // The Execution
          </span>
          <h2 className="text-5xl md:text-[6rem] font-black leading-[0.9] tracking-tighter text-white">
            EVERY FRAME
            <br />
            <span className="italic text-purple-400 font-serif font-light tracking-tight relative block h-[1.2em] w-full mt-2">
              <span className="morph-word-1 absolute left-1/2 -translate-x-1/2 w-full">Intentional.</span>
              <span className="morph-word-2 absolute left-1/2 -translate-x-1/2 w-full opacity-0">Perfected.</span>
              <span className="morph-word-3 absolute left-1/2 -translate-x-1/2 w-full opacity-0">Done Right.</span>
            </span>
          </h2>
          <p className="mt-8 text-white/60 max-w-xl text-lg font-light leading-relaxed">
            We don't just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.
          </p>
          <button className="mt-12 group inline-flex items-center justify-center px-8 py-4 border border-purple-500/50 bg-purple-500/10 backdrop-blur-md text-white font-semibold rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 pointer-events-auto">
            Discover Our Process
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Phase 3 - DOMINATE YOUR MARKET */}
        <div className="phase-3 absolute flex flex-col items-center opacity-0 pointer-events-none w-[100vw]">
          <span className="font-mono text-[10px] md:text-xs text-emerald-400 tracking-[0.5em] uppercase mb-6 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
            // The Result
          </span>
          
          {/* MASSIVE SINGLE LINE TEXT */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_60px_rgba(16,185,129,0.5)] mb-8 whitespace-nowrap overflow-visible">
            DOMINATE YOUR MARKET
          </h2>
          
          <p className="text-white/80 max-w-3xl text-lg md:text-2xl font-light leading-relaxed mb-12 px-4 shadow-black drop-shadow-md">
            The result is scalable, predictable growth. We turn passive viewers into active communities, and organic reach into tangible ROI.
          </p>
          
          <button className="group inline-flex items-center justify-center px-10 py-5 bg-emerald-500 text-black font-bold text-lg rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-300 pointer-events-auto shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            Book a Strategy Call
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>



        </div>

      </div>

      {/* Smooth Transitionary Bleed into Reviews Section */}
      {/* This creates a massive dark gradient at the very bottom of the pinned container that blends into the #030305 background of Reviews */}
      <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-b from-transparent to-[#030305] z-50 pointer-events-none translate-y-[100%]" />
      
    </section>
  )
}
