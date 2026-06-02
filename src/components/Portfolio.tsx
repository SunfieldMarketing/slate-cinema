'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ArrowRight, Eye, TrendingUp, Share2, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────────────────────────────────────────────────────────────────────

interface Project {
  title: string
  category: string
  image: string
  client: string
  year: string
  duration: string
  metrics: {
    views: string
    engagement: string
    shares: string
    retention: string
  }
  description: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: 'Apex Campaign',
    category: 'Brand Film',
    image: '/images/portfolio-production.png',
    client: 'Apex Athletics',
    year: '2024',
    duration: '2:34',
    metrics: { views: '12.4M', engagement: '9.2%', shares: '84K', retention: '78%' },
    description:
      'A cinematic brand film that redefined Apex Athletics\' digital presence. Shot across 4 locations with a crew of 18, this campaign drove a 340% increase in brand awareness.',
    tags: ['Brand Identity', 'Multi-Platform', 'Campaign'],
  },
  {
    title: 'Social Series',
    category: 'Content',
    image: '/images/portfolio-social.png',
    client: 'Lifestyle Co',
    year: '2024',
    duration: '0:30–0:60',
    metrics: { views: '28.1M', engagement: '11.4%', shares: '210K', retention: '85%' },
    description:
      'A 12-part social-first content series engineered for scroll-stopping performance. Each piece tested and optimized in real-time.',
    tags: ['Social-First', 'Series', 'Short-Form'],
  },
  {
    title: 'Brand Identity',
    category: 'Commercial',
    image: '/images/portfolio-brand.png',
    client: 'Luxe Brands',
    year: '2023',
    duration: '1:00',
    metrics: { views: '8.7M', engagement: '7.8%', shares: '45K', retention: '72%' },
    description:
      'High-end commercial production for a luxury brand launch. Directed with cinematic precision across 3 international locations.',
    tags: ['Luxury', 'Commercial', 'International'],
  },
  {
    title: 'Live Event',
    category: 'Event Coverage',
    image: '/images/portfolio-event.png',
    client: 'American Dream',
    year: '2024',
    duration: '4:12',
    metrics: { views: '5.2M', engagement: '6.3%', shares: '32K', retention: '65%' },
    description:
      'Full-scale event coverage capturing the energy and atmosphere of a sold-out venue. Real-time editing delivered within 24 hours.',
    tags: ['Live', 'Event', 'Real-Time'],
  },
  {
    title: 'Product Launch',
    category: 'Campaign',
    image: '/images/portfolio-production.png',
    client: 'Tech Brand',
    year: '2024',
    duration: '1:30',
    metrics: { views: '19.6M', engagement: '13.1%', shares: '156K', retention: '89%' },
    description:
      'A product launch campaign that broke the internet. Combining 3D animation with live-action footage for a seamless premium feel.',
    tags: ['Product', 'Viral', '3D Integration'],
  },
  {
    title: 'Culture Film',
    category: 'Documentary',
    image: '/images/portfolio-brand.png',
    client: 'Community Org',
    year: '2023',
    duration: '8:45',
    metrics: { views: '3.1M', engagement: '14.2%', shares: '78K', retention: '91%' },
    description:
      'A deeply personal documentary piece exploring culture and community. Winner of 2 regional film festival awards.',
    tags: ['Documentary', 'Award-Winning', 'Cultural'],
  },
]

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ value, isVisible }: { value: string; isVisible: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !ref.current) return
    hasAnimated.current = true

    // Parse numeric portion
    const raw = value.replace(/[^0-9.]/g, '')
    const suffix = value.replace(/[0-9.]/g, '')
    const target = parseFloat(raw)
    const isDecimal = raw.includes('.')
    const decimals = isDecimal ? (raw.split('.')[1]?.length ?? 1) : 0

    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      delay: 0.3,
      onUpdate() {
        if (ref.current) {
          ref.current.textContent = obj.val.toFixed(decimals) + suffix
        }
      },
      onComplete() {
        if (ref.current) ref.current.textContent = value
      },
    })
  }, [isVisible, value])

  return <span ref={ref}>0</span>
}

// ─── Metric Box ───────────────────────────────────────────────────────────────

const metricIcons = {
  Views: Eye,
  Engagement: TrendingUp,
  Shares: Share2,
  Retention: Clock,
}

function MetricBox({
  label,
  value,
  isVisible,
  delay,
}: {
  label: keyof typeof metricIcons
  value: string
  isVisible: boolean
  delay: number
}) {
  const Icon = metricIcons[label]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-2 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-[#00AEEF]/70">
        <Icon size={13} strokeWidth={1.5} />
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">
        <AnimatedCounter value={value} isVisible={isVisible} />
      </div>
    </motion.div>
  )
}

// ─── Expanded Modal ───────────────────────────────────────────────────────────

function ExpandedModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [metricsVisible, setMetricsVisible] = useState(false)

  // Show metrics after modal is open
  useEffect(() => {
    const t = setTimeout(() => setMetricsVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      {/* Panel */}
      <motion.div
        className="relative w-full md:w-[92vw] max-w-6xl bg-[#0a0a0f] border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '92vh' }}
        initial={{ y: '100%', scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="md:hidden absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/20 z-10" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
        >
          <X size={18} />
        </button>

        {/* Layout: image left (60%) + details right (40%) */}
        <div className="flex flex-col md:flex-row h-full" style={{ minHeight: 0 }}>

          {/* ── Left: Image ────────────────────────────────────────── */}
          <div className="relative flex-shrink-0 w-full md:w-[60%] h-56 md:h-auto overflow-hidden">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0a0a0f]" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0f] hidden md:block" />

            {/* Index label */}
            <div className="absolute top-5 left-5 font-mono text-[10px] text-[#00AEEF]/60 tracking-[0.3em]">
              {String(projects.indexOf(project) + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </div>
          </div>

          {/* ── Right: Details ─────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-7 pt-8 pb-10 md:pl-0 md:pr-10 md:pt-12 flex flex-col gap-6">

            {/* Meta row */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <span className="font-mono text-[9px] text-[#00AEEF] tracking-[0.3em] uppercase px-3 py-1.5 border border-[#00AEEF]/30 rounded-full bg-[#00AEEF]/5">
                {project.category}
              </span>
              <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">
                {project.year}
              </span>
              <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">
                {project.duration}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              {project.title}
            </motion.h3>

            {/* Client */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <span className="text-white/30 text-xs font-mono tracking-widest uppercase">Client</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-white/60 text-sm">{project.client}</span>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-white/55 text-sm leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
            >
              {project.description}
            </motion.p>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono tracking-widest uppercase text-white/40 border border-white/10 rounded-full px-3 py-1 bg-white/[0.03]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div
              className="h-px bg-gradient-to-r from-[#00AEEF]/20 via-white/10 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />

            {/* Metrics 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
              <MetricBox label="Views" value={project.metrics.views} isVisible={metricsVisible} delay={0} />
              <MetricBox label="Engagement" value={project.metrics.engagement} isVisible={metricsVisible} delay={0.1} />
              <MetricBox label="Shares" value={project.metrics.shares} isVisible={metricsVisible} delay={0.2} />
              <MetricBox label="Retention" value={project.metrics.retention} isVisible={metricsVisible} delay={0.3} />
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Portfolio Card ───────────────────────────────────────────────────────────

function PortfolioCard({
  project,
  index,
  onClick,
}: {
  project: Project
  index: number
  onClick: () => void
}) {
  return (
    <div
      className="portfolio-card flex-shrink-0 relative group cursor-pointer"
      style={{
        width: 'clamp(320px, 35vw, 480px)',
        height: '70vh',
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(e.currentTarget, {
          rotateY: x * 10,
          rotateX: -y * 6,
          duration: 0.3,
          ease: 'power2.out',
        })
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.55,
          ease: 'power3.out',
        })
      }}
    >
      {/* Card inner */}
      <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/[0.06] transition-all duration-500 group-hover:border-[#00AEEF]/25 group-hover:shadow-[0_0_50px_rgba(0,174,239,0.12)]">

        {/* Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
        />

        {/* Gradient overlay — always present */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent" />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundSize: '200px',
        }} />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-[#00AEEF]/10 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-[#00AEEF]/50 flex items-center justify-center">
              <Play size={22} className="text-[#00AEEF] ml-1" fill="rgba(0,174,239,0.8)" />
            </div>
          </div>
        </div>

        {/* Glow border (inner) */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 60px rgba(0,174,239,0.06)' }}
        />

        {/* Index */}
        <div className="absolute top-5 left-5 font-mono text-[9px] text-white/30 tracking-[0.3em]">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col gap-1">
          <span className="font-mono text-[9px] text-[#00AEEF] tracking-[0.35em] uppercase mb-1 block">
            {project.category}
          </span>
          <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 mt-3 text-white/40 text-[11px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Click to expand</span>
            <ArrowRight size={10} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Portfolio Section ────────────────────────────────────────────────────────

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const handleClose = useCallback(() => setExpandedCard(null), [])

  useGSAP(
    () => {
      if (!trackRef.current || !sectionRef.current) return

      const track = trackRef.current
      const section = sectionRef.current

      // Calculate how far to scroll horizontally
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth)

      // Heading entrance
      gsap.fromTo(
        '.portfolio-heading',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      )

      // Cards stagger in from 3D rotation
      gsap.fromTo(
        '.portfolio-card',
        { rotateY: 30, scale: 0.82, opacity: 0 },
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 15%',
            scrub: 1,
          },
        }
      )

      // Pin + horizontal scroll
      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + window.innerWidth * 0.4}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <>
      {/* ── Section ──────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        id="portfolio"
        className="relative w-full h-screen bg-[#030305] overflow-hidden"
        style={{ perspective: '1400px' }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00AEEF] opacity-[0.025] rounded-full blur-[120px]" />
        </div>

        {/* Section header */}
        <div className="portfolio-heading absolute top-14 left-8 md:left-16 z-20 pointer-events-none">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.45em] uppercase block mb-3">
            // Featured Work
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
            Our Portfolio
          </h2>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex items-center gap-6 md:gap-8 pl-8 md:pl-16 pr-[45vw]"
          style={{
            paddingTop: 'clamp(120px, 18vh, 180px)',
            paddingBottom: '4vh',
            transformStyle: 'preserve-3d',
          }}
        >
          {projects.map((project, i) => (
            <PortfolioCard
              key={i}
              project={project}
              index={i}
              onClick={() => setExpandedCard(i)}
            />
          ))}
        </div>

        {/* Left edge fade */}
        <div className="absolute top-0 bottom-0 left-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-[#030305] to-transparent" />
        {/* Right edge fade */}
        <div className="absolute top-0 bottom-0 right-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-[#030305] to-transparent" />

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 md:right-16 z-20 flex items-center gap-3 text-white/25 select-none">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Drag to explore</span>
          <ArrowRight size={12} />
        </div>

        {/* Progress line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06] z-20" />
      </section>

      {/* ── Expanded Modal ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {expandedCard !== null && (
          <ExpandedModal
            key={expandedCard}
            project={projects[expandedCard]}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}
