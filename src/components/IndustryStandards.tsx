'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, TrendingUp, Users, Activity } from 'lucide-react'
import type { HomePage } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

export default function IndustryStandards({ data }: { data?: HomePage['industryStandards'] }) {
  const containerRef = useRef<HTMLElement>(null)
  const morphTlRef = useRef<gsap.core.Timeline | null>(null)

  const phase1 = {
    eyebrow: data?.phase1?.eyebrow || '// The Standard',
    headlineLine1: data?.phase1?.headlineLine1 || 'WE ENGINEER',
    headlineLine2: data?.phase1?.headlineLine2 || 'ATTENTION',
    description:
      data?.phase1?.description ||
      "In a crowded digital landscape, being 'good enough' means being invisible. We build content systems designed specifically to hijack feeds, halt thumbs, and demand viewer retention from the very first frame.",
  }
  const morphWords = data?.phase2?.morphWords?.length
    ? data.phase2.morphWords.map((w) => w.word)
    : ['Intentional.', 'Perfected.', 'Done Right.']
  const phase2 = {
    eyebrow: data?.phase2?.eyebrow || '// The Execution',
    headline: data?.phase2?.headline || 'EVERY FRAME',
    description:
      data?.phase2?.description ||
      "We don't just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.",
  }
  const phase3 = {
    eyebrow: data?.phase3?.eyebrow || '// The Result',
    headline: data?.phase3?.headline || 'DOMINATE YOUR MARKET',
    description:
      data?.phase3?.description ||
      'The result is scalable, predictable growth. We turn passive viewers into active communities, and organic reach into tangible ROI.',
    ctaLabel: data?.phase3?.ctaLabel || 'Get Started',
    ctaHref: data?.phase3?.ctaHref || '/contact',
  }
  
  useGSAP(() => {
    if (!containerRef.current) return

    // Create the independent morphing timeline (running continuously)
    morphTlRef.current = gsap.timeline({ repeat: -1 })
    const mTl = morphTlRef.current

    // Initial state
    gsap.set('.morph-word-1', { opacity: 1, y: 0 })
    gsap.set('.morph-word-2', { opacity: 0, y: 20 })
    gsap.set('.morph-word-3', { opacity: 0, y: 20 })

    // Use absolute positioning for the morphing sequence
    mTl.to('.morph-word-1', { opacity: 0, y: -20, duration: 0.4 }, 2)
    mTl.to('.morph-word-2', { opacity: 1, y: 0, duration: 0.4 }, 2)
    
    mTl.to('.morph-word-2', { opacity: 0, y: -20, duration: 0.4 }, 4)
    mTl.to('.morph-word-3', { opacity: 1, y: 0, duration: 0.4 }, 4)
    
    mTl.to('.morph-word-3', { opacity: 0, y: -20, duration: 0.4 }, 6)
    // To complete the cycle, morph-word-1 comes back in
    // However, when the timeline repeats, it instantly jumps back to 0.
    // At time 0, morph-word-1 is supposed to be at opacity 1. 
    // We must put it back to initial y=20 so it can animate in:
    mTl.set('.morph-word-1', { y: 20 }, 5.9)
    mTl.to('.morph-word-1', { opacity: 1, y: 0, duration: 0.4 }, 6)
    
    // Add a 2s wait before it loops back so morph-word-1 is visible for the same duration
    mTl.to({}, { duration: 2 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Play morphing continuously without pausing
        }
      }
    })

    // Text phases
    // We add a delay (start at 1 instead of 0) so the first phase stays locked on screen longer
    tl.to('.phase-1', { opacity: 0, y: -100, duration: 1, ease: 'power2.inOut' }, 1)
    
    tl.fromTo('.phase-2', { opacity: 0, y: 100, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 1.5)
    
    tl.to('.phase-2', { opacity: 0, y: -100, scale: 1.2, duration: 1, ease: 'power2.inOut' }, 3)
    
    // Scale phase 3 in to be massive and impactful
    tl.fromTo('.phase-3', { opacity: 0, scale: 0.3, rotateX: 20 }, { opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'back.out(1.2)' }, 3.5)

    // Visual elements - expanding boundaries well beyond 100vh/vw to prevent margin cutoff issues
    tl.to('.bg-visual-1', { opacity: 0, scale: 1.5, duration: 1 }, 1)
    tl.fromTo('.bg-visual-2', { opacity: 0, rotateZ: 45 }, { opacity: 1, rotateZ: 0, duration: 1.5 }, 1.2)
    tl.to('.bg-visual-2', { opacity: 0, scale: 2, duration: 1 }, 2.8)
    
    // Massive light burst for phase 3
    tl.fromTo('.bg-visual-3', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.2, duration: 1.5 }, 3.2)



  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-visible text-white flex items-center justify-center" style={{ perspective: '1000px' }}>
      
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
            {phase1.eyebrow}
          </span>
          <h2 className="text-6xl md:text-[8rem] font-light leading-none tracking-tighter">
            {phase1.headlineLine1}
            <br />
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {phase1.headlineLine2}
            </span>
          </h2>
          <p className="mt-8 text-white/60 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
            {phase1.description}
          </p>
        </div>

        {/* Phase 2 */}
        <div className="phase-2 absolute flex flex-col items-center opacity-0 pointer-events-none w-full max-w-7xl">
          <span className="font-mono text-[10px] md:text-xs text-purple-400 tracking-[0.5em] uppercase mb-8">
            {phase2.eyebrow}
          </span>
          <h2 className="text-5xl md:text-[6rem] font-black leading-[0.9] tracking-tighter text-white">
            {phase2.headline}
            <br />
            <span className="italic text-purple-400 font-serif font-light tracking-tight relative block h-[1.2em] w-full mt-2">
              <span className="morph-word-1 absolute left-1/2 -translate-x-1/2 w-full">{morphWords[0]}</span>
              <span className="morph-word-2 absolute left-1/2 -translate-x-1/2 w-full opacity-0">{morphWords[1]}</span>
              <span className="morph-word-3 absolute left-1/2 -translate-x-1/2 w-full opacity-0">{morphWords[2]}</span>
            </span>
          </h2>
          <p className="mt-8 text-white/60 max-w-xl text-lg font-light leading-relaxed">
            {phase2.description}
          </p>
        </div>

        {/* Phase 3 - DOMINATE YOUR MARKET */}
        <div className="phase-3 absolute flex flex-col items-center opacity-0 pointer-events-none w-[100vw]">
          <span className="font-mono text-[10px] md:text-xs text-emerald-400 tracking-[0.5em] uppercase mb-6 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
            {phase3.eyebrow}
          </span>

          {/* MASSIVE SINGLE LINE TEXT */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[6vw] font-black leading-[1.05] md:leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_60px_rgba(16,185,129,0.5)] mb-8 md:whitespace-nowrap overflow-visible px-4">
            {phase3.headline}
          </h2>

          <p className="text-white/80 w-full max-w-4xl text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-12 px-4 shadow-black drop-shadow-md text-center">
            {phase3.description}
          </p>

          <a href={phase3.ctaHref} className="group inline-flex items-center justify-center px-10 py-5 bg-emerald-500 text-black font-bold text-lg rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-300 pointer-events-auto shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            {phase3.ctaLabel}
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>

      {/* Smooth Transitionary Bleed into Reviews Section */}
      {/* This creates a massive dark gradient at the very bottom of the pinned container that blends into the shared ink background of Reviews */}
      <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-b from-transparent to-ink z-50 pointer-events-none translate-y-[100%]" />
      
    </section>
  )
}
