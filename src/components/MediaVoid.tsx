'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const cards = [
  { id: 1, type: 'Campaign Reel', format: 'vertical', src: '/placeholder.jpg' },
  { id: 2, type: 'Brand Film', format: 'horizontal', src: '/placeholder.jpg' },
  { id: 3, type: 'Social Ad', format: 'vertical', src: '/placeholder.jpg' },
  { id: 4, type: 'Founder Story', format: 'horizontal', src: '/placeholder.jpg' },
  { id: 5, type: 'Event Recap', format: 'vertical', src: '/placeholder.jpg' },
]

export default function MediaVoid() {
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1
      }
    })

    // Headline sequence
    tl.to('.line-1', { opacity: 1, duration: 1 })
      .to('.line-2', { opacity: 1, duration: 1 })
      .to('.line-3', { opacity: 1, duration: 1, color: '#00AEEF' })
      .to('.line-4', { opacity: 1, duration: 1, y: -20 })

    // Media cards flying in from depth
    gsap.set('.media-card', { z: -1000, opacity: 0, scale: 0.5 })
    
    tl.to('.media-card', {
      z: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      duration: 3,
      ease: 'power1.inOut'
    }, 0)

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex items-center justify-center perspective-[1000px]">
      
      {/* Floating Media Cards */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {cards.map((card, i) => (
          <div 
            key={card.id}
            className={`media-card absolute glass-panel overflow-hidden transition-transform duration-500 pointer-events-auto cursor-pointer group ${card.format === 'vertical' ? 'w-48 h-80' : 'w-72 h-40'}`}
            style={{
              left: `${Math.random() * 60 + 20}%`,
              top: `${Math.random() * 60 + 20}%`,
              transform: `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `url(${card.src})` }} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
              <span className="text-xs font-mono tracking-widest text-white uppercase">{card.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Center Text Sequence */}
      <div ref={headlineRef} className="relative z-10 flex flex-col items-center text-center gap-4 max-w-4xl px-6">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white/10 flex flex-col gap-2">
          <span className="line-1 opacity-0">The content we create</span>
          <span className="line-2 opacity-0">isn't just eye-catching.</span>
          <span className="line-3 opacity-0">It's content people actually want to watch.</span>
        </h2>
        <p className="line-4 opacity-0 text-xl md:text-2xl text-[#8E96AA] mt-8 tracking-wide font-light">
          Built for attention. Designed for retention. Made to move.
        </p>
      </div>

    </section>
  )
}
