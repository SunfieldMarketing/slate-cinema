import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

const ICONS = ['Clock3', 'Users', 'ShieldCheck', 'Target', 'Wallet', 'Sparkles', 'CalendarClock'].map((v) => ({
  label: v,
  value: v,
}))

/*
  "Book a time on our calendar" -- rendered on both the Contact page
  (as a teaser routing to /schedule-a-call) and on /schedule-a-call
  itself (as that page's own framing, added per Jake's "put this on the
  schedule a call page" feedback). Same content both places by design;
  one shared global instead of two copies that could drift apart.
*/
export const ReadyToTalk: GlobalConfig = {
  slug: 'ready-to-talk',
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '// Ready to Talk' },
    { name: 'headline', type: 'text', required: true, defaultValue: 'Book a time on our calendar' },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'Prefer to talk it through live? Grab a 20-minute slot with our team — no pitch deck, no sales script, just an honest read on scope, timeline, and budget so you know exactly where you stand.',
    },
    {
      name: 'badges',
      type: 'array',
      fields: [
        { name: 'icon', type: 'select', options: ICONS, required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'prepItems',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'select', options: ICONS, required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'desc', type: 'text', required: true },
      ],
    },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Schedule a Call' },
    { name: 'buttonHref', type: 'text', defaultValue: '/schedule-a-call' },
    { name: 'note', type: 'text', defaultValue: 'No commitment — reschedule or cancel anytime.' },
  ],
}
