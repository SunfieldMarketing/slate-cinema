import type { GlobalConfig } from 'payload'

/*
  Nav.tsx's navLinks array + CTA button. The Portfolio dropdown itself
  is NOT stored here — it's generated live from the Industries
  collection, so it never drifts out of sync with the actual industry
  pages.
*/
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      admin: { description: 'Rendered after Home and the Portfolio dropdown, in order' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, defaultValue: 'Schedule Call' },
        { name: 'href', type: 'text', required: true, defaultValue: '/schedule-a-call' },
      ],
    },
    {
      name: 'clientPortalHref',
      type: 'text',
      admin: { description: 'Where the "Client Portal" nav link sends visitors.' },
      defaultValue: 'https://my.slatecinema.com/',
    },
  ],
}
