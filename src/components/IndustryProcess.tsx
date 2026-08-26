'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Search, PenTool, Palette, Clapperboard, Package, type LucideIcon } from 'lucide-react'
import type { IndustryProcessStep } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

/* Step iconography mapped by position, so the data stays copy-only. */
const STEP_ICONS: LucideIcon[] = [Search, PenTool, Palette, Clapperboard, Package]

export default function IndustryProcess({ steps, accent }: { steps: IndustryProcessStep[]; accent: string }) {
  const ref = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.proc-fade',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } }
      )

      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { width: '0%' },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 65%',
              end: 'bottom 65%',
              scrub: 0.3,
              onUpdate: (self) => {
                const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
                nodeRefs.current.forEach((el, i) => {
                  if (!el) return
                  el.style.background = i <= idx ? accent : '#1b2534'
                  el.style.borderColor = i <= idx ? accent : 'rgba(255,255,255,0.25)'
                })
                cardRefs.current.forEach((el, i) => {
                  if (!el) return
                  el.style.borderColor = i === idx ? `${accent}80` : 'rgba(255,255,255,0.09)'
                })
              },
            },
          }
        )
      }
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  if (!steps.length) return null

  return (
    <section ref={ref} id="process" className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="proc-fade text-center mb-16">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: accent }}>
            <span className="w-8 h-px" style={{ background: `${accent}66` }} /> How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            The timeline, <span className="font-serif-accent italic text-white/60">concept to distribution.</span>
          </h2>
        </div>

        <div className="proc-fade relative h-1 bg-white/10 rounded-full mx-2 mb-3">
          <div ref={fillRef} className="absolute inset-y-0 left-0 rounded-full" style={{ width: '0%', background: `linear-gradient(90deg, ${accent}80, ${accent})` }} />
          {steps.map((s, i) => (
            <div
              key={s.title}
              ref={(el) => {
                nodeRefs.current[i] = el
              }}
              className="absolute top-1/2 w-3 h-3 -translate-y-1/2 -translate-x-1/2 rotate-45 border transition-colors duration-300"
              style={{ left: `${((i + 0.5) / steps.length) * 100}%`, background: '#1b2534', borderColor: 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>

        <div className="proc-fade grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-10">
          {steps.map((s, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length]
            return (
              <div
                key={s.title}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                className="group rounded-xl border bg-white/[0.02] p-5 transition-colors duration-300"
                style={{ borderColor: i === 0 ? `${accent}80` : 'rgba(255,255,255,0.09)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ borderColor: `${accent}40`, background: `${accent}14` }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: accent }} />
                </div>
                <div data-cms-field={`process.${i}.week`} className="font-mono text-[9px] tracking-[0.2em] uppercase mb-2.5" style={{ color: accent }}>
                  Keyframe {String(i + 1).padStart(2, '0')} · {s.week}
                </div>
                <h3 data-cms-field={`process.${i}.title`} className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                <p data-cms-field={`process.${i}.body`} className="text-xs text-white/55 leading-relaxed font-light">{s.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
