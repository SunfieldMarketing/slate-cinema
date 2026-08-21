import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  versions: { drafts: true },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'marqueeItems',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true, defaultValue: 'Ready to create?' },
        { name: 'buttonLabel', type: 'text', required: true, defaultValue: 'Get Started' },
        { name: 'buttonHref', type: 'text', required: true, defaultValue: '/contact' },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true, defaultValue: 'Subscribe to our Newsletter' },
        {
          name: 'sentence',
          type: 'textarea',
          required: true,
          defaultValue:
            "Want to stay up to date on the latest AI trends, social media frenzies and the latest in media marketing tech? We share valuable tips straight into your inbox!",
        },
        { name: 'placeholder', type: 'text', defaultValue: 'Your email address' },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Sign Up' },
      ],
    },
    {
      name: 'sitemapColumn',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Studio' },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'bottomBar',
      type: 'group',
      fields: [
        { name: 'craftedWithLoveText', type: 'text', defaultValue: 'Crafted with love by Slate Cinema' },
        { name: 'privacyHref', type: 'text', defaultValue: '/privacy-policy' },
        { name: 'termsHref', type: 'text', defaultValue: '/terms-of-service' },
        { name: 'clientPortalHref', type: 'text', defaultValue: 'https://my.slatecinema.com/' },
      ],
    },
  ],
}
