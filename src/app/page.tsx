import Preloader from "@/components/Preloader";
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
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#030305] min-h-screen">
      <Preloader />
      <Nav />
      
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
    </main>
  );
}
