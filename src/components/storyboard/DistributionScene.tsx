'use client'

import { Marquee } from '@/components/ui/marquee'
import { categories } from '@/lib/pipeline-data'

/*
  Beat 4 overlay — Distribution (#f97316).
  The 3D smartphone rises on the stage; this layer runs the platform
  marquee beneath it (plain text chips, no brand logos) and lists the
  three real distribution services down the right side.
*/

const dist = categories[3]
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Meta Ads', 'Programmatic OOH', 'CTV']

export default function DistributionScene() {
  return (
    <div className="sb-scene sb-scene-dist absolute inset-0 pointer-events-none" style={{ opacity: 0, visibility: 'hidden' }}>
      {/* Real services — right column on desktop, leader-lined toward the
          stage. The ring occupies most of the width on narrow viewports,
          so mobile gets a compact single line tucked in the safe zone
          below the ring instead of a column overlapping the phone. */}
      <div className="hidden md:flex absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex-col gap-4 items-end max-w-[16rem]">
        {dist.services.map((s) => (
          <div key={s.name} className="sbs-item flex items-start gap-3 text-right">
            <div>
              <p className="text-white text-sm font-semibold">{s.name}</p>
              <p className="text-white/65 text-[11px] font-light leading-snug hidden md:block">{s.desc}</p>
            </div>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dist.color }} />
          </div>
        ))}
      </div>
      <p
        className="sbs-item md:hidden absolute left-6 right-6 bottom-[22%] text-center font-mono text-[10px] tracking-widest uppercase text-white/85"
        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85)' }}
      >
        {dist.services.map((s) => s.name).join(' · ')}
      </p>

      <p
        className="sbs-item absolute top-[15%] left-6 right-6 md:max-w-[18rem] md:left-16 md:right-auto text-center md:text-left text-white/90 text-xl md:text-3xl font-semibold tracking-tight"
        style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}
      >
        Then it goes everywhere at once.
      </p>

      {/* Platform marquee — plain text chips, no brand marks. Pinned flush
          to the bottom edge on mobile so it never touches the persistent
          phase-label chrome sitting just above it. */}
      <div className="sbs-item absolute bottom-1 md:bottom-[10%] left-1/2 -translate-x-1/2 w-[92vw] max-w-3xl [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pointer-events-auto">
        <Marquee reverse pauseOnHover className="[--duration:26s] [--gap:1.25rem]">
          {PLATFORMS.map((pl) => (
            <span
              key={pl}
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] rounded-full px-4 py-1.5 border"
              style={{ borderColor: `${dist.color}35`, background: `${dist.color}12`, color: '#fdba74' }}
            >
              {pl}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
