'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BorderBeam } from '@/components/ui/border-beam'
import { resolveIcon } from '@/lib/icon-map'

gsap.registerPlugin(ScrollTrigger)

interface Stat { value: string; label: string }
// icon is a name (string), not a component reference -- this file is a
// Client Component, and the page that renders it is a Server Component;
// passing a Lucide component function across that boundary fails the
// build ("Functions cannot be passed directly to Client Components").
// Resolved by name via resolveIcon() instead, same pattern used
// elsewhere in the codebase (ContactPageContent, Nav, ScheduleACallPage).
interface Tag { icon: string; label: string }

export default function PodcastCaseStudy({
  eyebrow,
  title,
  video,
  body,
  stats,
  highlight,
  footnote,
  tag,
  reverse = false,
}: {
  eyebrow: string
  title: string
  video: string
  body: string
  stats?: Stat[]
  /** A short emphasized line, styled larger than body copy. */
  highlight?: string
  footnote?: string
  tag?: Tag
  reverse?: boolean
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pcs-fade',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } }
      )
      gsap.fromTo(
        '.pcs-media',
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-16 md:py-20 border-t border-white/5">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className={`pcs-fade ${reverse ? 'order-2 lg:order-1' : ''}`}>
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">{eyebrow}</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tighter text-white leading-[1.1] mb-5">{title}</h2>
          <p className="text-white/60 font-light text-sm sm:text-base leading-relaxed mb-6">
            {body}
            {highlight && <> <span className="text-white/80">{highlight}</span></>}
          </p>

          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-[11px] text-white/45 font-mono uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {tag && (
            <div className="flex items-center gap-3 text-white/50 text-sm">
              {(() => { const TagIcon = resolveIcon(tag.icon); return <TagIcon className="w-4 h-4 text-[#00AEEF]" /> })()}
              {tag.label}
            </div>
          )}

          {footnote && <p className="text-white/40 text-xs font-light leading-relaxed">{footnote}</p>}
        </div>

        <div className={`pcs-media relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-white/[0.03] ${reverse ? 'order-1 lg:order-2' : ''}`}>
          <BorderBeam size={140} duration={7} colorFrom="#00AEEF" colorTo="#0ea5e9" />
          <video src={video} className="w-full h-full object-cover" muted loop autoPlay playsInline />
        </div>
      </div>
    </section>
  )
}
