'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

function CinematicCamera() {
  useFrame((state) => {
    // Subtle continuous camera drift
    const t = state.clock.elapsedTime
    state.camera.position.x = Math.sin(t * 0.1) * 2
    state.camera.position.y = Math.cos(t * 0.15) * 1
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene3DWrapper() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#030305']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00AEEF" />
      <pointLight position={[-10, 0, -50]} intensity={2} color="#ffffff" distance={100} />
      
      <CinematicCamera />
      
      {/* Background Particles */}
      <Sparkles count={800} scale={100} size={2} speed={0.2} opacity={0.3} color="#00AEEF" />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0015, 0.0015)} />
      </EffectComposer>
    </Canvas>
  )
}
