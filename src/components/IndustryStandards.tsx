'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function IndustryStandards() {
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

    // Text phases
    tl.to('.phase-1', { opacity: 0, y: -100, duration: 1, ease: 'power2.inOut' }, 0)
    
    tl.fromTo('.phase-2', { opacity: 0, y: 100, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0.5)
    
    // Morphing text sequence in Phase 2
    tl.to('.morph-word-1', { opacity: 0, y: -20, duration: 0.2 }, 0.8)
    tl.fromTo('.morph-word-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, 0.8)
    
    tl.to('.morph-word-2', { opacity: 0, y: -20, duration: 0.2 }, 1.3)
    tl.fromTo('.morph-word-3', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, 1.3)

    tl.to('.phase-2', { opacity: 0, y: -100, scale: 1.2, duration: 1, ease: 'power2.inOut' }, 2)
    tl.fromTo('.phase-3', { opacity: 0, scale: 0.5, rotateX: 45 }, { opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'power3.out' }, 2.5)

    // Visual elements - expanding boundaries well beyond 100vh/vw to prevent margin cutoff issues
    tl.to('.bg-visual-1', { opacity: 0, scale: 1.5, duration: 1 }, 0)
    tl.fromTo('.bg-visual-2', { opacity: 0, rotateZ: 45 }, { opacity: 1, rotateZ: 0, duration: 1.5 }, 0.2)
    tl.to('.bg-visual-2', { opacity: 0, scale: 2, duration: 1 }, 1.8)
    tl.fromTo('.bg-visual-3', { opacity: 0, filter: 'blur(20px)' }, { opacity: 1, filter: 'blur(0px)', duration: 1.5 }, 2.2)

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden text-white flex items-center justify-center" style={{ perspective: '1000px' }}>
      
      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
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

        <div className="bg-visual-3 absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_100%)]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[150vw] h-[80vh] border-y border-emerald-500/20 opacity-30 mask-image:linear-gradient(to_right,transparent,black,transparent)" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] min-h-[150vh] border-x border-emerald-500/20 opacity-30 mask-image:linear-gradient(to_bottom,transparent,black,transparent)" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center justify-center text-center">
        
        {/* Phase 1 */}
        <div className="phase-1 absolute flex flex-col items-center">
          <span className="font-mono text-[10px] md:text-xs text-[#00AEEF] tracking-[0.5em] uppercase mb-8">
            // The Standard
          </span>
          <h2 className="text-6xl md:text-[8rem] font-black leading-none tracking-tighter">
            WE ENGINEER
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent">
              ATTENTION
            </span>
          </h2>
          <p className="mt-8 text-white/50 max-w-xl text-lg font-light">
            Every detail is calculated.
          </p>
        </div>

        {/* Phase 2 */}
        <div className="phase-2 absolute flex flex-col items-center opacity-0 pointer-events-none w-full">
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
          <p className="mt-8 text-white/50 max-w-xl text-lg font-light">
            We don't just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.
          </p>
        </div>

        {/* Phase 3 */}
        <div className="phase-3 absolute flex flex-col items-center opacity-0 pointer-events-none">
          <span className="font-mono text-[10px] md:text-xs text-emerald-400 tracking-[0.5em] uppercase mb-8">
            // The Result
          </span>
          <h2 className="text-6xl md:text-[9rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            DOMINATE
          </h2>
          <div className="mt-8 px-8 py-4 border border-emerald-500/30 rounded-full bg-emerald-500/5 backdrop-blur-md">
            <span className="font-mono text-sm tracking-widest text-emerald-300">
              INDUSTRY-LEADING METRICS
            </span>
          </div>
        </div>

      </div>

    </section>
  )
}
