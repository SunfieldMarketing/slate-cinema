'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function MediaVoid() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Pin the section for a long immersive scroll
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 1,
      }
    })

    // Phase 1: Stats background fades in and scales up (0-30%)
    masterTl.fromTo('.void-stats',
      { opacity: 0, scale: 0.6, rotateX: 20 },
      { opacity: 0.2, scale: 1, rotateX: 0, duration: 0.3 },
      0
    )

    // Phase 2: Words assemble from 3D scatter (20-70%)
    masterTl.fromTo('.void-word',
      {
        opacity: 0,
        z: () => gsap.utils.random(-800, 800),
        x: () => gsap.utils.random(-400, 400),
        y: () => gsap.utils.random(-300, 300),
        rotationX: () => gsap.utils.random(-90, 90),
        rotationY: () => gsap.utils.random(-90, 90),
        scale: () => gsap.utils.random(0.3, 2),
      },
      {
        opacity: 1,
        z: 0,
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        stagger: 0.03,
        duration: 0.5,
      },
      0.2
    )

    // Phase 3: Floating cards parallax in from deep z-space (40-80%)
    masterTl.fromTo('.void-card',
      {
        opacity: 0,
        z: -1000,
        rotateY: () => gsap.utils.random(-45, 45),
        rotateX: () => gsap.utils.random(-30, 30),
      },
      {
        opacity: 0.7,
        z: 0,
        rotateY: 0,
        rotateX: 0,
        stagger: 0.05,
        duration: 0.4,
      },
      0.4
    )

    // Phase 4: Everything pushes past camera (80-100%)
    masterTl.to('.void-stats', { scale: 1.5, opacity: 0, z: 500, duration: 0.2 }, 0.8)
    masterTl.to('.void-word', { z: 500, opacity: 0, stagger: 0.01, duration: 0.2 }, 0.8)
    masterTl.to('.void-card', { z: 500, opacity: 0, stagger: 0.02, duration: 0.2 }, 0.85)

  }, { scope: containerRef })

  const text = "The content we create isn't just eye-catching, it's content people actually want to watch."
  const words = text.split(' ')

  const cardPositions = [
    { left: '5%', top: '15%', rot: '-8deg' },
    { left: '75%', top: '10%', rot: '12deg' },
    { left: '10%', top: '70%', rot: '5deg' },
    { left: '65%', top: '75%', rot: '-10deg' },
    { left: '40%', top: '5%', rot: '3deg' },
    { left: '85%', top: '50%', rot: '-6deg' },
  ]

  return (
    <section
      ref={containerRef}
      className="w-full h-screen relative flex items-center justify-center bg-black overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Background Stats Layer */}
      <div className="void-stats absolute inset-0 z-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <div className="flex flex-col items-center gap-8 font-bold transform -rotate-6 scale-125">
          <div className="text-[8rem] md:text-[12rem] text-white leading-none flex items-center gap-6">
            3,783,957
            <span className="text-3xl md:text-4xl text-white/50 tracking-[0.3em] uppercase self-end mb-4">views</span>
          </div>
          <div className="flex gap-16 md:gap-32 text-[4rem] md:text-[6rem] text-white/80">
            <div className="flex items-center gap-4">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" /></svg>
              12,227
            </div>
            <div className="flex items-center gap-4">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>
              1,030
            </div>
          </div>
        </div>
      </div>

      {/* Floating Video/Image Cards */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        {cardPositions.map((pos, i) => (
          <div
            key={i}
            className="void-card absolute w-48 md:w-72 rounded-2xl overflow-hidden glass-panel"
            style={{
              left: pos.left,
              top: pos.top,
              transform: `rotate(${pos.rot})`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-full aspect-video bg-gradient-to-br from-[#00AEEF]/20 to-purple-600/20 relative">
              <div className="absolute inset-0 flex items-center justify-center text-white/50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Assembled Text */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center" style={{ transformStyle: 'preserve-3d' }}>
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white leading-tight flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, wIdx) => (
            <span
              key={wIdx}
              className="void-word inline-block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}
