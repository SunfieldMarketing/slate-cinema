'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const logos = [
  'YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'META', 'LINKEDIN', 'SPOTIFY',
  'VIMEO', 'X/TWITTER', 'SNAPCHAT', 'PINTEREST', 'TWITCH', 'REDDIT',
]

const reviews = [
  { name: 'Sarah Chen', role: 'CMO, TechVenture', text: 'Slate Cinema transformed our brand presence. The content they produced generated 3x our expected engagement.' },
  { name: 'Marcus Rivera', role: 'Founder, Apex Fitness', text: 'Working with Slate felt like having an in-house production team. Every deliverable exceeded expectations.' },
  { name: 'Emily Watson', role: 'VP Marketing, Luxe Co', text: 'The ROI on our video campaigns with Slate has been extraordinary. They understand both craft and conversion.' },
]

export default function LogoOrbit() {
  const containerRef = useRef<HTMLElement>(null)
  const marquee1Ref = useRef<HTMLDivElement>(null)
  const marquee2Ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Film strip marquee - continuous loop
      if (marquee1Ref.current) {
        gsap.to(marquee1Ref.current, {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: 'none',
        })
      }
      if (marquee2Ref.current) {
        gsap.to(marquee2Ref.current, {
          xPercent: 50,
          repeat: -1,
          duration: 35,
          ease: 'none',
        })
      }

      // Review cards rotate in from 3D
      const reviewCards = gsap.utils.toArray<HTMLElement>('.review-card')
      reviewCards.forEach((card, i) => {
        gsap.fromTo(card,
          { z: -500, rotateY: i % 2 === 0 ? 60 : -60, opacity: 0, x: i % 2 === 0 ? -200 : 200 },
          {
            z: 0, rotateY: 0, opacity: 1, x: 0,
            duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 40%', scrub: 1 }
          }
        )
      })

      // Section title
      gsap.fromTo('.orbit-title',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, scrollTrigger: { trigger: containerRef.current, start: 'top 75%', end: 'top 30%', scrub: 1 } }
      )

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  const renderFilmStrip = (items: string[], reverse = false) => (
    <div className="flex items-center gap-0 whitespace-nowrap">
      {[...items, ...items].map((logo, i) => (
        <div key={i} className="flex items-center shrink-0">
          {/* Sprocket hole */}
          <div className="w-8 h-12 flex items-center justify-center shrink-0">
            <div className="w-3 h-5 rounded-sm border border-white/10" />
          </div>
          {/* Logo frame */}
          <div className="px-8 py-4 shrink-0">
            <span className="text-lg font-bold tracking-[0.2em] text-white/15 hover:text-[#00AEEF]/50 transition-colors duration-500 cursor-default">{logo}</span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section ref={containerRef} className="relative w-full py-24 bg-[#030305] overflow-hidden">
      
      {/* Section header */}
      <div className="orbit-title relative z-10 text-center mb-16 px-6">
        <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Trusted Platforms</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Built For Every Platform</h2>
      </div>

      {/* Film strip marquees */}
      <div className="relative mb-20">
        {/* Top film edge */}
        <div className="h-[1px] bg-white/[0.06] mb-2" />
        
        {/* Row 1 - moves left */}
        <div className="overflow-hidden">
          <div ref={marquee1Ref} className="flex">
            {renderFilmStrip(logos)}
          </div>
        </div>
        
        <div className="h-[1px] bg-white/[0.06] my-2" />
        
        {/* Row 2 - moves right */}
        <div className="overflow-hidden">
          <div ref={marquee2Ref} className="flex" style={{ transform: 'translateX(-50%)' }}>
            {renderFilmStrip([...logos].reverse())}
          </div>
        </div>
        
        {/* Bottom film edge */}
        <div className="h-[1px] bg-white/[0.06] mt-2" />

        {/* Film strip edge holes */}
        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#030305] to-transparent z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#030305] to-transparent z-10" />
      </div>

      {/* Reviews */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1500px' }}>
        {reviews.map((review, i) => (
          <div
            key={i}
            className="review-card group p-8 rounded-xl relative overflow-hidden cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Quote mark */}
            <div className="text-5xl text-[#00AEEF]/10 font-serif leading-none mb-4">&ldquo;</div>
            
            <p className="text-sm text-white/50 leading-relaxed mb-6 group-hover:text-white/70 transition-colors">{review.text}</p>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#00AEEF]">{review.name[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{review.name}</p>
                <p className="text-[11px] text-white/25 font-mono">{review.role}</p>
              </div>
            </div>

            {/* Bottom glow */}
            <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[#00AEEF]/40 to-transparent transition-all duration-700 absolute bottom-0 left-0" />
          </div>
        ))}
      </div>
    </section>
  )
}
