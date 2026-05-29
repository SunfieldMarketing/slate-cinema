'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { title: 'Brand Campaign', category: 'Commercial', img: '/images/portfolio-brand.png', aspect: 'wide' },
  { title: 'Social Series', category: 'Social Media', img: '/images/portfolio-social.png', aspect: 'tall' },
  { title: 'Product Launch', category: 'Production', img: '/images/portfolio-production.png', aspect: 'wide' },
  { title: 'Live Event', category: 'Event Coverage', img: '/images/portfolio-event.png', aspect: 'square' },
]

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.port-item')

      // Each item flies in from a different 3D angle on scroll
      items.forEach((item, i) => {
        const directions = [
          { x: -600, y: 200, z: -800, rotateY: 45, rotateX: -20 },
          { x: 600, y: -150, z: -600, rotateY: -45, rotateX: 15 },
          { x: -400, y: -300, z: -1000, rotateY: 30, rotateX: 25 },
          { x: 500, y: 300, z: -700, rotateY: -30, rotateX: -15 },
        ]
        const dir = directions[i % directions.length]

        gsap.fromTo(item,
          { x: dir.x, y: dir.y, z: dir.z, rotateY: dir.rotateY, rotateX: dir.rotateX, opacity: 0 },
          {
            x: 0, y: 0, z: 0, rotateY: 0, rotateX: 0, opacity: 1,
            duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              end: 'top 30%',
              scrub: 1,
            }
          }
        )
      })

      // Title entrance
      gsap.fromTo('.port-title',
        { y: 100, rotateX: -45, opacity: 0 },
        {
          y: 0, rotateX: 0, opacity: 1,
          scrollTrigger: { trigger: containerRef.current, start: 'top 70%', end: 'top 20%', scrub: 1 }
        }
      )

    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  // 3D tilt on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(e.currentTarget, {
      rotateY: x * 20,
      rotateX: -y * 20,
      duration: 0.3,
      ease: 'power2.out'
    })
    // Parallax inner layers
    const img = e.currentTarget.querySelector('.port-img') as HTMLElement
    const overlay = e.currentTarget.querySelector('.port-overlay') as HTMLElement
    if (img) gsap.to(img, { x: x * 20, y: y * 20, scale: 1.1, duration: 0.3 })
    if (overlay) gsap.to(overlay, { x: x * -10, y: y * -10, duration: 0.3 })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' })
    const img = e.currentTarget.querySelector('.port-img') as HTMLElement
    const overlay = e.currentTarget.querySelector('.port-overlay') as HTMLElement
    if (img) gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.5 })
    if (overlay) gsap.to(overlay, { x: 0, y: 0, duration: 0.5 })
  }

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#030305] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="port-title mb-20" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Selected Work</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">Portfolio</h2>
        </div>

        {/* Asymmetric masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" style={{ perspective: '1500px' }}>
          {projects.map((project, i) => {
            const spans = [
              'md:col-span-7 h-[400px] md:h-[500px]',
              'md:col-span-5 h-[400px] md:h-[500px]',
              'md:col-span-5 h-[350px] md:h-[450px]',
              'md:col-span-7 h-[350px] md:h-[450px]',
            ]
            return (
              <div
                key={i}
                className={`port-item ${spans[i]} group cursor-pointer rounded-xl overflow-hidden relative`}
                style={{ transformStyle: 'preserve-3d', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Image layer */}
                <div className="port-img absolute inset-0">
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                </div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content overlay - parallax layer */}
                <div className="port-overlay absolute inset-0 flex flex-col justify-end p-8" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}>
                  <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.3em] uppercase mb-2">{project.category}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.title}</h3>
                  
                  {/* Play button */}
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#00AEEF]/50 group-hover:bg-[#00AEEF]/10 transition-all duration-500">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                      <path d="M14 8L0 16V0L14 8Z" fill="white" fillOpacity="0.8" />
                    </svg>
                  </div>
                </div>

                {/* Top metadata bar */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'translateZ(20px)' }}>
                  <span className="font-mono text-[9px] text-white/30 tracking-widest">{project.title.toUpperCase().replace(/ /g, '_')}.MP4</span>
                  <span className="font-mono text-[9px] text-white/30">4K HDR</span>
                </div>

                {/* Aspect ratio frame corners on hover */}
                <div className="absolute inset-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ transform: 'translateZ(40px)' }}>
                  <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-[#00AEEF]/30" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-r border-t border-[#00AEEF]/30" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-l border-b border-[#00AEEF]/30" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-[#00AEEF]/30" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
