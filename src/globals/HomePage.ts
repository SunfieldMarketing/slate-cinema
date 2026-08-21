import type { GlobalConfig } from 'payload'

/*
  Every hardcoded string/media reference on the homepage that isn't
  already covered by a dedicated collection (Industries, PortfolioProjects)
  or shared global (Pipeline, FinalCTA, Navigation, Footer, SiteSettings).
  Covers: Hero, TrustSection, Results, Reviews.
*/
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  versions: { drafts: true },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'wordmarkPart1', type: 'text', required: true, defaultValue: 'SLATE' },
        { name: 'wordmarkPart2', type: 'text', required: true, defaultValue: 'CINEMA' },
        { name: 'subtitle', type: 'text', required: true, defaultValue: 'Video Marketing At Your Fingertips' },
        { name: 'ctaLabel', type: 'text', required: true, defaultValue: 'Get Started' },
        { name: 'ctaHref', type: 'text', required: true, defaultValue: '/contact' },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Watch Our Reel' },
        { name: 'secondaryCtaHref', type: 'text', defaultValue: '#reel' },
      ],
    },
    {
      name: 'mediaVoid',
      type: 'group',
      admin: { description: 'The scattered-then-assembled 3D text moment between Pipeline and Results' },
      fields: [
        {
          name: 'lines',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'color', type: 'text', required: true, defaultValue: '#ffffff', admin: { description: 'Hex color' } },
          ],
        },
      ],
    },
    {
      name: 'industryStandards',
      type: 'group',
      admin: { description: 'The 3-phase pinned scroll section ("WE ENGINEER ATTENTION" / "EVERY FRAME" / "DOMINATE YOUR MARKET")' },
      fields: [
        {
          name: 'phase1',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: '// The Standard' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'WE ENGINEER' },
            { name: 'headlineLine2', type: 'text', defaultValue: 'ATTENTION' },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                "In a crowded digital landscape, being 'good enough' means being invisible. We build content systems designed specifically to hijack feeds, halt thumbs, and demand viewer retention from the very first frame.",
            },
          ],
        },
        {
          name: 'phase2',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: '// The Execution' },
            { name: 'headline', type: 'text', defaultValue: 'EVERY FRAME' },
            {
              name: 'morphWords',
              type: 'array',
              minRows: 1,
              admin: { description: 'Words that morph/cycle in place under the headline' },
              fields: [{ name: 'word', type: 'text', required: true }],
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                "We don't just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.",
            },
          ],
        },
        {
          name: 'phase3',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: '// The Result' },
            { name: 'headline', type: 'text', defaultValue: 'DOMINATE YOUR MARKET' },
            {
              name: 'description',
              type: 'textarea',
              defaultValue: 'The result is scalable, predictable growth. We turn passive viewers into active communities, and organic reach into tangible ROI.',
            },
            { name: 'ctaLabel', type: 'text', defaultValue: 'Get Started' },
            { name: 'ctaHref', type: 'text', defaultValue: '/contact' },
          ],
        },
      ],
    },
    {
      name: 'trustSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'Join the leaders that worked with Slate Cinema' },
        { name: 'ratingText', type: 'text', defaultValue: '5.0/5 · 44 Google reviews' },
        { name: 'marqueeLabel', type: 'text', defaultValue: 'More collaborations & partnerships' },
        {
          name: 'flagshipLogos',
          type: 'array',
          admin: { description: 'The 3 large partner marks (Meta, Alo, B&H)' },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'logo', type: 'upload', relationTo: 'media', required: true },
          ],
        },
        {
          name: 'marqueeClients',
          type: 'array',
          admin: { description: 'The scrolling client-logo marquee below the flagship marks' },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'logo', type: 'upload', relationTo: 'media', required: true },
          ],
        },
      ],
    },
    {
      name: 'results',
      type: 'group',
      fields: [
        { name: 'viewsTarget', type: 'number', defaultValue: 120000 },
        { name: 'likesTarget', type: 'number', defaultValue: 14352 },
        { name: 'commentsTarget', type: 'number', defaultValue: 1670 },
        { name: 'reachPercent', type: 'text', defaultValue: '98.2%' },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue:
            'Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is meticulously shaped to make audiences stop scrolling.',
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'See Case Studies' },
        { name: 'ctaHref', type: 'text', defaultValue: '/portfolio' },
      ],
    },
    {
      name: 'reviews',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Client Feedback' },
        { name: 'headlineLine1', type: 'text', defaultValue: 'Trusted by leaders' },
        { name: 'headlineLine2', type: 'text', defaultValue: 'across industries' },
        { name: 'ratingText', type: 'text', defaultValue: '5.0/5 average · 44 Google reviews' },
        { name: 'videoTestimonialsLabel', type: 'text', defaultValue: 'Hear it from them, not us' },
        { name: 'googleReviewsLabel', type: 'text', defaultValue: 'From Google reviews' },
        {
          name: 'testimonials',
          type: 'array',
          minRows: 1,
          admin: { description: 'Curated Google reviews -- kept to exactly 3 per the client\'s own instruction' },
          fields: [
            { name: 'quote', type: 'textarea', required: true },
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text', required: true },
            { name: 'company', type: 'text', required: true },
            { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
          ],
        },
      ],
    },
  ],
}
