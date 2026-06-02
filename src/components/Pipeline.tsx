'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ClipboardList, Clapperboard, Film, Radio } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'We map the idea before the camera turns on. Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.',
    icon: ClipboardList,
    videoSrc: '/videos/pre-production.mp4',
    // Reduced color grading opacity
    gradient: 'from-[#00AEEF]/10 via-transparent to-transparent',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: Clapperboard,
    videoSrc: '/videos/production.mp4',
    gradient: 'from-[#00AEEF]/10 via-transparent to-transparent',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: Film,
    videoSrc: '/videos/post-production.mp4',
    gradient: 'from-[#00AEEF]/10 via-transparent to-transparent',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: Radio,
    videoSrc: '/videos/distribution.mp4',
    gradient: 'from-[#00AEEF]/10 via-transparent to-transparent',
  },
]

export default function Pipeline() {
  const wrapperRef      = useRef<HTMLDivElement>(null)
  const pinnedRef       = useRef<HTMLDivElement>(null)
  const videoRefs       = useRef<(HTMLVideoElement | null)[]>([])
  const stepRefs        = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs         = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs        = useRef<(HTMLDivElement | null)[]>([])
  const watermarkRefs   = useRef<(HTMLDivElement | null)[]>([])

  const setVideoRef     = useCallback((el: HTMLVideoElement | null, i: number) => { videoRefs.current[i] = el }, [])
  const setStepRef      = useCallback((el: HTMLDivElement | null, i: number) => { stepRefs.current[i] = el }, [])
  const setDotRef       = useCallback((el: HTMLDivElement | null, i: number) => { dotRefs.current[i] = el }, [])
  const setLineRef      = useCallback((el: HTMLDivElement | null, i: number) => { lineRefs.current[i] = el }, [])
  const setWatermarkRef = useCallback((el: HTMLDivElement | null, i: number) => { watermarkRefs.current[i] = el }, [])

  function activateStep(activeIndex: number) {
    steps.forEach((_, i) => {
      const isActive = i === activeIndex
      const isPast   = i < activeIndex

      gsap.to(stepRefs.current[i], {
        opacity:  isActive ? 1 : 0.15,
        y:        isActive ? 0 : isPast ? -12 : 24,
        duration: 0.7,
        ease: 'power2.out',
        overwrite: true,
      })

      gsap.to(dotRefs.current[i], {
        scale:           isActive ? 1.5 : 0.55,
        backgroundColor: isActive ? '#00AEEF' : '#ffffff22',
        boxShadow:       isActive ? '0 0 18px 6px #00AEEF77' : '0 0 0px transparent',
        duration: 0.5,
        ease: 'power2.out',
        overwrite: true,
      })

      gsap.to(videoRefs.current[i], {
        opacity:  isActive ? 1 : 0,
        duration: 1.2,
        ease: 'power2.inOut',
        overwrite: true,
      })

      gsap.to(watermarkRefs.current[i], {
        opacity: isActive ? 0.05 : 0,
        y:       isActive ? 0 : isPast ? -40 : 40,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: true,
      })
    })
  }

  useGSAP(() => {
    // Initial states
    steps.forEach((_, i) => {
      const isFirst = i === 0
      gsap.set(stepRefs.current[i],     { opacity: isFirst ? 1 : 0.15, y: isFirst ? 0 : 24 })
      gsap.set(dotRefs.current[i],      {
        scale: isFirst ? 1.5 : 0.55,
        backgroundColor: isFirst ? '#00AEEF' : '#ffffff22',
        boxShadow: isFirst ? '0 0 18px 6px #00AEEF77' : '0 0 0px transparent',
      })
      gsap.set(videoRefs.current[i],    { opacity: isFirst ? 1 : 0 })
      gsap.set(watermarkRefs.current[i],{ opacity: isFirst ? 0.05 : 0, y: isFirst ? 0 : 40 })
      if (lineRefs.current[i]) gsap.set(lineRefs.current[i], { scaleY: 0, transformOrigin: 'top center' })
    })

    // Master pin — 600vh gives lots of scroll per step (150vh each)
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: '+=600vh',
      pin: pinnedRef.current,
      anticipatePin: 1,
    })

    // Per-step triggers — 600vh / 4 = 150vh each step
    const segSize = 600 / steps.length
    steps.forEach((_, i) => {
      ScrollTrigger.create({
        trigger:     wrapperRef.current,
        start:       `top+=${i * segSize}vh top`,
        end:         `top+=${(i + 1) * segSize}vh top`,
        onEnter:     () => activateStep(i),
        onEnterBack: () => activateStep(i),
      })
    })

    // Progress line scrub
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: '+=600vh',
      scrub: 1.2,
      onUpdate: (self) => {
        const p    = self.progress
        const segs = steps.length - 1
        lineRefs.current.forEach((line, i) => {
          if (!line || i >= segs) return
          const segStart = i / segs
          const segEnd   = (i + 1) / segs
          const fill     = Math.min(1, Math.max(0, (p - segStart) / (segEnd - segStart)))
          gsap.set(line, { scaleY: fill })
        })
      },
    })
  }, { scope: wrapperRef })

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        ref={pinnedRef}
        className="w-full h-screen bg-[#030305] flex overflow-hidden"
      >

        {/* ── Section header — fixed top bar ──────────────────────────────── */}
        <div className="absolute top-0 inset-x-0 z-30 pt-10 pb-6 px-8 md:px-16 lg:px-24 pointer-events-none">
          <span className="font-mono text-xs text-[#00AEEF] tracking-[0.4em] uppercase block mb-3">
            // Production Pipeline
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            How It Works
          </h2>
        </div>

        {/* ── LEFT 40% — progress rail + step list ────────────────────────── */}
        <div className="relative z-20 w-full md:w-[40%] h-full flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-36 pb-10 shrink-0">

          <div className="flex gap-8">

            {/* Progress rail with dots and connector lines */}
            <div className="flex flex-col items-center shrink-0 pt-2">
              {steps.map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    ref={(el) => setDotRef(el, i)}
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: '#ffffff22' }}
                  />
                  {i < steps.length - 1 && (
                    <div className="relative w-px bg-white/10 overflow-visible" style={{ height: '8rem' }}>
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
                    className="relative pl-5 origin-left mb-8"
                    style={{ minHeight: '8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: i === 0 ? 1 : 0.15 }}
                  >
                    {/* Active left-glow border */}
                    <div
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#00AEEF]"
                      style={{
                        boxShadow: '0 0 14px 3px #00AEEF88',
                        opacity: i === 0 ? 1 : 0,
                      }}
                    />

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/25 flex items-center justify-center text-[#00AEEF] shrink-0">
                        <Icon size={14} strokeWidth={1.5} />
                      </div>
                      <span className="font-mono text-[9px] text-[#00AEEF]/70 tracking-[0.3em] uppercase">
                        Step {step.num}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2 leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-white/55 text-xs md:text-sm leading-relaxed max-w-[22rem]">
                      {step.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT 60% — cinematic video ──────────────────────────────────── */}
        <div
          className="relative hidden md:flex w-[60%] h-full items-center justify-center shrink-0"
          style={{ perspective: '1400px' }}
        >
          {/* Left-edge blend */}
          <div
            className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #030305, transparent)' }}
          />

          {/* Video container */}
          <div
            className="relative w-[92%] h-[86%] rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(0,174,239,0.22)',
              boxShadow: '0 0 0 1px rgba(0,174,239,0.08), 0 0 60px rgba(0,174,239,0.10), 0 40px 120px rgba(0,0,0,0.8)',
            }}
          >
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px)' }}
            />

            {/* Corner glows */}
            <div className="absolute top-0 left-0 w-32 h-32 z-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(0,174,239,0.14), transparent 65%)' }} />
            <div className="absolute bottom-0 right-0 w-32 h-32 z-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at bottom right, rgba(0,174,239,0.10), transparent 65%)' }} />

            {/* REC indicator */}
            <div
              className="absolute top-0 left-0 right-0 h-10 z-30 flex items-center gap-2 px-5 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(3,3,5,0.92), transparent)' }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
              <span className="font-mono text-[9px] text-white/40 tracking-[0.4em] uppercase">REC · SLATE CINEMA</span>
            </div>

            {/* Video layers */}
            {steps.map((step, i) => (
              <div key={i} className="absolute inset-0">
                {/* Step number watermark */}
                <div
                  ref={(el) => setWatermarkRef(el, i)}
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none"
                  style={{ opacity: 0 }}
                >
                  <span
                    className="font-black leading-none"
                    style={{
                      fontSize: 'clamp(9rem, 22vw, 20rem)',
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(255,255,255,0.06)',
                      letterSpacing: '-0.05em',
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Reduced color grade overlay */}
                <div className={`absolute inset-0 z-10 bg-gradient-to-br ${step.gradient} pointer-events-none`} />

                {/* Vignette */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(3,3,5,0.6) 0%, transparent 45%)' }}
                />

                <video
                  ref={(el) => setVideoRef(el, i)}
                  src={step.videoSrc}
                  autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
                />

                {/* Fallback gradient bg */}
                <div
                  className="absolute inset-0 -z-10"
                  style={{ background: 'linear-gradient(135deg, #030305 0%, #0a1628 50%, #030305 100%)' }}
                />
              </div>
            ))}

            {/* Step label — bottom right */}
            <div className="absolute bottom-6 right-6 z-30 pointer-events-none">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="absolute bottom-0 right-0 text-right transition-opacity duration-700"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  data-step-label={i}
                >
                  <div className="font-mono text-[9px] text-[#00AEEF]/55 tracking-[0.3em] uppercase mb-0.5">
                    {step.num}&nbsp;/&nbsp;{String(steps.length).padStart(2, '0')}
                  </div>
                  <div className="text-white/35 text-[11px] font-light tracking-wide whitespace-nowrap">
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
