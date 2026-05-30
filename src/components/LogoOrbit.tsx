'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const reviews = [
  { name: 'Sarah Chen', role: 'CMO, TechVenture', text: 'Slate Cinema transformed our brand presence. The content they produced generated 3x our expected engagement and completely redefined our market positioning.' },
  { name: 'Marcus Rivera', role: 'Founder, Apex Fitness', text: 'Working with Slate felt like having an in-house production team. Every deliverable exceeded expectations, and their attention to detail is unmatched in the industry.' },
  { name: 'Emily Watson', role: 'VP Marketing, Luxe Co', text: 'The ROI on our video campaigns with Slate has been extraordinary. They understand both craft and conversion, making them the ultimate creative partner.' },
]

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Entrance animation on scroll
      gsap.fromTo('.test-content',
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 70%', end: 'top 30%', scrub: 1 }
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  const next = () => {
    gsap.to('.test-text', {
      opacity: 0, x: -50, duration: 0.3, onComplete: () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
        gsap.fromTo('.test-text', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' })
      }
    })
  }

  const prev = () => {
    gsap.to('.test-text', {
      opacity: 0, x: 50, duration: 0.3, onComplete: () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
        gsap.fromTo('.test-text', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' })
      }
    })
  }

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#030305] overflow-hidden flex items-center min-h-[80vh]">
      
      {/* Massive background quote mark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00AEEF]/5 pointer-events-none z-0">
        <Quote size={800} strokeWidth={0.5} />
      </div>

      <div className="test-content relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Info */}
        <div className="lg:col-span-4">
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">// Client Feedback</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
            Don&apos;t just take our word for it.
          </h2>
          
          <div className="flex gap-4">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00AEEF] hover:bg-[#00AEEF]/10 transition-all duration-300">
              <ArrowLeft size={20} />
            </button>
            <button onClick={next} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00AEEF] hover:bg-[#00AEEF]/10 transition-all duration-300">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Testimonial */}
        <div className="lg:col-span-8 relative">
          <div className="test-text bg-white/[0.02] border border-white/[0.05] p-8 md:p-16 rounded-3xl backdrop-blur-md relative overflow-hidden">
            
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00AEEF]/40 to-transparent" />
            
            <p className="text-2xl md:text-4xl font-medium text-white/90 leading-relaxed mb-12">
              "{reviews[currentIndex].text}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 flex items-center justify-center">
                <span className="text-lg font-bold text-[#00AEEF]">{reviews[currentIndex].name[0]}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{reviews[currentIndex].name}</p>
                <p className="text-sm text-[#00AEEF] font-mono mt-1 uppercase tracking-wider">{reviews[currentIndex].role}</p>
              </div>
            </div>

          </div>

          {/* Indicator dots */}
          <div className="absolute -bottom-8 right-0 flex gap-2">
            {reviews.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#00AEEF] w-6' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
