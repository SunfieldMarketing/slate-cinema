import type { GlobalConfig } from 'payload'

/*
  Site-wide SEO defaults + the contact details reused across the JSON-LD
  schema (src/app/layout.tsx), the Contact page's StudioLocation
  section, and the Footer.
*/
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
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
        { name: 'defaultTitle', type: 'text', defaultValue: 'Slate Cinema | Video Marketing at Your Fingertips' },
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
  ],
}
