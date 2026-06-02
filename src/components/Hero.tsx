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

  // Use a ref for images so we don't trigger React re-renders or recreate GSAP timelines as images load
  const imagesRef = useRef<HTMLImageElement[]>([])

  // Auto-scroll to top on mount so the page always starts at the hero
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Preload image sequence seamlessly in the background
  useEffect(() => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = `/videos/frames/frame_${i.toString().padStart(4, '0')}.jpg`
      imagesRef.current.push(img)
    }
  }, [])

  // Fade scroll hint arrow out as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollHintRef.current) return
      const scrollY = window.scrollY
      const opacity = Math.max(0, 1 - scrollY / 120)
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

    // High-DPI Canvas Rendering Logic
    const renderFrame = (index: number) => {
      const img = imagesRef.current[index]
      if (img && img.complete && img.naturalWidth !== 0) {
        // Scale up for high-DPI displays to ensure 1080p looks crisp
        const dpr = window.devicePixelRatio || 1
        const targetWidth = 1920
        const targetHeight = 1080

        canvas.width = targetWidth * dpr
        canvas.height = targetHeight * dpr
        
        ctx.save()
        ctx.scale(dpr, dpr)

        // Object-cover logic
        const scale = Math.max(targetWidth / img.width, targetHeight / img.height)
        const x = targetWidth / 2 - (img.width / 2) * scale
        const y = targetHeight / 2 - (img.height / 2) * scale

        ctx.clearRect(0, 0, targetWidth, targetHeight)
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        ctx.restore()
      }
    }

    // Try to draw first frame immediately (it will retry onUpdate if not loaded yet)
    renderFrame(0)

    const gsapCtx = gsap.context(() => {
      // --- 1. ENTRANCE ANIMATION ---
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

      // --- 2. SCROLL ANIMATION ---
      const playhead = { frame: 0 }

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1000vh', // Reduced distance for faster, buttery smooth scrub
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // A. Fade out HTML content quickly upon scroll so it doesn't linger
      scrollTl.to(
        '.hero-html-content',
        { opacity: 0, ease: 'power2.inOut', duration: 0.1 },
        0
      )
      scrollTl.to(
        '.camera-ui',
        { opacity: 0, ease: 'power2.inOut', duration: 0.1 },
        0
      )

      // B. Fade in the canvas container smoothly
      scrollTl.to(
        '.camera-canvas-container',
        { opacity: 1, ease: 'power2.inOut', duration: 0.1 },
        0
      )

      // C. Frame sequence animation (spans the entire scroll distance, overlapping the fade)
      scrollTl.to(
        playhead,
        {
          frame: FRAME_COUNT - 1,
          snap: 'frame',
          ease: 'power1.inOut',
          duration: 1,
          onUpdate: () => renderFrame(playhead.frame),
        },
        0
      )

      // D. Crossfade transition into the next section
      scrollTl.to(
        '.camera-canvas-container',
        { opacity: 0, ease: 'power2.inOut', duration: 0.15 },
        0.85 // Start fading out at 85% of the scroll timeline
      )
    }, containerRef)

    // Refresh ScrollTrigger to lock in the layout
    ScrollTrigger.refresh()

    return () => gsapCtx.revert()
  }, { scope: containerRef })

  const slateLetters = 'SLATE'.split('')
  const cinemaLetters = 'CINEMA'.split('')

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305]">
      {/* Inner wrapper — overflow hidden so pinned canvas never bleeds out */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ perspective: '2000px' }}>

        {/* 1. Canvas image-sequence layer (fades in on scroll) */}
        <div className="camera-canvas-container absolute inset-0 z-10 opacity-0 pointer-events-none flex items-center justify-center bg-[#030305]">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain scale-95"
          />
        </div>

        {/* 2. HTML UI layer (fades out on scroll, no scale change) */}
        <div className="hero-html-content absolute inset-0 z-20">

          {/* Background video at low opacity for visual depth */}
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

          {/* Main content — centered hero text and CTAs */}
          <div className="hero-content absolute inset-0 z-10 flex flex-col items-center justify-center">
            {/* Subtle blue radial glow */}
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

            {/* Subtitle */}
            <p className="hero-subtitle text-xs md:text-sm font-mono tracking-[0.4em] text-white/50 uppercase mb-12">
              Video Marketing At Your Fingertips
            </p>

            {/* Cinematic top bar — REC indicator */}
            <div className="camera-ui absolute top-6 left-8 z-30 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <span className="font-mono text-[11px] md:text-sm text-red-500 tracking-[0.3em] font-bold">
                REC
              </span>
            </div>
            
            {/* Battery / Time Indicator */}
            <div className="camera-ui absolute top-6 right-8 z-30 flex items-center gap-4">
              <span className="font-mono text-[11px] md:text-sm text-white/70 tracking-widest">
                00:00:00:00
              </span>
              <div className="w-8 h-4 border border-white/40 rounded-sm p-[1px] flex justify-end">
                <div className="w-3/4 h-full bg-white/70" />
              </div>
            </div>

            {/* Viewfinder Corners */}
            <div className="camera-ui absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-white/30 z-30 pointer-events-none" />
            <div className="camera-ui absolute top-12 right-12 w-16 h-16 border-t-2 border-r-2 border-white/30 z-30 pointer-events-none" />
            <div className="camera-ui absolute bottom-12 left-12 w-16 h-16 border-b-2 border-l-2 border-white/30 z-30 pointer-events-none" />
            <div className="camera-ui absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-white/30 z-30 pointer-events-none" />

            {/* Crosshair */}
            <div className="camera-ui absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 z-30 pointer-events-none opacity-20">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white -translate-x-1/2" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white -translate-y-1/2" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center pointer-events-auto mt-12 z-40 relative">
              <span className="hero-subtitle font-mono text-[10px] text-white/30 tracking-widest uppercase mr-4">
                Quick Links:
              </span>
              <a
                href="#reel"
                className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-[#00AEEF]/30 bg-[#00AEEF]/10"
              >
                <div className="absolute inset-0 bg-[#00AEEF] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="relative text-sm font-medium text-white tracking-wide">Watch Our Reel</span>
              </a>
              <a
                href="#quote"
                className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-white/10 bg-white/[0.03]"
              >
                <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="relative text-sm font-medium text-white/70 group-hover:text-white tracking-wide transition-colors">
                  Get A Quote
                </span>
              </a>
              <a
                href="#how"
                className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-white/10 bg-white/[0.03]"
              >
                <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="relative text-sm font-medium text-white/70 group-hover:text-white tracking-wide transition-colors">
                  How It Works
                </span>
              </a>
            </div>
          </div>

          {/* Scroll hint arrow — fades out as user scrolls (controlled via JS) */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none transition-opacity duration-100"
          >
            <span className="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">Scroll</span>
            {/* Animated chevron arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="animate-bounce text-[#00AEEF]/60"
            >
              <path
                d="M4 7l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

        </div>
      </div>
    </section>
  )
}
