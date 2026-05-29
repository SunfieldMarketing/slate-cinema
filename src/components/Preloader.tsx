'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('preloader_shown')) {
      setIsVisible(false)
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('preloader_shown', 'true')
        setIsVisible(false)
      }
    })

    // Simulate loading progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5
      if (currentProgress > 100) currentProgress = 100
      setProgress(currentProgress)
      if (currentProgress === 100) clearInterval(interval)
    }, 100)

    tl.to(lineRef.current, {
      width: '100%',
      duration: 1.5,
      ease: 'power3.inOut'
    })
    .to(textRef.current, {
      opacity: 0,
      duration: 0.3
    }, "-=0.3")
    .to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'expo.inOut'
    })

    return () => {
      clearInterval(interval)
      tl.kill()
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030305] text-[#F7F8FF]"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
      </div>
      
      <div ref={textRef} className="flex flex-col items-center gap-4 z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-gradient">SLATE CINEMA</h1>
        <div className="flex gap-4 text-xs font-mono text-[#8E96AA] tracking-widest uppercase">
          <span>LOADING CAMPAIGN ENGINE</span>
          <span>{progress}%</span>
        </div>
      </div>
      
      <div className="absolute bottom-1/4 w-64 h-[1px] bg-white/10 overflow-hidden">
        <div ref={lineRef} className="h-full w-0 bg-[#00AEEF]"></div>
      </div>
    </div>
  )
}
