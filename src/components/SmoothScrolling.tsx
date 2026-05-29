'use client'

import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Update ScrollTrigger on Lenis scroll
    function update(time: number) {
      ScrollTrigger.update()
    }
    
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  )
}
