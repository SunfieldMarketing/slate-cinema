import type { LucideIcon } from 'lucide-react'
import { Film, Dumbbell, Plane, Building2, HeartPulse, ShoppingBag, Briefcase, Users, GraduationCap, Mic } from 'lucide-react'

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

/** A real client story card — used by IndustryClientShowcase. */
export interface IndustryClient {
  name: string
  /** Year or year range; blank if not on file. */
  year: string
  body: string
  video: string
}

/** Copy for the CinematicStatement full-bleed video "beat" mid-page. */
export interface IndustryCinematicStatement {
  eyebrow: string
  lines: string[]
  body: string
  videoSrc: string
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
  /**
   * Fabricated per-industry client quotes (invented names, roles, and
   * companies) lived here and in `videoTestimonials` until the 2026-08-12
   * client audit confirmed none were real Slate Cinema clients — the
   * render call for both was removed from IndustryPageContent.tsx and the
   * fake literal data below was deleted. Field kept optional so a real
   * testimonial can be added per-industry once the client supplies one.
   */
  testimonial?: { quote: string; name: string; role: string; company: string }
  /**
   * Extended industry-page sections (service cards, client story cards,
   * process timeline, FAQ). Optional and currently only populated for Animation —
   * any industry gains these sections automatically once its data is
   * filled in, no component changes needed. The drag-to-spin reel
   * showcase lives on the general /portfolio page (see
   * PortfolioPageContent.tsx / portfolio-projects.ts), not per-industry.
   */
  serviceCards?: IndustryServiceCard[]
  videoTestimonials?: IndustryVideoTestimonial[]
  process?: IndustryProcessStep[]
  faqs?: IndustryFaq[]
  /**
   * The Athletics-page format, generalized 2026-08-13 to every industry
   * page per Kauan ("use the new athletics industry format for all the
   * industry pages"): a real client-story grid (IndustryClientShowcase)
   * plus a full-bleed video "beat" (CinematicStatement) replace the old
   * generic two-column IntroSection. Both optional so a not-yet-filled-in
   * industry degrades gracefully instead of rendering an empty section.
   */
  clientShowcase?: IndustryClient[]
  cinematicStatement?: IndustryCinematicStatement
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
    heroImage: '/images/ai_hero_anim.webp',
    heroVideo: '/videos/post-production.mp4',
    gallery: [
      '/images/ai_anim_gal_1.webp',
      '/images/ai_anim_gal_2.webp',
      '/images/ai_anim_gal_3.webp',
    ],
    stats: [
      { value: 3, suffix: '', label: 'Gen-Video Models In Pipeline' },
      { value: 100, suffix: '%', label: 'Human-Finished, Every Frame' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['AI-accelerated explainers', 'Motion brand identity', '2D & 3D character work', 'AI-assisted style exploration'],
    clientShowcase: [
      { name: 'Tremco CPG', year: '2026', body: "AI-augmented 3D explainer series built from the client's own DWG drawings — a national NYC building-code-change story, in production.", video: '/videos/post-production.mp4' },
      { name: 'Anochi', year: '2024', body: 'A VFX Eye video, part of a 5-part workshop series covering journey, accountability, breathwork and coaching.', video: '/videos/pre-production.mp4' },
      { name: 'CVM Waste', year: '2025', body: 'An animated logo and brand sting for a second brand launched from scratch alongside the CVM Construction rebuild.', video: '/videos/distribution.mp4' },
      { name: 'Smash House Burgers', year: '2025', body: 'Recurring animation stitches — the Trolley Problem series — built into a multi-location weekly social engine.', video: '/videos/production.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'AI In Service Of The Story',
      lines: ['Run by filmmakers,', 'not by prompts.'],
      body: 'Every AI-accelerated frame still gets a human finishing pass — transcription-driven editing, generative b-roll, AI-assisted product photoshoots. Real production craft, just faster.',
      videoSrc: '/videos/post-production.mp4',
    },
    serviceCards: [
      {
        title: 'AI-Accelerated Explainers',
        description: 'Complex products distilled into 90 seconds anyone can follow — an AI-assisted pipeline speeds up boards and style exploration, real animators finish every frame.',
        outcome: 'Boards in days, not weeks',
        deliverables: ['Script & storyboard', 'AI-assisted style frames', 'Full motion + sound design', 'Every aspect ratio'],
        meta: '60–120s · 4–6 wks',
        image: '/images/ai_anim_svc_explainer.webp',
        featured: true,
      },
      {
        title: 'Product & CGI',
        description: "Photoreal renders and AI-accelerated simulations when the real thing can't be filmed — the same approach behind Tremco CPG's AI-augmented 3D explainer series, built from the client's own DWG drawings.",
        outcome: 'Real product, no shoot required',
        deliverables: ['Macro product renders', 'Physics simulation', 'Studio lighting'],
        meta: '30–60s · 5–7 wks',
        image: '/images/ai_anim_svc_cgi.webp',
      },
      {
        title: 'Motion Branding',
        description: 'Logo language, transitions and a motion spec your whole org can reuse — explored fast with AI, locked by hand. Built animated logo suites for CVM Waste and Five Towns Premier this way.',
        outcome: 'One reusable system',
        deliverables: ['Animated logo suite', 'Motion spec doc', 'Broadcast package'],
        meta: 'System · 3–5 wks',
        image: '/images/ai_anim_svc_branding.webp',
      },
      {
        title: 'Character Work',
        description: 'A recurring face for the brand — same rig, every platform, season after season.',
        outcome: 'Same rig, every platform',
        deliverables: ['Character design + rig', 'Season of spots', 'Platform cutdowns'],
        meta: 'Season · 6–8 wks',
        image: '/images/ai_anim_svc_character.webp',
      },
      {
        title: 'Social Loops',
        description: 'Seamless, sound-off loops engineered to stop the scroll mid-thumb — the same technique behind Smash House Burgers’ recurring animation stitches.',
        outcome: 'Built for the scroll',
        deliverables: ['6–15s seamless loops', 'Sound-off captions', 'Feed-native ratios'],
        meta: '6–15s × N · 2–4 wks',
        image: '/images/ai_anim_svc_social.webp',
      },
    ],
    // videoTestimonials removed 2026-08-12 — the 3 entries here (Nimbus
    // Systems, Voltbrew, Nordform) were invented companies/names, never
    // real Slate Cinema clients. See IndustryData.testimonial comment.
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
    blurb: 'High-energy sports and fitness content built for retention — Gotham Rugby, Kids of Courage marathons, and Camp Slapshots.',
    description: "Sports content lives or dies in the first second. We build hype reels, athlete features, and event coverage engineered around retention — fast cuts, real footage, and a sound design that hits as hard as the content does. This is content built for people who scroll fast and stop for even faster.",
    stat: 'Gotham Rugby · Kids of Courage',
    heroImage: '/images/ind_ath_hero.webp',
    heroVideo: '/videos/production.mp4',
    gallery: [
      '/images/ind_ath_gal1.webp',
      '/images/ind_ath_gal2.webp',
      '/images/ind_ath_gal3.webp',
    ],
    // Anchored on real, on-file work: Gotham Rugby (match coverage, Randall's
    // Island NYC), Kids of Courage marathons (nationwide, 2018-2021), Camp
    // Slapshots. A "Same-Day Turnaround" claim was dropped intentionally --
    // per the audit doc, that section is only true for a since-lapsed
    // client relationship, and shouldn't be implied without a current
    // project to back it up.
    stats: [
      { value: 2018, suffix: '–2021', label: 'Kids of Courage Marathons' },
      { value: 3, suffix: '', label: 'Named Athletics Clients' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['Hype reels', 'Athlete feature films', 'Product launch content', 'Live event capture'],
    // Moved here 2026-08-13 from the now-retired dedicated
    // portfolio/athletics/page.tsx + AthleticsClientShowcase.tsx --
    // Athletics was the first page built in this format; folding it back
    // into the generic template (now used by every industry) means one
    // system instead of a special case. Sourcing notes unchanged: Gotham
    // Rugby and Camp Slapshots paraphrase the old site's own project-page
    // copy; Kids of Courage's marathon detail is from the audit doc;
    // APEX NYC is a named real client with no further project detail on
    // file yet, kept brief rather than invented.
    clientShowcase: [
      { name: 'Gotham Rugby', year: '2022', body: "Match-day coverage at Randall's Island, NYC — storytelling built from the thrill of live competition, not a highlight reel cut after the fact.", video: '/videos/production.mp4' },
      { name: 'Kids of Courage', year: '2018–2021', body: 'Marathons filmed across the country — capturing the strength and joy of children with disabilities as they defy limits, nationwide.', video: '/videos/pre-production.mp4' },
      { name: 'Camp Slapshots', year: '2023', body: 'The thrill of sports paired with visual effects — an unforgettable experience built for a young, high-energy audience.', video: '/videos/post-production.mp4' },
      { name: 'APEX NYC', year: '', body: 'A named Slate Athletics client — full project detail on file, not yet published here.', video: '/videos/distribution.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'Why Speed Matters',
      lines: ['Content built for', 'people who scroll fast.'],
      body: 'A hype reel has less than a second to earn the next second. Every cut, every beat, every frame is built around that one job — hold attention through the scroll, not just look good after it stops.',
      videoSrc: '/videos/hero-camera.mp4',
    },
    serviceCards: [
      {
        title: 'Hype Reels',
        description: 'Fast-cut, high-energy edits built around real training and competition footage — designed to open strong and hold to the last frame.',
        outcome: 'Retention-first cuts',
        deliverables: ['On-site multi-cam capture', 'Beat-synced fast edit', 'Sound design pass', 'Feed-native ratios'],
        meta: '15–60s · 2–4 wks',
        image: '/images/ind_ath_gal1.webp',
        featured: true,
      },
      {
        title: 'Athlete Feature Films',
        description: 'A longer-form profile piece that gives an athlete or team a real narrative arc, not just a highlight reel.',
        outcome: 'Sponsor-ready long-form',
        deliverables: ['Interview + b-roll shoot', 'Story-driven edit', 'Broadcast + social cutdowns'],
        meta: '2–4 min · 4–6 wks',
        image: '/images/ind_ath_gal2.webp',
      },
      {
        title: 'Product Launch Content',
        description: 'Gear and apparel drops shot and cut with the same intensity as the sport itself.',
        outcome: 'Launch-day ready',
        deliverables: ['Studio + on-field shoot', 'Launch film', 'Ad cutdowns'],
        meta: '30–90s · 3–5 wks',
        image: '/images/ind_ath_gal3.webp',
      },
      {
        title: 'Live Event Capture',
        description: 'Multi-camera coverage of competitions, tournaments and activations, turned around fast enough to still matter — our Gotham Rugby coverage at Randall\'s Island, NYC, was built exactly this way.',
        outcome: 'Same-week delivery',
        deliverables: ['Multi-cam crew on-site', 'Same-week edit turnaround', 'Recap + social clips'],
        meta: 'Event day · 1–2 wk turnaround',
        image: '/images/ind_ath_hero.webp',
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
    blurb: 'Aspirational destination and hospitality films — Sleepy Hollow Hotel, Smash House Burgers, Inhale Miami, Envision Festival.',
    description: "Travel and hospitality content has one job: make someone feel like they're already there. We shoot destination films and property showcases with cinema drones, golden-hour scheduling, and a color grade built to make a place feel like a memory before the viewer has even booked. Internal favorite: our Sleepy Hollow Hotel shoot, AI virtual staging included — \"it's a hotel, you have models in there.\"",
    stat: 'Sleepy Hollow · Smash House',
    heroImage: '/images/ind_travel_hero.webp',
    heroVideo: '/videos/hero-camera.mp4',
    gallery: [
      '/images/ind_travel_gal1.webp',
      '/images/ind_travel_gal2.webp',
      '/images/ind_travel_gal3.webp',
    ],
    stats: [
      { value: 4, suffix: '', label: 'Smash House Locations' },
      { value: 5, suffix: 'yrs', label: 'Running With Gateways' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['Destination films', 'Aerial cinematography', 'Property showcases', 'Hospitality brand content'],
    clientShowcase: [
      { name: 'Sleepy Hollow Hotel', year: '2024', body: "Video and drone coverage of a landmark hotel property — AI virtual staging filled in wherever a space wasn't furniture-ready on shoot day.", video: '/videos/hero.mp4' },
      { name: 'Envision Festival', year: '2024', body: 'Multi-day festival recap coverage in Costa Rica, turned around fast enough to still ride the post-event wave.', video: '/videos/hero-camera.mp4' },
      { name: 'Gateways', year: '5 yrs running', body: 'Seasonal Passover program coverage for a nonprofit serving thousands of families, plus year-round event and brochure work.', video: '/videos/distribution.mp4' },
      { name: 'Smash House Burgers', year: '2025', body: 'A recurring social content engine across every location — comedy reels, menu drops, launches, every week.', video: '/videos/production.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'Sell The Feeling',
      lines: ['Not just the room —', 'the feeling of being there.'],
      body: 'Cinema drones, golden-hour scheduling, a grade built to make a place feel like a memory before the viewer has even booked.',
      videoSrc: '/videos/hero.mp4',
    },
    serviceCards: [
      {
        title: 'Destination Films',
        description: 'A cinematic overview of a place — landscape, culture, pace of life — built to make someone start planning a trip before the film ends.',
        outcome: 'Booking-intent content',
        deliverables: ['Location scouting', 'Golden-hour shoot schedule', 'Cinema drone footage', 'Full grade'],
        meta: '60–120s · 5–7 wks',
        image: '/images/ind_travel_gal1.webp',
        featured: true,
      },
      {
        title: 'Aerial Cinematography',
        description: 'Drone-native coverage of coastlines, resorts and landscapes — the reveal shot every hospitality brand needs.',
        outcome: 'Cinema-grade aerials',
        deliverables: ['Cinema drone operator', '4K aerial passes', 'Stabilized + graded footage'],
        meta: '1–2 shoot days · 2–3 wks',
        image: '/images/ind_travel_gal2.webp',
      },
      {
        title: 'Property Showcases',
        description: 'Walkthrough films for resorts and stays that sell the room, the view and the feeling in one edit — AI virtual staging available for spaces that aren\'t furniture-ready on shoot day, as delivered for Sleepy Hollow Hotel.',
        outcome: 'Booking-page ready',
        deliverables: ['Interior + exterior shoot', 'Property walkthrough edit', 'Web + social cutdowns'],
        meta: '30–90s · 3–5 wks',
        image: '/images/ind_travel_gal3.webp',
      },
      {
        title: 'Hospitality Brand Content',
        description: 'Ongoing content built around a property or destination brand — social-native, always on-brand.',
        outcome: 'Always-on content',
        deliverables: ['Content shoot day', 'Batch social cutdowns', 'Brand-consistent grade'],
        meta: 'Batch · 4–6 wks',
        image: '/images/ind_travel_hero.webp',
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
    label: 'Construction & Real Estate',
    icon: Building2,
    accent: '#a855f7',
    blurb: 'A real, connected story: Tremco (manufacturer) → CVM Construction (contractor) → TruBlue (realtor-focused content).',
    // Reuses the old site's own unfinished /realestate hero line verbatim,
    // per the audit doc ("already written -- reuse it"). Flagship anchor:
    // CVM Construction, a Woodside NY general contractor -- 150+ NYC
    // building permits, top 5% of NY contractors on BuildZoom, SCA school
    // projects + Local Law 11 facade work. Slate took them from an
    // "under construction" placeholder site to a 13-page brand-new site,
    // 25-50+ edited pieces, 3 hero videos, and a second brand (CVM Waste)
    // launched from scratch.
    description: "Cinematic real estate marketing that sells more than a property. Our flagship story here is CVM Construction — a NYC general contractor with 150+ building permits and zero web presence when we started, now a full brand system with its own site and a second company (CVM Waste) built from the ground up. We shoot property tours, development timelapses, and aerial cinematography that make a space feel real before a buyer ever steps inside.",
    stat: 'CVM · TruBlue · Tremco',
    heroImage: '/images/ind_realestate_hero.webp',
    heroVideo: '/videos/distribution.mp4',
    gallery: [
      '/images/ind_realestate_gal1.webp',
      '/images/ind_realestate_gal2.webp',
      '/images/ind_realestate_gal3.webp',
    ],
    stats: [
      { value: 150, suffix: '+', label: 'CVM Building Permits' },
      { value: 5, suffix: '', label: 'Top % of NY Contractors' },
      { value: 8, suffix: '+', label: 'TruBlue Reels Delivered' },
      { value: 25, suffix: '+', label: 'Pieces Edited for CVM' },
    ],
    services: ['Cinematic property tours', 'Development timelapses', 'Aerial drone cinematography', 'Agent brand films'],
    clientShowcase: [
      { name: 'CVM Construction', year: '2025', body: '150+ NYC building permits, top 5% of NY contractors — taken from zero web presence to a full brand system, plus a second brand (CVM Waste) built from scratch.', video: '/videos/distribution.mp4' },
      { name: 'TruBlue of NW Brooklyn', year: '2025', body: '"Before Your Listing Photos, Fix These First" — concept-titled comedy reels aimed at homeowners and the realtors who list their homes.', video: '/videos/production.mp4' },
      { name: 'Good Choice Realty', year: '2021', body: 'A dynamic walkthrough and glamour tour built to move listings faster, from stunning aerials to immersive interiors.', video: '/videos/pre-production.mp4' },
      { name: 'Offerman House', year: '2024', body: 'A Brooklyn luxury development, covered end to end.', video: '/videos/hero-camera.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'Concept To Closing',
      lines: ['We shoot the blueprint,', 'the build, and the sale.'],
      body: 'Real estate is the final step of construction — we run the timeline the same way: a blueprint, a build, and a finish, all cinematic.',
      videoSrc: '/videos/distribution.mp4',
    },
    serviceCards: [
      {
        title: 'Cinematic Property Tours',
        description: "A full walkthrough film that makes a listing feel real before a buyer steps inside — shot to move fast on the market. Offerman House (Brooklyn luxury development) and Shefa Living's Mountain View series both shot this way.",
        outcome: 'Built to move listings',
        deliverables: ['Interior + exterior shoot', 'Full walkthrough edit', 'MLS + social cutdowns'],
        meta: '60–90s · 2–3 wks',
        image: '/images/ind_realestate_gal1.webp',
        featured: true,
      },
      {
        title: 'Development Timelapses',
        description: 'Long-run capture of a project rising from groundbreak to grand opening, condensed into a compelling story.',
        outcome: 'Milestone-ready footage',
        deliverables: ['Fixed-rig or scheduled capture', 'Progress edits', 'Final compilation film'],
        meta: 'Multi-month · scheduled visits',
        image: '/images/ind_realestate_gal2.webp',
      },
      {
        title: 'Aerial Drone Cinematography',
        description: "The reveal shot that shows a property, a lot, or a neighborhood in a way ground photography can't.",
        outcome: 'Standout listing media',
        deliverables: ['Licensed drone operator', '4K aerial passes', 'Graded aerial footage'],
        meta: '1 shoot day · 1–2 wks',
        image: '/images/ind_realestate_gal3.webp',
      },
      {
        title: 'Agent & Brokerage Brand Films',
        description: 'A short brand film for an agent or brokerage that builds trust before the first phone call — TruBlue of NW Brooklyn\'s concept-titled reels ("Before Your Listing Photos, Fix These First") speak directly to agents this way.',
        outcome: 'Trust-building brand asset',
        deliverables: ['Interview + lifestyle shoot', 'Brand film edit', 'Social cutdowns'],
        meta: '60–90s · 3–4 wks',
        image: '/images/ind_realestate_hero.webp',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'Listing goals, timeline and target buyer — a one-page shoot brief.' },
      { week: 'Wk 1', title: 'Schedule', body: 'Shoot day booked around staging, light and listing deadlines.' },
      { week: 'Wk 1–2', title: 'Shoot', body: 'Interior, exterior and aerial capture in a single coordinated visit.' },
      { week: 'Wk 2–3', title: 'Edit', body: 'Walkthrough edit and cutdowns, reviewed against the listing timeline.' },
      { week: 'Wk 3', title: 'Deliver', body: 'MLS-ready files plus every social ratio.' },
    ],
    faqs: [
      { question: 'How fast can you turn around a listing?', answer: "Standard property tours run 2–3 weeks from shoot to delivery — and we'll always work with your listing deadline, not against it." },
      { question: 'Do you coordinate with our stager or agent?', answer: 'Yes — we schedule around staging and agent availability so the property shows its best on shoot day.' },
      { question: 'Can you shoot drone footage in our area?', answer: 'In most cases, yes — we handle permitting and airspace checks and flag early if a location has restrictions.' },
      { question: "What if the property isn't fully staged yet?", answer: 'Tell us early and we\'ll plan around it — partial staging, vacant units and pre-construction all shoot differently, and we adjust the plan accordingly.' },
      { question: 'Who owns the final footage?', answer: 'You do — full usage rights on every deliverable, plus source files on final invoice.' },
    ],
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    label: 'Healthcare',
    icon: HeartPulse,
    accent: '#ef4444',
    blurb: 'Trust-building patient stories, facility films, and clear explainer content for regulated industries. Long-form nursing-home and dental work runs through our sister brand, Wavecare.',
    description: "Healthcare content has to earn trust before it earns attention. We build patient stories, facility films, and explainer content that stay clear, compliant, and human — content built for an audience that needs to trust you before they'll listen to you. Dedicated healthcare-facility work (nursing homes, care networks) runs under Wavecare, our sister brand — see wavecare.io.",
    stat: 'Park Smiles NYC · EKGx',
    heroImage: '/images/ind_health_hero.webp',
    heroVideo: '/videos/pre-production.mp4',
    gallery: [
      '/images/ind_health_gal1.webp',
      '/images/ind_health_gal2.webp',
      '/images/ind_health_gal3.webp',
    ],
    stats: [
      { value: 5, suffix: '', label: 'EKGx Deliverables' },
      { value: 100, suffix: '%', label: 'Compliance-Reviewed' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['Patient story films', 'Practice & facility films', 'Medical-app commercial suites', 'Regulated-industry compliant edits'],
  },
  {
    id: 'products',
    slug: 'products',
    label: 'Products',
    icon: ShoppingBag,
    accent: '#eab308',
    blurb: 'Scroll-stopping product spotlights and e-commerce ads — EIR NYC jewelry & skincare, marketplace-ready image sets.',
    description: "Product content only works if it converts. We shoot macro-lit spotlights and e-commerce ads with a signature color grade and cuts built to sell in six seconds or less — engineered for conversion first, aesthetics second, though we rarely have to choose between the two. Real client work: EIR NYC's full jewelry & skincare catalog, shot and cut end-to-end.",
    stat: '743 stock clips, 8 markets',
    heroImage: '/images/ind_products_hero.webp',
    heroVideo: '/videos/production.mp4',
    gallery: [
      '/images/ind_products_gal1.webp',
      'https://images.unsplash.com/photo-1603219225728-0c9e319d2373?q=80&w=1200',
      '/images/portfolio-social.webp',
    ],
    stats: [
      { value: 743, suffix: '', label: 'Stock Clips, 8 Marketplaces' },
      { value: 4287, suffix: '', label: 'Clip Aerial Library' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['Macro product photography', 'E-commerce ad cuts', 'Signature color grading', 'Platform-native spotlights'],
    clientShowcase: [
      { name: 'EIR NYC', year: '2024', body: 'A full jewelry & skincare catalog — Cream, Earrings, Necklaces, Socks — shot and cut end to end as one coordinated product series.', video: '/videos/production.mp4' },
      { name: 'Alo Moves', year: '2023', body: "A vertical commercial cut built for the fitness platform's own product launch.", video: '/videos/hero-camera.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'Built To Convert',
      lines: ['Macro-lit,', 'engineered to sell.'],
      body: 'A signature grade and cuts built to sell in six seconds or less — engineered for conversion first, aesthetics second, though we rarely have to choose between the two.',
      videoSrc: '/videos/production.mp4',
    },
    serviceCards: [
      {
        title: 'Macro Product Spotlights',
        description: 'Macro-lit hero shots and turntable sequences that make a product the whole frame — built for the scroll-stopping first second.',
        outcome: 'Thumb-stopping opens',
        deliverables: ['Macro lighting setup', 'Hero shot sequence', 'Multi-angle coverage', 'Signature grade'],
        meta: '15–30s · 2–3 wks',
        image: '/images/ind_products_hero.webp',
        featured: true,
      },
      {
        title: 'E-Commerce Ad Cuts',
        description: 'Hook-first ad edits sized and paced for paid social, ready to test against a ROAS target.',
        outcome: 'Ready to A/B test',
        deliverables: ['Hook-first edit', 'A/B variant cuts', 'Platform-native ratios'],
        meta: '6–15s × N · 2 wks',
        image: '/images/ind_products_gal1.webp',
      },
      {
        title: 'Signature Color Grading',
        description: 'A consistent, brand-specific grade applied across every spotlight so the catalog reads as one collection.',
        outcome: 'Catalog-wide consistency',
        deliverables: ['Custom LUT development', 'Full-catalog grade pass', 'Delivery specs per platform'],
        meta: 'Batch · 1–2 wks',
        image: '/images/portfolio-social.webp',
      },
      {
        title: 'Platform-Native Spotlights',
        description: 'The same product, cut natively for every placement — feed, story, PDP — instead of one video stretched to fit.',
        outcome: 'One shoot, every placement',
        deliverables: ['Multi-ratio shoot plan', 'Platform-specific cutdowns', 'PDP-ready master'],
        meta: '30–60s · 2–3 wks',
        image: 'https://images.unsplash.com/photo-1603219225728-0c9e319d2373?q=80&w=1200',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'ROAS targets, platforms and hero SKUs — a one-page shoot brief.' },
      { week: 'Wk 1', title: 'Shot list', body: 'Angles, macro setups and grade reference locked before the shoot.' },
      { week: 'Wk 1–2', title: 'Shoot', body: 'Studio-lit capture of every SKU on the list, macro and lifestyle.' },
      { week: 'Wk 2–3', title: 'Edit & grade', body: 'Platform-native cutdowns with the signature grade applied.' },
      { week: 'Wk 3', title: 'Deliver', body: 'Every ratio, every placement, source files included.' },
    ],
    faqs: [
      { question: 'Do we need to ship you physical product?', answer: "Yes, for macro and studio spotlights we shoot the real product — send it to our studio and we'll coordinate the return." },
      { question: 'How fast can you turn around an ad cut?', answer: 'Standard e-commerce cutdowns run 2 weeks from shoot to delivery, with rush lanes available for launch windows.' },
      { question: 'Can you test multiple hooks or variants?', answer: 'Yes — A/B variant cuts are a standard part of the e-commerce ad package, so you have something to test from day one.' },
      { question: 'Do you optimize for a specific platform?', answer: 'Every deliverable ships in platform-native ratios and specs — feed, story, and PDP are each cut differently, not stretched from one master.' },
      { question: 'Who owns the final footage?', answer: 'You do — full usage rights on every deliverable, plus source files on final invoice.' },
    ],
  },
  {
    id: 'corporate',
    slug: 'corporate',
    label: 'Corporate',
    icon: Briefcase,
    accent: '#0ea5e9',
    blurb: 'Brand films, culture reels, and executive communications — real clients from QotaPro to Skyline Capital.',
    description: "Corporate content is where most brands get boring. We build brand films, culture reels, and executive communications engineered to make a company feel like the people inside it — because the companies that feel human are the ones people actually want to work with.",
    stat: 'QotaPro · Skyline Capital',
    heroImage: '/images/ind_corporate_hero.webp',
    heroVideo: '/videos/performance.mp4',
    gallery: [
      '/images/portfolio-production.webp',
      'https://images.unsplash.com/photo-1611149974482-764b0c2a211a?q=80&w=1200',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
    ],
    stats: [
      { value: 124, suffix: '', label: 'Client Projects on Frame.io' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
      { value: 44, suffix: '', label: 'Google Reviews' },
    ],
    services: ['Brand & culture films', 'Executive communications', 'Internal comms video', 'Investor & recruiting content'],
    clientShowcase: [
      { name: 'MPower', year: '2024', body: 'A recruiter video plus event recap, built to attract talent, not just document an event.', video: '/videos/performance.mp4' },
      { name: 'QotaPro', year: '2025', body: 'Brand film work for a contractor-focused platform.', video: '/videos/production.mp4' },
      { name: 'Skyline Capital', year: '2025', body: 'Executive-facing brand communications for a capital firm.', video: '/videos/pre-production.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'People, Not Just Product',
      lines: ['The company behind', 'the company.'],
      body: "Corporate content is where most brands get boring. We build films that make a company feel like the people inside it — because that's who prospects and candidates are actually deciding to trust.",
      videoSrc: '/videos/performance.mp4',
    },
    serviceCards: [
      {
        title: 'Brand & Culture Films',
        description: 'A film that makes the people inside a company as visible as the product — shot to make prospects and candidates alike want in.',
        outcome: 'Human-first brand asset',
        deliverables: ['Interview + b-roll shoot', 'Story-driven edit', 'Web + social cutdowns'],
        meta: '2–3 min · 4–6 wks',
        image: '/images/ind_corporate_hero.webp',
        featured: true,
      },
      {
        title: 'Executive Communications',
        description: 'Polished, teleprompter-ready video for leadership — earnings updates, town halls, and external comms that still feel personal.',
        outcome: 'On-message, on-camera',
        deliverables: ['Studio or on-site shoot', 'Teleprompter direction', 'Multi-cam edit'],
        meta: '2–5 min · 2–3 wks',
        image: '/images/portfolio-production.webp',
      },
      {
        title: 'Internal Comms Video',
        description: 'All-hands updates, policy rollouts and training content built to actually get watched, not just archived.',
        outcome: 'Higher watch-through',
        deliverables: ['Script support', 'Studio shoot', 'Chaptered edit'],
        meta: '1–3 min · 2 wks',
        image: 'https://images.unsplash.com/photo-1611149974482-764b0c2a211a?q=80&w=1200',
      },
      {
        title: 'Investor & Recruiting Content',
        description: 'The film that runs before a pitch or a first interview — company story, numbers and culture in one confident cut.',
        outcome: 'First-impression asset',
        deliverables: ['Interview + facility shoot', 'Data-forward edit', 'Deck-ready cutdown'],
        meta: '90s–3 min · 3–5 wks',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'Audience, message and channels — a one-page brief signed off with stakeholders.' },
      { week: 'Wk 1–2', title: 'Script', body: 'Interview questions or exec script drafted and approved before anyone is on camera.' },
      { week: 'Wk 2–3', title: 'Shoot', body: 'On-site or studio production — interviews, b-roll and any executive footage.' },
      { week: 'Wk 3–5', title: 'Edit', body: 'Story-driven edit with two structured stakeholder review rounds.' },
      { week: 'Wk 6', title: 'Deliver', body: 'Every platform ratio, source files included.' },
    ],
    faqs: [
      { question: 'Can you work around executive schedules?', answer: "Yes — we build shoot days around leadership availability, including tight single-day windows when that's all the calendar allows." },
      { question: 'Do you handle messaging approval?', answer: 'Scripts and interview questions are approved by your team before we shoot, and every cut goes through stakeholder review before final delivery.' },
      { question: 'Can this run internally and externally?', answer: "Yes — we cut internal and external versions from the same shoot wherever the message overlaps, so you're not paying for two productions." },
      { question: 'How many revision rounds are included?', answer: 'Two structured rounds are built into every project, with clear feedback windows so timelines stay predictable.' },
      { question: 'Who owns the final footage?', answer: 'You do — full usage rights on every deliverable, plus source files on final invoice.' },
    ],
  },
  {
    id: 'organizations',
    slug: 'organizations',
    label: 'Organizations',
    icon: Users,
    accent: '#22c55e',
    blurb: 'Mission-driven storytelling for nonprofits and institutions — Chai Lifeline, HASC, NCSY, Gateways, and more.',
    description: "Mission-driven work needs to move people to actually do something — donate, volunteer, show up. We build storytelling for nonprofits and institutions engineered around a single call to action, shot with the same craft as any commercial campaign because your mission deserves it. Organizations is Slate's deepest historic vertical, spanning Chai Lifeline, HASC, NCSY, National Menorah, Israel Day Parade, Renewal, and Gateways — 5 years running with Gateways alone.",
    stat: 'Chai Lifeline · HASC · NCSY',
    heroImage: '/images/ind_orgs_hero.webp',
    heroVideo: '/videos/pre-production.mp4',
    gallery: [
      'https://images.unsplash.com/photo-1461532257246-777de18cd58b?q=80&w=1200',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200',
      '/images/ind_health_gal3.webp',
    ],
    stats: [
      { value: 7, suffix: '+', label: 'Named Organizations Served' },
      { value: 5, suffix: 'yrs', label: 'Running With Gateways' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['Mission & impact films', 'Donor & fundraising content', 'Volunteer recruitment films', 'Annual report video'],
    clientShowcase: [
      { name: 'Gateways', year: '5 yrs running', body: 'Seasonal Passover program coverage for a nonprofit serving thousands of families, plus year-round event and brochure work.', video: '/videos/distribution.mp4' },
      { name: 'Chai Lifeline', year: '2025', body: 'Mission-driven storytelling for a nonprofit serving families in crisis.', video: '/videos/pre-production.mp4' },
      { name: 'HASC', year: '2025', body: 'Program and community coverage for a nonprofit serving people with disabilities.', video: '/videos/production.mp4' },
      { name: 'NCSY', year: '2025', body: 'Event and community-impact coverage for a national youth movement.', video: '/videos/post-production.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'Mission, Not Just Message',
      lines: ['Storytelling that moves', 'people to actually act.'],
      body: 'Organizations is Slate’s deepest historic vertical. Mission-driven work needs to move people to actually do something — donate, volunteer, show up — shot with the same craft as any commercial campaign.',
      videoSrc: '/videos/pre-production.mp4',
    },
    serviceCards: [
      {
        title: 'Mission & Impact Films',
        description: "The flagship story film — who you serve, why it matters, and what a viewer's support actually does.",
        outcome: 'Built to move people to act',
        deliverables: ['Interview + on-location shoot', 'Story-driven edit', 'Event + web cutdowns'],
        meta: '2–4 min · 4–6 wks',
        image: 'https://images.unsplash.com/photo-1461532257246-777de18cd58b?q=80&w=1200',
        featured: true,
      },
      {
        title: 'Donor & Fundraising Content',
        description: 'Campaign-ready films built around a single, clear ask — for galas, year-end appeals, or capital campaigns.',
        outcome: 'Campaign-ready asset',
        deliverables: ['Campaign-specific edit', 'Ask-driven CTA cut', 'Social + email cutdowns'],
        meta: '60–90s · 3–4 wks',
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200',
      },
      {
        title: 'Volunteer Recruitment Films',
        description: 'Content built to move someone from watching to showing up — real volunteers, real impact, no stock footage.',
        outcome: 'Recruitment-focused cut',
        deliverables: ['On-location shoot', 'Volunteer interview capture', 'Recruitment-focused edit'],
        meta: '60–90s · 2–3 wks',
        image: '/images/ind_health_gal3.webp',
      },
      {
        title: 'Annual Report Video',
        description: 'The numbers-and-narrative recap that turns a written annual report into something a board or donor actually watches.',
        outcome: 'Board & donor-ready',
        deliverables: ['Data-forward edit', 'Leadership interview cutdowns', 'Web-ready master'],
        meta: '2–3 min · 4–5 wks',
        image: '/images/ind_orgs_hero.webp',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'Mission, audience and the single ask — a one-page brief.' },
      { week: 'Wk 1–2', title: 'Story plan', body: 'Who we interview, what we shoot, and the call to action locked before production.' },
      { week: 'Wk 2–3', title: 'Shoot', body: 'On-location capture — programs, people, and the impact in motion.' },
      { week: 'Wk 3–5', title: 'Edit', body: 'Story-driven edit with two structured stakeholder review rounds.' },
      { week: 'Wk 6', title: 'Deliver', body: 'Event, web and social cutdowns, source files included.' },
    ],
    faqs: [
      { question: 'Do you offer nonprofit-friendly pricing?', answer: "We scope every project around real budgets and are upfront about what's achievable at different price points — ask, and we'll tell you honestly what fits." },
      { question: 'Can you shoot around program schedules and privacy needs?', answer: 'Yes — we work with your team on consent, scheduling and any privacy considerations for the people and programs we film.' },
      { question: 'Can the film premiere at an event?', answer: 'Yes — we regularly deliver against gala and event dates, and can prioritize a shorter cut first if the full edit needs more time.' },
      { question: 'How many revision rounds are included?', answer: 'Two structured rounds are built into every project, with clear feedback windows so timelines stay predictable.' },
      { question: 'Who owns the final footage?', answer: 'You do — full usage rights on every deliverable, plus source files on final invoice.' },
    ],
  },
  {
    id: 'education',
    slug: 'education',
    label: 'Education',
    icon: GraduationCap,
    accent: '#6366f1',
    blurb: 'Graduations, open houses, and acceptance videos for real schools — Gateways, HANC, CSUSA, Bais Rivkah, Camp Mesorah.',
    // Real proof on file (per audit doc): Gateways (5 years of Passover
    // programs + 2024/2026 events + brochure promo), HANC Graduation 2024 +
    // Open House, CSUSA, Bais Rivkah, Camp Mesorah weekly videos, Heichal
    // HaTorah. 5 real Vimeo cuts also exist (open house / acceptance /
    // color war / STEM dept.) -- not linked below since the current
    // gallery only renders <img>; needs a video-embed gallery component
    // to actually surface those, flagged as follow-up work.
    description: "Prospective students decide whether they can see themselves on a campus in the first few seconds of a video. We build course and program trailers, campus tour films, faculty and student spotlights, and e-learning content engineered for enrollment marketing. Five years running with Gateways alone, plus HANC, CSUSA, Bais Rivkah, Camp Mesorah, and Heichal HaTorah — the same pre-production, production, post-production and distribution discipline we bring to every industry we work in.",
    stat: 'Gateways · HANC · CSUSA',
    heroImage: '/images/ind_corporate_hero.webp',
    heroVideo: '/videos/production.mp4',
    gallery: [
      '/images/mediavoid_creative_bright.webp',
      '/images/portfolio-social.webp',
      '/images/mediavoid_tech_bright.webp',
    ],
    stats: [
      { value: 5, suffix: 'yrs', label: 'Running With Gateways' },
      { value: 6, suffix: '+', label: 'Named School Clients' },
      { value: 174, suffix: '+', label: 'Projects Since 2023' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['Course & program trailers', 'Campus tour films', 'Faculty & student spotlights', 'Enrollment marketing content'],
    clientShowcase: [
      { name: 'Gateways', year: '5 yrs running', body: 'Seasonal Passover program coverage for a nonprofit school community, running five years without a break.', video: '/videos/distribution.mp4' },
      { name: 'HANC', year: '2023–2024', body: 'Graduation, open house, acceptance, and color war coverage — real school-life storytelling, not stock footage.', video: '/videos/production.mp4' },
      { name: 'Camp Mesorah', year: '2025', body: 'Weekly video coverage built into an ongoing camp content engine.', video: '/videos/pre-production.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'Show, Don’t Tell',
      lines: ['Help families see', 'themselves on campus.'],
      body: 'Prospective students decide whether they can see themselves on a campus in the first few seconds of a video. We build the film that makes that decision easy.',
      videoSrc: '/videos/production.mp4',
    },
    serviceCards: [
      {
        title: 'Course & Program Trailers',
        description: 'A short, energetic trailer that sells a course or program the way a great film sells a story — built for admissions pages and paid social alike.',
        outcome: 'Enrollment-ready first impression',
        deliverables: ['Faculty & student interviews', 'Campus + classroom b-roll', 'Story-driven edit', 'Every platform ratio'],
        meta: '30–90s · 4–6 wks',
        image: '/images/mediavoid_creative_bright.webp',
        featured: true,
      },
      {
        title: 'Campus Tour Films',
        description: 'A cinematic walk of campus that gives a prospective student a real feel for the place before they ever visit in person.',
        outcome: 'Virtual-visit ready',
        deliverables: ['Campus location shoot', 'Guided-tour style edit', 'Web + admissions cutdowns'],
        meta: '2–4 min · 4–6 wks',
        image: '/images/ind_corporate_hero.webp',
      },
      {
        title: 'Faculty & Student Spotlights',
        description: 'Real interviews with the people who make a program worth choosing — faculty, researchers, and current students.',
        outcome: 'Authentic, story-led proof',
        deliverables: ['Interview shoot', 'Story-driven edit', 'Social cutdowns'],
        meta: '60–120s · 3–4 wks',
        image: '/images/portfolio-social.webp',
      },
      {
        title: 'E-Learning & Course Content',
        description: "Clear, well-paced video for online courses and modules — built to hold attention through material that isn't naturally cinematic.",
        outcome: 'Built to hold attention',
        deliverables: ['Lecture or module capture', 'Chaptered edit', 'Captioning-ready master'],
        meta: 'Per module · 2–3 wks',
        image: '/images/mediavoid_tech_bright.webp',
      },
    ],
    process: [
      { week: 'Wk 1', title: 'Discover', body: 'Audience, program goals and enrollment timeline — a one-page brief.' },
      { week: 'Wk 1–2', title: 'Plan the shoot', body: 'Interview subjects, campus locations and shoot days scheduled around the academic calendar.' },
      { week: 'Wk 2–3', title: 'Shoot', body: 'On-campus capture — interviews, classroom b-roll and campus life.' },
      { week: 'Wk 3–5', title: 'Edit', body: 'Story-driven edit with two structured stakeholder review rounds.' },
      { week: 'Wk 6', title: 'Deliver', body: 'Admissions, web and social cutdowns, source files included.' },
    ],
    faqs: [
      { question: 'Have you worked with schools or universities before?', answer: "Education is a newer vertical for us, but the underlying craft — pre-production, production, post-production and distribution — is the same discipline we bring to every industry we serve. We're happy to start with a smaller pilot project so you can see the quality before committing to a bigger campaign." },
      { question: 'Can you work around the academic calendar?', answer: "Yes — we schedule shoots around term dates, exam periods and campus availability so production doesn't disrupt classes or staff." },
      { question: 'Do you handle student and minor consent and privacy?', answer: 'Yes — we work with your team on consent forms, appropriate handling of student information, and any privacy requirements before anyone is on camera.' },
      { question: 'Can you deliver content for both admissions and internal use?', answer: 'Yes — enrollment marketing, internal communications and e-learning content can often be planned around the same shoot to make the most of production time.' },
      { question: 'Who owns the final footage?', answer: 'You do — full usage rights on every deliverable, plus source files on final invoice.' },
    ],
  },
  {
    // Added 2026-08-13 -- "make the podcasts page just an industry page
    // same format and everything" (Kauan). Replaces the standalone
    // /podcasts route (ContainerScroll/StickyScroll/WeeklyEngine/
    // PodcastCaseStudy) with a normal industry entry using the same
    // format as every other page. Code-only for now (see
    // getNormalizedIndustries in normalize.ts) since there's no live DB
    // doc for it yet -- appears automatically in the nav dropdown and
    // /portfolio wheel like any other industry.
    id: 'podcasts',
    slug: 'podcasts',
    label: 'Podcasts',
    icon: Mic,
    accent: '#00AEEF',
    blurb: 'Podcast production as a service, proven on our own show — Real Talk (15 episodes, every Sunday) and World Within.',
    description: 'Podcast production as a service, proven on our own show every single week — full episode, three concept-titled reels, thumbnails, captions and carousels, on a real release calendar. Set design, multi-cam filming, and editing run the way an in-house team would run it, for your show instead of ours.',
    stat: 'Real Talk · World Within',
    heroImage: '/images/portfolio-brand.webp',
    heroVideo: '/videos/post-production.mp4',
    gallery: [
      '/images/portfolio-social.webp',
      '/images/portfolio-production.webp',
      '/images/portfolio-event.webp',
    ],
    stats: [
      { value: 15, suffix: '', label: 'Real Talk Episodes, S1' },
      { value: 31, suffix: '', label: 'Clips From One Episode' },
      { value: 3, suffix: '', label: 'Reels Shipped Every Week' },
      { value: 5, suffix: '', label: '.0 Google Rating' },
    ],
    services: ['Set design + studio build', 'Multi-cam filming', 'Full-episode edit', 'Distribution-ready exports'],
    clientShowcase: [
      { name: 'Real Talk', year: 'S1, 2025–26', body: 'A weekly conversation show produced end-to-end by Slate — full episode plus 3 reels, every single week, 15 episodes without missing one. Guests ranged from rabbis to an OB-GYN to a DJ.', video: '/videos/post-production.mp4' },
      { name: 'World Within', year: '2025', body: 'A client-side show run the same way we run our own: multi-camera filming with dedicated per-guest audio. Your show, our crew.', video: '/videos/production.mp4' },
    ],
    cinematicStatement: {
      eyebrow: 'A Real Release Calendar',
      lines: ['A full episode and', 'three reels — every week.'],
      body: 'Most agencies can’t show you a real release-ops calendar. We can — because we run one on ourselves, every week, without missing a Sunday.',
      videoSrc: '/videos/post-production.mp4',
    },
    serviceCards: [
      {
        title: 'Set Design + Studio Build',
        description: 'We designed and built the physical set the show is recorded on — a studio, not a rented room.',
        outcome: 'Real studio, not a background',
        deliverables: ['Set design', 'Studio build-out', 'Lighting + camera plan'],
        meta: 'One-time build · ongoing use',
        image: '/images/portfolio-brand.webp',
        featured: true,
      },
      {
        title: 'Multi-Cam Filming',
        description: 'Dedicated per-guest audio, cut multi-camera for a real broadcast feel.',
        outcome: 'Broadcast-quality capture',
        deliverables: ['Multi-camera crew', 'Per-guest audio', 'On-site direction'],
        meta: 'Weekly · per episode',
        image: '/images/portfolio-social.webp',
      },
      {
        title: 'Full-Episode Edit + Reels',
        description: 'Every episode edited start to finish, plus 3 concept-titled reels built around an actual hook — not auto-clipped highlights.',
        outcome: 'A full ep + 3 reels, weekly',
        deliverables: ['Full-episode edit', '3 concept-titled reels', 'Thumbnails + captions + carousels'],
        meta: 'Weekly turnaround',
        image: '/images/portfolio-production.webp',
      },
      {
        title: 'Distribution-Ready Exports',
        description: 'Dedicated podcast loudness presets, built into our in-house editor — ready for Spotify, YouTube, Instagram, Facebook, Amazon and Apple.',
        outcome: 'Every platform, every week',
        deliverables: ['Loudness-matched masters', 'Platform-native ratios', 'Distribution-ready files'],
        meta: 'Per episode',
        image: '/images/portfolio-event.webp',
      },
    ],
    process: [
      { week: 'Mon', title: 'Full Episode', body: 'The complete episode edit, mixed and mastered to podcast loudness spec.' },
      { week: 'Tue', title: 'Reel 1', body: 'First concept-titled clip, cut for the feed.' },
      { week: 'Thu', title: 'Reel 2', body: 'Second concept-titled clip — a different beat from the same episode.' },
      { week: 'Sat', title: 'Reel 3', body: 'Third concept-titled clip, timed to lead into Sunday’s drop.' },
      { week: 'Sun', title: 'The Drop', body: 'Full episode goes live everywhere, on schedule, every week.' },
    ],
  },
]

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug)
}
