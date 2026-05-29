'use client'

import { useState, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const navLinks = ['Home', 'Portfolio', 'How It Works', 'Contact']

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Scroll progress bar
      gsap.to('.nav-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 1 }
      })

      // Shrink on scroll
      ScrollTrigger.create({
        start: 'top -100',
        onEnter: () => {
          gsap.to('.nav-bg', { opacity: 1, duration: 0.3 })
          gsap.to('.nav-inner', { paddingTop: '12px', paddingBottom: '12px', duration: 0.3 })
        },
        onLeaveBack: () => {
          gsap.to('.nav-bg', { opacity: 0, duration: 0.3 })
          gsap.to('.nav-inner', { paddingTop: '24px', paddingBottom: '24px', duration: 0.3 })
        }
      })
    }, navRef)
    return () => ctx.revert()
  }, { scope: navRef })

  // Magnetic hover on links
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
    <>
      <nav ref={navRef} className="fixed top-0 left-0 w-full z-40">
        {/* Progress bar */}
        <div className="nav-progress absolute top-0 left-0 h-[2px] bg-[#00AEEF] w-full origin-left scale-x-0 z-50" />
        
        {/* Background blur layer */}
        <div className="nav-bg absolute inset-0 opacity-0 pointer-events-none transition-opacity" style={{ background: 'rgba(3,3,5,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }} />

        <div className="nav-inner relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group" style={{ perspective: '500px' }}>
            <div className="relative w-8 h-8 rounded bg-[#00AEEF] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <span className="text-[#030305] font-bold text-xs">SC</span>
              {/* REC dot */}
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <span className="font-bold tracking-[0.15em] text-sm text-white hidden sm:block">SLATE CINEMA</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1" style={{ perspective: '800px' }}>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                onMouseMove={handleLinkMove}
                onMouseLeave={handleLinkLeave}
                className="relative px-4 py-2 text-sm text-white/50 hover:text-white font-medium tracking-wide transition-colors block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA + Portal */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors tracking-widest uppercase">Client Portal</a>
            <a href="#quote" className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-[#030305] bg-white overflow-hidden group">
              <div className="absolute inset-0 bg-[#00AEEF] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative group-hover:text-white transition-colors">Schedule Call</span>
            </a>
          </div>

          {/* Mobile */}
          <button className="md:hidden text-white z-50 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#030305] flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
              className="text-2xl font-bold text-white hover:text-[#00AEEF] transition-colors tracking-wider"
              onClick={() => setMobileMenuOpen(false)}>
              {link}
            </a>
          ))}
          <a href="#quote" className="bg-[#00AEEF] text-white px-8 py-4 rounded-full text-lg font-semibold mt-4 shadow-[0_0_20px_rgba(0,174,239,0.3)]">
            Schedule Call
          </a>
        </div>
      )}
    </>
  )
}
