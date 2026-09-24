'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollState, toTimecode, scrollToY } from '@/lib/scroll'
import type { HomePage } from '@/payload-types'
import SmartVideo from '@/components/ui/SmartVideo'
import { useIsMobile, HERO_MOBILE_VIDEO, HERO_MOBILE_POSTER } from '@/lib/mobile-media'

// Real master reel, per the "CLAUDE INPUT 8/12 -- HOMEPAGE" doc note:
// "HERO: keep 'Video Marketing At Your Fingertips'. Visual: ... from the
// master reel vimeo.com/937380835." This is the low-opacity background
// depth layer behind the hero text, not the pinned canvas frame-sequence
// scrubber above it -- that's a separate, custom-built interaction this
// note isn't asking to touch.
const HERO_MASTER_REEL_VIMEO_ID = '937380835'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 291

// Mobile's own frame sequence -- "frame by frame like Apple's style," the
// same canvas-drawImage technique desktop uses, not a scrubbed <video>
// (video.currentTime seeking is asynchronous and can't guarantee a frame
// lands exactly when scroll says it should; a decoded ImageBitmap draws
// synchronously, zero latency, every tick). The reason mobile never had
// this already is memory: decoding all 291 full-res (1280x588) frames at
// once is ~870MB and is what actually crashed phones (see the loader
// effect below). This sidesteps that instead of reintroducing it -- every
// 5th frame (public/videos/frames-mobile/, extracted from the same
// hero-camera.mp4 the full sequence comes from), downscaled to 640x294.
// 59 frames x ~0.72MB decoded each = ~42MB peak, decoded eagerly with no
// windowing needed -- about 20x under the crash threshold, and well under
// even desktop's own windowed tablet cap (~162MB). getFocus() below still
// interpolates pan/zoom continuously off the exact scroll-driven frame
// index regardless of which of the 59 stills is actually on screen, so
// the camera movement stays smooth even though the photo underneath it
// only changes every 5 original frames.
const MOBILE_FRAME_COUNT = 59
const MOBILE_FRAME_STEP = 5
function mobileFrameSlot(index: number): number {
  return Math.max(0, Math.min(MOBILE_FRAME_COUNT - 1, Math.round(index / MOBILE_FRAME_STEP)))
}

// 2026-08-27: "keyframe it so main focus of video on mobile moves
// throughout or through timestamps of video so it can be fully zoomed
// into fit display area." Replaces the old scroll-tied zoom-blend (which
// sat at a flat full-contain fit for ~90% of the sequence -- the "loses
// immersion" complaint) with a per-FRAME pan+scale, hand-placed against
// the actual footage instead of guessed.
//
// Surveyed real frame content (frames 1, 60, 130, 150, 190, 230, 270,
// 290) to find where the subject actually sits in each shot:
//   frame 1:   the "SLATE CINEMA" screen-replica text, dead center --
//              this has to match Video 1's plain centered crop exactly,
//              or the crossfade between the two videos visibly jumps.
//   1 -> 130:  camera pulls back, the (still-legible, still text-
//              matched) screen drifts right across the frame as it does.
//   ~150:      the screen goes out of frame entirely -- subject becomes
//              the lens/G-badge, hard-left.
//   190 -> 290: settles into one static wide "hero" composition (the
//              source footage itself barely moves here), center-left.
// x/y are 0-1 fractions of how far the crop window has traveled across
// its available pan range (0 = leftmost/topmost, 1 = rightmost/bottom-
// most, 0.5 = centered -- see getFocus below). scale is a fraction of
// full cover-fit -- 1 is fully zoomed/filled with zero gap, lower values
// ease slightly toward contain (backdrop bleeds through at the edges,
// same mechanism the old zoom blend used) for a gentle pull-back on the
// final reveal. Every value here stays far closer to 1 (fully zoomed)
// than the old code's resting state (a flat 0 = pure contain), which is
// the actual fix for "loses immersion."
const FOCUS_KEYFRAMES: { frame: number; x: number; y: number; scale: number }[] = [
  { frame: 0, x: 0.5, y: 0.5, scale: 1.0 }, // matches Video 1's centered crop
  { frame: 40, x: 0.58, y: 0.52, scale: 0.95 },
  { frame: 90, x: 0.7, y: 0.56, scale: 0.9 },
  { frame: 130, x: 0.78, y: 0.58, scale: 0.9 }, // screen at its most off-center, last moment it reads
  { frame: 150, x: 0.3, y: 0.48, scale: 0.85 }, // hard swing -- screen's gone, lens/badge is now the subject
  { frame: 190, x: 0.22, y: 0.5, scale: 0.85 },
  { frame: 230, x: 0.38, y: 0.46, scale: 0.78 }, // easing into the final wide composition
  { frame: FRAME_COUNT - 1, x: 0.42, y: 0.45, scale: 0.72 }, // held reveal, still nowhere near full letterbox
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smoothstep = (t: number) => t * t * (3 - 2 * t)

function getFocus(frameIndex: number) {
  const kfs = FOCUS_KEYFRAMES
  if (frameIndex <= kfs[0].frame) return kfs[0]
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i]
    const b = kfs[i + 1]
    if (frameIndex >= a.frame && frameIndex <= b.frame) {
      const t = smoothstep((frameIndex - a.frame) / (b.frame - a.frame))
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), scale: lerp(a.scale, b.scale, t) }
    }
  }
  return kfs[kfs.length - 1]
}

