import type { LucideIcon } from 'lucide-react'
import { Film, Dumbbell, Plane, Building2, HeartPulse, ShoppingBag, Briefcase, Users, GraduationCap } from 'lucide-react'

export interface IndustryStat {
  value: number
  suffix: string
  label: string
}

/** A service offering shown as a rich bento card on the industry page. */
export interface IndustryServiceCard {
  title: string
  description: string
  /** Headline outcome, results-first (e.g. "+212% PDP conversion"). */
  outcome: string
  deliverables: string[]
  /** Runtime/timeline meta (e.g. "60–120s · 4–6 wks"). */
  meta: string
  image: string
  /** Optional looping video background — used by the featured card. */
  video?: string
  /** The one card rendered large in the bento grid. */
  featured?: boolean
}

/**
 * A playable client story card — video testimonial and case study merged
 * into one proof unit: the measurable outcome leads, the client's own
 * words back it up.
 */
export interface IndustryVideoTestimonial {
  quote: string
  name: string
  role: string
  company: string
  video: string
  /** Headline result for this engagement (e.g. "+212% PDP conversion"). */
  outcome: string
  /** Poster frame shown before playback (and wherever video can't render). */
  poster?: string
  logo?: string
}

export interface IndustryProcessStep {
  week: string
  title: string
  body: string
}

export interface IndustryFaq {
  question: string
  answer: string
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
  /**
   * Extended industry-page sections (service cards, client story cards,
   * process timeline, FAQ). Optional and currently only populated for Animation —
   * any industry gains these sections automatically once its data is
   * filled in, no component changes needed. The reel showcase itself is
   * global (see IndustryReel.tsx / portfolio-projects.ts) and needs no
   * per-industry data.
   */
  serviceCards?: IndustryServiceCard[]
  videoTestimonials?: IndustryVideoTestimonial[]
  process?: IndustryProcessStep[]
  faqs?: IndustryFaq[]
}

