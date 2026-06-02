'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// --- Client logos using Clearbit Logo API ---
const clients = [
  { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' },
  { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
  { name: 'Nike', logo: 'https://logo.clearbit.com/nike.com' },
  { name: 'Spotify', logo: 'https://logo.clearbit.com/spotify.com' },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com' },
  { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Airbnb', logo: 'https://logo.clearbit.com/airbnb.com' },
  { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com' },
  { name: 'Shopify', logo: 'https://logo.clearbit.com/shopify.com' },
  { name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com' },
  { name: 'Figma', logo: 'https://logo.clearbit.com/figma.com' },
]

// --- Testimonials data with real photos ---
const testimonials = [
  {
    quote: "Slate Cinema transformed our brand presence. The content they produced generated 3x our expected engagement and completely redefined our market positioning.",
    name: "Sarah Chen",
    role: "CMO",
    company: "TechVenture",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote: "Working with Slate felt like having an in-house production team. Every deliverable exceeded expectations, and their attention to detail is unmatched in the industry.",
    name: "Marcus Rivera",
    role: "Founder",
    company: "Apex Fitness",
    src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote: "The ROI on our video campaigns with Slate has been extraordinary. They understand both craft and conversion, making them the ultimate creative partner.",
    name: "Emily Watson",
    role: "VP Marketing",
    company: "Luxe Co",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote: "The level of creativity and professionalism Slate brings is truly on another level. Our campaigns went viral multiple times under their direction.",
    name: "Kenji Tanaka",
    role: "Creative Director",
    company: "Nova Studio",
    src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote: "We cut our content production timeline by 60% while quadrupling output quality. Slate Cinema is the only agency we'll ever need.",
    name: "Fatima Al-Jamil",
    role: "CEO",
    company: "Apex Financial",
    src: "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?q=80&w=400&auto=format&fit=crop",
  },
]

// Floating logo positions for the hero grid
const logoPositions = [
  { top: '8%', left: '12%', className: 'hidden lg:block w-16 h-16' },
  { top: '18%', left: '32%', className: 'hidden md:block w-14 h-14' },
  { top: '6%', left: '52%', className: 'hidden md:block w-12 h-12' },
  { top: '12%', right: '18%', className: 'hidden lg:block w-20 h-20' },
  { top: '30%', right: '8%', className: 'hidden md:block w-14 h-14' },
  { top: '50%', right: '12%', className: 'hidden lg:block w-16 h-16' },
  { top: '52%', left: '6%', className: 'hidden md:block w-20 h-20' },
  { bottom: '15%', left: '22%', className: 'hidden lg:block w-14 h-14' },
  { bottom: '20%', left: '45%', className: 'hidden md:block w-12 h-12' },
  { bottom: '12%', right: '28%', className: 'hidden md:block w-16 h-16' },
  { bottom: '8%', right: '12%', className: 'hidden lg:block w-14 h-14' },
  // Mobile
  { top: '10%', left: '5%', className: 'block md:hidden w-12 h-12' },
  { top: '5%', right: '10%', className: 'block md:hidden w-14 h-14' },
  { bottom: '5%', left: '10%', className: 'block md:hidden w-14 h-14' },
  { bottom: '10%', right: '5%', className: 'block md:hidden w-12 h-12' },
]

// --- Animated Testimonials Component ---
function AnimatedTestimonials() {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 200 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  const numberX = useTransform(x, [-200, 200], [-20, 20])
  const numberY = useTransform(y, [-200, 200], [-10, 10])

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [])

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(handleNext, 6000)
    return () => clearInterval(timer)
  }, [handleNext])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set(e.clientX - (rect.left + rect.width / 2))
      mouseY.set(e.clientY - (rect.top + rect.height / 2))
    }
  }

  const isActive = (index: number) => index === active
  const randomRotate = (seed: number) => `${((seed * 7) % 16) - 8}deg`

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto px-6 py-20"
      onMouseMove={handleMouseMove}
    >
      {/* Oversized index number */}
      <motion.div
        className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 text-[16rem] md:text-[28rem] font-bold text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter"
        style={{ x: numberX, y: numberY }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {String(active + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Main content */}
      <div className="relative flex">
        {/* Left column - vertical label + progress */}
        <div className="hidden md:flex flex-col items-center justify-center pr-12 border-r border-white/[0.08]">
          <motion.span
            className="text-xs font-mono text-white/30 tracking-widest uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            Testimonials
          </motion.span>
          <div className="relative h-32 w-px bg-white/[0.08] mt-8">
            <motion.div
              className="absolute top-0 left-0 w-full bg-[#00AEEF] origin-top"
              animate={{ height: `${((active + 1) / testimonials.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Right - image + text */}
        <div className="flex-1 md:pl-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image stack */}
          <div className="relative h-72 md:h-96 w-full max-w-sm mx-auto">
            <AnimatePresence>
              {testimonials.map((t, index) => (
                <motion.div
                  key={t.src}
                  initial={{ opacity: 0, scale: 0.9, y: 50, rotate: randomRotate(index) }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.4,
                    scale: isActive(index) ? 1 : 0.88,
                    y: isActive(index) ? 0 : 24,
                    zIndex: isActive(index) ? testimonials.length : testimonials.length - Math.abs(index - active),
                    rotate: isActive(index) ? '0deg' : randomRotate(index * 3),
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: -50 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 origin-bottom"
                  style={{ perspective: '1000px' }}
                >
                  <img
                    src={t.src}
                    alt={t.name}
                    className="h-full w-full rounded-2xl object-cover"
                    style={{ boxShadow: isActive(index) ? '0 0 60px rgba(0,174,239,0.15)' : 'none' }}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/400x400/0B1428/00AEEF?text=${t.name.charAt(0)}`
                      e.currentTarget.onerror = null
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Text + controls */}
          <div className="flex flex-col justify-center">
            {/* Company badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 text-xs font-mono text-[#00AEEF] border border-[#00AEEF]/20 rounded-full px-3 py-1 bg-[#00AEEF]/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />
                  {testimonials[active].company}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Quote */}
            <div className="relative mb-10 min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={active}
                  className="text-xl md:text-2xl font-light text-white/85 leading-relaxed tracking-tight"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {testimonials[active].quote.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.25em]"
                      variants={{
                        hidden: { opacity: 0, y: 16, rotateX: 90 },
                        visible: {
                          opacity: 1, y: 0, rotateX: 0,
                          transition: { duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
                        },
                        exit: {
                          opacity: 0, y: -8,
                          transition: { duration: 0.2, delay: i * 0.015 },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Author + nav */}
            <div className="flex items-end justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    className="w-8 h-px bg-[#00AEEF]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ originX: 0 }}
                  />
                  <div>
                    <p className="text-base font-semibold text-white">{testimonials[active].name}</p>
                    <p className="text-sm text-white/40 font-mono">{testimonials[active].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handlePrev}
                  whileTap={{ scale: 0.92 }}
                  className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00AEEF]/50 hover:bg-[#00AEEF]/10 transition-all duration-300"
                >
                  <ArrowLeft size={18} />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  whileTap={{ scale: 0.92 }}
                  className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00AEEF]/50 hover:bg-[#00AEEF]/10 transition-all duration-300"
                >
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="absolute -bottom-16 left-0 right-0 overflow-hidden opacity-[0.04] pointer-events-none">
        <motion.div
          className="flex whitespace-nowrap text-5xl font-bold tracking-tight text-white"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8">
              {testimonials.map((t) => t.company).join(' • ')} •
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// --- Main Section ---
export default function LogoOrbit() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.logo-section-title',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'top 40%', scrub: 1 }
        }
      )
      gsap.fromTo('.floating-logo',
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 50%', scrub: 1 }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full bg-[#030305] overflow-hidden">

      {/* Part 1: Floating logos hero grid */}
      <div className="relative w-full max-w-7xl mx-auto py-32 sm:py-40 px-4 min-h-[600px] flex items-center justify-center">

        {/* Floating client logos positioned around the text */}
        {clients.slice(0, logoPositions.length).map((client, index) => (
          <motion.div
            key={index}
            className={`floating-logo absolute rounded-xl shadow-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm flex items-center justify-center p-2 overflow-hidden ${logoPositions[index].className}`}
            style={{
              top: logoPositions[index].top,
              left: logoPositions[index].left,
              right: logoPositions[index].right,
              bottom: logoPositions[index].bottom,
            }}
            whileHover={{ scale: 1.15, zIndex: 20, borderColor: 'rgba(0,174,239,0.4)' }}
            animate={{
              y: [0, (index % 2 === 0 ? -8 : -12), 0],
              transition: {
                duration: 4 + (index % 3),
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: index * 0.3,
              }
            }}
          >
            <img
              src={client.logo}
              alt={client.name}
              className="w-full h-full object-contain filter brightness-0 invert opacity-50 hover:opacity-100 transition-opacity duration-300"
              onError={(e) => {
                // Fallback to text if logo fails to load
                const parent = e.currentTarget.parentElement
                if (parent) {
                  parent.innerHTML = `<span class="text-white/40 font-bold text-xs tracking-wider">${client.name}</span>`
                }
              }}
            />
          </motion.div>
        ))}

        {/* Central content */}
        <div className="logo-section-title relative z-10 flex flex-col items-center text-center max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00AEEF]/20 bg-[#00AEEF]/5 px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />
            <span className="font-mono text-xs text-[#00AEEF] tracking-[0.3em] uppercase">Client Feedback</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
            Don&apos;t just take<br />our word for it.
          </h2>
          <p className="text-lg text-white/50 max-w-md leading-relaxed mb-8">
            Trusted by brands that demand nothing less than excellence in every frame.
          </p>

          {/* Google-style rating */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-white/50 text-sm font-mono">5.0 / 44 reviews</span>
          </div>

          <a
            href="#quote"
            className="inline-flex items-center gap-2 rounded-full bg-[#00AEEF] px-6 py-3 text-sm font-medium text-white hover:bg-[#00AEEF]/90 transition-colors duration-200"
          >
            Start Your Project
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-white/[0.05]" />

      {/* Part 2: Logo marquee strip */}
      <div className="w-full py-8 overflow-hidden bg-white/[0.01]">
        <div
          className="relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          <motion.div
            className="flex items-center gap-12 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center w-20 h-12 opacity-30 hover:opacity-70 transition-opacity duration-300">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain filter brightness-0 invert"
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML = `<span class="text-white/40 font-semibold text-sm tracking-wide">${client.name}</span>`
                    }
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-white/[0.05]" />

      {/* Part 3: Animated testimonials carousel */}
      <div className="relative w-full overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,174,239,0.04)_0%,transparent_70%)]" />

        <AnimatedTestimonials />
      </div>

    </section>
  )
}
