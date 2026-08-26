'use client'

import { Component, forwardRef, Suspense, useEffect, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { INTRO_EXIT, MODELS, SCENE_ENTERS, SCENE_EXITS, CTA_ENTER, SCENES } from './config'

/*
  One persistent WebGL stage for the whole hero journey — the same
  architecture animejs.com uses (one canvas, never unmounted, objects
  swapped and re-lit per chapter) rather than a canvas per scene.

  Every model is a real, user-downloaded, CC-BY Sketchfab asset (draco
  compressed at build time; decoder self-hosted under /draco/). Nothing
  here builds geometry — this file only loads, normalizes, lights and
  choreographs finished artwork:

  - Normalization: every GLB arrives at an unknown scale/origin/orientation,
    so each object is auto-centered, scaled to a fixed world diameter, and
    rotated by a per-model correction (rotationOffset) so its front faces
    the camera regardless of how the artist exported it.
  - Assemble/explode: each object's mesh parts get a radial offset plus a
    tumble rotation from the object's center; a single 0..1 assemble scalar
    lerps parts home with a per-part stagger through a deliberate
    scattered-hold -> assemble -> held -> explode arc (a story beat, not an
    instant snap).
  - Rotation and assemble/explode are both direct functions of scroll
    progress within the beat (bidirectional — scrolling back reverses
    them), not time-based idles, so the piece reads as scroll-controlled.
  - Screen swap: objects with a `screen` config get their baked
    monitor/phone-glass texture replaced with a real per-phase video
    (reusing the same clips already used elsewhere on the page), scrubbed
    forward-only from local scroll progress — scrolling back holds the
    current frame instead of visibly rewinding.
  - The scroll timeline only writes one number (global progress in
    timeline units) into a ref via the imperative handle; all mapping to
    beats happens here, reading the same shared config as the orchestrator
    and ring, so the three layers cannot desync.
*/

export interface HeroStageHandle {
  setProgress: (units: number) => void
}

interface StageState {
  units: number
}

// Sized so every part stays inside the ring HUD's on-screen circle even at
// full explode. The ring's CSS size (min(74vh,92vw)) changes a lot with
// viewport aspect ratio — ResponsiveCamera (below) keeps the camera's FOV
// in sync with that same formula so this world-space footprint always
// maps to the ring's actual on-screen size, on any viewport.
const EXPLODE_RADIUS = 0.95
const TARGET_DIAMETER = 1.7
// Worst-case on-screen footprint (diameter + explode radius both sides)
// used to solve the camera's FOV — see ResponsiveCamera.
const SAFE_WORLD_DIAMETER = TARGET_DIAMETER + EXPLODE_RADIUS * 2
const CAMERA_DISTANCE = 5.6
interface ScreenConfig {
  targetName: string
  videoSrc: string
}

// Which beat window each stage object belongs to (index into SCENE_ENTERS).
// rotationOffset corrects each artist's arbitrary export orientation so the
// object's front faces the camera; screen swaps a mesh/material's baked
// texture for a scroll-scrubbed video once that object comes on stage.
const OBJECTS: {
  key: keyof typeof MODELS
  beat: number
  backdrop?: boolean
  rotationOffset?: [number, number, number]
  screen?: ScreenConfig
  // Degrees the object is turned away from camera while scattered, turning
  // to face dead-on as it assembles (tied to 1-assemble, not to elapsed
  // scroll) — so it's only ever off-axis during the brief scatter/explode
  // transitions, and sits facing the camera for the long held-assembled
  // majority of the beat.
  turnInDeg?: number
  // Extra multiplier on top of the standard normalized scale, for objects
  // that read as too small at the shared TARGET_DIAMETER.
  scaleBoost?: number
}[] = [
  { key: 'corkboard', beat: 0, turnInDeg: 18 },
  // Raw bbox is thin along X (0.38) vs Y/Z (2.4 / 2.9), not Z like most —
  // rotate -90° on Y to bring that thin face-axis to point at the camera.
  { key: 'clapperboard', beat: 1, rotationOffset: [0, -Math.PI / 2, 0], turnInDeg: 50 },
  { key: 'studio', beat: 1, backdrop: true },
  { key: 'workstation', beat: 2, rotationOffset: [0, -Math.PI / 2, 0], screen: { targetName: 'MY SCREEN_MY SCREEN_0', videoSrc: '/videos/post-production.mp4' }, scaleBoost: 1.2, turnInDeg: 50 },
  { key: 'phone', beat: 3, screen: { targetName: 'Lock_Screen', videoSrc: '/videos/dj-vinyl.mp4' }, turnInDeg: 50 },
]

function beatWindow(beat: number) {
  return { enter: SCENE_ENTERS[beat], exit: SCENE_EXITS[beat] }
}

// Finds a screen target by object name first (e.g. a mesh literally named
// "MY SCREEN"), falling back to a material-name match — some artists name
// the material rather than the mesh (e.g. a phone's glass named "Lock_Screen").
function findScreenMesh(root: THREE.Object3D, targetName: string): THREE.Mesh | null {
  let found: THREE.Mesh | null = null
  root.traverse((o) => {
    if (found) return
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    if (mesh.name === targetName) {
      found = mesh
      return
    }
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    if (mats.some((m) => m?.name === targetName)) found = mesh
  })
  return found
}

interface PartInfo {
  obj: THREE.Object3D
  home: THREE.Vector3
  dir: THREE.Vector3
  phase: number
  homeQuat: THREE.Quaternion
  scatterQuat: THREE.Quaternion
  homeScale: THREE.Vector3
  anchor: boolean
  invScale: THREE.Vector3
}

function StageObject({
  url,
  beat,
  backdrop = false,
  rotationOffset,
  turnInDeg,
  scaleBoost = 1,
  screen,
  stateRef,
  playExitAnimation = false,
}: {
  url: string
  beat: number
  backdrop?: boolean
  rotationOffset?: [number, number, number]
  turnInDeg?: number
  scaleBoost?: number
  screen?: ScreenConfig
  stateRef: React.MutableRefObject<StageState>
  playExitAnimation?: boolean
}) {
  const { scene, animations } = useGLTF(url, '/draco/')
  const groupRef = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, groupRef)
  const parts = useRef<PartInfo[]>([])
  const allMats = useRef<THREE.Material[]>([])
  const lastAssemble = useRef<number>(-1)
  const clapFired = useRef(false)

  // Video-screen state — created lazily the first time this object comes
  // on stage, never eagerly, to keep the initial hero load light.
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null)

  // Normalize + index parts once.
  const prepared = useMemo(() => {
    if (rotationOffset) scene.rotation.set(rotationOffset[0], rotationOffset[1], rotationOffset[2])
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = ((backdrop ? TARGET_DIAMETER * 1.7 : TARGET_DIAMETER) / maxDim) * scaleBoost
    scene.position.sub(center)
    if (backdrop) {
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.isMesh) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => {
            const std = m as THREE.MeshStandardMaterial
            if (std.color) std.color.multiplyScalar(0.15)
          })
        }
      })
    }
    return { scale }
  }, [scene, backdrop, rotationOffset, scaleBoost])

  useEffect(() => {
    const raw: { obj: THREE.Object3D; vol: number; homeQuat: THREE.Quaternion }[] = []
    let maxVol = -1
    let anchorIdx = -1
    let namedAnchorIdx = -1
    const matsSet = new Set<THREE.Material>()
    
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh
        const size = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3())
        const vol = size.x * size.y * size.z
        raw.push({ obj: o, vol, homeQuat: o.quaternion.clone() })
        if (vol > maxVol) {
          maxVol = vol
          anchorIdx = raw.length - 1
        }
        if (namedAnchorIdx < 0 && /base|body|chassis|frame/i.test(o.name)) {
          namedAnchorIdx = raw.length - 1
        }
        
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          m.transparent = true
          matsSet.add(m)
        })
        mesh.frustumCulled = false
      }
    })
    if (namedAnchorIdx >= 0) anchorIdx = namedAnchorIdx
    allMats.current = Array.from(matsSet)

    // Scatter direction is assigned by index on a Fibonacci sphere — NOT
    // derived from each part's actual mesh position. Small pinned items
    // (a paper, a photo, a sticky note) often sit close together on the
    // real object, so a position-derived direction sends them all flying
    // the same way and they read as one clump. An evenly distributed
    // direction guarantees each piece visibly separates from the others.
    const nonAnchorCount = Math.max(1, raw.length - (anchorIdx >= 0 ? 1 : 0))
    const golden = Math.PI * (3 - Math.sqrt(5))
    let scatterIndex = 0

    const list: PartInfo[] = raw.map((r, idx) => {
      const anchor = idx === anchorIdx && raw.length > 1
      let dir = new THREE.Vector3(1, 0, 0)
      if (!anchor) {
        const n = scatterIndex++
        const y = nonAnchorCount > 1 ? 1 - (n / (nonAnchorCount - 1)) * 2 : 0
        const radius = Math.sqrt(Math.max(0, 1 - y * y))
        const theta = golden * n
        dir = new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).normalize()
      }
      const phase = nonAnchorCount > 1 ? scatterIndex / nonAnchorCount : 0.5
      // Deterministic scatter tumble derived from phase — no Math.random(),
      // so the choreography is stable across remounts.
      const axis = new THREE.Vector3(
        Math.sin(phase * 11.3),
        Math.cos(phase * 7.1),
        Math.sin(phase * 5.9 + 1.3)
      ).normalize()
      const angle = (0.6 + phase * 0.8) * Math.PI
      const scatterQuat = r.homeQuat.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axis, angle))
      
      const worldScale = new THREE.Vector3()
      if (r.obj.parent) r.obj.parent.getWorldScale(worldScale)
      else worldScale.set(1, 1, 1)

      return {
        obj: r.obj,
        home: r.obj.position.clone(),
        dir,
        phase,
        homeQuat: r.homeQuat,
        scatterQuat,
        homeScale: r.obj.scale.clone(),
        anchor,
        invScale: new THREE.Vector3(1 / (worldScale.x || 1), 1 / (worldScale.y || 1), 1 / (worldScale.z || 1)),
      }
    })

    parts.current = list
  }, [scene])

  // Initialize video screen and material eagerly to prevent shader
  // recompilation lag spikes mid-scroll. We create the video and material
  // once on mount. It stays paused until the object becomes visible.
  useEffect(() => {
    if (!screen) return
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.loop = true
    video.preload = 'auto' // Must be auto so it's fully ready before scrolling down
    video.src = screen.videoSrc
    video.style.position = 'fixed'
    video.style.width = '2px'
    video.style.height = '2px'
    video.style.opacity = '0'
    video.style.pointerEvents = 'none'
    video.addEventListener('canplay', () => {
      // Don't auto-play here; useFrame handles playing it when visible
    })
    document.body.appendChild(video)
    videoRef.current = video

    const target = findScreenMesh(scene, screen.targetName)
    if (target) {
      const texture = new THREE.VideoTexture(video)
      texture.colorSpace = THREE.SRGBColorSpace
      videoTextureRef.current = texture
      const srcMat = (Array.isArray(target.material) ? target.material[0] : target.material) as THREE.MeshStandardMaterial
      const mat = srcMat.clone() as THREE.MeshStandardMaterial
      mat.map = texture
      if (srcMat.emissiveMap) {
        mat.emissive = new THREE.Color(0xffffff)
        mat.emissiveMap = texture
        mat.emissiveIntensity = Math.max(srcMat.emissiveIntensity, 1.2)
      }
      mat.needsUpdate = true
      target.material = mat
    }

    return () => {
      if (video) {
        video.pause()
        video.remove()
      }
      videoTextureRef.current?.dispose()
    }
  }, [screen, scene])

  const framesRef = useRef(0)

  useFrame(({ clock }) => {
    framesRef.current++
    const group = groupRef.current
    if (!group) return

    // Force every object to render on the very first frame (tucked far behind the camera)
    // to guarantee ThreeJS uploads all geometries to the GPU immediately on load,
    // rather than blocking the main thread during the scroll transitions.
    if (framesRef.current < 2) {
      group.visible = true
      group.position.z = -9999
      return
    }

    const u = stateRef.current.units
    const { enter, exit } = beatWindow(beat)
    const isClosing = u >= CTA_ENTER

    // Visibility window (small overlap tolerance for the crossfade feel)
    const visible = u >= enter - 0.25 && u <= exit + 0.35 && !isClosing
    group.visible = visible
    if (!visible) return

    const span = exit - enter
    const t = THREE.MathUtils.clamp((u - enter) / span, 0, 1)

    // Deliberate story arc for the scattered pieces
    let assemble: number
    if (t < 0.08) assemble = 0
    else if (t < 0.35) assemble = THREE.MathUtils.smoothstep((t - 0.08) / 0.27, 0, 1)
    else if (t > 0.75) assemble = 1 - THREE.MathUtils.smoothstep((t - 0.75) / 0.25, 0, 1)
    else assemble = 1

    // Whole-object entrance/exit scale + drift
    const inS = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(t / 0.25, 0, 1), 0, 1)
    const outS = 1 - THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((t - 0.75) / 0.25, 0, 1), 0, 1)
    
    // A separate, much quicker fade just for opacity 
    const fadeIn = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((t - 0.02) / 0.13, 0, 1), 0, 1)
    const fadeOut = 1 - THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((t - 0.85) / 0.13, 0, 1), 0, 1)
    const fadeOpacity = Math.min(fadeIn, fadeOut)

    // Vastly faster opacity update: iterate unique materials once, not per-mesh
    for (let i = 0; i < allMats.current.length; i++) {
      allMats.current[i].opacity = fadeOpacity
    }

    const explodeScale = backdrop ? 0.15 : 1
    
    // Performance optimization: if assemble is 1 and was 1 last frame, 
    // the object is static on screen. Skip iterating 685 parts!
    if (assemble !== 1 || lastAssemble.current !== 1) {
      for (let i = 0; i < parts.current.length; i++) {
        const p = parts.current[i]
  
        if (p.anchor) {
          p.obj.position.copy(p.home)
          p.obj.quaternion.copy(p.homeQuat)
          continue
        }
        const partAssemble = THREE.MathUtils.clamp(assemble * 1.35 - p.phase * 0.35, 0, 1)
        const off = (1 - partAssemble) * EXPLODE_RADIUS * explodeScale
        
        p.obj.position.set(
          p.home.x + p.dir.x * off * p.invScale.x,
          p.home.y + p.dir.y * off * p.invScale.y,
          p.home.z + p.dir.z * off * p.invScale.z
        )
        
        p.obj.quaternion.slerpQuaternions(p.scatterQuat, p.homeQuat, partAssemble)
        if (!backdrop) {
          const flightBoost = 1 + (1 - partAssemble) * 0.5
          p.obj.scale.set(p.homeScale.x * flightBoost, p.homeScale.y * flightBoost, p.homeScale.z * flightBoost)
        }
      }
    }
    lastAssemble.current = assemble

    const s = prepared.scale * (0.65 + 0.35 * Math.min(inS, outS))
    group.scale.setScalar(s)

    const drift = (1 - outS) * 0.9 - (1 - inS) * 0.9
    group.position.x = backdrop ? 0 : drift
    group.position.z = backdrop ? -4.5 : 0
    group.position.y = (backdrop ? -0.2 : 0) + Math.sin(clock.elapsedTime * 0.7 + beat * 2) * 0.05

    // Rotation sequence: static while parts fly together (0–18%, all the
    // visual interest is the assembly itself) — then, once fully formed, a
    // reveal-turn flourish (18–42%) — then locked dead-on-facing for the
    // held majority (42–85%) — then it turns again as it disassembles and
    // dims out, handing off to the next object.
    if (!backdrop && turnInDeg !== undefined) {
      const rad = THREE.MathUtils.degToRad(turnInDeg)
      let turn: number
      if (t < 0.22) turn = 0
      else if (t < 0.35) turn = THREE.MathUtils.smoothstep((t - 0.22) / 0.13, 0, 1)
      else if (t < 0.50) turn = 1 - THREE.MathUtils.smoothstep((t - 0.35) / 0.15, 0, 1)
      else if (t < 0.75) turn = 0
      else turn = THREE.MathUtils.smoothstep((t - 0.75) / 0.25, 0, 1)
      group.rotation.y = rad * turn
    }

    // The clapperboard's authored snap animation fires as it hands off.
    if (playExitAnimation && actions) {
      const names = Object.keys(actions)
      if (names.length) {
        const action = actions[names[0]]!
        if (t > 0.8 && !clapFired.current) {
          clapFired.current = true
          action.reset()
          action.setLoop(THREE.LoopOnce, 1)
          action.clampWhenFinished = true
          action.play()
        }
        if (t < 0.6) clapFired.current = false
      }
    }

    // Screen video: play when visible, pause when not.
    if (screen && videoRef.current) {
      const video = videoRef.current
      if (visible && video.paused) {
        video.play().catch(() => {})
      } else if (!visible && !video.paused) {
        video.pause()
      }
    }
  })

  return (
    <group ref={groupRef} visible={true}>
      <primitive object={scene} />
    </group>
  )
}

