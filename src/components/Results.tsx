'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ThumbsUp, MessageSquare, ArrowRight } from 'lucide-react'

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
        rotateX: -10,
        rotateY: 10,
        scale: 1.05,
        z: 100,
        ease: 'none',
        duration: 0.6
      }, 0.4)

      // Parallax for orbs and grid
      tl.to('.parallax-bg', {
        y: '-10%',
        ease: 'none',
        duration: 1
      }, 0)

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  // Magnetic button effect setup
  useEffect(() => {
    if (!buttonRef.current || !textRef.current) return;
    
    const xTo = gsap.quickTo(buttonRef.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(buttonRef.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
    const textXTo = gsap.quickTo(textRef.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
    const textYTo = gsap.quickTo(textRef.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      xTo(x * 0.4);
      yTo(y * 0.4);
      textXTo(x * 0.2);
      textYTo(y * 0.2);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    const btn = buttonRef.current;
    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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

      {/* Enhanced Backgrounds - Grid and Orbs */}
      <div className="parallax-bg absolute inset-0 z-0 pointer-events-none w-full h-[120%] -top-[10%]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* The 3D Metrics Block */}
        <div className="metrics-block flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Views Counter */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-4 md:gap-8 justify-center flex-wrap">
              <div className="text-6xl md:text-[8rem] lg:text-[10rem] font-bold text-white tracking-tighter leading-none" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                {views.toLocaleString()}
              </div>
              <div className="text-3xl md:text-5xl lg:text-7xl font-bold text-white/90">
                views
              </div>
            </div>
            {/* Descriptive Context Text */}
            <div className="text-lg md:text-2xl text-white/60 uppercase tracking-[0.3em] mt-4 font-light drop-shadow-md">
              Total Audience Reached
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-full max-w-3xl h-[2px] bg-white/20 my-10 shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>

          {/* Engagement Metrics */}
          <div className="flex gap-12 md:gap-24 items-center text-white/90 text-2xl md:text-4xl font-bold mb-16">
            <div className="flex items-center gap-3 md:gap-4 drop-shadow-lg">
              <ThumbsUp className="w-8 h-8 md:w-12 md:h-12" strokeWidth={2.5} />
              <span>4,395</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 drop-shadow-lg">
              <MessageSquare className="w-8 h-8 md:w-12 md:h-12" strokeWidth={2.5} />
              <span>370</span>
            </div>
          </div>

          {/* Interactive Magnetic CTA Button */}
          <div className="mt-8" style={{ transform: 'translateZ(30px)' }}>
            <button
              ref={buttonRef}
              className="relative px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium text-lg overflow-hidden group cursor-pointer transition-colors hover:bg-white hover:text-black"
            >
              <span ref={textRef} className="relative z-10 flex items-center gap-3 pointer-events-none">
                See Case Studies <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* Film frame overlay at edges */}
      <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #030305, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #030305, transparent)' }} />
    </section>
  )
}
