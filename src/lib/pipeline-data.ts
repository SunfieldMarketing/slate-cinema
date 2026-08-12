export interface Service {
  name: string
  tags?: string[]
  desc?: string
}

export interface Category {
  id: string
  title: string
  video: string
  color: string
  services: Service[]
}

export const categories: Category[] = [
  {
    id: 'pre-production',
    title: 'Pre-Production',
    video: '/videos/pre-production.mp4',
    color: '#00AEEF',
    services: [
      { name: 'Concepts', tags: ['Scripts + Storyboards', 'Call Sheet + Schedules', 'Outlines + Shotlists'] },
      { name: 'Producing', tags: ['Casting + Locations', 'Scouting + Hiring Crew', 'Logistics + Legal'] },
    ],
  },
  {
    id: 'production',
    title: 'Production',
    video: '/videos/production.mp4',
    color: '#a855f7',
    services: [
      { name: 'Crew', tags: ['Directors', 'Camera Crew', 'Sound Crew'] },
      { name: 'Talent', tags: ['Actors / Child Actors', 'Musicians + Dancers', 'Animals'] },
      { name: 'Set Design', tags: ['Set Designers + Props', 'Hair + Makeup', 'Wardrobe'] },
    ],
  },
  {
    // Consolidated to the same 2-category / tags-list shape as
    // Pre-Production and Production (client audit 2026-08-12: this
    // section previously rendered as loose description paragraphs
    // instead of the bullet-list format used everywhere else).
    id: 'post-production',
    title: 'Post-Production',
    video: '/videos/post-production.mp4',
    color: '#10b981',
    services: [
      { name: 'Edit + Finish', tags: ['Editing + Revisions', 'Color + Sound Design', 'Delivery + Export Prep'] },
      { name: 'Visual Enhancement', tags: ['Motion Graphics', 'VFX', 'AI-Assisted Post Tools'] },
    ],
  },
  {
    id: 'distribution',
    title: 'Distribution',
    video: '/videos/distribution.mp4',
    color: '#f97316',
    services: [
      { name: 'Social Media Marketing', desc: 'Strategically structure your online presence with scheduled posts and account management.' },
      { name: 'OOH Advertising', desc: 'Target your specific clientele with local out-of-home ads.' },
      { name: 'Ads Management', desc: 'Run successful ad campaigns to drive sales and lead generation.' },
    ],
  },
]
