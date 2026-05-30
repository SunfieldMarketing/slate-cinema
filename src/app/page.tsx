'use client'

import dynamic from 'next/dynamic'
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pipeline from "@/components/Pipeline";
import MediaVoid from "@/components/MediaVoid";
import Results from "@/components/Results";
import IndustryStandards from "@/components/IndustryStandards";
import Portfolio from "@/components/Portfolio";
import LogoOrbit from "@/components/LogoOrbit";
import LeadMagnet from "@/components/LeadMagnet";
import CustomCalendar from "@/components/CustomCalendar";
import Footer from "@/components/Footer";

// We'll keep the Scene3DWrapper as a background element only
const Scene3DWrapper = dynamic(() => import("@/components/Scene3DWrapper"), { ssr: false })

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#030305] text-white selection:bg-[#00AEEF] selection:text-white">
      {/* Global Cinematic Overlays */}
      <div className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay opacity-30">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-50">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>
      <div className="fixed inset-0 z-50 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,5,0.4)_100%)]" />

      <Nav />
      
      {/* Persistent 3D background scene - behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene3DWrapper />
      </div>
      
      {/* Content layers above 3D */}
      <div className="relative z-10 w-full overflow-hidden">
        <Hero />
        <Pipeline />
        <MediaVoid />
        <Results />
        <LogoOrbit />
        <IndustryStandards />
        <Portfolio />
        <LeadMagnet />
        <CustomCalendar />
        <Footer />
      </div>
    </main>
  );
}
