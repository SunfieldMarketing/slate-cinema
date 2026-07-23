'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const stills = [
  { url: '/images/portfolio-production.png', label: 'On Set', desc: "Whether it's in the universe or metaverse our team shows up.", span: 'tall' as const },
  { url: '/images/portfolio-brand.png', label: 'The Edit Bay', desc: 'Frame-by-frame assembly with an editor who thinks in story beats.' },
  { url: '/images/portfolio-social.png', label: 'Color Suite', desc: 'A signature grade that makes your brand recognizable in any feed.' },
  { url: '/images/portfolio-event.png', label: 'Sound Stage', desc: 'Mix, score, and sound design tuned for sound-on and sound-off.', span: 'wide' as const },
]

export default function BehindTheScenes() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.bts-head', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } })
      // Rack-focus reveal — tiles settle in from an out-of-focus zoom rather
      // than sliding up, matching the "camera finding its shot" idea.
      gsap.fromTo('.bts-tile', { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: '.bts-grid', start: 'top 85%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full bg-ink overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="bts-head text-center mb-12 md:mb-14 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-4">
            <span className="w-8 h-px bg-[#00AEEF]/40" /> Behind The Scenes
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-4">
            Where the work happens
          </h2>
          <p className="text-white/55 text-sm sm:text-base font-light">
            Every phase has a room, a rig, and a person who obsesses over it.
          </p>
        </div>

        <div className="bts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] sm:auto-rows-[240px] gap-4">
          {stills.map((s) => (
            <div
              key={s.label}
              className={`bts-tile group relative rounded-2xl overflow-hidden border border-white/10 transition-colors duration-500 hover:border-[#00AEEF]/40 ${
                s.span === 'wide' ? 'sm:col-span-2' : ''
              } ${s.span === 'tall' ? 'sm:row-span-2' : ''}`}
            >
              <img
                src={s.url}
                alt={s.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                <h3 className="font-mono text-white font-bold text-sm tracking-wide uppercase mb-1.5">{s.label}</h3>
                <p className="font-serif-accent italic text-white/60 text-sm leading-relaxed max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
