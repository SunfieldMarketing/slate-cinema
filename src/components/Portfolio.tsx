'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Eye, TrendingUp, Share2, Clock, type LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Project {
  title: string
  category: string
  image: string
  client: string
  year: string
  duration: string
  metrics: { views: string; engagement: string; shares: string; retention: string }
  description: string
  tags: string[]
  size: 'large' | 'medium' | 'small'
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
    description: 'A cinematic brand film that redefined Apex Athletics\' digital presence. Shot across 4 locations with a crew of 18, this campaign drove a 340% increase in brand awareness.',
    tags: ['Brand Identity', 'Multi-Platform', 'Campaign'],
    size: 'large',
  },
  {
    title: 'Social Series',
    category: 'Content',
    image: '/images/portfolio-social.png',
    client: 'Lifestyle Co',
    year: '2024',
    duration: '0:30–1:00',
    metrics: { views: '28.1M', engagement: '11.4%', shares: '210K', retention: '85%' },
    description: 'A 12-part social-first content series engineered for scroll-stopping performance. Each piece tested and optimized in real-time across TikTok and Instagram.',
    tags: ['Social-First', 'Series', 'Short-Form'],
    size: 'medium',
  },
  {
    title: 'Brand Identity',
    category: 'Commercial',
    image: '/images/portfolio-brand.png',
    client: 'Luxe Brands',
    year: '2023',
    duration: '1:00',
    metrics: { views: '8.7M', engagement: '7.8%', shares: '45K', retention: '72%' },
    description: 'High-end commercial production for a luxury brand launch. Directed with cinematic precision across 3 international locations.',
    tags: ['Luxury', 'Commercial', 'International'],
    size: 'medium',
  },
  {
    title: 'Live Event',
    category: 'Event Coverage',
    image: '/images/portfolio-event.png',
    client: 'American Dream',
    year: '2024',
    duration: '4:12',
    metrics: { views: '5.2M', engagement: '6.3%', shares: '32K', retention: '65%' },
    description: 'Full-scale event coverage capturing the energy of a sold-out venue. Real-time editing and delivery within 24 hours of wrap.',
    tags: ['Live', 'Event', 'Real-Time'],
    size: 'small',
  },
  {
    title: 'Product Launch',
    category: 'Campaign',
    image: '/images/portfolio-production.png',
    client: 'Tech Brand',
    year: '2024',
    duration: '1:30',
    metrics: { views: '19.6M', engagement: '13.1%', shares: '156K', retention: '89%' },
    description: 'A viral product launch combining 3D animation with live-action for a seamless premium feel. Delivered across 6 platform formats.',
    tags: ['Product', 'Viral', '3D Integration'],
    size: 'large',
  },
  {
    title: 'Culture Film',
    category: 'Documentary',
    image: '/images/portfolio-brand.png',
    client: 'Community Org',
    year: '2023',
    duration: '8:45',
    metrics: { views: '3.1M', engagement: '14.2%', shares: '78K', retention: '91%' },
    description: 'A deeply personal documentary exploring culture and community. Winner of 2 regional film festival awards.',
    tags: ['Documentary', 'Award-Winning', 'Cultural'],
    size: 'small',
  },
]

