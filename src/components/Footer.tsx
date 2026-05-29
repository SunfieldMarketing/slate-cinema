'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

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

      // SMPTE color bars slide across
      tl.fromTo('.smpte-bars',
        { xPercent: -100 },
        { xPercent: 0, ease: 'none', duration: 1 },
        0
      )

    }, footerRef)
    return () => ctx.revert()
  }, { scope: footerRef })

  // 3D Magnetic hover for links
  const handleLinkMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(e.currentTarget, { x: x * 0.3, y: y * 0.3, rotateX: -y * 0.2, rotateY: x * 0.2, duration: 0.3 })
  }
  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <footer ref={footerRef} className="relative w-full bg-[#030305] pt-32 pb-12 overflow-hidden" style={{ perspective: '1000px' }}>
      
      {/* SMPTE Color Bars Decoration (Cinematic callback) */}
      <div className="absolute top-0 left-0 w-full h-1 overflow-hidden z-20">
        <div className="smpte-bars w-[200%] h-full flex">
          {['#C0C0C0', '#C0C000', '#00C0C0', '#00C000', '#C000C0', '#C00000', '#0000C0'].map((color, i) => (
            <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }} />
          ))}
          {/* Repeat for seamless slide */}
          {['#C0C0C0', '#C0C000', '#00C0C0', '#00C000', '#C000C0', '#C00000', '#0000C0'].map((color, i) => (
            <div key={`dup-${i}`} className="flex-1 h-full" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        <div className="w-full flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-16 mb-16 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to create?</h3>
            <p className="text-white/40">info@slatecinema.com</p>
          </div>

          <div className="flex gap-8">
            {['Instagram', 'LinkedIn', 'Vimeo', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                onMouseMove={handleLinkMove}
                onMouseLeave={handleLinkLeave}
                className="footer-link text-sm font-medium text-white/50 hover:text-[#00AEEF] transition-colors block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {social}
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="font-mono text-[10px] text-white/20 tracking-widest mb-2 uppercase">Headquarters</p>
            <p className="text-white/40 text-sm">Los Angeles, CA<br/>Global Availability</p>
          </div>
        </div>

        {/* Giant 3D Wordmark */}
        <div className="footer-wordmark w-full text-center overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
          <span className="block text-[15vw] font-bold text-white leading-none tracking-tighter mix-blend-overlay opacity-80" style={{ textShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            SLATE CINEMA
          </span>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-12 text-[10px] font-mono text-white/20 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Slate Cinema</p>
          <div className="flex gap-4 mt-4 md:mt-0">
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
