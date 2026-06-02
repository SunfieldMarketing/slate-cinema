'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ──────────────────────────────────────────────────────────────────────
const standards = [
  {
    id: 'strategy',
    label: '01',
    title: 'Strategic Vision',
    stat: '3×',
    statLabel: 'ROI',
    sub: 'Average return on video investment across our client campaigns',
    detail: 'Every project begins with deep market research, competitor analysis, and audience mapping. We don\'t just make videos — we engineer campaigns that move numbers.',
    tags: ['Brand Strategy', 'KPI Mapping', 'Audience Research'],
  },
  {
    id: 'storytelling',
    label: '02',
    title: 'Cinematic Storytelling',
    stat: '8.4%',
    statLabel: 'Engagement',
    sub: 'vs 2.1% industry average across all platforms',
    detail: 'We craft narratives that stop the scroll and hold attention. From concept to final cut, every creative decision is made to serve the story and the metric.',
    tags: ['Narrative Craft', 'Script Development', 'Visual Language'],
  },
  {
    id: 'execution',
    label: '03',
    title: 'Flawless Execution',
    stat: '100%',
    statLabel: 'On-Time',
    sub: 'Every project delivered on schedule, every time',
    detail: 'Precision production with professional crews, state-of-the-art equipment, and workflows that scale from a single reel to a full campaign suite.',
    tags: ['Multi-Camera Shoots', 'Post-Production', 'Campaign Delivery'],
  },
]

