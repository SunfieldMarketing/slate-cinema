'use client'

import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import clsx from 'clsx'

const pipelineData = [
  {
    id: 'pre',
    title: 'Pre-Production',
    subServices: [
      { name: 'Concepts', details: 'Scripts + Storyboards | Call Sheet + Schedules | Outlines + Shot Lists' },
      { name: 'Producing', details: 'Casting + Locations | Scouting + Hiring Crew | Logistics + Legal' }
    ],
    videoColor: 'from-[#0A0515] to-[#141235]'
  },
  {
    id: 'prod',
    title: 'Production',
    subServices: [
      { name: 'Crew', details: 'Directors | Camera Crew | Sound Crew' },
      { name: 'Talent', details: 'Actors/Child Actors | Musicians + Dancers | Animals' },
      { name: 'Set Design', details: 'Set Designers + Props | Hair + Makeup | Wardrobe' }
    ],
    videoColor: 'from-[#051515] to-[#0D252F]'
  },
  {
    id: 'post',
    title: 'Post-Production',
    subServices: [
      { name: 'Cut + Color', details: 'Obtain a clean edit at an affordable price' },
      { name: 'Sound Design', details: 'Bring your dream to life with realistic sound effects and intricate sound design' },
      { name: 'Motion Graphics', details: "When static images aren't enough, let motion tell your story through animated graphics" },
      { name: 'VFX', details: 'Create custom visual effects that turn your dreams into a reality' },
      { name: '2D + 3D', details: 'Create new worlds with our custom animation services' },
      { name: 'AI Services', details: 'From upscaling to image generation, inquire about our AI assisted editing models' }
    ],
    videoColor: 'from-[#15050A] to-[#2F0D15]'
  },
  {
    id: 'dist',
    title: 'Distribution',
    subServices: [
      { name: 'Social Media Marketing', details: 'Strategically structure your online presence with scheduled posts and account management' },
      { name: 'Ads Management', details: 'Run successful ad campaigns to drive sales and lead generation' },
      { name: 'OOH Advertising', details: 'Target your specific clientele with local OOH ads' }
    ],
    videoColor: 'from-[#151005] to-[#352512]'
  }
]

export default function Pipeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Pin section and scrub through categories
    const totalCategories = pipelineData.length
    
    gsap.to({}, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalCategories * 100}%`, // scroll distance
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // Calculate which category should be active based on scroll progress
          const progress = self.progress
          let newIndex = Math.floor(progress * totalCategories)
          if (newIndex >= totalCategories) newIndex = totalCategories - 1
          
          if (newIndex !== activeIndex) {
            handleSelect(newIndex)
          }
        }
      }
    })

    gsap.fromTo('.pipeline-header', 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: containerRef.current, start: 'top 70%' } }
    )
  }, { scope: containerRef, dependencies: [activeIndex] })

  const handleSelect = (index: number) => {
    if (activeIndex === index) return
    
    // Animate background color transition
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        opacity: 0.5,
        duration: 0.3,
        onComplete: () => {
          setActiveIndex(index)
          gsap.to(bgRef.current, { opacity: 1, duration: 0.5 })
        }
      })
    } else {
      setActiveIndex(index)
    }
  }

  return (
    <section 
      id="how-it-works" 
      ref={containerRef} 
      className="w-full min-h-screen relative flex items-center py-32 overflow-hidden"
    >
      {/* Dynamic Background Simulation for Video */}
      <div 
        ref={bgRef}
        className={clsx(
          "absolute inset-0 z-0 bg-gradient-to-br transition-all duration-1000",
          pipelineData[activeIndex].videoColor
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        {/* Fake video noise/texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        
        <div className="pipeline-header max-w-3xl mb-24">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">How It Works</h2>
          <p className="text-xl text-[#8E96AA] leading-relaxed">
            At Slate Cinema, our values shape our work. With integrity, creativity, and collaboration at our core, we deliver exceptional video production. Transparency, innovation, and teamwork drive us forward, ensuring every project exceeds expectations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Navigation */}
          <div className="flex flex-col gap-4 lg:w-1/3">
            {pipelineData.map((category, idx) => (
              <button
                key={category.id}
                onClick={() => handleSelect(idx)}
                className={clsx(
                  "text-left px-8 py-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden",
                  activeIndex === idx 
                    ? "bg-white/10 border-[#00AEEF] shadow-[0_0_30px_rgba(0,174,239,0.15)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                {activeIndex === idx && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00AEEF] shadow-[0_0_10px_#00AEEF]" />
                )}
                <h3 className={clsx(
                  "text-2xl font-bold tracking-wide transition-colors duration-300",
                  activeIndex === idx ? "text-white" : "text-white/50 group-hover:text-white"
                )}>
                  {category.title}
                </h3>
              </button>
            ))}
          </div>

          {/* Right Content Area (Interactive Display) */}
          <div className="lg:w-2/3 min-h-[500px]">
            {pipelineData.map((category, idx) => (
              <div 
                key={category.id}
                className={clsx(
                  "transition-all duration-700 absolute lg:relative w-full",
                  activeIndex === idx ? "opacity-100 translate-y-0 pointer-events-auto z-10" : "opacity-0 translate-y-12 pointer-events-none z-0"
                )}
              >
                <div className="grid gap-6">
                  {category.subServices.map((sub, i) => (
                    <div 
                      key={i} 
                      className="glass-panel rounded-xl p-8 group hover:bg-white/10 transition-colors duration-300 border border-white/5 hover:border-white/20"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00AEEF] transition-colors">{sub.name}</h4>
                          <p className="text-[#8E96AA] text-lg">{sub.details}</p>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 shrink-0 uppercase tracking-widest text-xs font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#00AEEF]" />
                          Watch Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
