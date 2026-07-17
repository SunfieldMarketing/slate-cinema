'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import posthog from 'posthog-js'

/*
  Persistent booking path — a small pill that slides in bottom-right once
  the visitor has scrolled past the hero, so the conversion action is
  never more than one click away regardless of scroll depth.
*/
export default function StickyCta({ accent }: { accent: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="/contact"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => posthog.capture('sticky_cta_clicked')}
      className={`fixed bottom-5 right-5 z-40 group inline-flex items-center gap-2 pl-4 pr-3 py-3 rounded-full text-xs font-semibold text-black backdrop-blur-md transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
      style={{ background: accent, boxShadow: `0 8px 32px ${accent}66` }}
    >
      Start your project
      <span className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center">
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  )
}
