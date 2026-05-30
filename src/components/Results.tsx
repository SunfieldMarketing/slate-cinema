'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ThumbsUp, MessageSquare } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Results() {
  const containerRef = useRef<HTMLElement>(null)
  const [views, setViews] = useState(0)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        }
      })

      // Timecode counter counts up
      const counter = { val: 0 }
      tl.to(counter, {
        val: 120000000,
        ease: 'none',
        duration: 1,
        onUpdate: () => setViews(Math.floor(counter.val))
      }, 0)

      // 3D rotation effect for the metrics block
      tl.fromTo('.metrics-block',
        { rotateX: 30, rotateY: -20, scale: 0.8, opacity: 0, z: -200 },
        { rotateX: 0, rotateY: 0, scale: 1, opacity: 1, z: 0, duration: 0.4, ease: 'power2.out' },
        0
      )
      
      // Continue rotating slightly as it counts
      tl.to('.metrics-block', {
        rotateX: -15,
        rotateY: 15,
        scale: 1.05,
        z: 100,
        ease: 'none',
        duration: 0.6
      }, 0.4)

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* Background YouTube Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <iframe
          className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          src="https://www.youtube.com/embed/QyhwSYhX09s?autoplay=1&mute=1&loop=1&playlist=QyhwSYhX09s&controls=0&showinfo=0&modestbranding=1&playsinline=1"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        {/* Cinematic dark overlay */}
        <div className="absolute inset-0 bg-[#030305]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* The 3D Metrics Block */}
        <div className="metrics-block flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Views Counter */}
          <div className="flex items-baseline gap-4 md:gap-8 justify-center flex-wrap">
            <div className="text-6xl md:text-[8rem] lg:text-[10rem] font-bold text-white tracking-tighter leading-none" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              {views.toLocaleString()}
            </div>
            <div className="text-3xl md:text-5xl lg:text-7xl font-bold text-white/90">
              views
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-full max-w-3xl h-[2px] bg-white/20 my-8 shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>

          {/* Engagement Metrics */}
          <div className="flex gap-12 md:gap-24 items-center text-white/90 text-2xl md:text-4xl font-bold">
            <div className="flex items-center gap-3 md:gap-4 drop-shadow-lg">
              <ThumbsUp className="w-8 h-8 md:w-12 md:h-12" strokeWidth={2.5} />
              <span>4,395</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 drop-shadow-lg">
              <MessageSquare className="w-8 h-8 md:w-12 md:h-12" strokeWidth={2.5} />
              <span>370</span>
            </div>
          </div>

        </div>

      </div>

      {/* Film frame overlay at edges */}
      <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #030305, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #030305, transparent)' }} />
    </section>
  )
}
