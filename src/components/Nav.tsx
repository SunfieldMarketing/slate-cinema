'use client'

import { useState, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Top progress bar
    gsap.to('.nav-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    })

    // Continuous morph on scroll
    gsap.to('.nav-container', {
      paddingTop: '16px',
      paddingBottom: '16px',
      backgroundColor: 'rgba(3, 3, 5, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'top -200px',
        scrub: 1
      }
    })

    gsap.to('.nav-logo', {
      scale: 0.85,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'top -200px',
        scrub: 1
      }
    })

    // CTA Button Pulse
    gsap.to('.nav-cta', {
      boxShadow: '0 0 20px rgba(0,174,239,0.5)',
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'power1.inOut'
    })
  }, { scope: navRef })

  // 3D hover effects on links
  const handleLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { rotateX: -15, color: '#00AEEF', scale: 1.05, duration: 0.3 })
  }
  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { rotateX: 0, color: '#8E96AA', scale: 1, duration: 0.3 })
  }

  // Mobile menu 3D entrance
  useGSAP(() => {
    if (mobileMenuOpen) {
      gsap.fromTo(menuRef.current,
        { rotateY: -90, transformOrigin: 'left center', opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
    }
  }, [mobileMenuOpen])

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 w-full z-40 transition-all duration-300 px-6 md:px-12" style={{ perspective: '1000px' }}>
        <div className="nav-progress absolute top-0 left-0 h-[2px] bg-[#00AEEF] w-full origin-left scale-x-0 z-50" />
        
        <div className="nav-container py-8 transition-colors duration-300 relative w-[calc(100%+3rem)] -mx-6 md:w-[calc(100%+6rem)] md:-mx-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <div className="nav-logo flex items-center gap-2 cursor-pointer group origin-left">
              <div className="w-6 h-6 bg-[#00AEEF] rounded-sm flex items-center justify-center text-[#030305] font-bold text-xs group-hover:rotate-12 transition-transform">SC</div>
              <span className="font-bold tracking-widest text-lg hidden sm:block text-white">SLATE CINEMA</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-[#8E96AA]" style={{ perspective: '800px' }}>
              {['Home', 'Portfolio', 'How It Works', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                  onMouseEnter={handleLinkEnter}
                  onMouseLeave={handleLinkLeave}
                  className="relative group block"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom center' }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00AEEF] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="text-sm font-medium text-[#8E96AA] hover:text-white transition-colors">Client Portal</button>
              <button className="nav-cta bg-white text-[#030305] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#00AEEF] hover:text-white transition-all duration-300">
                Schedule Call
              </button>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-white p-2 z-50 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          ref={menuRef}
          className="fixed inset-0 z-30 bg-[#030305] flex flex-col items-center justify-center gap-8"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {['Home', 'Portfolio', 'How It Works', 'Contact', 'Client Portal'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
              className="text-2xl font-bold tracking-wider text-white hover:text-[#00AEEF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button className="bg-[#00AEEF] text-white px-8 py-4 rounded-full text-lg font-semibold mt-4 shadow-[0_0_20px_rgba(0,174,239,0.3)]">
            Schedule Call
          </button>
          
          <div className="absolute bottom-10 flex flex-col items-center gap-2 text-[#8E96AA] text-sm">
            <span>info@slatecinema.com</span>
            <span>+1 732 930-1934</span>
          </div>
        </div>
      )}
    </>
  )
}
