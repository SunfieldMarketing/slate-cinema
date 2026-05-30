'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Play, X, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { title: 'Apex Campaign', category: 'Brand Film', image: '/images/portfolio-production.png' },
  { title: 'Social Series', category: 'Content', image: '/images/portfolio-social.png' },
  { title: 'Brand Identity', category: 'Commercial', image: '/images/portfolio-brand.png' },
  { title: 'Live Event', category: 'Event Coverage', image: '/images/portfolio-event.png' },
  { title: 'Product Launch', category: 'Campaign', image: '/images/portfolio-production.png' },
  { title: 'Culture Film', category: 'Documentary', image: '/images/portfolio-brand.png' },
  { title: 'Viral Content', category: 'Social', image: '/images/portfolio-social.png' },
  { title: 'Flagship Spot', category: 'Commercial', image: '/images/portfolio-event.png' },
]

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  useGSAP(() => {
    if (!trackRef.current || !containerRef.current) return

    const track = trackRef.current
    const totalScroll = track.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      // Pin and horizontal scroll the gallery
      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${totalScroll + window.innerWidth * 0.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      })

      // Heading entrance
      gsap.fromTo('.portfolio-heading',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 }
        }
      )

      // Cards stagger in with 3D
      gsap.fromTo('.portfolio-card',
        { rotateY: 25, scale: 0.85, opacity: 0 },
        {
          rotateY: 0, scale: 1, opacity: 1,
          stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 60%', end: 'top 10%', scrub: 1 }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  const handleCardClick = (index: number) => {
    setExpandedCard(index)
  }

  const handleClose = () => {
    setExpandedCard(null)
  }

  return (
    <>
      <section ref={containerRef} id="portfolio" className="relative w-full h-screen bg-[#030305] overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.04)_0%,transparent_70%)]" />

        {/* Fixed heading */}
        <div className="portfolio-heading absolute top-16 left-8 md:left-16 z-20">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-3">// Featured Campaigns</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Our Work
          </h2>
          <p className="text-white/40 mt-4 max-w-md text-sm leading-relaxed">
            Scroll to explore our curated portfolio of cinematic productions, brand campaigns, and visual storytelling.
          </p>
        </div>

        {/* Horizontal Track */}
        <div ref={trackRef} className="absolute top-0 left-0 h-full flex items-center gap-8 pl-8 md:pl-16 pt-40 pb-16 pr-[50vw]" style={{ perspective: '1200px' }}>
          {projects.map((project, i) => (
            <div
              key={i}
              className="portfolio-card flex-shrink-0 relative group cursor-pointer"
              style={{
                width: 'clamp(280px, 30vw, 420px)',
                height: 'clamp(350px, 50vh, 520px)',
                transformStyle: 'preserve-3d',
              }}
              onClick={() => handleCardClick(i)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = (e.clientX - rect.left) / rect.width - 0.5
                const y = (e.clientY - rect.top) / rect.height - 0.5
                gsap.to(e.currentTarget, { rotateY: x * 12, rotateX: -y * 8, duration: 0.3, ease: 'power2.out' })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' })
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/30 to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#00AEEF]/20 backdrop-blur-md border border-[#00AEEF]/40 flex items-center justify-center">
                    <Play size={24} className="text-[#00AEEF] ml-1" />
                  </div>
                </div>

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-[#00AEEF]/0 group-hover:border-[#00AEEF]/30 transition-colors duration-500" />

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="font-mono text-[9px] text-[#00AEEF] tracking-[0.3em] uppercase block mb-2">{project.category}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{project.title}</h3>
                  <div className="flex items-center gap-2 mt-3 text-white/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View Project</span> <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 z-20 flex items-center gap-3 text-white/30">
          <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
          <ArrowRight size={14} />
        </div>

        {/* Edge fades */}
        <div className="absolute top-0 bottom-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#030305] to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#030305] to-transparent" />
      </section>

      {/* Expanded Card Modal */}
      {expandedCard !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg" onClick={handleClose}>
          <div className="relative w-[90vw] h-[80vh] max-w-5xl rounded-3xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
            <img
              src={projects[expandedCard].image}
              alt={projects[expandedCard].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12">
              <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.3em] uppercase block mb-3">{projects[expandedCard].category}</span>
              <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">{projects[expandedCard].title}</h3>
              <p className="text-white/50 max-w-lg">A cinematic production crafted with precision, storytelling mastery, and cutting-edge visual techniques.</p>
            </div>
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
