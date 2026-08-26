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
export default function StatsBand({
  stats,
  fieldPathPrefix,
}: {
  stats: Stat[]
  /** Click-to-edit field-path prefix for the array this data came from
      (e.g. "statsBand") -- optional since this component is reused across
      pages with different backing globals; omit if not yet wired up. */
  fieldPathPrefix?: string
}) {
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
          {stats.map((s, i) => (
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
              {/* whitespace-nowrap + tighter tracking/size than the rest
                  of the site's label style: a long label (e.g. a stat
                  with a year range baked in) needs real headroom to stay
                  on one line in a narrow 4-col cell -- tracking-widest
                  alone was wide enough to push "KIDS OF COURAGE
                  MARATHONS, 2018-2021" into wrapping even after the
                  number/suffix split fix. text-center means any residual
                  overflow spills evenly into the gap on both sides
                  rather than clipping or colliding with a neighbor. */}
              <div data-cms-field={fieldPathPrefix ? `${fieldPathPrefix}.${i}.label` : undefined} className="mt-3 font-mono text-[9px] sm:text-[10px] tracking-wide text-white/45 uppercase whitespace-nowrap">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
