'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Play, Clapperboard, MonitorPlay, Film, ArrowUpRight } from 'lucide-react'

const BASE_IMAGES = [
  { title: 'Brand Campaign', category: 'Commercial', src: '/images/portfolio-brand.png', icon: Clapperboard },
  { title: 'Social Series', category: 'Social Media', src: '/images/portfolio-social.png', icon: MonitorPlay },
  { title: 'Product Launch', category: 'Production', src: '/images/portfolio-production.png', icon: Film },
  { title: 'Live Event', category: 'Event Coverage', src: '/images/portfolio-event.png', icon: Play },
]

const TOTAL_IMAGES = Array.from({ length: 20 }, (_, i) => ({
  ...BASE_IMAGES[i % BASE_IMAGES.length],
  id: i,
}))

const IntroAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const FlipCard = ({ project, index }: { project: typeof TOTAL_IMAGES[0]; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const Icon = project.icon

  return (
    <motion.div
      className="relative w-full aspect-[4/5] cursor-pointer group"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
    >
      <motion.div
        className="w-full h-full relative transition-transform duration-700 ease-[0.23,1,0.32,1]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden border border-white/5 bg-[#030305]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={project.src}
            alt={project.title}
            fill
            className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-2">
            <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.3em] uppercase">
              {project.category}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden border border-[#00AEEF]/20 bg-[#030305] flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,174,239,0.1)_0%,transparent_70%)]" />
          
          <Icon className="w-12 h-12 text-[#00AEEF] mb-6 opacity-80" />
          
          <h3 className="text-xl font-bold text-white mb-2 text-center">{project.title}</h3>
          <p className="text-sm text-[#8E96AA] text-center mb-6 max-w-[200px]">
            High-end cinematic production tailored for modern distribution.
          </p>

          <button className="flex items-center gap-2 text-xs font-mono text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors z-10 relative">
            VIEW PROJECT <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)
  
  return (
    <section ref={containerRef} className="relative bg-[#030305] py-32 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <IntroAnimation>
          <div className="mb-24 md:mb-32 max-w-3xl">
            <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-6">
              // Selected Work
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
              Cinematic reality,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8E96AA]">
                expertly captured.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-[#8E96AA] font-light max-w-xl">
              A curated selection of our finest productions. From high-octane commercial campaigns to immersive live event coverage.
            </p>
          </div>
        </IntroAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TOTAL_IMAGES.map((project, i) => (
            <FlipCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
      
      {/* Cinematic background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AEEF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  )
}
