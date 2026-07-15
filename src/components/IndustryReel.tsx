'use client'

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
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

const FRAME_W = 2.7
const FRAME_H = 1.75
const RAIL_GAP = 0.16
const RAIL_H = 0.22
const COUNT = portfolioProjects.length

/*
  Two control-point sets for the ribbon's CatmullRom curve: COILED is a
  tight loop up and behind the camera (the "reel" before it unravels),
  FLAT is the gentle wide arc the strip settles into once scrolled into
  view. Progress (0-1) lerps between them each animation frame.
*/
const COILED_POINTS = [
  new THREE.Vector3(6.4, 5.6, -7.5),
  new THREE.Vector3(7.6, 6.3, -8.1),
  new THREE.Vector3(8.3, 5.3, -7.7),
  new THREE.Vector3(7.5, 4.5, -8.3),
  new THREE.Vector3(6.5, 5.1, -7.9),
  new THREE.Vector3(6.4, 5.6, -7.5),
]

const FLAT_POINTS = [
  new THREE.Vector3(-8.6, 1.55, 1.3),
  new THREE.Vector3(-5.0, 0.55, 0.5),
  new THREE.Vector3(-1.6, 0.05, 0.05),
  new THREE.Vector3(1.6, 0.05, 0.05),
  new THREE.Vector3(5.0, 0.55, 0.5),
  new THREE.Vector3(8.6, 1.4, 1.2),
]

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

