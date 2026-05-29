'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function QuoteCalculator() {
  const containerRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(formRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    )

    // Animate floating labels
    gsap.fromTo('.podium-label',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
        }
      }
    )
  }, { scope: containerRef })

  const labels = ['Concept', 'Shoot', 'Edit', 'VFX', 'Sound', 'Distribution']

  return (
    <section ref={containerRef} className="w-full py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #030305 0%, #0d0520 30%, #150a30 50%, #0d0520 70%, #030305 100%)' }}>
      
      {/* Purple Podiums Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Large podium shapes */}
        <div className="absolute bottom-0 left-[10%] w-[200px] h-[300px] rounded-t-2xl opacity-30" style={{ background: 'linear-gradient(180deg, rgba(120,50,200,0.4) 0%, rgba(60,20,120,0.6) 100%)', boxShadow: '0 0 60px rgba(120,50,200,0.3)' }} />
        <div className="absolute bottom-0 left-[30%] w-[160px] h-[420px] rounded-t-2xl opacity-25" style={{ background: 'linear-gradient(180deg, rgba(100,40,180,0.4) 0%, rgba(50,15,100,0.6) 100%)', boxShadow: '0 0 80px rgba(100,40,180,0.3)' }} />
        <div className="absolute bottom-0 right-[25%] w-[180px] h-[350px] rounded-t-2xl opacity-30" style={{ background: 'linear-gradient(180deg, rgba(80,30,160,0.4) 0%, rgba(40,10,80,0.6) 100%)', boxShadow: '0 0 70px rgba(80,30,160,0.3)' }} />
        <div className="absolute bottom-0 right-[8%] w-[220px] h-[280px] rounded-t-2xl opacity-20" style={{ background: 'linear-gradient(180deg, rgba(130,60,220,0.3) 0%, rgba(70,25,130,0.5) 100%)', boxShadow: '0 0 50px rgba(130,60,220,0.2)' }} />
        <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[250px] h-[500px] rounded-t-3xl opacity-20" style={{ background: 'linear-gradient(180deg, rgba(110,45,200,0.3) 0%, rgba(55,18,110,0.5) 100%)', boxShadow: '0 0 100px rgba(110,45,200,0.25)' }} />
        
        {/* Ambient purple glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-30" style={{ background: 'radial-gradient(circle, rgba(120,50,200,0.5) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Floating Labels */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {labels.map((label, i) => (
            <span key={i} className="podium-label text-xs font-mono tracking-[0.2em] uppercase text-purple-300/60 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-900/10 backdrop-blur-sm">
              {label}
            </span>
          ))}
        </div>

        <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4">Quote Calculator</h2>
        <p className="text-xl text-[#8E96AA] max-w-2xl mx-auto mb-16">
          Tell us what you need and we&apos;ll help map the right production package for your goals.
        </p>

        {/* Cinematic Glass Console for Typeform */}
        <div ref={formRef} className="relative max-w-3xl mx-auto group">
          {/* Glow border */}
          <div className="absolute -inset-[2px] rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700" style={{ background: 'linear-gradient(135deg, rgba(120,50,200,0.5), rgba(0,174,239,0.3), rgba(120,50,200,0.5))' }} />
          
          <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(11,20,40,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Top bar */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="text-[10px] font-mono text-white/20 ml-4 tracking-widest">SLATE CINEMA // QUOTE BUILDER</span>
            </div>
            
            {/* Typeform Embed Container */}
            <div className="w-full" style={{ minHeight: '520px' }}>
              <iframe
                src="https://form.typeform.com/to/PLACEHOLDER"
                style={{ width: '100%', height: '520px', border: 'none' }}
                title="Slate Cinema Quote Calculator"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-sm text-[#8E96AA]">
          Prefer to talk? <a href="#contact" className="text-[#00AEEF] hover:text-white transition-colors border-b border-[#00AEEF]/30 pb-0.5 ml-1">Schedule a call →</a>
        </div>
      </div>
    </section>
  )
}
