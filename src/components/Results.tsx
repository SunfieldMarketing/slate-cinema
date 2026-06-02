'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ThumbsUp, MessageSquare, ArrowRight, Eye, Share2, TrendingUp, BarChart3, Clock, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const miniStats = [
  { icon: Clock, label: 'Avg. Watch Time', value: '0:47', suffix: 's' },
  { icon: TrendingUp, label: 'Engagement Rate', value: '8.4', suffix: '%' },
  { icon: Share2, label: 'Total Shares', value: '1.2', suffix: 'M' },
  { icon: Users, label: 'New Followers', value: '340', suffix: 'K' },
]

export default function Results() {
  const containerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [views, setViews] = useState(0)
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState(0)

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

      // Counter animations
      const viewCounter = { val: 0 }
      const likeCounter = { val: 0 }
      const commentCounter = { val: 0 }

      tl.to(viewCounter, {
        val: 120000000,
        ease: 'none',
        duration: 0.6,
        onUpdate: () => setViews(Math.floor(viewCounter.val))
      }, 0)

      tl.to(likeCounter, {
        val: 4395,
        ease: 'none',
        duration: 0.6,
        onUpdate: () => setLikes(Math.floor(likeCounter.val))
      }, 0)

      tl.to(commentCounter, {
        val: 370,
        ease: 'none',
        duration: 0.6,
        onUpdate: () => setComments(Math.floor(commentCounter.val))
      }, 0)

      // Main block entrance
      tl.fromTo('.metrics-block',
        { rotateX: 30, rotateY: -20, scale: 0.7, opacity: 0, z: -300 },
        { rotateX: 0, rotateY: 0, scale: 1, opacity: 1, z: 0, duration: 0.3, ease: 'power2.out' },
        0
      )

      // Data widgets fly in from sides
      tl.fromTo('.data-widget-left',
        { x: -200, opacity: 0, rotateY: 45 },
        { x: 0, opacity: 1, rotateY: 0, stagger: 0.05, duration: 0.3, ease: 'power3.out' },
        0.15
      )
      tl.fromTo('.data-widget-right',
        { x: 200, opacity: 0, rotateY: -45 },
        { x: 0, opacity: 1, rotateY: 0, stagger: 0.05, duration: 0.3, ease: 'power3.out' },
        0.15
      )

      // Bar chart grows
      tl.fromTo('.data-bar',
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, stagger: 0.03, duration: 0.3, ease: 'power2.out' },
        0.2
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

      // Parallax background
      tl.to('.parallax-bg', {
        y: '-10%',
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

      {/* Background YouTube Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <iframe
          className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          src="https://www.youtube.com/embed/QyhwSYhX09s?autoplay=1&mute=1&loop=1&playlist=QyhwSYhX09s&controls=0&showinfo=0&modestbranding=1&playsinline=1"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        <div className="absolute inset-0 bg-[#030305]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]" />
      </div>

      {/* Parallax grid + orbs */}
      <div className="parallax-bg absolute inset-0 z-0 pointer-events-none w-full h-[120%] -top-[10%]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-6" style={{ transformStyle: 'preserve-3d' }}>

        {/* Left Data Widgets */}
        <div className="hidden lg:flex flex-col gap-6 absolute left-8 top-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
          {miniStats.slice(0, 2).map((stat, i) => (
            <div key={i} className="data-widget-left" style={{ transform: `translateZ(${30 + i * 20}px)` }}>
              <div className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-2xl p-5 w-52">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center">
                    <stat.icon size={16} className="text-[#00AEEF]" />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}<span className="text-[#00AEEF] text-lg ml-1">{stat.suffix}</span></p>
              </div>
            </div>
          ))}

          {/* Mini bar chart */}
          <div className="data-widget-left bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-2xl p-5 w-52">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={14} className="text-[#00AEEF]" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Monthly Growth</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[35, 50, 40, 65, 55, 80, 70, 95, 85, 100].map((h, i) => (
                <div key={i} className="data-bar flex-1 bg-gradient-to-t from-[#00AEEF]/60 to-[#00AEEF]/20 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Central Metrics Block */}
        <div className="metrics-block flex flex-col items-center max-w-3xl" style={{ transformStyle: 'preserve-3d' }}>

          {/* Label */}
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase mb-6">// Performance Dashboard</span>

          {/* Views Counter */}
          <div className="flex items-baseline gap-4 md:gap-8 justify-center flex-wrap">
            <div className="text-6xl md:text-[8rem] lg:text-[10rem] font-bold text-white tracking-tighter leading-none" style={{ textShadow: '0 0 80px rgba(0,174,239,0.3), 0 10px 40px rgba(0,0,0,0.5)' }}>
              {views.toLocaleString()}
            </div>
            <div className="text-3xl md:text-5xl lg:text-7xl font-bold text-white/90">
              views
            </div>
          </div>

          {/* Context */}
          <div className="text-lg md:text-2xl text-white/60 uppercase tracking-[0.3em] mt-4 font-light">
            Total Audience Reached
          </div>

          {/* Separator */}
          <div className="w-full max-w-3xl h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-8 shadow-[0_0_15px_rgba(255,255,255,0.2)]" />

          {/* Engagement Row */}
          <div className="flex gap-12 md:gap-20 items-center text-white/90 text-xl md:text-3xl font-bold">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 md:w-10 md:h-10 text-[#00AEEF]" />
              <span>{views > 0 ? '98.2%' : '0%'}</span>
              <span className="text-xs text-white/40 font-normal ml-1">Reach</span>
            </div>
            <div className="flex items-center gap-3">
              <ThumbsUp className="w-6 h-6 md:w-10 md:h-10 text-[#00AEEF]" />
              <span>{likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 md:w-10 md:h-10 text-[#00AEEF]" />
              <span>{comments.toLocaleString()}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/40 text-sm md:text-base max-w-xl text-center mt-8 leading-relaxed">
            Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is shaped to make people stop scrolling.
          </p>

          {/* CTA */}
          <div className="results-cta mt-10" style={{ transform: 'translateZ(30px)' }}>
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

        {/* Right Data Widgets */}
        <div className="hidden lg:flex flex-col gap-6 absolute right-8 top-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
          {miniStats.slice(2, 4).map((stat, i) => (
            <div key={i} className="data-widget-right" style={{ transform: `translateZ(${30 + i * 20}px)` }}>
              <div className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-2xl p-5 w-52">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center">
                    <stat.icon size={16} className="text-[#00AEEF]" />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}<span className="text-[#00AEEF] text-lg ml-1">{stat.suffix}</span></p>
              </div>
            </div>
          ))}

          {/* Engagement ring */}
          <div className="data-widget-right bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-2xl p-5 w-52 flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-4">Retention</span>
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#00AEEF" strokeWidth="3" strokeDasharray="87, 100" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">87%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edge fades */}
      <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #030305, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #030305, transparent)' }} />
    </section>
  )
}
