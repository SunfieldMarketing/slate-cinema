'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Results() {
  const containerRef = useRef<HTMLElement>(null)
  const [views, setViews] = useState(0)

  const stats = [
    { label: 'Views Generated', value: '25M+', icon: '👁️' },
    { label: 'Client Retention', value: '94%', icon: '🔄' },
    { label: 'Projects Delivered', value: '350+', icon: '🎬' },
    { label: 'Platforms Served', value: '12+', icon: '📱' },
  ]

  const benefits = [
    'Campaign-ready edits',
    'Social-first storytelling',
    'Platform-specific deliverables',
    'Retention-focused pacing',
    'Hooks built for scroll behavior',
    'Analytics-informed iteration'
  ]

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        }
      })

      // Timecode counter counts up
      const counter = { val: 0 }
      tl.to(counter, {
        val: 25000000,
        ease: 'none',
        duration: 0.4,
        onUpdate: () => setViews(Math.floor(counter.val))
      }, 0)

      // Stat cards unfold from the counter like origami
      const statCards = gsap.utils.toArray<HTMLElement>('.stat-card')
      statCards.forEach((card, i) => {
        tl.fromTo(card,
          { rotateX: -90, y: -50, opacity: 0, transformOrigin: 'top center' },
          { rotateX: 0, y: 0, opacity: 1, duration: 0.15, ease: 'power3.out' },
          0.3 + (i * 0.06)
        )
      })

      // Benefits ticker tape scrolls in from right
      tl.fromTo('.benefits-track',
        { x: '100%' },
        { x: '-100%', ease: 'none', duration: 0.5 },
        0.5
      )

      // Data visualization bars grow
      tl.fromTo('.data-bar',
        { scaleY: 0 },
        { scaleY: 1, stagger: 0.01, ease: 'none', duration: 0.4 },
        0.1
      )

      // Glow pulse on the main counter
      tl.fromTo('.counter-glow',
        { scale: 0.5, opacity: 0 },
        { scale: 1.5, opacity: 0.6, ease: 'none', duration: 0.5 },
        0
      )

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  const formatTimecode = (num: number) => {
    if (num >= 1000000) {
      const m = (num / 1000000).toFixed(1)
      return m + 'M+'
    }
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
    return num.toLocaleString()
  }

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* Background data bars */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] z-0 flex items-end gap-1 px-4 opacity-[0.04]">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="data-bar flex-1 bg-[#00AEEF] rounded-t origin-bottom" style={{ height: `${Math.random() * 80 + 20}%` }} />
        ))}
      </div>

      {/* Counter glow */}
      <div className="counter-glow absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.12) 0%, transparent 70%)' }} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Section label */}
        <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase mb-8">// Performance Metrics</span>

        {/* Giant timecode-style counter */}
        <div className="mb-4">
          <div className="text-7xl md:text-[9rem] lg:text-[12rem] font-bold text-white font-mono tracking-tighter leading-none" style={{ textShadow: '0 0 80px rgba(0,174,239,0.2)' }}>
            {formatTimecode(views)}
          </div>
        </div>

        <h3 className="text-xl md:text-3xl font-bold text-white/80 tracking-tight mb-16">
          Generating millions of views consistently.
        </h3>

        {/* Stat cards - unfold from center */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl mb-16" style={{ perspective: '1000px' }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card group px-5 py-6 rounded-xl relative overflow-hidden cursor-pointer" style={{
              transformStyle: 'preserve-3d',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/30 to-transparent" />
              
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 font-mono">{stat.value}</div>
              <div className="text-[11px] text-white/30 font-mono tracking-wider uppercase">{stat.label}</div>
              
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,174,239,0.08) 0%, transparent 70%)' }} />
            </div>
          ))}
        </div>

        {/* Benefits ticker tape */}
        <div className="w-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#030305] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#030305] to-transparent z-10" />
          <div className="benefits-track flex gap-8 whitespace-nowrap py-4">
            {[...benefits, ...benefits].map((b, i) => (
              <span key={i} className="flex items-center gap-3 text-sm text-white/30 font-mono tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]/40" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Film frame overlay at edges */}
      <div className="absolute top-0 left-0 right-0 h-8 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #030305, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-8 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #030305, transparent)' }} />
    </section>
  )
}
