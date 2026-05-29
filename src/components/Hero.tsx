'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true
      }
    })

    tl.to(containerRef.current, {
      scale: 1.1,
      filter: 'brightness(0.5) blur(10px)',
    })
    .to(titleRef.current, {
      y: -50,
      opacity: 0,
    }, 0)
    .to(subRef.current, {
      y: -30,
      opacity: 0,
    }, 0)
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-20">
      {/* Background Image Setup */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-luminosity" 
        style={{ backgroundImage: 'url("/placeholder.jpg")' }} // Needs to be replaced with the poolside/lounge cinematic image
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#030305]/80 via-transparent to-[#030305]" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        <h1 ref={titleRef} className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6">
          <span className="block drop-shadow-2xl">SLATE <span className="text-[#00AEEF]">CINEMA</span></span>
        </h1>
        
        <div ref={subRef} className="flex flex-col items-center gap-6">
          <p className="text-sm md:text-base tracking-[0.2em] text-[#8E96AA] uppercase font-semibold">
            Video Marketing at Your Fingertips
          </p>
          <p className="text-lg md:text-xl text-[#F7F8FF]/80 max-w-2xl font-light leading-relaxed">
            From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button className="glass-panel px-8 py-4 rounded-full text-white font-medium tracking-wide hover:bg-white/10 transition-all duration-300 relative group overflow-hidden">
              <span className="relative z-10">Watch Our Reel</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF]/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button className="px-8 py-4 rounded-full text-white font-medium tracking-wide border border-white/20 hover:border-white/50 transition-colors">
              Get A Quote
            </button>
          </div>
        </div>
      </div>

      {/* Decorative 3D Frame Lines */}
      <div className="absolute inset-8 border border-white/5 z-0 pointer-events-none hidden md:block" />
      <div className="absolute inset-12 border border-white/5 z-0 pointer-events-none hidden md:block" />
    </section>
  )
}
