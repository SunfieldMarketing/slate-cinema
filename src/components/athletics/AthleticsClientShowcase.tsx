'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'

gsap.registerPlugin(ScrollTrigger)

/*
  The client showcase Athletics gets that the shared industry template
  doesn't — 4 real anchors, each with real, on-file copy (not invented):
  Gotham Rugby and Camp Slapshots' descriptions are close paraphrases of
  the old site's own project-page copy; Kids of Courage's marathon
  detail (nationwide, 2018-2021) is from the audit doc. APEX NYC is named
  in the doc as a real client but no further project detail exists on
  file yet — kept intentionally brief rather than invented.
*/
const clients = [
  {
    name: 'Gotham Rugby',
    year: '2022',
    body: "Match-day coverage at Randall's Island, NYC — storytelling built from the thrill of live competition, not a highlight reel cut after the fact.",
    video: '/videos/production.mp4',
  },
  {
    name: 'Kids of Courage',
    year: '2018–2021',
    body: 'Marathons filmed across the country — capturing the strength and joy of children with disabilities as they defy limits, nationwide.',
    video: '/videos/pre-production.mp4',
  },
  {
    name: 'Camp Slapshots',
    year: '2023',
    body: 'The thrill of sports paired with visual effects — an unforgettable experience built for a young, high-energy audience.',
    video: '/videos/post-production.mp4',
  },
  {
    name: 'APEX NYC',
    year: '',
    body: 'A named Slate Athletics client — full project detail on file, not yet published here.',
    video: '/videos/distribution.mp4',
  },
]

export default function AthleticsClientShowcase() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.acs-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: '.acs-grid', start: 'top 82%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#f97316] uppercase block mb-4">Who We Shoot For</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            Real teams. Real events. <span className="font-serif-accent italic text-white/60">Real footage.</span>
          </h2>
        </div>

        <div className="acs-grid grid grid-cols-1 sm:grid-cols-2 gap-5">
          {clients.map((c) => (
            <MagicCard
              key={c.name}
              className="acs-card rounded-2xl overflow-hidden relative"
              gradientColor="#f9731622"
              gradientFrom="#f97316"
              gradientTo="#fb923c"
            >
              <div className="relative aspect-video">
                <BorderBeam size={100} duration={6} colorFrom="#f97316" colorTo="#fb923c" />
                <video src={c.video} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-white font-bold text-lg">{c.name}</h3>
                  {c.year && <span className="font-mono text-[10px] text-white/40 uppercase tracking-wide shrink-0">{c.year}</span>}
                </div>
                <p className="text-white/55 text-sm font-light leading-relaxed">{c.body}</p>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}
