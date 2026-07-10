'use client'

/*
  IndustryWheel — a donut-chart industry selector. Hover or tap a wedge to
  highlight it, swap the center label, and update the photo + blurb + CTA on
  the right. Deliberately no page-filtering side effect — just a compact,
  browsable "who we work with" moment that links out to each industry's own
  full page.
*/

import { useId, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { IndustryData } from '@/lib/industries'

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  // Math.cos/sin aren't guaranteed bit-identical across server (Node) and
  // client (browser) JS engines, so raw trig output can hydration-mismatch
  // by a fraction of a unit. Rounding kills the last-bit drift without any
  // visible effect at this scale.
  return { x: round(cx + r * Math.cos(angleRad)), y: round(cy + r * Math.sin(angleRad)) }
}

function round(n: number) {
  return Math.round(n * 1000) / 1000
}

function segmentPath(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(cx, cy, rOuter, endAngle)
  const outerEnd = polarToCartesian(cx, cy, rOuter, startAngle)
  const innerStart = polarToCartesian(cx, cy, rInner, startAngle)
  const innerEnd = polarToCartesian(cx, cy, rInner, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ')
}

export default function IndustryWheel({ industries, accent = '#00AEEF' }: { industries: IndustryData[]; accent?: string }) {
  const [active, setActive] = useState(0)
  const n = industries.length
  const gap = 1.4
  const segmentAngle = 360 / n
  const cx = 200
  const cy = 200
  const rOuter = 190
  const rInner = 100
  const labelR = (rOuter + rInner) / 2
  const current = industries[active]
  const gradId = useId().replace(/[:]/g, '')

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-center gap-14 lg:gap-16">
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] shrink-0 mx-auto">
        {/* Soft blue-white glow behind the wheel — the "add more color" pass */}
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-60 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 65%)` }}
        />
        <svg viewBox="0 0 400 400" className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id={`wheelActive-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
          {industries.map((ind, i) => {
            const start = i * segmentAngle + gap / 2
            const end = (i + 1) * segmentAngle - gap / 2
            const mid = (start + end) / 2
            const isActive = active === i
            const labelPos = polarToCartesian(cx, cy, labelR, mid)
            let rotation = mid
            if (mid > 90 && mid < 270) rotation += 180

            return (
              <g key={ind.id}>
                <path
                  d={segmentPath(cx, cy, rOuter, rInner, start, end)}
                  fill={isActive ? `url(#wheelActive-${gradId})` : `${accent}14`}
                  stroke={isActive ? '#ffffff' : `${accent}45`}
                  strokeWidth={isActive ? 1.5 : 1}
                  className="cursor-pointer transition-[fill,stroke] duration-300 ease-out"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  transform={`rotate(${rotation}, ${labelPos.x}, ${labelPos.y})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none transition-colors duration-300"
                  fill={isActive ? '#030305' : 'rgba(226,244,255,0.75)'}
                  fontSize={13}
                  fontWeight={700}
                  style={{ fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.03em', textTransform: 'uppercase' }}
                >
                  {ind.label}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Center label — sits in the hollow, sized to the inner radius */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[19%] pointer-events-none">
          <div
            className="absolute w-[52%] h-[52%] rounded-full -z-10"
            style={{ background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)` }}
          />
          <current.icon className="w-8 h-8 sm:w-9 sm:h-9 mb-2.5 transition-colors duration-300" style={{ color: accent }} />
          <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-white/40">Select Industry</span>
          <span className="text-lg sm:text-xl font-bold text-white leading-tight mt-1.5">{current.label}</span>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto lg:mx-0">
        <span className="font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-3 block text-center lg:text-left" style={{ color: accent }}>
          {current.label}
        </span>
        <p className="text-white/70 text-lg sm:text-xl font-light leading-relaxed mb-6 text-center lg:text-left">
          {current.blurb}
        </p>

        <Link
          href={`/portfolio/${current.slug}`}
          className="group relative block w-full h-56 sm:h-72 rounded-2xl overflow-hidden border mb-8"
          style={{ borderColor: `${accent}30` }}
        >
          <img
            key={current.id}
            src={current.heroImage}
            alt={current.label}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80">
              {current.stat}
            </span>
            <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        </Link>

        <div className="flex justify-center w-full">
          <Link
            href={`/portfolio/${current.slug}`}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-black transition-transform duration-300 hover:scale-[1.03]"
            style={{ background: `linear-gradient(135deg, #ffffff, ${accent})` }}
          >
            Explore {current.label} Work
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
