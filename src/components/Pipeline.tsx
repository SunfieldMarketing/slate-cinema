'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ClipboardList, Clapperboard, Film, Radio } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'We map the idea before the camera turns on. Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.',
    icon: ClipboardList,
    videoSrc: '/videos/pipeline-pre.mp4',
    gradient: 'from-[#00AEEF]/20 via-[#0066AA]/10 to-transparent',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: Clapperboard,
    videoSrc: '/videos/production.mp4',
    gradient: 'from-[#00AEEF]/20 via-[#0088CC]/10 to-transparent',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: Film,
    videoSrc: '/videos/post-production.mp4',
    gradient: 'from-[#00AEEF]/20 via-[#005599]/10 to-transparent',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: Radio,
    videoSrc: '/videos/distribution.mp4',
    gradient: 'from-[#00AEEF]/20 via-[#003377]/10 to-transparent',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pipeline() {
  const wrapperRef       = useRef<HTMLDivElement>(null)
  const pinnedRef        = useRef<HTMLDivElement>(null)
  const videoWrapperRef  = useRef<HTMLDivElement>(null)

  // Per-step refs
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([])
  const stepRefs     = useRef<(HTMLDivElement | null)[]>([])
  const borderRefs   = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs     = useRef<(HTMLDivElement | null)[]>([])
  const watermarkRefs= useRef<(HTMLDivElement | null)[]>([])
  const labelRefs    = useRef<(HTMLDivElement | null)[]>([])

  const setVideoRef    = useCallback((el: HTMLVideoElement | null, i: number) => { videoRefs.current[i] = el }, [])
  const setStepRef     = useCallback((el: HTMLDivElement | null, i: number)    => { stepRefs.current[i] = el }, [])
  const setBorderRef   = useCallback((el: HTMLDivElement | null, i: number)    => { borderRefs.current[i] = el }, [])
  const setDotRef      = useCallback((el: HTMLDivElement | null, i: number)    => { dotRefs.current[i] = el }, [])
  const setLineRef     = useCallback((el: HTMLDivElement | null, i: number)    => { lineRefs.current[i] = el }, [])
  const setWatermarkRef= useCallback((el: HTMLDivElement | null, i: number)    => { watermarkRefs.current[i] = el }, [])
  const setLabelRef    = useCallback((el: HTMLDivElement | null, i: number)    => { labelRefs.current[i] = el }, [])

  // ── Activate a step (called from ScrollTrigger callbacks) ─────────────────
  function activateStep(activeIndex: number) {
    steps.forEach((_, i) => {
      const isActive = i === activeIndex
      const isPast   = i < activeIndex

      gsap.to(stepRefs.current[i], {
        opacity:  isActive ? 1 : 0.18,
        y:        isActive ? 0 : isPast ? -16 : 28,
        scaleX:   isActive ? 1 : 0.96,
        duration: 0.65,
        ease:     'power2.out',
        overwrite: true,
      })

      gsap.to(borderRefs.current[i], {
        opacity:  isActive ? 1 : 0,
        scaleY:   isActive ? 1 : 0.4,
        duration: 0.5,
        ease:     'power2.out',
        overwrite: true,
      })

      gsap.to(dotRefs.current[i], {
        scale:           isActive ? 1.5 : 0.55,
        backgroundColor: isActive ? '#00AEEF' : '#ffffff22',
        boxShadow:       isActive ? '0 0 18px 5px #00AEEF99' : '0 0 0px 0px transparent',
        duration: 0.5,
        ease:     'power2.out',
        overwrite: true,
      })

      gsap.to(videoRefs.current[i], {
        opacity:  isActive ? 1 : 0,
        duration: 1.0,
        ease:     'power2.inOut',
        overwrite: true,
      })

      gsap.to(watermarkRefs.current[i], {
        opacity: isActive ? 0.07 : 0,
        y:       isActive ? 0 : isPast ? -50 : 50,
        duration: 0.75,
        ease:    'power2.out',
        overwrite: true,
      })

      gsap.to(labelRefs.current[i], {
        opacity:  isActive ? 1 : 0,
        y:        isActive ? 0 : isPast ? -10 : 10,
        duration: 0.5,
        ease:     'power2.out',
        overwrite: true,
      })
    })
  }

  useGSAP(() => {
    // ── Set initial states ────────────────────────────────────────────────────
    steps.forEach((_, i) => {
      const isFirst = i === 0

      gsap.set(stepRefs.current[i],     { opacity: isFirst ? 1 : 0.18,  y: isFirst ? 0 : 28,  scaleX: isFirst ? 1 : 0.96 })
      gsap.set(borderRefs.current[i],   { opacity: isFirst ? 1 : 0,     scaleY: isFirst ? 1 : 0.4,  transformOrigin: 'top center' })
      gsap.set(dotRefs.current[i],      {
        scale:           isFirst ? 1.5 : 0.55,
        backgroundColor: isFirst ? '#00AEEF' : '#ffffff22',
        boxShadow:       isFirst ? '0 0 18px 5px #00AEEF99' : '0 0 0px 0px transparent',
      })
      gsap.set(videoRefs.current[i],    { opacity: isFirst ? 1 : 0 })
      gsap.set(watermarkRefs.current[i],{ opacity: isFirst ? 0.07 : 0, y: isFirst ? 0 : 50 })
      gsap.set(labelRefs.current[i],    { opacity: isFirst ? 1 : 0,    y: isFirst ? 0 : 10 })
      // connector lines start at 0
      if (lineRefs.current[i]) gsap.set(lineRefs.current[i], { scaleY: 0, transformOrigin: 'top center' })
    })

    // ── Master pin ────────────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger:       wrapperRef.current,
      start:         'top top',
      end:           '+=400vh',
      pin:           pinnedRef.current,
      anticipatePin: 1,
    })

    // ── Per-step ScrollTriggers ───────────────────────────────────────────────
    const segSize = 400 / steps.length // vh per step segment

    steps.forEach((_, i) => {
      const startOffset = i * segSize
      const endOffset   = (i + 1) * segSize

      ScrollTrigger.create({
        trigger:    wrapperRef.current,
        start:      `top+=${startOffset}vh top`,
        end:        `top+=${endOffset}vh top`,
        onEnter:    () => activateStep(i),
        onEnterBack:() => activateStep(i),
      })
    })

    // ── Progress line scrub ───────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start:   'top top',
      end:     '+=400vh',
      scrub:   1.2,
      onUpdate: (self) => {
        const p     = self.progress
        const segs  = steps.length - 1
        lineRefs.current.forEach((line, i) => {
          if (!line || i >= segs) return
          const segStart = i / segs
          const segEnd   = (i + 1) / segs
          const fill     = Math.min(1, Math.max(0, (p - segStart) / (segEnd - segStart)))
          gsap.set(line, { scaleY: fill })
        })
      },
    })

    // ── Subtle 3D tilt on video panel ─────────────────────────────────────────
    gsap.fromTo(
      videoWrapperRef.current,
      { rotateY: 2, rotateX: 0 },
      {
        rotateY: -2,
        rotateX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start:   'top top',
          end:     '+=400vh',
          scrub:   2,
        },
      }
    )
  }, { scope: wrapperRef })

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    /* 500vh tall scrollable wrapper — gives us 400vh of pinned scroll room */
    <div ref={wrapperRef} style={{ height: '500vh' }}>

      {/* ── Pinned full-screen panel ──────────────────────────────────────── */}
      <div
        ref={pinnedRef}
        className="w-full h-screen bg-[#030305] flex overflow-hidden"
      >

        {/* ═════════════════════════════════════════════════════════════════
            LEFT PANEL  40%  ·  Progress rail + step list
        ═════════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 w-full md:w-[40%] h-full flex flex-col justify-center
                        px-8 md:px-14 lg:px-20 pt-36 md:pt-28 pb-10 shrink-0">

          {/* ── Section header ─────────────────────────────────────────── */}
          <div className="mb-10 md:mb-14 pointer-events-none">
            <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.45em] uppercase block mb-3">
              // Production Pipeline
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              How It Works
            </h2>
          </div>

          {/* ── Layout: rail + items side by side ──────────────────────── */}
          <div className="flex gap-6">

            {/* Progress rail */}
            <div className="flex flex-col items-center shrink-0 pt-1">
              {steps.map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  {/* Dot */}
                  <div
                    ref={(el) => setDotRef(el, i)}
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: '#ffffff22' }}
                  />
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="relative w-px bg-white/10 overflow-visible"
                         style={{ height: '7rem' }}>
                      <div
                        ref={(el) => setLineRef(el, i)}
                        className="absolute inset-0 bg-[#00AEEF]"
                        style={{ transformOrigin: 'top center', transform: 'scaleY(0)' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Step items */}
            <div className="flex flex-col">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div
                    key={i}
                    ref={(el) => setStepRef(el, i)}
                    className="relative pl-5 origin-left"
                    style={{ height: '7rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    {/* Active left-glow border */}
                    <div
                      ref={(el) => setBorderRef(el, i)}
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#00AEEF]"
                      style={{
                        boxShadow: '0 0 14px 3px #00AEEF88',
                        opacity: 0,
                        transformOrigin: 'top center',
                      }}
                    />

                    {/* Header row */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/25
                                      flex items-center justify-center text-[#00AEEF] shrink-0">
                        <Icon size={14} strokeWidth={1.5} />
                      </div>
                      <span className="font-mono text-[9px] text-[#00AEEF]/70 tracking-[0.3em] uppercase">
                        Step {step.num}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-1.5 leading-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/55 text-xs md:text-[0.82rem] leading-relaxed max-w-[22rem]">
                      {step.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            RIGHT PANEL  60%  ·  Large cinematic video
        ═════════════════════════════════════════════════════════════════ */}
        <div
          className="relative hidden md:flex w-[60%] h-full items-center justify-center shrink-0"
          style={{ perspective: '1400px' }}
        >
          {/* Left-edge gradient blending into left column */}
          <div
            className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #030305, transparent)' }}
          />

          {/* 3D tiltable video container */}
          <div
            ref={videoWrapperRef}
            className="relative w-[92%] h-[86%] rounded-2xl overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              border:     '1px solid rgba(0,174,239,0.28)',
              boxShadow:  '0 0 0 1px rgba(0,174,239,0.10), 0 0 80px 0 rgba(0,174,239,0.14), 0 50px 140px rgba(0,0,0,0.85)',
            }}
          >
            {/* Scanline overlay for cinematic feel */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)',
              }}
            />

            {/* Corner glow accents */}
            <div className="absolute top-0 left-0 w-32 h-32 z-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(0,174,239,0.20), transparent 65%)' }} />
            <div className="absolute bottom-0 right-0 w-32 h-32 z-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at bottom right, rgba(0,174,239,0.14), transparent 65%)' }} />

            {/* Cinematic top bar — REC indicator */}
            <div
              className="absolute top-0 left-0 right-0 h-10 z-30 flex items-center gap-2 px-5 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(3,3,5,0.92), transparent)' }}
            >
              <div className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse opacity-70" />
              <span className="font-mono text-[9px] text-[#00AEEF]/50 tracking-[0.4em] uppercase">
                REC · SLATE CINEMA
              </span>
            </div>

            {/* ── Per-step video layers (stacked, crossfade) ─────────────── */}
            {steps.map((step, i) => (
              <div key={i} className="absolute inset-0">

                {/* Watermark step number */}
                <div
                  ref={(el) => setWatermarkRef(el, i)}
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none"
                  style={{ opacity: 0 }}
                >
                  <span
                    className="font-black leading-none"
                    style={{
                      fontSize:       'clamp(9rem, 22vw, 20rem)',
                      color:          'transparent',
                      WebkitTextStroke: '1.5px rgba(255,255,255,0.08)',
                      letterSpacing:  '-0.05em',
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Per-step colour grade overlay */}
                <div className={`absolute inset-0 z-10 bg-gradient-to-br ${step.gradient} pointer-events-none`} />

                {/* Bottom vignette */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(3,3,5,0.72) 0%, transparent 50%)' }}
                />

                {/* Actual video */}
                <video
                  ref={(el) => setVideoRef(el, i)}
                  src={step.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
                />

                {/* Fallback gradient behind video */}
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background: 'linear-gradient(135deg, #030305 0%, #0a1628 40%, #0d2240 70%, #030305 100%)',
                  }}
                />
              </div>
            ))}

            {/* Floating step counter — bottom right of video */}
            <div className="absolute bottom-6 right-6 z-30 pointer-events-none min-w-[6rem]">
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => setLabelRef(el, i)}
                  className="absolute bottom-0 right-0 text-right"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <div className="font-mono text-[9px] text-[#00AEEF]/60 tracking-[0.3em] uppercase mb-0.5">
                    {step.num}&nbsp;/&nbsp;{String(steps.length).padStart(2, '0')}
                  </div>
                  <div className="text-white/40 text-[11px] font-light tracking-wide whitespace-nowrap">
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* end videoWrapperRef */}
        </div>
        {/* end right panel */}

      </div>
      {/* end pinnedRef */}

    </div>
    /* end wrapperRef */
  )
}
