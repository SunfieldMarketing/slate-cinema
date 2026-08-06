import type { GlobalConfig } from 'payload'

export const PortfolioIndexPage: GlobalConfig = {
  slug: 'portfolio-index-page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'video', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', defaultValue: 'Our Work' },
        { name: 'date', type: 'text', defaultValue: 'Selected Campaigns' },
        { name: 'scrollToExpandLabel', type: 'text', defaultValue: 'Scroll To Explore' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            "Discover a world of captivating storytelling. From immersive brand journeys to campaigns that dominate the feed — this is Slate Cinema's showcase.",
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Get Started' },
        { name: 'ctaHref', type: 'text', defaultValue: '/contact' },
      ],
    },
    {
      name: 'reelCarousel',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'The Reel' },
        { name: 'headline', type: 'text', defaultValue: 'Spin through the work' },
        { name: 'subhead', type: 'text', defaultValue: 'Drag to spin the reel · click a frame to open it' },
      ],
    },
    {
      name: 'industriesSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Who We Work With' },
        { name: 'headline', type: 'text', defaultValue: 'Cinematic work for every industry' },
      ],
    },
    {
      name: 'portfolioFilters',
      type: 'array',
      admin: { description: 'Category filter pills on the project grid (must include "All" plus every category used across PortfolioProjects)' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}
