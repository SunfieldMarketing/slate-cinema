'use client'

import React from 'react'
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pipeline from "@/components/Pipeline";
import MediaVoid from "@/components/MediaVoid";
import Results from "@/components/Results";
import IndustryStandards from "@/components/IndustryStandards";
import Reviews from "@/components/Reviews";
import Portfolio from "@/components/Portfolio";
import LeadMagnet from "@/components/LeadMagnet";
import CustomCalendar from "@/components/CustomCalendar";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import TrustBanner from "@/components/TrustBanner";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-white selection:bg-[#00AEEF] selection:text-white">
      {/* Global Cinematic Overlays */}

      <div className="fixed inset-0 z-50 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,12,14,0.4)_100%)]" />

      <AmbientBackdrop accent="#00AEEF" />

      <Nav />

      <div className="relative z-10 w-full">
        <div data-scroll-section="hero"><Hero /></div>
        <div data-scroll-section="trust"><TrustBanner /></div>
        <div id="how" data-scroll-section="pipeline"><Pipeline /></div>
        <div id="reel" data-scroll-section="mediavoid"><MediaVoid /></div>
        <div data-scroll-section="results"><Results /></div>
        <div data-scroll-section="standards"><IndustryStandards /></div>
        <div data-scroll-section="reviews"><Reviews /></div>
        <div data-scroll-section="portfolio"><Portfolio /></div>
        <div data-scroll-section="leadmagnet"><LeadMagnet /></div>
        <div id="quote" data-scroll-section="calendar"><CustomCalendar /></div>
        <div data-scroll-section="finalcta"><FinalCTA /></div>
        <div data-scroll-section="footer"><Footer /></div>
      </div>
    </main>
  );
}
