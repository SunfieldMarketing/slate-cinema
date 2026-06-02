'use client'

import { useRef } from 'react'
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

// Slightly angled parallelogram shards - consistent server/client
const shardClips = [
  'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
  'polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)',
  'polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%)',
  'polygon(0% 0%, 100% 5%, 100% 100%, 0% 95%)',
]

// Pre-computed scatter values — FIXED so server & client match exactly
const BG_SHARDS = [
  { x: 320, y: -180, z: -800, rx: 45, ry: -30, size: 70 },
  { x: -450, y: 200, z: -600, rx: -60, ry: 80, size: 90 },
  { x: 150, y: 350, z: -1100, rx: 30, ry: 45, size: 60 },
  { x: -280, y: -300, z: -900, rx: -45, ry: -60, size: 80 },
  { x: 600, y: 100, z: -700, rx: 70, ry: -20, size: 100 },
  { x: -100, y: -420, z: -500, rx: -80, ry: 40, size: 65 },
  { x: 420, y: 280, z: -1200, rx: 55, ry: 65, size: 75 },
  { x: -550, y: -150, z: -650, rx: -35, ry: -75, size: 85 },
  { x: 200, y: -350, z: -950, rx: 65, ry: 30, size: 95 },
  { x: -350, y: 400, z: -800, rx: -50, ry: 55, size: 70 },
  { x: 500, y: -200, z: -1050, rx: 40, ry: -85, size: 60 },
  { x: -180, y: 250, z: -600, rx: -70, ry: 25, size: 90 },
  { x: 350, y: -100, z: -750, rx: 25, ry: -50, size: 80 },
  { x: -480, y: 180, z: -1150, rx: -55, ry: 70, size: 65 },
  { x: 120, y: -280, z: -900, rx: 80, ry: -40, size: 75 },
  { x: -220, y: 320, z: -700, rx: -30, ry: -65, size: 85 },
  { x: 450, y: 240, z: -850, rx: 60, ry: 35, size: 95 },
  { x: -390, y: -260, z: -1000, rx: -45, ry: 80, size: 70 },
]

