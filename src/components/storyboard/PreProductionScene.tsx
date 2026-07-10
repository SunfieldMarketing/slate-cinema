'use client'

import { categories } from '@/lib/pipeline-data'

/*
  Beat 1 overlay — Pre-Production (#00AEEF).
  The 3D script/papers on the persistent stage is the star; this layer only
  adds anime.js-toolbox-style leader-line labels around it, carrying the
  real service tags. Left column = Concepts, right column = Producing.
  The center stays clear for the stage + ring — nothing here can overlap
  or crop the object.
*/

const pre = categories[0]
const LEFT = pre.services[0].tags ?? []
const RIGHT = pre.services[1].tags ?? []

export default function PreProductionScene() {
  return (
    <div className="sb-scene sb-scene-pre absolute inset-0 pointer-events-none" style={{ opacity: 0, visibility: 'hidden' }}>
      {/* Concepts — lower left, lines reaching toward the stage */}
      <div className="absolute left-8 md:left-16 bottom-[26%] flex flex-col gap-4 items-start">
        <p className="sbs-item font-mono text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: pre.color }}>
          {pre.services[0].name}
        </p>
        {LEFT.map((t) => (
          <div key={t} className="sbs-item flex items-center gap-3">
            <span className="font-mono text-[11px] md:text-xs text-white/85 tracking-wide" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{t}</span>
            <span className="hidden md:block h-px w-14 lg:w-24" style={{ background: `${pre.color}55` }} />
            <span className="hidden md:block w-1.5 h-1.5 rounded-full" style={{ background: pre.color }} />
          </div>
        ))}
      </div>

      {/* Producing — upper right, mirrored */}
      <div className="absolute right-8 md:right-16 top-[27%] flex flex-col gap-4 items-end">
        <p className="sbs-item font-mono text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: pre.color }}>
          {pre.services[1].name}
        </p>
        {RIGHT.map((t) => (
          <div key={t} className="sbs-item flex items-center gap-3">
            <span className="hidden md:block w-1.5 h-1.5 rounded-full" style={{ background: pre.color }} />
            <span className="hidden md:block h-px w-14 lg:w-24" style={{ background: `${pre.color}55` }} />
            <span className="font-mono text-[11px] md:text-xs text-white/85 tracking-wide" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{t}</span>
          </div>
        ))}
      </div>

      {/* The story showcase line — one statement per beat, sized to carry
          real narrative weight rather than read as a caption. Pinned to the
          same top slot in every beat (see Production/Post/Distribution)
          so it never competes with the ring for space and always lands
          in the same spot as the visitor scrolls through. */}
      <p
        className="sbs-item absolute top-[15%] left-1/2 -translate-x-1/2 w-[90vw] text-center text-white/90 text-xl md:text-3xl font-semibold tracking-tight"
        style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}
      >
        Every project starts on the board.
      </p>
    </div>
  )
}
