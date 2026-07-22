'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star, Quote, Play } from 'lucide-react'
import { MagicCard } from '@/components/ui/magic-card'
import { industries } from '@/lib/industries'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  rating: number
}

// Three real Google reviews, curated per the client's own instruction —
// no need for six, and every one of these is a genuine review.
const testimonials: Testimonial[] = [
  {
    quote: "The attention to detail is better than anyone we've ever worked with! I would highly recommend using Slate for any and all media. We've been working hand-in-hand with Slate for 6+ years now — I would never go back to using anyone else!",
    name: 'Dan Jennings',
    role: 'Local Guide',
    company: 'Google Review',
    rating: 5,
  },
  {
    quote: "Slate Cinema is hands-down one of the best video production companies in Brooklyn. They took our ideas and turned them into stunning, high-quality content that perfectly captured our brand. The team is creative, professional, and easy to work with from start to finish.",
    name: 'Sara Greenberg',
    role: 'Client',
    company: 'Google Review',
    rating: 5,
  },
  {
    quote: "Jake created an amazing promotional video for my organization and I couldn't be happier with the result. He was professional, creative, and really understood the message we wanted to share. The final product was polished, engaging, and better than I imagined.",
    name: 'Chana W',
    role: 'Local Guide',
    company: 'Google Review',
    rating: 5,
  },
]

// Pull whichever industry currently has real video testimonials wired up
// (only the flagship industry does today) rather than hardcoding a slug —
// stays correct regardless of which industry that ends up being.
const videoTestimonials = industries.find((i) => i.videoTestimonials?.length)?.videoTestimonials?.slice(0, 2) ?? []

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5" fill={i < n ? '#00AEEF' : 'transparent'} stroke={i < n ? '#00AEEF' : 'rgba(255,255,255,0.25)'} strokeWidth={1.5} />
      ))}
    </div>
  )
}

function VideoCard({ t }: { t: NonNullable<typeof videoTestimonials>[number] }) {
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
    <button
      type="button"
      onClick={toggle}
      className="rv-card group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] aspect-video w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
      aria-label={playing ? `Pause testimonial from ${t.name}` : `Play testimonial from ${t.name}`}
    >
      {t.poster && <img src={t.poster} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />}
      <video
        ref={videoRef}
        src={t.video}
        poster={t.poster}
        muted
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
        className={`absolute inset-0 w-full h-full object-cover ${playing ? '' : 'opacity-0'}`}
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-500 ${playing ? 'opacity-0' : 'opacity-100'}`} />
      {!playing && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-14 h-14 rounded-full backdrop-blur-md border border-[#00AEEF]/60 bg-[rgba(5,7,12,0.55)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </span>
        </span>
      )}
      {!playing && (
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="text-white font-semibold text-sm">{t.name}</div>
          <div className="text-white/50 text-xs">{t.role} · {t.company}</div>
        </div>
      )}
    </button>
  )
}

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rv-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      gsap.fromTo('.rv-card', { scale: 0.9, opacity: 0 }, {
        scale: 1, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.rv-grid', start: 'top 90%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center py-24 md:py-28">

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="rv-head text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-5">
            <span className="w-8 h-px bg-[#00AEEF]/40" /> Client Feedback <span className="w-8 h-px bg-[#00AEEF]/40" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
            Trusted by leaders
            <br className="hidden sm:block" /> across industries
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 text-white/50 text-sm">
            <StarRow n={5} />
            <span className="font-mono">5.0/5 average · 44 Google reviews</span>
          </div>
        </div>

        {/* Video testimonials, when available — real face, real name */}
        {videoTestimonials.length > 0 && (
          <div className="rv-grid grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 max-w-3xl mx-auto">
            {videoTestimonials.map((t) => (
              <VideoCard key={t.name} t={t} />
            ))}
          </div>
        )}

        {/* Review cards — fixed, consistent sizing across all three */}
        <div className="rv-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <MagicCard
              key={i}
              className="rv-card rounded-2xl transition-transform duration-500 hover:-translate-y-1"
              gradientFrom="#00AEEF"
              gradientTo="#0369A1"
              gradientColor="#00AEEF"
              gradientOpacity={0.15}
              gradientSize={220}
            >
              <article className="relative z-10 flex flex-col h-full min-h-[280px] p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-7 h-7 text-[#00AEEF]/40" fill="currentColor" />
                  <StarRow n={t.rating} />
                </div>

                <p className="text-[15px] text-white/80 font-light leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-11 h-11 rounded-full border border-white/15 bg-[#00AEEF]/10 flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs font-bold text-[#00AEEF]">{initials(t.name)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{t.name}</div>
                    <div className="text-white/40 text-xs truncate">{t.role} · {t.company}</div>
                  </div>
                </div>
              </article>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}
