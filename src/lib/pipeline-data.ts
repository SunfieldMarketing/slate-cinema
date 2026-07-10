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
    id: 'post-production',
    title: 'Post-Production',
    video: '/videos/post-production.mp4',
    color: '#10b981',
    services: [
      { name: 'Cut + Color', desc: 'Obtain a clean edit at an affordable price.' },
      { name: 'Sound Design', desc: 'Bring your dream to life with realistic sound effects and intricate sound design.' },
      { name: 'Motion Graphics', desc: "When static images aren't enough, let motion tell your story through animated graphics." },
      { name: '2D + 3D', desc: 'Create new worlds with our custom animation services.' },
      { name: 'AI Services', desc: 'From upscaling to image generation, inquire about our AI-assisted editing models.' },
      { name: 'VFX', desc: 'Create custom visual effects that turn your dreams into reality.' },
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
