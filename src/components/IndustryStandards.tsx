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
  },
  {
    num: '02',
    title: 'Storytelling',
    desc: 'Every cut, hook, sound, and frame is shaped to hold attention. We build narratives that make people stop scrolling.',
  },
  {
    num: '03',
    title: 'Execution',
    desc: 'Production, editing, VFX, sound, and delivery are handled end-to-end with zero compromise on quality.',
  },
]

export default function IndustryStandards() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray('.standard-card') as HTMLElement[]
    const triggers = gsap.utils.toArray('.card-sticky-container') as HTMLElement[]

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return
      
      const nextTrigger = triggers[i + 1]
      
      gsap.to(card, {
        scale: 0.92,
        opacity: 0.3,
        filter: 'blur(8px)',
        scrollTrigger: {
          trigger: nextTrigger,
          start: 'top bottom',
          end: 'top 20%',
          scrub: true,
        }
      })
    })
  }, { scope: containerRef })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(e.currentTarget, { rotateY: x * 15, rotateX: -y * 15, duration: 0.3, ease: 'power2.out' })
  }

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' })
  }

  return (
    <section ref={containerRef} className="relative w-full bg-[#030305] px-6 py-24 md:px-24 md:py-32">
      
      {/* Background decoration */}
      <div className="absolute top-12 left-12 z-0 font-mono text-[10px] text-white/10 tracking-widest uppercase hidden md:block">
        <span className="block mb-2">SYSTEM.STANDARDS</span>
        <span className="block text-[#00AEEF]">VERSION 4.2</span>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.05)_0%,transparent_70%)]" />

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        
        {/* Sticky Title */}
        <div className="sticky top-24 mb-32 z-0">
          <h2 className="text-4xl md:text-6xl md:text-[5rem] font-bold text-white tracking-tight leading-tight">
            Leading Industry<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Standards</span>
          </h2>
        </div>

        {/* Vertical Stacking Cards */}
        <div className="relative z-10 flex flex-col pb-[20vh]">
          {standards.map((std, i) => (
            <div
              key={i}
              className={`card-sticky-container sticky w-full ${i !== standards.length - 1 ? 'mb-[40vh]' : ''}`}
              style={{ 
                top: `calc(20vh + ${i * 40}px)`, 
                perspective: '1200px',
                zIndex: i + 1 
              }}
            >
              <div
                className="standard-card w-full h-[60vh] md:h-[500px] rounded-3xl p-8 md:p-14 flex flex-col justify-between overflow-hidden group cursor-none"
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{
                  background: 'linear-gradient(145deg, rgba(20,20,22,0.9) 0%, rgba(10,10,12,0.95) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 -30px 60px rgba(0,0,0,0.8)',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Giant number background */}
                <div 
                  className="absolute -bottom-10 -right-10 text-[150px] md:text-[250px] font-bold text-white/[0.02] font-mono leading-none pointer-events-none group-hover:text-[#00AEEF]/5 transition-colors duration-700" 
                  style={{ transform: 'translateZ(-50px)' }}
                >
                  {std.num}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: 'translateZ(30px)' }}>
                  <div className="w-14 h-14 rounded-full border border-[#00AEEF]/30 bg-[#00AEEF]/5 flex items-center justify-center mb-8 md:mb-0">
                    <span className="font-mono text-sm text-[#00AEEF] tracking-wider">{std.num}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">{std.title}</h3>
                    <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl group-hover:text-white/80 transition-colors duration-500 font-light">
                      {std.desc}
                    </p>
                  </div>
                </div>

                {/* Hover overlay glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF]/0 via-transparent to-[#00AEEF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
