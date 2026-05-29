'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const logos = [
  'Meta', 'alo', 'BIRCH', 'American Dream', 'BH', 'QuickFrame', 'Brigit', 'Camp HASC', 'JEM', 'Aryeh Realty', 'Sensible Auto'
]

export default function LogoOrbit() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Simple marquee effect for logos
    gsap.to('.logo-track', {
      xPercent: -50,
      ease: 'none',
      duration: 30,
      repeat: -1
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full py-24 bg-[#050608] border-y border-white/5 overflow-hidden flex flex-col items-center">
      <div className="text-center mb-16 px-6 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Trusted by Brands, Creators, and Teams Moving Fast
        </h2>
        <p className="text-[#8E96AA] text-lg">Join the leaders working with Slate Cinema.</p>
        
        <div className="mt-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-2 backdrop-blur-sm">
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-white">5.0 Google Rating</span>
          <span className="text-sm text-[#8E96AA] border-l border-white/20 pl-3">44 Reviews</span>
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden mask-edges pb-8">
        <div className="logo-track flex items-center gap-16 min-w-max px-8">
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="text-2xl md:text-4xl font-bold text-white/30 hover:text-white transition-colors duration-300 select-none">
              {logo}
            </div>
          ))}
        </div>
      </div>
      
      {/* CSS for edge masking */}
      <style jsx>{`
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </section>
  )
}
