'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Eye, TrendingUp, Share2, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'Apex Athletics',
    category: 'Brand Film',
    image: '/images/portfolio-production.png',
    client: 'Apex Athletics',
    year: '2024',
    duration: '2:34',
    metrics: { views: '12.4M', engagement: '9.2%', shares: '84K', retention: '78%' },
    description: 'A cinematic brand film that redefined Apex Athletics\' digital presence. Shot across 4 locations with a crew of 18, this campaign drove a 340% increase in brand awareness.',
    tags: ['Brand Identity', 'Multi-Platform', 'Campaign'],
  },
  {
    title: 'Lifestyle Co',
    category: 'Social Series',
    image: '/images/portfolio-social.png',
    client: 'Lifestyle Co',
    year: '2024',
    duration: '0:30–0:60',
    metrics: { views: '28.1M', engagement: '11.4%', shares: '210K', retention: '85%' },
    description: 'A 12-part social-first content series engineered for scroll-stopping performance. Each piece tested and optimized in real-time.',
    tags: ['Social-First', 'Series', 'Short-Form'],
  },
  {
    title: 'Luxe Brands',
    category: 'Commercial',
    image: '/images/portfolio-brand.png',
    client: 'Luxe Brands',
    year: '2023',
    duration: '1:00',
    metrics: { views: '8.7M', engagement: '7.8%', shares: '45K', retention: '72%' },
    description: 'High-end commercial production for a luxury brand launch. Directed with cinematic precision across 3 international locations.',
    tags: ['Luxury', 'Commercial', 'International'],
  },
  {
    title: 'American Dream',
    category: 'Live Event',
    image: '/images/portfolio-event.png',
    client: 'American Dream',
    year: '2024',
    duration: '4:12',
    metrics: { views: '5.2M', engagement: '6.3%', shares: '32K', retention: '65%' },
    description: 'Full-scale event coverage capturing the energy and atmosphere of a sold-out venue. Real-time editing delivered within 24 hours.',
    tags: ['Live', 'Event', 'Real-Time'],
  },
]

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeProject, setActiveProject] = useState<number | null>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    
    gsap.fromTo('.portfolio-item', 
      { y: 100, opacity: 0, rotateX: 20 }, 
      { 
        y: 0, opacity: 1, rotateX: 0, 
        stagger: 0.1, 
        duration: 1, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      }
    )
  }, { scope: containerRef })

  // Lock body scroll when modal open
  useEffect(() => {
    if (activeProject !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activeProject])

  return (
    <section ref={containerRef} id="portfolio" className="relative w-full min-h-screen bg-[#030305] py-32 px-6 md:px-12 z-20">
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.45em] uppercase block mb-3">
            // Our Work
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
            Selected Projects
          </h2>
        </div>

        {/* CSS Grid for Immersive Masonry-style Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <div 
              key={i} 
              className={`portfolio-item relative group cursor-pointer rounded-2xl overflow-hidden border border-white/20 hover:border-[#00AEEF]/50 transition-all duration-500 bg-white/[0.02] ${i === 0 || i === 3 ? 'md:aspect-square' : 'md:aspect-[4/3] aspect-square'}`}
              onClick={() => setActiveProject(i)}
            >
              <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                {/* Top Section: Client / Stats */}
                <div className="flex justify-between items-start">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">{project.client} • {project.year}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                      <Eye size={12} className="text-[#00AEEF]" />
                      <span className="font-mono text-[10px] text-white font-bold">{project.metrics.views}</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                      <TrendingUp size={12} className="text-[#00AEEF]" />
                      <span className="font-mono text-[10px] text-white font-bold">{project.metrics.engagement}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Title */}
                <div>
                  <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.3em] uppercase mb-2 block translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {project.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 delay-100">
                <Play fill="white" size={24} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {activeProject !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setActiveProject(null)} />
            
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl h-full max-h-[85vh] bg-[#0A0A0F] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-[55%] relative h-64 md:h-full">
                <img src={projects[activeProject].image} alt="Project" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-20 h-20 rounded-full bg-[#00AEEF]/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,174,239,0.5)]">
                    <Play fill="white" size={32} className="ml-2 text-white" />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[45%] h-full overflow-y-auto p-8 md:p-12 flex flex-col">
                <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.3em] uppercase mb-4 px-3 py-1 border border-[#00AEEF]/30 rounded-full w-fit">
                  {projects[activeProject].category}
                </span>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {projects[activeProject].title}
                </h2>
                
                <p className="text-white/60 text-lg leading-relaxed mb-8 font-light">
                  {projects[activeProject].description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-[#00AEEF] mb-2">
                      <Eye size={14} /> <span className="font-mono text-[9px] uppercase tracking-widest">Views</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{projects[activeProject].metrics.views}</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <TrendingUp size={14} /> <span className="font-mono text-[9px] uppercase tracking-widest">Engagement</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{projects[activeProject].metrics.engagement}</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                      <Share2 size={14} /> <span className="font-mono text-[9px] uppercase tracking-widest">Shares</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{projects[activeProject].metrics.shares}</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-orange-400 mb-2">
                      <Clock size={14} /> <span className="font-mono text-[9px] uppercase tracking-widest">Retention</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{projects[activeProject].metrics.retention}</div>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {projects[activeProject].tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono tracking-widest text-white/40 uppercase bg-white/[0.05] px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
