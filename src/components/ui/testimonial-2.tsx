'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Testimonial {
  imgSrc: string
  alt: string
}

interface AnimatedTestimonialGridProps {
  testimonials: Testimonial[]
  title: React.ReactNode
  description: string
  ctaText: string
  ctaHref: string
}

// ─── Floating position map (12 positions around the center) ───────────────────
const positions = [
  { top: '6%',   left: '8%',   size: 72 },
  { top: '14%',  left: '26%',  size: 60 },
  { top: '4%',   left: '45%',  size: 56 },
  { top: '8%',   right: '22%', size: 68 },
  { top: '5%',   right: '6%',  size: 64 },
  { top: '40%',  right: '4%',  size: 72 },
  { bottom: '8%',  right: '8%',  size: 60 },
  { bottom: '12%', right: '26%', size: 56 },
  { bottom: '6%',  left: '44%', size: 64 },
  { bottom: '10%', left: '24%', size: 68 },
  { bottom: '5%',  left: '6%',  size: 72 },
  { top: '38%',  left: '4%',   size: 60 },
]

// ─── AnimatedTestimonialGrid ──────────────────────────────────────────────────
export function AnimatedTestimonialGrid({
  testimonials,
  title,
  description,
  ctaText,
  ctaHref,
}: AnimatedTestimonialGridProps) {
  const [active, setActive] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#030305] py-24">

      {/* Radial blue glow in center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,174,239,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating headshot images */}
      {testimonials.slice(0, positions.length).map((t, i) => {
        const pos = positions[i]
        const isHovered = hovered === i
        return (
          <motion.div
            key={i}
            className="absolute z-10 cursor-pointer"
            style={{
              top: pos.top,
              left: (pos as any).left,
              right: (pos as any).right,
              bottom: pos.bottom,
              width: pos.size,
              height: pos.size,
            }}
            animate={{
              y: [0, i % 2 === 0 ? -10 : -14, 0],
              rotate: [0, i % 3 === 0 ? 2 : -2, 0],
            }}
            transition={{
              duration: 4 + (i % 3) * 1.2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: i * 0.25,
            }}
            whileHover={{ scale: 1.12, zIndex: 30 }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
          >
            <div
              className="w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-300"
              style={{
                borderColor: isHovered ? 'rgba(0,174,239,0.6)' : 'rgba(255,255,255,0.08)',
                boxShadow: isHovered
                  ? '0 0 24px rgba(0,174,239,0.3), 0 8px 32px rgba(0,0,0,0.5)'
                  : '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <img
                src={t.imgSrc}
                alt={t.alt}
                className="w-full h-full object-cover"
                style={{ filter: isHovered ? 'none' : 'grayscale(30%) brightness(0.85)' }}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/${pos.size}x${pos.size}/0B1428/00AEEF?text=+`
                }}
              />
            </div>

            {/* Tooltip on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#00AEEF] px-2 py-1 rounded-full border border-[#00AEEF]/20"
                >
                  {t.alt}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Center content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00AEEF]/20 bg-[#00AEEF]/5 px-4 py-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />
          <span className="font-mono text-xs text-[#00AEEF] tracking-[0.3em] uppercase">Client Voices</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-5"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 leading-relaxed mb-8 text-base"
        >
          {description}
        </motion.p>

        {/* 5-star row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24" className="drop-shadow-sm">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
          </div>
          <span className="text-white/40 text-sm font-mono">5.0 · 44 verified reviews</span>
        </motion.div>

        <motion.a
          href={ctaHref}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="group inline-flex items-center gap-2 rounded-full bg-[#00AEEF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#00AEEF]/90 transition-colors duration-200"
          whileHover={{ scale: 1.04 }}
        >
          {ctaText}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-0.5 transition-transform">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
      </div>
    </div>
  )
}
