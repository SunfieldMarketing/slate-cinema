'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const projects = [
  { title: "Summer Campaign", category: "Social Campaign", platform: "TikTok/IG", src: "/images/portfolio-production.png" },
  { title: "Origin Story", category: "Brand Film", platform: "Website/YT", src: "/images/portfolio-brand.png" },
  { title: "Tech Launch", category: "Product Video", platform: "Multi-channel", src: "/images/portfolio-social.png" },
  { title: "Gala 2025", category: "Event Recap", platform: "LinkedIn/IG", src: "/images/portfolio-event.png" },
  { title: "The Vision", category: "Founder Story", platform: "Website", src: "/images/portfolio-production.png" },
  { title: "Ad Creative", category: "Paid Ad", platform: "Meta/TikTok", src: "/images/portfolio-brand.png" },
]

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const track = trackRef.current
    if (!track) return

    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 100),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 100}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col justify-center">
      
      <div className="absolute top-20 left-6 md:left-12 z-20">
        <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-4">Our Work</p>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
          Portfolio Built for <span className="text-[#00AEEF]">Attention</span>
        </h2>
        <p className="text-[#8E96AA] max-w-xl text-lg">
          Campaigns, reels, brand films, and social-first edits that make audiences stop scrolling.
        </p>
      </div>

      <div className="w-full mt-28 relative z-10 flex items-center overflow-visible pl-6 md:pl-12">
        <div ref={trackRef} className="flex gap-8 w-max items-center">
          
          {projects.map((proj, i) => (
            <div key={i} className="relative group shrink-0 w-[80vw] sm:w-[45vw] lg:w-[30vw] aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06] transition-all duration-700 hover:-translate-y-4 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,174,239,0.12)]">
              {/* Image */}
              <img 
                src={proj.src} 
                alt={proj.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300 group/btn">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white group-hover/btn:border-l-black border-b-[10px] border-b-transparent ml-1 transition-colors" />
                </button>
              </div>

              {/* Meta */}
              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="flex gap-3 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  <span className="text-[10px] font-mono tracking-[0.15em] px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm text-white uppercase">{proj.category}</span>
                  <span className="text-[10px] font-mono tracking-[0.15em] px-3 py-1.5 bg-[#00AEEF]/20 text-[#00AEEF] rounded-full backdrop-blur-sm uppercase">{proj.platform}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{proj.title}</h3>
              </div>
            </div>
          ))}

        </div>
      </div>
      
    </section>
  )
}
