'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !videoRef.current) return

    const video = videoRef.current

    // Wait for video metadata to load to get the duration
    video.onloadedmetadata = () => {
      const duration = video.duration || 5 // fallback if duration isn't perfectly parsed

      const ctx = gsap.context(() => {
        
        // SCROLL ANIMATION (Apple-style Video Scrub)
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=400%', // Massive scroll distance for smooth scrubbing
            pin: true,
            scrub: 0.5, // Slight smooth delay for premium feel
          }
        })

        // Scrub the video
        scrollTl.fromTo(video, 
          { currentTime: 0 },
          { currentTime: duration, ease: 'none', duration: 1 }, 
          0
        )

      }, containerRef)
      return () => ctx.revert()
    }

    // Trigger metadata load if it's already cached
    if (video.readyState >= 1) {
      video.onloadedmetadata(new Event('loadedmetadata'))
    }

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#030305]">
      
      {/* The 3D Camera Video (First frame is the website UI) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          src="/videos/hero-camera.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Scroll indicator overlaid on top so users know to scroll */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-none">
        <span className="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">Scroll to explore</span>
        <div className="w-[1px] h-12 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-white/80 to-transparent animate-pulse" />
        </div>
      </div>
      
    </section>
  )
}
