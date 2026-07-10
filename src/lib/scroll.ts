'use client'

// Master scroll state — the single source of truth for the whole cinematic
// experience. Lenis (SmoothScrolling) writes into it every frame; the 3D
// scene, the timecode HUD, and any section can read from it without causing
// React re-renders. All values are mutated in place.

export interface SectionRange {
  id: string
  start: number // document Y where section begins
  end: number   // document Y where section ends
  /** 0 → 1 progress through this section (clamped) */
  progress: number
}

export interface ScrollState {
  /** 0 → 1 through the entire page */
  progress: number
  /** Smoothed scroll velocity in px/frame (signed) */
  velocity: number
  /** Raw scrollY in px */
  scrollY: number
  /** Total scrollable distance (scrollHeight - viewport) */
  limit: number
  /** Ordered list of registered sections */
  sections: SectionRange[]
  /** Bumped every time sections are re-measured (consumers can rebuild UI) */
  measureVersion: number
  /** Index of the section the viewport centre is currently inside */
  activeIndex: number
  /**
   * Continuous "chapter" position: activeIndex + progress-within-section.
   * The 3D camera samples its spline with this so every section gets an
   * equal segment of the flight path regardless of its scroll length.
   */
  chapter: number
}

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  scrollY: 0,
  limit: 1,
  sections: [],
  measureVersion: 0,
  activeIndex: 0,
  chapter: 0,
}

let lastDocHeight = 0
let framesSinceHeightCheck = 0

/** Re-measure every [data-scroll-section] element. Call on mount + resize. */
export function measureSections() {
  if (typeof document === 'undefined') return
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-section]'))
  const scrollY = window.scrollY
  scrollState.sections = els.map((el) => {
    const rect = el.getBoundingClientRect()
    return {
      id: el.dataset.scrollSection || '',
      start: rect.top + scrollY,
      end: rect.top + scrollY + rect.height,
      progress: 0,
    }
  })
  lastDocHeight = document.documentElement.scrollHeight
  scrollState.measureVersion++
}

/** Called by SmoothScrolling on every Lenis frame. */
export function publishScroll(scrollY: number, limit: number, velocity: number) {
  // Self-heal: pinned sections, HMR, and late-loading media all change the
  // document height after the first measure. Re-measure whenever it moves.
  if (++framesSinceHeightCheck >= 30) {
    framesSinceHeightCheck = 0
    const h = document.documentElement.scrollHeight
    if (Math.abs(h - lastDocHeight) > 4) measureSections()
  }

  scrollState.scrollY = scrollY
  scrollState.limit = Math.max(1, limit)
  scrollState.progress = Math.min(1, Math.max(0, scrollY / scrollState.limit))
  // Smooth the velocity so effects driven by it don't flicker
  scrollState.velocity += (velocity - scrollState.velocity) * 0.1

  const probe = scrollY + window.innerHeight * 0.5
  let active = 0
  for (let i = 0; i < scrollState.sections.length; i++) {
    const s = scrollState.sections[i]
    const span = Math.max(1, s.end - s.start)
    s.progress = Math.min(1, Math.max(0, (probe - s.start) / span))
    if (probe >= s.start) active = i
  }
  scrollState.activeIndex = active
  const activeSection = scrollState.sections[active]
  scrollState.chapter = activeSection ? active + activeSection.progress : 0
}

/** progress (0-1) → cinematic timecode string HH:MM:SS:FF at 24fps */
export function toTimecode(progress: number, totalSeconds = 150): string {
  const t = progress * totalSeconds
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = Math.floor(t % 60)
  const f = Math.floor((t % 1) * 24)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`
}

// Lenis instance registry — lets a component that needs to run its own
// wheel/touch handling (e.g. a scroll-jacked hero) temporarily hand control
// back from the global smooth-scroll without either fighting the other.
interface LenisLike {
  stop: () => void
  start: () => void
  scrollTo?: (target: number | string, opts?: Record<string, unknown>) => void
}

let lenisInstance: LenisLike | null = null

export function registerLenis(instance: LenisLike | null) {
  lenisInstance = instance
}

export function pauseLenis() {
  lenisInstance?.stop()
}

export function resumeLenis() {
  lenisInstance?.start()
}

/** Smoothly continue the scroll to an absolute document Y — used to auto-
 * advance out of a scroll-jacked section once the user is most of the way
 * through it, instead of requiring them to keep scrolling manually. Routes
 * through Lenis when available so it doesn't fight the smooth-scroll engine. */
export function scrollToY(y: number, duration = 1.6) {
  if (typeof window === 'undefined') return
  if (lenisInstance?.scrollTo) {
    lenisInstance.scrollTo(y, { duration, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
  } else {
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

/** true when the user prefers reduced motion or the GPU looks weak */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  const cores = navigator.hardwareConcurrency
  if (typeof cores === 'number' && cores > 0 && cores <= 2) return true
  return false
}
