'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'

const steps = [
  {
    num: '01',
    title: 'PRE-PRODUCTION',
    tagline: 'The foundation of every masterpiece.',
    desc: 'We dive deep into concept development, architecting high-converting campaigns, meticulously scripting every scene, and drafting exhaustive shot lists to guarantee a flawless shoot day.',
    videoSrc: '/videos/pre-production.mp4',
    color: '#00AEEF',
    glow: 'rgba(0,174,239,0.18)',
  },
  {
    num: '02',
    title: 'PRODUCTION',
    tagline: 'Where the magic happens.',
    desc: 'Utilizing cinema-grade cameras and mastery over lighting, our directors take charge on-location. We focus on dynamic, social-first capture that guarantees high retention and visual supremacy.',
    videoSrc: '/videos/production.mp4',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.18)',
  },
  {
    num: '03',
    title: 'POST-PRODUCTION',
    tagline: 'The polishing of the diamond.',
    desc: 'Our elite editors weave your footage together through aggressive color grading, immersive sound design, striking motion graphics, and VFX that command absolute attention.',
    videoSrc: '/videos/post-production.mp4',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.18)',
  },
  {
    num: '04',
    title: 'DISTRIBUTION',
    tagline: 'Deploying the payload.',
    desc: 'We deliver platform-specific, ad-ready exports optimized for TikTok, Reels, and YouTube. Combined with data-driven analytics review, we ensure your content dominates the algorithm.',
    videoSrc: '/videos/distribution.mp4',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.18)',
  },
]

const TOTAL_STEPS = steps.length // 4

