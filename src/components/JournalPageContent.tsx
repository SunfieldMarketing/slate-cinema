'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AmbientBackdrop from '@/components/ui/AmbientBackdrop'
import PageHero from '@/components/ui/PageHero'
import { journalPosts } from '@/lib/journal'

gsap.registerPlugin(ScrollTrigger)

const JOURNAL_ACCENT = '#00AEEF'

function JournalGrid() {
  const ref = useRef<HTMLElement>(null)
  const categories = ['All', ...Array.from(new Set(journalPosts.map((p) => p.category)))]
  const [filter, setFilter] = useState('All')

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.jn-card', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.jn-grid', start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref, dependencies: [filter] })

  const visible = filter === 'All' ? journalPosts : journalPosts.filter((p) => p.category === filter)

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all duration-300 border ${
                filter === c
                  ? 'bg-[#00AEEF] text-black border-[#00AEEF]'
                  : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="jn-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p) => (
            <a
              key={p.slug}
              href={`/journal/${p.slug}`}
              className="jn-card group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/25 transition-colors duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span
                  className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15"
                  style={{ color: p.accent }}
                >
                  {p.category}
                </span>
              </div>
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-white/40 uppercase mb-3">
                  <span>{p.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span>{p.readTime}</span>
                </div>
                <h3 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-[#00AEEF] transition-colors">
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm font-light leading-relaxed line-clamp-3 flex-1">{p.excerpt}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  Read the piece
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function JournalPageContent() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      <AmbientBackdrop accent={JOURNAL_ACCENT} />

      <div className="relative z-10 w-full">
        <Nav />

        <PageHero
          eyebrow="The Slate Journal"
          title={['Notes on video,', 'storytelling & brand']}
          subtitle="Working notes from inside our own production process — what actually earns attention, what pre-production really covers, and what makes people watch to the end."
          accent={JOURNAL_ACCENT}
        />

        <JournalGrid />

        <Footer />
      </div>
    </main>
  )
}
