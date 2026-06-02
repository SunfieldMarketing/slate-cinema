'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'PRE-PRODUCTION',
    tagline: 'The foundation of every masterpiece.',
    desc: 'We dive deep into concept development, architecting high-converting campaigns, meticulously scripting every scene, and drafting exhaustive shot lists to guarantee a flawless shoot day.',
    videoSrc: '/videos/pre-production.mp4',
    color: '#00AEEF',
    glow: 'rgba(0, 174, 239, 0.15)',
  },
  {
    num: '02',
    title: 'PRODUCTION',
    tagline: 'Where the magic happens.',
    desc: 'Utilizing cinema-grade cameras and mastery over lighting, our directors take charge on-location. We focus on dynamic, social-first capture that guarantees high retention and visual supremacy.',
    videoSrc: '/videos/production.mp4',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.15)',
  },
  {
    num: '03',
    title: 'POST-PRODUCTION',
    tagline: 'The polishing of the diamond.',
    desc: 'Our elite editors weave your footage together through aggressive color grading, immersive sound design, striking motion graphics, and VFX that command absolute attention.',
    videoSrc: '/videos/post-production.mp4',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  {
    num: '04',
    title: 'DISTRIBUTION',
    tagline: 'Deploying the payload.',
    desc: 'We deliver platform-specific, ad-ready exports optimized for TikTok, Reels, and YouTube. Combined with data-driven analytics review, we ensure your content dominates the algorithm.',
    videoSrc: '/videos/distribution.mp4',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.15)',
  },
]

