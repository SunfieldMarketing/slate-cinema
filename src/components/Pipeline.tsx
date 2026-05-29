'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.',
    icon: '📋',
    color: '#00AEEF',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: '🎬',
    color: '#00AEEF',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: '🎞️',
    color: '#00AEEF',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: '📡',
    color: '#00AEEF',
  },
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.timeline-card')
      const totalCards = cards.length

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalCards * 100}%`,
          pin: true,
          scrub: 1,
        }
      })

      // Horizontal scroll the timeline track
      tl.to('.timeline-track', {
        xPercent: -75,
        ease: 'none',
        duration: 1,
      }, 0)

      // Playhead moves across the timeline bar
      tl.to('.playhead', {
        left: '100%',
        ease: 'none',
        duration: 1,
      }, 0)

      // Progress fill
      tl.to('.timeline-progress', {
        scaleX: 1,
        ease: 'none',
        duration: 1,
      }, 0)

      // Each card rotates into view like a film reel
      cards.forEach((card, i) => {
        const start = i / totalCards
        const end = (i + 0.5) / totalCards
        
        tl.fromTo(card,
          { rotateY: 45, z: -300, opacity: 0.3, scale: 0.8 },
          { rotateY: 0, z: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.2 },
          start
        )
        
        if (i < totalCards - 1) {
          tl.to(card,
            { rotateY: -45, z: -300, opacity: 0.3, scale: 0.8, ease: 'power2.in', duration: 0.2 },
            end
          )
        }
      })

      // Section title entrance
      gsap.fromTo('.pipeline-title',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', end: 'top 30%', scrub: 1 }
        }
      )

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1500px' }}>
      
      {/* Background: Editing timeline grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 120px), repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)',
      }} />

      {/* Top section label */}
      <div className="absolute top-12 left-12 z-20">
        <div className="pipeline-title">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-3">// Production Pipeline</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">How It Works</h2>
          <p className="text-sm text-white/30 mt-3 max-w-md leading-relaxed">
            At Slate Cinema, our values shape our work. With integrity, creativity, and collaboration at our core, we deliver exceptional video production.
          </p>
        </div>
      </div>

      {/* Video Editing Timeline Bar */}
      <div className="absolute bottom-32 left-0 right-0 z-20 px-12">
        <div className="relative h-[2px] bg-white/10 rounded-full">
          {/* Progress fill */}
          <div className="timeline-progress absolute top-0 left-0 h-full bg-[#00AEEF] rounded-full origin-left" style={{ transform: 'scaleX(0)', width: '100%' }} />
          
          {/* Playhead */}
          <div className="playhead absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#00AEEF] rounded-full shadow-[0_0_12px_rgba(0,174,239,0.6)] left-0 -ml-1.5 z-10" />
          
          {/* Timeline markers */}
          {steps.map((step, i) => (
            <div key={i} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${(i / (steps.length - 1)) * 100}%` }}>
              <div className="w-1 h-4 bg-white/20 -mt-6 rounded-full" />
              <span className="font-mono text-[9px] text-white/25 mt-8 tracking-widest whitespace-nowrap">{step.num} {step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card track - scrolls horizontally */}
      <div className="timeline-track absolute top-1/2 -translate-y-1/2 left-[15%] flex gap-12 items-center z-10" style={{ transformStyle: 'preserve-3d' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            className="timeline-card group w-[420px] h-[320px] shrink-0 rounded-2xl relative overflow-hidden cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Top bar - looks like a video clip header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: step.color }} />
                <span className="font-mono text-[10px] text-white/40 tracking-widest">{step.title.toUpperCase()}.MOV</span>
              </div>
              <span className="font-mono text-[10px] text-white/20">00:{step.num}:00:00</span>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                    {step.icon}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.3em]">STEP {step.num}</span>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  </div>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Fake waveform at bottom */}
              <div className="flex items-end gap-[2px] h-8 mt-4 opacity-30 group-hover:opacity-60 transition-opacity">
                {Array.from({ length: 60 }).map((_, j) => (
                  <div key={j} className="w-[3px] bg-[#00AEEF] rounded-sm" style={{ height: `${Math.sin(j * 0.5) * 50 + Math.random() * 50}%` }} />
                ))}
              </div>
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,174,239,0.1) 0%, transparent 60%)' }} />
          </div>
        ))}
      </div>

      {/* Timecode overlay */}
      <div className="absolute top-12 right-12 z-20 font-mono text-[10px] text-white/15 tracking-widest text-right">
        <div>SEQUENCE: PIPELINE_V2</div>
        <div>TIMELINE: 00:00 — 04:00</div>
      </div>
    </section>
  )
}
