'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Play, Star } from 'lucide-react'
import type { IndustryVideoTestimonial } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

function TestimonialCard({ t, accent }: { t: IndustryVideoTestimonial; accent: string }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) {
      v.pause()
      setPlaying(false)
    } else {
      v.muted = false
      v.play()
      setPlaying(true)
    }
  }

  return (
    <div className="vt-card group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] flex flex-col">
      <button
        type="button"
        onClick={toggle}
        className="relative aspect-video w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        aria-label={playing ? `Pause testimonial from ${t.name}` : `Play testimonial from ${t.name}`}
      >
        {t.poster && (
          <img src={t.poster} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
        )}
        <video
          ref={videoRef}
          src={t.video}
          poster={t.poster}
          muted
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${playing ? '' : 'opacity-0'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition-opacity duration-500 ${playing ? 'opacity-0' : 'opacity-100'}`} />
        {!playing && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className="w-14 h-14 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ borderColor: `${accent}66`, backgroundColor: 'rgba(5,7,12,0.55)' }}
            >
              <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
            </span>
          </span>
        )}
        {!playing && (
          <span
            className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1.5 rounded-full backdrop-blur-md border text-white/80"
            style={{ borderColor: `${accent}55`, backgroundColor: 'rgba(5,7,12,0.7)' }}
          >
            {t.company}
          </span>
        )}
      </button>

      <div className="p-5 flex flex-col grow">
        {/* The case study folded in: measurable outcome leads the card,
            the client's own words back it up. */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-xl font-bold tracking-tight" style={{ color: accent }}>{t.outcome}</div>
          <div className="flex items-center gap-1 shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5" fill={accent} stroke={accent} />
            ))}
          </div>
        </div>
        <p className="text-sm text-white/80 leading-relaxed mb-4 grow">&ldquo;{t.quote}&rdquo;</p>
        <div className="text-xs text-white/55">
          <span className="text-white font-semibold">{t.name}</span> · {t.role}, {t.company}
        </div>
      </div>
    </div>
  )
}

/*
  Three playable client testimonials — video proof beats text proof.
  Cards autoplay-nothing: a poster frame with a play button, sound-on
  playback only on explicit click.
*/
export default function IndustryVideoTestimonials({ testimonials, accent }: { testimonials: IndustryVideoTestimonial[]; accent: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.vt-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  if (!testimonials.length) return null

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>
            <span className="w-8 h-px" style={{ background: `${accent}66` }} /> The Work · Client Stories
            <span className="w-8 h-px" style={{ background: `${accent}66` }} />
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            Hear it from them, <span className="font-serif-accent italic text-white/60">not us.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  )
}