// Per-step, per-element scatter positions (video + 5 text elements each)
const SCATTER = [
  // Step 0 (video, num, title, tagline, line, desc)
  { vid: { x: -700, y: 300, z: -1800, rx: 120, ry: -80 }, num: { x: 480, y: -420, z: 900, rx: 70, ry: 0 }, title: { x: -380, y: 200, z: 1100, rx: 0, ry: 85 }, tag: { x: 320, y: -180, z: 800, rx: -40, ry: 0 }, line: { x: -200, y: 350, z: 700, rx: 0, ry: 0 }, desc: { x: 250, y: 300, z: 1200, rx: 0, ry: 0, rz: -18 } },
  // Step 1
  { vid: { x: 650, y: -280, z: -2100, rx: -110, ry: 95 }, num: { x: -500, y: 380, z: 1050, rx: -80, ry: 0 }, title: { x: 420, y: -200, z: 1300, rx: 0, ry: -90 }, tag: { x: -300, y: 250, z: 950, rx: 50, ry: 0 }, line: { x: 180, y: -320, z: 800, rx: 0, ry: 0 }, desc: { x: -280, y: -250, z: 1100, rx: 0, ry: 0, rz: 15 } },
  // Step 2
  { vid: { x: -580, y: -320, z: -1900, rx: 95, ry: 110 }, num: { x: 420, y: 460, z: 1150, rx: 60, ry: 0 }, title: { x: -460, y: -300, z: 950, rx: 0, ry: -70 }, tag: { x: 350, y: 200, z: 1050, rx: -55, ry: 0 }, line: { x: -150, y: 380, z: 900, rx: 0, ry: 0 }, desc: { x: 300, y: -200, z: 1300, rx: 0, ry: 0, rz: 20 } },
  // Step 3
  { vid: { x: 720, y: 250, z: -2200, rx: -130, ry: -100 }, num: { x: -460, y: -400, z: 1200, rx: -65, ry: 0 }, title: { x: 380, y: 350, z: 1000, rx: 0, ry: 80 }, tag: { x: -320, y: -220, z: 850, rx: 45, ry: 0 }, line: { x: 200, y: 300, z: 750, rx: 0, ry: 0 }, desc: { x: -250, y: 280, z: 1250, rx: 0, ry: 0, rz: -22 } },
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const TOTAL_PHASES = steps.length + 1

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${TOTAL_PHASES * 100}%`,
        pin: true,
        scrub: 1.2,
        snap: {
          snapTo: 1 / TOTAL_PHASES,
          duration: { min: 0.3, max: 0.6 },
          delay: 0.05,
          ease: 'power2.inOut',
        },
        anticipatePin: 1,
      },
    })

    // ── Phase 0: Shatter intro ──────────────────────────
    tl.to('.initial-glass', { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power2.in' }, 0)
    tl.to('.section-title-el', { opacity: 0, z: 400, duration: 0.8 }, 0)
    tl.to('.section-tag-el', { opacity: 0, duration: 0.4 }, 0)

    // Explode bg shards
    BG_SHARDS.forEach((s, i) => {
      tl.to(`.bg-shard-${i}`, {
        x: s.x, y: s.y, z: s.z,
        rotateX: s.rx, rotateY: s.ry,
        opacity: 0.22,
        duration: 1,
        ease: 'power3.inOut',
      }, 0)
    })

    // ── Phases 1–4: each step ───────────────────────────
    steps.forEach((step, index) => {
      const sc = SCATTER[index]
      const start = 1 + index
      const hold  = start + 0.55
      const leave = start + 0.82

      // Video shard flies in
      tl.to(`.video-shard-${index}`, {
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
      }, start)

      // Text shards fly in with stagger
      const textTargets = [
        `.num-shard-${index}`,
        `.title-shard-${index}`,
        `.tagline-shard-${index}`,
        `.line-shard-${index}`,
        `.desc-shard-${index}`,
      ]
      tl.to(textTargets, {
        z: 250,
        x: index % 2 === 0 ? -260 : 260,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 1,
        ease: 'power3.out',
      }, start)

      // CTA fades in (flat, no 3D)
      tl.to(`.cta-${index}`, { opacity: 1, y: 0, duration: 0.4 }, hold)

      // Ambient glow
      tl.to(`.glow-${index}`, { opacity: 1, duration: 0.8, ease: 'power2.out' }, start)

      // ── Scatter out (not last step) ─────────────────
      if (index < steps.length - 1) {
        tl.to(`.video-shard-${index}`, {
          z: sc.vid.z, x: sc.vid.x, y: sc.vid.y,
          rotateX: sc.vid.rx, rotateY: sc.vid.ry,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.in',
        }, leave)

        tl.to(`.num-shard-${index}`,    { z: -sc.num.z,   x: sc.num.x,   y: sc.num.y,   rotateX: sc.num.rx,   opacity: 0, duration: 0.8, ease: 'power3.in' }, leave)
        tl.to(`.title-shard-${index}`,  { z: -sc.title.z, x: sc.title.x, y: sc.title.y, rotateY: sc.title.ry, opacity: 0, duration: 0.8, ease: 'power3.in' }, leave + 0.04)
        tl.to(`.tagline-shard-${index}`,{ z: -sc.tag.z,   x: sc.tag.x,   y: sc.tag.y,   rotateX: sc.tag.rx,   opacity: 0, duration: 0.8, ease: 'power3.in' }, leave + 0.08)
        tl.to(`.line-shard-${index}`,   { z: -sc.line.z,  x: sc.line.x,  y: sc.line.y,  opacity: 0, duration: 0.6, ease: 'power3.in' }, leave + 0.1)
        tl.to(`.desc-shard-${index}`,   { z: -sc.desc.z,  x: sc.desc.x,  y: sc.desc.y,  rotateZ: sc.desc.rz,  opacity: 0, duration: 0.8, ease: 'power3.in' }, leave + 0.12)

        tl.to(`.cta-${index}`, { opacity: 0, y: 8, duration: 0.3 }, leave)
        tl.to(`.glow-${index}`, { opacity: 0, duration: 0.5 }, leave)
      }
    })

    // Slow ambient drift of bg shards
    gsap.to('.bg-shard-anim', {
      rotateX: '+=25', rotateY: '+=25',
      duration: 14, ease: 'none', repeat: -1, yoyo: true,
    })

  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#030305] overflow-hidden"
      style={{ perspective: '1500px' }}
    >

      {/* ── Premium Background Layers ─────────────────────── */}

      {/* Film grain */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          animation: 'grain 0.5s steps(1) infinite',
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Corner vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.85) 100%)' }}
      />

      {/* Central ambient glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.012) 0%, transparent 70%)' }}
      />

      {/* Light beams */}
      <div className="absolute -top-40 -left-10 w-px h-[130vh] opacity-[0.08] pointer-events-none z-0"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.8), transparent)', transform: 'rotate(-18deg)' }} />
      <div className="absolute -top-40 -right-10 w-px h-[130vh] opacity-[0.06] pointer-events-none z-0"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)', transform: 'rotate(18deg)' }} />

      {/* Per-step color glows */}
      {steps.map((step, i) => (
        <div key={i} className={`glow-${i} absolute inset-0 z-0 pointer-events-none`}
          style={{
            background: `radial-gradient(ellipse 65% 65% at ${i % 2 === 0 ? '68%' : '32%'} 50%, ${step.glow} 0%, transparent 70%)`,
            opacity: 0,
          }}
        />
      ))}

      {/* ── Initial Glass Sheet ───────────────────────────── */}
      <div className="initial-glass absolute inset-8 z-50 border border-white/[0.08] bg-white/[0.025] backdrop-blur-2xl rounded-3xl flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_120px_rgba(255,255,255,0.02)] pointer-events-none">
        <div className="section-tag-el mb-6 flex items-center gap-3">
          <span className="block w-8 h-px bg-white/30" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-white/40 uppercase">How It Works</span>
          <span className="block w-8 h-px bg-white/30" />
        </div>
        <h2 className="section-title-el text-6xl md:text-9xl font-black text-white tracking-tighter"
          style={{ textShadow: '0 0 80px rgba(255,255,255,0.08)' }}>
          OUR PROCESS
        </h2>
        <p className="section-title-el mt-4 text-white/25 tracking-[0.25em] text-xs font-mono uppercase">
          Scroll to begin
        </p>
      </div>

      {/* ── Background Decorative Shards ─────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ transformStyle: 'preserve-3d' }}>
        {BG_SHARDS.map((s, i) => (
          <div
            key={i}
            className={`bg-shard-${i} bg-shard-anim absolute left-1/2 top-1/2 border border-white/[0.07]`}
            style={{
              width: `${s.size}px`,
              height: `${s.size * 1.3}px`,
              marginLeft: `-${s.size / 2}px`,
              marginTop: `-${s.size * 0.65}px`,
              clipPath: shardClips[i % 4],
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)',
              backdropFilter: 'blur(3px)',
              transformStyle: 'preserve-3d',
              opacity: 0.08,
            }}
          />
        ))}
      </div>

      {/* ── Step Layers ───────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        {steps.map((step, index) => {
          const sc = SCATTER[index]
          const isEven = index % 2 === 0

          return (
            <div key={index} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>

              {/* ── Video Mirror Shard ─────────────────────── */}
              <div
                className={`video-shard-${index} absolute overflow-hidden border border-white/15`}
                style={{
                  width: '360px',
                  height: '480px',
                  clipPath: shardClips[index % 4],
                  // Use pre-computed values — no gsap.utils.random() in JSX!
                  transform: `translate3d(${sc.vid.x}px, ${sc.vid.y}px, ${sc.vid.z}px) rotateX(${sc.vid.rx}deg) rotateY(${sc.vid.ry}deg)`,
                  opacity: 0,
                  transformStyle: 'preserve-3d',
                  boxShadow: `0 0 60px ${step.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                <video
                  src={step.videoSrc}
                  autoPlay loop muted playsInline
                  className="absolute object-cover opacity-80"
                  style={{ width: '160%', height: '160%', left: '-30%', top: '-30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 mix-blend-overlay opacity-25" style={{ backgroundColor: step.color }} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
              </div>

              {/* ── Text Panel ────────────────────────────── */}
              <div
                className={`absolute flex flex-col ${isEven ? 'items-start' : 'items-end'} justify-center pointer-events-auto`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Step Number */}
                <div
                  className={`num-shard-${index} font-mono font-black tracking-tighter leading-none`}
                  style={{
                    fontSize: 'clamp(5rem, 10vw, 9rem)',
                    color: step.color,
                    textShadow: `0 0 60px ${step.color}80, 0 0 120px ${step.color}25`,
                    transform: `translate3d(${sc.num.x}px, ${sc.num.y}px, ${sc.num.z}px) rotateX(${sc.num.rx}deg)`,
                    opacity: 0,
                  }}
                >
                  {step.num}
                </div>

                {/* Title */}
                <div
                  className={`title-shard-${index} font-black text-white tracking-tighter uppercase -mt-2`}
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                    textShadow: '0 2px 40px rgba(0,0,0,0.9)',
                    transform: `translate3d(${sc.title.x}px, ${sc.title.y}px, ${sc.title.z}px) rotateY(${sc.title.ry}deg)`,
                    opacity: 0,
                  }}
                >
                  {step.title}
                </div>

                {/* Tagline accent */}
                <div
                  className={`tagline-shard-${index} mt-3 text-xl md:text-2xl font-medium tracking-wide italic`}
                  style={{
                    color: step.color,
                    textShadow: `0 0 30px ${step.color}90`,
                    transform: `translate3d(${sc.tag.x}px, ${sc.tag.y}px, ${sc.tag.z}px) rotateX(${sc.tag.rx}deg)`,
                    opacity: 0,
                  }}
                >
                  — {step.tagline}
                </div>

                {/* Divider */}
                <div
                  className={`line-shard-${index} mt-5 h-px w-20`}
                  style={{
                    background: `linear-gradient(to ${isEven ? 'right' : 'left'}, ${step.color}, transparent)`,
                    transform: `translate3d(${sc.line.x}px, ${sc.line.y}px, ${sc.line.z}px)`,
                    opacity: 0,
                  }}
                />

                {/* Description */}
                <div
                  className={`desc-shard-${index} mt-4 text-white/70 text-base md:text-lg font-light leading-relaxed`}
                  style={{
                    maxWidth: '400px',
                    textAlign: isEven ? 'left' : 'right',
                    transform: `translate3d(${sc.desc.x}px, ${sc.desc.y}px, ${sc.desc.z}px)`,
                    opacity: 0,
                  }}
                >
                  {step.desc}
                </div>

                {/* CTA — always flat, no 3D, just fades in */}
                <div
                  className={`cta-${index} mt-8 pointer-events-auto`}
                  style={{ opacity: 0 }}
                >
                  <a
                    href="#schedule"
                    className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300"
                    style={{
                      border: `1px solid ${step.color}60`,
                      background: `linear-gradient(135deg, ${step.color}18, rgba(255,255,255,0.04))`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: `0 0 24px ${step.color}25`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.background = step.color
                      el.style.color = '#000'
                      el.style.boxShadow = `0 0 40px ${step.color}70`
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.background = `linear-gradient(135deg, ${step.color}18, rgba(255,255,255,0.04))`
                      el.style.color = 'white'
                      el.style.boxShadow = `0 0 24px ${step.color}25`
                    }}
                  >
                    Book A Strategy Call
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                      <path d="M1 6.5h11M7 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Step Progress Dots ──────────────────────────── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-none">
        {steps.map((step, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full border border-white/20" style={{ backgroundColor: 'transparent' }} />
        ))}
      </div>

      <style>{`
        @keyframes grain {
          0%,100%{transform:translate(0,0)}
          10%{transform:translate(-2%,-3%)}
          20%{transform:translate(3%,2%)}
          30%{transform:translate(-1%,4%)}
          40%{transform:translate(4%,-1%)}
          50%{transform:translate(-3%,3%)}
          60%{transform:translate(2%,-4%)}
          70%{transform:translate(-4%,1%)}
          80%{transform:translate(1%,-2%)}
          90%{transform:translate(-2%,4%)}
        }
      `}</style>
    </section>
  )
}