// ─── Animated counter for expanded modal ───────────────────────────────────────
function Counter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const numericMatch = target.match(/[\d.]+/)
    if (!numericMatch || !ref.current) return
    const num = parseFloat(numericMatch[0])
    const rest = target.replace(numericMatch[0], '')
    const obj = { val: 0 }
    gsap.to(obj, {
      val: num,
      duration: 1.4,
      ease: 'power2.out',
      delay: 0.3,
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${obj.val < 10 ? obj.val.toFixed(1) : Math.floor(obj.val)}${rest}`
        }
      },
    })
    return () => gsap.killTweensOf(obj)
  }, [target])

  return <span ref={ref}>0{suffix}</span>
}

// ─── Metric box ───────────────────────────────────────────────────────────────
function MetricBox({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={13} className="text-[#00AEEF]" />
        <span className="font-mono text-[9px] text-white/35 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white leading-none">
        <Counter target={value} />
      </p>
    </div>
  )
}

// ─── Expanded modal ────────────────────────────────────────────────────────────
function ExpandedModal({ project, onClose }: { project: Project; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal card */}
      <motion.div
        className="relative z-10 w-full md:max-w-5xl bg-[#0a0f1e] rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row"
        style={{ maxHeight: '92vh', border: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ y: '100%', scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.95 }}
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200"
        >
          <X size={16} />
        </button>

        {/* Left — image */}
        <motion.div
          className="relative w-full md:w-[55%] h-56 md:h-auto shrink-0 overflow-hidden"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/800x600/0B1428/00AEEF?text=${project.title}`
              e.currentTarget.onerror = null
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(10,15,30,0.8))' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.7) 0%, transparent 40%)' }} />

          {/* Project index label */}
          <div className="absolute top-4 left-4 font-mono text-xs text-white/40 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
            {String(projects.indexOf(project) + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </div>
        </motion.div>

        {/* Right — details */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-5">

          {/* Meta row */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-mono text-[10px] text-[#00AEEF] border border-[#00AEEF]/25 rounded-full px-2.5 py-0.5 bg-[#00AEEF]/5">
              {project.category}
            </span>
            <span className="font-mono text-[10px] text-white/30">{project.year}</span>
            <span className="font-mono text-[10px] text-white/30">·</span>
            <span className="font-mono text-[10px] text-white/30">{project.duration}</span>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {project.title}
          </motion.h3>

          {/* Client */}
          <motion.p
            className="font-mono text-xs text-white/30 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Client: {project.client}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-white/65 text-sm leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            {project.description}
          </motion.p>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {project.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-mono text-white/45 border border-white/10 rounded-full px-3 py-1">
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: 'linear-gradient(to right, rgba(0,174,239,0.2), transparent)' }} />

          {/* Metrics 2×2 grid */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MetricBox icon={Eye}        label="Total Views"    value={project.metrics.views} />
            <MetricBox icon={TrendingUp} label="Engagement"     value={project.metrics.engagement} />
            <MetricBox icon={Share2}     label="Shares"         value={project.metrics.shares} />
            <MetricBox icon={Clock}      label="Retention Rate" value={project.metrics.retention} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Portfolio card ────────────────────────────────────────────────────────────
function PortfolioCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const heightMap = { large: 'h-[480px]', medium: 'h-[380px]', small: 'h-[300px]' }

  return (
    <motion.div
      className={`portfolio-card relative rounded-2xl overflow-hidden cursor-pointer group ${heightMap[project.size]}`}
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
    >
      {/* Image */}
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/600x400/0B1428/00AEEF?text=${project.title}`
          e.currentTarget.onerror = null
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to top, rgba(3,3,5,0.92) 0%, rgba(3,3,5,0.3) 50%, rgba(3,3,5,0.1) 100%)' }}
      />

      {/* Hover glow border */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
        style={{ boxShadow: '0 0 0 1px rgba(0,174,239,0.35) inset, 0 0 40px rgba(0,174,239,0.08) inset' }}
      />

      {/* Play button — center on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Play size={20} className="text-white ml-1" fill="white" />
        </div>
      </div>

      {/* Index number — top left */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-white/35 tracking-widest">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Category pill — top right */}
      <div className="absolute top-4 right-4 font-mono text-[9px] text-[#00AEEF]/80 bg-[#00AEEF]/10 border border-[#00AEEF]/20 rounded-full px-2.5 py-0.5 backdrop-blur-sm">
        {project.category}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-mono text-[10px] text-white/35 uppercase tracking-widest mb-1">{project.client} · {project.year}</p>
        <h3 className="text-lg font-bold text-white tracking-tight mb-3">{project.title}</h3>

        {/* Metrics preview row */}
        <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
          <span className="flex items-center gap-1"><Eye size={10} className="text-[#00AEEF]" /> {project.metrics.views}</span>
          <span className="flex items-center gap-1"><TrendingUp size={10} className="text-[#00AEEF]" /> {project.metrics.engagement}</span>
        </div>

        {/* Click to expand hint */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-3 h-px bg-[#00AEEF]" />
          <span className="font-mono text-[9px] text-[#00AEEF] tracking-[0.25em] uppercase">Tap to expand</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Portfolio section ────────────────────────────────────────────────────
export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const [expanded, setExpanded] = useState<Project | null>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo('.port-header',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'top 45%', scrub: 1 },
        }
      )

      // Cards stagger entrance
      gsap.fromTo('.portfolio-card',
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.portfolio-grid', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <>
      <section ref={sectionRef} className="relative w-full py-32 lg:py-44 bg-[#030305] overflow-hidden">

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-black text-white whitespace-nowrap" style={{ fontSize: 'clamp(5rem, 16vw, 14rem)', opacity: 0.015, letterSpacing: '-0.04em' }}>
            PORTFOLIO
          </span>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,174,239,0.04) 0%, transparent 70%)' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">

          {/* ── Header ────────────────────────────────────────────────────── */}
          <div className="port-header opacity-0 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#00AEEF]" />
                <span className="font-mono text-xs text-[#00AEEF] tracking-[0.4em] uppercase">// Featured Work</span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.0]">
                Our Portfolio.
              </h2>
            </div>
            <p className="text-white/40 max-w-xs text-sm leading-relaxed md:text-right">
              Click any project to see full details, metrics, and behind-the-scenes.
            </p>
          </div>

          {/* ── Masonry-style grid ───────────────────────────────────────── */}
          {/* Desktop: 3 columns. Mobile: 1 column */}
          <div className="portfolio-grid grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Column 1: large + small */}
            <div className="flex flex-col gap-4">
              <PortfolioCard project={projects[0]} index={0} onOpen={() => setExpanded(projects[0])} />
              <PortfolioCard project={projects[3]} index={3} onOpen={() => setExpanded(projects[3])} />
            </div>

            {/* Column 2: medium + medium */}
            <div className="flex flex-col gap-4">
              <PortfolioCard project={projects[1]} index={1} onOpen={() => setExpanded(projects[1])} />
              <PortfolioCard project={projects[2]} index={2} onOpen={() => setExpanded(projects[2])} />
            </div>

            {/* Column 3: large + small */}
            <div className="flex flex-col gap-4">
              <PortfolioCard project={projects[4]} index={4} onOpen={() => setExpanded(projects[4])} />
              <PortfolioCard project={projects[5]} index={5} onOpen={() => setExpanded(projects[5])} />
            </div>
          </div>

          {/* ── View all CTA ─────────────────────────────────────────────── */}
          <div className="flex justify-center mt-14">
            <a
              href="#quote"
              className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-medium text-white/70 hover:text-white hover:border-[#00AEEF]/40 hover:bg-[#00AEEF]/5 transition-all duration-300"
            >
              <span>Start Your Project</span>
              <div className="w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

        </div>
      </section>

      {/* ── Expanded Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <ExpandedModal project={expanded} onClose={() => setExpanded(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
