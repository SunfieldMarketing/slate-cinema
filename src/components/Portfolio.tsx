'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Play, ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  title: string
  category: string
  company: string
  url: string
  metrics: { label: string; value: string }[]
  span?: 'wide' | 'tall' | 'normal'
}

const projects: Project[] = [
  { title: 'Neon Nights', category: 'Commercial', company: 'HyperDrive Motors', url: '/images/portfolio-brand.png', metrics: [{ label: 'Views', value: '4.2M' }, { label: 'Conv.', value: '+34%' }], span: 'wide' },
  { title: 'Velocity', category: 'Social', company: 'Apex Athletics', url: '/images/portfolio-social.png', metrics: [{ label: 'Reach', value: '12.1M' }, { label: 'Engage', value: '18.5%' }], span: 'tall' },
  { title: 'The Blueprint', category: 'Documentary', company: 'Nexus Architecture', url: '/images/portfolio-production.png', metrics: [{ label: 'Brand Lift', value: '+45%' }, { label: 'Watch', value: '1:45' }] },
  { title: 'Ascension', category: 'Event', company: 'Summit Conf.', url: '/images/portfolio-event.png', metrics: [{ label: 'Attendees', value: '15k+' }, { label: 'Shares', value: '4.8k' }] },
  { title: 'Automotive Cinema', category: 'Action', company: 'Velocity Co', url: '/images/portfolio_auto_bright.png', metrics: [{ label: 'Views', value: '8.4M' }, { label: 'Shares', value: '245k' }], span: 'tall' },
  { title: 'Product Focus', category: 'E-Commerce', company: 'Lumiere Beauty', url: '/images/portfolio_beauty_bright.png', metrics: [{ label: 'ROAS', value: '4.2x' }, { label: 'Sales', value: '+$1.2M' }] },
  { title: 'Aerial Cinematography', category: 'Drone', company: 'Vista Real Estate', url: '/images/portfolio_realestate_bright.png', metrics: [{ label: 'Watch', value: '98%' }, { label: 'Shares', value: '12k' }], span: 'wide' },
  { title: 'Impact Film', category: 'Narrative', company: 'Global Health Org', url: '/images/portfolio_impact_bright.png', metrics: [{ label: 'Awards', value: '3' }, { label: 'Views', value: '1.1M' }] },
]

const filters = ['All', 'Commercial', 'Social', 'Documentary', 'Event', 'Action']

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState('All')

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pf-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      // Wipe reveal — a curtain opens left-to-right per card, like a film
      // gate clearing, instead of another slide-up.
      gsap.fromTo('.pf-card', { clipPath: 'inset(0 100% 0 0)', opacity: 0 }, {
        clipPath: 'inset(0 0% 0 0)', opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: '.pf-grid', start: 'top 90%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden py-24 md:py-28">

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="pf-head flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-4">
              <span className="w-8 h-px bg-[#00AEEF]/40" /> Our Work
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
              A Gallery of Impact
            </h2>
          </div>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all duration-300 border ${
                  filter === f
                    ? 'bg-[#00AEEF] text-black border-[#00AEEF]'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic card grid */}
        <div className="pf-grid grid grid-flow-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] sm:auto-rows-[260px] gap-4">
          {visible.map((p, i) => (
            <article
              key={p.title}
              className={`pf-card group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#00AEEF]/50 ${
                p.span === 'wide' ? 'sm:col-span-2' : ''
              } ${p.span === 'tall' ? 'sm:row-span-2' : ''}`}
            >
              {/* Image */}
              <img
                src={p.url}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              {/* Grade + gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-0 mix-blend-overlay bg-[#00AEEF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80">
                  {p.category}
                </span>
              </div>

              {/* Play button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                </div>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">{p.title}</h3>
                    <p className="text-white/50 text-xs font-mono truncate">{p.company}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-[#00AEEF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
                {/* Metrics reveal */}
                <div className="flex gap-4 mt-3 max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="text-[#00AEEF] font-bold text-sm">{m.value}</div>
                      <div className="text-white/40 text-[10px] font-mono uppercase tracking-wide">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <span className="relative text-sm font-semibold tracking-widest text-white group-hover:text-black transition-colors uppercase">
              View Full Portfolio
            </span>
            <ArrowUpRight className="relative w-4 h-4 text-white group-hover:text-black transition-colors" />
          </a>
        </div>
      </div>
    </section>
  )
}