// Keeps the camera's FOV in sync with the ring HUD's own CSS sizing
// formula (min(74vh,92vw)) so the object's worst-case on-screen footprint
// always maps to the ring's actual on-screen size — without this, a fixed
// FOV looks right on a wide desktop viewport (where the ring is a small
// fraction of the frame) but overflows badly on a narrow mobile viewport
// (where the ring is up to 92% of the width).
function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (!cam.isPerspectiveCamera) return
    const targetPx = Math.min(0.74 * size.height, 0.92 * size.width)
    const halfHeight = (SAFE_WORLD_DIAMETER * 1.15 * size.height) / (2 * targetPx)
    cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfHeight / CAMERA_DISTANCE))
    cam.aspect = size.width / size.height
    cam.updateProjectionMatrix()
  }, [camera, size])

  return null
}

// Pointer-driven parallax — the whole stage leans subtly toward the
// cursor (damped, frame-rate independent), so the piece responds to the
// visitor even between scroll beats. Listens on window, not the canvas,
// because overlays cover most of the viewport.
function CameraParallax() {
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame(({ camera }, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x * 0.45, 3, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.35 - target.current.y * 0.3, 3, delta)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function AccentLight({ stateRef }: { stateRef: React.MutableRefObject<StageState> }) {
  const lightRef = useRef<THREE.PointLight>(null)
  const target = useMemo(() => new THREE.Color(SCENES[0].color), [])

  useFrame((_, delta) => {
    const light = lightRef.current
    if (!light) return
    const u = stateRef.current.units
    let idx = 0
    for (let i = 0; i < SCENE_ENTERS.length; i++) if (u >= SCENE_ENTERS[i]) idx = i
    target.set(SCENES[idx].color)
    light.color.lerp(target, Math.min(1, delta * 3))
    // The smartphone's black-glass body needs a stronger key than the rest.
    light.intensity = u < INTRO_EXIT ? 0 : idx === 3 ? 40 : 26
  })

  return <pointLight ref={lightRef} position={[3, 2.5, 3]} intensity={0} distance={14} decay={2} />
}

class StageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

const HeroStage = forwardRef<HeroStageHandle, { className?: string }>(function HeroStage({ className }, ref) {
  const stateRef = useRef<StageState>({ units: 0 })

  useImperativeHandle(
    ref,
    () => ({
      setProgress(units: number) {
        stateRef.current.units = units
        if (process.env.NODE_ENV !== 'production') {
          let idx = -1
          for (let i = 0; i < SCENE_ENTERS.length; i++) if (units >= SCENE_ENTERS[i]) idx = i
          ;(window as unknown as Record<string, unknown>).__stageState = {
            units,
            beat: units >= CTA_ENTER ? 'closing' : units < INTRO_EXIT ? 'intro' : idx,
          }
        }
      },
    }),
    []
  )

  return (
    <Canvas
      className={className}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.35, 5.6], fov: 40 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene, camera }) => {
        // Pre-compile all shaders immediately so the first time a beat's
        // model becomes visible, it doesn't drop frames compiling materials.
        gl.compile(scene, camera)
      }}
    >
      <fog attach="fog" args={['#0B0C0E', 8, 16]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} color="#fff5e8" />
      <directionalLight position={[-5, 2, 4]} intensity={0.5} color="#dbeafe" />
      <AccentLight stateRef={stateRef} />
      <ResponsiveCamera />
      <CameraParallax />
      <StageErrorBoundary>
        <Suspense fallback={null}>
          {OBJECTS.map((o) => (
            <StageObject
              key={o.key}
              url={MODELS[o.key]}
              beat={o.beat}
              backdrop={o.backdrop}
              rotationOffset={o.rotationOffset}
              turnInDeg={o.turnInDeg}
              scaleBoost={o.scaleBoost}
              screen={o.screen}
              stateRef={stateRef}
              playExitAnimation={o.key === 'clapperboard'}
            />
          ))}
        </Suspense>
      </StageErrorBoundary>
    </Canvas>
  )
})

Object.values(MODELS).forEach((m) => useGLTF.preload(m, '/draco/'))

export default HeroStage
