'use client'

import { useRef } from 'react'
import { NumberTicker } from '@/components/ui/number-ticker'
import { categories } from '@/lib/pipeline-data'

/*
  Beat 3 overlay — Post-Production (#10b981).
  The 685-part workstation assembles itself on the stage above; this layer
  is the working edit-timeline UI beneath it. Scroll scrubs the playhead
  (the orchestrator tweens it across this beat) and it can also be dragged
  directly. The playhead lives INSIDE the panel and spans only the panel's
  height — structurally incapable of overshooting.
*/

const post = categories[2]

const WAVE_POINTS = [8, 14, 6, 18, 11, 20, 9, 15, 5, 17, 12, 19, 7, 13, 10, 16, 6, 18, 9, 14, 11, 20, 8, 15, 6, 17, 10, 19, 7, 12]
const wavePath = (amp: number) =>
  WAVE_POINTS.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (WAVE_POINTS.length - 1)) * 100} ${20 - (v / 20) * amp}`).join(' ')

const RULER_MARKS = ['00:00', '00:04', '00:08', '00:12', '00:16']

export default function PostProductionScene() {
  const panelRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const panel = panelRef.current
    const head = playheadRef.current
    if (!panel || !head) return
    const rect = panel.getBoundingClientRect()
    const pct = Math.min(97, Math.max(3, ((clientX - rect.left) / rect.width) * 100))
    head.style.left = `${pct}%`
  }

  return (
    <div className="sb-scene sb-scene-post absolute inset-0 pointer-events-none" style={{ opacity: 0, visibility: 'hidden' }}>
      <p
        className="sbs-item absolute top-[15%] left-6 right-6 text-center text-white/90 text-xl md:text-3xl font-semibold tracking-tight"
        style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}
      >
        Then it all takes shape in the edit.
      </p>

      {/* Smaller + lower on mobile so there's real clearance between the
          panel and the ring above it, not just a few px. */}
      <div className="absolute bottom-[4%] md:bottom-[9%] left-1/2 -translate-x-1/2 w-[78vw] md:w-[88vw] max-w-3xl overflow-hidden pointer-events-auto">
        <div className="sbs-item flex items-center justify-between px-1 mb-1 md:mb-2">
          <span className="font-mono text-[7px] md:text-[9px] tracking-widest text-white/55 truncate">PGM · SLATE_FINAL_v3.mov</span>
          <span className="font-mono text-[7px] md:text-[9px] tracking-widest flex items-baseline gap-1 shrink-0" style={{ color: post.color }}>
            CLIENT RETENTION <NumberTicker value={98} className="font-mono text-[7px] md:text-[9px] tracking-widest !text-current" />%
          </span>
        </div>

        <div
          ref={panelRef}
          className="sbs-item relative w-full max-w-full rounded-xl border border-white/10 bg-[#0a0f0d]/90 backdrop-blur-sm p-1.5 md:p-4 overflow-hidden select-none box-border"
          onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerLeave={() => (dragging.current = false)}
        >
          <div className="grid grid-cols-[16px_1fr] md:grid-cols-[26px_1fr] gap-x-1 md:gap-x-2 gap-y-1 md:gap-y-1.5">
            <span />
            <div
              className="relative h-3.5 md:h-5 min-w-0"
              style={{ backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.14) 0 1px, transparent 1px 12px)' }}
            >
              {RULER_MARKS.map((m, i) => (
                <span key={m} className="absolute top-0 font-mono text-[6px] md:text-[8px] text-white/40" style={{ left: `${(i / (RULER_MARKS.length - 1)) * 92}%` }}>
                  {m}
                </span>
              ))}
            </div>

            <span className="font-mono text-[6px] md:text-[8px] text-white/40 self-center">V1</span>
            <div className="flex gap-1 h-8 md:h-11 min-w-0 overflow-hidden">
              {post.services.map((s, i) => (
                <div
                  key={s.name}
                  title={s.desc}
                  className="sbs-clip flex-1 min-w-0 rounded border px-1 md:px-1.5 flex items-center overflow-hidden cursor-pointer"
                  style={{
                    borderColor: `${post.color}45`,
                    background: `linear-gradient(180deg, ${post.color}${i % 2 ? '30' : '20'} 0%, ${post.color}10 100%)`,
                  }}
                >
                  <span className="font-mono text-[6px] md:text-[8.5px] text-white/80 truncate">{s.name}</span>
                </div>
              ))}
            </div>

            <span className="font-mono text-[6px] md:text-[8px] text-white/40 self-center hidden md:block">A1</span>
            <div className="h-7 rounded border border-white/8 bg-white/[0.02] overflow-hidden min-w-0 hidden md:block">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                <path d={wavePath(16)} fill="none" stroke={post.color} strokeOpacity="0.55" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <span className="font-mono text-[6px] md:text-[8px] text-white/40 self-center hidden md:block">A2</span>
            <div className="h-7 rounded border border-white/8 bg-white/[0.02] overflow-hidden min-w-0 hidden md:block">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                <path d={wavePath(10)} fill="none" stroke={post.color} strokeOpacity="0.3" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>

          <div
            ref={playheadRef}
            className="sbs-playhead absolute top-2 bottom-2 z-10 cursor-ew-resize"
            style={{ left: '3%' }}
            onPointerDown={(e) => {
              dragging.current = true
              ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
            }}
          >
            <span className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px shadow-[0_0_10px_rgba(52,211,153,0.9)]" style={{ background: '#34d399' }} />
            <span
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid #34d399' }}
            />
          </div>
        </div>

        <p
          className="sbs-item hidden md:block mt-2 text-center font-mono text-[9px] tracking-[0.3em] uppercase text-white/60"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
        >
          Scroll scrubs the edit · drag the playhead
        </p>
      </div>
    </div>
  )
}
