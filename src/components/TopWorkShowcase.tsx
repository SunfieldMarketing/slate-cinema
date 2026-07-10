'use client'

/*
  TopWorkShowcase — a scattered, draggable wall of the studio's most striking
  photoshoot moments, pulled straight from the industries data so it's real
  cinematic stock photography tied to real topics, not stand-in filler.
  Dragging rearranges the wall; a plain click/tap (distinguished from a drag
  by movement distance in DraggableCardBody) opens a larger look and links
  through to that industry's full page.
*/

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { X, ArrowUpRight } from 'lucide-react'
import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card'
import { industries } from '@/lib/industries'

const shots = [
  { industry: industries[0], image: industries[0].gallery[0], rotate: 'rotate-[-6deg]', position: 'top-2 left-[4%] sm:left-[8%]' },
  { industry: industries[1], image: industries[1].heroImage, rotate: 'rotate-[5deg]', position: 'top-24 left-[28%] sm:left-[30%]' },
  { industry: industries[3], image: industries[3].gallery[0], rotate: 'rotate-[-3deg]', position: 'top-4 left-[52%] sm:left-[54%]' },
  { industry: industries[5], image: industries[5].gallery[0], rotate: 'rotate-[7deg]', position: 'top-32 left-[74%] sm:left-[76%]' },
  { industry: industries[2], image: industries[2].gallery[0], rotate: 'rotate-[4deg]', position: 'top-64 sm:top-72 left-[14%]' },
  { industry: industries[6], image: industries[6].gallery[0], rotate: 'rotate-[-8deg]', position: 'top-60 sm:top-64 left-[44%]' },
  { industry: industries[8], image: industries[8].heroImage, rotate: 'rotate-[3deg]', position: 'top-56 sm:top-60 left-[68%]' },
]

export default function TopWorkShowcase() {
  const [expanded, setExpanded] = useState<typeof shots[number] | null>(null)

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-28">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#a855f7] uppercase mb-4">
            <span className="w-8 h-px bg-[#a855f7]/40" /> Best Shots
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05] mb-4">
            A wall of our favorite frames.
          </h2>
          <p className="text-white/55 text-sm sm:text-base font-light">
            Some of the strongest single shots across every kind of work we do. Drag the wall around, or click a frame to see the full story.
          </p>
        </div>

        <DraggableCardContainer className="relative flex h-[640px] sm:h-[720px] w-full items-center justify-center overflow-visible">
          {/* Sits underneath the cards in the stacking order — as they get
              dragged out of the way, this reveals itself naturally instead
              of needing its own drag-tracking state. */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
            <div className="text-center max-w-xs pointer-events-auto">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4 block">
                Clear The Wall
              </span>
              <p className="text-white/35 text-lg font-light leading-relaxed mb-6">
                Every frame here is a real project. Yours could be next.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm font-semibold hover:bg-[#a855f7] hover:border-[#a855f7] transition-colors duration-300"
              >
                Start Your Project
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {shots.map((s) => (
            <DraggableCardBody
              key={s.industry.id}
              className={`absolute ${s.position} ${s.rotate} !min-h-0 !w-56 sm:!w-64 !bg-ink !p-3 border border-white/10`}
              onClick={() => setExpanded(s)}
            >
              <img
                src={s.image}
                alt={s.industry.label}
                className="pointer-events-none relative z-10 h-48 sm:h-56 w-full rounded object-cover"
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-white">{s.industry.label}</h3>
                  <p className="truncate text-xs text-white/40 font-mono">{s.industry.stat}</p>
                </div>
                <s.industry.icon className="w-4 h-4 shrink-0" style={{ color: s.industry.accent }} />
              </div>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </div>

      {/* Expanded look */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setExpanded(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-ink shadow-[0_0_80px_rgba(0,0,0,0.6)]"
            >
              <button
                onClick={() => setExpanded(null)}
                aria-label="Close"
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-t-3xl">
                <img src={expanded.image} alt={expanded.industry.label} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div
                  className="absolute top-5 left-5 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border text-white/80"
                  style={{ borderColor: `${expanded.industry.accent}40` }}
                >
                  {expanded.industry.stat}
                </div>
              </div>

              <div className="p-6 sm:p-10">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-5">{expanded.industry.label}</h2>
                <p className="text-white/60 font-light leading-relaxed mb-8 max-w-2xl">{expanded.industry.description}</p>

                <Link
                  href={`/portfolio/${expanded.industry.slug}`}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#a855f7] hover:text-white transition-colors duration-300 w-max"
                >
                  Explore {expanded.industry.label} work
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
