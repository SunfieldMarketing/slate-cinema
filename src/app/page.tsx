import dynamic from 'next/dynamic'
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pipeline from "@/components/Pipeline";
import MediaVoid from "@/components/MediaVoid";
import Results from "@/components/Results";
import LogoOrbit from "@/components/LogoOrbit";
import IndustryStandards from "@/components/IndustryStandards";
import Portfolio from "@/components/Portfolio";
import QuoteCalculator from "@/components/QuoteCalculator";
import ScheduleCall from "@/components/ScheduleCall";
import Scene3DWrapper from "@/components/Scene3DWrapper";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#030305] min-h-screen">
      {/* Persistent 3D background scene */}
      <Scene3DWrapper />
      
      {/* Navigation */}
      <Nav />
      
      {/* Content layers above 3D */}
      <div className="relative z-10">
        <div id="home">
          <Hero />
        </div>
        
        <div id="how-it-works">
          <Pipeline />
        </div>
        
        <MediaVoid />
        <Results />
        <LogoOrbit />
        <IndustryStandards />
        
        <div id="portfolio">
          <Portfolio />
        </div>
        
        <div id="quote">
          <QuoteCalculator />
        </div>
        
        <div id="contact">
          <ScheduleCall />
        </div>
        
        <Footer />
      </div>
    </main>
  );
}
