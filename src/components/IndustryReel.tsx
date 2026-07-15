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

gsap.registerPlugin(ScrollTrigger)

const FRAME_W = 2.6
const FRAME_H = 1.7
const RAIL_GAP = 0.15
const RAIL_H = 0.22
const COUNT = portfolioProjects.length

/*
  The ribbon's shape never changes — a single S-curve that dips and rises
  in real depth (Z), not just a flat bow. That depth variation is what
  gives each frame a different perspective skew along the strip (some
  face-on, some sharply keystoned), matching a physical filmstrip caught
  mid-wave instead of a flat curved plane. What animates is the whole
  ribbon's rigid transform: it starts small, distant and rotated ~80°
  off-axis (reading as a thin diagonal sliver, exactly like a wide strip
  seen almost edge-on) and flies to identity as the section scrolls in —
  a real cinematic fly-in rather than a geometry deformation.
*/
const CURVE_POINTS = [
  new THREE.Vector3(-9.2, 1.85, 1.3),
  new THREE.Vector3(-4.6, 0.85, -1.3),
  new THREE.Vector3(0, 0.3, 0.9),
  new THREE.Vector3(4.6, 0.95, -1.3),
  new THREE.Vector3(9.2, 1.9, 1.1),
]

const START_POS = new THREE.Vector3(5.7, 4.6, -8.2)
const START_QUAT = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.16, 1.32, -0.4, 'XYZ'))
const START_SCALE = 0.48
const END_POS = new THREE.Vector3(0, 0, 0)
const END_QUAT = new THREE.Quaternion()
const END_SCALE = 1

const worldUp = new THREE.Vector3(0, 1, 0)
const worldFallback = new THREE.Vector3(0, 0, 1)

function basisAt(curve: THREE.CatmullRomCurve3, u: number) {
  const point = curve.getPointAt(u)
  const tangent = curve.getTangentAt(u).normalize()
  let up = worldUp.clone().sub(tangent.clone().multiplyScalar(tangent.dot(worldUp)))
  if (up.lengthSq() < 1e-6) up = worldFallback.clone().sub(tangent.clone().multiplyScalar(tangent.dot(worldFallback)))
  up.normalize()
  const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()
  return { point, tangent, up, normal }
}

function quaternionFromBasis(x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3) {
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
}

/* Perforated sprocket-hole strip texture, tiled along each rail. */
function useSprocketTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#05070c'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#e8ecf2'
    const holeW = 46
    const holeH = 34
    const r = 8
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
    return tex
  }, [])
}

