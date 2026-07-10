'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

/*
  ReelShowcase — the site's biggest single visual moment on the portfolio
  page. The player tilts in from a 3D perspective as it scrolls into frame
  (Aceternity's Container Scroll Animation) instead of a plain fade+scale.
  Starts as a poster with a play button (cheap, no iframe cost until
  requested); clicking swaps in the real Vimeo player with sound + controls
  for an actual "watch the reel" experience.
*/
export default function ReelShowcase() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="relative w-full bg-ink overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-[#00AEEF]/8 blur-[160px]" />
      </div>

      <div className="relative z-10 w-full">
        <ContainerScroll
          titleComponent={
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-4">
                <span className="w-8 h-px bg-[#00AEEF]/40" /> The Showreel <span className="w-8 h-px bg-[#00AEEF]/40" />
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                See the work in motion
              </h2>
            </div>
          }
        >
          <div className="relative w-full h-full">
            {playing ? (
              <iframe
                src="https://player.vimeo.com/video/937380835?autoplay=1&title=0&byline=0&portrait=0"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Slate Cinema Showreel"
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 w-full h-full"
                aria-label="Play the Slate Cinema showreel"
              >
                <img
                  src="/images/portfolio-production.png"
                  alt="Slate Cinema showreel poster"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00AEEF]/80 group-hover:border-[#00AEEF] transition-all duration-400 shadow-[0_0_40px_rgba(0,174,239,0.3)]">
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 text-white ml-1.5" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80">
                  2:47 · Full Reel
                </div>
              </button>
            )}
          </div>
        </ContainerScroll>
      </div>
    </section>
  )
}
