'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'

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
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.5
      }
    })

    // Spotlight reveal effect on text and cards
    tl.fromTo('.standard-card', 
      { y: 100, opacity: 0, rotationX: -20 },
      { y: 0, opacity: 1, rotationX: 0, stagger: 0.2, duration: 1, ease: 'power2.out' }
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#030305] overflow-hidden">
      {/* Background silhouette & spotlight */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none mix-blend-luminosity">
        <div className="w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(0,174,239,0.15)_0%,transparent_70%)] rounded-full blur-3xl translate-y-1/4"></div>
      </div>
      
      {/* Huge subtle text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 opacity-[0.03] pointer-events-none">
        <span className="text-[15vw] font-bold tracking-tighter text-white whitespace-nowrap">SLATE CINEMA</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Leading Industry Standards
          </h2>
          <p className="text-xl text-[#8E96AA] leading-relaxed">
            At Slate Cinema, every campaign is built with a balance of strategy, storytelling, and technical execution. From concept development to VFX, sound design, and final delivery, our process is designed to make production feel simple for the client and powerful for the audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
          {standards.map((std, i) => (
            <div key={i} className="standard-card glass-panel p-10 rounded-2xl border-t border-white/20 hover:bg-white/5 transition-colors duration-500 group">
              <div className="w-12 h-12 rounded-full bg-[#111B3A] flex items-center justify-center mb-8 border border-white/10 group-hover:border-[#00AEEF]/50 transition-colors">
                <span className="text-[#00AEEF] font-mono font-bold">{i + 1}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{std.title}</h3>
              <p className="text-[#8E96AA] leading-relaxed">{std.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
