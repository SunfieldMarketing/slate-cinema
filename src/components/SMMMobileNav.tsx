'use client'

import { useState } from 'react'

/*
  Mobile hamburger menu shared by the 3 self-contained legal/TikTok-
  compliance pages (Social Media Management, Privacy Policy, Terms of
  Service) -- see social-media-management/page.tsx's header comment for
  why they don't use the shared Nav component. Added 2026-08-13: Jake
  flagged on the Aug 12 call that this page's nav "isn't saying the same"
  as the rest of the site; the actual bug was nav.main going
  display:none under 860px with nothing replacing it, so mobile visitors
  had zero way to navigate off these pages besides "Schedule Call". Purely
  additive -- the legally-reviewed hero/content copy on each page is
  untouched, and the CSS classes (.smm-burger / .smm-mobile-menu) are
  shared verbatim across all 3 pages' own <style> blocks.
*/
export default function SMMMobileNav({ activeHref }: { activeHref?: string }) {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/social-media-management', label: 'Social Media' },
    { href: '/how-it-works', label: 'How It Works' },
  ]

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="smm-burger"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="smm-mobile-menu">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className={l.href === activeHref ? 'on' : ''}>
              {l.label}
            </a>
          ))}
          <a href="/schedule-a-call" onClick={() => setOpen(false)} className="pill">Schedule Call</a>
        </div>
      )}
    </>
  )
}
