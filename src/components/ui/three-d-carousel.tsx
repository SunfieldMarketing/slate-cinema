'use client'

import { memo, useEffect, useLayoutEffect, useState } from 'react'
import { motion, useAnimation, useMotionValue, type LegacyAnimationControls } from 'motion/react'

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const IS_SERVER = typeof window === 'undefined'

function useMediaQuery(query: string, defaultValue = false): boolean {
  const getMatches = (q: string): boolean => (IS_SERVER ? defaultValue : window.matchMedia(q).matches)
  const [matches, setMatches] = useState<boolean>(() => getMatches(query))

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handle = () => setMatches(mql.matches)
    mql.addEventListener('change', handle)
    return () => mql.removeEventListener('change', handle)
  }, [query])

  return matches
}

export interface CarouselCard {
  image: string
  title: string
  subtitle: string
}

/*
  A closed cylinder of cards the visitor can grab and spin — drag to
  rotate, release to let momentum carry it to rest. Click a card to hand
  it off to the caller (opens the shared project modal) rather than
  zooming in place, so it stays a fast, tactile "spin through the reel"
  interaction instead of a second lightbox.
*/
const Carousel = memo(
  ({
    cards,
    onSelect,
    controls,
    isActive,
  }: {
    cards: CarouselCard[]
    onSelect: (index: number) => void
    controls: LegacyAnimationControls
    isActive: boolean
  }) => {
    const isSmall = useMediaQuery('(max-width: 640px)')
    const isMedium = useMediaQuery('(max-width: 1024px)')
    const cylinderWidth = isSmall ? 1600 : isMedium ? 2400 : 3520
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    // Scaled by cylinder width so the same physical drag distance always
    // sweeps roughly the same fraction of the ring, regardless of breakpoint.
    const dragSensitivity = 130 / cylinderWidth
    const flingSensitivity = 45 / cylinderWidth

    return (
      <div className="flex h-full items-center justify-center" style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}>
        <motion.div
          drag={isActive ? 'x' : false}
          // Framer's `drag="x"` also physically translates the element by
          // the raw drag `x` value by default — on top of the rotateY spin
          // we compute by hand below, and that x offset accumulates across
          // every drag gesture without ever resetting (it doesn't snap back
          // without constraints). Left unconstrained, a few drags visibly
          // slide the whole cylinder sideways instead of just spinning it
          // in place, which is what actually read as "choppy" — locking
          // the constraint to a single point keeps the gesture (and its
          // delta/velocity) fully working while stopping it from ever
          // moving the element itself.
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.02}
          // Framer's default drag momentum animates the internal `x` value
          // this gesture registers with — but this carousel never renders
          // from `x` (rotation is computed by hand below), so that phantom
          // inertia animation was still running invisibly every frame after
          // release, competing for animation-frame budget with the actual
          // spring in onDragEnd and making the release feel choppy.
          dragMomentum={false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing touch-none"
          style={{ rotateY: rotation, width: cylinderWidth, transformStyle: 'preserve-3d' }}
          // `info.delta` is the incremental movement since the last drag
          // event — using `info.offset` (cumulative since the drag
          // started) here instead would re-add the whole running total on
          // every single pointer-move tick, compounding into a runaway
          // spin that gets faster the more events a gesture produces.
          onDrag={(_, info) => isActive && rotation.set(rotation.get() + info.delta.x * dragSensitivity)}
          onDragEnd={(_, info) =>
            isActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * flingSensitivity,
              transition: { type: 'spring', stiffness: 60, damping: 40, mass: 0.3 },
            })
          }
          animate={controls}
        >
          {cards.map((card, i) => (
            <motion.div
              key={`${card.title}-${i}`}
              className="group absolute flex h-full origin-center items-center justify-center p-3"
              style={{ width: `${faceWidth}px`, transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)` }}
              onClick={() => onSelect(i)}
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-ink cursor-pointer transition-colors duration-300 group-hover:border-[#00AEEF]/50 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <motion.img
                  src={card.image}
                  alt={card.title}
                  draggable={false}
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

                {/* Play affordance on hover — signals "click to open", not
                    just "drag to spin". */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white font-bold text-base leading-tight truncate">{card.title}</div>
                  <div className="text-white/50 text-xs font-mono truncate">{card.subtitle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
)
Carousel.displayName = 'Carousel'

export default function ThreeDPhotoCarousel({ cards, onSelect }: { cards: CarouselCard[]; onSelect: (index: number) => void }) {
  const [isActive, setIsActive] = useState(true)
  const controls = useAnimation()

  const handleSelect = (index: number) => {
    // Momentarily pause the spin so the click reads as deliberate rather
    // than getting lost mid-drag, then hand off to the caller.
    setIsActive(false)
    controls.stop()
    onSelect(index)
    window.setTimeout(() => setIsActive(true), 50)
  }

  return (
    <div className="relative h-[300px] sm:h-[380px] md:h-[460px] lg:h-[520px] w-full overflow-hidden">
      <Carousel cards={cards} onSelect={handleSelect} controls={controls} isActive={isActive} />
    </div>
  )
}
