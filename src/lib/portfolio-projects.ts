export interface PortfolioProject {
  title: string
  category: string
  company: string
  url: string
  copy: string
  metrics: { label: string; value: string }[]
  /** Featured cut shown in the project card modal. */
  video?: string
}

/**
 * The site's real project set — shared between the Portfolio grid and the
 * 3D film-reel showcase so both stay in sync off one source of truth.
 *
 * Replaced 2026-08-12: the previous 8 entries (Neon Nights/HyperDrive
 * Motors, Velocity/Apex Athletics, etc.) were 100% fabricated template
 * content — invented companies, invented view counts/ROAS/reach numbers,
 * never real Slate Cinema clients or results. Confirmed via a client-
 * shared audit doc. These 8 are real, from actual project records
 * (2023-2026); every metric below is something stated in that doc, not
 * invented. `category` is currently unused (the filter-chip UI and
 * per-card category tag were both removed per client request), kept
 * only for data hygiene.
 *
 * Imagery/video below still points at the same generic stock/AI-model
 * placeholder assets the fake entries used — no real footage for these
 * specific projects has been supplied yet. Swap `url`/`video` for real
 * media per project as it comes in; the text is what mattered to fix
 * first (a fabricated client is a different problem than a placeholder
 * photo).
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    title: 'Zero to One',
    video: '/videos/production.mp4',
    category: 'Brand',
    company: 'CVM Construction',
    url: '/images/portfolio-brand.webp',
    copy: 'A NYC general contractor with 150+ building permits and zero web presence — strategy, a full content library, and a brand-new site and second brand (CVM Waste) built from scratch.',
    metrics: [{ label: 'Building Permits', value: '150+' }, { label: 'NY Contractors', value: 'Top 5%' }],
  },
  {
    title: 'The Weekly Engine',
    video: '/videos/performance.mp4',
    category: 'Podcast',
    company: 'Real Talk',
    url: '/images/portfolio-social.webp',
    copy: 'A weekly podcast produced end-to-end in-house — full episodes, concept-titled reels, thumbnails, and captions, shipped every single week without missing one.',
    metrics: [{ label: 'Episodes, S1', value: '15' }, { label: 'Clips / Episode', value: '31' }],
  },
  {
    title: 'Before Your Listing Photos',
    video: '/videos/pre-production.mp4',
    category: 'Social',
    company: 'TruBlue of NW Brooklyn',
    url: '/images/portfolio-production.webp',
    copy: "Concept-titled comedy reels aimed at homeowners and the realtors who list their homes — a recurring social engine, not a one-off shoot.",
    metrics: [{ label: 'Reels Delivered', value: '8+' }, { label: 'Format', value: 'Recurring Series' }],
  },
  {
    title: 'The Medical App Suite',
    video: '/videos/dj-vinyl.mp4',
    category: 'Commercial',
    company: 'EKGx',
    url: '/images/portfolio-event.webp',
    copy: 'A full commercial suite for a medical-app launch — hero ads, a 120-second how-to, and a speed test, delivered as one coordinated release.',
    metrics: [{ label: 'Deliverables', value: '5' }, { label: 'Category', value: 'Medical App' }],
  },
  {
    title: 'The Content Engine',
    video: '/videos/hero-camera.mp4',
    category: 'Social',
    company: 'Smash House Burgers',
    url: '/images/portfolio_auto_bright.webp',
    copy: 'A recurring social content engine for a multi-location burger chain — comedy reels, menu drops, and location launches across every store, every week.',
    metrics: [{ label: 'Locations', value: '4+' }, { label: 'Cadence', value: 'Weekly' }],
  },
  {
    title: 'Chairside Calm',
    video: '/videos/post-production.mp4',
    category: 'Healthcare',
    company: 'Park Smiles NYC',
    url: '/images/portfolio_beauty_bright.webp',
    copy: 'A practice-focused piece built to put patients at ease before they ever sit in the chair.',
    metrics: [{ label: 'Format', value: 'Patient-Focused' }, { label: 'Category', value: 'Healthcare' }],
  },
  {
    title: 'It’s a Hotel',
    video: '/videos/hero.mp4',
    category: 'Hospitality',
    company: 'Sleepy Hollow Hotel',
    url: '/images/portfolio_realestate_bright.webp',
    copy: 'Video and drone coverage of a landmark hotel property, polished enough that guests could be mistaken for models.',
    metrics: [{ label: 'Coverage', value: 'Video + Drone' }, { label: 'Category', value: 'Hospitality' }],
  },
  {
    title: 'Timeless Passover Memories',
    video: '/videos/distribution.mp4',
    category: 'Nonprofit',
    company: 'Gateways',
    url: '/images/portfolio_impact_bright.webp',
    copy: 'Five years running: seasonal Passover program coverage plus year-round event and brochure work for a nonprofit serving thousands of families.',
    metrics: [{ label: 'Years Running', value: '5' }, { label: 'Category', value: 'Nonprofit' }],
  },
]
