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
    const ctx = gsap.context(() => {
      // Horizontal scroll section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        }
      })

      // Move the cards container horizontally
      tl.to('.cards-container', {
        x: () => {
          const container = document.querySelector('.cards-container') as HTMLElement
          return -(container.scrollWidth - window.innerWidth + 100)
        },
        ease: 'none',
      })

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  // Hover magnetic effect for the cards
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
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col justify-center" style={{ perspective: '1200px' }}>
      
      {/* Background decoration */}
      <div className="absolute top-12 left-12 z-0 font-mono text-[10px] text-white/10 tracking-widest uppercase">
        <span className="block mb-2">SYSTEM.STANDARDS</span>
        <span className="block text-[#00AEEF]">VERSION 4.2</span>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.05)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full pl-12 md:pl-24">
        
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-16">
          Leading Industry Standards
        </h2>

        {/* Cards track */}
        <div className="cards-container flex gap-8 w-max pr-24" style={{ transformStyle: 'preserve-3d' }}>
          {standards.map((std, i) => (
            <div
              key={i}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className="w-[350px] md:w-[450px] h-[400px] shrink-0 rounded-2xl p-10 relative overflow-hidden group cursor-none"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Giant number background */}
              <div className="absolute -bottom-10 -right-10 text-[200px] font-bold text-white/[0.02] font-mono leading-none pointer-events-none group-hover:text-[#00AEEF]/5 transition-colors duration-500" style={{ transform: 'translateZ(-50px)' }}>
                {std.num}
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: 'translateZ(30px)' }}>
                <div>
                  <div className="w-12 h-12 rounded-full border border-[#00AEEF]/30 flex items-center justify-center mb-6">
                    <span className="font-mono text-sm text-[#00AEEF]">{std.num}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{std.title}</h3>
                </div>
                <p className="text-white/40 text-lg leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                  {std.desc}
                </p>
              </div>

              {/* Hover overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF]/0 to-[#00AEEF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
