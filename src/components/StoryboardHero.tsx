'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollState, toTimecode } from '@/lib/scroll'
import RingHUD, { type RingHUDHandle } from '@/components/storyboard/RingHUD'
import PreProductionScene from '@/components/storyboard/PreProductionScene'
import ProductionScene from '@/components/storyboard/ProductionScene'
import PostProductionScene from '@/components/storyboard/PostProductionScene'
import DistributionScene from '@/components/storyboard/DistributionScene'
import {
  RANGE_MULTIPLIER,
  TOTAL_UNITS,
  INTRO_EXIT,
  SCENE_ENTERS,
  SCENE_EXITS,
  CTA_ENTER,
  SCENES,
} from '@/components/storyboard/config'
import type { HeroStageHandle } from '@/components/storyboard/HeroStage'

gsap.registerPlugin(ScrollTrigger)

const HeroStage = dynamic(() => import('@/components/storyboard/HeroStage'), {
  ssr: false,
  loading: () => null,
})

/*
  The hero is one continuous scroll-driven 3D journey, architected the way
  animejs.com's homepage is (verified by live inspection): one persistent
  WebGL canvas that never unmounts, a segmented HUD ring that stays through
  every beat, spacer-driven scroll runway with a hand-rolled pin (GSAP
  pin:true and CSS sticky both failed for this section earlier — the
  scroll-listener fixed/absolute toggle is the proven fix), and a single
  master timeline that drives everything: DOM overlays, the ring's lit
  segment, the blueprint grid's accent color, and the 3D stage's
  choreography — all reading the same storyboard/config.ts, so no layer
  can desync from another.

  Beats: blank intro -> clapperboard (pre) -> camera + studio (prod) ->
  685-part workstation assemble (post) -> smartphone (dist) -> rigged
  camera playing its authored animation under a fully-lit ring (closing).

  In dev, window.__sbTl (timeline) and window.__stageState (3D beat state)
  are exposed so every beat can be applied synchronously and screenshot for
  verification even where requestAnimationFrame is throttled.
*/

const INJECTED_STYLES = `
  .sbs-row { transition: background 0.3s, transform 0.3s; }
  .sbs-row:hover { background: rgba(255,255,255,0.07); transform: translateX(4px); }
  .sbs-clip { transition: filter 0.25s, transform 0.25s; }
  .sbs-clip:hover { filter: brightness(1.6); transform: translateY(-1px); }
  .sb-cta-btn-primary { transition: all 0.35s cubic-bezier(0.25,1,0.5,1); }
  .sb-cta-btn-primary:hover { transform: translateY(-3px); }
  .sb-cta-btn-secondary { transition: all 0.35s cubic-bezier(0.25,1,0.5,1); }
  .sb-cta-btn-secondary:hover { transform: translateY(-3px); background: rgba(255,255,255,0.06); }
  .sb-silver-text {
    background: linear-gradient(180deg, #ffffff 0%, #7fb8dd 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0px 12px 24px rgba(0,0,0,0.7));
  }
`

interface Props {
  eyebrow?: string
  title: string[]
  subtitle?: string
  accent?: string
  cta?: { label: string; href: string }
}