// The mobile <video> layer -- the ambient, always-playing hero loop behind
// the frame sequence (see the JSX). Module scope, not a hook, so it's safe
// to call from inside a plain ref-callback (the lint rule that forbids
// reading a ref during render only cares about the render pass itself, not
// a callback React invokes later at commit/attach time). Fires play() the
// instant the node attaches (synchronously in the commit -- no effect-
// timing race) plus 'canplay'/'loadedmetadata' listeners (retry once real
// data exists) and a gesture fallback for anything that still blocks it
// (iOS Low Power Mode, some in-app browsers).
function attachAutoplayVideo(
  el: HTMLVideoElement | null,
  targetRef: React.RefObject<HTMLVideoElement | null>,
  cleanupRef: React.RefObject<(() => void) | null>
) {
  targetRef.current = el
  cleanupRef.current?.()
  cleanupRef.current = null
  if (!el) return
  const tryPlay = () => {
    if (el.paused) el.play().catch(() => {})
  }
  tryPlay()
  el.addEventListener('loadedmetadata', tryPlay)
  el.addEventListener('canplay', tryPlay)
  window.addEventListener('touchstart', tryPlay, { passive: true, once: true })
  window.addEventListener('scroll', tryPlay, { passive: true, once: true })
  // Browsers correctly auto-pause background video when the tab isn't
  // visible (backgrounding the app, switching tabs) -- resume when the
  // visitor comes back rather than leaving them on a frozen frame.
  document.addEventListener('visibilitychange', tryPlay)
  cleanupRef.current = () => {
    el.removeEventListener('loadedmetadata', tryPlay)
    el.removeEventListener('canplay', tryPlay)
    document.removeEventListener('visibilitychange', tryPlay)
    window.removeEventListener('touchstart', tryPlay)
    window.removeEventListener('scroll', tryPlay)
  }
}

