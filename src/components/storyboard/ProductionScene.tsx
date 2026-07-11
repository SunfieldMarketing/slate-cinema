'use client'

import { categories } from '@/lib/pipeline-data'

/*
  Beat 2 overlay — Production (#a855f7).
  The 3D vintage camera (with the dim studio set behind it) owns the
  stage; this layer is the viewfinder chrome we look through — corner
  brackets, thirds grid, focus reticle, readouts, live meters — plus the
  real call sheet. All chrome is thin lines at the edges/center, so the
  camera reads through it.
*/

const prod = categories[1]

export default function ProductionScene() {
  return (
    <div className="sb-scene sb-scene-prod absolute inset-0 pointer-events-none" style={{ opacity: 0, visibility: 'hidden' }}>
      {/* Viewfinder chrome — thirds-grid + reticle only. Corner brackets
          live once in the persistent grid (StoryboardHero); a second set
          here duplicated that frame and read as two overlapping designs. */}
      <span className="absolute top-20 bottom-8 left-1/3 w-px bg-white/6" />
      <span className="absolute top-20 bottom-8 left-2/3 w-px bg-white/6" />
      <span className="absolute left-6 right-6 top-1/3 h-px bg-white/6" />
      <span className="absolute left-6 right-6 top-2/3 h-px bg-white/6" />

      <div className="sbs-item hidden md:block absolute top-[5.5rem] left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-white/70 whitespace-nowrap">
        A-CAM · 24MM · F/1.8 · ISO 800
      </div>
      <div className="sbs-item absolute top-[5.5rem] right-20 hidden md:flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-white/65">
        BAT 87%
        <span className="inline-flex gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`w-1.5 h-3 ${i < 3 ? 'bg-white/65' : 'bg-white/20'}`} />
          ))}
        </span>
      </div>

      {/* Audio meters — heights nudged by the scrub timeline */}
      <div className="sbs-item absolute bottom-12 right-20 hidden md:flex items-end gap-1 h-12">
        {[0.5, 0.8, 0.35, 0.65, 0.45].map((h, i) => (
          <span
            key={i}
            className="sbs-meter w-1.5 rounded-sm origin-bottom"
            style={{ height: '100%', transform: `scaleY(${h})`, background: `linear-gradient(to top, ${prod.color}, #f0abfc)` }}
          />
        ))}
        <span className="ml-2 font-mono text-[8px] tracking-widest text-white/45 self-end pb-0.5">AUD</span>
      </div>

      {/* Call sheet — the real crew/talent/set-design groups. The ring
          occupies most of the width on narrow viewports, so mobile gets a
          compact single-line list tucked above it instead of the full
          card list, which would otherwise sit directly over the object. */}
      <div className="hidden md:block absolute left-8 md:left-14 top-1/2 -translate-y-1/2 max-w-[16rem] pointer-events-auto">
        <p className="sbs-item font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: prod.color }}>
          Call Sheet — Day 01
        </p>
        <div className="flex flex-col gap-2.5">
          {prod.services.map((s, i) => (
            <div key={s.name} className="sbs-item sbs-row rounded-lg px-3 py-2.5 border border-white/10 bg-black/40 backdrop-blur-sm">
              <p className="font-mono text-[10px] tracking-widest text-white/90 mb-1">
                {String(i + 1).padStart(2, '0')} <span className="ml-1 uppercase">{s.name}</span>
              </p>
              <p className="text-[11px] text-white/65 font-light leading-snug">{s.tags?.join(' · ')}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden absolute left-6 right-6 top-[29%] flex flex-col gap-1.5">
        <p className="sbs-item font-mono text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: prod.color }}>
          Call Sheet — Day 01
        </p>
        {prod.services.map((s, i) => (
          <p key={s.name} className="sbs-item font-mono text-[10px] tracking-wide text-white/85" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85)' }}>
            {String(i + 1).padStart(2, '0')} <span className="uppercase">{s.name}</span>
          </p>
        ))}
      </div>

      <p
        className="sbs-item absolute top-[15%] left-6 right-6 md:max-w-[18rem] md:left-16 md:right-auto text-center md:text-left text-white/90 text-xl md:text-3xl font-semibold tracking-tight"
        style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}
      >
        On set, it all comes together.
      </p>
    </div>
  )
}
