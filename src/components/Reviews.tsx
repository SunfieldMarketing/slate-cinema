'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// --- DATA: Premium Professional Headshots (Verified Unsplash URLs) ---
const gridTestimonials = [
  { imgSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80', alt: 'Professional Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80', alt: 'Professional Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80', alt: 'Executive Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80', alt: 'Smiling Executive' },
  { imgSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', alt: 'Bearded Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&q=80', alt: 'Business Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80', alt: 'Man in blue shirt' },
  { imgSrc: 'https://images.unsplash.com/photo-1598550874175-4d0ef43ee90d?w=500&q=80', alt: 'Corporate Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80', alt: 'Older Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?w=500&q=80', alt: 'Young Executive' },
  { imgSrc: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500&q=80', alt: 'Man in suit' },
  { imgSrc: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80', alt: 'Smiling Professional' },
]

const carouselTestimonials = [
  {
    quote: "This platform revolutionized our data analysis process. The speed and accuracy are unparalleled. A must-have for any data-driven team.",
    name: "Priya Sharma",
    designation: "Data Scientist at QuantumLeap",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=80",
  },
  {
    quote: "The user interface is incredibly intuitive, which made the onboarding process for my team a breeze. We were up and running in hours, not days.",
    name: "Marcus Johnson",
    designation: "Head of Operations at Synergy Corp",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1000&q=80",
  },
  {
    quote: "Customer support is top-notch. They are responsive, knowledgeable, and genuinely invested in our success. It feels like a true partnership.",
    name: "Isabella Rossi",
    designation: "Client Success Manager at Horizon",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1000&q=80",
  },
  {
    quote: "I'm impressed by the constant stream of updates and new features. The development team is clearly passionate and listens to user feedback.",
    name: "Kenji Tanaka",
    designation: "Software Engineer at CodeCrafters",
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&q=80",
  },
  {
    quote: "The ROI was almost immediate. It streamlined our workflows so effectively that we cut project delivery times by nearly 30%.",
    name: "Fatima Al-Jamil",
    designation: "CFO at Apex Financial",
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&q=80",
  },
]

// Spread out to the edges (5-15% margins) AND add a few near the center text
// Spread out to the edges (5-15% margins) AND add a few near the center text
const imagePositions = [
  { top: '5%', left: '5%', className: 'hidden lg:block w-24 h-24 z-20', delay: '0s', duration: '5s' },
  { top: '15%', left: '20%', className: 'hidden md:block w-20 h-20 z-10', delay: '1s', duration: '6s' },
  { top: '25%', left: '10%', className: 'hidden lg:block w-16 h-16 z-30', delay: '2s', duration: '4.5s' }, 
  { top: '10%', right: '15%', className: 'hidden lg:block w-24 h-24 z-20', delay: '0.5s', duration: '5.5s' },
  { top: '25%', right: '5%', className: 'hidden md:block w-20 h-20 z-10', delay: '1.5s', duration: '6.5s' },
  { top: '45%', right: '10%', className: 'hidden lg:block w-28 h-28 z-20', delay: '2.5s', duration: '7s' },
  { top: '50%', right: '28%', className: 'hidden md:block w-16 h-16 z-30', delay: '0.8s', duration: '5s' }, 
  { bottom: '15%', left: '20%', className: 'hidden lg:block w-20 h-20 z-10', delay: '1.2s', duration: '4.8s' },
  { bottom: '25%', left: '35%', className: 'hidden md:block w-16 h-16 z-20', delay: '2.2s', duration: '5.8s' },
  { bottom: '20%', right: '25%', className: 'hidden md:block w-24 h-24 z-20', delay: '0.8s', duration: '6.2s' },
  { bottom: '10%', right: '10%', className: 'hidden lg:block w-24 h-24 z-10', delay: '1.8s', duration: '5.3s' },
  
  // Extra elements placed above and below the center text
  { top: '12%', left: '40%', className: 'hidden lg:block w-16 h-16 z-20', delay: '0.3s', duration: '4.2s' },
  { top: '18%', left: '60%', className: 'hidden md:block w-20 h-20 z-10', delay: '1.7s', duration: '5.1s' },
  { bottom: '10%', left: '45%', className: 'hidden lg:block w-20 h-20 z-20', delay: '1.1s', duration: '6.1s' },
  { bottom: '18%', left: '65%', className: 'hidden md:block w-16 h-16 z-10', delay: '2.1s', duration: '4.9s' },
  { top: '40%', left: '15%', className: 'hidden lg:block w-20 h-20 z-20', delay: '0.7s', duration: '5.7s' },
  { bottom: '40%', right: '15%', className: 'hidden md:block w-16 h-16 z-10', delay: '1.4s', duration: '6.3s' },
  { top: '5%', right: '45%', className: 'hidden lg:block w-16 h-16 z-30', delay: '0.2s', duration: '5.4s' },
  { bottom: '5%', right: '40%', className: 'hidden md:block w-24 h-24 z-20', delay: '1.9s', duration: '6.7s' },

  // Mobile fallback tighter positions
  { top: '10%', left: '5%', className: 'block md:hidden w-16 h-16 z-10', delay: '0s', duration: '5s' },
  { top: '12%', right: '5%', className: 'block md:hidden w-20 h-20 z-10', delay: '1s', duration: '6s' },
  { bottom: '15%', left: '10%', className: 'block md:hidden w-20 h-20 z-10', delay: '2s', duration: '5.5s' },
  { bottom: '20%', right: '5%', className: 'block md:hidden w-16 h-16 z-10', delay: '0.5s', duration: '4.5s' },
]

export default function Reviews() {
  const containerRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const handleNext = React.useCallback(() => {
    setActive((prev) => (prev + 1) % carouselTestimonials.length)
  }, [carouselTestimonials.length])

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + carouselTestimonials.length) % carouselTestimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(handleNext, 5000)
    return () => clearInterval(interval)
  }, [handleNext])

  const isActive = (index: number) => index === active
  const randomRotate = () => `${Math.floor(Math.random() * 16) - 8}deg`

  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    })

    // Parallax out Part 1 (different speeds for text vs images)
    tl.to('.review-grid-images', { y: -300, opacity: 0, duration: 1, ease: 'power2.inOut' }, 0)
    tl.to('.review-grid-text', { y: -150, opacity: 0, duration: 1, ease: 'power2.inOut' }, 0)
    tl.to('.bento-background', { opacity: 0, duration: 1, ease: 'power2.inOut' }, 0)

    // Parallax in Part 2
    tl.fromTo('.review-part-2', 
      { opacity: 0, y: 150, scale: 0.9, rotateX: -20 },
      { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1, ease: 'power2.out' },
      0.5
    )

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1000px' }}>
      
      {/* CSS Keyframes for smooth infinite floating without React re-render jumps */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-img {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-aurora {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}} />

      {/* Bento Grid Background + Aurora Lighting */}
      <div className="bento-background absolute inset-0 z-0 pointer-events-none w-full h-full">
        {/* Animated Aurora Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'float-aurora 20s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[#00AEEF]/10 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'float-aurora 25s ease-in-out infinite reverse' }} />
        
        {/* Subtle Bento Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/3 left-0 w-full h-px bg-white" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-white" />
          <div className="absolute top-0 left-1/3 w-px h-full bg-white" />
          <div className="absolute top-0 left-2/3 w-px h-full bg-white" />
        </div>
        
        {/* Center Vignette so text is readable */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,5,0.8)_80%)]" />
      </div>

      {/* Part 1: Grid */}
      <div className="review-part-1 absolute inset-0 flex items-center justify-center z-10 w-full h-full">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {/* Floating Images Container */}
          <div className="review-grid-images absolute inset-0 pointer-events-none w-full h-full">
            {imagePositions.map((pos, index) => {
              const testimonial = gridTestimonials[index % gridTestimonials.length]
              return (
                <div
                  key={index}
                  className={`absolute rounded-2xl shadow-[0_0_30px_rgba(0,174,239,0.2)] border border-white/10 overflow-hidden ${pos.className}`}
                  style={{ 
                    top: pos.top, 
                    left: pos.left,
                    right: pos.right,
                    bottom: pos.bottom,
                    animation: `float-img ${pos.duration} ease-in-out infinite`,
                    animationDelay: pos.delay
                  }}
                >
                   <img
                    src={testimonial.imgSrc}
                    alt={testimonial.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            })}
          </div>

          {/* Central Content */}
          <div className="review-grid-text relative z-20 flex flex-col items-center text-center px-4">
            <div className="mb-6 inline-block rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 px-4 py-2 text-xs font-mono tracking-widest text-[#00AEEF] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(0,174,239,0.2)]">
              Client Feedback
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 max-w-4xl drop-shadow-lg">
              Trusted by leaders
              <br />
              from various industries
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/60 mb-10 font-light">
              Learn why top professionals trust our solutions to complete their customer journeys and dominate their markets.
            </p>
          </div>
        </div>
      </div>

      {/* Part 2: Carousel */}
      <div className="review-part-2 absolute inset-0 flex items-center justify-center z-30 w-full h-full opacity-0 pointer-events-none">
        <div className="mx-auto max-w-sm px-4 md:max-w-6xl md:px-8 lg:px-12 w-full">
          <div className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-20 items-center pointer-events-auto">
            
            {/* Image Section */}
            <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full max-w-md">
                  <AnimatePresence>
                    {carouselTestimonials.map((testimonial, index) => (
                      <motion.div
                        key={testimonial.src}
                        initial={{ opacity: 0, scale: 0.9, y: 50, rotate: randomRotate() }}
                        animate={{
                          opacity: isActive(index) ? 1 : 0.5,
                          scale: isActive(index) ? 1 : 0.9,
                          y: isActive(index) ? 0 : 20,
                          zIndex: isActive(index) ? carouselTestimonials.length : carouselTestimonials.length - Math.abs(index - active),
                          rotate: isActive(index) ? '0deg' : randomRotate(),
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: -50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 origin-bottom"
                        style={{ perspective: '1000px' }}
                      >
                        <img
                          src={testimonial.src}
                          alt={testimonial.name}
                          draggable={false}
                          className="h-full w-full rounded-3xl object-cover shadow-[0_0_50px_rgba(0,174,239,0.15)] border border-white/10"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
            </div>

            {/* Text and Controls Section */}
            <div className="flex flex-col justify-center py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col justify-between"
                >
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                            {carouselTestimonials[active].name}
                        </h3>
                        <p className="text-sm font-mono tracking-widest text-[#00AEEF] uppercase mb-8">
                            {carouselTestimonials[active].designation}
                        </p>
                        <motion.p className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed italic">
                            "{carouselTestimonials[active].quote}"
                        </motion.p>
                    </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex gap-4 pt-12">
                <button
                  onClick={handlePrev}
                  className="group flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-[#00AEEF]/50"
                >
                  <ArrowLeft className="h-6 w-6 text-white transition-transform duration-300 group-hover:-translate-x-1" />
                </button>
                <button
                  onClick={handleNext}
                  className="group flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-[#00AEEF]/50"
                >
                  <ArrowRight className="h-6 w-6 text-white transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </section>
  )
}
