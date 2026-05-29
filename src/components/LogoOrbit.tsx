'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const logos = [
  'Meta', 'alo', 'BIRCH', 'American Dream', 'BH', 'QuickFrame', 'Brigit', 'Camp HASC', 'JEM', 'Aryeh Realty', 'Sensible Auto Lending'
]

const reviews = [
  '"Creative, professional, and easy to work with."',
  '"Highly recommend his videography work."',
  '"Best quality work and good experience."'
]

const reviewAngles = [-12, 5, -8]

export default function LogoOrbit() {
  const containerRef = useRef<HTMLElement>(null)
  const track1Tl = useRef<gsap.core.Timeline | null>(null)
  const track2Tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    const container = containerRef.current
    if (!container) return

    // ── 1. PARALLAX SPOTLIGHT ──
    // The spotlight radial glow grows as you scroll into the section
    gsap.fromTo('.orbit-spotlight', {
      scale: 0.3,
      opacity: 0
    }, {
      scale: 1.8,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 90%',
        end: 'center center',
        scrub: 1,
      }
    })

    // ── 2. HEADING 3D TILT ENTRANCE ──
    // Subtitle tag slides up
    gsap.fromTo('.orbit-tag', {
      y: 60,
      opacity: 0,
      rotateX: -20,
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 1,
      }
    })

    // Main heading slides in from below with 3D tilt
    gsap.fromTo('.orbit-heading', {
      y: 120,
      opacity: 0,
      rotateX: -15,
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 82%',
        end: 'top 42%',
        scrub: 1,
      }
    })

    // ── 3. GOOGLE RATING BADGE - 3D FLIP ──
    gsap.fromTo('.orbit-badge', {
      scale: 0,
      rotateX: 180,
      opacity: 0,
    }, {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 70%',
        end: 'top 35%',
        scrub: 1,
      }
    })

    // ── 4. LOGO MARQUEE ROWS ──
    // Create infinite loop timelines
    track1Tl.current = gsap.timeline({ repeat: -1 })
    track1Tl.current.to('.logo-track-1', {
      xPercent: -50,
      ease: 'none',
      duration: 40,
    })

    track2Tl.current = gsap.timeline({ repeat: -1 })
    track2Tl.current.to('.logo-track-2', {
      xPercent: 50,
      ease: 'none',
      duration: 35,
    })

    // Fade the marquee rows in with a slight 3D lift
    gsap.fromTo('.orbit-marquee-1', {
      opacity: 0,
      y: 40,
      rotateX: -8,
    }, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 60%',
        end: 'top 30%',
        scrub: 1,
      }
    })

    gsap.fromTo('.orbit-marquee-2', {
      opacity: 0,
      y: 40,
      rotateX: 8,
    }, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 55%',
        end: 'top 25%',
        scrub: 1,
      }
    })

    // Use ScrollTrigger onUpdate to adjust marquee timeScale based on scroll velocity
    let velocityScale = 1
    ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = Math.abs(self.getVelocity())
        // Map velocity to timeScale: base 1, ramps up to 8 at high scroll speed
        const target = gsap.utils.clamp(1, 8, 1 + v / 400)
        velocityScale = gsap.utils.interpolate(velocityScale, target, 0.15)
        if (track1Tl.current) track1Tl.current.timeScale(velocityScale)
        if (track2Tl.current) track2Tl.current.timeScale(velocityScale)
      }
    })

    // ── 5. REVIEW CARDS - Float from z-depth ──
    const cards = container.querySelectorAll('.orbit-review-card')
    cards.forEach((card, i) => {
      gsap.fromTo(card, {
        z: -500,
        rotateY: reviewAngles[i] || 0,
        opacity: 0,
        y: 60,
      }, {
        z: 0,
        rotateY: 0,
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: `top ${40 - i * 8}%`,
          end: `top ${10 - i * 5}%`,
          scrub: 1,
        }
      })
    })

    // ── 6. SUBTLE 3D TILT ON ENTIRE SECTION ──
    gsap.fromTo('.orbit-inner', {
      rotateX: 3,
      rotateY: -1,
    }, {
      rotateX: -2,
      rotateY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    })

  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 bg-[#030305] border-y border-white/5 overflow-hidden"
      style={{ perspective: 1200 }}
    >
      {/* Parallax Spotlight Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="orbit-spotlight w-[900px] h-[900px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,174,239,0.07) 0%, rgba(0,174,239,0.03) 30%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Secondary ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.04) 0%, transparent 60%)' }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3D Tilting Inner Container */}
      <div className="orbit-inner relative z-10" style={{ transformStyle: 'preserve-3d' }}>

        {/* ── HEADER ── */}
        <div className="text-center mb-20 px-6" style={{ perspective: 800 }}>
          <p
            className="orbit-tag text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-6"
            style={{ transformStyle: 'preserve-3d' }}
          >
            Join the Leaders Working with Us
          </p>
          <h2
            className="orbit-heading text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4"
            style={{ transformStyle: 'preserve-3d' }}
          >
            Trusted by Brands, Creators,<br className="hidden md:block" /> and Teams Moving Fast
          </h2>

          {/* Google Rating Badge - 3D Flip */}
          <div style={{ perspective: 600 }}>
            <div
              className="orbit-badge mt-10 inline-flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-full px-8 py-3 backdrop-blur-sm"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-white">5.0</span>
              <div className="w-[1px] h-4 bg-white/20" />
              <span className="text-sm text-[#8E96AA]">44 Google Reviews</span>
              <div className="w-[1px] h-4 bg-white/20" />
              <span className="text-sm text-[#8E96AA]">Brooklyn, NY</span>
            </div>
          </div>
        </div>

        {/* ── LOGO MARQUEE ROW 1 ── */}
        <div
          className="orbit-marquee-1 relative w-full flex overflow-hidden mb-6"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            perspective: 600,
          }}
        >
          <div className="logo-track-1 flex items-center gap-20 min-w-max px-10">
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="text-2xl md:text-3xl font-bold text-white/20 hover:text-white/60 transition-all duration-500 select-none cursor-default whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* ── LOGO MARQUEE ROW 2 (reverse) ── */}
        <div
          className="orbit-marquee-2 relative w-full flex overflow-hidden mb-20"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            perspective: 600,
          }}
        >
          <div className="logo-track-2 flex items-center gap-20 min-w-max px-10 -translate-x-1/2">
            {[...[...logos].reverse(), ...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="text-xl md:text-2xl font-bold text-white/10 hover:text-white/40 transition-all duration-500 select-none cursor-default whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* ── REVIEW CARDS ── */}
        <div
          className="flex flex-wrap justify-center gap-8 px-6 max-w-5xl mx-auto"
          style={{ perspective: 1000 }}
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="orbit-review-card px-7 py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md max-w-xs"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <p className="text-sm text-[#8E96AA] italic leading-relaxed">{review}</p>
              <div className="flex gap-0.5 mt-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <svg key={j} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00AEEF]/30 to-[#00AEEF]/10 border border-white/10" />
                <span className="text-[11px] text-white/30 font-mono tracking-wide">Verified Review</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