function buildRailGeometry(curve: THREE.CatmullRomCurve3, side: 1 | -1, samples: number) {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const offset = side * (FRAME_H / 2 + RAIL_GAP)
  const uRepeat = 16

  for (let i = 0; i <= samples; i++) {
    const u = i / samples
    const { point, up } = basisAt(curve, u)
    const center = point.clone().addScaledVector(up, offset)
    const top = center.clone().addScaledVector(up, RAIL_H / 2)
    const bottom = center.clone().addScaledVector(up, -RAIL_H / 2)
    positions.push(top.x, top.y, top.z, bottom.x, bottom.y, bottom.z)
    uvs.push(u * uRepeat, 1, u * uRepeat, 0)
    if (i < samples) {
      const a = i * 2
      const b = a + 1
      const c = a + 2
      const d = a + 3
      indices.push(a, b, c, b, d, c)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

interface RibbonInputRefs {
  progressRef: MutableRefObject<number>
  activeRef: MutableRefObject<number>
  dragExtraRef: MutableRefObject<number>
  pointerRef: MutableRefObject<{ x: number; y: number }>
}

function FilmRibbon({
  progressRef,
  activeRef,
  dragExtraRef,
  pointerRef,
  accent,
  onSelect,
}: RibbonInputRefs & { accent: string; onSelect: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null)
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

  const curve = useMemo(() => new THREE.CatmullRomCurve3(CURVE_POINTS, false, 'catmullrom', 0.6), [])

  const frameTransforms = useMemo(
    () =>
      portfolioProjects.map((_, i) => {
        const u = (i + 0.5) / COUNT
        const { point, tangent, up, normal } = basisAt(curve, u)
        return { point, quat: quaternionFromBasis(tangent, up, normal), bezelPoint: point.clone().addScaledVector(normal, -0.02) }
      }),
    [curve]
  )

  const topGeo = useMemo(() => buildRailGeometry(curve, 1, 140), [curve])
  const bottomGeo = useMemo(() => buildRailGeometry(curve, -1, 140), [curve])

  useFrame((state) => {
    const eased = progressRef.current
    if (groupRef.current) {
      // Idle bob + mouse parallax + drag spin only fade in once the reel
      // has (mostly) arrived, so they never fight the fly-in itself.
      const t = state.clock.elapsedTime
      const bobY = Math.sin(t * 0.6) * 0.06 * eased
      const bobRotZ = Math.sin(t * 0.5 + 1.3) * 0.015 * eased
      const parallaxRotY = pointerRef.current.x * 0.12 * eased
      const parallaxRotX = -pointerRef.current.y * 0.06 * eased

      groupRef.current.position.lerpVectors(START_POS, END_POS, eased)
      groupRef.current.position.y += bobY
      groupRef.current.quaternion.copy(START_QUAT).slerp(END_QUAT, eased)
      const extra = new THREE.Euler(parallaxRotX, parallaxRotY + dragExtraRef.current * eased, bobRotZ, 'XYZ')
      groupRef.current.quaternion.multiply(new THREE.Quaternion().setFromEuler(extra))
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(START_SCALE, END_SCALE, eased))
    }

    // Highlight whichever frame is active.
    for (let i = 0; i < COUNT; i++) {
      const frame = frameRefs.current[i]
      if (!frame) continue
      const isActive = i === activeRef.current
      const targetScale = isActive ? 1.14 : 1
      frame.scale.x = THREE.MathUtils.lerp(frame.scale.x, targetScale, 0.12)
      frame.scale.y = THREE.MathUtils.lerp(frame.scale.y, targetScale, 0.12)
      const mat = frame.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isActive ? 0.1 : 0, 0.12)
      mat.color.setScalar(THREE.MathUtils.lerp(mat.color.r, isActive ? 1 : 0.5, 0.12))
    }
  })

  return (
    <group ref={groupRef}>
      {portfolioProjects.map((p, i) => (
        <group key={p.title}>
          <mesh position={frameTransforms[i].bezelPoint} quaternion={frameTransforms[i].quat}>
            <planeGeometry args={[FRAME_W + 0.14, FRAME_H + 0.14]} />
            <meshBasicMaterial color="#05070c" side={THREE.DoubleSide} />
          </mesh>
          <mesh
            position={frameTransforms[i].point}
            quaternion={frameTransforms[i].quat}
            ref={(el) => {
              frameRefs.current[i] = el
            }}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(i)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[FRAME_W, FRAME_H]} />
            <meshStandardMaterial
              map={textures[i]}
              emissive={accentColor}
              emissiveIntensity={0}
              roughness={0.55}
              metalness={0.05}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      <mesh geometry={topGeo}>
        <meshBasicMaterial map={sprocketTex} side={THREE.DoubleSide} transparent />
      </mesh>
      <mesh geometry={bottomGeo}>
        <meshBasicMaterial map={sprocketTex} side={THREE.DoubleSide} transparent />
      </mesh>
    </group>
  )
}

function FilmReelScene({
  progressRef,
  activeRef,
  dragExtraRef,
  pointerRef,
  accent,
  onSelect,
}: RibbonInputRefs & { accent: string; onSelect: (i: number) => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 10.5], fov: 44 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <pointLight position={[-6, -1, 5]} intensity={0.5} color={accent} />
      <Suspense fallback={null}>
        <FilmRibbon progressRef={progressRef} activeRef={activeRef} dragExtraRef={dragExtraRef} pointerRef={pointerRef} accent={accent} onSelect={onSelect} />
      </Suspense>
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} intensity={0.65} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}

export default function IndustryReel({ accent }: { accent: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)

  // Drag-to-spin + mouse parallax state, read every frame inside the
  // canvas without triggering React re-renders.
  const dragExtraRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const dragStateRef = useRef({ active: false, startX: 0, lastX: 0 })
  const [isDragging, setIsDragging] = useState(false)

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

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduced) {
          progressRef.current = 1
        } else {
          gsap.to(progressRef, {
            current: 1,
            duration: 2.6,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
          })
        }
      }, sectionRef)
      return () => ctx.revert()
    },
    { scope: sectionRef }
  )

  const go = (delta: number) => setIndex((i) => (i + delta + COUNT) % COUNT)
  const active = portfolioProjects[index]

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointerRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    if (dragStateRef.current.active) {
      const dx = e.clientX - dragStateRef.current.lastX
      dragStateRef.current.lastX = e.clientX
      dragExtraRef.current += dx * 0.006
    }
  }

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    gsap.killTweensOf(dragExtraRef)
    dragStateRef.current = { active: true, startX: e.clientX, lastX: e.clientX }
    setIsDragging(true)
  }

  const endDrag = () => {
    if (!dragStateRef.current.active) return
    const totalDx = dragStateRef.current.lastX - dragStateRef.current.startX
    dragStateRef.current.active = false
    setIsDragging(false)
    if (Math.abs(totalDx) > 50) go(totalDx > 0 ? -1 : 1)
    gsap.to(dragExtraRef, { current: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)' })
  }

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-20 md:py-24">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #050810 0%, #0a1226 32%, #142748 55%, #0a1226 78%, #050810 100%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background: `radial-gradient(ellipse 55% 45% at 50% 45%, ${accent}22, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="reel-fade text-center mb-4">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: accent }}>
            <span className="w-8 h-px" style={{ background: `${accent}66` }} /> The Reel
            <span className="w-8 h-px" style={{ background: `${accent}66` }} />
          </span>
          <h3 className="font-serif-accent italic text-4xl sm:text-5xl md:text-6xl text-white" style={{ textShadow: '0 4px 40px rgba(0,0,0,.85)' }}>
            {active.title}
          </h3>
          <div className="mt-3 font-mono text-[11px] tracking-[0.22em] text-white/60 uppercase" style={{ textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>
            {active.category} · {active.company} ·{' '}
            <a href="#gallery" className="inline-flex items-center gap-1.5 hover:text-white transition-colors" style={{ color: accent }}>
              View project <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div
          className="relative h-[46vh] min-h-[340px] max-h-[520px] w-full touch-none"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <FilmReelScene progressRef={progressRef} activeRef={indexRef} dragExtraRef={dragExtraRef} pointerRef={pointerRef} accent={accent} onSelect={setIndex} />

          <div className="reel-fade absolute left-1 bottom-1 sm:left-3 sm:bottom-3 flex items-center gap-3 pointer-events-none">
            <span
              className="w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[9px]"
              style={{ borderColor: `${accent}55`, color: accent, backgroundColor: 'rgba(5,7,12,0.6)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2 pointer-events-auto">
              {portfolioProjects.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  aria-label={`Show ${p.title}`}
                  onClick={() => setIndex(i)}
                  className="h-1 rounded-full transition-all"
                  style={{ width: i === index ? 20 : 7, background: i === index ? accent : 'rgba(255,255,255,0.25)' }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="reel-fade absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/15 bg-black/30 backdrop-blur-md text-white flex items-center justify-center transition-colors hover:border-white/40"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="reel-fade absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/15 bg-black/30 backdrop-blur-md text-white flex items-center justify-center transition-colors hover:border-white/40"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
