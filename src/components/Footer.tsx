'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/* ── Film-strip perforation pattern (pure CSS, no external assets) ── */
const PERF_COUNT = 24

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null)
  const filmStripRef = useRef<HTMLDivElement>(null)
  const ctaWordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const gridColRefs = useRef<(HTMLDivElement | null)[]>([])
  const copyrightRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  /* ── Register link refs for 3D hover ── */
  const setLinkRef = useCallback((el: HTMLAnchorElement | null, idx: number) => {
    linkRefs.current[idx] = el
  }, [])

  /* ── CTA words ── */
  const ctaText = 'Ready to create content people actually want to watch?'
  const ctaWords = ctaText.split(' ')

  useGSAP(() => {
    const container = containerRef.current
    if (!container) return

    /* ─────────────────────────────────────────────
       1. Film-strip border — horizontal scroll
    ───────────────────────────────────────────── */
    if (filmStripRef.current) {
      gsap.fromTo(filmStripRef.current,
        { xPercent: 0 },
        {
          xPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          }
        }
      )
    }

    /* ─────────────────────────────────────────────
       2. Wordmark parallax + 3D rotateX
    ───────────────────────────────────────────── */
    gsap.fromTo('.footer-wordmark',
      { y: 120, rotateX: 30 },
      {
        y: -40,
        rotateX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        }
      }
    )

    /* ─────────────────────────────────────────────
       3. CTA words — staggered reveal from below
    ───────────────────────────────────────────── */
    const words = ctaWordsRef.current.filter(Boolean)
    if (words.length) {
      gsap.fromTo(words,
        { y: 60, opacity: 0, rotateX: 40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-cta-section',
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      )
    }

    /* ─────────────────────────────────────────────
       4. Get Started button — scale + glow
    ───────────────────────────────────────────── */
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        {
          scale: 0.8,
          opacity: 0.4,
          boxShadow: '0 0 0px rgba(0,174,239,0)',
        },
        {
          scale: 1,
          opacity: 1,
          boxShadow: '0 0 60px rgba(0,174,239,0.35), 0 0 120px rgba(0,174,239,0.15)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: buttonRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 1,
          }
        }
      )
    }

    /* ─────────────────────────────────────────────
       5. 3-column grid — staggered slide-up
    ───────────────────────────────────────────── */
    const cols = gridColRefs.current.filter(Boolean)
    if (cols.length) {
      gsap.fromTo(cols,
        { y: 80, opacity: 0, rotateX: 12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1,
          }
        }
      )
    }

    /* ─────────────────────────────────────────────
       6. Copyright bar — fade in last
    ───────────────────────────────────────────── */
    if (copyrightRef.current) {
      gsap.fromTo(copyrightRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: copyrightRef.current,
            start: 'top 98%',
            end: 'top 80%',
            scrub: 1,
          }
        }
      )
    }

    /* ─────────────────────────────────────────────
       7. 3D hover tilt on footer links
    ───────────────────────────────────────────── */
    linkRefs.current.filter(Boolean).forEach((link) => {
      if (!link) return

      const onEnter = (e: MouseEvent) => {
        const rect = link.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const midX = rect.width / 2
        const midY = rect.height / 2
        const rotY = ((x - midX) / midX) * 8
        const rotX = -((y - midY) / midY) * 6

        gsap.to(link, {
          rotateX: rotX,
          rotateY: rotY,
          scale: 1.05,
          color: '#00AEEF',
          textShadow: '0 0 12px rgba(0,174,239,0.3)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      const onMove = (e: MouseEvent) => {
        const rect = link.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const midX = rect.width / 2
        const midY = rect.height / 2
        const rotY = ((x - midX) / midX) * 8
        const rotX = -((y - midY) / midY) * 6

        gsap.to(link, {
          rotateX: rotX,
          rotateY: rotY,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      const onLeave = () => {
        gsap.to(link, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          color: '#8E96AA',
          textShadow: '0 0 0px rgba(0,174,239,0)',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      link.addEventListener('mouseenter', onEnter as EventListener)
      link.addEventListener('mousemove', onMove as EventListener)
      link.addEventListener('mouseleave', onLeave as EventListener)

      return () => {
        link.removeEventListener('mouseenter', onEnter as EventListener)
        link.removeEventListener('mousemove', onMove as EventListener)
        link.removeEventListener('mouseleave', onLeave as EventListener)
      }
    })

  }, { scope: containerRef })

  /* ── Track running link-ref index ── */
  let linkIdx = 0

  return (
    <footer ref={containerRef} className="relative w-full bg-[#030305] pt-0 pb-8 overflow-hidden"
      style={{ perspective: 1200 }}
    >
      {/* ── Cinematic film-strip border at top ── */}
      <div className="relative w-full h-16 overflow-hidden bg-[#0a0a0e] border-b border-white/5">
        {/* Film strip moving container */}
        <div ref={filmStripRef} className="absolute top-0 left-0 flex items-center h-full"
          style={{ width: '200%' }}
        >
          {/* Top perforation row */}
          <div className="absolute top-1 left-0 w-full flex">
            {Array.from({ length: PERF_COUNT * 2 }).map((_, i) => (
              <div key={`pt-${i}`} className="flex-shrink-0 mx-[18px]">
                <div className="w-3 h-2 rounded-sm bg-[#030305] border border-white/[0.06]" />
              </div>
            ))}
          </div>

          {/* Center strip — gradient frames */}
          <div className="absolute top-3 bottom-3 left-0 w-full flex items-center">
            {Array.from({ length: PERF_COUNT * 2 }).map((_, i) => (
              <div key={`fr-${i}`} className="flex-shrink-0 mx-1"
                style={{ width: 52, height: '100%' }}
              >
                <div className="w-full h-full rounded-[2px] border border-white/[0.06]"
                  style={{
                    background: i % 3 === 0
                      ? 'linear-gradient(135deg, rgba(0,174,239,0.06) 0%, transparent 60%)'
                      : i % 3 === 1
                        ? 'linear-gradient(135deg, rgba(142,150,170,0.04) 0%, transparent 60%)'
                        : 'transparent',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Bottom perforation row */}
          <div className="absolute bottom-1 left-0 w-full flex">
            {Array.from({ length: PERF_COUNT * 2 }).map((_, i) => (
              <div key={`pb-${i}`} className="flex-shrink-0 mx-[18px]">
                <div className="w-3 h-2 rounded-sm bg-[#030305] border border-white/[0.06]" />
              </div>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#030305] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#030305] to-transparent z-10 pointer-events-none" />
      </div>

      {/* ── Top glow line ── */}
      <div className="absolute top-16 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/40 to-transparent" />

      {/* ── Radial spotlight ── */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(0,174,239,0.05) 0%, transparent 65%)' }}
      />

      {/* ── Huge background wordmark ── */}
      <div className="footer-wordmark absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 opacity-[0.03]"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <span className="text-[18vw] font-bold tracking-tighter text-white whitespace-nowrap">
          SLATE CINEMA
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center pt-28">

        {/* ── Final CTA ── */}
        <div className="footer-cta-section text-center mb-20 max-w-3xl" style={{ perspective: 800 }}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-10 leading-tight">
            {ctaWords.map((word, i) => (
              <span key={i} className="inline-block mr-[0.3em]"
                ref={(el) => { ctaWordsRef.current[i] = el }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {word}
              </span>
            ))}
          </h2>

          <a ref={buttonRef} href="#quote"
            className="inline-flex items-center gap-3 bg-[#00AEEF] text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-[#00AEEF]/80 transition-all duration-300 group"
            style={{ transformOrigin: 'center center' }}
          >
            Get Started
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* ── Footer grid ── */}
        <div className="footer-grid w-full grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16 pb-16 text-center md:text-left"
          style={{ perspective: 600 }}
        >
          {/* ─ Brand column ─ */}
          <div ref={(el) => { gridColRefs.current[0] = el }}
            className="flex flex-col gap-4 items-center md:items-start"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#00AEEF] rounded flex items-center justify-center text-[#030305] font-bold text-xs shadow-[0_0_20px_rgba(0,174,239,0.3)]">
                SC
              </div>
              <span className="font-bold tracking-[0.15em] text-lg text-white">SLATE CINEMA</span>
            </div>
            <p className="text-[#8E96AA] text-sm leading-relaxed">Video production and video marketing agency</p>
            <p className="text-[#8E96AA] text-sm">Brooklyn, NY</p>
          </div>

          {/* ─ Contact column ─ */}
          <div ref={(el) => { gridColRefs.current[1] = el }}
            className="flex flex-col gap-4 items-center md:items-start text-sm"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h4 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase mb-2">Contact</h4>
            <a href="mailto:info@slatecinema.com"
              ref={(el) => setLinkRef(el, linkIdx++)}
              className="text-[#8E96AA] hover:text-[#00AEEF] transition-colors duration-300"
              style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
            >
              Email: info@slatecinema.com
            </a>
            <a href="tel:+17329301934"
              ref={(el) => setLinkRef(el, linkIdx++)}
              className="text-[#8E96AA] hover:text-[#00AEEF] transition-colors duration-300"
              style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
            >
              Tel: +1 732 930-1934
            </a>
            <p className="text-[#8E96AA]">132 32nd St, Brooklyn, NY 11232</p>
          </div>

          {/* ─ Links column ─ */}
          <div ref={(el) => { gridColRefs.current[2] = el }}
            className="flex justify-center md:justify-end gap-16 text-sm"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase mb-2">Navigation</h4>
              {['Home', 'Portfolio', 'How It Works', 'Contact'].map((item) => (
                <a key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  ref={(el) => setLinkRef(el, linkIdx++)}
                  className="text-[#8E96AA] transition-colors duration-300"
                  style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase mb-2">Social</h4>
              {['TikTok', 'Instagram', 'Facebook', 'Vimeo'].map((item) => (
                <a key={item}
                  href="#"
                  ref={(el) => setLinkRef(el, linkIdx++)}
                  className="text-[#8E96AA] transition-colors duration-300"
                  style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom copyright bar ── */}
        <div ref={copyrightRef}
          className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-white/20 gap-4 border-t border-white/5 pt-8"
        >
          <p>© 2026 Slate Cinema. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
