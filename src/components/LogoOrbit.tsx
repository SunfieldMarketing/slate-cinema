'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const logos = [
  'Meta', 'alo', 'BIRCH', 'American Dream', 'BH', 'QuickFrame', 'Brigit', 'Camp HASC', 'JEM', 'Aryeh Realty', 'Sensible Auto Lending'
]

const reviews = [
  '"Creative, professional, and easy to work with."',
  '"Highly recommend his videography work."',
  '"Best quality work and good experience."'
]

export default function LogoOrbit() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.to('.logo-track-1', {
      xPercent: -50,
      ease: 'none',
      duration: 40,
      repeat: -1
    })
    gsap.to('.logo-track-2', {
      xPercent: 50,
      ease: 'none',
      duration: 35,
      repeat: -1
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full py-24 bg-[#030305] border-y border-white/5 overflow-hidden">
      {/* Spotlight background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,174,239,0.05)_0%,transparent_70%)] rounded-full" />
      </div>

      <div className="text-center mb-16 px-6 relative z-10">
        <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-6">Join the Leaders Working with Us</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
          Trusted by Brands, Creators,<br className="hidden md:block" /> and Teams Moving Fast
        </h2>
        
        {/* Google Rating Badge */}
        <div className="mt-10 inline-flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-full px-8 py-3 backdrop-blur-sm">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-white">5.0</span>
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-sm text-[#8E96AA]">44 Google Reviews</span>
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-sm text-[#8E96AA]">Brooklyn, NY</span>
        </div>
      </div>

      {/* Logo Marquee Row 1 */}
      <div className="relative w-full flex overflow-hidden mb-6" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="logo-track-1 flex items-center gap-20 min-w-max px-10">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div key={i} className="text-2xl md:text-3xl font-bold text-white/20 hover:text-white/60 transition-all duration-500 select-none cursor-default whitespace-nowrap">
              {logo}
            </div>
          ))}
        </div>
      </div>

      {/* Logo Marquee Row 2 (reverse) */}
      <div className="relative w-full flex overflow-hidden mb-16" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="logo-track-2 flex items-center gap-20 min-w-max px-10 -translate-x-1/2">
          {[...logos.reverse(), ...logos, ...logos].map((logo, i) => (
            <div key={i} className="text-xl md:text-2xl font-bold text-white/10 hover:text-white/40 transition-all duration-500 select-none cursor-default whitespace-nowrap">
              {logo}
            </div>
          ))}
        </div>
      </div>

      {/* Review snippets */}
      <div className="flex flex-wrap justify-center gap-6 px-6 max-w-5xl mx-auto">
        {reviews.map((review, i) => (
          <div key={i} className="px-6 py-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm max-w-xs">
            <p className="text-sm text-[#8E96AA] italic leading-relaxed">{review}</p>
            <div className="flex gap-0.5 mt-3">
              {[1,2,3,4,5].map(j => (
                <svg key={j} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
