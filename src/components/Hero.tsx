'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Only animate OUT on scroll, hero is fully visible on load
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
      }
    })

    tl.to('.hero-bg-img', { scale: 1.15, opacity: 0.15 }, 0)
    tl.to('.hero-title', { y: -80, opacity: 0 }, 0)
    tl.to('.hero-subtitle', { y: -60, opacity: 0 }, 0.05)
    tl.to('.hero-tagline', { y: -40, opacity: 0 }, 0.1)
    tl.to('.hero-buttons', { y: -20, opacity: 0 }, 0.15)
    tl.to('.hero-frames', { opacity: 0 }, 0.1)
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="hero-bg-img absolute inset-0 z-0">
        <img
          src="/images/hero-bg.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.35) saturate(0.8)' }}
        />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#030305]/70 via-transparent to-[#030305]" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#030305]/40 via-transparent to-[#030305]/40" />
      
      {/* Film grain overlay */}
      <div className="absolute inset-0 z-[2] opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Radial spotlight behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,174,239,0.08) 0%, transparent 60%)' }} />

      {/* Camera viewfinder corners */}
      <div className="hero-frames absolute inset-0 z-[3] pointer-events-none hidden md:block">
        {/* Top-left */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-white/15" />
        {/* Top-right */}
        <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-white/15" />
        {/* Bottom-left */}
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-white/15" />
        {/* Bottom-right */}
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-white/15" />
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/10" />
        </div>
        {/* Frame border */}
        <div className="absolute inset-12 border border-white/[0.04] rounded" />
      </div>

      {/* Main Content — fully visible on load */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        
        {/* Main Title */}
        <h1 className="hero-title text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter leading-none mb-6">
          <span className="text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">SLATE</span>{' '}
          <span className="text-[#00AEEF] drop-shadow-[0_0_60px_rgba(0,174,239,0.3)]">CINEMA</span>
        </h1>
        
        {/* Subtitle */}
        <p className="hero-subtitle text-xs md:text-sm tracking-[0.35em] text-white/70 uppercase font-medium mb-8">
          VIDEO MARKETING AT YOUR FINGERTIPS
        </p>

        {/* Supporting tagline */}
        <p className="hero-tagline text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed mb-12">
          From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement.
        </p>

        {/* Quick Links */}
        <div className="hero-buttons flex flex-col items-center gap-6">
          <p className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">Quick Links</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#portfolio" className="group relative px-8 py-4 rounded-full overflow-hidden border border-[#00AEEF]/40 hover:border-[#00AEEF] transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,174,239,0.2)]">
              <div className="absolute inset-0 bg-[#00AEEF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-sm font-medium tracking-wide text-white">Watch Our Reel</span>
            </a>
            <a href="#quote" className="group relative px-8 py-4 rounded-full overflow-hidden border border-white/15 hover:border-white/40 transition-all duration-500">
              <span className="relative text-sm font-medium tracking-wide text-white/80 group-hover:text-white transition-colors">Get A Quote</span>
            </a>
            <a href="#how-it-works" className="group relative px-8 py-4 rounded-full overflow-hidden border border-white/15 hover:border-white/40 transition-all duration-500">
              <span className="relative text-sm font-medium tracking-wide text-white/80 group-hover:text-white transition-colors">How It Works</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[9px] font-mono tracking-[0.3em] text-white/50 uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
