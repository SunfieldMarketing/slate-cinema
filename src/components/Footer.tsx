'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Heart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

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

      // The giant wordmark rises from the bottom and rotates on X
      tl.fromTo('.footer-wordmark',
        { y: 300, rotateX: -60, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, duration: 1, ease: 'none' }
      )

      // Social links stagger in
      tl.fromTo('.footer-link',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
        0.5
      )

      // Buttons stagger in
      tl.fromTo('.footer-btn',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.2, duration: 0.5, ease: 'back.out(1.7)' },
        0.4
      )

      // Marquee animation
      gsap.to('.marquee-content', {
        xPercent: -50,
        ease: 'none',
        duration: 20,
        repeat: -1
      })

    }, footerRef)
    return () => ctx.revert()
  }, { scope: footerRef })

  // 3D Magnetic hover for elements
  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(e.currentTarget, { x: x * 0.3, y: y * 0.3, rotateX: -y * 0.2, rotateY: x * 0.2, duration: 0.3 })
  }
  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
  }

  const marqueeItems = [
    "Cinematic Storytelling",
    "High-End Production",
    "Global Distribution",
    "Cinematic Storytelling",
    "High-End Production",
    "Global Distribution"
  ]

  return (
    <footer ref={footerRef} className="relative w-full bg-[#030305] pt-32 pb-12 overflow-hidden" style={{ perspective: '1000px' }}>
      
      {/* Marquee Section */}
      <div className="w-full border-y border-white/10 py-6 mb-16 overflow-hidden flex whitespace-nowrap bg-[#00AEEF]/5" ref={marqueeRef}>
        <div className="marquee-content flex gap-12 px-6 items-center w-max">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-12">
              <span className="text-2xl md:text-4xl font-bold text-white tracking-wider">{item}</span>
              <span className="text-[#00AEEF] text-2xl"><svg className="inline w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5z"/></svg></span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        <div className="w-full flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-16 mb-16 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-6">Ready to create?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="footer-btn px-8 py-4 bg-[#00AEEF] text-[#030305] font-bold rounded-full hover:bg-white transition-colors"
                style={{ transformStyle: 'preserve-3d' }}
              >
                Start Your Campaign
              </button>
              <button 
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="footer-btn px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
                style={{ transformStyle: 'preserve-3d' }}
              >
                Book a Consultation
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {['Instagram', 'LinkedIn', 'Vimeo', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="footer-link text-sm font-medium text-white/50 hover:text-[#00AEEF] transition-colors block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Giant 3D Wordmark */}
        <div className="footer-wordmark w-full text-center overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
          <span className="block text-[20vw] font-bold text-white leading-none tracking-tighter mix-blend-overlay opacity-80" style={{ textShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            SLATE
          </span>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-12 text-[10px] font-mono text-white/20 tracking-widest uppercase gap-4">
          <p>© {new Date().getFullYear()} Slate Cinema</p>
          
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

      {/* Deep blue cinematic bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at bottom, rgba(0,174,239,0.15) 0%, transparent 60%)' }} />
    </footer>
  )
}
