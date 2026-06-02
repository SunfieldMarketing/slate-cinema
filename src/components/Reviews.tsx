'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// --- DATA ---
const gridTestimonials = [
  { imgSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300', alt: 'Professional Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300', alt: 'Smiling Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300', alt: 'Professional Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300', alt: 'Smiling Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300', alt: 'Man in a suit' },
  { imgSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300', alt: 'Bearded Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=300', alt: 'Man in a blue shirt' },
  { imgSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300', alt: 'Older Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=300', alt: 'Woman with curly hair' },
  { imgSrc: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300', alt: 'Woman in an office' },
  { imgSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300', alt: 'Woman with glasses' },
  { imgSrc: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300', alt: 'Woman with a dog' },
]

const carouselTestimonials = [
  {
    quote: "This platform revolutionized our data analysis process. The speed and accuracy are unparalleled. A must-have for any data-driven team.",
    name: "Priya Sharma",
    designation: "Data Scientist at QuantumLeap",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "The user interface is incredibly intuitive, which made the onboarding process for my team a breeze. We were up and running in hours, not days.",
    name: "Marcus Johnson",
    designation: "Head of Operations at Synergy Corp",
    src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "Customer support is top-notch. They are responsive, knowledgeable, and genuinely invested in our success. It feels like a true partnership.",
    name: "Isabella Rossi",
    designation: "Client Success Manager at Horizon",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "I'm impressed by the constant stream of updates and new features. The development team is clearly passionate and listens to user feedback.",
    name: "Kenji Tanaka",
    designation: "Software Engineer at CodeCrafters",
    src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    quote: "The ROI was almost immediate. It streamlined our workflows so effectively that we cut project delivery times by nearly 30%.",
    name: "Fatima Al-Jamil",
    designation: "CFO at Apex Financial",
    src: "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
]

// --- PRE-DEFINED POSITIONS FOR THE IMAGES ---
const imagePositions = [
  { top: '5%', left: '15%', className: 'hidden lg:block w-24 h-24' },
  { top: '15%', left: '35%', className: 'hidden md:block w-20 h-20' },
  { top: '5%', left: '55%', className: 'hidden md:block w-16 h-16' },
  { top: '10%', right: '15%', className: 'hidden lg:block w-28 h-28' },
  { top: '25%', right: '5%', className: 'hidden md:block w-20 h-20' },
  { top: '45%', right: '10%', className: 'hidden lg:block w-24 h-24' },
  { top: '50%', left: '5%', className: 'hidden md:block w-28 h-28' },
  { bottom: '5%', left: '20%', className: 'hidden lg:block w-20 h-20' },
  { bottom: '15%', left: '45%', className: 'hidden md:block w-16 h-16' },
  { bottom: '10%', right: '30%', className: 'hidden md:block w-24 h-24' },
  { bottom: '2%', right: '15%', className: 'hidden lg:block w-20 h-20' },
  { top: '10%', left: '5%', className: 'block md:hidden w-16 h-16' },
  { top: '5%', right: '10%', className: 'block md:hidden w-20 h-20' },
  { bottom: '5%', left: '10%', className: 'block md:hidden w-20 h-20' },
  { bottom: '10%', right: '5%', className: 'block md:hidden w-16 h-16' },
]

export default function Reviews() {
  const containerRef = useRef<HTMLElement>(null)
  
  // Carousel State
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

    // Phase 1 (Grid) fades out and moves up
    tl.to('.review-part-1', {
      opacity: 0,
      y: -150,
      scale: 0.9,
      duration: 1,
      ease: 'power2.inOut'
    }, 0)

    // Phase 2 (Carousel) fades in and moves up
    tl.fromTo('.review-part-2', 
      { opacity: 0, y: 150, scale: 0.9, rotateX: -20 },
      { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1, ease: 'power2.out' },
      0.5
    )

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden" style={{ perspective: '1000px' }}>
      
      {/* Animated grid background */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes animate-grid {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animated-grid {
          width: 200%;
          height: 200%;
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 4rem 4rem;
          animation: animate-grid 40s linear infinite alternate;
        }
      `}} />
      <div className="animated-grid absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 z-0 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,5,1)_80%)] pointer-events-none" />

      {/* Part 1: Grid */}
      <div className="review-part-1 absolute inset-0 flex items-center justify-center z-10 w-full h-full">
        <div className="relative w-full max-w-7xl mx-auto h-full flex flex-col items-center justify-center px-4">
          
          {/* Floating Images */}
          {gridTestimonials.slice(0, imagePositions.length).map((testimonial, index) => (
            <motion.div
              key={index}
              className={`absolute rounded-2xl shadow-[0_0_30px_rgba(0,174,239,0.2)] border border-white/10 overflow-hidden ${imagePositions[index].className}`}
              style={{ 
                top: imagePositions[index].top, 
                left: imagePositions[index].left,
                right: imagePositions[index].right,
                bottom: imagePositions[index].bottom,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: [0, Math.random() * -15 - 5, 0],
                transition: { 
                  opacity: { duration: 1, delay: Math.random() * 0.5 },
                  scale: { type: 'spring', stiffness: 260, damping: 20, delay: Math.random() * 0.5 },
                  y: { duration: Math.random() * 4 + 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
                } 
              }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
            >
               <img
                src={testimonial.imgSrc}
                alt={testimonial.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 inline-block rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 px-4 py-2 text-xs font-mono tracking-widest text-[#00AEEF] uppercase backdrop-blur-md">
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
      <div className="review-part-2 absolute inset-0 flex items-center justify-center z-20 w-full h-full opacity-0 pointer-events-none">
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
