'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const standards = [
  {
    num: '01',
    title: 'Strategy',
    desc: 'Campaigns start with a clear purpose, audience, and platform plan. Every creative decision traces back to a defined objective.',
    details: ['Audience research', 'Platform analysis', 'Campaign architecture', 'KPI definition'],
  },
  {
    num: '02',
    title: 'Storytelling',
    desc: 'Every cut, hook, sound, and frame is shaped to hold attention. We build narratives that make people stop scrolling.',
    details: ['Script development', 'Visual narrative', 'Emotional pacing', 'Hook engineering'],
  },
  {
    num: '03',
    title: 'Execution',
    desc: 'Production, editing, VFX, sound, and delivery are handled end-to-end with zero compromise on quality.',
    details: ['4K+ production', 'Color science', 'Sound design', 'Multi-platform export'],
  },
]

export default function IndustryStandards() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.standard-card')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1,
        }
      })

      // Giant watermark slides across
      tl.fromTo('.ind-watermark',
        { xPercent: 50 },
        { xPercent: -50, ease: 'none', duration: 1 },
        0
      )

      // Cards unstack - they start stacked behind each other and fan out
      cards.forEach((card, i) => {
        const startZ = -(cards.length - i) * 200
        const startRotateY = (i - 1) * -15

        // Initially stacked
        gsap.set(card, {
          z: startZ,
          rotateY: startRotateY,
          scale: 1 - ((cards.length - 1 - i) * 0.05),
          opacity: i === cards.length - 1 ? 1 : 0.3,
        })

        // Fan out into place
        const spreadStart = i * 0.15
        tl.to(card, {
          z: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          x: (i - 1) * 420,
          duration: 0.3,
          ease: 'power3.out',
        }, spreadStart)

        // Each card's inner elements reveal
        tl.fromTo(card.querySelectorAll('.detail-item'),
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, stagger: 0.03, duration: 0.15, ease: 'power2.out' },
          spreadStart + 0.15
        )
      })

      // Title entrance
      tl.fromTo('.ind-title',
        { y: 60, opacity: 0, rotateX: -30 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.2, ease: 'power3.out' },
        0
      )

      // Lens element rotates
      tl.to('.lens-ring', { rotation: 360, ease: 'none', duration: 1 }, 0)

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1500px', perspectiveOrigin: '50% 50%' }}>
      
      {/* Giant watermark */}
      <div className="ind-watermark absolute top-1/2 left-0 -translate-y-1/2 z-0 pointer-events-none select-none whitespace-nowrap">
        <span className="text-[20vw] font-bold tracking-tighter text-white/[0.02]">SLATE CINEMA</span>
      </div>

      {/* Lens ring decoration */}
      <div className="lens-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#00AEEF" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#fff" strokeWidth="0.3" strokeDasharray="2 6" />
          {/* Focus marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2
            const x1 = 100 + Math.cos(angle) * 85
            const y1 = 100 + Math.sin(angle) * 85
            const x2 = 100 + Math.cos(angle) * 95
            const y2 = 100 + Math.sin(angle) * 95
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="0.5" />
          })}
        </svg>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-24">
        {/* Header */}
        <div className="ind-title mb-16" style={{ transformStyle: 'preserve-3d' }}>
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Industry Standards</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]">
            Leading Industry<br />Standards
          </h2>
          <p className="text-base text-white/30 mt-4 max-w-lg leading-relaxed">
            At Slate Cinema, we lead in social media campaigns with engaging, informative videos that tell stories.
          </p>
        </div>

        {/* Cards container */}
        <div className="flex justify-center items-center" style={{ transformStyle: 'preserve-3d' }}>
          {standards.map((std, i) => (
            <div
              key={i}
              className="standard-card absolute w-[380px] group cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="rounded-2xl overflow-hidden relative" style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}>
                {/* Card header - like a clip bin */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00AEEF]" />
                    <span className="font-mono text-[10px] text-white/40 tracking-widest">{std.title.toUpperCase()}</span>
                  </div>
                  <span className="font-mono text-[10px] text-white/20">{std.num}/03</span>
                </div>

                <div className="p-8">
                  {/* Number + Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full border border-[#00AEEF]/30 flex items-center justify-center shrink-0" style={{ background: 'rgba(0,174,239,0.05)' }}>
                      <span className="font-mono text-sm text-[#00AEEF] font-bold">{std.num}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{std.title}</h3>
                      <p className="text-sm text-white/35 leading-relaxed">{std.desc}</p>
                    </div>
                  </div>

                  {/* Detail items */}
                  <div className="space-y-2 mt-6 pt-6 border-t border-white/[0.04]">
                    {std.details.map((detail, j) => (
                      <div key={j} className="detail-item flex items-center gap-3 text-sm text-white/40 group-hover:text-white/60 transition-colors">
                        <div className="w-4 h-[1px] bg-[#00AEEF]/40" />
                        <span className="font-mono text-xs tracking-wide">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom glow line */}
                <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[#00AEEF]/50 to-transparent transition-all duration-700 absolute bottom-0 left-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata overlay */}
      <div className="absolute bottom-8 right-12 font-mono text-[9px] text-white/10 tracking-widest text-right z-20">
        <div>CODEC: H.265 HEVC</div>
        <div>COLOR: REC.2020 / HDR10</div>
      </div>
    </section>
  )
}
