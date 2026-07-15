'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import type { IndustryReelProject } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

/*
  IndustryReel — a project-by-project carousel for the industry page's
  flagship showcase. Each project tints an ambient canvas glow by its own
  hue so scrubbing through feels like moving through distinct "scenes"
  rather than swapping static photos.
*/
export default function IndustryReel({ projects, accent }: { projects: IndustryReelProject[]; accent: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reel-fade',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  useEffect(() => {
    indexRef.current = index
  }, [index])

  const go = (delta: number) => setIndex((i) => (i + delta + projects.length) % projects.length)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let w = 0
    let h = 0
    let raf = 0
    let hue = projects[0]?.hue ?? 210

    const fit = () => {
      w = cv.width = cv.offsetWidth * devicePixelRatio
      h = cv.height = cv.offsetHeight * devicePixelRatio
    }
    fit()
    window.addEventListener('resize', fit)

    const rings = Array.from({ length: 5 }, (_, i) => ({
      r: 0.14 + i * 0.05,
      speed: 0.00025 * (i % 2 === 0 ? 1 : -1) * (1 + i * 0.15),
      tilt: (i / 5) * Math.PI,
      count: 26 + i * 6,
    }))

    const draw = (t: number) => {
      const target = projects[indexRef.current]?.hue ?? hue
      hue += (target - hue) * 0.03

      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h * 0.52
      const R = Math.min(w, h) * 0.32

      ctx.globalCompositeOperation = 'screen'
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6)
      glow.addColorStop(0, `hsla(${hue},80%,60%,0.22)`)
      glow.addColorStop(1, 'hsla(0,0%,0%,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      rings.forEach((ring, ri) => {
        for (let i = 0; i < ring.count; i++) {
          const a = (i / ring.count) * Math.PI * 2 + t * ring.speed
          const ex = Math.cos(ring.tilt) * 0.55 + 0.45
          const x = cx + Math.cos(a) * R * ring.r * 4.4
          const y = cy + Math.sin(a) * R * ring.r * 4.4 * ex - ri * 6
          const depth = (Math.sin(a) + 1) / 2
          const size = (1.4 + depth * 2.2) * devicePixelRatio
          const lightness = 45 + depth * 25
          ctx.fillStyle = `hsla(${hue + ri * 6},75%,${lightness}%,${0.35 + depth * 0.45})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // carve a soft clear band behind the name/kind/stat lines so the
      // particle ring frames the text instead of speckling through it
      ctx.globalCompositeOperation = 'destination-out'
      const clearW = Math.min(w * 0.74, R * 6.4)
      const clearH = h * 0.26
      const clear = ctx.createRadialGradient(cx, cy, 0, cx, cy, clearW / 2)
      clear.addColorStop(0, 'rgba(0,0,0,1)')
      clear.addColorStop(0.55, 'rgba(0,0,0,0.9)')
      clear.addColorStop(0.85, 'rgba(0,0,0,0.4)')
      clear.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(1, clearH / clearW)
      ctx.translate(-cx, -cy)
      ctx.fillStyle = clear
      ctx.fillRect(cx - clearW, cy - clearW, clearW * 2, clearW * 2)
      ctx.restore()

      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', fit)
      cancelAnimationFrame(raf)
    }
  }, [projects])

  if (!projects.length) return null
  const active = projects[index]

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-ink py-20 md:py-24">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent pointer-events-none" />

      <div className="reel-fade relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-14">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase" style={{ color: accent }}>
            <span className="w-8 h-px" style={{ background: `${accent}66` }} /> The Reel · Selected Work
          </span>
          <span className="font-mono text-[9.5px] tracking-[0.2em] text-white/40 border border-white/15 rounded-full px-3 py-1.5">← Drag / Click →</span>
        </div>

        <div className="relative text-center min-h-[220px] flex flex-col items-center justify-center">
          <h3 className="font-serif-accent italic text-4xl sm:text-5xl md:text-6xl text-white" style={{ textShadow: '0 4px 40px rgba(0,0,0,.85)' }}>
            {active.name}
          </h3>
          <div className="mt-3 font-mono text-[11px] tracking-[0.22em] text-white/60 uppercase" style={{ textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>
            {active.kind}
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.18em]" style={{ color: accent, textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>
            {active.stat}
          </div>
          <p className="mt-6 max-w-md text-sm text-white/55 font-light leading-relaxed" style={{ textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>{active.copy}</p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.03] text-white flex items-center justify-center transition-colors hover:border-white/40"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-label={`Show ${p.name}`}
                onClick={() => setIndex(i)}
                className="h-1 rounded-full transition-all"
                style={{ width: i === index ? 22 : 8, background: i === index ? accent : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.03] text-white flex items-center justify-center transition-colors hover:border-white/40"
          >
            →
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#gallery"
            className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors"
          >
            See the full case study
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
