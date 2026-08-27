'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollState, toTimecode, scrollToY } from '@/lib/scroll'
import type { HomePage } from '@/payload-types'
import SmartVideo from '@/components/ui/SmartVideo'

// Real master reel, per the "CLAUDE INPUT 8/12 -- HOMEPAGE" doc note:
// "HERO: keep 'Video Marketing At Your Fingertips'. Visual: ... from the
// master reel vimeo.com/937380835." This is the low-opacity background
// depth layer behind the hero text, not the pinned canvas frame-sequence
// scrubber above it -- that's a separate, custom-built interaction this
// note isn't asking to touch.
const HERO_MASTER_REEL_VIMEO_ID = '937380835'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 291

export default function Hero({ data }: { data?: HomePage['hero'] }) {
  const wordmarkPart1 = data?.wordmarkPart1 || 'SLATE'
  const wordmarkPart2 = data?.wordmarkPart2 || 'CINEMA'
  const subtitle = data?.subtitle || 'Video Marketing At Your Fingertips'
  const ctaLabel = data?.ctaLabel || 'Get Started'
  const ctaHref = data?.ctaHref || '/contact'
  const secondaryCtaLabel = data?.secondaryCtaLabel || 'Watch Our Reel'
  const secondaryCtaHref = data?.secondaryCtaHref || '#reel'
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)

  // No preload() call for /videos/hero.mp4 here -- that file is only the
  // SmartVideo fallback for if HERO_MASTER_REEL_VIMEO_ID above is ever
  // cleared. While it's set (the real, current state), what actually
  // renders is the Vimeo iframe, so preloading the local file was pure
  // wasted bandwidth (a full unused video download on every load). The
  // `priority` prop on SmartVideo below covers the resource that's
  // actually shown, whichever path is currently live.

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
        const resp = await fetch(`/videos/frames/frame_${i.toString().padStart(4, '0')}.webp`)
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

    // Load frames 1 → FRAME_COUNT in order. First load frames 1-30 at high
    // priority so the first scroll is instant, then load the rest in
    // parallel batches — one-at-a-time serial fetching here was the reason
    // the sequence kept cutting off mid-scroll: 261 sequential round trips
    // simply couldn't keep up with a normal scroll speed, however fast the
    // network was. Batching lets the browser's connection pool actually
    // pipeline the requests.
    const BATCH_SIZE = 16
    const loadAll = async () => {
      // Priority batch: first 30 frames
      const priority = []
      for (let i = 1; i <= Math.min(30, FRAME_COUNT); i++) priority.push(loadFrame(i))
      await Promise.all(priority)
      // Rest of the frames, in parallel batches
      for (let start = 31; start <= FRAME_COUNT; start += BATCH_SIZE) {
        if (cancelled) break
        const batch = []
        for (let i = start; i < start + BATCH_SIZE && i <= FRAME_COUNT; i++) batch.push(loadFrame(i))
        await Promise.all(batch)
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

      // Object-cover: scale the bitmap to fill the canvas while maintaining aspect ratio.
      // 2026-08-27: on a portrait/narrow viewport, a straight cover-fit crops
      // this frame sequence's actual subject (someone holding/operating a
      // camera) down to an unrecognizable close-up on the gear -- same
      // "cover on the wrong aspect ratio" problem the hero video had, just
      // in a canvas instead of a video box. Zooming out from a tight cover
      // fit (rather than switching to a full contain fit, which would
      // letterbox) shows enough of the actual subject to read clearly while
      // still filling most of the frame. Landscape/desktop is untouched --
      // this was never cropped tight there in the first place.
      const isPortrait = pw / ph < 16 / 9
      const coverScale = Math.max(pw / bmp.width, ph / bmp.height)
      ctx.clearRect(0, 0, pw, ph)

      if (isPortrait) {
        // 2026-08-27: on request, this now fills the entire canvas AND
        // shows the full subject clearly -- two things that directly
        // trade off for a single layer (filling more of a portrait
        // screen with a fixed-ratio image only ever means cropping more
        // of it). Resolved with two draws instead of one: a blurred,
        // full-cover copy fills the whole canvas as backdrop (satisfies
        // "fills the display"), then the same bitmap is drawn again,
        // crisp and zoomed out from a tight cover fit, on top of it
        // (satisfies "let me see the whole subject"). Same bitmap both
        // times -- no extra decode or network cost, this is cheap.
        ctx.filter = 'blur(24px)'
        // Oversized slightly (1.15x) beyond a plain cover fit so the
        // blur radius never reveals a sliver of empty canvas at the
        // edges.
        const bgScale = coverScale * 1.15
        ctx.drawImage(
          bmp,
          (pw - bmp.width * bgScale) / 2,
          (ph - bmp.height * bgScale) / 2,
          bmp.width * bgScale,
          bmp.height * bgScale
        )
        ctx.filter = 'none'

        const fgScale = coverScale * 0.62
        ctx.drawImage(
          bmp,
          (pw - bmp.width * fgScale) / 2,
          (ph - bmp.height * fgScale) / 2,
          bmp.width * fgScale,
          bmp.height * fgScale
        )
      } else {
        // Landscape/desktop untouched -- never needed this treatment.
        ctx.drawImage(
          bmp,
          (pw - bmp.width * coverScale) / 2,
          (ph - bmp.height * coverScale) / 2,
          bmp.width * coverScale,
          bmp.height * coverScale
        )
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

      // Once the user has scrolled halfway through the frame sequence,
      // finish the ride for them — auto-advance the rest of the way so
      // the back half flows straight into the next section instead of
      // demanding more manual scrolling (lowered from two-thirds to half
      // per 2026-08-27 request). Debounced: real wheel
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
          end: () => `+=${window.innerHeight * 1.6}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.5) {
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

      // A. Slow cinematic dissolve — video fades out gently over a large scroll window
      scrollTl.to(
        '.hero-html-content',
        { opacity: 0, ease: 'power2.in', duration: 0.3 },
        0
      )
      scrollTl.to(
        '.camera-ui',
        { opacity: 0, ease: 'power2.in', duration: 0.3 },
        0
      )

      // B. Canvas fades in simultaneously, overlapping the video dissolve
      scrollTl.to(
        '.camera-canvas-container',
        { opacity: 1, ease: 'power2.out', duration: 0.35 },
        0
      )

      // C. Frame sequence — starts after crossfade is well underway.
      // Uses power2.in so the very first frames advance slowly (cinematic hold)
      // before picking up speed through the rest of the sequence.
      scrollTl.to(
        playhead,
        {
          frame: FRAME_COUNT - 1,
          snap: 'frame',
          ease: 'power2.in',
          duration: 0.82,
          onUpdate: () => renderFrame(Math.round(playhead.frame)),
        },
        0.18
      )


    }, containerRef)

    // Refresh ScrollTrigger to lock in the layout
    ScrollTrigger.refresh()

    return () => gsapCtx.revert()
  }, { scope: containerRef })

  const slateLetters = wordmarkPart1.split('')
  const cinemaLetters = wordmarkPart2.split('')

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

          {/* Background video -- real master reel, falls back to the
              local file if the Vimeo ID is ever cleared. 2026-08-27:
              reverted to one plain, unconditional treatment on every
              viewport, same as desktop always had -- full-bleed "cover",
              dimmed to opacity-40 + mix-blend-screen as ambient depth
              behind the bold overlaid text. Mobile went through several
              different treatments today (zero-crop top banner, then a
              bigger banner, then a blurred-backdrop+crisp-foreground
              version) chasing "show the whole shot" vs. "fill the
              screen" -- explicitly reverted per request in favor of
              keeping this video simple everywhere and putting the
              blurred-backdrop treatment on the canvas frame-sequence
              below instead, where it's free (same bitmap drawn twice)
              rather than a second live Vimeo embed. */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
            {/* object-cover alone doesn't do anything on the Vimeo iframe
                path -- object-fit only affects replaced elements like
                <video>/<img>, not iframe content, so the video was
                letterboxing inside its box instead of filling it. Fixed
                with the standard vw/vh "oversize" cover technique (safe
                for the <video> fallback too -- object-cover still crops
                it correctly regardless of the box's exact size). Assumes
                a 16:9 source, the standard ratio for this kind of reel;
                this section is h-screen so vw/vh here really does match
                the container, not just the viewport coincidentally. */}
            <SmartVideo
              src="/videos/hero.mp4"
              vimeo={HERO_MASTER_REEL_VIMEO_ID}
              variant="background"
              priority
              className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-w-[177.78vh] min-h-[100vh] object-cover -translate-x-1/2 -translate-y-1/2"
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
              <div className="flex" data-cms-field="hero.wordmarkPart1">
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
              <div className="flex" data-cms-field="hero.wordmarkPart2">
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
            {/* text-center added 2026-08-27: on mobile this wraps to 2
                lines (its own max-content width, at 0.4em letter-tracking,
                exceeds a phone viewport), and without an explicit
                text-align the paragraph's auto-width flex sizing clamps
                to the full available width once wrapping starts -- so
                each wrapped line defaulted to flush-left inside that
                full-width box instead of centering under the wordmark
                above it (confirmed live: computed text-align was "start",
                not "center"). */}
            <p data-cms-field="hero.subtitle" className="hero-subtitle text-xs md:text-sm font-mono tracking-[0.4em] text-white/50 uppercase mb-12 text-center">
              {subtitle}
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

            {/* CTA Buttons — Get Started leads, Watch Our Reel is the one secondary option */}
            <div className="flex flex-wrap items-center gap-4 justify-center pointer-events-auto mt-12 z-40 relative">
              <a
                href={ctaHref}
                data-cms-field="hero.ctaLabel"
                className="hero-cta group relative px-7 py-3.5 rounded-full overflow-hidden bg-white"
              >
                <div className="absolute inset-0 bg-[#00AEEF] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="relative text-sm font-semibold text-black group-hover:text-white tracking-wide transition-colors">{ctaLabel}</span>
              </a>
              <a
                href={secondaryCtaHref}
                data-cms-field="hero.secondaryCtaLabel"
                className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-white/15 bg-white/[0.03]"
              >
                <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="relative text-sm font-medium text-white/80 group-hover:text-white tracking-wide transition-colors">{secondaryCtaLabel}</span>
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
