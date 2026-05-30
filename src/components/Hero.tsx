'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const enterTl = gsap.timeline({ delay: 0.3 })
      
      // Title letters fly in from deep Z
      enterTl.fromTo('.hero-letter',
        { opacity: 0, y: 100, rotateX: -90, z: -500 },
        { opacity: 1, y: 0, rotateX: 0, z: 0, duration: 1.2, stagger: 0.04, ease: 'power4.out' }, 0.2)
      
      // Subtitle slides up
      enterTl.fromTo('.hero-subtitle',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8)
      
      // CTAs fly in from sides
      enterTl.fromTo('.hero-cta',
        { opacity: 0, x: -80, rotateY: 45 },
        { opacity: 1, x: 0, rotateY: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' }, 1)
      
      // HUD elements fade in
      enterTl.fromTo('.hud-element',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, stagger: 0.1 }, 1.2)

      // REC indicator blink
      gsap.to('.rec-dot', {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })

      // Exposure meter animation
      gsap.to('.exposure-bar', {
        scaleY: () => gsap.utils.random(0.3, 1),
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.05, repeat: -1, yoyo: true },
        ease: 'none'
      })

      // SCROLL-OUT: Dolly zoom effect - everything pulls back
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        }
      })

      // Viewfinder appears in the center ONLY when scrolling starts
      scrollTl.fromTo('.vf-frame', 
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)

      // Camera pulls back - everything shrinks into distance
      scrollTl.to('.hero-content', {
        z: -2000,
        rotateX: 15,
        opacity: 0,
        scale: 0.3,
        duration: 1,
        ease: 'none'
      }, 0.2)

      // Viewfinder expands outward and fades out towards the end
      scrollTl.to('.vf-frame', {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
      }, 0.4)

      // Film grain intensifies
      scrollTl.to('.grain-overlay', {
        opacity: 0.15,
        duration: 1,
        ease: 'none'
      }, 0)

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  const slateLetters = 'SLATE'.split('')
  const cinemaLetters = 'CINEMA'.split('')

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#030305]">
        <iframe
          src="https://www.youtube.com/embed/QyhwSYhX09s?autoplay=1&mute=1&controls=0&loop=1&playlist=QyhwSYhX09s&playsinline=1&showinfo=0&rel=0"
          className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Film grain overlay */}
      <div className="grain-overlay absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }} />

      {/* Camera Viewfinder Frame */}
      <div className="vf-frame absolute inset-0 z-30 pointer-events-none">
        {/* Corner brackets */}
        <div className="vf-corner absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/40" />
        <div className="vf-corner absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/40" />
        <div className="vf-corner absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/40" />
        <div className="vf-corner absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/40" />
        
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-[1px] bg-white/20 absolute -left-12 top-1/2" />
          <div className="w-8 h-[1px] bg-white/20 absolute -right-12 top-1/2" />
          <div className="w-[1px] h-8 bg-white/20 absolute left-1/2 -top-12" />
          <div className="w-[1px] h-8 bg-white/20 absolute left-1/2 -bottom-12" />
          <div className="w-3 h-3 border border-white/30 rounded-full" />
        </div>

        {/* Focus bracket center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32">
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#00AEEF]/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#00AEEF]/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#00AEEF]/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#00AEEF]/50" />
        </div>
      </div>

      {/* HUD Elements */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* REC indicator */}
        <div className="hud-element absolute top-12 right-24 flex items-center gap-2">
          <div className="rec-dot w-2 h-2 rounded-full bg-red-500" />
          <span className="text-red-500 font-mono text-xs tracking-widest">REC</span>
        </div>

        {/* Timecode */}
        <div className="hud-element absolute top-12 left-24 font-mono text-xs text-white/40 tracking-widest">
          01:00:24:07
        </div>

        {/* Exposure meter - right side */}
        <div className="hud-element absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-[2px]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="exposure-bar w-4 h-1 origin-right" style={{ background: i < 4 ? '#00AEEF' : i < 8 ? '#ffffff33' : '#ffffff15', transform: `scaleY(${Math.random()})` }} />
          ))}
        </div>

        {/* Aspect ratio label */}
        <div className="hud-element absolute bottom-12 left-24 font-mono text-[10px] text-white/25 tracking-widest">
          2.39:1 ANAMORPHIC
        </div>

        {/* ISO / Shutter / FPS */}
        <div className="hud-element absolute bottom-12 right-24 font-mono text-[10px] text-white/25 tracking-widest flex gap-6">
          <span>ISO 800</span>
          <span>1/48</span>
          <span>24fps</span>
        </div>

        {/* Color temp indicator */}
        <div className="hud-element absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          <div className="w-1 h-20 rounded-full overflow-hidden">
            <div className="w-full h-full" style={{ background: 'linear-gradient(to bottom, #ff9500, #ffffff, #00AEEF)' }} />
          </div>
          <span className="font-mono text-[9px] text-white/25 mt-1">5600K</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="hero-content absolute inset-0 z-10 flex flex-col items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Radial spotlight */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,174,239,0.08) 0%, transparent 70%)' }} />

        {/* Title */}
        <div className="flex items-baseline gap-4 md:gap-6 mb-6" style={{ perspective: '1000px' }}>
          <div className="flex">
            {slateLetters.map((letter, i) => (
              <span key={`s-${i}`} className="hero-letter inline-block text-6xl md:text-8xl lg:text-[10rem] font-bold text-white tracking-tighter leading-none" style={{ transformStyle: 'preserve-3d' }}>
                {letter}
              </span>
            ))}
          </div>
          <div className="flex">
            {cinemaLetters.map((letter, i) => (
              <span key={`c-${i}`} className="hero-letter inline-block text-6xl md:text-8xl lg:text-[10rem] font-bold text-[#00AEEF] tracking-tighter leading-none" style={{ transformStyle: 'preserve-3d' }}>
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle text-xs md:text-sm font-mono tracking-[0.4em] text-white/50 uppercase mb-12">
          Video Marketing At Your Fingertips
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 justify-center" style={{ perspective: '800px' }}>
          <span className="hero-subtitle font-mono text-[10px] text-white/30 tracking-widest uppercase mr-4">Quick Links:</span>
          <a href="#reel" className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden" style={{ transformStyle: 'preserve-3d', background: 'rgba(0,174,239,0.1)', border: '1px solid rgba(0,174,239,0.3)' }}>
            <div className="absolute inset-0 bg-[#00AEEF] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <span className="relative text-sm font-medium text-white tracking-wide">Watch Our Reel</span>
          </a>
          <a href="#quote" className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden" style={{ transformStyle: 'preserve-3d', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <span className="relative text-sm font-medium text-white/70 group-hover:text-white tracking-wide transition-colors">Get A Quote</span>
          </a>
          <a href="#how" className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden" style={{ transformStyle: 'preserve-3d', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <span className="relative text-sm font-medium text-white/70 group-hover:text-white tracking-wide transition-colors">How It Works</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">Scroll to explore</span>
          <div className="w-[1px] h-12 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-[#00AEEF] to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
