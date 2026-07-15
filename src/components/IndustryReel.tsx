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
const FRAME_GAP = 0.34
const RAIL_GAP = 0.16
const RAIL_H = 0.22
const COUNT = portfolioProjects.length

/*
  The reel is modelled as an actual roll of film: frames sit at radius R
  around a winding axis N, with tangent = circumferential direction and
  facing = radial direction (pointing outward from the roll), exactly like
  a physical strip wound around a spindle. COILED = small radius, many
  turns, axis tilted diagonally (reads as a thin distant sliver, edge-on).
  FLAT = huge radius, a sliver of one turn (reads as a gently bowed strip
  facing the camera). Progress (0-1) slerps the axis orientation and lerps
  the radius + center between the two, so the reel visibly unrolls as it
  flies in.
*/
const R_COILED = 3.1
const R_FLAT = 17
const SPIN_COILED = 5.4

/*
  FOCUS_* is where the visible cluster of frames should actually sit in
  world space (near the camera, in the frustum). The circle CENTER that
  the frames revolve around is derived from that focus point, offset
  backward by the radius along the facing direction — for a huge R_FLAT
  the center itself lands far away, which is expected (only the rim,
  where the frames are, needs to be near the camera).
*/
const FOCUS_COILED = new THREE.Vector3(5.4, 4.9, -6)
const FOCUS_FLAT = new THREE.Vector3(0, 1.0, 0.4)

function orthonormalFromAxis(axis: THREE.Vector3, hint: THREE.Vector3) {
  const n = axis.clone().normalize()
  let h = hint
  if (Math.abs(n.dot(hint)) > 0.98) h = new THREE.Vector3(1, 0, 0)
  const u = new THREE.Vector3().crossVectors(h, n).normalize()
  const v = new THREE.Vector3().crossVectors(n, u).normalize()
  return { u, v, n }
}

const AXIS_COILED = new THREE.Vector3(0.62, 0.5, 0.58)
const AXIS_FLAT = new THREE.Vector3(0, 1, 0)
const { u: U_COILED, v: V_COILED, n: N_COILED } = orthonormalFromAxis(AXIS_COILED, new THREE.Vector3(0, 1, 0))
const { u: U_FLAT, v: V_FLAT, n: N_FLAT } = orthonormalFromAxis(AXIS_FLAT, new THREE.Vector3(0, 1, 0))

const CENTER_COILED = FOCUS_COILED.clone().addScaledVector(U_COILED, -R_COILED)
const CENTER_FLAT = FOCUS_FLAT.clone().addScaledVector(U_FLAT, -R_FLAT)

function quaternionFromBasis(x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3) {
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
}

const Q_COILED = quaternionFromBasis(U_COILED, V_COILED, N_COILED)
const Q_FLAT = quaternionFromBasis(U_FLAT, V_FLAT, N_FLAT)
const AXIS_X = new THREE.Vector3(1, 0, 0)
const AXIS_Y = new THREE.Vector3(0, 1, 0)
const AXIS_Z = new THREE.Vector3(0, 0, 1)

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

interface CoilState {
  center: THREE.Vector3
  U: THREE.Vector3
  V: THREE.Vector3
  N: THREE.Vector3
  R: number
  spin: number
}

function coilStateAt(eased: number): CoilState {
  const q = Q_COILED.clone().slerp(Q_FLAT, eased)
  return {
    center: CENTER_COILED.clone().lerp(CENTER_FLAT, eased),
    U: AXIS_X.clone().applyQuaternion(q),
    V: AXIS_Y.clone().applyQuaternion(q),
    N: AXIS_Z.clone().applyQuaternion(q),
    R: THREE.MathUtils.lerp(R_COILED, R_FLAT, eased),
    spin: THREE.MathUtils.lerp(SPIN_COILED, 0, eased),
  }
}

function pointOnCoil(state: CoilState, theta: number) {
  const radial = state.U.clone().multiplyScalar(Math.cos(theta)).addScaledVector(state.V, Math.sin(theta))
  const circumferential = state.U.clone().multiplyScalar(-Math.sin(theta)).addScaledVector(state.V, Math.cos(theta))
  const point = state.center.clone().addScaledVector(radial, state.R)
  return { point, radial, circumferential }
}

function buildRailGeometry(state: CoilState, thetaStart: number, thetaEnd: number, side: 1 | -1, samples: number) {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const offset = side * (FRAME_H / 2 + RAIL_GAP)
  const uRepeat = 16

  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const theta = THREE.MathUtils.lerp(thetaStart, thetaEnd, t)
    const { point } = pointOnCoil(state, theta)
    const railCenter = point.clone().addScaledVector(state.N, offset)
    const top = railCenter.clone().addScaledVector(state.N, RAIL_H / 2)
    const bottom = railCenter.clone().addScaledVector(state.N, -RAIL_H / 2)
    positions.push(top.x, top.y, top.z, bottom.x, bottom.y, bottom.z)
    uvs.push(t * uRepeat, 1, t * uRepeat, 0)
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
  const lastProgress = useRef(-1)
  const railSamples = 100

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
    const changed = Math.abs(progress - lastProgress.current) > 0.0006
    if (changed) {
      lastProgress.current = progress
      const eased = THREE.MathUtils.smoothstep(progress, 0, 1)
      const state = coilStateAt(eased)
      const anglePerFrame = (FRAME_W + FRAME_GAP) / state.R
      const half = (COUNT - 1) / 2

      for (let i = 0; i < COUNT; i++) {
        const theta = (i - half) * anglePerFrame + state.spin
        const { point, radial, circumferential } = pointOnCoil(state, theta)
        const q = quaternionFromBasis(circumferential, state.N, radial)
        const frame = frameRefs.current[i]
        const bezel = bezelRefs.current[i]
        if (frame) {
          frame.position.copy(point)
          frame.quaternion.copy(q)
        }
        if (bezel) {
          bezel.position.copy(point).addScaledVector(radial, -0.02)
          bezel.quaternion.copy(q)
        }
      }

      const pad = anglePerFrame * 0.6
      const thetaStart = -half * anglePerFrame - pad + state.spin
      const thetaEnd = half * anglePerFrame + pad + state.spin
      const newTop = buildRailGeometry(state, thetaStart, thetaEnd, 1, railSamples)
      const newBottom = buildRailGeometry(state, thetaStart, thetaEnd, -1, railSamples)
      topGeo.setAttribute('position', newTop.getAttribute('position'))
      topGeo.setAttribute('uv', newTop.getAttribute('uv'))
      topGeo.setIndex(newTop.getIndex())
      topGeo.computeVertexNormals()
      bottomGeo.setAttribute('position', newBottom.getAttribute('position'))
      bottomGeo.setAttribute('uv', newBottom.getAttribute('uv'))
      bottomGeo.setIndex(newBottom.getIndex())
      bottomGeo.computeVertexNormals()
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
  accent,
}: {
  progressRef: MutableRefObject<number>
  activeRef: MutableRefObject<number>
  accent: string
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 10.5], fov: 44 }}
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
            ease: 'power2.out',
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

        <div className="relative h-[46vh] min-h-[340px] max-h-[520px] w-full">
          <FilmReelScene progressRef={progressRef} activeRef={indexRef} accent={accent} />

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
