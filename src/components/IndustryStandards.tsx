'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const standards = [
  {
    title: "Strategy",
    desc: "Campaigns start with a clear purpose, audience, and platform plan.",
    rotY: -90,
    rotX: 0,
    originX: -200,
    originY: 0
  },
  {
    title: "Storytelling",
    desc: "Every cut, hook, sound, and frame is shaped to hold attention.",
    rotY: 0,
    rotX: 90,
    originX: 0,
    originY: 200
  },
  {
    title: "Execution",
    desc: "Production, editing, VFX, sound, and delivery are handled end-to-end.",
    rotY: 90,
    rotX: 0,
    originX: 200,
    originY: 0
  }
]

export default function IndustryStandards() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
      }
    })

    // Progress bar
    tl.fromTo('.ind-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)

    // Watermark moves and scales
    tl.fromTo('.ind-watermark',
      { x: '100%', scale: 1 },
      { x: '-100%', scale: 1.5, ease: 'none' },
      0
    )

    // Title words assemble
    tl.fromTo('.ind-title-word',
      { opacity: 0, z: -500, rotateX: () => gsap.utils.random(-90, 90) },
      { opacity: 1, z: 0, rotateX: 0, stagger: 0.1, ease: 'power2.out' },
      0.1
    )

    // Cards animate in sequentially (one per 100vh essentially)
    standards.forEach((std, i) => {
      const startTime = 0.2 + (i * 0.25)
      tl.fromTo(`.ind-card-${i}`,
        { 
          opacity: 0, 
          rotateY: std.rotY, 
          rotateX: std.rotX, 
          x: std.originX,
          y: std.originY,
          z: -500
        },
        { 
          opacity: 1, 
          rotateY: 0, 
          rotateX: 0, 
          x: 0,
          y: 0,
          z: 0,
          duration: 0.25,
          ease: 'power2.out'
        },
        startTime
      )
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex items-center justify-center">
      
      <div className="ind-progress absolute top-0 left-0 h-1 bg-[#00AEEF] w-full origin-left z-50" />

      {/* Massive watermark */}
      <div className="ind-watermark absolute top-1/2 left-0 -translate-y-1/2 w-full text-center z-0 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[25vw] font-bold tracking-tighter text-white whitespace-nowrap">SLATE CINEMA</span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-20" style={{ perspective: '1000px' }}>
          <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-6">Why Us</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.05] flex flex-wrap gap-x-4">
            {"Leading Industry Standards".split(' ').map((w, i) => (
              <span key={i} className="ind-title-word inline-block" style={{ transformStyle: 'preserve-3d' }}>{w}</span>
            ))}
          </h2>
          <p className="text-xl text-[#8E96AA] leading-relaxed">
            At Slate Cinema, we lead in social media campaigns with engaging, informative videos that tell stories. Our innovative approach captivates audiences, driving meaningful engagement and global impact, redefining industry standards with every campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '2000px' }}>
          {standards.map((std, i) => (
            <div key={i} className={`ind-card-${i} relative rounded-2xl overflow-hidden group`} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.12)', transformStyle: 'preserve-3d' }}>
              
              {/* Glowing spotlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,174,239,0.15) 0%, transparent 70%)' }} />

              <div className="p-8 md:p-10 relative z-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:border-[#00AEEF]/40 transition-colors duration-500" style={{ background: 'rgba(0,174,239,0.05)' }}>
                  <span className="text-[#00AEEF] font-mono font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{std.title}</h3>
                <p className="text-[#8E96AA] leading-relaxed">{std.desc}</p>
              </div>
              <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[#00AEEF]/50 to-transparent transition-all duration-700 absolute bottom-0 left-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
