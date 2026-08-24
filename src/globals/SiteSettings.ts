import type { GlobalConfig } from 'payload'

/*
  Site-wide SEO defaults + the contact details reused across the JSON-LD
  schema (src/app/layout.tsx), the Contact page's StudioLocation
  section, and the Footer.
*/
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  versions: { drafts: true },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'titleTemplate', type: 'text', defaultValue: '%s | Slate Cinema' },
        {
          name: 'defaultTitle',
          type: 'text',
          defaultValue: 'Slate Cinema',
          admin: {
            description:
              'TikTok Content Posting API requirement: the homepage tab title must be literally "Slate Cinema" -- no tagline, no template suffix.',
          },
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          defaultValue:
            'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.',
        },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', required: true, defaultValue: 'info@slatecinema.com' },
        { name: 'phone', type: 'text', required: true, defaultValue: '+1 732 930 1934' },
        { name: 'studioName', type: 'text', defaultValue: 'Slate Cinema Studio' },
        { name: 'addressLine', type: 'text', defaultValue: '132 32nd St' },
        { name: 'city', type: 'text', defaultValue: 'Brooklyn' },
        { name: 'state', type: 'text', defaultValue: 'NY' },
        { name: 'postalCode', type: 'text', defaultValue: '11232' },
        { name: 'hours', type: 'text', defaultValue: 'Mon–Fri · 9am – 7pm ET · On-location by appointment' },
      ],
    },
    {
      name: 'trustBanner',
      type: 'group',
      admin: {
        description:
          'The credibility strip under the hero on every industry page (src/components/TrustBanner.tsx) -- was fully hardcoded (rating text, tagline, and all 5 client logos on local /public files) until this field was added. Same idea as Home\'s trustSection, just a single-row layout with no flagship logos.',
      },
      fields: [
        { name: 'ratingText', type: 'text', defaultValue: '5.0/5 · 44 Google reviews' },
        { name: 'marqueeLabel', type: 'text', defaultValue: 'More collaborations & partnerships' },
        {
          name: 'clients',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'logo', type: 'upload', relationTo: 'media', required: true },
          ],
        },
      ],
    },
  ],
}