export const industries: IndustryData[] = [
  {
    id: 'ai',
    slug: 'ai',
    label: 'AI',
    icon: Film,
    accent: '#00AEEF',
    blurb: 'AI-accelerated brand stories, explainers, and stylized 2D/3D pieces that make complex ideas feel effortless.',
    description: 'From explainer videos to fully stylized 2D/3D brand worlds, our AI-assisted animation pipeline turns dense or abstract ideas into something an audience actually wants to watch. Every project starts as a storyboard, moves through rapid AI-assisted style exploration, then gets hand-finished by real animators and ships platform-native — because a great AI-accelerated idea still needs to land in six seconds on a phone screen.',
    stat: 'AI · 2D · 3D',
    heroImage: '/images/ai_hero_anim.png',
    heroVideo: '/videos/post-production.mp4',
    gallery: [
      '/images/ai_anim_gal_1.png',
      '/images/ai_anim_gal_2.png',
      '/images/ai_anim_gal_3.png',
    ],
    stats: [
      { value: 40, suffix: '+', label: 'AI-Assisted Pieces' },
      { value: 3, suffix: 'D', label: '2D & 3D Studios' },
      { value: 92, suffix: '%', label: 'Completion Rate' },
      { value: 12, suffix: '', label: 'Style Systems Built' },
    ],
    services: ['AI-accelerated explainers', 'Motion brand identity', '2D & 3D character work', 'AI-assisted style exploration'],
    testimonial: { quote: 'They turned an eight-page technical deck into a 45-second video our sales team actually uses.', name: 'Priya Sharma', role: 'Head of Product Marketing', company: 'Nimbus Systems' },
    serviceCards: [
      {
        title: 'AI-Accelerated Explainers',
        description: 'Complex products distilled into 90 seconds anyone can follow — an AI-assisted pipeline speeds up boards and style exploration, real animators finish every frame.',
        outcome: '+3.1x demo requests',
        deliverables: ['Script & storyboard', 'AI-assisted style frames', 'Full motion + sound design', 'Every aspect ratio'],
        meta: '60–120s · 4–6 wks',
        image: '/images/ai_anim_svc_explainer.png',
        featured: true,
      },
      {
        title: 'Product & CGI',
        description: "Photoreal renders and AI-accelerated simulations when the real thing can't be filmed.",
        outcome: '+212% PDP conversion',
        deliverables: ['Macro product renders', 'Physics simulation', 'Studio lighting'],
        meta: '30–60s · 5–7 wks',
        image: '/images/ai_anim_svc_cgi.png',
      },
      {
        title: 'Motion Branding',
        description: 'Logo language, transitions and a motion spec your whole org can reuse — explored fast with AI, locked by hand.',
        outcome: 'One system, 9 teams',
        deliverables: ['Animated logo suite', 'Motion spec doc', 'Broadcast package'],
        meta: 'System · 3–5 wks',
        image: '/images/ai_anim_svc_branding.png',
      },
      {
        title: 'Character Work',
        description: 'A recurring face for the brand — same rig, every platform, season after season.',
        outcome: '+61% brand recall',
        deliverables: ['Character design + rig', 'Season of spots', 'Platform cutdowns'],
        meta: 'Season · 6–8 wks',
        image: '/images/ai_anim_svc_character.png',
      },
      {
        title: 'Social Loops',
        description: 'Seamless, sound-off loops engineered to stop the scroll mid-thumb.',
        outcome: '2.1M views in week 1',
        deliverables: ['6–15s seamless loops', 'Sound-off captions', 'Feed-native ratios'],
        meta: '6–15s × N · 2–4 wks',
        image: '/images/ai_anim_svc_social.png',
      },
    ],
    videoTestimonials: [
      {
        quote: 'They turned an eight-page technical deck into a 45-second video our sales team actually uses.',
        name: 'Priya Sharma',
        role: 'Head of Product Marketing',
        company: 'Nimbus Systems',
        outcome: '+3.1x demo requests',
        video: '/videos/pre-production.mp4',
        poster: '/images/ai_anim_test_1.png',
        logo: '/images/clients/lucida-testimonials.webp',
      },
      {
        quote: 'The launch film paid for itself in the first week. We reallocated our whole Q3 photo budget to animation.',
        name: 'Marcus Webb',
        role: 'VP of Growth',
        company: 'Voltbrew',
        outcome: '+212% PDP conversion',
        video: '/videos/production.mp4',
        poster: '/images/ai_anim_test_2.png',
        logo: '/images/clients/dream-testimonials.webp',
      },
      {
        quote: "Fastest studio we've worked with, and the first that made revisions painless — boards first, no surprises.",
        name: 'Elena Ruiz',
        role: 'Brand Director',
        company: 'Nordform',
        outcome: '-34% support tickets',
        video: '/videos/distribution.mp4',
        poster: '/images/ai_anim_test_3.png',
        logo: '/images/clients/inhale-testimonails.webp',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'Goals, audience and references — then a one-page brief.' },
      { week: 'Wk 1–2', title: 'Script & boards', body: 'Story signed off as boards and a timed animatic.' },
      { week: 'Wk 2–3', title: 'Design', body: "Style frames explored rapidly with AI, then locked by hand — the film's world, decided." },
      { week: 'Wk 3–5', title: 'Animate', body: 'AI-accelerated motion pass, then sim, sound and hand-finishing with two review checkpoints.' },
      { week: 'Wk 6', title: 'Deliver', body: 'Grade, mix, every ratio — source files included.' },
    ],
    faqs: [
      { question: 'How fast can you deliver?', answer: "Standard explainers run 4–6 weeks from kickoff to delivery — an AI-assisted pipeline speeds up early exploration, but every frame still gets a human finishing pass. Rush lanes exist for launches — ask, and we'll tell you honestly what's possible without cutting corners." },
      { question: 'Is the animation actually AI-generated?', answer: "AI accelerates our pipeline — rapid style exploration, previs, and iteration — but every frame ships hand-finished by our animators. You're not getting raw model output; you're getting AI speed with real craft on top." },
      { question: 'What do you need from us to start?', answer: 'One stakeholder, one hour, and whatever exists — decks, CAD files, brand guides, competitor links. We handle script, boards and everything downstream.' },
      { question: 'Do you work from our brand guidelines?', answer: "Yes — and if the guidelines don't cover motion, we'll extend them: easing curves, transitions and a mini motion spec your other vendors can reuse." },
      { question: 'Who owns the work?', answer: 'You do. Full usage rights on every deliverable, every platform, in perpetuity — plus source files on final invoice.' },
      { question: 'What if we hate the first cut?', answer: "You won't see a first cut cold — you approve boards and an animatic first, so animation holds no surprises. Two structured revision rounds are built in regardless." },
    ],
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
    serviceCards: [
      {
        title: 'Hype Reels',
        description: 'Fast-cut, high-energy edits built around real training and competition footage — designed to open strong and hold to the last frame.',
        outcome: 'Retention-first cuts',
        deliverables: ['On-site multi-cam capture', 'Beat-synced fast edit', 'Sound design pass', 'Feed-native ratios'],
        meta: '15–60s · 2–4 wks',
        image: '/images/ind_ath_gal1.png',
        featured: true,
      },
      {
        title: 'Athlete Feature Films',
        description: 'A longer-form profile piece that gives an athlete or team a real narrative arc, not just a highlight reel.',
        outcome: 'Sponsor-ready long-form',
        deliverables: ['Interview + b-roll shoot', 'Story-driven edit', 'Broadcast + social cutdowns'],
        meta: '2–4 min · 4–6 wks',
        image: '/images/ind_ath_gal2.png',
      },
      {
        title: 'Product Launch Content',
        description: 'Gear and apparel drops shot and cut with the same intensity as the sport itself.',
        outcome: 'Launch-day ready',
        deliverables: ['Studio + on-field shoot', 'Launch film', 'Ad cutdowns'],
        meta: '30–90s · 3–5 wks',
        image: '/images/ind_ath_gal3.png',
      },
      {
        title: 'Live Event Capture',
        description: 'Multi-camera coverage of competitions, tournaments and activations, turned around fast enough to still matter.',
        outcome: 'Same-week delivery',
        deliverables: ['Multi-cam crew on-site', 'Same-week edit turnaround', 'Recap + social clips'],
        meta: 'Event day · 1–2 wk turnaround',
        image: '/images/ind_ath_hero.png',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'Season goals, key moments and channels — a one-page capture plan.' },
      { week: 'Wk 1', title: 'Plan the shoot', body: 'Shot list, access logistics and crew booked around the athlete or event schedule.' },
      { week: 'Wk 1–2', title: 'Capture', body: 'Multi-cam production on-site — training, competition or launch day.' },
      { week: 'Wk 2–3', title: 'Edit', body: 'Fast-cut edit with sound design, reviewed against the original brief.' },
      { week: 'Wk 3–4', title: 'Deliver', body: 'Every platform ratio, source files included.' },
    ],
    faqs: [
      { question: 'Can you shoot live events on a tight turnaround?', answer: "Yes — same-week edit turnaround is standard for event and competition capture, so recap content is still relevant when it lands." },
      { question: 'Do we need to provide access or credentials?', answer: "For competitions and venues, yes — we'll tell you exactly what access our crew needs and work with your team or the venue to arrange it." },
      { question: 'Can you work with footage we already have?', answer: "Absolutely. Send over existing training or event footage and we'll fold it into the edit alongside anything we capture new." },
      { question: 'What if the weather or schedule changes on shoot day?', answer: "Sports content lives outdoors and on the clock — our crews build in contingency time and communicate changes as they happen, not after." },
      { question: 'Who owns the final footage?', answer: 'You do — full usage rights on every deliverable, plus source files on final invoice.' },
    ],
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
    serviceCards: [
      {
        title: 'Destination Films',
        description: 'A cinematic overview of a place — landscape, culture, pace of life — built to make someone start planning a trip before the film ends.',
        outcome: 'Booking-intent content',
        deliverables: ['Location scouting', 'Golden-hour shoot schedule', 'Cinema drone footage', 'Full grade'],
        meta: '60–120s · 5–7 wks',
        image: '/images/ind_travel_gal1.png',
        featured: true,
      },
      {
        title: 'Aerial Cinematography',
        description: 'Drone-native coverage of coastlines, resorts and landscapes — the reveal shot every hospitality brand needs.',
        outcome: 'Cinema-grade aerials',
        deliverables: ['Cinema drone operator', '4K aerial passes', 'Stabilized + graded footage'],
        meta: '1–2 shoot days · 2–3 wks',
        image: '/images/ind_travel_gal2.png',
      },
      {
        title: 'Property Showcases',
        description: 'Walkthrough films for resorts and stays that sell the room, the view and the feeling in one edit.',
        outcome: 'Booking-page ready',
        deliverables: ['Interior + exterior shoot', 'Property walkthrough edit', 'Web + social cutdowns'],
        meta: '30–90s · 3–5 wks',
        image: '/images/ind_travel_gal3.png',
      },
      {
        title: 'Hospitality Brand Content',
        description: 'Ongoing content built around a property or destination brand — social-native, always on-brand.',
        outcome: 'Always-on content',
        deliverables: ['Content shoot day', 'Batch social cutdowns', 'Brand-consistent grade'],
        meta: 'Batch · 4–6 wks',
        image: '/images/ind_travel_hero.png',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'Destination, audience and booking goals — a one-page shoot brief.' },
      { week: 'Wk 1–2', title: 'Scout & schedule', body: 'Locations scouted and shoot days scheduled around light, weather and season.' },
      { week: 'Wk 2–3', title: 'Shoot', body: 'On-location capture — ground and aerial — with golden-hour scheduling.' },
      { week: 'Wk 3–5', title: 'Edit & grade', body: 'Story-driven edit with a signature color grade built for the destination.' },
      { week: 'Wk 6', title: 'Deliver', body: 'Every platform ratio, source files included.' },
    ],
    faqs: [
      { question: 'Do you travel to the destination?', answer: "Yes — travel and hospitality is location-first work. We build travel and lodging into the shoot plan and quote it transparently up front." },
      { question: 'What if the weather doesn’t cooperate on shoot day?', answer: "We build weather contingency days into destination shoots wherever the schedule allows, and we're upfront if that's not possible for a tighter timeline." },
      { question: 'Can you fly drones at our property?', answer: "In most cases, yes — we handle the permitting and airspace checks and will flag early if a location has drone restrictions." },
      { question: 'How long until we see footage?', answer: "A first cut typically lands 2–3 weeks after the shoot, with two structured rounds of revisions built into every project." },
      { question: 'Who owns the final footage?', answer: 'You do — full usage rights on every deliverable, plus source files on final invoice.' },
    ],
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
