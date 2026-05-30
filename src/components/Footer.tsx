'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Heart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        }
      })

      // Wordmark entrance
      tl.fromTo('.footer-wordmark',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'none' }
      )

      // Grid stagger
      tl.fromTo('.footer-link',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
        0.3
      )

      // Buttons
      tl.fromTo('.footer-btn',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.15, duration: 0.4, ease: 'back.out(1.7)' },
        0.2
      )

      // Marquee
      gsap.to('.marquee-content', {
        xPercent: -50,
        ease: 'none',
        duration: 20,
        repeat: -1
      })

    }, footerRef)
    return () => ctx.revert()
  }, { scope: footerRef })

  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(e.currentTarget, { x: x * 0.3, y: y * 0.3, duration: 0.3 })
  }
  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
  }

  const marqueeItems = [
    'Cinematic Storytelling', 'High-End Production', 'Global Distribution',
    'Cinematic Storytelling', 'High-End Production', 'Global Distribution',
  ]

  return (
    <footer ref={footerRef} className="relative w-full bg-[#030305] pt-32 pb-12 overflow-hidden" style={{ perspective: '1000px' }}>

      {/* Marquee */}
      <div className="w-full border-y border-white/10 py-6 mb-16 overflow-hidden flex whitespace-nowrap bg-[#00AEEF]/5">
        <div className="marquee-content flex gap-12 px-6 items-center w-max">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-12">
              <span className="text-2xl md:text-4xl font-bold text-white tracking-wider">{item}</span>
              <span className="text-[#00AEEF] text-2xl">
                <svg className="inline w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5z"/></svg>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Massive Wordmark ABOVE Footer Info */}
      <div className="footer-wordmark w-full flex items-center justify-center py-8 mb-12 overflow-visible">
        <h1
          ref={textRef}
          className="text-[14vw] md:text-[16vw] font-bold text-white/[0.07] font-mono leading-none tracking-tighter whitespace-nowrap select-none"
        >
          SLATE CINEMA
        </h1>
      </div>

      {/* Footer Content Grid - layered OVER the wordmark via negative margin */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 -mt-32 lg:-mt-40">

        <div className="w-full flex flex-col lg:flex-row justify-between items-start border-b border-white/10 pb-16 mb-16 gap-12 lg:gap-8">

          {/* Left: CTA + Newsletter */}
          <div className="w-full lg:w-5/12 flex flex-col gap-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Ready to create?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="footer-btn px-8 py-4 bg-[#00AEEF] text-[#030305] font-bold rounded-full hover:bg-white transition-colors"
                >
                  Start Your Campaign
                </button>
                <button
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="footer-btn px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
                >
                  Book a Consultation
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Subscribe to our Newsletter</h4>
              <form className="flex w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-white/5 border border-white/10 border-r-0 rounded-l-full px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00AEEF] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#00AEEF] text-[#030305] font-bold px-8 py-4 rounded-r-full hover:bg-white transition-colors whitespace-nowrap"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>

          {/* Right: Sitemap */}
          <div className="w-full lg:w-7/12 flex flex-col sm:flex-row justify-between lg:justify-end gap-12 lg:gap-24 pt-4 lg:pt-0">
            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Studio</h4>
              <div className="flex flex-col gap-4">
                {['Work', 'Directors', 'About Us', 'Journal'].map((link) => (
                  <a key={link} href="#" className="footer-link text-white/60 hover:text-[#00AEEF] transition-colors text-sm">{link}</a>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h4>
              <div className="flex flex-col gap-4">
                {['Commercials', 'Music Videos', 'Documentary', 'VFX & Color'].map((link) => (
                  <a key={link} href="#" className="footer-link text-white/60 hover:text-[#00AEEF] transition-colors text-sm">{link}</a>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Social</h4>
              <div className="flex flex-col gap-4">
                {['Instagram', 'LinkedIn', 'Vimeo', 'YouTube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={handleMagneticLeave}
                    className="footer-link text-sm font-medium text-white/60 hover:text-[#00AEEF] transition-colors block w-max"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-12 text-[10px] font-mono text-white/20 tracking-widest uppercase gap-4">
          <p>&copy; {new Date().getFullYear()} Slate Cinema</p>
          <div className="flex items-center gap-2">
            Crafted with love by Slate Cinema
            <Heart size={12} className="text-[#00AEEF]" />
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-[#00AEEF] transition-colors">Client Portal</a>
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at bottom, rgba(0,174,239,0.15) 0%, transparent 60%)' }} />
    </footer>
  )
}
