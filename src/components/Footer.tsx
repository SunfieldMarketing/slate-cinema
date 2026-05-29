'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo('.footer-wordmark',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 0.05,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1
        }
      }
    )
  }, { scope: containerRef })

  return (
    <footer ref={containerRef} className="relative w-full bg-[#030305] pt-24 pb-8 overflow-hidden border-t border-[#00AEEF]/20">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/50 to-transparent"></div>
      
      {/* Huge background wordmark */}
      <div className="footer-wordmark absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
        <span className="text-[12vw] font-bold tracking-tighter text-white">SLATE CINEMA</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
          Ready to create content people actually want to watch?
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-16 mb-8 text-center md:text-left">
          
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-[#00AEEF] rounded-sm text-[#030305] font-bold text-[10px] flex items-center justify-center">SC</div>
              <span className="font-bold tracking-widest text-white">SLATE CINEMA</span>
            </div>
            <p className="text-[#8E96AA] text-sm">Video production and video marketing agency</p>
            <p className="text-[#8E96AA] text-sm">Brooklyn, NY</p>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start text-sm">
            <a href="mailto:info@slatecinema.com" className="text-white hover:text-[#00AEEF] transition-colors">info@slatecinema.com</a>
            <a href="tel:+17329301934" className="text-white hover:text-[#00AEEF] transition-colors">+1 732 930-1934</a>
            <p className="text-[#8E96AA]">132 32nd St, Brooklyn, NY 11232</p>
          </div>

          <div className="flex justify-center md:justify-end gap-12 text-sm text-[#8E96AA]">
            <div className="flex flex-col gap-3 items-center md:items-end">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex flex-col gap-3 items-center md:items-end">
              <a href="#" className="hover:text-white transition-colors">TikTok</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Vimeo</a>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-[#8E96AA] gap-4">
          <p>© {new Date().getFullYear()} Slate Cinema. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
