'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Results() {
  const containerRef = useRef<HTMLElement>(null)
  const [views, setViews] = useState(0)

  const benefits = [
    "Campaign-ready edits",
    "Social-first storytelling",
    "Platform-specific deliverables",
    "Retention-focused pacing",
    "Hooks built for scroll behavior",
    "Analytics-informed iteration"
  ]

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
      }
    })

    // 1. Counter counts up based on scroll
    const counter = { val: 0 }
    tl.to(counter, {
      val: 25000000,
      ease: 'none',
      onUpdate: () => setViews(Math.floor(counter.val))
    }, 0)

    // 2. Background bars grow upward
    tl.fromTo('.result-bar',
      { scaleY: 0 },
      { scaleY: 1, stagger: 0.05, ease: 'none' },
      0
    )

    // 3. Spotlight scales
    tl.fromTo('.results-spotlight',
      { scale: 0.5, opacity: 0 },
      { scale: 1.5, opacity: 1, ease: 'none' },
      0
    )

    // 4. Title words fade in
    tl.fromTo('.results-title-word',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, ease: 'none' },
      0.1
    )

    // 5. Cards deal in from 3D
    tl.fromTo('.result-card',
      { opacity: 0, z: -500, rotateX: 45, y: 100 },
      { opacity: 1, z: 0, rotateX: 0, y: 0, stagger: 0.1, ease: 'power2.out' },
      0.2
    )

  }, { scope: containerRef })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
    return num.toLocaleString()
  }

  return (
    <section ref={containerRef} className="w-full h-screen bg-[#030305] relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background bars */}
      <div className="absolute inset-0 z-0 flex items-end justify-center gap-2 md:gap-3 opacity-[0.06] pb-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className="result-bar w-4 md:w-6 bg-[#00AEEF] rounded-t-sm origin-bottom" 
            style={{ height: `${Math.random() * 50 + 20}%` }} 
          />
        ))}
      </div>

      <div className="results-spotlight absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
        <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-8">Built to Generate Attention</p>
        
        {/* Giant counter */}
        <div 
          className="text-8xl md:text-[10rem] lg:text-[12rem] font-bold text-white mb-4 font-mono tracking-tighter leading-none"
          style={{ textShadow: '0 0 80px rgba(0,174,239,0.2), 0 0 160px rgba(0,174,239,0.1)' }}
        >
          {formatNumber(views)}
        </div>
        
        <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white/90 mb-6 flex flex-wrap justify-center gap-x-3">
          {"Generating millions of views consistently.".split(' ').map((word, i) => (
            <span key={i} className="results-title-word inline-block">{word}</span>
          ))}
        </h3>
        
        <p className="text-lg text-[#8E96AA] max-w-2xl leading-relaxed mb-16">
          Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is shaped to make people stop scrolling.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl" style={{ perspective: '1000px' }}>
          {benefits.map((text, i) => (
            <div key={i} className="result-card group px-6 py-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500 flex items-center gap-4" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]/60 group-hover:bg-[#00AEEF] transition-colors shrink-0" />
              <span className="text-[#8E96AA] group-hover:text-white/90 font-medium text-sm tracking-wide transition-colors duration-300">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
