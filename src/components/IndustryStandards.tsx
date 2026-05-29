'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const standards = [
  {
    title: "Strategy",
    desc: "Campaigns start with a clear purpose, audience, and platform plan."
  },
  {
    title: "Storytelling",
    desc: "Every cut, hook, sound, and frame is shaped to hold attention."
  },
  {
    title: "Execution",
    desc: "Production, editing, VFX, sound, and delivery are handled end-to-end."
  }
]

export default function IndustryStandards() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo('.std-card',
      { y: 80, opacity: 0, rotateX: -15 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full py-32 md:py-40 bg-[#030305] overflow-hidden">
      {/* Spotlight */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[900px] h-[900px] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.06) 0%, transparent 60%)' }} />
      </div>
      
      {/* Massive watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[18vw] font-bold tracking-tighter text-white whitespace-nowrap">SLATE CINEMA</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-20">
          <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-6">Why Us</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.05]">
            Leading Industry Standards
          </h2>
          <p className="text-xl text-[#8E96AA] leading-relaxed">
            At Slate Cinema, we lead in social media campaigns with engaging, informative videos that tell stories. Our innovative approach captivates audiences, driving meaningful engagement and global impact, redefining industry standards with every campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {standards.map((std, i) => (
            <div key={i} className="std-card rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-[-8px] group" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="p-8 md:p-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:border-[#00AEEF]/40 transition-colors duration-500" style={{ background: 'rgba(0,174,239,0.05)' }}>
                  <span className="text-[#00AEEF] font-mono font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{std.title}</h3>
                <p className="text-[#8E96AA] leading-relaxed">{std.desc}</p>
              </div>
              {/* Bottom accent line */}
              <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[#00AEEF]/50 to-transparent transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
