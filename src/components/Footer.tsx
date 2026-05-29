'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo('.footer-wordmark',
      { y: 80 },
      {
        y: 0,
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
    <footer ref={containerRef} className="relative w-full bg-[#030305] pt-32 pb-8 overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/40 to-transparent" />
      
      {/* Huge background wordmark */}
      <div className="footer-wordmark absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 opacity-[0.03]">
        <span className="text-[18vw] font-bold tracking-tighter text-white whitespace-nowrap">SLATE CINEMA</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Final CTA */}
        <div className="text-center mb-20 max-w-3xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to create content people actually want to watch?
          </h2>
          <a href="#quote" className="inline-flex items-center gap-3 bg-[#00AEEF] text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-[#00AEEF]/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,174,239,0.3)] group">
            Get Started
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        {/* Footer grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16 pb-16 text-center md:text-left">
          
          {/* Brand */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#00AEEF] rounded flex items-center justify-center text-[#030305] font-bold text-xs">SC</div>
              <span className="font-bold tracking-[0.15em] text-lg text-white">SLATE CINEMA</span>
            </div>
            <p className="text-[#8E96AA] text-sm leading-relaxed">Video production and video marketing agency</p>
            <p className="text-[#8E96AA] text-sm">Brooklyn, NY</p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4 items-center md:items-start text-sm">
            <h4 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase mb-2">Contact</h4>
            <a href="mailto:info@slatecinema.com" className="text-[#F7F8FF] hover:text-[#00AEEF] transition-colors duration-300">
              Email: info@slatecinema.com
            </a>
            <a href="tel:+17329301934" className="text-[#F7F8FF] hover:text-[#00AEEF] transition-colors duration-300">
              Tel: +1 732 930-1934
            </a>
            <p className="text-[#8E96AA]">132 32nd St, Brooklyn, NY 11232</p>
          </div>

          {/* Links */}
          <div className="flex justify-center md:justify-end gap-16 text-sm">
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase mb-2">Navigation</h4>
              {['Home', 'Portfolio', 'How It Works', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[#8E96AA] hover:text-white transition-colors duration-300">{item}</a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase mb-2">Social</h4>
              {['TikTok', 'Instagram', 'Facebook', 'Vimeo'].map(item => (
                <a key={item} href="#" className="text-[#8E96AA] hover:text-white transition-colors duration-300">{item}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-white/20 gap-4 border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} Slate Cinema. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
