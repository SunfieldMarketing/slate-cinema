'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Heart } from 'lucide-react'
import { MODEL_CREDITS } from '@/components/storyboard/config'
import posthog from 'posthog-js'
import { useSiteData } from '@/lib/site-data-context'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const { footer } = useSiteData()
  const footerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

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

      // Marquee — duration must scale with content width, not stay fixed:
      // xPercent:-50 always travels exactly one full copy's width, so when
      // the phrase list grew from 3 to 20 items the on-screen speed
      // quietly multiplied ~7x for the same 20s duration (client-reported
      // "too fast"). Scaled up to keep a comfortable per-phrase pace.
      gsap.to('.marquee-content', {
        xPercent: -50,
        ease: 'none',
        duration: 55,
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

  const marqueeSource = (footer.marqueeItems ?? []).map((m) => m.text)
  const marqueeItems = [...marqueeSource, ...marqueeSource]
  const cta = footer.cta
  const newsletter = footer.newsletter
  const sitemap = footer.sitemapColumn
  const bottomBar = footer.bottomBar

  return (
    <footer ref={footerRef} className="relative w-full bg-ink pt-14 pb-6 overflow-hidden" style={{ perspective: '1000px' }}>

      {/* Marquee */}
      <div className="w-full border-y border-white/10 py-3 mb-8 overflow-hidden flex whitespace-nowrap bg-[#00AEEF]/5">
        <div className="marquee-content flex gap-12 px-6 items-center w-max">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-12">
              <span className="text-lg md:text-2xl font-bold text-white tracking-wider">{item}</span>
              <span className="text-[#00AEEF] text-2xl">
                <svg className="inline w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5z"/></svg>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wordmark ABOVE Footer Info — kept as a subtle watermark, sized
          down so it reads as texture rather than dominating the footer's
          height. font-mono (Courier Prime) is correct here and always has
          been -- verified 2026-08-14 by walking the full git history: this
          exact className (font-mono, text-white/[0.07], text-[9vw]) was
          introduced 2026-08-06 and never touched again until an earlier
          pass this session guessed it should be font-display instead and
          swapped it. That guess was wrong; reverted back to the real
          original. (A stenciled/typewriter face on a film slate's chalk
          board is also just the more on-brand read for "SLATE CINEMA"
          than the marquee-display face.) */}
      <div className="footer-wordmark w-full flex items-center justify-center py-3 mb-5 overflow-visible">
        <h1
          ref={textRef}
          className="text-[9vw] md:text-[9vw] font-bold text-white/[0.07] font-mono leading-none tracking-tighter whitespace-nowrap select-none"
        >
          SLATE CINEMA
        </h1>
      </div>

      {/* Footer Content Grid - layered OVER the wordmark via negative margin */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 -mt-16 lg:-mt-20">

        <div className="w-full flex flex-col lg:flex-row justify-between items-start border-b border-white/10 pb-8 mb-8 gap-8 lg:gap-8">

          {/* CTA + Newsletter */}
          <div className="w-full lg:max-w-md flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">{cta?.heading || 'Ready to create?'}</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={cta?.buttonHref || '/contact'}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="footer-btn px-6 py-2.5 bg-[#00AEEF] text-[#030305] font-bold rounded-full hover:bg-white transition-colors text-center text-sm"
                >
                  {cta?.buttonLabel || 'Get Started'}
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">{newsletter?.heading || 'Subscribe to our Newsletter'}</h4>
              <p className="text-white/45 text-xs font-light leading-relaxed mb-3 max-w-md">
                {newsletter?.sentence}
              </p>
              {newsletterSubmitted ? (
                <p className="text-sm text-[#00AEEF]">Thanks — you&rsquo;re on the list.</p>
              ) : (
                <form
                  className="flex w-full max-w-md"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const input = (e.currentTarget.elements.namedItem('footer-email') as HTMLInputElement)?.value
                    if (!input) return
                    posthog.capture('newsletter_signed_up', { source: 'footer' })
                    // Real destination (Payload form-submissions, visible in
                    // /admin) — fire-and-forget so a hiccup here can never
                    // block the confirmation state below.
                    fetch('/api/newsletter', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: input }),
                    }).catch(() => {})
                    setNewsletterSubmitted(true)
                  }}
                >
                  <input
                    type="email"
                    name="footer-email"
                    placeholder={newsletter?.placeholder || 'Your email address'}
                    className="flex-1 bg-white/5 border border-white/10 border-r-0 rounded-l-full px-5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#00AEEF] text-[#030305] font-bold px-6 py-2.5 text-sm rounded-r-full hover:bg-white transition-colors whitespace-nowrap"
                  >
                    {newsletter?.buttonLabel || 'Sign Up'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sitemap — only real destinations. Legal + support links live
              here too now (previously only in the small bottom bar), so
              the studio column doesn't read as a single short list floating
              in an oversized gap next to the CTA column. */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row justify-between lg:justify-end gap-8 lg:gap-24 pt-2 lg:pt-0">
            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-sm">{sitemap?.heading || 'Studio'}</h4>
              <div className="flex flex-col gap-2.5">
                {(sitemap?.links ?? []).map((link) => (
                  <Link key={link.label} href={link.href} className="footer-link text-white/60 hover:text-[#00AEEF] transition-colors text-sm">
                    {link.label}
                  </Link>
                ))}
                <a href="/contact#get-started" className="footer-link text-white/60 hover:text-[#00AEEF] transition-colors text-sm">
                  Support
                </a>
                <a href={bottomBar?.privacyHref || '/privacy-policy'} className="footer-link text-white/60 hover:text-[#00AEEF] transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href={bottomBar?.termsHref || '/terms-of-service'} className="footer-link text-white/60 hover:text-[#00AEEF] transition-colors text-sm">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-4 text-[10px] font-mono text-white/20 tracking-widest uppercase gap-4">
          <p>&copy; {new Date().getFullYear()} Slate Cinema</p>
          <div className="flex items-center gap-2">
            {bottomBar?.craftedWithLoveText || 'Crafted with love by Slate Cinema'}
            <Heart size={12} className="text-[#00AEEF]" />
          </div>
          <div className="flex gap-4">
            <a href={bottomBar?.privacyHref || '/privacy-policy'} className="hover:text-white transition-colors">Privacy</a>
            <a href={bottomBar?.termsHref || '/terms-of-service'} className="hover:text-white transition-colors">Terms</a>
            <a href={bottomBar?.clientPortalHref || 'https://my.slatecinema.com/'} target="_blank" rel="noopener noreferrer" className="hover:text-[#00AEEF] transition-colors">Client Portal</a>
          </div>
        </div>

        {/* CC-BY attribution for the hero's 3D assets — required by the license */}
        <p className="w-full mt-6 text-center text-[9px] font-mono text-white/15 tracking-wide leading-relaxed normal-case">
          {MODEL_CREDITS}
        </p>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at bottom, rgba(0,174,239,0.15) 0%, transparent 60%)' }} />
    </footer>
  )
}
