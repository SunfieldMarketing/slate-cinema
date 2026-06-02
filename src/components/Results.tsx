'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Results() {
  const containerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [views, setViews] = useState(0)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
        }
      })

      // Counter animation
      const viewCounter = { val: 0 }

      tl.to(viewCounter, {
        val: 120000000,
        ease: 'none',
        duration: 0.6,
        onUpdate: () => setViews(Math.floor(viewCounter.val))
      }, 0)

      // Main block entrance
      tl.fromTo('.metrics-block',
        { rotateX: 30, rotateY: -20, scale: 0.7, opacity: 0, z: -300 },
        { rotateX: 0, rotateY: 0, scale: 1, opacity: 1, z: 0, duration: 0.3, ease: 'power2.out' },
        0
      )

      // Subtle abstract UI shapes fly in
      tl.fromTo('.abstract-shape',
        { scale: 0, opacity: 0, rotation: 45 },
        { scale: 1, opacity: 1, rotation: 0, stagger: 0.1, duration: 0.4, ease: 'power3.out' },
        0.1
      )

      // Bottom CTA fades in
      tl.fromTo('.results-cta',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' },
        0.5
      )

      // Gentle float at end
      tl.to('.metrics-block', {
        rotateX: -5,
        rotateY: 5,
        z: 50,
        ease: 'none',
        duration: 0.4
      }, 0.6)

      // Parallax background & shapes
      tl.to('.parallax-bg', {
        y: '-10%',
        ease: 'none',
        duration: 1
      }, 0)
      
      tl.to('.abstract-shape', {
        y: (i) => (i % 2 === 0 ? -100 : 100),
        rotation: (i) => (i % 2 === 0 ? 15 : -15),
        ease: 'none',
        duration: 1
      }, 0)

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  // Magnetic button effect
  useEffect(() => {
    if (!buttonRef.current || !textRef.current) return
    const xTo = gsap.quickTo(buttonRef.current, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.3)' })
    const yTo = gsap.quickTo(buttonRef.current, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.3)' })
    const textXTo = gsap.quickTo(textRef.current, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.3)' })
    const textYTo = gsap.quickTo(textRef.current, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.3)' })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = buttonRef.current!.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      xTo(x * 0.4); yTo(y * 0.4); textXTo(x * 0.2); textYTo(y * 0.2)
    }
    const handleMouseLeave = () => { xTo(0); yTo(0); textXTo(0); textYTo(0) }

    const btn = buttonRef.current
    btn.addEventListener('mousemove', handleMouseMove)
    btn.addEventListener('mouseleave', handleMouseLeave)
    return () => { btn.removeEventListener('mousemove', handleMouseMove); btn.removeEventListener('mouseleave', handleMouseLeave) }
  }, [])

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1200px' }}>

      {/* Background Local Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
          src="/videos/performance.mp4"
        />
        <div className="absolute inset-0 bg-[#030305]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305] opacity-80" />
      </div>

      {/* Parallax grid + orbs */}
      <div className="parallax-bg absolute inset-0 z-0 pointer-events-none w-full h-[120%] -top-[10%]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
        <div className="absolute top-1/3 left-1/4 w-[50vw] h-[50vw] bg-[#00AEEF]/5 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-1/3 right-1/4 w-[45vw] h-[45vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-6" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Subtle decorative overlays (no hard statistical data) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-[10vw]" style={{ transformStyle: 'preserve-3d' }}>
          {/* Left subtle overlay */}
          <div className="abstract-shape hidden lg:flex flex-col gap-2 opacity-50" style={{ transform: 'translateZ(-100px)' }}>
             <div className="w-16 h-[1px] bg-gradient-to-r from-[#00AEEF] to-transparent" />
             <div className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase">Scale / Volume</div>
             <div className="w-32 h-[1px] bg-gradient-to-r from-white/20 to-transparent mt-8" />
             <div className="w-24 h-[1px] bg-gradient-to-r from-white/10 to-transparent mt-2" />
          </div>
          
          {/* Right subtle overlay */}
          <div className="abstract-shape hidden lg:flex flex-col items-end gap-2 opacity-50 text-right" style={{ transform: 'translateZ(-50px)' }}>
             <div className="w-16 h-[1px] bg-gradient-to-l from-[#00AEEF] to-transparent" />
             <div className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase">Engagement Matrix</div>
             
             {/* Decorative reticle */}
             <div className="mt-8 relative w-12 h-12 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-[#00AEEF] rounded-full" />
                <div className="absolute top-0 w-[1px] h-2 bg-white/20" />
                <div className="absolute bottom-0 w-[1px] h-2 bg-white/20" />
                <div className="absolute left-0 w-2 h-[1px] bg-white/20" />
                <div className="absolute right-0 w-2 h-[1px] bg-white/20" />
             </div>
          </div>
        </div>

        {/* Central Metrics Block */}
        <div className="metrics-block flex flex-col items-center max-w-4xl w-full" style={{ transformStyle: 'preserve-3d' }}>

          {/* Label */}
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase mb-8 border border-[#00AEEF]/20 px-4 py-2 rounded-full bg-[#00AEEF]/5 backdrop-blur-sm">
            Performance Dashboard
          </span>

          {/* Views Counter */}
          <div className="flex items-baseline gap-4 md:gap-8 justify-center flex-wrap">
            <div className="text-[5rem] md:text-[8rem] lg:text-[11rem] font-bold text-white tracking-tighter leading-none" style={{ textShadow: '0 0 100px rgba(0,174,239,0.25), 0 10px 40px rgba(0,0,0,0.5)' }}>
              {views.toLocaleString()}
            </div>
            <div className="text-3xl md:text-5xl lg:text-7xl font-light text-white/90 uppercase tracking-widest">
              views
            </div>
          </div>

          {/* Separator */}
          <div className="w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-10 shadow-[0_0_15px_rgba(255,255,255,0.1)] relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[2px] bg-[#00AEEF] shadow-[0_0_10px_rgba(0,174,239,0.8)]" />
          </div>

          {/* Description */}
          <p className="text-white/50 text-base md:text-lg max-w-2xl text-center leading-relaxed font-light">
            Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is meticulously shaped to make audiences stop scrolling.
          </p>

          {/* CTA */}
          <div className="results-cta mt-12" style={{ transform: 'translateZ(40px)' }}>
            <button
              ref={buttonRef}
              className="relative px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white font-medium text-lg overflow-hidden group cursor-pointer transition-all hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <span ref={textRef} className="relative z-10 flex items-center gap-4 pointer-events-none">
                See Case Studies <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Edge fades */}
      <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #030305, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #030305, transparent)' }} />
    </section>
  )
}
