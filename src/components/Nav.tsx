'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={clsx(
        'fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-in-out px-6 md:px-12',
        isScrolled ? 'py-4 glass-panel bg-[#030305]/80' : 'py-8 bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-6 h-6 bg-[#00AEEF] rounded-sm flex items-center justify-center text-[#030305] font-bold text-xs group-hover:rotate-12 transition-transform">SC</div>
            <span className="font-bold tracking-widest text-lg hidden sm:block">SLATE CINEMA</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-[#8E96AA]">
            {['Home', 'Portfolio', 'How It Works', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00AEEF] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm font-medium text-[#8E96AA] hover:text-white transition-colors">Client Portal</button>
            <button className="bg-white text-[#030305] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#00AEEF] hover:text-white transition-all duration-300">
              Schedule Call
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white p-2 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={clsx(
        'fixed inset-0 z-30 bg-[#030305] flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out',
        mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      )}>
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
        <button className="bg-[#00AEEF] text-white px-8 py-4 rounded-full text-lg font-semibold mt-4">
          Schedule Call
        </button>
        
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-[#8E96AA] text-sm">
          <span>info@slatecinema.com</span>
          <span>+1 732 930-1934</span>
        </div>
      </div>
    </>
  )
}
