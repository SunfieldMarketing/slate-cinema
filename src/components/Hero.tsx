'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 291

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = `/videos/frames/frame_${i.toString().padStart(4, '0')}.jpg`
      imagesRef.current.push(img)
    }
  }, [])

  // Fade scroll hint as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollHintRef.current) return
      const opacity = Math.max(0, 1 - window.scrollY / 120)
      scrollHintRef.current.style.opacity = String(opacity)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useGSAP(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 1280
    canvas.height = 588

    const renderFrame = (index: number) => {
      const img = imagesRef.current[index]
      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    }

    renderFrame(0)

    const gsapCtx = gsap.context(() => {
      // 1. Entrance
      const enterTl = gsap.timeline({ delay: 0.3 })

      enterTl.fromTo(
        '.hero-letter',
        { opacity: 0, y: 100, rotateX: -90, z: -500 },
        { opacity: 1, y: 0, rotateX: 0, z: 0, duration: 1.2, stagger: 0.04, ease: 'power4.out' },
        0.2
      )
      enterTl.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.8
      )
      enterTl.fromTo(
        '.hero-cta',
        { opacity: 0, x: -80, rotateY: 45 },
        { opacity: 1, x: 0, rotateY: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' },
        1
      )
      // HUD elements animate in after letters
      enterTl.fromTo(
        '.hud-element',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power2.out' },
        1.2
      )

      // 2. Scroll animation
      const playhead = { frame: 0 }

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=800%',
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          fastScrollEnd: false,
        },
      })

      // A. Fade out hero HTML content (opacity only, no scale)
      scrollTl.to('.hero-html-content', { opacity: 0, ease: 'power2.inOut', duration: 0.1 }, 0)

      // B. Fade in canvas
      scrollTl.to('.camera-canvas-container', { opacity: 1, ease: 'power2.inOut', duration: 0.1 }, 0)

      // C. Scrub image sequence
      scrollTl.to(
        playhead,
        {
          frame: FRAME_COUNT - 1,
          snap: 'frame',
          ease: 'none',
          duration: 0.9,
          onUpdate: () => renderFrame(playhead.frame),
        },
        0.1
      )
    }, containerRef)

    ScrollTrigger.refresh()
    return () => gsapCtx.revert()
  }, { scope: containerRef })

  const slateLetters = 'SLATE'.split('')
  const cinemaLetters = 'CINEMA'.split('')

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305]">
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ perspective: '2000px' }}>

        {/* 1. Canvas image-sequence (fades in on scroll) */}
        <div className="camera-canvas-container absolute inset-0 z-10 opacity-0 pointer-events-none flex items-center justify-center bg-[#030305]">
          <canvas ref={canvasRef} className="w-full h-full object-contain scale-95" />
        </div>

        {/* 2. HTML UI layer — HUD + text (fades out on scroll) */}
        <div className="hero-html-content absolute inset-0 z-20">

          {/* Background office video */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <video
              src="/videos/hero.mp4"
              autoPlay loop muted playsInline
              className="absolute w-full h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
          </div>

          {/* ── Camera Viewfinder HUD ─────────────────────────────────────── */}
          <div className="absolute inset-0 z-10 pointer-events-none select-none">

            {/* Corner brackets */}
            {/* Top-left */}
            <div className="hud-element absolute top-6 left-6 w-16 h-16 opacity-0">
              <div className="absolute top-0 left-0 w-6 h-px bg-[#00AEEF]" />
              <div className="absolute top-0 left-0 w-px h-6 bg-[#00AEEF]" />
            </div>
            {/* Top-right */}
            <div className="hud-element absolute top-6 right-6 w-16 h-16 opacity-0">
              <div className="absolute top-0 right-0 w-6 h-px bg-[#00AEEF]" />
              <div className="absolute top-0 right-0 w-px h-6 bg-[#00AEEF]" />
            </div>
            {/* Bottom-left */}
            <div className="hud-element absolute bottom-6 left-6 w-16 h-16 opacity-0">
              <div className="absolute bottom-0 left-0 w-6 h-px bg-[#00AEEF]" />
              <div className="absolute bottom-0 left-0 w-px h-6 bg-[#00AEEF]" />
            </div>
            {/* Bottom-right */}
            <div className="hud-element absolute bottom-6 right-6 w-16 h-16 opacity-0">
              <div className="absolute bottom-0 right-0 w-6 h-px bg-[#00AEEF]" />
              <div className="absolute bottom-0 right-0 w-px h-6 bg-[#00AEEF]" />
            </div>

            {/* REC indicator — top left */}
            <div className="hud-element absolute top-8 left-8 flex items-center gap-2 opacity-0">
              <span
                className="w-2 h-2 rounded-full bg-red-500"
                style={{ animation: 'pulse 1s ease-in-out infinite alternate' }}
              />
              <span className="font-mono text-[10px] text-white/60 tracking-[0.3em] uppercase">REC</span>
            </div>

            {/* Timecode — top right */}
            <div className="hud-element absolute top-8 right-8 font-mono text-[10px] text-white/45 tracking-widest opacity-0">
              00:00:00:00
            </div>

            {/* Center crosshair */}
            <div className="hud-element absolute inset-0 flex items-center justify-center opacity-0">
              <div className="relative w-12 h-12">
                {/* Horizontal line segments */}
                <div className="absolute top-1/2 left-0 w-3 h-px bg-[#00AEEF]/50" style={{ transform: 'translateY(-50%)' }} />
                <div className="absolute top-1/2 right-0 w-3 h-px bg-[#00AEEF]/50" style={{ transform: 'translateY(-50%)' }} />
                {/* Vertical line segments */}
                <div className="absolute left-1/2 top-0 h-3 w-px bg-[#00AEEF]/50" style={{ transform: 'translateX(-50%)' }} />
                <div className="absolute left-1/2 bottom-0 h-3 w-px bg-[#00AEEF]/50" style={{ transform: 'translateX(-50%)' }} />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#00AEEF]/70" style={{ transform: 'translate(-50%,-50%)' }} />
              </div>
            </div>

            {/* ISO / shutter info — bottom left */}
            <div className="hud-element absolute bottom-8 left-8 flex flex-col gap-1 opacity-0">
              <span className="font-mono text-[9px] text-white/35 tracking-widest">ISO 800</span>
              <span className="font-mono text-[9px] text-white/35 tracking-widest">1/60s</span>
              <span className="font-mono text-[9px] text-white/35 tracking-widest">f/2.8</span>
            </div>

            {/* Focus indicator — bottom right */}
            <div className="hud-element absolute bottom-8 right-8 flex flex-col items-end gap-1 opacity-0">
              <span className="font-mono text-[9px] text-[#00AEEF]/50 tracking-widest uppercase">AF · Auto</span>
              <span className="font-mono text-[9px] text-white/35 tracking-widest">4K · 24fps</span>
            </div>

            {/* Exposure bar — left edge */}
            <div className="hud-element absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-0">
              <div className="w-px h-20 bg-white/10 relative overflow-hidden rounded-full">
                <div className="absolute bottom-0 inset-x-0 h-[60%] bg-[#00AEEF]/50 rounded-full" />
              </div>
              <span className="font-mono text-[8px] text-white/25 tracking-widest -rotate-90 mt-2">EV</span>
            </div>

            {/* White balance bar — right edge */}
            <div className="hud-element absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-0">
              <div className="w-px h-20 bg-white/10 relative overflow-hidden rounded-full">
                <div className="absolute bottom-0 inset-x-0 h-[45%] bg-orange-400/40 rounded-full" />
              </div>
              <span className="font-mono text-[8px] text-white/25 tracking-widest -rotate-90 mt-2">WB</span>
            </div>
          </div>

          {/* ── Hero copy ────────────────────────────────────────────────── */}
          <div className="hero-content absolute inset-0 z-10 flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,174,239,0.08) 0%, transparent 70%)' }}
            />

            {/* SLATE CINEMA letters */}
            <div className="flex items-baseline gap-4 md:gap-6 mb-6">
              <div className="flex">
                {slateLetters.map((letter, i) => (
                  <span
                    key={`s-${i}`}
                    className="hero-letter inline-block text-6xl md:text-8xl lg:text-[10rem] font-bold text-white tracking-tighter leading-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="flex">
                {cinemaLetters.map((letter, i) => (
                  <span
                    key={`c-${i}`}
                    className="hero-letter inline-block text-6xl md:text-8xl lg:text-[10rem] font-bold text-[#00AEEF] tracking-tighter leading-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            <p className="hero-subtitle text-xs md:text-sm font-mono tracking-[0.4em] text-white/50 uppercase mb-12">
              Video Marketing At Your Fingertips
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center pointer-events-auto">
              <span className="hero-subtitle font-mono text-[10px] text-white/30 tracking-widest uppercase mr-4">
                Quick Links:
              </span>
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
          </div>

          {/* Scroll hint */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
          >
            <span className="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-bounce text-[#00AEEF]/60">
              <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
