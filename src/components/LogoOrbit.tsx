'use client'

import { useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedTestimonialGrid } from '@/components/ui/testimonial-2'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── Testimonial headshot data ─────────────────────────────────────────────────
const testimonialImgs = [
  { imgSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300', alt: 'Professional Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300', alt: 'Smiling Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300', alt: 'Professional Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300', alt: 'Smiling Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300', alt: 'Man in a suit' },
  { imgSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300', alt: 'Bearded Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=300', alt: 'Man in a blue shirt' },
  { imgSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300', alt: 'Older Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=300', alt: 'Woman with curly hair' },
  { imgSrc: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300', alt: 'Woman in an office' },
  { imgSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300', alt: 'Woman with glasses' },
  { imgSrc: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300', alt: 'Woman with a dog' },
]

// ─── Review carousel data ──────────────────────────────────────────────────────
const reviews = [
  {
    quote: "Slate Cinema transformed our brand presence. The content they produced generated 3x our expected engagement and completely redefined our market positioning.",
    name: "Sarah Chen",
    role: "CMO · TechVenture",
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  },
  {
    quote: "Working with Slate felt like having an in-house production team. Every deliverable exceeded expectations and their attention to detail is unmatched.",
    name: "Marcus Rivera",
    role: "Founder · Apex Fitness",
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop',
  },
  {
    quote: "The ROI on our video campaigns with Slate has been extraordinary. They understand both craft and conversion — making them the ultimate creative partner.",
    name: "Emily Watson",
    role: "VP Marketing · Luxe Co",
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
  },
  {
    quote: "The level of creativity and professionalism Slate brings is truly on another level. Our campaigns went viral multiple times under their direction.",
    name: "Kenji Tanaka",
    role: "Creative Director · Nova Studio",
    photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop',
  },
  {
    quote: "We cut our content production timeline by 60% while quadrupling output quality. Slate Cinema is the only agency we'll ever need.",
    name: "Fatima Al-Jamil",
    role: "CEO · Apex Financial",
    photo: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?q=80&w=300&auto=format&fit=crop',
  },
]

// ─── Client logos ──────────────────────────────────────────────────────────────
const clients = [
  { name: 'Meta',      logo: 'https://logo.clearbit.com/meta.com' },
  { name: 'Google',    logo: 'https://logo.clearbit.com/google.com' },
  { name: 'Nike',      logo: 'https://logo.clearbit.com/nike.com' },
  { name: 'Spotify',   logo: 'https://logo.clearbit.com/spotify.com' },
  { name: 'Amazon',    logo: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Apple',     logo: 'https://logo.clearbit.com/apple.com' },
  { name: 'Netflix',   logo: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Airbnb',    logo: 'https://logo.clearbit.com/airbnb.com' },
  { name: 'Shopify',   logo: 'https://logo.clearbit.com/shopify.com' },
  { name: 'Stripe',    logo: 'https://logo.clearbit.com/stripe.com' },
  { name: 'Figma',     logo: 'https://logo.clearbit.com/figma.com' },
  { name: 'Uber',      logo: 'https://logo.clearbit.com/uber.com' },
]

// ─── Review Carousel ───────────────────────────────────────────────────────────
function ReviewCarousel() {
  const [active, setActive] = useState(0)

  const next = useCallback(() => setActive(p => (p + 1) % reviews.length), [])
  const prev = useCallback(() => setActive(p => (p - 1 + reviews.length) % reviews.length), [])

  return (
    <div className="relative w-full max-w-4xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Photo stack */}
        <div className="relative h-72 md:h-80">
          <AnimatePresence>
            {reviews.map((r, i) => (
              <motion.div
                key={r.photo}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
                animate={{
                  opacity: i === active ? 1 : i === (active + 1) % reviews.length ? 0.25 : 0,
                  scale: i === active ? 1 : 0.9,
                  rotate: i === active ? 0 : ((i - active + reviews.length) % reviews.length) * 2,
                  zIndex: i === active ? reviews.length : reviews.length - Math.abs(i - active),
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={r.photo}
                  alt={r.name}
                  className="w-full h-full object-cover"
                  style={{
                    boxShadow: i === active ? '0 0 60px rgba(0,174,239,0.15)' : 'none',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/400x320/0B1428/00AEEF?text=${r.name.charAt(0)}`
                    e.currentTarget.onerror = null
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,3,5,0.5) 0%, transparent 50%)' }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Quote + controls */}
        <div className="flex flex-col">
          {/* Company badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35 }}
              className="mb-5"
            >
              <span className="inline-flex items-center gap-2 text-xs font-mono text-[#00AEEF] border border-[#00AEEF]/20 rounded-full px-3 py-1 bg-[#00AEEF]/5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />
                {reviews[active].role}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Quote — word-by-word reveal */}
          <div className="min-h-[130px] mb-8">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active}
                className="text-xl md:text-2xl font-light text-white/85 leading-relaxed tracking-tight"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {reviews[active].quote.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    variants={{
                      hidden: { opacity: 0, y: 14, rotateX: 90 },
                      visible: {
                        opacity: 1, y: 0, rotateX: 0,
                        transition: { duration: 0.45, delay: i * 0.035, ease: [0.22, 1, 0.36, 1] },
                      },
                      exit: { opacity: 0, y: -8, transition: { duration: 0.15, delay: i * 0.01 } },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Name + nav */}
          <div className="flex items-end justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-px bg-[#00AEEF]" />
                <p className="text-sm font-semibold text-white">{reviews[active].name}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2">
              <motion.button
                onClick={prev}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00AEEF]/40 transition-all duration-200"
              >
                <ArrowLeft size={16} />
              </motion.button>
              <motion.button
                onClick={next}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00AEEF]/40 transition-all duration-200"
              >
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="h-[3px] rounded-full transition-all duration-400"
                style={{
                  width: i === active ? 24 : 8,
                  background: i === active ? '#00AEEF' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Logo marquee ──────────────────────────────────────────────────────────────
function LogoMarquee() {
  return (
    <div className="w-full py-12 overflow-hidden border-t border-white/[0.05]">
      <p className="text-center font-mono text-[10px] text-white/25 tracking-[0.4em] uppercase mb-8">
        Trusted By Leading Brands
      </p>
      <div
        className="relative overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
      >
        <motion.div
          className="flex items-center gap-16 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center w-24 h-10">
              <img
                src={client.logo}
                alt={client.name}
                className="max-w-full max-h-full object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.35 }}
                title={client.name}
                onError={(e) => {
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    e.currentTarget.style.display = 'none'
                    parent.innerHTML += `<span style="color:rgba(255,255,255,0.3);font-size:12px;font-weight:600;letter-spacing:0.1em;font-family:monospace">${client.name}</span>`
                  }
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function LogoOrbit() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const pinnedRef  = useRef<HTMLDivElement>(null)
  const part1Ref   = useRef<HTMLDivElement>(null)
  const part2Ref   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // Pin the entire section
      ScrollTrigger.create({
        trigger:    wrapperRef.current,
        start:      'top top',
        end:        '+=200vh',
        pin:        pinnedRef.current,
        anticipatePin: 1,
      })

      // Part 1 (AnimatedTestimonialGrid): visible for first 100vh, then fades out
      gsap.to(part1Ref.current, {
        opacity: 0,
        pointerEvents: 'none',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top+=80vh top',
          end: 'top+=120vh top',
          scrub: 1,
        },
      })

      // Part 2 (ReviewCarousel): hidden initially, fades in during second 100vh
      gsap.fromTo(part2Ref.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top+=100vh top',
            end: 'top+=150vh top',
            scrub: 1,
          },
        }
      )
    }, wrapperRef)
    return () => ctx.revert()
  }, { scope: wrapperRef })

  return (
    // 300vh total — 200vh of pinned content
    <div ref={wrapperRef} style={{ height: '300vh' }}>
      <div
        ref={pinnedRef}
        className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,174,239,0.04) 0%, transparent 70%)' }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        {/* Part 1: AnimatedTestimonialGrid */}
        <div ref={part1Ref} className="absolute inset-0 z-10">
          <AnimatedTestimonialGrid
            testimonials={testimonialImgs}
            title={<>Don&apos;t just take<br />our word for it.</>}
            description="Trusted by brands that demand nothing less than excellence in every frame, every cut, every campaign."
            ctaText="Start Your Project"
            ctaHref="#quote"
          />
        </div>

        {/* Part 2: Review carousel + logo strip */}
        <div
          ref={part2Ref}
          className="absolute inset-0 z-20 opacity-0 pointer-events-none flex flex-col justify-center"
        >
          {/* Section label */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00AEEF]/20 bg-[#00AEEF]/5 px-4 py-1.5 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />
              <span className="font-mono text-xs text-[#00AEEF] tracking-[0.3em] uppercase">Client Testimonials</span>
            </div>
            <div className="flex justify-center gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="font-mono text-xs text-white/30 tracking-widest">5.0 · 44 Google Reviews</p>
          </div>

          <ReviewCarousel />

          {/* Client logos strip BELOW testimonials */}
          <LogoMarquee />
        </div>
      </div>
    </div>
  )
}
