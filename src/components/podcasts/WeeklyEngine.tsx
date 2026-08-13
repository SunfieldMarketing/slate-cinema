'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MagicCard } from '@/components/ui/magic-card'

gsap.registerPlugin(ScrollTrigger)

/*
  A real release-ops calendar, not a promise — the connecting line fills
  in as you scroll past it, node by node, so the ladder reads as a
  sequence rather than five disconnected cards.
*/
const steps = [
  { day: 'Monday', label: 'Full Episode', desc: 'The complete episode edit, mixed and mastered to podcast loudness spec.' },
  { day: 'Tuesday', label: 'Reel 1', desc: 'First concept-titled clip, cut for the feed.' },
  { day: 'Thursday', label: 'Reel 2', desc: 'Second concept-titled clip — a different beat from the same episode.' },
  { day: 'Saturday', label: 'Reel 3', desc: 'Third concept-titled clip, timed to lead into Sunday’s drop.' },
  { day: 'Sunday', label: 'The Drop', desc: 'Full episode goes live everywhere, on schedule, every week.' },
]

export default function WeeklyEngine() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.we-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.we-track', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
        }
      )
      gsap.fromTo(
        '.we-node',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.we-track', start: 'top 82%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-[#00AEEF] uppercase">The Weekly Engine</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
            A real release calendar,<br className="hidden sm:block" /> not a promise.
          </h2>
          <p className="mt-5 text-white/55 font-light text-sm sm:text-base max-w-xl mx-auto">
            Most agencies can&apos;t show you a real release-ops calendar. We can — because we run one on ourselves, every week.
          </p>
        </div>

        <div className="we-track relative">
          {/* Connecting line — track + animated fill */}
          <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-px bg-white/10">
            <div className="we-fill absolute inset-0 origin-left bg-gradient-to-r from-[#00AEEF] to-[#00AEEF]/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1
              return (
                <div key={step.day} className="we-node relative">
                  <div className="hidden sm:flex justify-center mb-4">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${isLast ? 'bg-[#00AEEF] border-[#00AEEF] shadow-[0_0_12px_rgba(0,174,239,0.7)]' : 'bg-ink border-[#00AEEF]/50'}`}
                    />
                  </div>
                  <MagicCard
                    className={`rounded-2xl p-5 h-full ${isLast ? 'ring-1 ring-[#00AEEF]/40' : ''}`}
                    gradientColor="#00AEEF1a"
                    gradientFrom={isLast ? '#00AEEF' : '#3f3f46'}
                    gradientTo={isLast ? '#38bdf8' : '#27272a'}
                  >
                    <div className="font-mono text-[10px] tracking-[0.2em] text-[#00AEEF]/70 uppercase mb-2">{step.day}</div>
                    <div className="text-white font-bold text-sm mb-1.5">{step.label}</div>
                    <p className="text-white/50 text-xs font-light leading-relaxed">{step.desc}</p>
                  </MagicCard>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