export default function Hero({ data }: { data?: HomePage['hero'] }) {
  const wordmarkPart1 = data?.wordmarkPart1 || 'SLATE'
  const wordmarkPart2 = data?.wordmarkPart2 || 'CINEMA'
  const subtitle = data?.subtitle || 'Video Marketing At Your Fingertips'
  const ctaLabel = data?.ctaLabel || 'Get Started'
  const ctaHref = data?.ctaHref || '/contact'
  const secondaryCtaLabel = data?.secondaryCtaLabel || 'Watch Our Reel'
  const secondaryCtaHref = data?.secondaryCtaHref || '#reel'
  // true on phones (<=767px), false otherwise, null until the client knows.
  // Phones get ONE small <video> instead of the canvas + 291-frame WebP
  // sequence (see src/lib/mobile-media.ts for why); desktop and tablet are
  // exactly as before.
  const isMobile = useIsMobile()
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)

  // No preload() call for /videos/hero.mp4 here -- that file is only the
  // SmartVideo fallback for if HERO_MASTER_REEL_VIMEO_ID above is ever
  // cleared. While it's set (the real, current state), what actually
  // renders is the Vimeo iframe, so preloading the local file was pure
  // wasted bandwidth (a full unused video download on every load). The
  // `priority` prop on SmartVideo below covers the resource that's
  // actually shown, whichever path is currently live.

  const currentFrameRef = useRef<number>(1)

  // Auto-scroll to top on mount so the page always starts at the hero
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Phones: verified live that a plain useEffect([isMobile]) calling
  // play() once on mount was NOT reliably starting playback (confirmed:
  // video loaded fine -- readyState 4, correct src -- but sat paused at
  // currentTime 0; a manual play() from the console started it instantly
  // with no rejection, which rules out an autoplay-POLICY block). Root
  // cause: this <video> doesn't exist in the server-rendered HTML at all
  // -- isMobile is null during SSR (see useIsMobile's server snapshot),
  // so the canvas branch renders first and React only swaps in the
  // <video> after hydration determines this is a phone. A video element
  // created by client JS after the fact is autoplayed far less reliably
  // by mobile browsers than one present in the parsed HTML, and a single
  // mount-time effect can race ahead of the element actually having any
  // data. Fixed with a callback ref (fires play() the instant the node
  // attaches, synchronously in the commit -- no effect-timing race) plus
  // 'canplay'/'loadedmetadata' listeners (retry once real data exists)
  // and the same gesture fallback as before for anything that still
  // blocks it (iOS Low Power Mode, some in-app browsers).
  // useCallback with [] so this keeps ONE stable identity for the
  // component's life -- a callback ref that gets a new function on every
  // render makes React detach+reattach (null, then the element again) on
  // every single re-render, re-running all of this and stacking listeners
  // each time. mobileCleanupRef holds the exact listener references so
  // the detach call (`el === null`) can remove precisely what was added.
  const mobileCleanupRef = useRef<(() => void) | null>(null)
  const attachMobileVideo = useCallback((el: HTMLVideoElement | null) => {
    attachAutoplayVideo(el, mobileVideoRef, mobileCleanupRef)
  }, [])

  // Fade scroll hint arrow out as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollHintRef.current) return
      const scrollY = window.scrollY
      const opacity = Math.max(0, 1 - scrollY / 120)
      scrollHintRef.current.style.opacity = String(opacity)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live camera timecode — runs off the master scroll store so the REC
  // readout ticks in sync with the film-timecode HUD as you scroll
  useEffect(() => {
    let rafId: number
    const tick = () => {
      if (timecodeRef.current) {
        timecodeRef.current.textContent = toTimecode(scrollState.progress)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // ImageBitmap cache — GPU-ready decoded frames, no main-thread decode stall
  // Apple-style: decode all 291 frames eagerly off-thread so every frame is
  // available immediately when the scroll position hits it.
  const bitmapsRef = useRef<(ImageBitmap | null)[]>(Array(FRAME_COUNT + 1).fill(null))
  const loadedCountRef = useRef(0)
  // Compressed frame files (~28KB each, 8MB for all 291) -- kept around on
  // small screens so frames can be decoded on demand and re-decoded later.
  const blobsRef = useRef<(Blob | null)[]>(Array(FRAME_COUNT + 1).fill(null))
  // Set by the loader effect below; renderFrame calls it so the decoded
  // window follows the playhead (no-op on desktop, which keeps everything,
  // and on mobile, which decodes its whole small set upfront -- see below).
  const syncWindowRef = useRef<((center: number) => void) | null>(null)
  // Mobile's own, much smaller frame set -- see MOBILE_FRAME_COUNT's
  // comment above for the memory math.
  const mobileBitmapsRef = useRef<(ImageBitmap | null)[]>(Array(MOBILE_FRAME_COUNT + 1).fill(null))

  useEffect(() => {
    if (isMobile === null) return
    let cancelled = false

    if (isMobile) {
      // Small enough (59 frames, ~0.72MB decoded each) to just decode the
      // whole set eagerly -- no windowing, no on-demand decode/close dance,
      // unlike desktop's lowMem path below. That complexity exists there to
      // manage hundreds of megabytes; this whole set tops out around 42MB.
      const mobileBitmaps = mobileBitmapsRef.current
      const loadMobileFrame = async (i: number) => {
        if (cancelled || mobileBitmaps[i]) return
        try {
          const resp = await fetch(`/videos/frames-mobile/frame_${i.toString().padStart(4, '0')}.webp`)
          if (cancelled) return
          const blob = await resp.blob()
          if (cancelled) return
          const bmp = await createImageBitmap(blob)
          if (cancelled) {
            bmp.close()
            return
          }
          mobileBitmaps[i] = bmp
        } catch {}
      }
      const loadAllMobile = async () => {
        const batch = []
        for (let i = 1; i <= MOBILE_FRAME_COUNT; i++) batch.push(loadMobileFrame(i))
        await Promise.all(batch)
      }
      loadAllMobile()
      return () => {
        cancelled = true
        // Same reasoning as desktop's cleanup below -- close() releases the
        // backing store immediately instead of waiting on GC, which matters
        // most on exactly the devices running this branch.
        for (const bmp of mobileBitmaps) bmp?.close()
        mobileBitmaps.fill(null)
      }
    }

    // Captured once -- this array's identity never changes for the life of
    // the component (only its elements are mutated in place), so reading
    // it here rather than via bitmapsRef.current inside the cleanup below
    // satisfies the exhaustive-deps ref-in-cleanup rule without changing
    // any actual behavior.
    const bitmaps = bitmapsRef.current
    const blobs = blobsRef.current

    // 2026-09-18, Jake: "mobile is still crashing" after the unmount-leak
    // fix. That fix stopped memory piling up *across* visits, but the peak
    // within a single visit was still every one of the 291 frames decoded
    // at once (~3MB each => ~870MB resident) -- far past what a phone tab
    // survives (iOS Safari kills tabs at a few hundred MB). The compressed
    // files are tiny (8MB total), it's only the decoded bitmaps that are
    // huge, so on phones/tablets we keep the compressed blobs and decode
    // just a window of frames around the playhead, closing the rest.
    // Desktop keeps the original decode-everything behavior.
    const lowMem = window.innerWidth < 1024
    const AHEAD = 24
    const BEHIND = 6
    const KEEP_AHEAD = 40
    const KEEP_BEHIND = 14
    const decoding = new Set<number>()

    const syncWindow = (center: number) => {
      if (!lowMem || cancelled) return
      const c = Math.max(1, Math.round(center))
      for (let i = Math.max(1, c - BEHIND); i <= Math.min(FRAME_COUNT, c + AHEAD); i++) {
        const blob = blobs[i]
        if (!blob || bitmaps[i] || decoding.has(i)) continue
        decoding.add(i)
        createImageBitmap(blob)
          .then((bmp) => {
            decoding.delete(i)
            const now = Math.max(1, currentFrameRef.current)
            if (cancelled || i < now - KEEP_BEHIND || i > now + KEEP_AHEAD) {
              bmp.close()
              return
            }
            bitmaps[i] = bmp
          })
          .catch(() => decoding.delete(i))
      }
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const bmp = bitmaps[i]
        if (bmp && (i < c - KEEP_BEHIND || i > c + KEEP_AHEAD)) {
          bmp.close()
          bitmaps[i] = null
        }
      }
    }
    syncWindowRef.current = syncWindow

    const loadFrame = async (i: number) => {
      if (cancelled || bitmaps[i] || blobs[i]) return
      try {
        const resp = await fetch(`/videos/frames/frame_${i.toString().padStart(4, '0')}.webp`)
        if (cancelled) return
        const blob = await resp.blob()
        if (cancelled) return
        if (lowMem) {
          blobs[i] = blob // decoded lazily by syncWindow
          return
        }
        const bmp = await createImageBitmap(blob)
        if (cancelled) {
          // Unmounted while this decode was in flight -- close it rather
          // than dropping the reference, see the cleanup comment below for
          // why a bare dropped reference isn't good enough here.
          bmp.close()
          return
        }
        bitmaps[i] = bmp
        loadedCountRef.current++
      } catch {}
    }

    // Load frames 1 → FRAME_COUNT in order. First load frames 1-30 at high
    // priority so the first scroll is instant, then load the rest in
    // parallel batches — one-at-a-time serial fetching here was the reason
    // the sequence kept cutting off mid-scroll: 261 sequential round trips
    // simply couldn't keep up with a normal scroll speed, however fast the
    // network was. Batching lets the browser's connection pool actually
    // pipeline the requests.
    const BATCH_SIZE = 16
    const loadAll = async () => {
      // Priority batch: first 30 frames
      const priority = []
      for (let i = 1; i <= Math.min(30, FRAME_COUNT); i++) priority.push(loadFrame(i))
      await Promise.all(priority)
      syncWindow(currentFrameRef.current)
      // Rest of the frames, in parallel batches
      for (let start = 31; start <= FRAME_COUNT; start += BATCH_SIZE) {
        if (cancelled) break
        const batch = []
        for (let i = start; i < start + BATCH_SIZE && i <= FRAME_COUNT; i++) batch.push(loadFrame(i))
        await Promise.all(batch)
        syncWindow(currentFrameRef.current)
      }
    }
    loadAll()
    return () => {
      cancelled = true
      syncWindowRef.current = null
      blobs.fill(null)
      // 2026-09-11 -- Levi reported the site "crashing when you keep
      // trying to go through the site" on mobile. Root cause: each decoded
      // ImageBitmap holds real backing pixel memory (~3MB for one of these
      // 1280x588 frames, ~870MB for the full 291-frame sequence) that a
      // bare JS reference going out of scope does NOT reliably/promptly
      // release -- ImageBitmap needs an explicit close() to free its
      // backing store immediately rather than waiting on GC, which mobile
      // Safari/Chrome (much lower memory ceiling before a tab gets killed)
      // may not run before the next allocation. Without this, every time
      // Hero remounted (navigate away from Home and back) it decoded a
      // fresh ~870MB set on top of whatever the previous mount's bitmaps
      // hadn't been collected yet -- a few round trips through the site
      // and mobile Safari kills the tab.
      for (const bmp of bitmaps) bmp?.close()
      bitmaps.fill(null)
    }
  }, [isMobile])

  useGSAP(() => {
    // isMobile is null until the client resolves it (see useIsMobile), and
    // useGSAP only runs once by default -- without `dependencies: [isMobile]`
    // below, this hook permanently commits to whatever `mobile` was on that
    // first, still-null run and never re-evaluates it for the real value.
    // The null run itself has to be a hard no-op too, not just skip the
    // scroll animation: confirmed live that letting it build a real
    // ScrollTrigger/timeline against a wrong `mobile` value left stray
    // inline styles (an opacity stuck at 0) on shared elements that
    // `revertOnUpdate`'s cleanup didn't undo before the second, real run --
    // so bail before touching the DOM at all while isMobile is still null.
    if (isMobile === null) return
    const mobile = isMobile === true
    if (!containerRef.current) return

    // Both mobile and desktop draw into this canvas now (see MOBILE_FRAME_COUNT
    // above for why mobile gets its own much smaller frame set instead of
    // the video it used to be scrubbed as).
    const canvas = canvasRef.current
    const ctx = canvas ? canvas.getContext('2d') : null
    if (!canvas || !ctx) return

    // Apple-style renderFrame: draw from pre-decoded ImageBitmap.
    // ImageBitmaps live on the GPU side so drawImage() is near-zero cost.
    // Canvas is sized to the actual viewport (not a fixed 1920x1080) so
    // nothing is ever zoomed in.
    // Portrait pan/scale is driven entirely by frame index via
    // getFocus/FOCUS_KEYFRAMES above -- see the big comment there. Only
    // meaningful in portrait; ignored on desktop/landscape, which always
    // renders a plain cover fit.
    // Tiny offscreen canvas used to fake the portrait backdrop blur cheaply
    // (see the isPortrait branch) instead of ctx.filter = 'blur(24px)' on a
    // full-size canvas every frame.
    const bgCanvas = document.createElement('canvas')
    const bgCtx = bgCanvas.getContext('2d')

    const renderFrame = (index: number) => {
      if (!canvas || !ctx) return
      currentFrameRef.current = index
      let bmp: ImageBitmap | null
      if (mobile) {
        // Mobile's whole (small) set is decoded eagerly upfront -- see the
        // loader effect above -- so there's no windowing/fallback-search
        // needed, just map the continuous frame index to its nearest
        // available still.
        bmp = mobileBitmapsRef.current[mobileFrameSlot(index) + 1] || null
      } else {
        // Slide the decoded window to the playhead (tablets only, no-op on
        // real desktop, which keeps everything) -- see the loader effect above.
        syncWindowRef.current?.(index)
        bmp = bitmapsRef.current[index]
        if (!bmp) {
          // Not decoded yet (window still catching up on a fast scroll, or
          // index 0 which has no file): show the nearest decoded frame
          // instead of freezing on whatever was drawn last.
          for (let d = 1; d <= 12 && !bmp; d++) {
            bmp = bitmapsRef.current[index - d] || bitmapsRef.current[index + d] || null
          }
        }
      }
      if (!bmp) return

      // Cap backing-store density: a 3x phone at full DPR is a ~2.7MP canvas
      // redrawn (twice) every scroll tick -- the "hero animation doesn't
      // really work so well" jank -- and 2x is visually identical here.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      const pw = Math.round(w * dpr)
      const ph = Math.round(h * dpr)

      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }

      // Object-cover: scale the bitmap to fill the canvas while maintaining aspect ratio.
      // 2026-08-27: on a portrait/narrow viewport, a straight cover-fit crops
      // this frame sequence's actual subject (someone holding/operating a
      // camera) down to an unrecognizable close-up on the gear -- same
      // "cover on the wrong aspect ratio" problem the hero video had, just
      // in a canvas instead of a video box. Zooming out from a tight cover
      // fit (rather than switching to a full contain fit, which would
      // letterbox) shows enough of the actual subject to read clearly while
      // still filling most of the frame. Landscape/desktop is untouched --
      // this was never cropped tight there in the first place.
      const isPortrait = pw / ph < 16 / 9
      const coverScale = Math.max(pw / bmp.width, ph / bmp.height)
      ctx.clearRect(0, 0, pw, ph)

      if (isPortrait) {
        // 2026-08-27: on request, this now fills the entire canvas AND
        // shows the full subject clearly -- two things that directly
        // trade off for a single layer (filling more of a portrait
        // screen with a fixed-ratio image only ever means cropping more
        // of it). Resolved with two draws instead of one: a blurred,
        // full-cover copy fills the whole canvas as backdrop (satisfies
        // "fills the display"), then the same bitmap is drawn again,
        // crisp and zoomed out from a tight cover fit, on top of it
        // (satisfies "let me see the whole subject"). Same bitmap both
        // times -- no extra decode or network cost, this is cheap.
        // 2026-09-18: was ctx.filter = 'blur(24px)' on the full canvas,
        // every scroll tick -- a huge GPU cost on phones (and iOS Safari
        // ignores ctx.filter entirely, so it paid nothing visible there).
        // Same look for a fraction of the cost: shrink the frame to a
        // ~48px-wide offscreen canvas, then stretch that back up with
        // smoothing -- the bilinear upscale IS the blur.
        // Oversized slightly (1.15x) beyond a plain cover fit so the
        // edges never show a sliver of empty canvas.
        const bgScale = coverScale * 1.15
        if (bgCtx) {
          const bw = 48
          const bh = Math.max(1, Math.round((bmp.height / bmp.width) * bw))
          if (bgCanvas.width !== bw || bgCanvas.height !== bh) {
            bgCanvas.width = bw
            bgCanvas.height = bh
          }
          bgCtx.drawImage(bmp, 0, 0, bw, bh)
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(
            bgCanvas,
            (pw - bmp.width * bgScale) / 2,
            (ph - bmp.height * bgScale) / 2,
            bmp.width * bgScale,
            bmp.height * bgScale
          )
        }

        // 2026-08-27 follow-up -- "keyframe it so main focus of video
        // moves throughout... so it can be fully zoomed into fit display
        // area": rather than blending toward a single flat contain-fit
        // (which meant this sat *small and letterboxed* for ~90% of the
        // sequence -- the "loses immersion" complaint), scale and crop
        // position now both come from getFocus(index), hand-placed
        // against what's actually in frame at that point in the footage
        // (see FOCUS_KEYFRAMES above). scale of 1 = tight cover, no gap;
        // lower values ease slightly toward contain, same "blurred
        // backdrop shows through the edges" mechanism as before, just
        // driven by frame content instead of scroll progress.
        const { x: focusX, y: focusY, scale: focusScale } = getFocus(index)
        const fgScale = coverScale * focusScale
        const drawW = bmp.width * fgScale
        const drawH = bmp.height * fgScale
        // How much room the crop window has to travel before it would
        // reveal empty canvas on that axis. When there's no room (this
        // scale doesn't fully cover that axis), fall back to centering --
        // same as the plain cover draw below, just per-axis.
        const xSlack = drawW - pw
        const ySlack = drawH - ph
        const dx = xSlack > 0 ? -xSlack * focusX : (pw - drawW) / 2
        const dy = ySlack > 0 ? -ySlack * focusY : (ph - drawH) / 2
        ctx.drawImage(bmp, dx, dy, drawW, drawH)
      } else {
        // Landscape/desktop untouched -- never needed this treatment.
        ctx.drawImage(
          bmp,
          (pw - bmp.width * coverScale) / 2,
          (ph - bmp.height * coverScale) / 2,
          bmp.width * coverScale,
          bmp.height * coverScale
        )
      }
    }

    // Try to draw first frame immediately (it will retry onUpdate if not loaded yet)
    renderFrame(0)

    const gsapCtx = gsap.context(() => {
      // --- 1. ENTRANCE ANIMATION ---
      const enterTl = gsap.timeline({ delay: 0.3 })

      enterTl.fromTo(
        '.hero-letter',
        { opacity: 0, y: 100, rotateX: -90, z: -500 },
        { opacity: 1, y: 0, rotateX: 0, z: 0, duration: 1.2, stagger: 0.04, ease: 'power4.out' },
        0.2
      )

      enterTl.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.8
      )

      enterTl.fromTo(
        '.hero-cta',
        { opacity: 0, x: -80, rotateY: 45 },
        { opacity: 1, x: 0, rotateY: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' },
        1
      )

      // --- 2. SCROLL ANIMATION ---
      // This pin+dissolve+auto-advance system exists to give a scroll-
      // scrubbed reveal of the rotating-camera Ken Burns shot room to play
      // out -- 1.6 viewport-heights of pinned scroll, auto-completing once
      // you're past halfway. Mobile gets its own branch below with its own
      // (much faster) timing, but the actual frame reveal is now the exact
      // same mechanism as desktop's: renderFrame() drawing a pre-decoded
      // ImageBitmap into the shared canvas, driven straight off the scrub
      // tween's frame index -- "frame by frame like Apple's style," not a
      // scrubbed <video> (a video's currentTime seek is asynchronous and
      // can't guarantee landing exactly on the frame scroll says it should;
      // a canvas draw is synchronous, every tick, zero latency). See
      // MOBILE_FRAME_COUNT above for how this stays memory-safe.
      if (mobile) {
        let mobileAutoAdvanced = false
        let mobileAutoAdvanceTimer: ReturnType<typeof setTimeout> | null = null
        const mobilePlayhead = { frame: 0 }

        const mobileScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 1.6}`,
            // Far below desktop's scrub: 1 -- on a touch screen, input IS
            // the finger on the glass, and any real catch-up lag reads as
            // broken. 0.05 is close enough to zero to feel 1:1 while still
            // smoothing out raw per-touchmove jitter.
            scrub: 0.05,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => {
              if (self.progress < 0.5) {
                mobileAutoAdvanced = false
                if (mobileAutoAdvanceTimer) {
                  clearTimeout(mobileAutoAdvanceTimer)
                  mobileAutoAdvanceTimer = null
                }
                return
              }
              if (mobileAutoAdvanced || self.direction !== 1 || self.progress >= 0.99) return
              if (mobileAutoAdvanceTimer) clearTimeout(mobileAutoAdvanceTimer)
              mobileAutoAdvanceTimer = setTimeout(() => {
                mobileAutoAdvanced = true
                scrollToY(self.end, 1.4)
              }, 140)
            },
          },
        })

        // A/B: "the first video needs to disappear near instantly" -- the
        // wordmark/HTML layer dissolves and the canvas reveal completes
        // within the first ~6% of this timeline, a handful of scrolled
        // pixels, not a gradual fade.
        mobileScrollTl.to('.hero-html-content', { opacity: 0, ease: 'power1.in', duration: 0.06 }, 0)
        mobileScrollTl.to('.camera-ui', { opacity: 0, ease: 'power1.in', duration: 0.06 }, 0)
        mobileScrollTl.to(canvas, { opacity: 1, ease: 'power1.out', duration: 0.06 }, 0)
        // C: the Ken Burns scrub itself -- identical call to desktop's own
        // C-tween below, just with mobile's faster pacing and (via
        // renderFrame's `mobile` branch) mobile's own smaller frame set.
        mobileScrollTl.to(
          mobilePlayhead,
          {
            frame: FRAME_COUNT - 1,
            snap: 'frame',
            ease: 'power2.in',
            duration: 0.94,
            onUpdate: () => renderFrame(Math.round(mobilePlayhead.frame)),
          },
          0.06
        )

        return
      }

      // Pan/scale no longer live on playhead -- they're derived straight
      // from the frame index every draw (getFocus, see above), so this
      // only needs to drive the frame itself.
      const playhead = { frame: 0 }

      // Once the user has scrolled halfway through the frame sequence,
      // finish the ride for them — auto-advance the rest of the way so
      // the back half flows straight into the next section instead of
      // demanding more manual scrolling (lowered from two-thirds to half
      // per 2026-08-27 request). Debounced: real wheel
      // input fires onUpdate continuously while the user is actively
      // scrolling, and each of those ticks would otherwise re-target Lenis'
      // own wheel-driven scroll and cancel a scrollTo call made mid-gesture.
      // Waiting for a short gap in updates means we only kick in once their
      // scroll has actually settled, so we don't fight their input.
      let autoAdvanced = false
      let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          // ScrollTrigger parses 'vh' strings as px — '+=1000vh' silently became
          // 1000px. Compute real viewport multiples for a filmic 291-frame scrub.
          // 1.15 viewports keeps the scrub smooth without a long dead runway
          // before the next section arrives.
          end: () => `+=${window.innerHeight * 1.6}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (self) => {
            if (self.progress < 0.5) {
              autoAdvanced = false
              if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer)
                autoAdvanceTimer = null
              }
              return
            }
            if (autoAdvanced || self.direction !== 1 || self.progress >= 0.99) return
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer)
            autoAdvanceTimer = setTimeout(() => {
              autoAdvanced = true
              scrollToY(self.end, 1.4)
            }, 140)
          },
        },
      })

      // A. Slow cinematic dissolve — video fades out gently over a large scroll window
      scrollTl.to(
        '.hero-html-content',
        { opacity: 0, ease: 'power2.in', duration: 0.3 },
        0
      )
      scrollTl.to(
        '.camera-ui',
        { opacity: 0, ease: 'power2.in', duration: 0.3 },
        0
      )

      // B. Canvas fades in simultaneously, overlapping the video dissolve
      scrollTl.to(canvas, { opacity: 1, ease: 'power2.out', duration: 0.35 }, 0)

      // C. Frame sequence — starts after crossfade is well underway.
      // Uses power2.in so the very first frames advance slowly (cinematic hold)
      // before picking up speed through the rest of the sequence.
      scrollTl.to(
        playhead,
        {
          frame: FRAME_COUNT - 1,
          snap: 'frame',
          ease: 'power2.in',
          duration: 0.82,
          onUpdate: () => renderFrame(Math.round(playhead.frame)),
        },
        0.18
      )

    }, containerRef)

    // This hook waits for isMobile to resolve, so the hero's pin is created
    // AFTER every pinned section below it (MediaVoid, Results, ...), and
    // ScrollTrigger measures in creation order -- those sections were
    // computing their start positions without the hero's 1.6-viewport
    // pin-spacer, pinning ~1.6 screens early and painting over whatever was
    // still on screen (MediaVoid's text over the Pipeline accordion).
    // refreshPriority: 1 on the triggers above + sort() makes the hero
    // measure first regardless of creation order.
    ScrollTrigger.sort()
    ScrollTrigger.refresh()

    return () => gsapCtx.revert()
  }, { scope: containerRef, dependencies: [isMobile], revertOnUpdate: true })

  const slateLetters = wordmarkPart1.split('')
  const cinemaLetters = wordmarkPart2.split('')

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-ink">
      {/* Inner wrapper — overflow hidden so pinned canvas never bleeds out */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ perspective: '2000px' }}>

        {/* 1. Canvas image-sequence layer. The wrapper itself is always
            visible now (on phones the ambient video below needs to show
            from the start) -- the canvas is what starts invisible and
            fades in on scroll, on both mobile and desktop (see the B tween
            in each useGSAP branch, which targets the canvas ref directly). */}
        <div className="camera-canvas-container absolute inset-0 z-10 pointer-events-none flex items-center justify-center bg-ink">
          {isMobile && (
            <video
              ref={attachMobileVideo}
              src={HERO_MOBILE_VIDEO}
              poster={HERO_MOBILE_POSTER}
              autoPlay
              loop
              muted
              playsInline
              // 'auto' (was 'metadata'): this IS the hero -- start buffering
              // immediately so it plays as soon as the poster shows.
              preload="auto"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback"
              className="bg-video absolute inset-0 w-full h-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-0" />
        </div>

        {/* 2. HTML UI layer (fades out on scroll, no scale change) */}
        <div className="hero-html-content absolute inset-0 z-20">

          {/* Background video -- real master reel, falls back to the
              local file if the Vimeo ID is ever cleared. 2026-08-27:
              reverted to one plain, unconditional treatment on every
              viewport, same as desktop always had -- full-bleed "cover",
              dimmed to opacity-40 + mix-blend-screen as ambient depth
              behind the bold overlaid text. Mobile went through several
              different treatments today (zero-crop top banner, then a
              bigger banner, then a blurred-backdrop+crisp-foreground
              version) chasing "show the whole shot" vs. "fill the
              screen" -- explicitly reverted per request in favor of
              keeping this video simple everywhere and putting the
              blurred-backdrop treatment on the canvas frame-sequence
              below instead, where it's free (same bitmap drawn twice)
              rather than a second live Vimeo embed. */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
            {/* object-cover alone doesn't do anything on the Vimeo iframe
                path -- object-fit only affects replaced elements like
                <video>/<img>, not iframe content, so the video was
                letterboxing inside its box instead of filling it. Fixed
                with the standard vw/vh "oversize" cover technique (safe
                for the <video> fallback too -- object-cover still crops
                it correctly regardless of the box's exact size). Assumes
                a 16:9 source, the standard ratio for this kind of reel;
                this section is h-screen so vw/vh here really does match
                the container, not just the viewport coincidentally. */}
            {/* Only mount the Vimeo background once we know this ISN'T a
                phone: on phones that autoplaying 1080p iframe is the
                other heavy thing on the page, and the <video> layer above
                replaces it. Waiting for `false` (not just "not true") also
                keeps it out of the server HTML, so a phone never starts
                loading it before hydration can say no. */}
            {isMobile === false && (
              <SmartVideo
                src="/videos/hero.mp4"
                vimeo={HERO_MASTER_REEL_VIMEO_ID}
                variant="background"
                priority
                className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-w-[177.78vh] min-h-[100vh] object-cover -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </div>
          {/* Phones: dim the (now un-blended) video behind the wordmark so the
              text stays legible; it dissolves with this layer on scroll. */}
          {isMobile && <div className="absolute inset-0 z-0 bg-ink/50 pointer-events-none" />}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-ink/80 via-transparent to-ink/80 pointer-events-none" />

          {/* Main content — centered hero text and CTAs */}
          <div className="hero-content absolute inset-0 z-10 flex flex-col items-center justify-center">
            {/* Subtle blue radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,174,239,0.08) 0%, transparent 70%)' }}
            />

            {/* SLATE CINEMA letters */}
            <div className="flex items-baseline gap-4 md:gap-6 mb-6">
              <div className="flex" data-cms-field="hero.wordmarkPart1">
                {slateLetters.map((letter, i) => (
                  <span
                    key={`s-${i}`}
                    className="hero-letter inline-block text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold text-white tracking-tighter leading-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="flex" data-cms-field="hero.wordmarkPart2">
                {cinemaLetters.map((letter, i) => (
                  <span
                    key={`c-${i}`}
                    className="hero-letter inline-block text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold text-[#00AEEF] tracking-tighter leading-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtitle */}
            {/* text-center added 2026-08-27: on mobile this wraps to 2
                lines (its own max-content width, at 0.4em letter-tracking,
                exceeds a phone viewport), and without an explicit
                text-align the paragraph's auto-width flex sizing clamps
                to the full available width once wrapping starts -- so
                each wrapped line defaulted to flush-left inside that
                full-width box instead of centering under the wordmark
                above it (confirmed live: computed text-align was "start",
                not "center"). */}
            <p data-cms-field="hero.subtitle" className="hero-subtitle text-xs md:text-sm font-mono tracking-[0.4em] text-white/50 uppercase mb-12 text-center">
              {subtitle}
            </p>

            {/* Cinematic top bar — REC indicator */}
            <div className="camera-ui absolute top-6 left-8 z-30 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <span className="font-mono text-[11px] md:text-sm text-red-500 tracking-[0.3em] font-bold">
                REC
              </span>
            </div>
            
            {/* Battery / Time Indicator */}
            <div className="camera-ui absolute top-6 right-8 z-30 flex items-center gap-4">
              <span ref={timecodeRef} className="font-mono text-[11px] md:text-sm text-white/70 tracking-widest">
                00:00:00:00
              </span>
              <div className="w-8 h-4 border border-white/40 rounded-sm p-[1px] flex justify-end">
                <div className="w-3/4 h-full bg-white/70" />
              </div>
            </div>

            {/* Viewfinder Corners */}
            <div className="camera-ui absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-white/30 z-30 pointer-events-none" />
            <div className="camera-ui absolute top-12 right-12 w-16 h-16 border-t-2 border-r-2 border-white/30 z-30 pointer-events-none" />
            <div className="camera-ui absolute bottom-12 left-12 w-16 h-16 border-b-2 border-l-2 border-white/30 z-30 pointer-events-none" />
            <div className="camera-ui absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-white/30 z-30 pointer-events-none" />

            {/* CTA Buttons — Get Started leads, Watch Our Reel is the one secondary option */}
            <div className="flex flex-wrap items-center gap-4 justify-center pointer-events-auto mt-12 z-40 relative">
              <a
                href={ctaHref}
                data-cms-field="hero.ctaLabel"
                className="hero-cta group relative px-7 py-3.5 rounded-full overflow-hidden bg-white"
              >
                <div className="absolute inset-0 bg-[#00AEEF] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="relative text-sm font-semibold text-black group-hover:text-white tracking-wide transition-colors">{ctaLabel}</span>
              </a>
              <a
                href={secondaryCtaHref}
                data-cms-field="hero.secondaryCtaLabel"
                className="hero-cta group relative px-6 py-3 rounded-full overflow-hidden border border-white/15 bg-white/[0.03]"
              >
                <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="relative text-sm font-medium text-white/80 group-hover:text-white tracking-wide transition-colors">{secondaryCtaLabel}</span>
              </a>
            </div>
          </div>

          {/* Scroll hint arrow — fades out as user scrolls (controlled via JS) */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none transition-opacity duration-100"
          >
            <span className="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">Scroll</span>
            {/* Animated chevron arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="animate-bounce text-[#00AEEF]/60"
            >
              <path
                d="M4 7l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

        </div>
      </div>
    </section>
  )
}
