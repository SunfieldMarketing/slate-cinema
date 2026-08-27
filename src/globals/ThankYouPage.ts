import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

// lucide-react icons actually used by src/app/(frontend)/thank-you/page.tsx's
// nextSteps array, same "icon as a select string key" convention as every
// other icon field on the site (see ICON_OPTIONS in Industries.ts).
const ICON_OPTIONS = ['Mail', 'Clock3', 'PlayCircle'].map((v) => ({ label: v, value: v }))

/*
  Brings /thank-you into the CMS -- previously fully hardcoded. This is a
  noindexed conversion-confirmation page (see the page's own metadata),
  not something that needs SEO-grade content, but the client should still
  be able to edit the confirmation copy and next-steps cards without a
  code change.
*/
export const ThankYouPage: GlobalConfig = {
  slug: 'thank-you-page',
  admin: { group: 'Pages' },
  versions: { drafts: true },
  access: {
    read: ({ req }) => Boolean(req?.user) || { _status: { equals: 'published' } },
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Submission Received' },
        { name: 'titleLine1', type: 'text', required: true, defaultValue: 'Got it —' },
        { name: 'titleLine2', type: 'text', required: true, defaultValue: "we're on it." },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: 'Thanks for reaching out to Slate Cinema. Your message is already in front of the team.',
        },
      ],
    },
    { name: 'confirmedLabel', type: 'text', defaultValue: 'Confirmed' },
    {
      name: 'nextSteps',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'select', options: ICON_OPTIONS, required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    { name: 'primaryCtaLabel', type: 'text', defaultValue: 'View Our Work' },
    { name: 'primaryCtaHref', type: 'text', defaultValue: '/portfolio' },
    { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Back to Home' },
    { name: 'secondaryCtaHref', type: 'text', defaultValue: '/' },
  ],
}
