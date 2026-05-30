'use client'

import IntroAnimation from "./ui/scroll-morph-hero";

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative w-full h-[100vh] bg-[#030305] overflow-hidden flex flex-col border-y border-white/[0.05]">
      {/* 
        The IntroAnimation takes up the full container height and handles its own virtual scrolling.
        We provide it a 100vh container so it feels like an immersive, fullscreen section.
      */}
      <IntroAnimation />
    </section>
  )
}
