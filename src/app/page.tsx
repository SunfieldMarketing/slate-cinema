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
    <main className="bg-[#030305] text-white selection:bg-[#00AEEF] selection:text-white relative">
      
      {/* Persistent 3D background scene - behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene3DWrapper />
      </div>

      {/* Navigation */}
      <Nav />
      
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
