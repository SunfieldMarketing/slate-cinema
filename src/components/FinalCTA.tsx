'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="relative w-full py-32 px-6 flex items-center justify-center bg-[#030305] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_center,rgba(0,174,239,0.1)_0%,transparent_70%)] blur-[100px]" />
      </div>
      
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6">
          READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-purple-500">DOMINATE?</span>
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-light mb-10 max-w-2xl">
          Don't let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.
        </p>
        
        <button className="group inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-[#00AEEF] hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,174,239,0.6)]">
          Start Your Project
          <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </section>
  )
}
