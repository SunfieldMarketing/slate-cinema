'use client'

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import { portfolioProjects } from '@/lib/portfolio-projects'
import ProjectCardModal from '@/components/ProjectCardModal'

gsap.registerPlugin(ScrollTrigger)

/*
  The reel is a closed cylindrical band of film — all 8 frames wrapped
  around a ring, like a strip of film joined end to end. The camera sits
  just outside the ring so the active frame fills the center while its
  neighbours curve away, and the far side of the loop shows faintly
  (mirrored, fogged) behind — the classic 3D film-carousel look.
  Navigation rotates the band about its axis; the fly-in animates the
  whole band's rigid transform from a small, distant, steeply tilted
  pose (reading as a loose reel tumbling in) down to its resting tilt.
*/
const FRAME_W = 6.4
const FRAME_H = 4.4
const GAP = 0.55
const BORDER = 0.14
const SPACING = FRAME_W + GAP
const RAIL_GAP = 0.15
const RAIL_H = 0.26
const COUNT = portfolioProjects.length
/*
  Each project appears twice around the loop (16 slots), doubling the
  ring's radius so the band sweeps nearly the full viewport width — like
  the reference — while the front frame stays the same apparent size.
  Navigation happens in slots; the active *project* is slot % COUNT.
*/
const SLOTS = COUNT * 2
const RADIUS = (SLOTS * SPACING) / (2 * Math.PI)
const STEP = (2 * Math.PI) / SLOTS
const FRAME_ARC = FRAME_W / RADIUS

/*
  Fly-in choreography, keyframed to the reference sequence: the strip
  first appears as a tiny, nearly edge-on sliver deep in the fog (barely
  a couple of frames catching light), swoops forward into a large canted
  band hanging right-of-center with its frames readable, then rights
  itself and settles into the carousel. The band also spins around its
  own axis throughout (the "unspool"), so film visibly streams past as
  it arrives. Each segment eases through its keyframe so the two flight
  poses register instead of blurring by.
*/
const quatFromEuler = (x: number, y: number, z: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, 'XYZ'))
const FLY_KEYFRAMES = [
  { pos: new THREE.Vector3(6.2, 4.2, -30), quat: quatFromEuler(0.55, 1.25, -0.5), scale: 0.32 },
  { pos: new THREE.Vector3(2.8, 1.9, -14.5), quat: quatFromEuler(0.42, 0.55, -0.28), scale: 0.62 },
  { pos: new THREE.Vector3(0, 0.3, -10.8), quat: quatFromEuler(0.035, 0, 0.02), scale: 1 },
]
const FLY_SPLIT = 0.55
const UNSPOOL_TURNS = 2.6

/* Perforated sprocket-hole strip texture, tiled around each rail ring. */
function useSprocketTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#04060b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#aab4c4'
    const holeW = 28
    const holeH = 20
    const r = 6
    const x = (canvas.width - holeW) / 2
    const y = (canvas.height - holeH) / 2
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + holeW, y, x + holeW, y + holeH, r)
    ctx.arcTo(x + holeW, y + holeH, x, y + holeH, r)
    ctx.arcTo(x, y + holeH, x, y, r)
    ctx.arcTo(x, y, x + holeW, y, r)
    ctx.closePath()
    ctx.fill()
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.repeat.set(110, 1)
    return tex
  }, [])
}

interface ReelRefs {
  progressRef: MutableRefObject<number>
  activeRef: MutableRefObject<number>
  spinRef: MutableRefObject<number>
  dragExtraRef: MutableRefObject<number>
  pointerRef: MutableRefObject<{ x: number; y: number }>
}

