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
          { z: startZ, opacity: 0, rotateY: (i % 2 === 0 ? 30 : -30), rotateX: gsap.utils.random(-15, 15), scale: 0.5 },
          { z: 100, opacity: 1, rotateY: 0, rotateX: 0, scale: 1, ease: 'none', duration: parallaxRate },
          0.1 + (i * 0.08)
        )

        // Then they gently drift, creating a subtle parallax, instead of flying out
        tl.to(thumb,
          { z: 300, y: (i % 2 === 0 ? -40 : 40), rotateY: (i % 2 === 0 ? 5 : -5), ease: 'none', duration: 0.5 },
          0.5 + (i * 0.03)
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
        {[
          { src: '/images/portfolio-production.png', cls: 'top-[10%] left-[5%] w-48 h-28', title: 'Production Reel' },
          { src: '/images/portfolio-brand.png', cls: 'top-[60%] right-[8%] w-64 h-36', title: 'Brand Campaign' },
          { src: '/images/portfolio-social.png', cls: 'top-[20%] right-[20%] w-36 h-48', title: 'Social Series' },
          { src: '/images/portfolio-event.png', cls: 'bottom-[15%] left-[20%] w-56 h-32', title: 'Event Coverage' },
        ].map((item, i) => (
          <div key={i} className={`media-thumb absolute ${item.cls}`} style={{ transformStyle: 'preserve-3d' }}>
            <div className="w-full h-full rounded-lg overflow-hidden border border-white/10 cursor-pointer group hover:shadow-[0_0_30px_rgba(0,174,239,0.3)] hover:border-white/30 transition-all duration-500 hover:scale-[1.05] relative bg-[#030305]">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent opacity-80" />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              {/* Title label */}
              <div className="absolute bottom-3 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-xs font-mono text-white tracking-widest uppercase font-semibold drop-shadow-md">{item.title}</span>
              </div>
            </div>
          </div>
        ))}
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
