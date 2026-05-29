'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Float, Text, Sparkles, Image as DreiImage, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// HTML Components
import Nav from './Nav'
import Pipeline from './Pipeline'
import Results from './Results'
import IndustryStandards from './IndustryStandards'
import Portfolio from './Portfolio'
import LeadMagnet from './LeadMagnet'
import Footer from './Footer'
import CustomCalendar from './CustomCalendar'
import LogoOrbit from './LogoOrbit'

/* 
  1. THE CAMERA CONTROLLER 
  Moves the camera through a tunnel based on scroll.
*/
function CinematicCamera() {
  const scroll = useScroll()
  useFrame((state) => {
    // Scroll offset goes from 0 to 1
    const t = scroll.offset
    // Move camera from z=10 to z=-150
    state.camera.position.z = THREE.MathUtils.lerp(10, -150, t)
    // Add subtle camera shake/sway
    state.camera.position.x = Math.sin(t * Math.PI * 10) * 2
    state.camera.position.y = Math.cos(t * Math.PI * 20) * 1
    // Roll the camera slightly as we fly
    state.camera.rotation.z = Math.sin(t * Math.PI * 4) * 0.15
  })
  return null
}

/* 
  2. HERO SECTION IN 3D 
  Shatters and flies past the camera
*/
function Hero3D() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      const t = scroll.range(0, 0.1) // active during first 10% of scroll
      // Title pulls apart and flies towards camera
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        const targetX = mesh.userData.startX + (mesh.userData.dirX * t * 30)
        const targetY = mesh.userData.startY + (mesh.userData.dirY * t * 30)
        const targetZ = t * 50
        mesh.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1)
        mesh.rotation.x += 0.01 * mesh.userData.dirX
        mesh.rotation.y += 0.01 * mesh.userData.dirY
        
        // fade out as they fly past camera
        if (mesh.material && typeof (mesh.material as any).opacity !== 'undefined') {
          ;(mesh.material as any).opacity = 1 - t
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Text userData={{ startX: -4, startY: 2, dirX: -1, dirY: 1 }} position={[-4, 2, 0]} fontSize={4} font="/fonts/Inter-Bold.woff" color="#ffffff" fillOpacity={1}>
        SLATE
      </Text>
      <Text userData={{ startX: 4, startY: -1, dirX: 1, dirY: -1 }} position={[4, -1, 0]} fontSize={4} font="/fonts/Inter-Bold.woff" color="#00AEEF" fillOpacity={1}>
        CINEMA
      </Text>
      <Text userData={{ startX: 0, startY: -4, dirX: 0, dirY: -1 }} position={[0, -4, 0]} fontSize={0.5} font="/fonts/Inter-Medium.woff" color="#8E96AA" letterSpacing={0.5} fillOpacity={1}>
        VIDEO MARKETING AT YOUR FINGERTIPS
      </Text>
    </group>
  )
}

/* 
  3. MEDIA VOID ASTEROID FIELD 
  Floating video screens in deep z-space
*/
function MediaVoid3D() {
  const groupRef = useRef<THREE.Group>(null)
  
  return (
    <group ref={groupRef} position={[0, 0, -40]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <DreiImage url="/images/portfolio-production.png" position={[-8, 4, 0]} scale={[8, 4.5]} transparent opacity={0.8} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <DreiImage url="/images/portfolio-brand.png" position={[10, -2, -10]} scale={[12, 6.75]} transparent opacity={0.6} />
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
        <DreiImage url="/images/portfolio-social.png" position={[-5, -6, -20]} scale={[6, 8]} transparent opacity={0.7} />
      </Float>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={2.5}>
        <DreiImage url="/images/portfolio-event.png" position={[12, 8, -30]} scale={[10, 5.6]} transparent opacity={0.9} />
      </Float>
      
      {/* 3D Stats */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.5}>
        <Text position={[0, 0, -15]} fontSize={8} color="#ffffff" font="/fonts/Inter-Bold.woff" fillOpacity={0.1} strokeWidth={0.02} strokeColor="#00AEEF">
          3,783,957 VIEWS
        </Text>
      </Float>
    </group>
  )
}

/* 
  4. THE 3D SCENE 
  Wraps everything together
*/
function SceneContent() {
  return (
    <>
      <color attach="background" args={['#030305']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00AEEF" />
      <pointLight position={[-10, 0, -50]} intensity={2} color="#ffffff" distance={100} />
      
      {/* Fog to obscure the end of the tunnel */}
      <fog attach="fog" args={['#030305', 10, 80]} />
      
      <CinematicCamera />
      
      {/* Floating particles everywhere */}
      <Sparkles count={500} scale={200} size={2} speed={0.4} opacity={0.3} color="#00AEEF" />

      {/* 3D Elements mapped to Z-space */}
      <Hero3D />
      <MediaVoid3D />
      {/* Post-Processing for cinematic feel */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
      </EffectComposer>

      {/* 
        5. HTML OVERLAY PAGES
        We project the existing HTML components onto the screen, 
        spaced out down the scroll timeline.
      */}
      <Scroll html style={{ width: '100vw' }}>
        <div style={{ height: '100vh' }}></div> {/* Hero is 3D, empty space to scroll past it */}
        <Pipeline />
        <div style={{ height: '100vh' }}></div> {/* Media Void is 3D */}
        <IndustryStandards />
        <Portfolio />
        <Results />
        <LogoOrbit />
        <LeadMagnet />
        <CustomCalendar />
        <Footer />
      </Scroll>
    </>
  )
}

export default function Journey3D() {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#030305] z-0">
      <Nav />
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ScrollControls pages={8} damping={0.1}>
          <SceneContent />
        </ScrollControls>
        <Preload all />
      </Canvas>
    </div>
  )
}
