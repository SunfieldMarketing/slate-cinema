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
    desc: 'Concept development, campaign planning, scripting, shot lists.',
    videoSrc: '/videos/pre-production.mp4',
    color: '#00AEEF',
  },
  {
    num: '02',
    title: 'PRODUCTION',
    desc: 'On-location shooting, lighting, directing, social-first capture.',
    videoSrc: '/videos/production.mp4#t=0,10',
    color: '#a855f7',
  },
  {
    num: '03',
    title: 'POST-PRODUCTION',
    desc: 'Editing, color grading, sound design, motion graphics, VFX.',
    videoSrc: '/videos/post-production.mp4',
    color: '#10b981',
  },
  {
    num: '04',
    title: 'DISTRIBUTION',
    desc: 'Platform-specific cuts, ad-ready exports, analytics review.',
    videoSrc: '/videos/distribution.mp4',
    color: '#f97316',
  }
]

// Hand-crafted polygon shards for videos
const videoShards = [
  "polygon(0% 15%, 85% 0%, 100% 85%, 15% 100%)",
  "polygon(10% 0%, 100% 20%, 90% 100%, 0% 80%)",
  "polygon(0% 0%, 100% 15%, 85% 100%, 15% 85%)",
  "polygon(15% 15%, 100% 0%, 85% 100%, 0% 85%)",
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    })

    // Phase 1: Shatter the initial glass sheet
    // We start with the shards flat and together (css handles this initially? No, we will animate FROM a flat state)
    // Wait, it's easier to just start them shattered, and have the first scroll movement explode them further.
    tl.fromTo('.bg-shard', 
      { z: 0, rotateX: 0, rotateY: 0, x: 0, y: 0, opacity: 0.1 },
      { 
        z: () => gsap.utils.random(-1500, 500), 
        rotateX: () => gsap.utils.random(-180, 180),
        rotateY: () => gsap.utils.random(-180, 180),
        x: () => gsap.utils.random(-1000, 1000),
        y: () => gsap.utils.random(-1000, 1000),
        opacity: 0.3,
        duration: 1,
        ease: 'power3.inOut'
      }, 0
    )

    // Fade out the "initial glass sheet"
    tl.to('.initial-glass', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0)

    // Make the title fade out
    tl.to('.section-title', { opacity: 0, z: 500, duration: 1 }, 0)

    let currentTime = 1;

    steps.forEach((step, index) => {
      
      // ALIGNMENT PHASE for this step
      // The video shard comes forward and rotates to face the camera perfectly
      tl.to(`.video-shard-${index}`, {
        z: 200,
        x: index % 2 === 0 ? 300 : -300,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power4.out'
      }, currentTime)

      // The text pieces fly in from scattered depths to perfectly align into a readable sentence
      const textPieces = gsap.utils.toArray(`.text-shard-${index}`)
      tl.to(textPieces, {
        z: 0,
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1.5,
        ease: 'power3.out'
      }, currentTime)

      // The CTA button fades in
      tl.to(`.cta-${index}`, { opacity: 1, y: 0, duration: 0.5 }, currentTime + 1)

      // HOLD phase (let user read)
      tl.to({}, { duration: 1 })

      // SCATTER PHASE (move away as next step comes in, unless it's the last step)
      if (index !== steps.length - 1) {
        tl.to(`.video-shard-${index}`, {
          z: -1000,
          x: () => gsap.utils.random(-800, 800),
          y: () => gsap.utils.random(-800, 800),
          rotateX: () => gsap.utils.random(-90, 90),
          rotateY: () => gsap.utils.random(-90, 90),
          opacity: 0,
          duration: 1.5,
          ease: 'power3.in'
        }, currentTime + 2.5)

        tl.to(textPieces, {
          z: () => gsap.utils.random(500, 1500),
          x: () => gsap.utils.random(-500, 500),
          y: () => gsap.utils.random(-500, 500),
          rotateX: () => gsap.utils.random(-90, 90),
          rotateY: () => gsap.utils.random(-90, 90),
          opacity: 0,
          duration: 1.5,
          ease: 'power3.in'
        }, currentTime + 2.5)

        tl.to(`.cta-${index}`, { opacity: 0, duration: 0.5 }, currentTime + 2.5)
      }

      currentTime += 3; // Advance timeline for next step
    })

    // Constant slow rotation of background shards
    gsap.to('.bg-shard', {
      rotateX: '+=45',
      rotateY: '+=45',
      duration: 10,
      ease: 'none',
      repeat: -1,
      yoyo: true
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1500px' }}>
      
      {/* The pristine glass sheet that fades out immediately */}
      <div className="initial-glass absolute inset-10 z-50 border border-white/20 bg-white/5 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.05)] pointer-events-none">
        <h2 className="section-title text-5xl md:text-8xl font-black text-white tracking-tighter mix-blend-overlay">
          HOW IT WORKS
        </h2>
        <p className="section-title mt-6 text-white/50 tracking-widest text-sm md:text-base font-mono uppercase">
          [ Scroll to Shatter ]
        </p>
      </div>

      {/* Decorative Background Glass Shards */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ transformStyle: 'preserve-3d' }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="bg-shard absolute left-1/2 top-1/2 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20"
            style={{ 
              marginLeft: '-5rem', 
              marginTop: '-5rem',
              clipPath: videoShards[i % 4],
              transformStyle: 'preserve-3d'
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        
        {steps.map((step, index) => (
          <div key={index} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* The Video Mirror Shard */}
            <div 
              className={`video-shard-${index} absolute w-[300px] h-[400px] md:w-[400px] md:h-[500px] bg-black/50 border border-white/30 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]`}
              style={{
                clipPath: videoShards[index % 4],
                // Start them completely scattered and invisible
                transform: `translate3d(${gsap.utils.random(-800, 800)}px, ${gsap.utils.random(-800, 800)}px, ${gsap.utils.random(-2000, -500)}px) rotateX(${gsap.utils.random(-180, 180)}deg) rotateY(${gsap.utils.random(-180, 180)}deg)`,
                opacity: 0,
                transformStyle: 'preserve-3d'
              }}
            >
              <video 
                src={step.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-[150%] h-[150%] object-cover -left-1/4 -top-1/4 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              {/* Color Tinting */}
              <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ backgroundColor: step.color }} />
            </div>

            {/* The Fractured Text that Aligns */}
            <div className="absolute flex flex-col items-start justify-center ml-0 md:-ml-[400px] pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
              
              {/* Number Shard */}
              <div 
                className={`text-shard-${index} font-mono text-8xl md:text-[12rem] font-black tracking-tighter leading-none mb-4`}
                style={{ 
                  color: step.color,
                  textShadow: '0 0 30px rgba(0,0,0,0.8)',
                  transform: `translate3d(${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(500, 1500)}px) rotateX(${gsap.utils.random(-90, 90)}deg)`,
                  opacity: 0 
                }}
              >
                {step.num}
              </div>
              
              {/* Title Shards (Split by word if multiple, or just split in two for effect, or just whole) */}
              <div 
                className={`text-shard-${index} text-4xl md:text-7xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]`}
                style={{ 
                  transform: `translate3d(${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(500, 1500)}px) rotateY(${gsap.utils.random(-90, 90)}deg)`,
                  opacity: 0 
                }}
              >
                {step.title}
              </div>

              {/* Desc Shard */}
              <div 
                className={`text-shard-${index} mt-6 max-w-sm md:max-w-md text-white/80 text-lg md:text-xl font-light drop-shadow-md`}
                style={{ 
                  transform: `translate3d(${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(-500, 500)}px, ${gsap.utils.random(500, 1500)}px) rotateZ(${gsap.utils.random(-45, 45)}deg)`,
                  opacity: 0 
                }}
              >
                {step.desc}
              </div>

              {/* CTA Button Shard */}
              <div className={`cta-${index} mt-8 pointer-events-auto`} style={{ opacity: 0, transform: 'translateY(30px)' }}>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300">
                  Book A Strategy Call
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
    </section>
  )
}