// ─── Waveform visual for Storytelling ─────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-8" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="flex-none rounded-full origin-bottom transition-all duration-300"
          style={{
            width: 3,
            height: `${active ? (Math.sin(i * 0.6) * 0.4 + 0.6) * 100 : 20}%`,
            background: active
              ? `linear-gradient(to top, #00AEEF, rgba(0,174,239,0.3))`
              : 'rgba(255,255,255,0.1)',
            transitionDelay: `${i * 0.02}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Circular progress ring for Execution ─────────────────────────────────────
function ProgressRing({ pct, active }: { pct: number; active: boolean }) {
  const r = 30
  const circ = 2 * Math.PI * r
  const dash = active ? circ * (pct / 100) : 0
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx="40" cy="40" r={r}
        fill="none"
        stroke="#00AEEF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{
          filter: active ? 'drop-shadow(0 0 6px rgba(0,174,239,0.7))' : 'none',
          transition: 'stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      <text x="40" y="45" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="monospace">
        {active ? `${pct}%` : '—'}
      </text>
    </svg>
  )
}

// ─── Network dots for Strategy ─────────────────────────────────────────────────
function NetworkDots({ active }: { active: boolean }) {
  const nodes = [
    { x: 40, y: 20 }, { x: 70, y: 35 }, { x: 60, y: 65 },
    { x: 20, y: 65 }, { x: 10, y: 35 }, { x: 40, y: 50 },
  ]
  const edges = [[0,5],[1,5],[2,5],[3,5],[4,5],[0,1],[1,2],[2,3],[3,4],[4,0]]
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={active ? 'rgba(0,174,239,0.3)' : 'rgba(255,255,255,0.05)'}
          strokeWidth="1"
          style={{ transition: 'stroke 0.6s ease' }}
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === 5 ? 5 : 3}
          fill={active ? (i === 5 ? '#00AEEF' : 'rgba(0,174,239,0.5)') : 'rgba(255,255,255,0.15)'}
          style={{
            filter: active && i === 5 ? 'drop-shadow(0 0 4px #00AEEF)' : 'none',
            transition: 'fill 0.6s ease, filter 0.6s ease',
          }}
        />
      ))}
    </svg>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function IndustryStandards() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // Section header entrance
      gsap.fromTo('.is-header',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'top 45%', scrub: 1 },
        }
      )

      // Tab buttons stagger in
      gsap.fromTo('.is-tab',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', end: 'top 35%', scrub: 1 },
        }
      )

      // Main panel
      gsap.fromTo('.is-panel',
        { opacity: 0, y: 50, rotateX: -8 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'top 30%', scrub: 1 },
        }
      )

      // Achievement badges
      gsap.fromTo('.is-badge',
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.is-badges', start: 'top 85%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  const active = standards[activeTab]

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44 bg-[#030305] overflow-hidden"
    >
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-black text-white whitespace-nowrap"
          style={{
            fontSize: 'clamp(6rem, 18vw, 16rem)',
            opacity: 0.018,
            letterSpacing: '-0.04em',
          }}
        >
          SLATE CINEMA
        </span>
      </div>

      {/* Radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,174,239,0.05) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="is-header opacity-0 max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#00AEEF]" />
            <span className="font-mono text-xs text-[#00AEEF] tracking-[0.4em] uppercase">// Why Us</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.0] mb-5">
            Leading Industry<br />Standards.
          </h2>
          <p className="text-lg text-white/45 max-w-xl leading-relaxed">
            At Slate Cinema, we set the benchmark for every frame, every cut, every campaign — backed by data and built for results.
          </p>
        </div>

        {/* ── Tab selector ─────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-10">
          {standards.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(i)}
              className={`is-tab opacity-0 group relative flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 text-left ${
                activeTab === i
                  ? 'border-[#00AEEF]/40 bg-[#00AEEF]/8 text-white'
                  : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/70'
              }`}
            >
              <span
                className="font-mono text-xs tracking-widest shrink-0"
                style={{ color: activeTab === i ? '#00AEEF' : 'inherit' }}
              >
                {s.label}
              </span>
              <span className="text-sm font-medium whitespace-nowrap hidden sm:block">{s.title}</span>
              {activeTab === i && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px rounded-full"
                  style={{ background: 'linear-gradient(to right, transparent, #00AEEF, transparent)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Main panel ───────────────────────────────────────────────────── */}
        <div
          className="is-panel opacity-0 grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/[0.07]"
          style={{ perspective: '800px' }}
        >

          {/* Left — stat + description */}
          <div
            className="relative p-10 lg:p-14 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(11,20,40,0.9) 0%, rgba(3,3,5,0.95) 100%)' }}
          >
            {/* Step number bg watermark */}
            <div
              className="absolute right-6 top-6 font-black text-white/[0.04] select-none pointer-events-none leading-none"
              style={{ fontSize: 'clamp(5rem, 10vw, 9rem)' }}
            >
              {active.label}
            </div>

            <div>
              {/* Label */}
              <span className="font-mono text-xs text-[#00AEEF]/70 tracking-[0.4em] uppercase mb-6 block">
                {active.label} / 03 — {active.title}
              </span>

              {/* Giant stat */}
              <div
                className="font-black text-white leading-none mb-2 tracking-tighter"
                style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  textShadow: '0 0 60px rgba(0,174,239,0.30), 0 0 120px rgba(0,174,239,0.12)',
                  transition: 'text-shadow 0.5s ease',
                }}
              >
                {active.stat}
              </div>
              <div className="text-[#00AEEF] font-mono text-sm tracking-[0.3em] uppercase mb-4">
                {active.statLabel}
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                {active.sub}
              </p>
            </div>

            <div>
              <p className="text-white/70 text-base leading-relaxed mb-8">
                {active.detail}
              </p>
              <div className="flex flex-wrap gap-2">
                {active.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-white/50 border border-white/10 rounded-full px-3 py-1 hover:border-[#00AEEF]/30 hover:text-[#00AEEF]/70 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — interactive visual */}
          <div
            className="relative flex flex-col items-center justify-center p-10 lg:p-14 gap-8"
            style={{ background: 'linear-gradient(135deg, rgba(3,3,5,0.95) 0%, rgba(11,20,40,0.6) 100%)' }}
          >
            {/* Visual element per tab */}
            <div className="flex flex-col items-center gap-6">

              {activeTab === 0 && (
                <>
                  <NetworkDots active />
                  <div className="text-center">
                    <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Strategic Network</div>
                    <div className="text-white/60 text-sm max-w-[200px] text-center leading-relaxed">
                      Every touchpoint mapped and optimized for maximum impact
                    </div>
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <Waveform active />
                  <div className="text-center">
                    <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Audience Engagement</div>
                    <div className="text-white/60 text-sm max-w-[200px] text-center leading-relaxed">
                      Content engineered to hold attention and drive action
                    </div>
                  </div>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <ProgressRing pct={100} active />
                  <div className="text-center">
                    <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Delivery Rate</div>
                    <div className="text-white/60 text-sm max-w-[200px] text-center leading-relaxed">
                      Precision execution with zero compromises on quality
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />

            {/* Other standards quick-links */}
            <div className="w-full flex flex-col gap-3">
              {standards.map((s, i) => i !== activeTab && (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center justify-between group px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:border-[#00AEEF]/25 hover:bg-[#00AEEF]/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/25 group-hover:text-[#00AEEF]/60 transition-colors">{s.label}</span>
                    <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors">{s.title}</span>
                  </div>
                  <span
                    className="font-bold text-white/20 group-hover:text-[#00AEEF]/60 text-base transition-colors"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {s.stat}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Achievement badges ───────────────────────────────────────────── */}
        <div className="is-badges flex flex-wrap justify-center gap-3 mt-14">
          {[
            '2024 Top Agency',
            '100M+ Views Delivered',
            'Award-Winning Production',
            'Multi-Platform Expertise',
            '4.4M+ Engagements',
            'Brooklyn, NY Based',
          ].map((badge) => (
            <span
              key={badge}
              className="is-badge opacity-0 font-mono text-xs text-white/40 border border-white/[0.08] rounded-full px-4 py-2 hover:border-[#00AEEF]/25 hover:text-[#00AEEF]/60 transition-colors duration-200 cursor-default"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
