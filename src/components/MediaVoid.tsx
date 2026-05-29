'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  { type: 'Campaign Reel', format: 'vertical', src: '/images/portfolio-production.png' },
  { type: 'Brand Film', format: 'horizontal', src: '/images/portfolio-brand.png' },
  { type: 'Social Ad', format: 'vertical', src: '/images/portfolio-social.png' },
  { type: 'Event Recap', format: 'horizontal', src: '/images/portfolio-event.png' },
]

export default function MediaVoid() {
  const containerRef = useRef<HTMLElement>(null)

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

    // Text sequence — fade each line in
    tl.fromTo('.void-line-1', { opacity: 0.1, y: 20 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo('.void-line-2', { opacity: 0.1, y: 20 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo('.void-line-3', { opacity: 0.1, y: 20 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo('.void-line-4', { opacity: 0.1, y: 20 }, { opacity: 1, y: 0, duration: 1 })

    // Media cards float in from depth
    tl.fromTo('.void-card',
      { scale: 0.6, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, stagger: 0.3, duration: 2, ease: 'power2.out' },
      0
    )
  }, { scope: containerRef })

  // Fixed positions for cards so they don't overlap randomly on each render
  const cardPositions = [
    { left: '5%', top: '15%', rotate: '-6deg' },
    { right: '5%', top: '20%', rotate: '4deg' },
    { left: '8%', bottom: '15%', rotate: '3deg' },
    { right: '10%', bottom: '20%', rotate: '-5deg' },
  ]

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex items-center justify-center">
      
      {/* Floating Media Cards */}
      {cards.map((card, i) => (
        <div 
          key={i}
          className={`void-card absolute ${card.format === 'vertical' ? 'w-36 md:w-48 h-56 md:h-72' : 'w-56 md:w-72 h-32 md:h-40'} rounded-xl overflow-hidden border border-white/[0.06] opacity-0 pointer-events-auto cursor-pointer group transition-transform duration-500 hover:scale-105 hover:z-20`}
          style={{ ...cardPositions[i], transform: `rotate(${cardPositions[i].rotate})` }}
        >
          <img src={card.src} alt={card.type} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-[10px] font-mono tracking-[0.15em] text-white uppercase">{card.type}</span>
          </div>
        </div>
      ))}

      {/* Center Text Sequence */}
      <div className="relative z-10 flex flex-col items-center text-center gap-2 max-w-4xl px-6">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] flex flex-col gap-1">
          <span className="void-line-1 text-white/10">The content we create</span>
          <span className="void-line-2 text-white/10">isn&apos;t just eye-catching,</span>
          <span className="void-line-3 text-white/10">it&apos;s content people</span>
          <span className="void-line-4 text-[#00AEEF]/10">actually want to watch.</span>
        </h2>
      </div>
    </section>
  )
}
