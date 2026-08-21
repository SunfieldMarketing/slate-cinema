import type { GlobalConfig } from 'payload'

const GUARANTEE_ICONS = ['Clock', 'ShieldCheck', 'RefreshCw', 'Handshake'].map((v) => ({ label: v, value: v }))

/*
  Every hardcoded string/media reference on /how-it-works not already
  covered by the shared Pipeline / FinalCTA globals. StoryboardHero's 3D
  choreography stays as code (see Phase 0 inventory) -- only its text
  overlay is here.
*/
export const HowItWorksPage: GlobalConfig = {
  slug: 'how-it-works-page',
  versions: { drafts: true },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      admin: { description: 'StoryboardHero text overlay -- the 3D scene/choreography itself stays code' },
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'The Process' },
        { name: 'title', type: 'text', defaultValue: 'How It Works' },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically.',
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Get Started' },
        { name: 'ctaHref', type: 'text', defaultValue: '/contact' },
      ],
    },
    {
      name: 'processOverview',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'At A Glance' },
        { name: 'headline', type: 'text', defaultValue: 'Four phases, start to finish' },
        {
          name: 'timelineSteps',
          type: 'array',
          minRows: 1,
          admin: { description: 'The connector-line summary strip -- should mirror Pipeline\'s 4 categories' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'color', type: 'text', required: true },
            { name: 'line', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'behindTheScenes',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Behind The Scenes' },
        { name: 'headline', type: 'text', defaultValue: 'Where the work happens' },
        { name: 'subhead', type: 'text', defaultValue: 'Every phase has a room, a rig, and a person who obsesses over it.' },
        {
          name: 'stills',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'desc', type: 'text', required: true },
            {
              name: 'span',
              type: 'select',
              options: [{ label: 'Normal', value: 'normal' }, { label: 'Wide', value: 'wide' }, { label: 'Tall', value: 'tall' }],
              defaultValue: 'normal',
            },
          ],
        },
      ],
    },
    {
      name: 'processWalkthrough',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Every Project Includes' },
        { name: 'headline', type: 'text', defaultValue: 'Watch it move through every phase' },
        {
          name: 'subhead',
          type: 'text',
          defaultValue: "A complete production — not just raw footage. Scroll through to see what's actually happening at each stage.",
        },
        {
          name: 'phases',
          type: 'array',
          minRows: 1,
          admin: { description: 'Should mirror Pipeline\'s 4 categories' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'color', type: 'text', required: true },
            { name: 'video', type: 'upload', relationTo: 'media', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'statsBand',
      type: 'array',
      minRows: 1,
      admin: { description: 'The 4 animated counters (1hr / 3wk / 90% / 50+)' },
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'guarantees',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'select', required: true, options: GUARANTEE_ICONS },
        { name: 'title', type: 'text', required: true },
        { name: 'desc', type: 'text', required: true },
      ],
    },
  ],
}
