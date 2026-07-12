'use client'

import { useRef, useEffect } from 'react'
import { preload } from 'react-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollState, toTimecode, scrollToY } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 291

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)

  // Preload main hero video immediately with high priority
  preload('/videos/hero.mp4', { as: 'video', fetchPriority: 'high' })

  const currentFrameRef = useRef<number>(1)

  // Auto-scroll to top on mount so the page always starts at the hero
  useEffect(() => {
    window.scrollTo(0, 0)
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

  // Live camera timecode — runs off the master scroll store so the REC
  // readout ticks in sync with the film-timecode HUD as you scroll
  useEffect(() => {
    let rafId: number
    const tick = () => {
      if (timecodeRef.current) {
        timecodeRef.current.textContent = toTimecode(scrollState.progress)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // ImageBitmap cache — GPU-ready decoded frames, no main-thread decode stall
  // Apple-style: decode all 291 frames eagerly off-thread so every frame is
  // available immediately when the scroll position hits it.
  const bitmapsRef = useRef<(ImageBitmap | null)[]>(Array(FRAME_COUNT + 1).fill(null))
  const loadedCountRef = useRef(0)

  useEffect(() => {
    let cancelled = false

    const loadFrame = async (i: number) => {
      if (cancelled || bitmapsRef.current[i]) return
      try {
        const resp = await fetch(`/videos/frames/frame_${i.toString().padStart(4, '0')}.jpg`)
        if (cancelled) return
        const blob = await resp.blob()
        if (cancelled) return
        const bmp = await createImageBitmap(blob)
        if (!cancelled) {
          bitmapsRef.current[i] = bmp
          loadedCountRef.current++
        }
      } catch {}
    }

    // Load frames 1 → FRAME_COUNT in order (browser will pipeline them)
    // First load frames 1-30 at high priority so the first scroll is instant,
    // then load the rest sequentially.
    const loadAll = async () => {
      // Priority batch: first 30 frames
      const priority = []
      for (let i = 1; i <= Math.min(30, FRAME_COUNT); i++) priority.push(loadFrame(i))
      await Promise.all(priority)
      // Rest of the frames
      for (let i = 31; i <= FRAME_COUNT; i++) {
        if (cancelled) break
        await loadFrame(i)
      }
    }
    loadAll()
    return () => { cancelled = true }
  }, [])

  useGSAP(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Apple-style renderFrame: draw from pre-decoded ImageBitmap.
    // ImageBitmaps live on the GPU side so drawImage() is near-zero cost.
    // Canvas is sized to the actual viewport (not a fixed 1920x1080) so
    // nothing is ever zoomed in.
    const renderFrame = (index: number) => {
      currentFrameRef.current = index
      const bmp = bitmapsRef.current[index]
      if (!bmp) return

      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      const pw = Math.round(w * dpr)
      const ph = Math.round(h * dpr)

      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }

      // Object-cover: scale the bitmap to fill the canvas while maintaining aspect ratio
      const scale = Math.max(pw / bmp.width, ph / bmp.height)
      const dx = (pw - bmp.width * scale) / 2
      const dy = (ph - bmp.height * scale) / 2
      ctx.drawImage(bmp, dx, dy, bmp.width * scale, bmp.height * scale)
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

      // Once the user has scrolled roughly two-thirds of the way through the
      // frame sequence, finish the ride for them — auto-advance the rest of
      // the way so the last third flows straight into the next section
      // instead of demanding more manual scrolling. Debounced: real wheel
      // input fires onUpdate continuously while the user is actively
      // scrolling, and each of those ticks would otherwise re-target Lenis'
      // own wheel-driven scroll and cancel a scrollTo call made mid-gesture.
      // Waiting for a short gap in updates means we only kick in once their
      // scroll has actually settled, so we don't fight their input.
      let autoAdvanced = false
      let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          // ScrollTrigger parses 'vh' strings as px — '+=1000vh' silently became
          // 1000px. Compute real viewport multiples for a filmic 291-frame scrub.
          // 1.15 viewports keeps the scrub smooth without a long dead runway
          // before the next section arrives.
          end: () => `+=${window.innerHeight * 1.15}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.65) {
              autoAdvanced = false
              if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer)
                autoAdvanceTimer = null
              }
              return
            }
            if (autoAdvanced || self.direction !== 1 || self.progress >= 0.99) return
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer)
            autoAdvanceTimer = setTimeout(() => {
              autoAdvanced = true
              scrollToY(self.end, 1.4)
            }, 140)
          },
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

      // B. Fade in the canvas container smoothly after a short gap (Stage 2: no video)
      scrollTl.to(
        '.camera-canvas-container',
        { opacity: 1, ease: 'power2.inOut', duration: 0.1 },
        0.05
      )

      // C. Frame sequence — scrub:0 for instant zero-lag response like Apple
      scrollTl.to(
        playhead,
        {
          frame: FRAME_COUNT - 1,
          snap: 'frame',
          ease: 'none',
          duration: 0.95,
          onUpdate: () => renderFrame(Math.round(playhead.frame)),
        },
        0.05
      )


    }, containerRef)

    // Refresh ScrollTrigger to lock in the layout
    ScrollTrigger.refresh()

    return () => gsapCtx.revert()
  }, { scope: containerRef })

  const slateLetters = 'SLATE'.split('')
  const cinemaLetters = 'CINEMA'.split('')

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-ink">
      {/* Inner wrapper — overflow hidden so pinned canvas never bleeds out */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ perspective: '2000px' }}>

        {/* 1. Canvas image-sequence layer (fades in on scroll) */}
        <div className="camera-canvas-container absolute inset-0 z-10 opacity-0 pointer-events-none flex items-center justify-center bg-ink">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. HTML UI layer (fades out on scroll, no scale change) */}
        <div className="hero-html-content absolute inset-0 z-20">

          {/* Background video at low opacity for visual depth */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
            <video
              src="/videos/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-1/2 left-1/2 w-full h-full object-cover min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-ink/80 via-transparent to-ink/80 pointer-events-none" />

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
                    className="hero-letter inline-block text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold text-white tracking-tighter leading-none"
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
                    className="hero-letter inline-block text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold text-[#00AEEF] tracking-tighter leading-none"
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
              <span ref={timecodeRef} className="font-mono text-[11px] md:text-sm text-white/70 tracking-widest">
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
