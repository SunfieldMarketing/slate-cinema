'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !videoRef.current) return

    const video = videoRef.current

    // Wait for video metadata to load to get the duration
    video.onloadedmetadata = () => {
      const duration = video.duration || 5 

      const ctx = gsap.context(() => {
        // --- 1. ENTRANCE ANIMATION (Plays on load for the HTML hero) ---
        const enterTl = gsap.timeline({ delay: 0.3 })
        
        enterTl.fromTo('.hero-letter',
          { opacity: 0, y: 100, rotateX: -90, z: -500 },
          { opacity: 1, y: 0, rotateX: 0, z: 0, duration: 1.2, stagger: 0.04, ease: 'power4.out' }, 0.2)
        
        enterTl.fromTo('.hero-subtitle',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8)
        
        enterTl.fromTo('.hero-cta',
          { opacity: 0, x: -80, rotateY: 45 },
          { opacity: 1, x: 0, rotateY: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' }, 1)
        
        enterTl.fromTo('.hud-element',
          { opacity: 0 },
          { opacity: 1, duration: 0.6, stagger: 0.1 }, 1.2)

        gsap.to('.rec-dot', { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'power1.inOut' })
        gsap.to('.exposure-bar', {
          scaleY: () => gsap.utils.random(0.3, 1), duration: 0.3, repeat: -1, yoyo: true,
          stagger: { each: 0.05, repeat: -1, yoyo: true }, ease: 'none'
        })

        // --- 2. SCROLL ANIMATION (Zoom out HTML -> Fade to Video -> Scrub Video) ---
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=400%', // Massive scroll distance for smooth scrubbing
            pin: true,
            scrub: true, // Instant mapping
          }
        })

        // A. Zoom out the HTML UI slightly and fade it out (0% -> 10% of scroll)
        scrollTl.to('.hero-html-content', {
          scale: 0.9,
          opacity: 0,
          ease: 'power2.inOut',
          duration: 0.1
        }, 0)

        // B. Fade in the video simultaneously
        scrollTl.to('.camera-video-container', {
          opacity: 1,
          ease: 'power2.inOut',
          duration: 0.1
        }, 0)

        // C. Scrub the video from 10% -> 100% of the scroll timeline
        scrollTl.fromTo(video, 
          { currentTime: 0 },
          { currentTime: duration, ease: 'none', duration: 0.9 }, 
          0.1
        )

      }, containerRef)
      return () => ctx.revert()
    }

    if (video.readyState >= 1) {
      video.onloadedmetadata(new Event('loadedmetadata'))
    }

  }, { scope: containerRef })

  const slateLetters = 'SLATE'.split('')
  const cinemaLetters = 'CINEMA'.split('')

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#030305]" style={{ perspective: '2000px' }}>
      
      {/* 1. The 3D Camera Video (Hidden initially, fades in when scrolling starts) */}
      <div className="camera-video-container absolute inset-0 z-10 opacity-0 pointer-events-none">
        <video
          ref={videoRef}
          src="/videos/hero-camera.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. The Original Website HTML UI (Visible on load, zooms/fades out on scroll) */}
      <div className="hero-html-content absolute inset-0 z-20 origin-center">
        
        {/* Original Background Video for the initial state */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            src="/videos/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Camera Viewfinder Frame */}
        <div className="vf-frame absolute inset-0 z-30 pointer-events-none">
          <div className="vf-corner absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/40" />
          <div className="vf-corner absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/40" />
          <div className="vf-corner absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/40" />
          <div className="vf-corner absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/40" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-[1px] bg-white/20 absolute -left-12 top-1/2" />
            <div className="w-8 h-[1px] bg-white/20 absolute -right-12 top-1/2" />
            <div className="w-[1px] h-8 bg-white/20 absolute left-1/2 -top-12" />
            <div className="w-[1px] h-8 bg-white/20 absolute left-1/2 -bottom-12" />
            <div className="w-3 h-3 border border-white/30 rounded-full" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32">
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#00AEEF]/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#00AEEF]/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#00AEEF]/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#00AEEF]/50" />
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="hud-element absolute top-12 right-24 flex items-center gap-2">
            <div className="rec-dot w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-500 font-mono text-xs tracking-widest">REC</span>
          </div>
          <div className="hud-element absolute top-12 left-24 font-mono text-xs text-white/40 tracking-widest">
            01:00:24:07
          </div>
          <div className="hud-element absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-[2px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="exposure-bar w-4 h-1 origin-right" style={{ background: i < 4 ? '#00AEEF' : i < 8 ? '#ffffff33' : '#ffffff15', transform: `scaleY(${Math.random()})` }} />
            ))}
          </div>
          <div className="hud-element absolute bottom-12 left-24 font-mono text-[10px] text-white/25 tracking-widest">
            2.39:1 ANAMORPHIC
          </div>
          <div className="hud-element absolute bottom-12 right-24 font-mono text-[10px] text-white/25 tracking-widest flex gap-6">
            <span>ISO 800</span>
            <span>1/48</span>
            <span>24fps</span>
          </div>
          <div className="hud-element absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-1 h-20 rounded-full overflow-hidden">
              <div className="w-full h-full" style={{ background: 'linear-gradient(to bottom, #ff9500, #ffffff, #00AEEF)' }} />
            </div>
            <span className="font-mono text-[9px] text-white/25 mt-1">5600K</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="hero-content absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,174,239,0.08) 0%, transparent 70%)' }} />

          <div className="flex items-baseline gap-4 md:gap-6 mb-6">
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

          <p className="hero-subtitle text-xs md:text-sm font-mono tracking-[0.4em] text-white/50 uppercase mb-12">
            Video Marketing At Your Fingertips
          </p>

          <div className="flex flex-wrap items-center gap-4 justify-center pointer-events-auto">
            <span className="hero-subtitle font-mono text-[10px] text-white/30 tracking-widest uppercase mr-4">Quick Links:</span>
            <a href="#reel" className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-[#00AEEF]/30 bg-[#00AEEF]/10">
              <div className="absolute inset-0 bg-[#00AEEF] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
              <span className="relative text-sm font-medium text-white tracking-wide">Watch Our Reel</span>
            </a>
            <a href="#quote" className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-white/10 bg-white/[0.03]">
              <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
              <span className="relative text-sm font-medium text-white/70 group-hover:text-white tracking-wide transition-colors">Get A Quote</span>
            </a>
            <a href="#how" className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-white/10 bg-white/[0.03]">
              <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
              <span className="relative text-sm font-medium text-white/70 group-hover:text-white tracking-wide transition-colors">How It Works</span>
            </a>
          </div>

          {/* Scroll indicator overlaid on top so users know to scroll */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-none">
            <span className="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">Scroll to explore</span>
            <div className="w-[1px] h-12 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-[#00AEEF] to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
    </section>
  )
}
