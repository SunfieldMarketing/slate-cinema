'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ThumbsUp, MessageSquare, Share2, Clock, TrendingUp, Users, Eye } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── Static data ──────────────────────────────────────────────────────────────

const WAVEFORM_BARS = 64
const BG_BARS = 28

const waveformHeights = Array.from({ length: WAVEFORM_BARS }, (_, i) => {
  const base = Math.sin(i * 0.35) * 0.4 + Math.sin(i * 0.13) * 0.3 + Math.cos(i * 0.22) * 0.2 + 0.1
  return Math.max(0.06, Math.min(1, base + Math.random() * 0.1))
})

const bgBarHeights = Array.from({ length: BG_BARS }, (_, i) => {
  return 15 + Math.sin(i * 0.7) * 20 + Math.random() * 30
})

const platforms = [
  { name: 'TikTok',    pct: 45, color: '#00AEEF' },
  { name: 'Instagram', pct: 32, color: '#A78BFA' },
  { name: 'YouTube',   pct: 23, color: '#34D399' },
]

const metricCards = [
  { icon: Clock,     label: 'Avg. Watch Time',  value: '0:47',  suffix: '' },
  { icon: TrendingUp,label: 'Engagement Rate',  value: '8.4',   suffix: '%' },
  { icon: Share2,    label: 'Total Shares',     value: '1.2',   suffix: 'M' },
  { icon: Users,     label: 'New Followers',    value: '340',   suffix: 'K' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatViews(n: number): string {
  if (n >= 100_000_000) return '100M+'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

function formatLikes(n: number): string {
  if (n >= 4_395_000) return '4.4M+'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

function formatComments(n: number): string {
  if (n >= 370_000) return '370K+'
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

function formatShares(n: number): string {
  if (n >= 1_200_000) return '1.2M+'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

// Fake live ticker numbers cycling past
const TICKER_PHRASES = [
  '100,341,892 views',
  '100,341,905 views',
  '100,341,917 views',
  '100,341,930 views',
  '100,341,944 views',
  '100,341,958 views',
  '100,341,971 views',
  '100,341,985 views',
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Results() {
  const containerRef    = useRef<HTMLElement>(null)
  const waveRef         = useRef<SVGSVGElement>(null)
  const tickerRef       = useRef<HTMLDivElement>(null)

  const [views,    setViews]    = useState(0)
  const [likes,    setLikes]    = useState(0)
  const [comments, setComments] = useState(0)
  const [shares,   setShares]   = useState(0)
  const [tickerIdx, setTickerIdx] = useState(0)

  // Live ticker interval (only after counters reach max)
  const [tickerActive, setTickerActive] = useState(false)

  useEffect(() => {
    if (!tickerActive) return
    const id = setInterval(() => {
      setTickerIdx(i => (i + 1) % TICKER_PHRASES.length)
    }, 120)
    return () => clearInterval(id)
  }, [tickerActive])

  // ── GSAP scroll animations ─────────────────────────────────────────────────
  useGSAP(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        }
      })

      // ── Counters ────────────────────────────────────────────────────────────
      const obj = { views: 0, likes: 0, comments: 0, shares: 0 }

      tl.to(obj, {
        views:    100_000_000,
        likes:    4_395_000,
        comments:   370_000,
        shares:   1_200_000,
        ease: 'power1.inOut',
        duration: 0.55,
        onUpdate: () => {
          setViews(Math.floor(obj.views))
          setLikes(Math.floor(obj.likes))
          setComments(Math.floor(obj.comments))
          setShares(Math.floor(obj.shares))
        },
        onComplete: () => setTickerActive(true),
      }, 0)

      // ── Section label ───────────────────────────────────────────────────────
      tl.fromTo('.res-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        0
      )

      // ── Main counter entrance ───────────────────────────────────────────────
      tl.fromTo('.res-counter',
        { opacity: 0, scale: 0.7, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power3.out' },
        0.02
      )

      // ── Ticker ──────────────────────────────────────────────────────────────
      tl.fromTo('.res-ticker',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
        0.3
      )

      // ── Waveform bars ───────────────────────────────────────────────────────
      tl.fromTo('.wave-bar',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, stagger: 0.008, duration: 0.25, ease: 'power2.out' },
        0.28
      )

      // Waveform continuous animation (looping)
      gsap.to('.wave-bar', {
        scaleY: 'random(0.15, 1)',
        duration: 'random(0.4, 0.9)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.05, from: 'random' },
      })

      // ── Platform bars ───────────────────────────────────────────────────────
      tl.fromTo('.platform-bar-fill',
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.08, duration: 0.28, ease: 'power3.out' },
        0.38
      )

      tl.fromTo('.platform-row',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.07, duration: 0.22, ease: 'power2.out' },
        0.36
      )

      // ── Engagement big cards ─────────────────────────────────────────────────
      tl.fromTo('.engage-card',
        { opacity: 0, y: 50, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.25, ease: 'power3.out' },
        0.45
      )

      // ── Metric mini cards ───────────────────────────────────────────────────
      tl.fromTo('.metric-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.2, ease: 'power2.out' },
        0.52
      )

      // ── Background bars rise from bottom ────────────────────────────────────
      tl.fromTo('.bg-bar',
        { scaleY: 0 },
        { scaleY: 1, stagger: 0.025, duration: 0.4, ease: 'power2.out' },
        0
      )

      // Gentle drift on bg bars
      gsap.to('.bg-bar', {
        scaleY: 'random(0.4, 1)',
        duration: 'random(1.5, 3.5)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.12, from: 'random' },
      })

    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#030305] overflow-hidden"
    >
      {/* ── Background rising bars ──────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 flex items-end justify-around pointer-events-none px-4">
        {bgBarHeights.map((h, i) => (
          <div
            key={i}
            className="bg-bar flex-1 mx-[1px] rounded-t-sm origin-bottom"
            style={{
              height: `${h}%`,
              background: i % 3 === 0
                ? 'linear-gradient(to top, rgba(0,174,239,0.12), rgba(0,174,239,0.02))'
                : i % 3 === 1
                  ? 'linear-gradient(to top, rgba(167,139,250,0.08), rgba(167,139,250,0.01))'
                  : 'linear-gradient(to top, rgba(52,211,153,0.06), rgba(52,211,153,0.01))',
            }}
          />
        ))}
      </div>

      {/* ── Top/bottom edge fades ───────────────────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-20 z-30 pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, #030305, transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-20 z-30 pointer-events-none"
           style={{ background: 'linear-gradient(to top, #030305, transparent)' }} />

      {/* ── Grid overlay ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
             backgroundSize: '60px 60px',
             maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
           }}
      />

      {/* ── Ambient glow orbs ───────────────────────────────────────────────── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[35vh] bg-[#00AEEF]/6 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vh] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-8 gap-0">

        {/* ── Section label ─────────────────────────────────────────────────── */}
        <span className="res-label font-mono text-[10px] sm:text-xs text-[#00AEEF] tracking-[0.4em] uppercase mb-4 opacity-0">
          // Performance Dashboard
        </span>

        {/* ── MAIN COUNTER ──────────────────────────────────────────────────── */}
        <div className="res-counter flex flex-col items-center opacity-0">
          <div
            className="font-black text-white leading-none tracking-tighter select-none"
            style={{
              fontSize: 'clamp(5rem, 18vw, 15rem)',
              textShadow: [
                '0 0 40px rgba(0,174,239,0.55)',
                '0 0 100px rgba(0,174,239,0.25)',
                '0 0 200px rgba(0,174,239,0.12)',
                '0 20px 60px rgba(0,0,0,0.7)',
              ].join(', '),
            }}
          >
            {formatViews(views)}
          </div>
          <div className="text-white/50 text-sm sm:text-base md:text-lg uppercase tracking-[0.35em] font-light mt-2">
            Total Views Delivered
          </div>
        </div>

        {/* ── Live ticker ───────────────────────────────────────────────────── */}
        <div className="res-ticker opacity-0 mt-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse" />
          <span
            ref={tickerRef}
            className="font-mono text-[11px] sm:text-xs text-[#00AEEF]/70 tracking-wider transition-all duration-75"
          >
            {tickerActive ? TICKER_PHRASES[tickerIdx] : 'LIVE · Counting in real-time'}
          </span>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className="w-full max-w-4xl h-px my-5 sm:my-6"
             style={{ background: 'linear-gradient(to right, transparent, rgba(0,174,239,0.3) 30%, rgba(0,174,239,0.3) 70%, transparent)' }}
        />

        {/* ── Animated Waveform ─────────────────────────────────────────────── */}
        <div className="w-full max-w-4xl mb-5 sm:mb-6">
          <div className="flex items-end justify-center gap-[2px] sm:gap-[3px] h-12 sm:h-16">
            {waveformHeights.map((h, i) => (
              <div
                key={i}
                className="wave-bar flex-none rounded-full origin-bottom opacity-0"
                style={{
                  width: 'clamp(3px, 1.2vw, 8px)',
                  height: `${Math.round(h * 100)}%`,
                  background: i % 4 === 0
                    ? 'linear-gradient(to top, #00AEEF, rgba(0,174,239,0.4))'
                    : i % 4 === 1
                      ? 'linear-gradient(to top, rgba(0,174,239,0.7), rgba(0,174,239,0.2))'
                      : i % 4 === 2
                        ? 'linear-gradient(to top, rgba(167,139,250,0.8), rgba(167,139,250,0.2))'
                        : 'linear-gradient(to top, rgba(0,174,239,0.5), rgba(0,174,239,0.1))',
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="font-mono text-[9px] text-white/25 tracking-widest uppercase">
              Audience Engagement Waveform · All Platforms
            </span>
          </div>
        </div>

        {/* ── Engagement Big Cards (Likes / Comments / Shares) ──────────────── */}
        <div className="flex items-stretch gap-3 sm:gap-4 w-full max-w-3xl mb-5 sm:mb-6">

          {/* Likes */}
          <div className="engage-card opacity-0 flex-1 bg-white/[0.03] border border-[#00AEEF]/15 rounded-2xl p-3 sm:p-5 flex flex-col items-center gap-1 sm:gap-2"
               style={{ boxShadow: '0 0 30px rgba(0,174,239,0.07) inset' }}>
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/25 flex items-center justify-center mb-1">
              <ThumbsUp className="text-[#00AEEF]" size={18} />
            </div>
            <div className="font-black text-white leading-none"
                 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.8rem)' }}>
              {formatLikes(likes)}
            </div>
            <span className="text-white/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Likes</span>
          </div>

          {/* Comments */}
          <div className="engage-card opacity-0 flex-1 bg-white/[0.03] border border-purple-500/15 rounded-2xl p-3 sm:p-5 flex flex-col items-center gap-1 sm:gap-2"
               style={{ boxShadow: '0 0 30px rgba(167,139,250,0.06) inset' }}>
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-1">
              <MessageSquare className="text-purple-400" size={18} />
            </div>
            <div className="font-black text-white leading-none"
                 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.8rem)' }}>
              {formatComments(comments)}
            </div>
            <span className="text-white/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Comments</span>
          </div>

          {/* Shares */}
          <div className="engage-card opacity-0 flex-1 bg-white/[0.03] border border-emerald-500/15 rounded-2xl p-3 sm:p-5 flex flex-col items-center gap-1 sm:gap-2"
               style={{ boxShadow: '0 0 30px rgba(52,211,153,0.06) inset' }}>
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-1">
              <Share2 className="text-emerald-400" size={18} />
            </div>
            <div className="font-black text-white leading-none"
                 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.8rem)' }}>
              {formatShares(shares)}
            </div>
            <span className="text-white/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Shares</span>
          </div>

        </div>

        {/* ── Platform Breakdown ────────────────────────────────────────────── */}
        <div className="w-full max-w-3xl mb-5 sm:mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={13} className="text-[#00AEEF]" />
            <span className="font-mono text-[10px] text-white/35 uppercase tracking-[0.3em]">Platform Breakdown</span>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            {platforms.map((p) => (
              <div key={p.name} className="platform-row opacity-0 flex items-center gap-3">
                <span className="font-mono text-[11px] sm:text-xs text-white/60 w-20 sm:w-24 shrink-0">{p.name}</span>
                <div className="flex-1 h-[6px] sm:h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="platform-bar-fill h-full rounded-full origin-left"
                    style={{
                      width: `${p.pct}%`,
                      background: `linear-gradient(to right, ${p.color}, ${p.color}88)`,
                      boxShadow: `0 0 10px ${p.color}55`,
                    }}
                  />
                </div>
                <span className="font-bold text-white/80 text-xs sm:text-sm w-10 text-right shrink-0">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4 Metric Cards Row ────────────────────────────────────────────── */}
        <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {metricCards.map((m, i) => (
            <div
              key={i}
              className="metric-card opacity-0 bg-white/[0.025] border border-white/[0.055] rounded-xl p-3 sm:p-4 flex flex-col gap-1 hover:border-[#00AEEF]/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center shrink-0">
                  <m.icon size={12} className="text-[#00AEEF]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-white/35 uppercase tracking-wider leading-tight">
                  {m.label}
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-white leading-none">
                {m.value}
                <span className="text-[#00AEEF] ml-0.5">{m.suffix}</span>
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
