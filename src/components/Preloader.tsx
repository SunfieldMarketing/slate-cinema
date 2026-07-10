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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink text-[#F7F8FF]"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
      </div>
      
      <div ref={textRef} className="flex flex-col items-center gap-5 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
          <span className="font-mono text-[11px] text-red-500 tracking-[0.3em] font-bold">REC</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-gradient">SLATE CINEMA</h1>
        <div className="flex gap-4 text-xs font-mono text-[#8E96AA] tracking-widest uppercase">
          <span>Rolling Camera</span>
          <span className="text-[#00AEEF]">{String(progress).padStart(3, '0')}%</span>
        </div>
      </div>

      <div className="absolute bottom-1/4 w-64 h-[1px] bg-white/10 overflow-hidden">
        <div ref={lineRef} className="h-full w-0 bg-[#00AEEF] shadow-[0_0_10px_rgba(0,174,239,0.6)]"></div>
      </div>

      {/* Viewfinder corners — same camera-UI language as the Hero */}
      <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-white/20 pointer-events-none" />
      <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-white/20 pointer-events-none" />
    </div>
  )
}
