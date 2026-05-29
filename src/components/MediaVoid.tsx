'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const lines = [
  { text: 'The content we create', color: '#ffffff' },
  { text: "isn't just eye-catching,", color: '#ffffff' },
  { text: "it's content people", color: '#ffffff' },
  { text: 'actually want to watch.', color: '#00AEEF' },
]

export default function MediaVoid() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1,
        }
      })

      // Color grading wheel rotates in background
      tl.to('.color-wheel', { rotation: 360, ease: 'none', duration: 1 }, 0)

      // Each line of text assembles from scattered 3D positions
      lines.forEach((_, i) => {
        const words = gsap.utils.toArray<HTMLElement>(`.mv-word-${i}`)
        const start = i * 0.2

        tl.fromTo(words,
          {
            opacity: 0,
            y: () => gsap.utils.random(-200, 200),
            x: () => gsap.utils.random(-400, 400),
            z: () => gsap.utils.random(-800, -200),
            rotateX: () => gsap.utils.random(-90, 90),
            rotateY: () => gsap.utils.random(-90, 90),
            scale: () => gsap.utils.random(0.3, 2),
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            stagger: 0.02,
            ease: 'power3.out',
            duration: 0.2,
          },
          start
        )
      })

      // After all text is assembled, everything flies past camera
      tl.to('.mv-all-text', {
        z: 2000,
        opacity: 0,
        scale: 3,
        duration: 0.15,
        ease: 'power2.in'
      }, 0.85)

      // Media thumbnails float in from deep Z at different parallax rates
      const thumbs = gsap.utils.toArray<HTMLElement>('.media-thumb')
      thumbs.forEach((thumb, i) => {
        const startZ = -1500 - (i * 500)
        const parallaxRate = 0.15 + (i * 0.05)
        
        tl.fromTo(thumb,
          { z: startZ, opacity: 0, rotateY: (i % 2 === 0 ? 30 : -30), rotateX: gsap.utils.random(-15, 15) },
          { z: 0, opacity: 0.7, rotateY: 0, rotateX: 0, ease: 'none', duration: parallaxRate },
          0.1 + (i * 0.08)
        )

        // Then they fly past camera
        tl.to(thumb,
          { z: 1000, opacity: 0, ease: 'none', duration: 0.15 },
          0.7 + (i * 0.03)
        )
      })

      // Audio waveform animates
      gsap.to('.wave-bar', {
        scaleY: () => gsap.utils.random(0.2, 1),
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.02, repeat: -1, yoyo: true },
        ease: 'none'
      })

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
      
      {/* Color Grading Wheel - background decoration */}
      <div className="color-wheel absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff0000" />
              <stop offset="33%" stopColor="#00ff00" />
              <stop offset="66%" stopColor="#0000ff" />
              <stop offset="100%" stopColor="#ff0000" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="none" stroke="url(#cg1)" strokeWidth="2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="url(#cg1)" strokeWidth="1" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="url(#cg1)" strokeWidth="0.5" />
          {/* Crosshair */}
          <line x1="100" y1="0" x2="100" y2="200" stroke="#fff" strokeWidth="0.3" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="#fff" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Floating media thumbnails at different depths */}
      <div className="absolute inset-0 z-0" style={{ transformStyle: 'preserve-3d' }}>
        <div className="media-thumb absolute top-[10%] left-[5%] w-48 h-28 rounded-lg overflow-hidden border border-white/10" style={{ transformStyle: 'preserve-3d' }}>
          <img src="/images/portfolio-production.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#030305]/60" />
        </div>
        <div className="media-thumb absolute top-[60%] right-[8%] w-64 h-36 rounded-lg overflow-hidden border border-white/10" style={{ transformStyle: 'preserve-3d' }}>
          <img src="/images/portfolio-brand.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#030305]/60" />
        </div>
        <div className="media-thumb absolute top-[20%] right-[20%] w-36 h-48 rounded-lg overflow-hidden border border-white/10" style={{ transformStyle: 'preserve-3d' }}>
          <img src="/images/portfolio-social.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#030305]/60" />
        </div>
        <div className="media-thumb absolute bottom-[15%] left-[20%] w-56 h-32 rounded-lg overflow-hidden border border-white/10" style={{ transformStyle: 'preserve-3d' }}>
          <img src="/images/portfolio-event.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#030305]/60" />
        </div>
      </div>

      {/* Main text content */}
      <div className="mv-all-text absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 md:gap-4" style={{ transformStyle: 'preserve-3d' }}>
        {lines.map((line, i) => (
          <div key={i} className="flex flex-wrap justify-center gap-x-4" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
            {line.text.split(' ').map((word, j) => (
              <span 
                key={j} 
                className={`mv-word-${i} inline-block text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight`}
                style={{ color: line.color, transformStyle: 'preserve-3d' }}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Audio waveform at bottom */}
      <div className="absolute bottom-8 left-12 right-12 z-20 flex items-end gap-[1px] h-6 opacity-20">
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} className="wave-bar flex-1 bg-[#00AEEF] rounded-t-[1px] origin-bottom" style={{ height: `${Math.sin(i * 0.3) * 50 + 50}%` }} />
        ))}
      </div>

      {/* Edit timeline markers */}
      <div className="absolute bottom-20 left-12 z-20 font-mono text-[9px] text-white/15 tracking-widest">
        SEQUENCE: CONTENT_REEL_V3 — DURATION: 02:47
      </div>
    </section>
  )
}