function quaternionFromBasis(tangent: THREE.Vector3, up: THREE.Vector3, normal: THREE.Vector3) {
  const m = new THREE.Matrix4().makeBasis(tangent, up, normal)
  return new THREE.Quaternion().setFromRotationMatrix(m)
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
    ctx.beginPath()
    const r = 8
    const x = (canvas.width - holeW) / 2
    const y = (canvas.height - holeH) / 2
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
  const uRepeat = 14

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

function FilmRibbon({
  progressRef,
  activeRef,
  accent,
}: {
  progressRef: MutableRefObject<number>
  activeRef: MutableRefObject<number>
  accent: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const frameRefs = useRef<(THREE.Mesh | null)[]>([])
  const bezelRefs = useRef<(THREE.Mesh | null)[]>([])
  const topRailRef = useRef<THREE.Mesh>(null)
  const bottomRailRef = useRef<THREE.Mesh>(null)
  const lastProgress = useRef(-1)
  const railSamples = 90

  const textures = useTexture(portfolioProjects.map((p) => p.url))
  const sprocketTex = useSprocketTexture()

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.needsUpdate = true
    })
  }, [textures])

  const accentColor = useMemo(() => new THREE.Color(accent), [accent])

  const topGeo = useMemo(() => new THREE.BufferGeometry(), [])
  const bottomGeo = useMemo(() => new THREE.BufferGeometry(), [])

  useFrame(() => {
    const progress = progressRef.current
    const changed = Math.abs(progress - lastProgress.current) > 0.0008
    if (changed) {
      lastProgress.current = progress
      const eased = THREE.MathUtils.smoothstep(progress, 0, 1)
      const points = COILED_POINTS.map((p, i) => p.clone().lerp(FLAT_POINTS[i], eased))
      const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)

      for (let i = 0; i < COUNT; i++) {
        const u = (i + 0.5) / COUNT
        const { point, tangent, up, normal } = basisAt(curve, u)
        const q = quaternionFromBasis(tangent, up, normal)
        const frame = frameRefs.current[i]
        const bezel = bezelRefs.current[i]
        if (frame) {
          frame.position.copy(point)
          frame.quaternion.copy(q)
        }
        if (bezel) {
          bezel.position.copy(point).addScaledVector(normal, -0.02)
          bezel.quaternion.copy(q)
        }
      }

      const newTop = buildRailGeometry(curve, 1, railSamples)
      const newBottom = buildRailGeometry(curve, -1, railSamples)
      topGeo.setAttribute('position', newTop.getAttribute('position'))
      topGeo.setAttribute('uv', newTop.getAttribute('uv'))
      topGeo.setIndex(newTop.getIndex())
      topGeo.computeVertexNormals()
      bottomGeo.setAttribute('position', newBottom.getAttribute('position'))
      bottomGeo.setAttribute('uv', newBottom.getAttribute('uv'))
      bottomGeo.setIndex(newBottom.getIndex())
      bottomGeo.computeVertexNormals()

      if (groupRef.current) {
        groupRef.current.rotation.y = (1 - eased) * -0.35
        const s = 0.72 + eased * 0.28
        groupRef.current.scale.setScalar(s)
      }
    }

    // Highlight whichever frame is active, independent of the fly-in progress.
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
          <mesh
            ref={(el) => {
              bezelRefs.current[i] = el
            }}
          >
            <planeGeometry args={[FRAME_W + 0.14, FRAME_H + 0.14]} />
            <meshBasicMaterial color="#05070c" side={THREE.DoubleSide} />
          </mesh>
          <mesh
            ref={(el) => {
              frameRefs.current[i] = el
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

      <mesh ref={topRailRef} geometry={topGeo}>
        <meshBasicMaterial map={sprocketTex} side={THREE.DoubleSide} transparent />
      </mesh>
      <mesh ref={bottomRailRef} geometry={bottomGeo}>
        <meshBasicMaterial map={sprocketTex} side={THREE.DoubleSide} transparent />
      </mesh>
    </group>
  )
}

function FilmReelScene({
  progressRef,
  activeRef,
  accent,
}: {
  progressRef: MutableRefObject<number>
  activeRef: MutableRefObject<number>
  accent: string
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 11], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <pointLight position={[-6, -1, 5]} intensity={0.5} color={accent} />
      <Suspense fallback={null}>
        <FilmRibbon progressRef={progressRef} activeRef={activeRef} accent={accent} />
      </Suspense>
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} intensity={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}

export default function IndustryReel({ accent }: { accent: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)

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
            duration: 2.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          })
        }
      }, sectionRef)
      return () => ctx.revert()
    },
    { scope: sectionRef }
  )

  const go = (delta: number) => setIndex((i) => (i + delta + COUNT) % COUNT)
  const active = portfolioProjects[index]

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
        <div className="reel-fade flex items-center justify-between gap-4 flex-wrap mb-6">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase" style={{ color: accent }}>
            <span className="w-8 h-px" style={{ background: `${accent}66` }} /> The Reel · Selected Work
          </span>
          <span className="font-mono text-[9.5px] tracking-[0.2em] text-white/40 border border-white/15 rounded-full px-3 py-1.5">← Drag / Click →</span>
        </div>

        <div className="relative h-[46vh] min-h-[340px] max-h-[520px] w-full">
          <FilmReelScene progressRef={progressRef} activeRef={indexRef} accent={accent} />
        </div>

        <div className="reel-fade relative text-center mt-2">
          <h3 className="font-serif-accent italic text-4xl sm:text-5xl md:text-6xl text-white" style={{ textShadow: '0 4px 40px rgba(0,0,0,.85)' }}>
            {active.title}
          </h3>
          <div className="mt-3 font-mono text-[11px] tracking-[0.22em] text-white/60 uppercase" style={{ textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>
            {active.category} · {active.company}
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.18em]" style={{ color: accent, textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>
            {active.metrics.map((m) => `${m.value} ${m.label}`).join(' · ')}
          </div>
          <p className="mt-5 max-w-md mx-auto text-sm text-white/55 font-light leading-relaxed" style={{ textShadow: '0 2px 14px rgba(0,0,0,.9)' }}>
            {active.copy}
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.03] text-white flex items-center justify-center transition-colors hover:border-white/40"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            {portfolioProjects.map((p, i) => (
              <button
                key={p.title}
                type="button"
                aria-label={`Show ${p.title}`}
                onClick={() => setIndex(i)}
                className="h-1 rounded-full transition-all"
                style={{ width: i === index ? 22 : 8, background: i === index ? accent : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.03] text-white flex items-center justify-center transition-colors hover:border-white/40"
          >
            →
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#gallery"
            className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors"
          >
            See the full case study
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