export default function StoryboardHero({ eyebrow = 'The Process', title, subtitle, accent = '#00AEEF', cta }: Props) {
  const containerRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HeroStageHandle>(null)
  const ringRef = useRef<RingHUDHandle>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)
  const phaseLabelRef = useRef<HTMLDivElement>(null)
  const phaseNumberRef = useRef<HTMLSpanElement>(null)
  const phaseTitleRef = useRef<HTMLSpanElement>(null)
  const phaseLineRef = useRef<HTMLParagraphElement>(null)
  const activeIndexRef = useRef<number | 'intro' | 'closing'>('intro')

  const [pinState, setPinState] = useState<'before' | 'pinned' | 'after'>('before')

  // Always start at the very top of the page so we see the intro text
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Hand-rolled pin — proven fix, reused as-is.
  useEffect(() => {
    const updatePin = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const rangePx = window.innerHeight * RANGE_MULTIPLIER
      const scrollY = window.scrollY
      if (scrollY < sectionTop) setPinState('before')
      else if (scrollY < sectionTop + rangePx) setPinState('pinned')
      else setPinState('after')
    }
    updatePin()
    window.addEventListener('scroll', updatePin, { passive: true })
    window.addEventListener('resize', updatePin)
    return () => {
      window.removeEventListener('scroll', updatePin)
      window.removeEventListener('resize', updatePin)
    }
  }, [])

  // One sync point for every HUD layer, derived from timeline progress —
  // correct in both scroll directions, immune to call-position drift.
  const syncHud = (progress: number) => {
    const u = progress * TOTAL_UNITS
    let index: number | 'intro' | 'closing'
    if (u < INTRO_EXIT) index = 'intro'
    else if (u >= SCENE_EXITS[3]) index = 'closing'
    else {
      let i = 0
      for (let k = 0; k < SCENE_ENTERS.length; k++) if (u >= SCENE_ENTERS[k]) i = k
      index = i
    }
    if (index === activeIndexRef.current) return
    activeIndexRef.current = index

    ringRef.current?.setActive(index)

    const label = phaseLabelRef.current
    if (index === 'intro' || index === 'closing') {
      if (label) gsap.to(label, { autoAlpha: 0, duration: 0.3, overwrite: 'auto' })
      if (gridRef.current) gridRef.current.style.setProperty('--sb-accent', index === 'closing' ? '#ffffff' : accent)
    } else {
      const s = SCENES[index]
      if (phaseNumberRef.current) phaseNumberRef.current.textContent = s.number
      if (phaseTitleRef.current) {
        phaseTitleRef.current.textContent = s.title
        phaseTitleRef.current.style.color = s.color
      }
      if (phaseLineRef.current) phaseLineRef.current.textContent = s.line
      if (label) gsap.fromTo(label, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
      if (gridRef.current) gridRef.current.style.setProperty('--sb-accent', s.color)
    }
  }

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.set('.sb-text-inner', { autoAlpha: 0, y: 50, scale: 0.9, filter: 'blur(16px)' })
        gsap.set('.sb-cta-wrapper', { autoAlpha: 0 })
        gsap.set('.sb-ring', { autoAlpha: 0, scale: 0.9 })
        gsap.set(phaseLabelRef.current, { autoAlpha: 0 })

        gsap.to('.sb-text-inner', { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', delay: 0.2 })

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * RANGE_MULTIPLIER}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            const p = this.progress()
            syncHud(p)
            const u = p * TOTAL_UNITS
            stageRef.current?.setProgress(u)

            // Map u to ring degrees 0..1 to perfectly sync the white dot with the quadrants
            let ringP = 0
            if (u < SCENE_ENTERS[0]) {
              ringP = 0
            } else if (u >= SCENE_ENTERS[0] && u < SCENE_ENTERS[1]) {
              ringP = 0 + 0.25 * ((u - SCENE_ENTERS[0]) / (SCENE_ENTERS[1] - SCENE_ENTERS[0]))
            } else if (u >= SCENE_ENTERS[1] && u < SCENE_ENTERS[2]) {
              ringP = 0.25 + 0.25 * ((u - SCENE_ENTERS[1]) / (SCENE_ENTERS[2] - SCENE_ENTERS[1]))
            } else if (u >= SCENE_ENTERS[2] && u < SCENE_ENTERS[3]) {
              ringP = 0.50 + 0.25 * ((u - SCENE_ENTERS[2]) / (SCENE_ENTERS[3] - SCENE_ENTERS[2]))
            } else if (u >= SCENE_ENTERS[3] && u < CTA_ENTER) {
              ringP = 0.75 + 0.25 * ((u - SCENE_ENTERS[3]) / (CTA_ENTER - SCENE_ENTERS[3]))
            } else {
              ringP = 1
            }

            ringRef.current?.setProgress(ringP)
          },
        })

        // Intro exits; ring rises with the first beat and never leaves.
        scrollTl
          .to('.sb-text-outer', { scale: 1.08, filter: 'blur(14px)', autoAlpha: 0, ease: 'power2.inOut', duration: INTRO_EXIT }, 0)
          .to('.sb-ring', { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.9 }, INTRO_EXIT - 0.3)

        // DOM overlays per beat — same enter/exit language as before.
        SCENES.forEach((s, i) => {
          const enter = SCENE_ENTERS[i]
          const exit = SCENE_EXITS[i]
          const root = `.${s.cls}`
          scrollTl
            .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, enter)
            .fromTo(
              `${root} .sbs-item`,
              { y: 26, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out' },
              enter + 0.15
            )
            .to(root, { autoAlpha: 0, y: -30, filter: 'blur(8px)', duration: 0.5, ease: 'power2.in' }, exit)
            .set(root, { y: 0, filter: 'blur(0px)' }, exit + 0.55)
        })

        // Production meters pulse while the shot rolls.
        const meterLevels = [0.85, 0.4, 0.95, 0.55, 0.75]
        meterLevels.forEach((level, step) => {
          scrollTl.to(
            '.sb-scene-prod .sbs-meter',
            { scaleY: (i: number) => Math.max(0.2, Math.min(1, level - i * 0.12 + (i % 2) * 0.2)), duration: 0.35, ease: 'sine.inOut' },
            SCENE_ENTERS[1] + 0.6 + step * 0.4
          )
        })

        // Post: scroll scrubs the playhead across the edit.
        scrollTl.fromTo(
          '.sb-scene-post .sbs-playhead',
          { left: '3%' },
          { left: '97%', duration: SCENE_EXITS[2] - SCENE_ENTERS[2] - 0.4, ease: 'none' },
          SCENE_ENTERS[2] + 0.25
        )

        // Closing beat drops back to grid-only, matching the blank intro —
        // ring fades out just ahead of the CTA text so nothing but the
        // grid + copy remains.
        scrollTl
          .to('.sb-ring', { autoAlpha: 0, scale: 0.9, ease: 'power2.in', duration: 0.5 }, CTA_ENTER - 0.5)
          .fromTo(
            '.sb-cta-wrapper',
            { autoAlpha: 0, scale: 0.85, filter: 'blur(24px)' },
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' },
            CTA_ENTER
          )
          .to({}, { duration: TOTAL_UNITS - CTA_ENTER - 0.8 })

        if (process.env.NODE_ENV !== 'production') {
          ;(window as unknown as Record<string, unknown>).__sbTl = scrollTl
        }
      }, containerRef)

      return () => {
        if (process.env.NODE_ENV !== 'production') {
          delete (window as unknown as Record<string, unknown>).__sbTl
        }
        ctx.revert()
      }
    },
    { scope: containerRef }
  )

  useEffect(() => {
    let rafId: number
    const tick = () => {
      if (timecodeRef.current) timecodeRef.current.textContent = toTimecode(scrollState.progress)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full bg-ink" style={{ height: `calc(100vh + ${RANGE_MULTIPLIER * 100}vh)` }}>
      <div
        className="w-full h-screen overflow-hidden bg-ink"
        style={{
          position: pinState === 'pinned' ? 'fixed' : 'absolute',
          top: pinState === 'after' ? `${RANGE_MULTIPLIER * 100}vh` : 0,
          left: 0,
          right: 0,
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

        {/* Persistent blueprint grid — one surface for the whole journey;
            only its accent color changes per beat (via --sb-accent). */}
        <div
          ref={gridRef}
          className="absolute inset-0 z-0"
          style={
            {
              '--sb-accent': accent,
              backgroundImage:
                'repeating-linear-gradient(0deg, color-mix(in srgb, var(--sb-accent) 7%, transparent) 0 1px, transparent 1px 56px), repeating-linear-gradient(90deg, color-mix(in srgb, var(--sb-accent) 7%, transparent) 0 1px, transparent 1px 56px)',
              transition: '--sb-accent 0.5s',
            } as React.CSSProperties
          }
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)' }} />
          <span className="absolute top-24 left-10 w-6 h-6 border-l border-t border-white/15" />
          <span className="absolute top-24 right-10 w-6 h-6 border-r border-t border-white/15" />
          <span className="absolute bottom-10 left-10 w-6 h-6 border-l border-b border-white/15" />
          <span className="absolute bottom-10 right-10 w-6 h-6 border-r border-b border-white/15" />
        </div>

        {/* The persistent 3D stage */}
        <div className="absolute inset-0 z-10">
          <HeroStage ref={stageRef} className="w-full h-full" />
        </div>

        {/* The segmented ring around the stage */}
        <div className="sb-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-[min(74vh,92vw)] h-[min(74vh,92vw)]" style={{ opacity: 0, visibility: 'hidden' }}>
          <RingHUD ref={ringRef} className="w-full h-full" />
        </div>

        {/* Beat content overlays */}
        <div className="absolute inset-0 z-30">
          <PreProductionScene />
          <ProductionScene />
          <PostProductionScene />
          <DistributionScene />
        </div>

        {/* Intro — the ONLY thing visible at rest */}
        <div className="sb-text-outer absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <div className="sb-text-inner">
            <span data-cms-global="how-it-works-page" className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-6" style={{ color: accent }}>
              <span className="w-8 h-px" style={{ background: `${accent}66` }} /> <span data-cms-field="hero.eyebrow">{eyebrow}</span> <span className="w-8 h-px" style={{ background: `${accent}66` }} />
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.02]">
              {title.map((line, i) => (
                <span key={i} data-cms-field={i === 0 ? 'hero.title' : undefined} className="block">{line}</span>
              ))}
            </h1>
            {subtitle && <p data-cms-field="hero.subtitle" className="mt-6 text-white/55 text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
            <div className="mt-10 flex flex-col items-center gap-2 opacity-60">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="animate-bounce" style={{ color: `${accent}99` }}>
                <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="sb-cta-wrapper absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-4 pointer-events-auto" style={{ opacity: 0, visibility: 'hidden' }}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight sb-silver-text">Let&apos;s make something great.</h2>
          <p className="text-white/55 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Every project starts with a conversation — reach out and we&apos;ll walk you through exactly how it works.
          </p>
          {cta && (
            <div className="flex flex-col sm:flex-row gap-5">
              <a href={cta.href} data-cms-field="hero.ctaLabel" className="sb-cta-btn-primary px-8 py-4 rounded-full font-semibold text-sm text-black bg-white">
                {cta.label}
              </a>
            </div>
          )}
        </div>

        {/* Persistent HUD chrome */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute top-6 left-8 flex items-center gap-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            <span className="font-mono text-[11px] md:text-sm text-red-500 tracking-[0.3em] font-bold">REC</span>
          </div>
          <div className="absolute top-6 right-8" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
            <span ref={timecodeRef} className="font-mono text-[11px] md:text-sm text-white/85 tracking-widest">00:00:00:00</span>
          </div>

          <div
            ref={phaseLabelRef}
            className="absolute bottom-16 left-8 max-w-xs"
            style={{ opacity: 0, visibility: 'hidden', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
          >
            <div className="flex items-baseline gap-2 font-mono text-[10px] tracking-[0.25em] uppercase">
              <span ref={phaseNumberRef} className="text-white/60">01</span>
              <span ref={phaseTitleRef} className="font-bold" style={{ color: accent }}>Pre-Production</span>
            </div>
            {/* Redundant with each beat's own showcase headline, and a
                recurring source of bottom-of-screen crowding on narrow
                viewports where multiple beats already pack that zone. */}
            <p ref={phaseLineRef} className="hidden md:block mt-1 text-white/75 text-xs font-light" />
          </div>
        </div>
      </div>
    </section>
  )
}