export default function Pipeline() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const sectionRef   = useRef<HTMLElement>(null)
  const stepRef      = useRef(-1)            // -1 = intro
  const animating    = useRef(false)
  const [display, setDisplay] = useState(-1) // drives progress dots

  // ── core transition ──────────────────────────────────────────────────
  const goTo = useCallback((next: number) => {
    if (animating.current) return
    if (next === stepRef.current) return
    if (next < -1 || next >= TOTAL_STEPS) return

    animating.current = true
    const prev = stepRef.current
    stepRef.current = next
    setDisplay(next)

    const forward = next > prev
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => { animating.current = false },
    })

    // ── animate OUT ──────────────────────────────────────────────────
    if (prev === -1) {
      tl.to('.pipe-intro', { opacity: 0, scale: 0.94, duration: 0.35, ease: 'power2.in' }, 0)
    } else {
      tl.to(`.pipe-step-${prev}`, {
        opacity: 0,
        x: forward ? -100 : 100,
        filter: 'blur(8px)',
        duration: 0.4,
        ease: 'power2.in',
      }, 0)
    }

    // ── animate IN ──────────────────────────────────────────────────
    if (next === -1) {
      tl.fromTo('.pipe-intro',
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.5 },
        0.3
      )
    } else {
      // Make sure the incoming step is initially positioned correctly
      gsap.set(`.pipe-step-${next}`, {
        opacity: 0,
        x: forward ? 100 : -100,
        filter: 'blur(8px)',
      })
      tl.to(`.pipe-step-${next}`, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.55,
      }, 0.3)

      // Stagger the internal elements
      tl.fromTo(
        `.pipe-step-${next} .pipe-text-el`,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' },
        0.42
      )
      tl.fromTo(
        `.pipe-step-${next} .pipe-video-el`,
        { opacity: 0, scale: 0.9, rotate: forward ? 4 : -4 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.65, ease: 'power3.out' },
        0.35
      )
    }

    // Update ambient glow
    if (next >= 0) {
      gsap.to('.pipe-glow', { opacity: 0, duration: 0.25 })
      gsap.to(`.pipe-glow-${next}`, { opacity: 1, duration: 0.5, delay: 0.2 })
    } else {
      gsap.to('.pipe-glow', { opacity: 0, duration: 0.3 })
    }

  }, [])

  // ── wheel hijack while section is sticky-pinned ───────────────────
  useEffect(() => {
    let wheelCooldown: ReturnType<typeof setTimeout> | null = null

    const onWheel = (e: WheelEvent) => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      // Only intercept when section is visually pinned (top ~= 0)
      const isPinned = rect.top <= 2 && rect.bottom >= window.innerHeight - 2
      if (!isPinned) return

      const current = stepRef.current
      const goingDown = e.deltaY > 0

      // If at last step and going down, let page scroll naturally past
      if (goingDown && current >= TOTAL_STEPS - 1) return
      // If at intro and going up, let page scroll naturally back up
      if (!goingDown && current <= -1) return

      e.preventDefault()
      if (animating.current) return

      // Throttle so one wheel burst = one step
      if (wheelCooldown) return
      wheelCooldown = setTimeout(() => { wheelCooldown = null }, 750)

      goTo(goingDown ? current + 1 : current - 1)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      if (wheelCooldown) clearTimeout(wheelCooldown)
    }
  }, [goTo])

  // ── keyboard navigation (bonus) ────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.top > 2 || rect.bottom < window.innerHeight - 2) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        goTo(stepRef.current + 1)
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        goTo(stepRef.current - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo])

  // ── initial set of hidden steps ────────────────────────────────────
  useEffect(() => {
    steps.forEach((_, i) => {
      gsap.set(`.pipe-step-${i}`, { opacity: 0, x: 80 })
    })
  }, [])
  // ── Mouse-tracked parallax + continuous ambient motion ────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Smooth mouse position tracker
    let mouseX = 0, mouseY = 0
    let curX = 0, curY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      if (rect.top > 2 || rect.bottom < window.innerHeight - 2) return
      // Normalize -1..1 relative to section center
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = () => {
      // Smooth lerp toward actual mouse position
      curX += (mouseX - curX) * 0.055
      curY += (mouseY - curY) * 0.055

      // Parallax the video wrapper: moves opposite to mouse for depth
      gsap.set('.pipe-video-el', {
        x: curX * -18,
        y: curY * -10,
        rotateY: curX * 4,
        rotateX: curY * -3,
      })

      // Parallax the text panel: moves slightly with mouse
      gsap.set('.pipe-text-panel', {
        x: curX * 8,
        y: curY * 5,
      })

      // Move ambient orbs based on mouse
      gsap.set('.pipe-orb-1', { x: curX * 40, y: curY * 30 })
      gsap.set('.pipe-orb-2', { x: curX * -30, y: curY * -20 })
      gsap.set('.pipe-orb-3', { x: curX * 60, y: curY * -40 })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMouseMove)

    // Continuous floating animation on bg shapes
    gsap.to('.pipe-bg-shape-1', {
      y: '+=20', rotate: '+=3',
      duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true,
    })
    gsap.to('.pipe-bg-shape-2', {
      y: '-=25', x: '+=15', rotate: '-=4',
      duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true,
    })
    gsap.to('.pipe-bg-shape-3', {
      y: '+=30', x: '-=20', rotate: '+=6',
      duration: 10, ease: 'sine.inOut', repeat: -1, yoyo: true,
    })
    gsap.to('.pipe-bg-shape-4', {
      y: '-=18', rotate: '-=5',
      duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true,
    })

    // Slow continuous pulse on corner dots
    gsap.to('.pipe-corner-dot', {
      scale: 1.5, opacity: 0.8,
      duration: 2.5, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.4,
    })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    // Tall wrapper to provide scroll real-estate for the sticky section
    <div ref={wrapperRef} style={{ height: `${(TOTAL_STEPS + 1) * 100}vh` }}>
      <section
        ref={sectionRef}
        className="sticky top-0 w-full h-screen bg-[#030305] overflow-hidden"
      >

        {/* ── Premium Background Layers ─────────────────── */}

        {/* Grain */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '128px',
          animation: 'grain 0.5s steps(1) infinite',
        }} />

        {/* Scanlines */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.04) 2px,rgba(255,255,255,0.04) 4px)' }} />

        {/* Vignette */}
        <div className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 110% 100% at 50% 50%,transparent 40%,rgba(0,0,0,0.88) 100%)' }} />

        {/* Light beams */}
        <div className="absolute -top-40 left-1/4 w-px h-[140vh] opacity-[0.07] pointer-events-none z-0"
          style={{ background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,0.9),transparent)', transform: 'rotate(-15deg)' }} />
        <div className="absolute -top-40 right-1/4 w-px h-[140vh] opacity-[0.05] pointer-events-none z-0"
          style={{ background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,0.7),transparent)', transform: 'rotate(15deg)' }} />

        {/* Floating Ambient Orbs (Mouse Parallax) */}
        <div className="pipe-orb-1 absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AEEF] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none z-0" />
        <div className="pipe-orb-2 absolute top-1/2 right-1/4 w-[28rem] h-[28rem] bg-[#a855f7] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.08] pointer-events-none z-0" />
        <div className="pipe-orb-3 absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#10b981] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.12] pointer-events-none z-0" />

        {/* Per-step ambient glows */}
        {steps.map((step, i) => (
          <div key={i} className={`pipe-glow pipe-glow-${i} absolute inset-0 z-0 pointer-events-none`}
            style={{
              background: `radial-gradient(ellipse 70% 70% at ${i%2===0?'65%':'35%'} 50%,${step.glow} 0%,transparent 70%)`,
              opacity: 0,
            }} />
        ))}

        {/* ── Section Tag (always visible) ───────────────── */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <span className="block w-8 h-px bg-white/20" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-white/30 uppercase">How It Works</span>
          <span className="block w-8 h-px bg-white/20" />
        </div>

        {/* ── Intro Glass Screen ─────────────────────────── */}
        <div className="pipe-intro absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="absolute inset-8 border border-white/[0.07] bg-white/[0.02] backdrop-blur-2xl rounded-3xl" />
          <h2 className="relative text-6xl md:text-9xl font-black text-white tracking-tighter"
            style={{ textShadow: '0 0 80px rgba(255,255,255,0.07)' }}>
            OUR PROCESS
          </h2>
          <p className="relative mt-4 text-white/25 tracking-[0.25em] text-xs font-mono uppercase">
            Scroll to begin
          </p>
        </div>

        {/* ── Steps ─────────────────────────────────────── */}
        {steps.map((step, index) => {
          const isEven = index % 2 === 0
          return (
            <div
              key={index}
              className={`pipe-step-${index} absolute inset-0 z-20 flex items-center justify-center px-8 md:px-20`}
              style={{ willChange: 'transform, opacity, filter' }}
            >
              <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

                {/* ── Text Side ───────────────────── */}
                <div className="pipe-text-panel flex flex-col items-start flex-1 min-w-0"
                  style={{ order: isEven ? 1 : 2, textAlign: 'left' }}>

                  {/* Number */}
                  <div className="pipe-text-el font-mono font-black leading-none"
                    style={{
                      fontSize: 'clamp(4.5rem,9vw,8rem)',
                      color: step.color,
                      textShadow: `0 0 60px ${step.color}70, 0 0 120px ${step.color}25`,
                    }}>
                    {step.num}
                  </div>

                  {/* Title */}
                  <div className="pipe-text-el font-black text-white tracking-tighter uppercase -mt-1"
                    style={{ fontSize: 'clamp(1.8rem,4vw,3.5rem)', textShadow: '0 2px 40px rgba(0,0,0,0.9)' }}>
                    {step.title}
                  </div>

                  {/* Tagline accent */}
                  <div className="pipe-text-el mt-3 text-lg md:text-xl font-medium italic"
                    style={{ color: step.color, textShadow: `0 0 25px ${step.color}80` }}>
                    — {step.tagline}
                  </div>

                  {/* Divider */}
                  <div className="pipe-text-el mt-5 h-px w-20"
                    style={{ background: `linear-gradient(to right, ${step.color}, transparent)` }} />

                  {/* Description */}
                  <p className="pipe-text-el mt-4 text-white/60 text-sm md:text-base font-light leading-relaxed max-w-md">
                    {step.desc}
                  </p>

                  {/* CTA */}
                  <div className="pipe-text-el mt-8">
                    <a
                      href="#schedule"
                      className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300 pointer-events-auto"
                      style={{
                        border: `1px solid ${step.color}55`,
                        background: `linear-gradient(135deg,${step.color}15,rgba(255,255,255,0.03))`,
                        backdropFilter: 'blur(14px)',
                        boxShadow: `0 0 20px ${step.color}20`,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.background = step.color
                        el.style.color = '#000'
                        el.style.boxShadow = `0 0 40px ${step.color}60`
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.background = `linear-gradient(135deg,${step.color}15,rgba(255,255,255,0.03))`
                        el.style.color = 'white'
                        el.style.boxShadow = `0 0 20px ${step.color}20`
                      }}
                    >
                      Book A Strategy Call
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                        <path d="M1 6.5h11M7 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* ── Video Side ──────────────────── */}
                <div className="pipe-video-el flex-shrink-0 relative" style={{ order: isEven ? 2 : 1 }}>

                  {/* === Background decorative shape behind video === */}
                  {/* Large rotated rectangle — glass shard / frame effect */}
                  <div
                    className="pipe-bg-shape-1 absolute pointer-events-none"
                    style={{
                      width: 'clamp(280px,34vw,440px)',
                      height: 'clamp(340px,44vw,560px)',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${isEven ? '8deg' : '-8deg'})`,
                      border: `1px solid ${step.color}30`,
                      background: `linear-gradient(135deg, ${step.color}08 0%, transparent 60%)`,
                      borderRadius: '2px',
                      zIndex: 0,
                    }}
                  />
                  {/* Second shape — smaller, tighter rotation, pure color outline */}
                  <div
                    className="pipe-bg-shape-2 absolute pointer-events-none"
                    style={{
                      width: 'clamp(220px,26vw,340px)',
                      height: 'clamp(260px,34vw,440px)',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${isEven ? '-4deg' : '4deg'})`,
                      border: `1px solid ${step.color}18`,
                      borderRadius: '2px',
                      zIndex: 0,
                    }}
                  />
                  {/* Corner accent dots */}
                  {[[-1,-1],[1,-1],[1,1],[-1,1]].map(([dx,dy], ci) => (
                    <div key={ci} className="pipe-corner-dot absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                      style={{
                        backgroundColor: step.color,
                        opacity: 0.5,
                        top: `calc(50% + ${dy * (isEven ? 1 : -1)} * clamp(150px,18vw,250px))`,
                        left: `calc(50% + ${dx} * clamp(120px,14vw,190px))`,
                        transform: 'translate(-50%,-50%)',
                        boxShadow: `0 0 8px ${step.color}`,
                        zIndex: 0,
                      }}
                    />
                  ))}

                  {/* Outer wrapper: slight rotation gives the "shard" feel */}
                  <div
                    className="relative"
                    style={{
                      width: 'clamp(240px, 28vw, 380px)',
                      height: 'clamp(300px, 36vw, 500px)',
                      transform: `rotate(${isEven ? '-2.5deg' : '2.5deg'})`,
                      zIndex: 1,
                    }}
                  >
                    {/* Glow behind shard */}
                    <div className="absolute -inset-4 rounded-sm opacity-30 blur-2xl"
                      style={{ background: step.color, zIndex: 0 }} />

                    {/* Video container with overflow hidden */}
                    <div className="relative w-full h-full overflow-hidden rounded-sm border border-white/15"
                      style={{
                        boxShadow: `0 0 60px ${step.glow}, inset 0 1px 0 rgba(255,255,255,0.10)`,
                        zIndex: 1,
                        transform: 'skewX(-1.5deg)',
                      }}>
                      <video
                        src={step.videoSrc}
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover"
                        style={{ transform: 'skewX(1.5deg) scale(1.04)' }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Color tint */}
                      <div className="absolute inset-0 mix-blend-overlay opacity-20" style={{ backgroundColor: step.color }} />
                      {/* Edge shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
        })}

        {/* ── Progress Dots ──────────────────────────────── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 pointer-events-none">
          {steps.map((step, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-500"
              style={{
                height: display === i ? '24px' : '6px',
                backgroundColor: display === i ? step.color : 'rgba(255,255,255,0.2)',
                boxShadow: display === i ? `0 0 8px ${step.color}` : 'none',
              }}
            />
          ))}
        </div>

        {/* ── Step Counter ───────────────────────────────── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-none">
          {display >= 0 && (
            <>
              <span className="font-mono text-xs text-white/30 tracking-widest">
                {String(display + 1).padStart(2, '0')}
              </span>
              <div className="w-32 h-px bg-white/10 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-500"
                  style={{
                    width: `${((display + 1) / TOTAL_STEPS) * 100}%`,
                    backgroundColor: steps[display]?.color,
                    boxShadow: `0 0 8px ${steps[display]?.color}`,
                  }}
                />
              </div>
              <span className="font-mono text-xs text-white/30 tracking-widest">
                {String(TOTAL_STEPS).padStart(2, '0')}
              </span>
            </>
          )}
        </div>

        <style>{`
          @keyframes grain {
            0%,100%{transform:translate(0,0)}
            10%{transform:translate(-2%,-3%)}
            20%{transform:translate(3%,2%)}
            30%{transform:translate(-1%,4%)}
            40%{transform:translate(4%,-1%)}
            50%{transform:translate(-3%,3%)}
            60%{transform:translate(2%,-4%)}
            70%{transform:translate(-4%,1%)}
            80%{transform:translate(1%,-2%)}
            90%{transform:translate(-2%,4%)}
          }
        `}</style>
      </section>
    </div>
  )
}
