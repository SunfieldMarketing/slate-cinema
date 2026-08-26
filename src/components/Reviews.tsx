'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star, Quote, Play, Volume2 } from 'lucide-react'
import { MagicCard } from '@/components/ui/magic-card'
import { useSiteData } from '@/lib/site-data-context'
import type { HomePage } from '@/payload-types'
import type { IndustryVideoTestimonial } from '@/lib/normalize'
import { extractVimeoId } from '@/lib/vimeo'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  rating: number
}

// Fallback Google reviews (matches HomePage global's seeded defaults) —
// used only if the CMS reviews field is somehow empty. Real reviews as of
// 2026-08-17 (dates intentionally omitted per Kauan's instruction).
const fallbackTestimonials: Testimonial[] = [
  {
    quote: "Extremely creative agency with strong experience to back up their ideas. Takes the time to really understand client needs and puts in the effort to bring them to life.",
    name: 'Good Baklava',
    role: '8 reviews',
    company: 'Google Review',
    rating: 5,
  },
  {
    quote: "We've worked with Slate Cinema to create a professional video. Amazing experience! Their willingness and understanding to schedule around our availability to ensure that we're able to complete the project while still running a full operation was amazing. Having someone that understands what we're trying to capture and seamlessly works it all into the shoot was such a great feeling. Just 5 star experience all around.",
    name: 'Ben Kaller',
    role: 'Local Guide · 27 reviews',
    company: 'Google Review',
    rating: 5,
  },
  {
    quote: 'Amazingly talented. Professional. And artistic. Exactly what we needed for the job.',
    name: 'Lia Jay',
    role: 'Local Guide · 12 reviews',
    company: 'Google Review',
    rating: 5,
  },
]

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

/* Portrait "phone" video testimonial — filmed vertically like a real
   selfie-style client testimonial, framed as a mobile screen so it reads
   immediately as video proof rather than another text card. */
