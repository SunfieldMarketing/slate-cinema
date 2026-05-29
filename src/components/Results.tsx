'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Results() {
  const containerRef = useRef<HTMLElement>(null)
  const [views, setViews] = useState(0)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    })

    // Animate the counter
    tl.to({ val: 0 }, {
      val: 25000000,
      duration: 2,
      onUpdate: function() {
        setViews(Math.floor(this.targets()[0].val))
      }
    }, 0)

    // Animate data bars
    tl.fromTo('.data-bar', 
      { height: '0%' },
      { height: '100%', stagger: 0.1, duration: 1.5, ease: 'power2.out' },
    0)

  }, { scope: containerRef })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+'
    return num.toLocaleString()
  }

  const benefits = [
    "Campaign-ready edits",
    "Social-first storytelling",
    "Platform-specific deliverables",
    "Retention-focused pacing",
    "Hooks built for scroll behavior",
    "Analytics-informed iteration"
  ]

  return (
    <section ref={containerRef} className="w-full py-32 bg-[#030305] relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 z-0 flex items-end justify-center gap-4 opacity-10 pb-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="data-bar w-8 bg-[#00AEEF] rounded-t-sm" style={{ maxHeight: `${Math.random() * 60 + 20}%` }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
        <h2 className="text-sm md:text-base tracking-[0.2em] text-[#00AEEF] uppercase font-bold mb-4">
          Built to Generate Attention
        </h2>
        
        <div className="text-7xl md:text-9xl font-bold text-white mb-6 font-mono tracking-tighter drop-shadow-[0_0_30px_rgba(0,174,239,0.3)]">
          {formatNumber(views)}
        </div>
        
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-8">
          Generating Millions of Views Consistently
        </h3>
        
        <p className="text-xl text-[#8E96AA] max-w-3xl leading-relaxed mb-16">
          Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is shaped to make people stop scrolling.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {benefits.map((text, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl flex items-center justify-center text-center">
              <span className="text-[#F7F8FF] font-medium tracking-wide">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
