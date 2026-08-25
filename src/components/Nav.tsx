'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useSiteData } from '@/lib/site-data-context'
import { resolveIcon } from '@/lib/icon-map'

gsap.registerPlugin(ScrollTrigger)

export default function Nav() {
  const { navigation, industries } = useSiteData()
  const navLinks = [{ label: 'Home', href: '/' }, ...(navigation.links ?? [])]
  const ctaLabel = navigation.ctaButton?.label || 'Schedule Call'
  const ctaHref = navigation.ctaButton?.href || '/schedule-a-call'
  const clientPortalHref = navigation.clientPortalHref || 'https://my.slatecinema.com/'

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false)
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false)
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
      <nav ref={navRef} data-cms-global="navigation" className="fixed top-0 left-0 w-full z-40">
        {/* Progress bar */}
        <div className="nav-progress absolute top-0 left-0 h-[2px] bg-[#00AEEF] w-full origin-left scale-x-0 z-50" />
        
        {/* Background blur layer */}
        <div className="nav-bg absolute inset-0 opacity-0 pointer-events-none transition-opacity" style={{ background: 'rgba(11,12,14,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }} />

        <div className="nav-inner relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" style={{ perspective: '500px' }}>
            <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img src="/images/logo-mark.webp" alt="Slate Cinema" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold tracking-[0.15em] text-sm text-white hidden sm:block">SLATE CINEMA</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1" style={{ perspective: '800px' }}>
            <Link
              href="/"
              onMouseMove={handleLinkMove}
              onMouseLeave={handleLinkLeave}
              className="relative px-4 py-2 text-sm text-white/50 hover:text-white font-medium tracking-wide transition-colors block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              Home
            </Link>

            {/* Portfolio dropdown — main page + every individual industry page */}
            <div
              className="relative"
              onMouseEnter={() => setPortfolioDropdownOpen(true)}
              onMouseLeave={() => setPortfolioDropdownOpen(false)}
            >
              <Link
                href="/portfolio"
                onMouseMove={handleLinkMove}
                onMouseLeave={handleLinkLeave}
                className="relative px-4 py-2 text-sm text-white/50 hover:text-white font-medium tracking-wide transition-colors flex items-center gap-1"
                style={{ transformStyle: 'preserve-3d' }}
              >
                Portfolio
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${portfolioDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {portfolioDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64">
                  <div className="rounded-2xl border border-white/10 bg-[rgba(11,12,14,0.95)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2 overflow-hidden">
                    <Link
                      href="/portfolio"
                      className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/[0.06] transition-colors"
                    >
                      All Work
                    </Link>
                    {/* A dedicated "Podcasts" link used to live here --
                        removed 2026-08-13 now that podcasts is a normal
                        industry entry (src/lib/industries.ts) and shows up
                        in the industries.map() list below automatically. */}
                    <div className="my-1.5 h-px bg-white/[0.06]" />
                    {/* No inner scroll region on purpose -- the client wants every
                        industry visible on open, not a scrollbar inside the dropdown. */}
                    <div>
                      {industries.map((ind) => {
                        const Icon = resolveIcon(ind.icon)
                        return (
                          <Link
                            key={ind.id}
                            href={`/portfolio/${ind.slug}`}
                            data-cms-collection="industries"
                            data-cms-doc-id={ind.id}
                            data-cms-field="label"
                            className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: ind.accent }} />
                            {ind.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                data-cms-field={`links.${i}.label`}
                onMouseMove={handleLinkMove}
                onMouseLeave={handleLinkLeave}
                className="relative px-4 py-2 text-sm text-white/50 hover:text-white font-medium tracking-wide transition-colors block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Portal */}
          <div className="hidden md:flex items-center gap-4">
            {/* Landed here 2026-08-13 after 3 rounds: Jake's Aug 12 call said
                "make it white"; Kauan then said "bring it back to grey";
                separately, Jake also posted a screenshot of this exact
                element to #web-development the same day (Aug 12, 13:03)
                saying "I like that it's not white but it should be about
                20% more visible" -- referring to the original text-white/25.
                Split the difference on that explicit, quantified feedback
                rather than picking one instruction over the other: a grey
                that's meaningfully brighter than /25, nowhere near white/80. */}
            <a href={clientPortalHref} target="_blank" rel="noopener noreferrer" data-cms-field="clientPortalHref" className="text-xs font-mono text-white/35 hover:text-white/55 transition-colors tracking-widest uppercase">Client Portal</a>
            <Link href={ctaHref} data-cms-field="ctaButton.label" className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-[#030305] bg-white overflow-hidden group">
              <div className="absolute inset-0 bg-[#00AEEF] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative group-hover:text-white transition-colors">{ctaLabel}</span>
            </Link>
          </div>

          {/* Mobile */}
          <button className="md:hidden text-white z-50 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div data-cms-global="navigation" className="fixed inset-0 z-30 bg-ink flex flex-col items-center justify-center gap-6 overflow-y-auto py-24">
          <Link href="/"
            className="text-2xl font-bold text-white hover:text-[#00AEEF] transition-colors tracking-wider"
            onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setMobilePortfolioOpen(!mobilePortfolioOpen)}
              className="flex items-center gap-2 text-2xl font-bold text-white hover:text-[#00AEEF] transition-colors tracking-wider"
            >
              Portfolio
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobilePortfolioOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobilePortfolioOpen && (
              <div className="flex flex-col items-center gap-4 mt-5">
                <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-white/80 hover:text-[#00AEEF] transition-colors">
                  All Work
                </Link>
                {industries.map((ind) => (
                  <Link
                    key={ind.id}
                    href={`/portfolio/${ind.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-cms-collection="industries"
                    data-cms-doc-id={ind.id}
                    data-cms-field="label"
                    className="text-sm text-white/50 hover:text-[#00AEEF] transition-colors"
                  >
                    {ind.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link, i) => (
            <Link key={link.label} href={link.href}
              data-cms-field={`links.${i}.label`}
              className="text-2xl font-bold text-white hover:text-[#00AEEF] transition-colors tracking-wider"
              onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href={ctaHref} data-cms-field="ctaButton.label" onClick={() => setMobileMenuOpen(false)} className="bg-[#00AEEF] text-white px-8 py-4 rounded-full text-lg font-semibold mt-4 shadow-[0_0_20px_rgba(0,174,239,0.3)]">
            {ctaLabel}
          </Link>
        </div>
      )}
    </>
  )
}
