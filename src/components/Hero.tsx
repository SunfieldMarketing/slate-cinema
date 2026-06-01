'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const slateLetters = 'SLATE'.split('')
  const cinemaLetters = 'CINEMA'.split('')

  // Apple-style canvas video scrubbing
  const drawVideoFrame = useCallback(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || video.readyState < 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas to fill viewport
    const dpr = Math.min(window.devicePixelRatio, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
    }

    ctx.clearRect(0, 0, w, h)

    // Draw video covering full viewport (cover fit)
    const vw = video.videoWidth
    const vh = video.videoHeight
    if (vw === 0 || vh === 0) return

    const videoAspect = vw / vh
    const canvasAspect = w / h
    let drawW, drawH, drawX, drawY

    if (canvasAspect > videoAspect) {
      drawW = w
      drawH = w / videoAspect
      drawX = 0
      drawY = (h - drawH) / 2
    } else {
      drawH = h
      drawW = h * videoAspect
      drawX = (w - drawW) / 2
      drawY = 0
    }

    ctx.drawImage(video, drawX, drawY, drawW, drawH)
  }, [])

  // Preload video and set up metadata
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.preload = 'auto'
    video.load()

    const handleLoaded = () => {
      // Draw the first frame once loaded
      if (video.readyState >= 2) {
        video.currentTime = 0
        drawVideoFrame()
      }
    }

    video.addEventListener('loadeddata', handleLoaded)
    video.addEventListener('seeked', drawVideoFrame)

    return () => {
      video.removeEventListener('loadeddata', handleLoaded)
      video.removeEventListener('seeked', drawVideoFrame)
    }
  }, [drawVideoFrame])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const content = contentRef.current
      if (!video || !canvas || !content) return

      // ==========================================
      // PHASE 0: Entrance animations (no scroll)
      // ==========================================
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

      // REC blink
      gsap.to('.rec-dot', {
        opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'power1.inOut'
      })

      // Exposure meter
      gsap.to('.exposure-bar', {
        scaleY: () => gsap.utils.random(0.3, 1),
        duration: 0.3, repeat: -1, yoyo: true,
        stagger: { each: 0.05, repeat: -1, yoyo: true }, ease: 'none'
      })

      // ==========================================
      // PHASE 1-3: Scroll-driven video + content
      // ==========================================
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            // Scrub video based on scroll progress
            if (video.readyState >= 2 && video.duration) {
              const targetTime = self.progress * video.duration
              // Only seek if time difference is significant enough
              if (Math.abs(video.currentTime - targetTime) > 0.03) {
                video.currentTime = targetTime
              }
              drawVideoFrame()
            }
          }
        }
      })

      // --- Phase 1: 0% → 15% - Normal hero visible, nothing happens yet ---
      // (Content is at full opacity and scale by default)

      // --- Phase 2: 15% → 25% - Camera video fades in, old background fades ---
      scrollTl.fromTo('.camera-canvas',
        { opacity: 0 },
        { opacity: 1, duration: 0.1, ease: 'power2.inOut' },
        0.15
      )

      // Fade out the original background video
      scrollTl.to('.hero-bg-video',
        { opacity: 0, duration: 0.1, ease: 'power2.inOut' },
        0.15
      )

      // Fade out HUD elements (they'll be replaced by the camera's own look)
      scrollTl.to('.hud-element', {
        opacity: 0, duration: 0.08, stagger: 0.01, ease: 'power2.in'
      }, 0.15)

      // Fade out viewfinder frame
      scrollTl.to('.vf-frame', {
        opacity: 0, duration: 0.08, ease: 'power2.in'
      }, 0.15)

      // --- Phase 3: 25% → 55% - Hero content shrinks INTO the camera screen ---
      // The content scales down, translates to where the camera screen is in the video,
      // and gets a rounded clip to look like it's "inside" the camera
      scrollTl.to(content, {
        scale: 0.22,
        y: '-8%',
        x: '0%',
        borderRadius: '12px',
        duration: 0.30,
        ease: 'power2.inOut',
      }, 0.25)

      // Add a subtle glow/border around the shrunken content to simulate screen glow
      scrollTl.to('.content-screen-frame', {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out'
      }, 0.35)

      // --- Phase 4: 55% → 85% - Camera keeps rotating, content stays in screen ---
      // Subtle parallax of the content within the frame to match camera perspective
      scrollTl.to(content, {
        rotateY: 8,
        rotateX: -3,
        x: '2%',
        duration: 0.30,
        ease: 'none',
      }, 0.55)

      // --- Phase 5: 85% → 100% - Everything fades out, transition to next section ---
      scrollTl.to('.camera-canvas', {
        opacity: 0,
        scale: 1.1,
        duration: 0.15,
        ease: 'power2.in'
      }, 0.85)

      scrollTl.to(content, {
        opacity: 0,
        scale: 0.15,
        z: -500,
        duration: 0.15,
        ease: 'power2.in'
      }, 0.85)

      scrollTl.to('.content-screen-frame', {
        opacity: 0,
        duration: 0.1,
        ease: 'power2.in'
      }, 0.85)

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>

      {/* Background Video (original - fades out on scroll) */}
      <div className="hero-bg-video absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#030305]">
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

      {/* Hidden video element for canvas scrubbing */}
      <video
        ref={videoRef}
        src="/videos/hero-camera.mp4"
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Canvas for Apple-style scroll-driven video */}
      <canvas
        ref={canvasRef}
        className="camera-canvas absolute inset-0 z-5 w-full h-full pointer-events-none opacity-0"
      />

      {/* Camera Viewfinder Frame (fades out when camera video takes over) */}
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

      {/* Main Content - this is what shrinks INTO the camera screen */}
      <div
        ref={contentRef}
        className="hero-content absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
        style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 45%' }}
      >
        {/* Screen frame glow (appears when content is inside camera) */}
        <div className="content-screen-frame absolute inset-0 z-50 pointer-events-none opacity-0 rounded-xl" style={{
          boxShadow: 'inset 0 0 60px rgba(0,174,239,0.15), inset 0 0 120px rgba(0,174,239,0.05), 0 0 40px rgba(0,174,239,0.1)',
          border: '2px solid rgba(0,174,239,0.15)',
        }} />

        {/* Inner background for when it becomes the "screen" */}
        <div className="absolute inset-0 bg-[#030305] z-[-1]" />

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
