'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function QuoteCalculator() {
  const containerRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(formRef.current,
      { y: 50, opacity: 0, rotationX: 10 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full py-32 bg-[#050608] relative overflow-hidden perspective-[1000px]">
      
      {/* Abstract Podium Background Placeholder */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[600px] h-[300px] bg-gradient-to-r from-purple-900/40 to-blue-900/40 blur-[100px] rounded-full transform -rotate-12" />
        <div className="absolute w-[400px] h-[400px] bg-[#00AEEF]/10 blur-[80px] rounded-full translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">Build Your Quote</h2>
        <p className="text-xl text-[#8E96AA] max-w-2xl mx-auto mb-16">
          Tell us what you need and we'll help map the right production package for your goals.
        </p>

        {/* Floating Glass Console for Typeform Embed */}
        <div ref={formRef} className="relative max-w-3xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00AEEF]/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative glass-panel p-2 md:p-4 rounded-2xl border border-white/10 overflow-hidden transform transition-transform duration-500 hover:rotate-1">
            <div className="w-full h-[500px] bg-[#030305] rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
              
              {/* This is where the Typeform embed goes. Placeholder for now. */}
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <svg className="w-6 h-6 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <h3 className="text-xl text-white font-medium mb-2">Typeform Embed Target</h3>
                <p className="text-[#8E96AA] text-sm">The interactive quote builder will load here.</p>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-12 text-sm text-[#8E96AA]">
          Prefer to talk? <button className="text-[#00AEEF] hover:text-white transition-colors border-b border-[#00AEEF]/30 pb-0.5 ml-1">Schedule a call.</button>
        </div>
      </div>
    </section>
  )
}
