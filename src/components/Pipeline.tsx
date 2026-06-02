'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PenTool, Video, Edit3, Send } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'We map the idea before the camera turns on. Concept development, campaign planning, scripting, shot lists, storyboards, brand direction, production scheduling.',
    icon: PenTool,
    videoSrc: '/videos/pre-production.mp4',
    rotation: 0,
  },
  {
    num: '02',
    title: 'Production',
    desc: 'We capture visuals that feel intentional, premium, and built for attention. On-location shooting, lighting, directing, interviews, product shots, social-first content capture.',
    icon: Video,
    videoSrc: '/videos/production.mp4',
    rotation: 90,
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'We shape the story into content people actually finish watching. Editing, color grading, sound design, motion graphics, captions, VFX, platform-specific cuts.',
    icon: Edit3,
    videoSrc: '/videos/post-production.mp4',
    rotation: 180,
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'We prepare the content for the platforms where attention actually happens. Social media versions, ad-ready exports, campaign deliverables, posting strategy, analytics review.',
    icon: Send,
    videoSrc: '/videos/distribution.mp4',
    rotation: -90,
  }
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)
  const cubeRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !cubeRef.current) return

    // Calculate how much we want to scroll to complete the full rotation.
    // 4 sides, we rotate 90 degrees 3 times (from 0 to -270)
    // 300vh gives us plenty of scroll room for 3 transitions.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    })

    // Rotate the entire monolith by -270 degrees over the scroll duration
    // Adding slight scale changes to make it feel more dynamic when rotating
    tl.to(cubeRef.current, {
      rotateY: -270,
      ease: 'none',
      duration: 3, // abstract timeline duration
    })

  }, { scope: containerRef })

  // We use responsive CSS for the cube size, but we need exact pixel values for translateZ to make a perfect cube
  // A cube with width W needs translateZ of W/2. 
  // Let's use max-w-[800px] which is 800px max. On mobile it will be smaller.
  // We can use a CSS variable to handle the math perfectly.

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex items-center justify-center">
      
      {/* Ambient Lighting that reacts to the monolith */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,174,239,0.1)_0%,transparent_60%)] pointer-events-none" />

      {/* Header outside the cube */}
      <div className="absolute top-12 md:top-20 w-full text-center z-20 pointer-events-none">
        <span className="font-mono text-sm text-[#00AEEF] tracking-[0.4em] uppercase block mb-2 filter drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]">
          // Production Pipeline
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl">
          How It Works
        </h2>
      </div>

      {/* The 3D Monolith Stage */}
      <div className="relative w-full max-w-[340px] md:max-w-[700px] h-[500px] md:h-[600px] mt-12" style={{ perspective: '2000px' }}>
        
        {/* The Rotating Cube Container */}
        <div 
          ref={cubeRef}
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg)' }}
        >
          
          <style dangerouslySetInnerHTML={{__html: `
            .monolith-face {
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 2rem;
              overflow: hidden;
              border: 1px solid rgba(255,255,255,0.15);
              background: rgba(255,255,255,0.03);
              backdrop-filter: blur(20px);
              box-shadow: 0 0 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,174,239,0.1);
              backface-visibility: hidden;
            }
            .monolith-front { transform: rotateY(0deg) translateZ(170px); }
            .monolith-right { transform: rotateY(90deg) translateZ(170px); }
            .monolith-back { transform: rotateY(180deg) translateZ(170px); }
            .monolith-left { transform: rotateY(-90deg) translateZ(170px); }
            
            @media (min-width: 768px) {
              .monolith-front { transform: rotateY(0deg) translateZ(350px); }
              .monolith-right { transform: rotateY(90deg) translateZ(350px); }
              .monolith-back { transform: rotateY(180deg) translateZ(350px); }
              .monolith-left { transform: rotateY(-90deg) translateZ(350px); }
            }
          `}} />

          {steps.map((step, i) => {
            const Icon = step.icon
            const faceClass = i === 0 ? 'monolith-front' : i === 1 ? 'monolith-right' : i === 2 ? 'monolith-back' : 'monolith-left'

            return (
              <div key={i} className={`monolith-face ${faceClass} flex flex-col md:flex-row group`}>
                
                {/* Video Background / Top Half */}
                <div className="relative w-full h-[40%] md:h-full md:w-[45%] overflow-hidden shrink-0">
                  <video
                    src={step.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#030305] via-[#030305]/40 to-transparent" />
                </div>

                {/* Content Side */}
                <div className="relative w-full h-[60%] md:h-full md:w-[55%] p-6 md:p-12 flex flex-col justify-center bg-[#030305]/80">
                  
                  <div className="flex items-center justify-between mb-4 md:mb-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/30 flex items-center justify-center text-[#00AEEF] shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                      <Icon strokeWidth={1.5} className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <span className="font-mono text-2xl md:text-4xl text-[#00AEEF]/30 font-bold tracking-tighter">
                      {step.num}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter drop-shadow-md">
                    {step.title}
                  </h3>
                  
                  <p className="text-white/60 text-sm md:text-lg leading-relaxed font-light">
                    {step.desc}
                  </p>
                  
                </div>

              </div>
            )
          })}
        </div>
      </div>
      
    </section>
  )
}
