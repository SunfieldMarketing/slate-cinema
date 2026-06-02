'use client'

import { ReactLenis } from '@studio-freight/react-lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // Perfectly sync GSAP and Lenis requestAnimationFrame to prevent any scroll jitter
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0) // Crucial for perfect sync

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis ref={lenisRef} autoRaf={false} root options={{ lerp: 0.05, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  )
}
