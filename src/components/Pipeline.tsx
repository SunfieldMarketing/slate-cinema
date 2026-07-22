'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ChevronDown, Play } from 'lucide-react'
import { categories } from '@/lib/pipeline-data'

gsap.registerPlugin(ScrollTrigger)

export default function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)
  const [activeService, setActiveService] = useState(0)
  // Hold off loading any category video until this section is actually
  // approaching the viewport — the hero's own frame sequence needs a clear
  // network runway right at page load.
  const [videosEnabled, setVideosEnabled] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideosEnabled(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pipe-fade', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  const selectCategory = (i: number) => {
    if (i === open) return
    setOpen(i)
    setActiveService(0)
  }

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="pipe-fade text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-brand-blue uppercase mb-5">
            <span className="w-8 h-px bg-brand-blue/40" /> How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            The Production Pipeline
          </h2>
          <p className="mt-5 text-white/50 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Four phases, each broken down into the exact services behind it. Open a phase to see what&apos;s included.
          </p>
        </div>

        <div className="pipe-fade relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden pl-5 pr-5 sm:pl-7 sm:pr-7">
          {/* Sprocket-hole rails — the whole pipeline reads as one reel of film,
              each category below is a "frame" advancing through it. */}
          <div
            className="absolute top-0 bottom-0 left-0 w-5 sm:w-7 pointer-events-none opacity-60"
            style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 8px, rgba(255,255,255,0.12) 8px 14px)' }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-5 sm:w-7 pointer-events-none opacity-60"
            style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 8px, rgba(255,255,255,0.12) 8px 14px)' }}
          />

          {categories.map((cat, i) => {
            const isOpen = open === i
            const active = cat.services[activeService] || cat.services[0]
            return (
              <div key={cat.id} className={`relative ${i !== 0 ? 'border-t border-white/10' : ''}`}>
                {/* Active frame indicator — colored edge like a highlighted cell in an edit bin */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-300"
                  style={{ background: isOpen ? cat.color : 'transparent' }}
                />
                <button
                  onClick={() => selectCategory(i)}
                  onMouseEnter={() => selectCategory(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 sm:px-8 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-3 sm:gap-4">
                    <span
                      className="font-mono text-[11px] sm:text-xs tracking-widest tabular-nums transition-colors duration-300"
                      style={{ color: isOpen ? cat.color : 'rgba(255,255,255,0.25)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xl sm:text-2xl font-semibold tracking-tight transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white/80'}`}>
                      {cat.title}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="hidden sm:inline font-mono text-[9px] tracking-widest uppercase transition-colors duration-300" style={{ color: isOpen ? `${cat.color}99` : 'rgba(255,255,255,0.2)' }}>
                      {isOpen ? 'Now Playing' : 'Frame'}
                    </span>
                    <ChevronDown
                      className="w-5 h-5 text-white/50 transition-transform duration-400 shrink-0"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: isOpen ? cat.color : undefined }}
                    />
                  </span>
                </button>

                <div
                  className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 sm:px-8 pb-8 grid md:grid-cols-[minmax(0,260px)_1fr] gap-6 md:gap-8">
                      {/* Category video — only mounted for the open panel. The
                          panel above it stays in the DOM at all times (CSS
                          grid-row collapse, not unmount) so an unconditional
                          <video autoPlay> here would fetch and play all four
                          categories' clips simultaneously on load, fighting
                          the hero's frame sequence for bandwidth. */}
                      <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video md:aspect-auto md:h-full min-h-[160px]">
                        {isOpen && videosEnabled && (
                          <video
                            key={cat.video}
                            src={cat.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/80">
                          <Play className="w-2.5 h-2.5" fill="currentColor" /> Live Preview
                        </div>
                      </div>

                      {/* Services + detail */}
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap gap-2">
                          {cat.services.map((s, si) => {
                            const isActive = si === activeService
                            return (
                              <button
                                key={s.name}
                                onClick={() => setActiveService(si)}
                                onMouseEnter={() => setActiveService(si)}
                                className="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300"
                                style={{
                                  borderColor: isActive ? cat.color : 'rgba(255,255,255,0.15)',
                                  background: isActive ? `${cat.color}18` : 'transparent',
                                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                }}
                              >
                                {s.name}
                              </button>
                            )
                          })}
                        </div>

                        {/* Detail panel for the highlighted service */}
                        <div
                          className="rounded-xl border p-5 sm:p-6 transition-colors duration-300 flex-1"
                          style={{ borderColor: `${cat.color}30`, background: `${cat.color}0A` }}
                        >
                          <h3 className="font-semibold text-white text-base mb-3">{active.name}</h3>
                          {active.tags ? (
                            <div className="flex flex-wrap gap-2">
                              {active.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-xs font-mono px-3 py-1.5 rounded-full border text-white/75"
                                  style={{ borderColor: `${cat.color}40`, background: `${cat.color}12` }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-white/60 text-sm font-light leading-relaxed">{active.desc}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
