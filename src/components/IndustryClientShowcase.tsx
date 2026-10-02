'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'
import type { IndustryClientCard, IndustrySectionHeading } from '@/lib/normalize'
import type { SectionCmsPaths } from '@/lib/cms-paths'
import { extractVimeoId } from '@/lib/vimeo'
import SmartVideo from '@/components/ui/SmartVideo'

gsap.registerPlugin(ScrollTrigger)

/*
  The client strip under the logo banner on every industry page. Since
  2026-10-01 the heading and every card come from the industry's CMS doc
  (Client strip section) instead of src/lib/industries.ts.

  Per Jake's handoff, a card with no Vimeo video is hidden rather than
  falling back to a generic pipeline loop, and the whole section goes
  away when no card has one.
*/

// Frame inside the card's 16:9 media area, matched to the video's own
// shape -- Vimeo letterboxes a video that doesn't fill its iframe, so a
// vertical clip in a 16:9 frame would sit between two black bars.
const FRAME: Record<IndustryClientCard['orientation'], string> = {
  landscape: 'absolute inset-0',
  portrait: 'absolute inset-y-0 left-1/2 -translate-x-1/2 aspect-[9/16]',
  feed: 'absolute inset-y-0 left-1/2 -translate-x-1/2 aspect-[4/5]',
  square: 'absolute inset-y-0 left-1/2 -translate-x-1/2 aspect-square',
}

const INDUSTRY_PATHS: SectionCmsPaths = {
  eyebrow: 'sectionEyebrow',
  headline: 'sectionHeadline',
  accent: 'sectionHeadlineAccent',
  items: 'clients',
}

export default function IndustryClientShowcase({
  clients,
  heading,
  accent,
  paths = INDUSTRY_PATHS,
}: {
  clients: IndustryClientCard[]
  heading: IndustrySectionHeading
  accent: string
  /** Click-to-edit paths; defaults to the industry doc's fields. */
  paths?: SectionCmsPaths
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.acs-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: '.acs-grid', start: 'top 82%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  // Keep each card's index in the CMS array so click-to-edit lands on the
  // right row even when hidden cards sit between visible ones.
  const visible = clients
    .map((c, index) => ({ ...c, index, vimeoId: extractVimeoId(c.vimeo) }))
    .filter((c) => c.vimeoId)
  if (!visible.length) return null
  const single = visible.length === 1

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        {(heading.eyebrow || heading.headline || heading.intro) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {heading.eyebrow && (
              <span data-cms-field={paths.eyebrow} className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase block mb-4" style={{ color: accent }}>
                {heading.eyebrow}
              </span>
            )}
            {heading.headline && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
                <span data-cms-field={paths.headline}>{heading.headline}</span>
                {heading.accent && (
                  <>
                    {' '}
                    <span data-cms-field={paths.accent} className="font-serif-accent italic text-white/60">{heading.accent}</span>
                  </>
                )}
              </h2>
            )}
            {heading.intro && (
              <p data-cms-field={paths?.intro} className="mt-5 text-white/55 text-base sm:text-lg font-light leading-relaxed whitespace-pre-line">
                {heading.intro}
              </p>
            )}
          </div>
        )}

        <div className={`acs-grid grid gap-5 ${single ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {visible.map((c) => (
            <MagicCard
              key={`${c.index}-${c.name}`}
              className="acs-card rounded-2xl overflow-hidden relative"
              gradientColor={`${accent}22`}
              gradientFrom={accent}
              gradientTo={accent}
            >
              <div
                className="relative aspect-video overflow-hidden"
                style={c.orientation === 'landscape' ? undefined : { background: `radial-gradient(ellipse at center, ${accent}26 0%, transparent 70%)` }}
              >
                <BorderBeam size={100} duration={6} colorFrom={accent} colorTo={accent} />
                <div className={FRAME[c.orientation] ?? FRAME.landscape}>
                  <SmartVideo vimeo={c.vimeo} variant="background" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent pointer-events-none" />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 data-cms-field={`${paths.items}.${c.index}.name`} className="text-white font-bold text-lg">{c.name}</h3>
                  {c.year && (
                    <span data-cms-field={`${paths.items}.${c.index}.year`} className="font-mono text-[10px] text-white/40 uppercase tracking-wide shrink-0">
                      {c.year}
                    </span>
                  )}
                </div>
                {c.description && (
                  <p data-cms-field={`${paths.items}.${c.index}.description`} className="text-white/55 text-sm font-light leading-relaxed">
                    {c.description}
                  </p>
                )}
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}
