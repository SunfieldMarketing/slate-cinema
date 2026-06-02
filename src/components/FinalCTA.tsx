'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="relative w-full py-32 px-6 flex items-center justify-center bg-black overflow-hidden border-t border-white/5">
      {/* Background Grid Pattern (matches calendar vibe) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Geometric Glassmorphism Card */}
        <div className="relative w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl p-12 md:p-24 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Subtle Ambient Light inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-[#00AEEF]/10 blur-[80px] pointer-events-none rounded-full" />
          
          <span className="font-mono text-xs md:text-sm text-white/50 tracking-[0.4em] uppercase mb-8">
            // Ready To Scale?
          </span>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
            YOUR NEXT ERA 
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic font-serif font-light">
              STARTS HERE
            </span>
          </h2>
          
          <p className="text-white/60 text-lg md:text-xl font-light mb-12 max-w-2xl">
            Don't let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.
          </p>
          
          <a href="#contact" className="group relative px-10 py-5 bg-white text-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <div className="absolute inset-0 bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center group-hover:text-white transition-colors">
              Book A Strategy Call
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