function FilmBand({
  progressRef,
  activeRef,
  spinRef,
  dragExtraRef,
  pointerRef,
  accent,
  onSelect,
}: ReelRefs & { accent: string; onSelect: (i: number) => void }) {
  const flyRef = useRef<THREE.Group>(null)
  const spinGroupRef = useRef<THREE.Group>(null)
  const frameRefs = useRef<(THREE.Mesh | null)[]>([])

  const textures = useTexture(portfolioProjects.map((p) => p.url))
  const sprocketTex = useSprocketTexture()

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.needsUpdate = true
    })
  }, [textures])

  const accentColor = useMemo(() => new THREE.Color(accent), [accent])

  const slots = useMemo(() => Array.from({ length: SLOTS }, (_, j) => j), [])

  // Curved cylinder segment per slot, already placed at its angle around
  // the ring, so the mesh transform stays identity and highlight-scaling
  // pops the frame radially outward.
  const frameGeos = useMemo(
    () => slots.map((j) => new THREE.CylinderGeometry(RADIUS, RADIUS, FRAME_H, 32, 1, true, j * STEP - FRAME_ARC / 2, FRAME_ARC)),
    [slots]
  )

  // White slide-film border behind each image, slightly recessed and a
  // touch larger so it reads as a printed frame edge around the picture.
  const borderGeos = useMemo(
    () =>
      slots.map(
        (j) =>
          new THREE.CylinderGeometry(
            RADIUS - 0.008,
            RADIUS - 0.008,
            FRAME_H + BORDER * 2,
            32,
            1,
            true,
            j * STEP - (FRAME_ARC + (BORDER * 2) / RADIUS) / 2,
            FRAME_ARC + (BORDER * 2) / RADIUS
          )
      ),
    [slots]
  )

  // Dark film base between frames, slightly recessed so it never z-fights.
  const fillerGeos = useMemo(
    () =>
      slots.map((j) => {
        const ovl = 0.12 / RADIUS
        return new THREE.CylinderGeometry(RADIUS - 0.02, RADIUS - 0.02, FRAME_H + 0.4, 12, 1, true, j * STEP + FRAME_ARC / 2 - ovl, STEP - FRAME_ARC + ovl * 2)
      }),
    [slots]
  )

  // Dark margins between the image edge and each sprocket rail.
  const marginGeos = useMemo(
    () =>
      [1, -1].map((s) => {
        const yInner = s * (FRAME_H / 2 - 0.04)
        const yOuter = s * (FRAME_H / 2 + RAIL_GAP + 0.02)
        const g = new THREE.CylinderGeometry(RADIUS - 0.015, RADIUS - 0.015, Math.abs(yOuter - yInner), 200, 1, true)
        g.translate(0, (yInner + yOuter) / 2, 0)
        return g
      }),
    []
  )

  // Full sprocket-hole rings above and below the frames.
  const railGeos = useMemo(
    () =>
      [1, -1].map((s) => {
        const g = new THREE.CylinderGeometry(RADIUS, RADIUS, RAIL_H, 256, 1, true)
        g.translate(0, s * (FRAME_H / 2 + RAIL_GAP + RAIL_H / 2), 0)
        return g
      }),
    []
  )

  useFrame((state) => {
    const p = progressRef.current
    const t = state.clock.elapsedTime

    if (flyRef.current) {
      // Pick the keyframe segment and ease through it, so the flight
      // lingers at each reference pose instead of blurring past it.
      const seg = p < FLY_SPLIT ? 0 : 1
      const lt = seg === 0 ? p / FLY_SPLIT : (p - FLY_SPLIT) / (1 - FLY_SPLIT)
      const s = lt * lt * (3 - 2 * lt)
      const a = FLY_KEYFRAMES[seg]
      const b = FLY_KEYFRAMES[seg + 1]

      const bobY = Math.sin(t * 0.55) * 0.07 * p
      const bobRotZ = Math.sin(t * 0.45 + 1.3) * 0.012 * p
      const parallaxRotY = pointerRef.current.x * 0.09 * p
      const parallaxRotX = -pointerRef.current.y * 0.05 * p

      flyRef.current.position.lerpVectors(a.pos, b.pos, s)
      flyRef.current.position.y += bobY
      flyRef.current.quaternion.copy(a.quat).slerp(b.quat, s)
      const extra = new THREE.Euler(parallaxRotX, parallaxRotY, bobRotZ, 'XYZ')
      flyRef.current.quaternion.multiply(new THREE.Quaternion().setFromEuler(extra))
      flyRef.current.scale.setScalar(THREE.MathUtils.lerp(a.scale, b.scale, s))
    }

    if (spinGroupRef.current) {
      // The unspool: the band arrives mid-spin and rotates to rest.
      const unspool = Math.pow(1 - p, 1.3) * UNSPOOL_TURNS
      spinGroupRef.current.rotation.y = spinRef.current + dragExtraRef.current + unspool
    }

    // Brighten whichever project is active; pop its frames slightly outward.
    for (let j = 0; j < SLOTS; j++) {
      const frame = frameRefs.current[j]
      if (!frame) continue
      const isActive = j % COUNT === activeRef.current
      const targetScale = isActive ? 1.05 : 1
      const s = THREE.MathUtils.lerp(frame.scale.x, targetScale, 0.1)
      frame.scale.setScalar(s)
      const mat = frame.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isActive ? 0.1 : 0, 0.1)
      mat.color.setScalar(THREE.MathUtils.lerp(mat.color.r, isActive ? 1 : 0.55, 0.1))
    }
  })

  return (
    <group ref={flyRef}>
      <group ref={spinGroupRef}>
        {slots.map((j) => (
          <mesh
            key={`slot-${j}`}
            geometry={frameGeos[j]}
            ref={(el) => {
              frameRefs.current[j] = el
            }}
            onClick={(e) => {
              if (e.delta > 8) return
              e.stopPropagation()
              onSelect(j)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
            }}
          >
            <meshStandardMaterial
              map={textures[j % COUNT]}
              emissive={accentColor}
              emissiveIntensity={0}
              roughness={0.55}
              metalness={0.05}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}

        {borderGeos.map((g, i) => (
          <mesh key={`border-${i}`} geometry={g}>
            <meshStandardMaterial color="#dfe3e8" roughness={0.7} metalness={0} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {fillerGeos.map((g, i) => (
          <mesh key={`filler-${i}`} geometry={g}>
            <meshBasicMaterial color="#05070c" side={THREE.DoubleSide} />
          </mesh>
        ))}
        {marginGeos.map((g, i) => (
          <mesh key={`margin-${i}`} geometry={g}>
            <meshBasicMaterial color="#05070c" side={THREE.DoubleSide} />
          </mesh>
        ))}
        {railGeos.map((g, i) => (
          <mesh key={`rail-${i}`} geometry={g}>
            <meshBasicMaterial map={sprocketTex} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* Pull the camera back on narrow viewports so the front frame still fits. */
function ResponsiveCamera() {
  useFrame((state) => {
    const aspect = state.size.width / state.size.height
    const targetZ = aspect < 1.1 ? 24 : aspect < 1.8 ? 19 : 16
    if (Math.abs(state.camera.position.z - targetZ) > 0.001) {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.15)
    }
  })
  return null
}

function FilmReelScene(props: ReelRefs & { accent: string; onSelect: (i: number) => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 17.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ResponsiveCamera />
      <fog attach="fog" args={['#101c38', 18, 58]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} />
      <pointLight position={[-6, -1, 8]} intensity={0.5} color={props.accent} />
      <Suspense fallback={null}>
        <FilmBand {...props} />
      </Suspense>
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} intensity={0.35} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}

export default function IndustryReel({ accent }: { accent: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)

  // The band's rotation target lives in refs so the canvas reads it every
  // frame without React re-renders. `virtual` counts continuously (no
  // modulo) so next/prev always take the short way around the ring.
  const virtualRef = useRef(0)
  const spinRef = useRef(0)
  const dragExtraRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const dragStateRef = useRef({ active: false, startX: 0, lastX: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [openProject, setOpenProject] = useState<number | null>(null)

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.reel-fade',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        )

        gsap.to(progressRef, {
          current: 1,
          // Segments ease individually (smoothstep per keyframe), so the
          // master progress runs linear to avoid double-easing stalls.
          duration: 3.4,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        })
      }, sectionRef)
      return () => ctx.revert()
    },
    { scope: sectionRef }
  )

  // Navigation counts in ring slots (each project occupies two opposite
  // slots); the active project is slot % COUNT.
  const goTo = (virtualSlot: number) => {
    virtualRef.current = virtualSlot
    setIndex((((virtualSlot % SLOTS) + SLOTS) % SLOTS) % COUNT)
    gsap.killTweensOf(spinRef)
    gsap.to(spinRef, { current: -virtualSlot * STEP, duration: 1.15, ease: 'power3.out' })
  }

  const go = (delta: number) => goTo(virtualRef.current + delta)

  const shortestSlotDiff = (target: number) => {
    const curSlot = ((virtualRef.current % SLOTS) + SLOTS) % SLOTS
    let d = target - curSlot
    while (d > SLOTS / 2) d -= SLOTS
    while (d < -SLOTS / 2) d += SLOTS
    return d
  }

  /* Frame click: rotate to the clicked slot and open its project card. */
  const selectSlot = (j: number) => {
    goTo(virtualRef.current + shortestSlotDiff(j))
    setOpenProject(j % COUNT)
  }

  /* Jump to a project (dots) — nearest of its two slots on the ring. */
  const selectProject = (i: number) => {
    const a = shortestSlotDiff(i)
    const b = shortestSlotDiff(i + COUNT)
    goTo(virtualRef.current + (Math.abs(a) <= Math.abs(b) ? a : b))
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointerRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    if (dragStateRef.current.active) {
      const dx = e.clientX - dragStateRef.current.lastX
      dragStateRef.current.lastX = e.clientX
      dragExtraRef.current += dx * 0.0028
    }
  }

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return
    gsap.killTweensOf(spinRef)
    dragStateRef.current = { active: true, startX: e.clientX, lastX: e.clientX }
    setIsDragging(true)
  }

  const endDrag = () => {
    if (!dragStateRef.current.active) return
    dragStateRef.current.active = false
    setIsDragging(false)
    // Fold the live drag rotation into the base spin, then let one tween
    // glide the band to the nearest (or flicked-to) frame.
    const extra = dragExtraRef.current
    spinRef.current += extra
    dragExtraRef.current = 0
    let delta = Math.round(-extra / STEP)
    if (delta === 0 && Math.abs(extra) > 0.14) delta = extra < 0 ? 1 : -1
    goTo(virtualRef.current + delta)
  }

  const active = portfolioProjects[index]

  return (
    <section ref={sectionRef} id="reel" className="relative w-full overflow-hidden py-14 md:py-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #04070f 0%, #0a1430 38%, #14315f 70%, #29508d 92%, #0a1226 100%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background: `radial-gradient(ellipse 55% 45% at 50% 45%, ${accent}22, transparent 70%)` }}
      />

      <div className="relative z-10 w-full px-2 sm:px-4">
        <div
          className="relative h-[62vh] min-h-[460px] max-h-[700px] w-full touch-none"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {/* Title overlays the top of the band, like the reference. */}
          <div className="reel-fade pointer-events-none absolute inset-x-0 top-2 z-10 text-center">
            <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: accent }}>
              <span className="w-8 h-px" style={{ background: `${accent}66` }} /> The Reel
              <span className="w-8 h-px" style={{ background: `${accent}66` }} />
            </span>
            <h3 className="font-serif-accent italic text-4xl sm:text-5xl md:text-6xl text-white" style={{ textShadow: '0 4px 40px rgba(0,0,0,.9)' }}>
              {active.title}
            </h3>
            <div className="mt-2.5 font-mono text-[11px] tracking-[0.22em] text-white/60 uppercase" style={{ textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>
              {active.category} · {active.company} ·{' '}
              <button
                type="button"
                onClick={() => setOpenProject(index)}
                className="pointer-events-auto inline-flex items-center gap-1.5 uppercase tracking-[0.22em] hover:text-white transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                style={{ color: accent }}
              >
                View project <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <FilmReelScene
            progressRef={progressRef}
            activeRef={indexRef}
            spinRef={spinRef}
            dragExtraRef={dragExtraRef}
            pointerRef={pointerRef}
            accent={accent}
            onSelect={selectSlot}
          />

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="reel-fade absolute left-1 bottom-1 sm:left-2 sm:bottom-2 w-11 h-11 rounded-lg border border-white/10 bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="reel-fade absolute right-1 bottom-1 sm:right-2 sm:bottom-2 w-11 h-11 rounded-lg border border-white/10 bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          >
            →
          </button>

          <div className="reel-fade absolute inset-x-0 bottom-2 z-10 flex items-center justify-center pointer-events-none">
            {portfolioProjects.map((p, i) => (
              <button
                key={p.title}
                type="button"
                aria-label={`Show ${p.title}`}
                onClick={() => selectProject(i)}
                className="pointer-events-auto group/dot px-1.5 py-3 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white/80 rounded"
              >
                <span
                  className="block h-1.5 rounded-full transition-all"
                  style={{ width: i === index ? 20 : 6, background: i === index ? accent : 'rgba(255,255,255,0.35)' }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <ProjectCardModal
        project={openProject === null ? null : portfolioProjects[openProject]}
        accent={accent}
        onClose={() => setOpenProject(null)}
      />
    </section>
  )
}
