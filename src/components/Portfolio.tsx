'use client'

import React, { useRef } from 'react'
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery'

// Using custom portfolio images and some high-quality production stock for an impressive gallery
// Added realistic metrics for the external display
const galleryData: GalleryItem[] = [
  {
    title: 'High-End Production',
    category: 'Commercial',
    photo: {
      url: '/images/portfolio-production.png', // Or fallback to: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1000'
      text: 'Professional camera setup on set',
    },
    metrics: [
      { label: 'Views', value: '4.2M' },
      { label: 'Conv. Rate', value: '+34%' }
    ]
  },
  {
    title: 'Social Storytelling',
    category: 'Social Media',
    photo: {
      url: '/images/portfolio-social.png', // Or fallback to: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000'
      text: 'Vertical social media content creation',
    },
    metrics: [
      { label: 'Reach', value: '12.1M' },
      { label: 'Engagement', value: '18.5%' }
    ]
  },
  {
    title: 'Brand Identity',
    category: 'Branding',
    photo: {
      url: '/images/portfolio-brand.png', // Or fallback to: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000'
      text: 'Cinematic brand lifestyle shot',
    },
    metrics: [
      { label: 'Brand Lift', value: '+45%' },
      { label: 'Watch Time', value: '1:45' }
    ]
  },
  {
    title: 'Live Events',
    category: 'Event Coverage',
    photo: {
      url: '/images/portfolio-event.png', // Or fallback to: 'https://images.unsplash.com/photo-1540039155732-6847350357a5?q=80&w=1000'
      text: 'Dynamic event lighting and stage',
    },
    metrics: [
      { label: 'Attendees', value: '15k+' },
      { label: 'Impressions', value: '2.8M' }
    ]
  },
  {
    title: 'Automotive Cinema',
    category: 'Action',
    photo: {
      url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000',
      text: 'Car racing cinematic shot',
    },
    metrics: [
      { label: 'Views', value: '8.4M' },
      { label: 'Shares', value: '245k' }
    ]
  },
  {
    title: 'Product Focus',
    category: 'E-Commerce',
    photo: {
      url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1000',
      text: 'Premium product videography',
    },
    metrics: [
      { label: 'ROAS', value: '4.2x' },
      { label: 'Sales', value: '+$1.2M' }
    ]
  },
  {
    title: 'Aerial Cinematography',
    category: 'Drone',
    photo: {
      url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000',
      text: 'Drone hovering over landscape',
    },
    metrics: [
      { label: 'Watch Time', value: '98%' },
      { label: 'Shares', value: '12k' }
    ]
  },
  {
    title: 'Documentary',
    category: 'Narrative',
    photo: {
      url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000',
      text: 'Close up interview lighting',
    },
    metrics: [
      { label: 'Awards', value: '3' },
      { label: 'Views', value: '1.1M' }
    ]
  },
]

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#030305] text-white" 
      style={{ height: '300vh' }} // Provide scrollable height for the gallery to scrub through
    >
      {/* Background ambient light */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,5,1)_80%)] pointer-events-none" />

      {/* Sticky container that holds the circular gallery */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pointer-events-none">
        
        {/* Header Overlay */}
        <div className="absolute top-24 left-0 w-full z-20 text-center pointer-events-none">
          <span className="font-mono text-sm text-[#00AEEF] tracking-[0.4em] uppercase mb-4 block filter drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]">
            // Our Work
          </span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter drop-shadow-xl">
            A Gallery of Impact
          </h2>
          <p className="mt-4 text-white/60 font-light text-lg">
            Scroll to explore or <span className="text-white font-medium">click a card</span> to view campaign metrics.
          </p>
        </div>

        {/* 3D Circular Gallery - allow pointer events here so cards can be clicked */}
        <div className="w-full h-full pt-32 pointer-events-auto z-10">
          <CircularGallery 
            items={galleryData} 
            radius={700} 
            autoRotateSpeed={0.03}
          />
        </div>

        {/* Bottom CTA */}
        <div className="absolute bottom-12 left-0 w-full z-20 flex justify-center pointer-events-auto">
          <a
            href="#contact"
            className="group relative px-8 py-4 rounded-full overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <span className="relative text-sm font-semibold tracking-widest text-white group-hover:text-black transition-colors uppercase">
              View Full Portfolio
            </span>
          </a>
        </div>
        
      </div>
    </section>
  )
}
