'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// --- MOCK DATA ---
const testimonials = [
  {
    quote: "Slate Cinema didn't just deliver a video; they architected a completely new visual language for our brand. The ROI was immediate.",
    name: "Sarah Jenkins",
    role: "CMO, Apex Athletics",
    company: "Apex Athletics",
    // We use a simple CSS logo for the demo
    logoColor: "#00AEEF"
  },
  {
    quote: "The level of intentionality in every frame is unmatched. They understand how to engineer attention in a saturated market.",
    name: "Marcus Thorne",
    role: "Director of Brand, Luxe",
    company: "Luxe Brands",
    logoColor: "#A78BFA"
  },
  {
    quote: "We've worked with top agencies globally, but Slate's process and final output sits in a category of its own.",
    name: "Elena Rostova",
    role: "VP Marketing, TechFlow",
    company: "TechFlow",
    logoColor: "#34D399"
  },
  {
    quote: "Flawless execution from pre-production to the final cut. They are an extension of our own team now.",
    name: "David Chen",
    role: "Founder, Lifestyle Co",
    company: "Lifestyle Co",
    logoColor: "#FBBF24"
  }
]

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  // Auto-play the carousel slowly
  useEffect(() => {
    const timer = setInterval(goNext, 8000)
    return () => clearInterval(timer)
  }, [])

  useGSAP(() => {
    if (!containerRef.current) return

    // Pin the entire section to create a fluid scroll lock experience
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 1,
      anticipatePin: 1
    })

    // Animate elements entering the pinned section
    gsap.fromTo('.test-header', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    )

    gsap.fromTo('.test-carousel', 
      { opacity: 0, scale: 0.95, rotateX: 10 }, 
      { opacity: 1, scale: 1, rotateX: 0, duration: 1.2, delay: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
        }
      }
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col justify-center py-20" style={{ perspective: '1200px' }}>
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#00AEEF]/5 rounded-full blur-[120px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12">
        
        {/* Header */}
        <div className="test-header text-center mb-16">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.45em] uppercase block mb-4">
            // Client Feedback
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none mb-6">
            The Verdict
          </h2>
        </div>

        {/* Carousel Area */}
        <div className="test-carousel relative bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 md:p-16 backdrop-blur-xl shadow-2xl overflow-hidden">
          
          {/* Large Quote watermark */}
          <div className="absolute top-8 left-8 text-white/[0.03]">
            <Quote size={120} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24 min-h-[300px]">
            
            {/* Left: The Quote */}
            <div className="flex-1 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col h-full justify-center"
                >
                  <p className="text-2xl md:text-4xl font-light text-white leading-relaxed tracking-tight mb-10">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-white/50 font-mono tracking-widest uppercase">{testimonials[currentIndex].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Company Logo & Controls */}
            <div className="w-full md:w-[30%] flex flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-40 w-40 mb-8"
                >
                  {/* Mock Company Logo (Since we don't have real assets, we draw a dynamic SVG based on the company) */}
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-xl" style={{ backgroundColor: testimonials[currentIndex].logoColor + '15' }}>
                    <div className="w-12 h-12 rounded-full mix-blend-screen" style={{ backgroundColor: testimonials[currentIndex].logoColor }} />
                  </div>
                  <span className="font-bold text-white tracking-widest uppercase text-sm">
                    {testimonials[currentIndex].company}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex gap-4">
                <button 
                  onClick={goPrev}
                  className="group relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center overflow-hidden hover:border-white/50 transition-colors"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                  <ArrowLeft size={18} className="text-white relative z-10" />
                </button>
                <button 
                  onClick={goNext}
                  className="group relative w-12 h-12 rounded-full border border-[#00AEEF]/50 bg-[#00AEEF]/10 flex items-center justify-center overflow-hidden hover:bg-[#00AEEF]/20 transition-colors"
                >
                  <div className="absolute inset-0 bg-[#00AEEF] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                  <ArrowRight size={18} className="text-[#00AEEF] group-hover:text-white transition-colors duration-300 relative z-10" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Infinite scrolling marquee at bottom */}
      <div className="absolute bottom-8 left-0 right-0 overflow-hidden opacity-[0.05] pointer-events-none select-none">
        <motion.div
          className="flex whitespace-nowrap text-[8rem] font-black tracking-tighter uppercase"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-16">
              {testimonials.map((t) => t.company).join(" • ")} •
            </span>
          ))}
        </motion.div>
      </div>

    </section>
  )
}