function PhoneVideoCard({ t }: { t: IndustryVideoTestimonial }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  // The clip itself (several MB) is only fetched once someone actually
  // presses play — no `src` in the JSX below means nothing loads while
  // this card just sits on screen showing its poster.
  const loadedRef = useRef(false)
  // See the matching comment in IndustryVideoTestimonials.tsx -- a Vimeo
  // iframe can't be driven by a <video> ref, so it gets its own
  // autoplay-on-mount branch below instead.
  const vimeoId = extractVimeoId(t.videoVimeoUrl)

  const toggle = () => {
    if (vimeoId) {
      setPlaying((p) => !p)
      return
    }
    const v = videoRef.current
    if (!v) return
    if (playing) {
      v.pause()
      setPlaying(false)
    } else {
      if (!loadedRef.current) {
        loadedRef.current = true
        v.src = t.video
      }
      v.muted = false
      v.play()
      setPlaying(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rv-video group relative w-[220px] sm:w-[240px] shrink-0 snap-center rounded-[2rem] border-[6px] border-white/10 bg-black overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 hover:border-[#00AEEF]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
      aria-label={playing ? `Pause testimonial from ${t.name}` : `Play testimonial from ${t.name}`}
    >
      <div className="relative aspect-[9/16] w-full">
        {t.poster && <img src={t.poster} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />}
        {vimeoId ? (
          playing && (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&title=0&byline=0&portrait=0`}
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={`Testimonial from ${t.name}`}
            />
          )
        ) : (
          <video
            ref={videoRef}
            poster={t.poster}
            muted
            playsInline
            preload="none"
            onEnded={() => setPlaying(false)}
            className={`absolute inset-0 w-full h-full object-cover ${playing ? '' : 'opacity-0'}`}
          />
        )}
        {/* phone notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black/70 z-10" />
        <div className={`absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-black/30 transition-opacity duration-500 ${playing ? 'opacity-40' : 'opacity-100'}`} />
        {!playing ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 rounded-full backdrop-blur-md border border-[#00AEEF]/60 bg-[rgba(5,7,12,0.55)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
            </span>
          </span>
        ) : (
          <span className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
            <Volume2 className="w-3.5 h-3.5 text-white" />
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {t.outcome && (
            <div className="text-sm font-bold mb-1" style={{ color: '#00AEEF' }}>{t.outcome}</div>
          )}
          <div className="text-white font-semibold text-sm">{t.name}</div>
          <div className="text-white/55 text-xs truncate">{t.role} · {t.company}</div>
        </div>
      </div>
    </button>
  )
}

export default function Reviews({ data }: { data?: HomePage['reviews'] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { industries } = useSiteData()

  const eyebrow = data?.eyebrow || 'Client Feedback'
  const headlineLine1 = data?.headlineLine1 || 'Trusted by leaders'
  const headlineLine2 = data?.headlineLine2 || 'across industries'
  const ratingText = data?.ratingText || '5.0/5 average · 44 Google reviews'
  const videoTestimonialsLabel = data?.videoTestimonialsLabel || 'Hear it from them, not us'
  const googleReviewsLabel = data?.googleReviewsLabel || 'From Google reviews'
  const testimonials: Testimonial[] = data?.testimonials?.length
    ? data.testimonials.map((t) => ({ quote: t.quote, name: t.name, role: t.role, company: t.company, rating: t.rating ?? 5 }))
    : fallbackTestimonials

  // Pull whichever industry currently has real video testimonials wired up
  // (only the flagship industry does today) rather than hardcoding a slug —
  // stays correct regardless of which industry that ends up being.
  const videoTestimonials = industries.find((i) => i.videoTestimonials?.length)?.videoTestimonials?.slice(0, 3) ?? []

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rv-head', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      gsap.fromTo('.rv-video', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.rv-video-row', start: 'top 88%', once: true },
      })
      gsap.fromTo('.rv-card', { scale: 0.9, opacity: 0 }, {
        scale: 1, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.rv-grid', start: 'top 90%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden flex flex-col justify-center py-20 md:py-24">

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="rv-head text-center mb-12 md:mb-14">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase mb-5">
            <span className="w-8 h-px bg-[#00AEEF]/40" /> <span data-cms-field="reviews.eyebrow">{eyebrow}</span> <span className="w-8 h-px bg-[#00AEEF]/40" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05]">
            <span data-cms-field="reviews.headlineLine1">{headlineLine1}</span>
            <br className="hidden sm:block" /> <span data-cms-field="reviews.headlineLine2">{headlineLine2}</span>
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 text-white/50 text-sm">
            <StarRow n={5} />
            <span data-cms-field="reviews.ratingText" className="font-mono">{ratingText}</span>
          </div>
        </div>

        {/* Video testimonials — DISABLED 2026-08-19 per Kauan ("for now
            remove the mobile phone video testimonial reviews on
            homepage"). The underlying data is also the fabricated trio
            flagged in the media audit (Priya Sharma/Marcus Webb/Elena
            Ruiz — invented people, still sitting in the "ai" industry's
            DB record; no DB write access this session to clear it at
            the source). Re-enable once real client video testimonials
            replace it: delete the `false &&` below. */}
        {false && videoTestimonials.length > 0 && (
          <div className="mb-14 md:mb-16">
            <div className="text-center mb-6">
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{videoTestimonialsLabel}</span>
            </div>
            <div className="rv-video-row flex justify-start sm:justify-center gap-5 overflow-x-auto snap-x snap-mandatory px-5 sm:px-0 -mx-5 sm:mx-0 pb-2">
              {videoTestimonials.map((t) => (
                <PhoneVideoCard key={t.name} t={t} />
              ))}
            </div>
          </div>
        )}

        {/* Google reviews */}
        <div className="text-center mb-6">
          <span data-cms-field="reviews.googleReviewsLabel" className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{googleReviewsLabel}</span>
        </div>
        <div className="rv-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <MagicCard
              key={i}
              className="rv-card rounded-2xl transition-transform duration-500 hover:-translate-y-1 h-full"
              gradientFrom="#00AEEF"
              gradientTo="#0369A1"
              gradientColor="#00AEEF"
              gradientOpacity={0.15}
              gradientSize={220}
            >
              <article className="relative z-10 flex flex-col h-full min-h-[260px] p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-7 h-7 text-[#00AEEF]/40" fill="currentColor" />
                  <StarRow n={t.rating} />
                </div>

                <p data-cms-field={`reviews.testimonials.${i}.quote`} className="text-[15px] text-white/80 font-light leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-11 h-11 rounded-full border border-white/15 bg-[#00AEEF]/10 flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs font-bold text-[#00AEEF]">{initials(t.name)}</span>
                  </div>
                  <div className="min-w-0">
                    <div data-cms-field={`reviews.testimonials.${i}.name`} className="text-white font-semibold text-sm truncate">{t.name}</div>
                    <div className="text-white/40 text-xs truncate"><span data-cms-field={`reviews.testimonials.${i}.role`}>{t.role}</span> · <span data-cms-field={`reviews.testimonials.${i}.company`}>{t.company}</span></div>
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
