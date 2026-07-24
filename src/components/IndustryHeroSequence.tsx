'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/*
  Apple-style scroll-scrubbed frame sequence used as the industry-page hero
  backdrop, in place of a looping video — same canvas/ImageBitmap approach as
  the homepage Hero, but scrubbed (not pinned) across the hero's own natural
  height so it doesn't add extra scroll length on every industry page.

  Currently a single shared placeholder clip (an exploded cinema-camera rig
  assembling itself) reused across every industry until real per-industry
  Higgs Field renders are commissioned — swap `basePath`/`frameCount` per
  industry once those exist.
*/
interface Props {
  basePath?: string
  frameCount?: number
  opacity?: number
}

export default function IndustryHeroSequence({
  basePath = '/videos/industry-frames/frame_',
  frameCount = 169,
  opacity = 0.55,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bitmapsRef = useRef<(ImageBitmap | null)[]>(Array(frameCount + 1).fill(null))
  const currentFrameRef = useRef(1)
  const renderRef = useRef<((index: number) => void) | null>(null)

  useEffect(() => {
    let cancelled = false
    const loadFrame = async (i: number) => {
      if (cancelled || bitmapsRef.current[i]) return
      try {
        const resp = await fetch(`${basePath}${i.toString().padStart(4, '0')}.jpg`)
        if (cancelled) return
        const blob = await resp.blob()
        if (cancelled) return
        const bmp = await createImageBitmap(blob)
        if (!cancelled) {
          bitmapsRef.current[i] = bmp
          // First-loaded frame won't have been painted yet — the initial
          // render attempt fires before this fetch resolves, so re-render
          // as soon as the bitmap the current playhead needs is ready.
          if (i === currentFrameRef.current) renderRef.current?.(i)
        }
      } catch {}
    }

    const BATCH_SIZE = 16
    const loadAll = async () => {
      const priority = []
      for (let i = 1; i <= Math.min(20, frameCount); i++) priority.push(loadFrame(i))
      await Promise.all(priority)
      for (let start = 21; start <= frameCount; start += BATCH_SIZE) {
        if (cancelled) break
        const batch = []
        for (let i = start; i < start + BATCH_SIZE && i <= frameCount; i++) batch.push(loadFrame(i))
        await Promise.all(batch)
      }
    }
    loadAll()
    return () => { cancelled = true }
  }, [basePath, frameCount])

  useGSAP(() => {
    if (!wrapRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = (index: number) => {
      currentFrameRef.current = index
      const bmp = bitmapsRef.current[Math.max(1, Math.min(frameCount, index))]
      if (!bmp) return
      const dpr = window.devicePixelRatio || 1
      const rect = wrapRef.current!.getBoundingClientRect()
      const pw = Math.round(rect.width * dpr)
      const ph = Math.round(rect.height * dpr)
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }
      const scale = Math.max(pw / bmp.width, ph / bmp.height)
      const dx = (pw - bmp.width * scale) / 2
      const dy = (ph - bmp.height * scale) / 2
      ctx.drawImage(bmp, dx, dy, bmp.width * scale, bmp.height * scale)
    }
    renderRef.current = renderFrame

    const playhead = { frame: 1 }
    renderFrame(1)

    const ctxScope = gsap.context(() => {
      gsap.to(playhead, {
        frame: frameCount,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
          onUpdate: () => renderFrame(Math.round(playhead.frame)),
        },
      })
    }, wrapRef)

    return () => { ctxScope.revert(); renderRef.current = null }
  }, { scope: wrapRef })

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 overflow-hidden bg-ink">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity }} />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink" />
    </div>
  )
}
