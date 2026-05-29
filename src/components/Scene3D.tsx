'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function Clapperboard() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + 0.3
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }
  })

  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0B1428', roughness: 0.3, metalness: 0.7 }), [])
  const blueMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00AEEF', emissive: '#00AEEF', emissiveIntensity: 0.3, roughness: 0.2, metalness: 0.8 }), [])
  const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#F7F8FF', roughness: 0.5, metalness: 0.3 }), [])

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[-3.5, 0.5, -2]} scale={0.7}>
        {/* Bottom board */}
        <mesh position={[0, 0, 0]} material={darkMat}>
          <boxGeometry args={[2.4, 0.12, 1.8]} />
        </mesh>
        {/* Top clapper */}
        <mesh position={[0, 0.2, -0.1]} rotation={[0, 0, 0.15]} material={darkMat}>
          <boxGeometry args={[2.4, 0.08, 1.6]} />
        </mesh>
        {/* Stripes on clapper */}
        {[-0.8, -0.3, 0.2, 0.7].map((x, i) => (
          <mesh key={i} position={[x, 0.25, -0.1]} rotation={[0, 0, 0.15]} material={i % 2 === 0 ? whiteMat : darkMat}>
            <boxGeometry args={[0.25, 0.09, 1.61]} />
          </mesh>
        ))}
        {/* Blue accent edge */}
        <mesh position={[0, -0.07, 0.91]} material={blueMat}>
          <boxGeometry args={[2.4, 0.02, 0.02]} />
        </mesh>
        <mesh position={[0, -0.07, -0.91]} material={blueMat}>
          <boxGeometry args={[2.4, 0.02, 0.02]} />
        </mesh>
      </group>
    </Float>
  )
}

function CameraLens() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.15
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.1
    }
  })

  const ringMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#14233E', roughness: 0.15, metalness: 0.9 }), [])
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#030305', roughness: 0.05, metalness: 1, transparent: true, opacity: 0.6 }), [])
  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00AEEF', emissive: '#00AEEF', emissiveIntensity: 0.5, transparent: true, opacity: 0.7 }), [])

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={groupRef} position={[3.5, -0.3, -1.5]} scale={0.8}>
        {/* Outer ring */}
        <mesh material={ringMat}>
          <torusGeometry args={[1.2, 0.15, 16, 48]} />
        </mesh>
        {/* Inner ring */}
        <mesh material={ringMat}>
          <torusGeometry args={[0.85, 0.08, 16, 48]} />
        </mesh>
        {/* Glass center */}
        <mesh material={glassMat}>
          <circleGeometry args={[0.8, 32]} />
        </mesh>
        {/* Blue glow ring */}
        <mesh material={glowMat}>
          <torusGeometry args={[1.0, 0.02, 8, 48]} />
        </mesh>
        {/* Focus ring marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0]} material={glowMat}>
              <boxGeometry args={[0.02, 0.06, 0.02]} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

function FilmStrip() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
      ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3
    }
  })

  const stripMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111B3A', roughness: 0.4, metalness: 0.5, transparent: true, opacity: 0.5 }), [])

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={ref} position={[0, -2.5, -4]} rotation={[0.1, 0.3, -0.1]}>
        {/* Main strip */}
        <mesh material={stripMat}>
          <boxGeometry args={[8, 0.8, 0.02]} />
        </mesh>
        {/* Sprocket holes */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i} position={[-3.5 + i * 0.47, 0.3, 0.02]} material={stripMat}>
            <boxGeometry args={[0.12, 0.12, 0.01]} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#F7F8FF" />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#00AEEF" distance={10} />
      <pointLight position={[3, -1, 2]} intensity={0.3} color="#00AEEF" distance={8} />
      <fog attach="fog" args={['#030305', 5, 18]} />

      <Clapperboard />
      <CameraLens />
      <FilmStrip />

      <Sparkles count={80} scale={15} size={1.5} speed={0.3} color="#00AEEF" opacity={0.3} />
      <Sparkles count={40} scale={12} size={1} speed={0.2} color="#F7F8FF" opacity={0.15} />
    </>
  )
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.6 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
