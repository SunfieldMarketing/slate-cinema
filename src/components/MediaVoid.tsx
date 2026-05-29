'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'

export default function MediaVoid() {
  const containerRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    // Text shatter and assemble effect
    const chars = document.querySelectorAll('.shatter-char')
    
    gsap.fromTo(chars,
      { 
        opacity: 0,
        z: () => gsap.utils.random(-1000, 1000),
        x: () => gsap.utils.random(-500, 500),
        y: () => gsap.utils.random(-500, 500),
        rotationX: () => gsap.utils.random(-90, 90),
        rotationY: () => gsap.utils.random(-90, 90),
        rotationZ: () => gsap.utils.random(-90, 90)
      },
      {
        opacity: 1,
        z: 0,
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        stagger: 0.02,
        duration: 2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 40%',
          end: 'top -20%',
          scrub: 1
        }
      }
    )

    // Parallax on cards
    gsap.to('.void-card', {
      y: (i) => -100 - (i * 50),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
  }, { scope: containerRef })

  const text = "The content we create isn't just eye-catching, it's content people actually want to watch."

  return (
    <section ref={containerRef} className="w-full min-h-[150vh] relative flex flex-col items-center justify-center py-32 perspective-[2000px] bg-black overflow-hidden">
      
      {/* Background Stats Layer (Scrolling up view count, likes, comments) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="flex flex-col items-center gap-12 font-bold transform -rotate-12 scale-150 blur-sm">
          <div className="text-[12rem] text-white leading-none flex items-center gap-8">
            3,783,957 <span className="text-4xl text-white/50 tracking-[0.3em] uppercase">views</span>
          </div>
          <div className="flex gap-32 text-[6rem] text-white/80">
            <div className="flex items-center gap-6">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
              12,227
            </div>
            <div className="flex items-center gap-6">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
              1,030
            </div>
          </div>
        </div>
      </div>

      {/* Floating Video/Image Cards Parallax layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="void-card absolute w-64 md:w-96 rounded-2xl overflow-hidden glass-panel"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
              transform: `translateZ(${Math.random() * 500}px) rotate(${Math.random() * 20 - 10}deg)`,
              opacity: 0.6
            }}
          >
            <div className="w-full aspect-video bg-gradient-to-br from-[#00AEEF]/20 to-purple-600/20 relative">
              <div className="absolute inset-0 flex items-center justify-center text-white/50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Shatter Text Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-8xl font-bold text-white leading-tight flex flex-wrap justify-center gap-x-4 gap-y-2">
          {text.split(' ').map((word, wIdx) => (
            <div key={wIdx} className="flex">
              {word.split('').map((char, cIdx) => (
                <span 
                  key={cIdx} 
                  className="shatter-char inline-block" 
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </h2>
      </div>

    </section>
  )
}
