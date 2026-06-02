'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────
   SVG Icons (inline – no extra dependency)
───────────────────────────────────────── */
const CrosshairIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </svg>
)

const FilmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

/* ─────────────────────────────────────────
   Animated Waveform Bars (Card 2)
───────────────────────────────────────── */
function WaveformBars() {
  const bars = Array.from({ length: 28 }, (_, i) => i)
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-[3px] px-6 pb-6 overflow-hidden pointer-events-none">
      {bars.map((i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm opacity-[0.18]"
          style={{
            background: 'linear-gradient(to top, #a855f7, #ec4899)',
            height: `${20 + Math.sin(i * 0.7) * 15 + Math.cos(i * 1.3) * 10 + 15}%`,
            animation: `waveBar ${0.8 + (i % 7) * 0.15}s ease-in-out ${(i * 0.06) % 1}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   Radial Network Dots (Card 1)
───────────────────────────────────────── */
function NetworkDots() {
  const nodes = [
    { cx: 50, cy: 50 },
    { cx: 20, cy: 25 }, { cx: 80, cy: 20 }, { cx: 15, cy: 70 },
    { cx: 85, cy: 75 }, { cx: 50, cy: 10 }, { cx: 90, cy: 45 },
    { cx: 10, cy: 45 }, { cx: 55, cy: 88 },
  ]
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {nodes.slice(1).map((node, i) => (
        <line
          key={`line-${i}`}
          x1={nodes[0].cx} y1={nodes[0].cy}
          x2={node.cx} y2={node.cy}
          stroke="#00AEEF" strokeWidth="0.4" strokeDasharray="2 1"
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={`node-${i}`}
          cx={node.cx} cy={node.cy}
          r={i === 0 ? 3 : 1.5}
          fill={i === 0 ? '#00AEEF' : '#60a5fa'}
          style={{
            animation: `pulse ${1.5 + (i % 3) * 0.5}s ease-in-out ${i * 0.2}s infinite alternate`,
          }}
        />
      ))}
    </svg>
  )
}

/* ─────────────────────────────────────────
   Circular Progress Ring (Card 3)
───────────────────────────────────────── */
function CircularProgressRing() {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-20" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="3" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{ animation: 'ringFill 2s ease-out forwards' }}
        />
      </svg>
      <svg width="80" height="80" viewBox="0 0 80 80" className="absolute opacity-10" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r="28" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="4 3" />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────
   Film Grain Overlay (Card 2)
───────────────────────────────────────── */
function FilmGrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 rounded-3xl overflow-hidden opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        mixBlendMode: 'overlay',
        animation: 'grainShift 0.15s steps(1) infinite',
      }}
    />
  )
}

/* ─────────────────────────────────────────
   Achievement Badges
───────────────────────────────────────── */
const badges = [
  { label: 'Cannes Lions Qualified', color: '#f59e0b' },
  { label: '4K Ultra Production', color: '#00AEEF' },
  { label: 'Dolby Certified Audio', color: '#a855f7' },
  { label: 'ISO 9001 Delivery', color: '#10B981' },
  { label: 'Award-Winning Edits', color: '#ec4899' },
  { label: 'Global Brand Ready', color: '#f97316' },
]

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function IndustryStandards() {
  const sectionRef = useRef<HTMLElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // Header entrance
      gsap.fromTo(headerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Card 1 – flies in from bottom-left with rotateX + rotateY tilt
      gsap.fromTo(card1Ref.current,
        { y: 120, x: -60, opacity: 0, rotateX: 35, rotateY: -20, scale: 0.85 },
        {
          y: 0, x: 0, opacity: 1, rotateX: 0, rotateY: 0, scale: 1,
          duration: 1.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Card 2 (center/feature) – rises straight up with slight scale pop
      gsap.fromTo(card2Ref.current,
        { y: 160, opacity: 0, rotateX: 40, scale: 0.8 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1,
          duration: 1.3, ease: 'power3.out', delay: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Card 3 – flies in from bottom-right
      gsap.fromTo(card3Ref.current,
        { y: 120, x: 60, opacity: 0, rotateX: 35, rotateY: 20, scale: 0.85 },
        {
          y: 0, x: 0, opacity: 1, rotateX: 0, rotateY: 0, scale: 1,
          duration: 1.1, ease: 'power3.out', delay: 0.22,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Badges stagger entrance
      gsap.fromTo('.is-badge',
        { y: 30, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6, ease: 'back.out(1.7)', stagger: 0.08,
          scrollTrigger: {
            trigger: badgesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Watermark parallax drift
      gsap.to(watermarkRef.current, {
        y: -80, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <>
      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        @keyframes pulse {
          from { opacity: 0.4; r: 1.5px; }
          to   { opacity: 1;   r: 2.5px; }
        }
        @keyframes ringFill {
          from { stroke-dashoffset: ${2 * Math.PI * 42}; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes grainShift {
          0%  { transform: translate(0, 0); }
          25% { transform: translate(-3%, -4%); }
          50% { transform: translate(2%, 3%); }
          75% { transform: translate(-1%, 2%); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .is-card { perspective: 1200px; transform-style: preserve-3d; }
        .is-card-inner {
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .is-card-inner:hover {
          transform: scale(1.03) translateY(-6px);
        }
        .is-card-inner:hover .is-glow-blue  { box-shadow: 0 0 60px 10px rgba(0,174,239,0.25), inset 0 0 40px rgba(0,174,239,0.05); border-color: rgba(0,174,239,0.5); }
        .is-card-inner:hover .is-glow-purple { box-shadow: 0 0 60px 10px rgba(168,85,247,0.25), inset 0 0 40px rgba(168,85,247,0.05); border-color: rgba(168,85,247,0.5); }
        .is-card-inner:hover .is-glow-green  { box-shadow: 0 0 60px 10px rgba(16,185,129,0.25), inset 0 0 40px rgba(16,185,129,0.05); border-color: rgba(16,185,129,0.5); }
        .is-stat { background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .is-stat-blue   { background: linear-gradient(135deg, #00AEEF, #60d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .is-stat-purple { background: linear-gradient(135deg, #c084fc, #f0abfc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .is-stat-green  { background: linear-gradient(135deg, #34d399, #6ee7b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full min-h-screen bg-[#030305] py-28 md:py-36 px-5 md:px-12 overflow-hidden"
      >
        {/* ── Radial spotlight background ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,174,239,0.07)_0%,rgba(168,85,247,0.04)_35%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_80%,rgba(16,185,129,0.05)_0%,transparent_60%)]" />
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
        </div>

        {/* ── Massive watermark ── */}
        <div
          ref={watermarkRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <span
            className="font-black uppercase tracking-[0.25em] text-white whitespace-nowrap"
            style={{
              fontSize: 'clamp(5rem, 18vw, 18rem)',
              opacity: 0.022,
              letterSpacing: '0.18em',
            }}
          >
            SLATE CINEMA
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ── Section Header ── */}
          <div ref={headerRef} className="text-center mb-20 md:mb-28">
            <span className="font-mono text-[10px] tracking-[0.45em] uppercase text-[#00AEEF] block mb-5">
              // Industry Benchmarks
            </span>
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.9] mb-6">
              Leading Industry
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.35) 100%)' }}
              >
                Standards
              </span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              At Slate Cinema, we set the benchmark for every frame,
              every cut, every campaign.
            </p>
          </div>

          {/* ── Three Cards ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch mb-10">

            {/* ── Card 1: Strategic Vision ── */}
            <div ref={card1Ref} className="is-card">
              <div
                className="is-card-inner is-glow-blue relative h-full min-h-[480px] rounded-3xl border border-[#00AEEF]/20 overflow-hidden flex flex-col justify-between p-8 cursor-default"
                style={{
                  background: 'linear-gradient(145deg, #050d1a 0%, #020509 60%, #030305 100%)',
                  boxShadow: '0 4px 40px rgba(0,174,239,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
                }}
              >
                {/* Network dots visualization */}
                <NetworkDots />

                {/* Subtle top-left gradient accent */}
                <div className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.12) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />

                {/* Top row: icon + label */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#00AEEF]/30"
                      style={{ background: 'rgba(0,174,239,0.1)', boxShadow: '0 0 30px rgba(0,174,239,0.15)' }}
                    >
                      <span className="text-[#00AEEF]"><CrosshairIcon /></span>
                    </div>
                    <span className="font-mono text-[10px] text-[#00AEEF]/60 tracking-widest uppercase border border-[#00AEEF]/15 rounded-full px-3 py-1">
                      01 / Strategy
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                    Strategic Vision
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Average return on video investment for our clients
                  </p>
                </div>

                {/* Stat */}
                <div className="relative z-10">
                  <div className="mb-1">
                    <span className="is-stat-blue font-black leading-none" style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)' }}>
                      3x ROI
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-[#00AEEF]/40 to-transparent" />
                    <span className="text-[#00AEEF]/50 text-xs font-mono tracking-wider">VERIFIED METRIC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Card 2: Cinematic Storytelling (featured) ── */}
            <div ref={card2Ref} className="is-card lg:-mt-6 lg:mb-[-24px]">
              <div
                className="is-card-inner is-glow-purple relative h-full min-h-[540px] rounded-3xl border border-purple-500/25 overflow-hidden flex flex-col justify-between p-8 cursor-default"
                style={{
                  background: 'linear-gradient(160deg, #0d0514 0%, #09010f 50%, #030305 100%)',
                  boxShadow: '0 4px 60px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
                  transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
                }}
              >
                {/* Film grain */}
                <FilmGrain />

                {/* Waveform bars background */}
                <WaveformBars />

                {/* Center radial glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(168,85,247,0.15) 0%, transparent 60%)' }} />

                {/* Featured badge */}
                <div className="absolute top-5 right-5 z-20">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff' }}
                  >
                    ★ Featured
                  </span>
                </div>

                {/* Top section */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-purple-500/30"
                      style={{ background: 'rgba(168,85,247,0.12)', boxShadow: '0 0 30px rgba(168,85,247,0.2)' }}
                    >
                      <span className="text-purple-400"><FilmIcon /></span>
                    </div>
                    <span className="font-mono text-[10px] text-purple-400/60 tracking-widest uppercase border border-purple-500/15 rounded-full px-3 py-1">
                      02 / Story
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                    Cinematic Storytelling
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    vs{' '}
                    <span className="text-white/60 font-medium line-through decoration-red-400/60">2.1%</span>
                    {' '}industry average — we deliver 4× more
                  </p>
                </div>

                {/* Stat */}
                <div className="relative z-10">
                  <div className="mb-1">
                    <span className="is-stat-purple font-black leading-none" style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)' }}>
                      8.4%
                    </span>
                  </div>
                  <p className="text-purple-300/50 text-sm font-mono tracking-widest mt-1 uppercase">Engagement Rate</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/40 to-transparent" />
                    <span className="text-purple-400/50 text-xs font-mono tracking-wider">INDUSTRY LEADING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Card 3: Flawless Execution ── */}
            <div ref={card3Ref} className="is-card">
              <div
                className="is-card-inner is-glow-green relative h-full min-h-[480px] rounded-3xl border border-emerald-500/20 overflow-hidden flex flex-col justify-between p-8 cursor-default"
                style={{
                  background: 'linear-gradient(145deg, #03100a 0%, #020806 60%, #030305 100%)',
                  boxShadow: '0 4px 40px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
                }}
              >
                {/* Circular progress ring bg visual */}
                <CircularProgressRing />

                {/* Top-right gradient accent */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                {/* Top row */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-emerald-500/30"
                      style={{ background: 'rgba(16,185,129,0.1)', boxShadow: '0 0 30px rgba(16,185,129,0.15)' }}
                    >
                      <span className="text-emerald-400"><CheckCircleIcon /></span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400/60 tracking-widest uppercase border border-emerald-500/15 rounded-full px-3 py-1">
                      03 / Execute
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                    Flawless Execution
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Every project, every time — zero missed deadlines since founding
                  </p>
                </div>

                {/* Stat */}
                <div className="relative z-10">
                  <div className="mb-1">
                    <span className="is-stat-green font-black leading-none" style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)' }}>
                      100%
                    </span>
                  </div>
                  <p className="text-emerald-300/50 text-sm font-mono tracking-widest mt-1 uppercase">On-Time Delivery</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent" />
                    <span className="text-emerald-400/50 text-xs font-mono tracking-wider">PERFECT RECORD</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Achievement Badges Row ── */}
          <div ref={badgesRef} className="mt-14 md:mt-20">
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, i) => (
                <div
                  key={i}
                  className="is-badge flex items-center gap-2.5 px-5 py-2.5 rounded-full border cursor-default group transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: `${badge.color}25`,
                    background: `${badge.color}08`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = `${badge.color}60`
                    el.style.background = `${badge.color}15`
                    el.style.boxShadow = `0 0 20px ${badge.color}20`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = `${badge.color}25`
                    el.style.background = `${badge.color}08`
                    el.style.boxShadow = 'none'
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: badge.color, boxShadow: `0 0 6px ${badge.color}` }}
                  />
                  <span className="text-xs font-semibold text-white/60 tracking-wide group-hover:text-white/90 transition-colors duration-300">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
