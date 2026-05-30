'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Crosshair, Film, Zap, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const standards = [
  {
    num: '01',
    title: 'Strategy',
    icon: Crosshair,
    desc: 'Campaigns start with a clear purpose, audience, and platform plan. Every creative decision traces back to a defined objective.',
    details: ['Audience Research', 'Platform Mapping', 'Content Calendar', 'KPI Frameworks'],
    ringColor: '#00AEEF',
    ringRotation: 0,
  },
  {
    num: '02',
    title: 'Storytelling',
    icon: Film,
    desc: 'Every cut, hook, sound, and frame is shaped to hold attention. We build narratives that make people stop scrolling.',
    details: ['Script Development', 'Shot Design', 'Emotional Arcs', 'Hook Engineering'],
    ringColor: '#8B5CF6',
    ringRotation: 120,
  },
  {
    num: '03',
    title: 'Execution',
    icon: Zap,
    desc: 'Production, editing, VFX, sound, and delivery are handled end-to-end with zero compromise on quality.',
    details: ['4K+ Production', 'Color Science', 'Sound Design', 'Platform Delivery'],
    ringColor: '#10B981',
    ringRotation: 240,
  },
]

export default function IndustryStandards() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = standards[activeIndex]

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.standards-entrance',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 70%', end: 'top 30%', scrub: 1 }
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  const handleSelect = (index: number) => {
    if (index === activeIndex) return

    // Animate the central visual out then in
    gsap.to('.control-visual', {
      scale: 0.85, opacity: 0, rotateY: index > activeIndex ? 25 : -25, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(index)
        gsap.fromTo('.control-visual',
          { scale: 0.85, opacity: 0, rotateY: index > activeIndex ? -25 : 25 },
          { scale: 1, opacity: 1, rotateY: 0, duration: 0.5, ease: 'power3.out' }
        )
      }
    })

    // Animate the detail list
    gsap.to('.detail-list', {
      y: 20, opacity: 0, duration: 0.2,
      onComplete: () => {
        gsap.fromTo('.detail-list', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
      }
    })
  }

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-[#030305] py-24 md:py-32 px-6 md:px-16 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      <div className="standards-entrance max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Control Panel</span>
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-6">
            Leading Industry<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Standards</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto leading-relaxed">
            At Slate Cinema, we lead in social media campaigns with engaging, informative videos that tell stories.
          </p>
        </div>

        {/* Control Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Tab Controls */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {standards.map((std, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${
                  i === activeIndex
                    ? 'bg-white/[0.05] border-[#00AEEF]/30 shadow-[0_0_30px_rgba(0,174,239,0.1)]'
                    : 'bg-white/[0.01] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.03]'
                }`}
              >
                {i === activeIndex && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00AEEF] rounded-full" />
                )}
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    i === activeIndex ? 'bg-[#00AEEF]/15 border border-[#00AEEF]/30' : 'bg-white/5 border border-white/10'
                  }`}>
                    <std.icon size={18} className={`transition-colors duration-300 ${i === activeIndex ? 'text-[#00AEEF]' : 'text-white/40'}`} />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-white/30 tracking-wider">{std.num}</span>
                    <p className={`text-lg font-bold transition-colors duration-300 ${i === activeIndex ? 'text-white' : 'text-white/50'}`}>{std.title}</p>
                  </div>
                  <ChevronRight size={16} className={`ml-auto transition-all duration-300 ${i === activeIndex ? 'text-[#00AEEF] translate-x-0 opacity-100' : 'text-white/20 -translate-x-2 opacity-0'}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Center: 3D Visual */}
          <div className="lg:col-span-5 flex items-center justify-center py-8" style={{ perspective: '1200px' }}>
            <div className="control-visual relative w-64 h-64 md:w-80 md:h-80" style={{ transformStyle: 'preserve-3d' }}>

              {/* Rotating rings */}
              <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="90" fill="none" stroke={active.ringColor} strokeWidth="0.5" strokeDasharray="8 6" opacity="0.4" />
                  <circle cx="100" cy="100" r="75" fill="none" stroke={active.ringColor} strokeWidth="0.3" strokeDasharray="4 8" opacity="0.25" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke={active.ringColor} strokeWidth="0.5" opacity="0.15" />
                </svg>
              </div>

              {/* Counter-rotating ring */}
              <div className="absolute inset-4 animate-[spin_30s_linear_infinite_reverse]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="2 12" opacity="0.1" />
                </svg>
              </div>

              {/* Central glow */}
              <div
                className="absolute inset-0 rounded-full transition-colors duration-700"
                style={{ background: `radial-gradient(circle, ${active.ringColor}15 0%, transparent 70%)` }}
              />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-2xl border flex items-center justify-center transition-all duration-500"
                  style={{
                    borderColor: `${active.ringColor}40`,
                    background: `${active.ringColor}10`,
                    boxShadow: `0 0 60px ${active.ringColor}20`,
                  }}
                >
                  <active.icon size={36} style={{ color: active.ringColor }} />
                </div>
              </div>

              {/* Floating data points around the ring */}
              {active.details.map((detail, i) => {
                const angle = (i / active.details.length) * 360 + active.ringRotation
                const rad = (angle * Math.PI) / 180
                const radius = 42
                const x = 50 + Math.cos(rad) * radius
                const y = 50 + Math.sin(rad) * radius
                return (
                  <div
                    key={`${activeIndex}-${i}`}
                    className="absolute transition-all duration-500"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-3 h-3 rounded-full border border-white/20 bg-white/5 hover:bg-[#00AEEF]/20 hover:border-[#00AEEF]/40 transition-all duration-300 cursor-default group relative">
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-[9px] font-mono text-white/60 bg-[#030305]/90 border border-white/10 px-2 py-1 rounded-md">{detail}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="detail-list">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl border flex items-center justify-center"
                  style={{ borderColor: `${active.ringColor}30`, background: `${active.ringColor}10` }}
                >
                  <span className="font-mono text-sm font-bold" style={{ color: active.ringColor }}>{active.num}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{active.title}</h3>
              </div>

              <p className="text-white/50 text-lg leading-relaxed mb-8">{active.desc}</p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {active.details.map((detail, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-full border bg-white/[0.02] text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300 cursor-default"
                    style={{ borderColor: `${active.ringColor}15` }}
                  >
                    {detail}
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="flex gap-2 items-center">
                {standards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeIndex ? 'w-8' : 'w-3 bg-white/10 hover:bg-white/20'
                    }`}
                    style={i === activeIndex ? { background: active.ringColor } : {}}
                  />
                ))}
                <span className="ml-3 font-mono text-[10px] text-white/30">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(standards.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
