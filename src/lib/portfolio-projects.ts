export interface PortfolioProject {
  title: string
  category: string
  company: string
  url: string
  copy: string
  metrics: { label: string; value: string }[]
  span?: 'wide' | 'tall' | 'normal'
}

/**
 * The site's real project set — shared between the Portfolio grid and the
 * 3D film-reel showcase so both stay in sync off one source of truth.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    title: 'Neon Nights',
    category: 'Commercial',
    company: 'HyperDrive Motors',
    url: '/images/portfolio-brand.png',
    copy: 'A neon-lit launch film for the flagship model, cut for broadcast and the feed alike.',
    metrics: [{ label: 'Views', value: '4.2M' }, { label: 'Conv.', value: '+34%' }],
    span: 'wide',
  },
  {
    title: 'Velocity',
    category: 'Social',
    company: 'Apex Athletics',
    url: '/images/portfolio-social.png',
    copy: "Fast-cut training footage built for Apex Athletics' always-on social calendar.",
    metrics: [{ label: 'Reach', value: '12.1M' }, { label: 'Engage', value: '18.5%' }],
    span: 'tall',
  },
  {
    title: 'The Blueprint',
    category: 'Documentary',
    company: 'Nexus Architecture',
    url: '/images/portfolio-production.png',
    copy: "A documentary-style walkthrough of Nexus Architecture's landmark build.",
    metrics: [{ label: 'Brand Lift', value: '+45%' }, { label: 'Watch', value: '1:45' }],
  },
  {
    title: 'Ascension',
    category: 'Event',
    company: 'Summit Conf.',
    url: '/images/portfolio-event.png',
    copy: 'Multi-camera capture of Summit Conf., turned around same-week for recap distribution.',
    metrics: [{ label: 'Attendees', value: '15k+' }, { label: 'Shares', value: '4.8k' }],
  },
  {
    title: 'Automotive Cinema',
    category: 'Action',
    company: 'Velocity Co',
    url: '/images/portfolio_auto_bright.png',
    copy: 'High-speed cinematography engineered for the scroll.',
    metrics: [{ label: 'Views', value: '8.4M' }, { label: 'Shares', value: '245k' }],
    span: 'tall',
  },
  {
    title: 'Product Focus',
    category: 'E-Commerce',
    company: 'Lumiere Beauty',
    url: '/images/portfolio_beauty_bright.png',
    copy: 'Macro-lit product spotlights built to convert for Lumiere Beauty.',
    metrics: [{ label: 'ROAS', value: '4.2x' }, { label: 'Sales', value: '+$1.2M' }],
  },
  {
    title: 'Aerial Cinematography',
    category: 'Drone',
    company: 'Vista Real Estate',
    url: '/images/portfolio_realestate_bright.png',
    copy: 'Drone-native property reveals that move listings faster.',
    metrics: [{ label: 'Watch', value: '98%' }, { label: 'Shares', value: '12k' }],
    span: 'wide',
  },
  {
    title: 'Impact Film',
    category: 'Narrative',
    company: 'Global Health Org',
    url: '/images/portfolio_impact_bright.png',
    copy: 'A mission-driven narrative film built to move a room.',
    metrics: [{ label: 'Awards', value: '3' }, { label: 'Views', value: '1.1M' }],
  },
]
