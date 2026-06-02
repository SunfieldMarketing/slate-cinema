'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Pre-Production',
    desc: 'Concept development, campaign planning, scripting, shot lists, storyboards.',
    videoSrc: '/videos/pre-production.mp4',
    color: '#00AEEF',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'On-location shooting, lighting, directing, interviews, social-first content capture.',
    videoSrc: '/videos/production.mp4',
    color: '#a855f7',
  },
  {
    num: '03',
    title: 'Post-Production',
    desc: 'Editing, color grading, sound design, motion graphics, captions, VFX.',
    videoSrc: '/videos/post-production.mp4',
    color: '#10b981',
  },
  {
    num: '04',
    title: 'Distribution',
    desc: 'Platform-specific cuts, ad-ready exports, campaign deliverables, analytics review.',
    videoSrc: '/videos/distribution.mp4',
    color: '#f97316',
  }
]

export default function Pipeline() {
  const containerRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    })

    steps.forEach((_, index) => {
      // 1. Ink Drop Expands (animate the CSS variable --mask-size from 0% to 150%)
      tl.fromTo(`.step-container-${index}`,
        { '--mask-size': '0%' },
        { '--mask-size': '150%', duration: 2, ease: 'power2.inOut' }
      )
      
      // 2. Text "Bleeds" In (Blur + Opacity)
      tl.fromTo(`.step-text-${index}`,
        { opacity: 0, filter: 'blur(20px)', scale: 1.1 },
        { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.5, ease: 'power3.out' },
        "-=1.5" // Overlap heavily with ink expansion
      )

      // 3. Hold for reading
      tl.to({}, { duration: 1 })

      // 4. Fade out for the next wave, unless it's the last one
      if (index !== steps.length - 1) {
        tl.to(`.step-container-${index}`,
          { opacity: 0, duration: 1, ease: 'power2.inOut' }
        )
      }
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden">
      
      {/* SVG Turbulence Filter for Organic Ink Edge */}
      <svg className="absolute w-0 h-0">
        <filter id="ink-bleed" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="10" result="blurred" />
          <feComponentTransfer in="blurred">
            <feFuncA type="linear" slope="3" intercept="-1" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center text-center">
         <span className="font-mono text-sm text-white/30 tracking-[0.4em] uppercase absolute top-12 filter drop-shadow-[0_0_8px_rgba(0,174,239,0.5)]">
            // How It Works
         </span>
      </div>

      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`step-container-${index} absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden`}
          style={{ 
            opacity: index === 0 ? 1 : 0, 
            // We use a CSS variable animated by GSAP to control the radial gradient size
            '--mask-size': index === 0 ? '0%' : '0%',
            maskImage: 'radial-gradient(circle at center, black var(--mask-size), transparent calc(var(--mask-size) + 2%))',
            WebkitMaskImage: 'radial-gradient(circle at center, black var(--mask-size), transparent calc(var(--mask-size) + 2%))',
            // Apply the organic ink bleed SVG filter
            filter: 'url(#ink-bleed)'
          } as React.CSSProperties}
        >
          
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
            <video 
              src={step.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-40 mix-blend-screen"
            />
            {/* Color overlay to give the "ink" a specific tint */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundColor: step.color }} />
          </div>

          {/* Text Content */}
          <div className={`step-text-${index} relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl`}>
            <span 
              className="font-mono text-[15rem] md:text-[20rem] font-black tracking-tighter leading-none mb-[-80px] md:mb-[-120px] opacity-20 pointer-events-none"
              style={{ color: step.color, filter: 'blur(8px)' }}
            >
              {step.num}
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              {step.title}
            </h2>
            <p className="mt-8 text-white/80 text-xl md:text-3xl font-light leading-relaxed max-w-3xl drop-shadow-[0_0_20px_rgba(0,0,0,1)]">
              {step.desc}
            </p>
          </div>
          
        </div>
      ))}
      
    </section>
  )
}
