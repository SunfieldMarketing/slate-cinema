'use client'

import { ReactLenis } from '@studio-freight/react-lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { publishScroll, measureSections, registerLenis } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // Perfectly sync GSAP and Lenis requestAnimationFrame to prevent any scroll jitter
    function update(time: number) {
      const lenis = lenisRef.current?.lenis
      if (lenis) {
        registerLenis(lenis)
        if (process.env.NODE_ENV !== 'production') (window as unknown as Record<string, unknown>).__lenis = lenis
      }
      lenis?.raf(time * 1000)
      // Publish into the master scroll store every frame so the 3D scene,
      // timecode HUD and sections all read one source of truth. We use the
      // *native* scroll position as the authority (correct even for anchor
      // jumps, keyboard nav, and programmatic scrollTo that bypass Lenis'
      // internal value) and take only the smoothed velocity from Lenis.
      const scrollY = window.scrollY
      const limit = document.documentElement.scrollHeight - window.innerHeight
      publishScroll(scrollY, limit, lenis?.velocity ?? 0)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0) // Crucial for perfect sync

    // Section ranges depend on layout — re-measure once pinned sections have
    // reserved their scroll distance, and again on resize / refresh.
    const remeasure = () => measureSections()
    // Delay first measure until ScrollTrigger pins have expanded the document
    const t = setTimeout(remeasure, 100)
    ScrollTrigger.addEventListener('refresh', remeasure)
    window.addEventListener('resize', remeasure)

    return () => {
      gsap.ticker.remove(update)
      clearTimeout(t)
      ScrollTrigger.removeEventListener('refresh', remeasure)
      window.removeEventListener('resize', remeasure)
    }
  }, [])

  return (
    <ReactLenis ref={lenisRef} autoRaf={false} root options={{ lerp: 0.1, smoothWheel: true, syncTouch: true }}>
      {children as any}
    </ReactLenis>
  )
}
