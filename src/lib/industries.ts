import type { LucideIcon } from 'lucide-react'
import { Film, Dumbbell, Plane, Building2, HeartPulse, ShoppingBag, Music, Briefcase, Users } from 'lucide-react'

export interface IndustryStat {
  value: number
  suffix: string
  label: string
}

export interface IndustryData {
  id: string
  slug: string
  label: string
  icon: LucideIcon
  accent: string
  /** Short one-liner used by the wheel */
  blurb: string
  /** Longer paragraph used on the individual page */
  description: string
  stat: string
  heroImage: string
  heroVideo: string
  gallery: string[]
  stats: IndustryStat[]
  services: string[]
  testimonial: { quote: string; name: string; role: string; company: string }
}

export const industries: IndustryData[] = [
  {
    id: 'animation',
    slug: 'animation',
    label: 'Animation',
    icon: Film,
    accent: '#00AEEF',
    blurb: 'Motion-designed brand stories, explainers, and stylized 2D/3D pieces that make complex ideas feel effortless.',
    description: 'From explainer videos to fully stylized 2D/3D brand worlds, our animation work turns dense or abstract ideas into something an audience actually wants to watch. Every project starts as a storyboard, gets a bespoke motion language, and ships platform-native — because a great animated idea still needs to land in six seconds on a phone screen.',
    stat: '2D · 3D · Motion',
    heroImage: '/images/ind_anim_hero.png',
    heroVideo: '/videos/post-production.mp4',
    gallery: [
      '/images/ind_anim_gal1.png',
      '/images/ind_anim_gal2.png',
      '/images/ind_anim_gal3.png',
    ],
    stats: [
      { value: 40, suffix: '+', label: 'Animated Pieces' },
      { value: 3, suffix: 'D', label: '2D & 3D Studios' },
      { value: 92, suffix: '%', label: 'Completion Rate' },
      { value: 12, suffix: '', label: 'Style Systems Built' },
    ],
    services: ['Explainer videos', 'Motion brand identity', '2D & 3D character work', 'Kinetic typography'],
    testimonial: { quote: 'They turned an eight-page technical deck into a 45-second video our sales team actually uses.', name: 'Priya Sharma', role: 'Head of Product Marketing', company: 'Nimbus Systems' },
  },
  {
    id: 'athletics',
    slug: 'athletics',
    label: 'Athletics',
    icon: Dumbbell,
    accent: '#f97316',
    blurb: 'High-energy sports and fitness content built for retention — hype reels, launches, and athlete features.',
    description: "Sports content lives or dies in the first second. We build hype reels, athlete features, and launch films engineered around retention — fast cuts, real training footage, and a sound design that hits as hard as the content does. This is content built for people who scroll fast and stop for even faster.",
    stat: '12.1M reach',
    heroImage: '/images/ind_ath_hero.png',
    heroVideo: '/videos/production.mp4',
    gallery: [
      '/images/ind_ath_gal1.png',
      '/images/ind_ath_gal2.png',
      '/images/ind_ath_gal3.png',
    ],
    stats: [
      { value: 12, suffix: 'M+', label: 'Total Reach' },
      { value: 18, suffix: '.5%', label: 'Avg. Engagement' },
      { value: 245, suffix: 'k', label: 'Shares' },
      { value: 30, suffix: '+', label: 'Athlete Features' },
    ],
    services: ['Hype reels', 'Athlete feature films', 'Product launch content', 'Live event capture'],
    testimonial: { quote: 'Cinematic quality with a social-first brain. Rare combination, huge results.', name: 'David Chen', role: 'Founder', company: 'Apex Athletics' },
  },
  {
    id: 'travel',
    slug: 'travel',
    label: 'Travel',
    icon: Plane,
    accent: '#10b981',
    blurb: 'Aspirational destination films and property showcases that sell the feeling of being there.',
    description: "Travel and hospitality content has one job: make someone feel like they're already there. We shoot destination films and property showcases with cinema drones, golden-hour scheduling, and a color grade built to make a place feel like a memory before the viewer has even booked.",
    stat: 'Cinematic drone',
    heroImage: '/images/ind_travel_hero.png',
    heroVideo: '/videos/hero-camera.mp4',
    gallery: [
      '/images/ind_travel_gal1.png',
      '/images/ind_travel_gal2.png',
      '/images/ind_travel_gal3.png',
    ],
    stats: [
      { value: 22, suffix: '', label: 'Destinations Shot' },
      { value: 98, suffix: '%', label: 'Watch-Through' },
      { value: 4, suffix: 'K', label: 'Drone-Native Delivery' },
      { value: 15, suffix: '+', label: 'Resort Partners' },
    ],
    services: ['Destination films', 'Aerial cinematography', 'Property showcases', 'Hospitality brand content'],
    testimonial: { quote: 'Booking inquiries jumped the week the film went live. It sells the feeling, not just the room.', name: 'Marcus Rivera', role: 'Director of Marketing', company: 'Coastal Collection Resorts' },
  },
  {
    id: 'realestate',
    slug: 'real-estate',
    label: 'Real Estate',
    icon: Building2,
    accent: '#a855f7',
    blurb: 'Property tours, development timelapses, and aerial cinematography that move listings faster.',
    description: "A listing with a cinematic walkthrough moves faster than one with photos alone. We shoot property tours, development timelapses, and aerial cinematography built to make a space feel real before a buyer ever steps inside — the difference between a listing and a landmark.",
    stat: '98% watch time',
    heroImage: '/images/ind_realestate_hero.png',
    heroVideo: '/videos/distribution.mp4',
    gallery: [
      '/images/ind_realestate_gal1.png',
      '/images/ind_realestate_gal2.png',
      '/images/ind_realestate_gal3.png',
    ],
    stats: [
      { value: 9, suffix: '', label: 'Listings Moved Faster' },
      { value: 98, suffix: '%', label: 'Watch Rate' },
      { value: 12, suffix: 'k', label: 'Avg. Shares/Listing' },
      { value: 6, suffix: '', label: 'Developments Covered' },
    ],
    services: ['Cinematic property tours', 'Development timelapses', 'Aerial drone cinematography', 'Agent brand films'],
    testimonial: { quote: 'The aerial reveal alone got more inquiries than our previous three listings combined.', name: 'Isabella Rossi', role: 'Principal Broker', company: 'Vista Real Estate' },
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    label: 'Healthcare',
    icon: HeartPulse,
    accent: '#ef4444',
    blurb: 'Trust-building patient stories, facility films, and clear explainer content for regulated industries.',
    description: "Healthcare content has to earn trust before it earns attention. We build patient stories, facility films, and explainer content that stay clear, compliant, and human — content built for an audience that needs to trust you before they'll listen to you.",
    stat: 'Impact films',
    heroImage: '/images/ind_health_hero.png',
    heroVideo: '/videos/pre-production.mp4',
    gallery: [
      '/images/ind_health_gal1.png',
      '/images/ind_health_gal2.png',
      '/images/ind_health_gal3.png',
    ],
    stats: [
      { value: 3, suffix: '', label: 'Awards Won' },
      { value: 1.1, suffix: 'M', label: 'Views' },
      { value: 62, suffix: '%', label: 'Lift in Engagement' },
      { value: 100, suffix: '%', label: 'Compliance-Reviewed' },
    ],
    services: ['Patient story films', 'Facility & capability films', 'Explainer content', 'Regulated-industry compliant edits'],
    testimonial: { quote: 'Mission-driven storytelling that moved our board and our donors in the same week.', name: 'Fatima Al-Jamil', role: 'CFO', company: 'Global Health Org' },
  },
  {
    id: 'products',
    slug: 'products',
    label: 'Products',
    icon: ShoppingBag,
    accent: '#eab308',
    blurb: 'Scroll-stopping product spotlights and e-commerce ads engineered for conversion and ROAS.',
    description: "Product content only works if it converts. We shoot macro-lit spotlights and e-commerce ads with a signature color grade and cuts built to sell in six seconds or less — engineered for ROAS first, aesthetics second, though we rarely have to choose between the two.",
    stat: '4.2x ROAS',
    heroImage: '/images/ind_products_hero.png',
    heroVideo: '/videos/production.mp4',
    gallery: [
      '/images/ind_products_gal1.png',
      'https://images.unsplash.com/photo-1603219225728-0c9e319d2373?q=80&w=1200',
      '/images/portfolio-social.png',
    ],
    stats: [
      { value: 4.2, suffix: 'x', label: 'Avg. ROAS' },
      { value: 1.2, suffix: 'M', label: 'Sales Lift ($)' },
      { value: 3.8, suffix: '%', label: 'Avg. CTR' },
      { value: 50, suffix: '+', label: 'Product Spotlights' },
    ],
    services: ['Macro product photography', 'E-commerce ad cuts', 'Signature color grading', 'Platform-native spotlights'],
    testimonial: { quote: 'Scroll-stopping product spotlights engineered for conversion — and it shows in the numbers.', name: 'Kenji Tanaka', role: 'Brand Director', company: 'Lumiere Beauty' },
  },
  {
    id: 'music',
    slug: 'music',
    label: 'Music',
    icon: Music,
    accent: '#ec4899',
    blurb: 'Music videos, visualizers, and performance films with a distinct directorial signature.',
    description: "Music content needs a point of view. We shoot music videos, visualizers, and performance films with a distinct directorial signature — built around the track's actual energy, not a generic template. Every edit is cut to the beat, literally.",
    stat: 'Directorial',
    heroImage: '/images/ind_music_hero.png',
    heroVideo: '/videos/hero.mp4',
    gallery: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200',
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=1200',
      '/images/portfolio-event.png',
    ],
    stats: [
      { value: 25, suffix: '+', label: 'Music Videos Shot' },
      { value: 8, suffix: 'M+', label: 'Combined Streams' },
      { value: 6, suffix: '', label: 'Label Partners' },
      { value: 100, suffix: '%', label: 'Cut-to-Beat Edits' },
    ],
    services: ['Music videos', 'Live performance films', 'Audio-reactive visualizers', 'Artist brand content'],
    testimonial: { quote: 'Every frame is intentional. The color grade alone lifted our visual identity overnight.', name: 'Kenji Tanaka', role: 'Creative Director', company: 'CodeCrafters Records' },
  },
  {
    id: 'corporate',
    slug: 'corporate',
    label: 'Corporate',
    icon: Briefcase,
    accent: '#0ea5e9',
    blurb: 'Brand films, culture reels, and executive communications that make companies feel human.',
    description: "Corporate content is where most brands get boring. We build brand films, culture reels, and executive communications engineered to make a company feel like the people inside it — because the companies that feel human are the ones people actually want to work with.",
    stat: 'Brand lift +45%',
    heroImage: '/images/ind_corporate_hero.png',
    heroVideo: '/videos/performance.mp4',
    gallery: [
      '/images/portfolio-production.png',
      'https://images.unsplash.com/photo-1611149974482-764b0c2a211a?q=80&w=1200',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
    ],
    stats: [
      { value: 45, suffix: '%', label: 'Avg. Brand Lift' },
      { value: 1, suffix: ':45', label: 'Avg. Watch Time' },
      { value: 2, suffix: '', label: 'Industry Awards' },
      { value: 20, suffix: '+', label: 'Executive Films' },
    ],
    services: ['Brand & culture films', 'Executive communications', 'Internal comms video', 'Investor & recruiting content'],
    testimonial: { quote: 'Brand films, culture reels, and executive communications that make companies feel human — exactly what we needed.', name: 'Priya Sharma', role: 'VP Marketing', company: 'Nexus Architecture' },
  },
  {
    id: 'organizations',
    slug: 'organizations',
    label: 'Organizations',
    icon: Users,
    accent: '#22c55e',
    blurb: 'Mission-driven storytelling for nonprofits and institutions that moves audiences to act.',
    description: "Mission-driven work needs to move people to actually do something — donate, volunteer, show up. We build storytelling for nonprofits and institutions engineered around a single call to action, shot with the same craft as any commercial campaign because your mission deserves it.",
    stat: 'Award-winning',
    heroImage: '/images/ind_orgs_hero.png',
    heroVideo: '/videos/pre-production.mp4',
    gallery: [
      'https://images.unsplash.com/photo-1461532257246-777de18cd58b?q=80&w=1200',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200',
      '/images/ind_health_gal3.png',
    ],
    stats: [
      { value: 3, suffix: '', label: 'Festival Selections' },
      { value: 62, suffix: '%', label: 'Donation Lift' },
      { value: 1.1, suffix: 'M', label: 'Total Views' },
      { value: 10, suffix: '+', label: 'Institutions Served' },
    ],
    services: ['Mission & impact films', 'Donor & fundraising content', 'Volunteer recruitment films', 'Annual report video'],
    testimonial: { quote: 'Mission-driven storytelling built to move an audience to act — and our donation numbers proved it did.', name: 'Fatima Al-Jamil', role: 'Executive Director', company: 'Global Health Org' },
  },
]

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug)
}
