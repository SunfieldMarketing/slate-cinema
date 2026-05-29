'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const projects = [
  { title: "Summer Campaign", category: "Social Campaign", platform: "TikTok/IG", src: "/placeholder.jpg" },
  { title: "Origin Story", category: "Brand Film", platform: "Website/YT", src: "/placeholder.jpg" },
  { title: "Tech Launch", category: "Product Video", platform: "Multi-channel", src: "/placeholder.jpg" },
  { title: "Gala 2025", category: "Event Recap", platform: "LinkedIn/IG", src: "/placeholder.jpg" },
  { title: "The Vision", category: "Founder Story", platform: "Website", src: "/placeholder.jpg" },
]

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Horizontal scroll timeline
    gsap.to(trackRef.current, {
      xPercent: -100,
      x: () => window.innerWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col justify-center">
      
      <div className="absolute top-24 left-6 md:left-12 z-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
          Portfolio Built for <span className="text-[#00AEEF]">Attention</span>
        </h2>
        <p className="text-[#8E96AA] max-w-xl text-lg">
          Explore campaigns, reels, brand films, event content, and social-first edits created to make audiences stop scrolling.
        </p>
      </div>

      <div className="w-full mt-20 relative z-10 flex items-center overflow-visible pl-6 md:pl-12">
        <div ref={trackRef} className="flex gap-8 w-max h-[60vh] items-center">
          
          {projects.map((proj, i) => (
            <div key={i} className="relative group shrink-0 w-[80vw] sm:w-[40vw] max-w-[500px] aspect-[4/5] md:aspect-video rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,174,239,0.15)] border border-white/5">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${proj.src})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-current border-b-[8px] border-b-transparent ml-1" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex gap-3 mb-3">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest px-2 py-1 bg-white/10 rounded backdrop-blur-sm text-white uppercase">{proj.category}</span>
                  <span className="text-[10px] md:text-xs font-mono tracking-widest px-2 py-1 bg-[#00AEEF]/20 text-[#00AEEF] rounded backdrop-blur-sm uppercase">{proj.platform}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{proj.title}</h3>
              </div>
            </div>
          ))}

        </div>
      </div>
      
    </section>
  )
}
