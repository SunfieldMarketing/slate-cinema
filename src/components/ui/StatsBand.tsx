'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { NumberTicker } from '@/components/ui/number-ticker'

gsap.registerPlugin(ScrollTrigger)

export interface Stat {
  value: number
  suffix: string
  label: string
}

/* Reusable animated-counter stat strip (magicui NumberTicker) — drop
   different stat sets on any page. */
export default function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-col', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true } })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map((s) => (
            <div key={s.label} className="stat-col text-center">
              {/* whitespace-nowrap: the number+suffix must read as one
                  unit ("4yrs", "5.0") -- a value/suffix combination wide
                  enough to wrap here (e.g. a 4-digit value plus a long
                  suffix) is a data problem to fix at the source, not
                  something that should ever visibly break mid-number. */}
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-none whitespace-nowrap" style={{ textShadow: '0 0 60px rgba(0,174,239,0.25)' }}>
                <NumberTicker value={s.value} className="font-bold text-white" />
                <span className="text-brand-blue">{s.suffix}</span>
              </div>
              <div className="mt-3 font-mono text-[10px] sm:text-[11px] tracking-widest text-white/45 uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