// Rectangular-ish angled shards (less extreme, more "mirror" feel)
const shardClips = [
  'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',   // slight parallelogram lean right
  'polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)',   // slight parallelogram lean left
  'polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%)',   // slight lean top-right
  'polygon(0% 0%, 100% 5%, 100% 100%, 0% 95%)',   // slight lean bottom-right
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)
  const activeStepRef = useRef<number>(-1)

  useGSAP(() => {
    if (!containerRef.current) return

    // --- SNAP: one full scroll wheel tick = one step ---
    // We have 4 steps + 1 intro shatter = 5 phases
    // scrub timeline length = 4 units (each step = 1 unit for simplicity)
    const TOTAL_PHASES = steps.length + 1 // shatter + 4 steps

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${(TOTAL_PHASES) * 100}%`,
        pin: true,
        scrub: 1.2,
        snap: {
          snapTo: 1 / TOTAL_PHASES,
          duration: { min: 0.3, max: 0.6 },
          delay: 0.05,
          ease: 'power2.inOut',
        },
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress
          // Determine active step (0-indexed) from scroll progress
          const stepIdx = Math.min(
            steps.length - 1,
            Math.max(-1, Math.round(progress * TOTAL_PHASES) - 1)
          )
          if (stepIdx !== activeStepRef.current) {
            activeStepRef.current = stepIdx
          }
        },
      },
    })

    // ── PHASE 0: Shatter intro ──────────────────────────────
    tl.fromTo(
      '.bg-shard',
      { z: 0, rotateX: 0, rotateY: 0, x: 0, y: 0, opacity: 0.08 },
      {
        z: () => gsap.utils.random(-1200, 600),
        rotateX: () => gsap.utils.random(-120, 120),
        rotateY: () => gsap.utils.random(-120, 120),
        x: () => gsap.utils.random(-900, 900),
        y: () => gsap.utils.random(-600, 600),
        opacity: 0.18,
        duration: 1,
        ease: 'power3.inOut',
        stagger: { each: 0.02, from: 'center' },
      },
      0
    )
    tl.to('.initial-glass', { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power2.in' }, 0)
    tl.to('.section-title', { opacity: 0, z: 400, duration: 0.8 }, 0)
    tl.to('.section-tag', { opacity: 0, duration: 0.4 }, 0)

    // ── PHASES 1–4: each step ──────────────────────────────
    steps.forEach((step, index) => {
      const start = 1 + index        // e.g. step 0 starts at t=1
      const hold  = start + 0.6      // when elements are fully visible
      const leave = start + 0.85     // when they scatter away

      // Video shard flies in
      tl.to(
        `.video-shard-${index}`,
        {
          z: 180,
          x: index % 2 === 0 ? 240 : -240,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
        },
        start
      )

      // Text shards fly in with stagger
      const textEls = [
        `.num-shard-${index}`,
        `.title-shard-${index}`,
        `.tagline-shard-${index}`,
        `.desc-shard-${index}`,
      ]
      tl.to(
        textEls,
        {
          z: 250,
          x: index % 2 === 0 ? -260 : 260,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1,
          ease: 'power3.out',
        },
        start
      )

      // CTA always visible once step lands (no 3D, just fade in)
      tl.to(`.cta-${index}`, { opacity: 1, y: 0, duration: 0.4 }, hold)

      // Ambient glow pulse in
      tl.to(`.glow-${index}`, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, start)

      // ── Scatter (all except last step) ──────────────────
      if (index < steps.length - 1) {
        tl.to(
          `.video-shard-${index}`,
          {
            z: () => gsap.utils.random(-1200, -400),
            x: () => gsap.utils.random(-700, 700),
            y: () => gsap.utils.random(-500, 500),
            rotateX: () => gsap.utils.random(-90, 90),
            rotateY: () => gsap.utils.random(-90, 90),
            opacity: 0,
            duration: 0.8,
            ease: 'power3.in',
          },
          leave
        )

        tl.to(
          textEls,
          {
            z: () => gsap.utils.random(400, 1200),
            x: () => gsap.utils.random(-400, 400),
            y: () => gsap.utils.random(-400, 400),
            rotateX: () => gsap.utils.random(-60, 60),
            rotateY: () => gsap.utils.random(-60, 60),
            opacity: 0,
            stagger: 0.04,
            duration: 0.8,
            ease: 'power3.in',
          },
          leave
        )

        // CTA fades out (simple opacity)
        tl.to(`.cta-${index}`, { opacity: 0, y: 10, duration: 0.3 }, leave)
        tl.to(`.glow-${index}`, { opacity: 0, scale: 0.8, duration: 0.6 }, leave)
      }
    })

    // Constant slow ambient drift of bg shards
    gsap.to('.bg-shard', {
      rotateX: '+=30',
      rotateY: '+=30',
      duration: 12,
      ease: 'none',
      repeat: -1,
      yoyo: true,
    })

  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#030305] overflow-hidden"
      style={{ perspective: '1500px' }}
    >

      {/* ── Premium Background Layers ─────────────────────── */}

      {/* Animated noise grain overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          animation: 'grain 0.5s steps(1) infinite',
        }}
      />

      {/* Subtle horizontal scanlines */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Corner vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Central deep glow (always present, subtle) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.015) 0%, transparent 70%)',
        }}
      />

      {/* Per-step ambient color glows */}
      {steps.map((step, i) => (
        <div
          key={i}
          className={`glow-${i} absolute inset-0 z-0 pointer-events-none`}
          style={{
            background: `radial-gradient(ellipse 70% 70% at ${i % 2 === 0 ? '65%' : '35%'} 50%, ${step.glow} 0%, transparent 70%)`,
            opacity: 0,
            scale: 0.8,
          }}
        />
      ))}

      {/* Floating light beam (top-left) */}
      <div
        className="absolute -top-40 -left-20 w-[1px] h-[120vh] opacity-10 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)',
          transform: 'rotate(-20deg)',
        }}
      />
      {/* Floating light beam (top-right) */}
      <div
        className="absolute -top-40 -right-20 w-[1px] h-[120vh] opacity-10 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)',
          transform: 'rotate(20deg)',
        }}
      />

      {/* ── Initial Glass Sheet ───────────────────────────── */}
      <div className="initial-glass absolute inset-8 z-50 border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-3xl flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_120px_rgba(255,255,255,0.03)] pointer-events-none">
        {/* HOW IT WORKS tag */}
        <div className="section-tag mb-6 flex items-center gap-3">
          <span className="block w-8 h-px bg-white/40" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-white/50 uppercase">How It Works</span>
          <span className="block w-8 h-px bg-white/40" />
        </div>
        <h2 className="section-title text-6xl md:text-9xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 80px rgba(255,255,255,0.1)' }}>
          OUR PROCESS
        </h2>
        <p className="section-title mt-4 text-white/30 tracking-[0.2em] text-xs font-mono uppercase">
          Scroll to begin
        </p>
      </div>

      {/* ── Background Decorative Glass Shards ───────────── */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ transformStyle: 'preserve-3d' }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const size = 60 + (i % 5) * 30
          return (
            <div
              key={i}
              className="bg-shard absolute left-1/2 top-1/2 border border-white/10"
              style={{
                width: `${size}px`,
                height: `${size * 1.2}px`,
                marginLeft: `-${size / 2}px`,
                marginTop: `-${size * 0.6}px`,
                clipPath: shardClips[i % 4],
                background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
                backdropFilter: 'blur(4px)',
                transformStyle: 'preserve-3d',
              }}
            />
          )
        })}
      </div>

      {/* ── Step Layers ───────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {steps.map((step, index) => {
          const vidX  = index % 2 === 0 ? '240px' : '-240px'
          const textX = index % 2 === 0 ? '-260px' : '260px'
          const textAlign = index % 2 === 0 ? 'items-start' : 'items-end'

          return (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* ── Video Mirror Shard ─────────── */}
              <div
                className={`video-shard-${index} absolute bg-black/40 border border-white/20 overflow-hidden`}
                style={{
                  width: '360px',
                  height: '480px',
                  clipPath: shardClips[index % 4],
                  transform: `translate3d(${gsap.utils.random(-900, 900)}px, ${gsap.utils.random(-600, 600)}px, ${gsap.utils.random(-2500, -800)}px) rotateX(${gsap.utils.random(-180, 180)}deg) rotateY(${gsap.utils.random(-180, 180)}deg)`,
                  opacity: 0,
                  transformStyle: 'preserve-3d',
                  boxShadow: `0 0 60px ${step.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
              >
                <video
                  src={step.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-[160%] h-[160%] object-cover opacity-80"
                  style={{ left: '-30%', top: '-30%' }}
                />
                {/* Inner gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                {/* Color tint */}
                <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ backgroundColor: step.color }} />
                {/* Glass edge shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" style={{ clipPath: shardClips[index % 4] }} />
              </div>

              {/* ── Text Panel ────────────────── */}
              <div
                className={`absolute flex flex-col ${textAlign} justify-center pointer-events-none`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Step Number */}
                <div
                  className={`num-shard-${index} font-mono text-[7rem] md:text-[10rem] font-black tracking-tighter leading-none`}
                  style={{
                    color: step.color,
                    textShadow: `0 0 60px ${step.color}60, 0 0 120px ${step.color}20`,
                    transform: `translate3d(${gsap.utils.random(-600, 600)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(600, 1600)}px) rotateX(${gsap.utils.random(-90, 90)}deg)`,
                    opacity: 0,
                  }}
                >
                  {step.num}
                </div>

                {/* Title */}
                <div
                  className={`title-shard-${index} text-4xl md:text-6xl font-black text-white tracking-tighter uppercase -mt-2`}
                  style={{
                    textShadow: '0 2px 40px rgba(0,0,0,0.9)',
                    transform: `translate3d(${gsap.utils.random(-600, 600)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(600, 1600)}px) rotateY(${gsap.utils.random(-90, 90)}deg)`,
                    opacity: 0,
                  }}
                >
                  {step.title}
                </div>

                {/* Tagline — accent text */}
                <div
                  className={`tagline-shard-${index} mt-3 text-lg md:text-2xl font-medium tracking-wide`}
                  style={{
                    color: step.color,
                    textShadow: `0 0 30px ${step.color}80`,
                    fontStyle: 'italic',
                    transform: `translate3d(${gsap.utils.random(-600, 600)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(600, 1600)}px) rotateX(${gsap.utils.random(-60, 60)}deg)`,
                    opacity: 0,
                  }}
                >
                  — {step.tagline}
                </div>

                {/* Divider line */}
                <div
                  className={`desc-shard-${index} mt-5 w-24 h-px`}
                  style={{
                    background: `linear-gradient(to right, ${step.color}, transparent)`,
                    transform: `translate3d(${gsap.utils.random(-600, 600)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(600, 1600)}px)`,
                    opacity: 0,
                  }}
                />

                {/* Description */}
                <div
                  className={`desc-shard-${index} mt-4 max-w-[340px] md:max-w-[420px] text-white/70 text-base md:text-lg font-light leading-relaxed`}
                  style={{
                    transform: `translate3d(${gsap.utils.random(-600, 600)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(600, 1600)}px) rotateZ(${gsap.utils.random(-20, 20)}deg)`,
                    opacity: 0,
                  }}
                >
                  {step.desc}
                </div>

                {/* ── CTA Button (always flat, no 3D) ── */}
                <div
                  className={`cta-${index} mt-8 pointer-events-auto`}
                  style={{ opacity: 0, transform: 'translateY(8px)' }}
                >
                  <a
                    href="#schedule"
                    className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300"
                    style={{
                      border: `1px solid ${step.color}50`,
                      background: `linear-gradient(135deg, ${step.color}15, rgba(255,255,255,0.04))`,
                      color: 'white',
                      backdropFilter: 'blur(12px)',
                      boxShadow: `0 0 24px ${step.color}20`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = step.color
                      el.style.color = '#000'
                      el.style.boxShadow = `0 0 40px ${step.color}60`
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = `linear-gradient(135deg, ${step.color}15, rgba(255,255,255,0.04))`
                      el.style.color = 'white'
                      el.style.boxShadow = `0 0 24px ${step.color}20`
                    }}
                  >
                    Book A Strategy Call
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      {/* ── Step Progress Dots ────────────────────────────── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-none">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step-dot-${i} w-1.5 h-1.5 rounded-full border border-white/20 transition-all duration-500`}
            style={{ backgroundColor: 'transparent' }}
          />
        ))}
      </div>

      {/* CSS for grain animation */}
      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(3%, 2%); }
          30% { transform: translate(-1%, 4%); }
          40% { transform: translate(4%, -1%); }
          50% { transform: translate(-3%, 3%); }
          60% { transform: translate(2%, -4%); }
          70% { transform: translate(-4%, 1%); }
          80% { transform: translate(1%, -2%); }
          90% { transform: translate(-2%, 4%); }
        }
      `}</style>
    </section>
  )
}
