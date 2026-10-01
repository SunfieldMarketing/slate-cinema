'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import posthog from 'posthog-js'
import { labelField, useSiteLabels } from '@/lib/site-data-context'

/*
  Persistent booking path — a small pill that slides in bottom-right once
  the visitor has scrolled past the hero, so the conversion action is
  never more than one click away regardless of scroll depth. Label and
  link: Site Settings > Labels > "Get Started".
*/
export default function StickyCta({ accent }: { accent: string }) {
  const [visible, setVisible] = useState(false)
  const labels = useSiteLabels()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={labels.getStartedHref}
      {...labelField('getStarted')}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => posthog.capture('sticky_cta_clicked')}
      // z-[25]: above page content, below the mobile menu overlay (z-30) --
      // at z-40 it floated on top of the open menu.
      className={`fixed bottom-5 right-5 z-[25] group inline-flex items-center gap-2 pl-4 pr-3 py-3 rounded-full text-xs font-semibold text-black backdrop-blur-md transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
      style={{ background: accent, boxShadow: `0 8px 32px ${accent}66` }}
    >
      {labels.getStarted}
      <span className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center">
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  )
}
