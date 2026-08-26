'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Eye, ThumbsUp, MessageSquare } from 'lucide-react'
import type { HomePage } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

export default function Results({ data }: { data?: HomePage['results'] }) {
  const containerRef = useRef<HTMLElement>(null)
  const viewsTarget = data?.viewsTarget ?? 120000
  const likesTarget = data?.likesTarget ?? 14352
  const commentsTarget = data?.commentsTarget ?? 1670
  const reachPercent = data?.reachPercent || '98.2%'
  const description =
    data?.description ||
    'Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is meticulously shaped to make audiences stop scrolling.'
  const ctaLabel = data?.ctaLabel || 'See Case Studies'
  const ctaHref = data?.ctaHref || '/portfolio'
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [views, setViews] = useState(0)
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState(0)
  // Defer this section's video until it's actually approaching the
  // viewport — mounting it immediately competes for bandwidth/decode with
  // the hero's own critical frame-sequence load right at page load.
  const [videoInView, setVideoInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=80%',
          pin: true,
          scrub: 1,
        }
      })

      // Counter animation
      const viewCounter = { val: 0 }
      const likeCounter = { val: 0 }
      const commentCounter = { val: 0 }

      tl.to(viewCounter, {
        val: viewsTarget,
        ease: 'none',
        duration: 0.6,
        onUpdate: () => setViews(Math.floor(viewCounter.val))
      }, 0)

      tl.to(likeCounter, {
        val: likesTarget,
        ease: 'none',
        duration: 0.6,
        onUpdate: () => setLikes(Math.floor(likeCounter.val))
      }, 0)

      tl.to(commentCounter, {
        val: commentsTarget,
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
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden" style={{ perspective: '1200px' }}>

      {/* Background Local Video — src withheld until in view, see videoInView above */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {videoInView && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
            src="/videos/performance.mp4"
          />
        )}
        <div className="absolute inset-0 bg-ink/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink opacity-80" />
      </div>

      {/* Parallax grid + orbs */}
      <div className="parallax-bg absolute inset-0 z-0 pointer-events-none w-full h-[120%] -top-[10%]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
        <div className="absolute top-1/3 left-1/4 w-[50vw] h-[50vw] bg-[#00AEEF]/5 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-1/3 right-1/4 w-[45vw] h-[45vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-6" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Central Metrics Block */}
        <div className="metrics-block flex flex-col items-center max-w-4xl w-full" style={{ transformStyle: 'preserve-3d' }}>

          {/* Views Counter */}
          <span className="font-mono text-sm sm:text-base tracking-[0.2em] text-white/50 uppercase mb-4">
            Our Clients This Month
          </span>
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

          {/* Engagement Row (3D comments and likes elements brought back) */}
          <div className="flex gap-12 md:gap-20 items-center text-white/90 text-xl md:text-3xl font-bold mb-10">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 md:w-10 md:h-10 text-[#00AEEF]" />
              <span data-cms-field="results.reachPercent">{views > 0 ? reachPercent : '0%'}</span>
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
          <p data-cms-field="results.description" className="text-white/50 text-base md:text-lg max-w-2xl text-center leading-relaxed font-light">
            {description}
          </p>

          {/* CTA */}
          <div className="results-cta mt-12" style={{ transform: 'translateZ(40px)' }}>
            <a
              ref={buttonRef}
              href={ctaHref}
              data-cms-field="results.ctaLabel"
              className="relative px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white font-medium text-lg overflow-hidden group cursor-pointer transition-all hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] inline-flex"
            >
              <span ref={textRef} className="relative z-10 flex items-center gap-4 pointer-events-none">
                {ctaLabel} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </span>
            </a>
          </div>
        </div>

      </div>

      {/* Edge fades */}
      <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #0B0C0E, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #0B0C0E, transparent)' }} />
    </section>
  )
}
