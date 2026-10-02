import type { Block } from 'payload'
import { buttonsField, headingField, ICON_OPTIONS, mediaFields, sectionSettings, vimeoHelp } from './shared'

/*
  The page-builder section library (2026-10-01, "the entire site and all its
  contents and pages and subpages fully editable"). Each block is one
  section editors can add, reorder, hide or remove on a page in /admin,
  and each one renders with the same components the hand-built pages use,
  so a page assembled from blocks looks like the rest of the site.

  Stored as JSON (sqliteAdapter `blocksAsJSON`, see payload.config.ts), so
  adding a block type or a field here needs no new database tables.

  Renderers: src/components/blocks/RenderBlocks.tsx. A block added here
  also needs a case there.
*/

const ORIENTATION_OPTIONS = [
  { label: 'Landscape 16:9', value: 'landscape' },
  { label: 'Vertical 9:16 (reel / story)', value: 'portrait' },
  { label: 'Vertical 4:5 (feed post)', value: 'feed' },
  { label: 'Square 1:1', value: 'square' },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
    {
      name: 'title',
      label: 'Title',
      type: 'textarea',
      required: true,
      admin: { description: 'One line per row.' },
    },
    { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
    ...mediaFields('Background image, also shown while the video loads.'),
    buttonsField(2),
    { name: 'trustNote', label: 'Small note under the buttons', type: 'text' },
    {
      name: 'stats',
      type: 'array',
      label: 'Animated numbers',
      maxRows: 4,
      admin: { initCollapsed: true, description: 'Shown along the bottom of the hero. Makes it full-screen.' },
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text', admin: { description: 'e.g. "+", "%", "k"' } },
        { name: 'label', type: 'text', required: true },
      ],
    },
    sectionSettings,
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text sections' },
  fields: [
    headingField,
    { name: 'content', label: 'Text', type: 'richText' },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Centered', value: 'center' },
      ],
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Narrow (easy reading)', value: 'narrow' },
        { label: 'Normal', value: 'normal' },
        { label: 'Wide', value: 'wide' },
      ],
    },
    sectionSettings,
  ],
}

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: { singular: 'Image / video + text', plural: 'Image / video + text' },
  fields: [
    headingField,
    { name: 'content', label: 'Text', type: 'richText' },
    buttonsField(2),
    ...mediaFields(),
    {
      name: 'mediaPosition',
      label: 'Media side',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'aspect',
      label: 'Media shape',
      type: 'select',
      defaultValue: 'landscape',
      options: ORIENTATION_OPTIONS,
    },
    sectionSettings,
  ],
}

export const MediaBlock: Block = {
  slug: 'media',
  labels: { singular: 'Image / video', plural: 'Images / videos' },
  fields: [
    ...mediaFields('The image, or the poster frame shown before a video plays.'),
    {
      name: 'playback',
      type: 'select',
      defaultValue: 'ambient',
      admin: { description: 'For videos only.' },
      options: [
        { label: 'Plays silently on loop', value: 'ambient' },
        { label: 'Click to play, with sound', value: 'player' },
      ],
    },
    { name: 'caption', type: 'text' },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'contained',
      options: [
        { label: 'Contained', value: 'contained' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full width (edge to edge)', value: 'full' },
      ],
    },
    {
      name: 'aspect',
      label: 'Shape',
      type: 'select',
      defaultValue: 'landscape',
      options: [...ORIENTATION_OPTIONS, { label: 'Cinematic 21:9', value: 'cinema' }],
    },
    sectionSettings,
  ],
}

export const StatementBlock: Block = {
  slug: 'statement',
  labels: { singular: 'Statement (full-width video moment)', plural: 'Statements' },
  fields: [
    { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
    {
      name: 'headline',
      label: 'Headline',
      type: 'textarea',
      required: true,
      admin: { description: 'One line per row; the last row is set in italics.' },
    },
    { name: 'body', label: 'Body', type: 'textarea' },
    {
      name: 'video',
      label: 'Background video',
      type: 'text',
      admin: { description: `${vimeoHelp} (a video file URL also works).` },
    },
    sectionSettings,
  ],
}

export const CtaBandBlock: Block = {
  slug: 'ctaBand',
  labels: { singular: 'Call-to-action band', plural: 'Call-to-action bands' },
  fields: [
    { name: 'headline', label: 'Headline', type: 'text', defaultValue: 'Have a project like this in mind?' },
    {
      name: 'subhead',
      label: 'Subhead',
      type: 'text',
      defaultValue: '20 minutes, no pitch deck — just an honest read on scope, timeline and budget.',
    },
    { name: 'buttonLabel', label: 'Button label', type: 'text', defaultValue: 'Get Started' },
    { name: 'buttonHref', label: 'Button link', type: 'text', defaultValue: '/contact' },
    sectionSettings,
  ],
}

export const CardsBlock: Block = {
  slug: 'cards',
  labels: { singular: 'Cards grid', plural: 'Cards grids' },
  fields: [
    headingField,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 per row', value: '2' },
        { label: '3 per row', value: '3' },
        { label: '4 per row', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'icon', type: 'select', options: ICON_OPTIONS, admin: { description: 'Optional.' } },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional photo across the top of the card.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'linkLabel', label: 'Link label', type: 'text' },
        { name: 'linkHref', label: 'Link', type: 'text' },
      ],
    },
    sectionSettings,
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Numbers strip', plural: 'Numbers strips' },
  fields: [
    headingField,
    {
      name: 'stats',
      type: 'array',
      label: 'Numbers',
      maxRows: 6,
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text', admin: { description: 'e.g. "+", "%", "wk"' } },
        { name: 'label', type: 'text', required: true },
      ],
    },
    sectionSettings,
  ],
}

export const ClientCardsBlock: Block = {
  slug: 'clientCards',
  labels: { singular: 'Client video cards', plural: 'Client video cards' },
  fields: [
    headingField,
    {
      name: 'clients',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'A card without a Vimeo video is hidden; the section hides when none has one.',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'year', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'vimeoId', label: 'Vimeo video', type: 'text', admin: { description: vimeoHelp } },
        { name: 'orientation', type: 'select', defaultValue: 'landscape', options: ORIENTATION_OPTIONS },
      ],
    },
    sectionSettings,
  ],
}

export const ServiceCardsBlock: Block = {
  slug: 'serviceCards',
  labels: { singular: 'Service cards', plural: 'Service cards' },
  fields: [
    headingField,
    {
      name: 'cards',
      type: 'array',
      admin: { initCollapsed: true, description: 'The one marked "featured" runs large.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'outcome', type: 'text', admin: { description: 'Short result up top, e.g. "Boards in days, not weeks"' } },
        { name: 'deliverables', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
        { name: 'meta', type: 'text', admin: { description: 'e.g. "60–120s · 4–6 wks"' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'video', label: 'Video file', type: 'upload', relationTo: 'media' },
        { name: 'videoVimeoUrl', label: 'Vimeo video', type: 'text', admin: { description: vimeoHelp } },
        { name: 'featured', type: 'checkbox', defaultValue: false },
      ],
    },
    sectionSettings,
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline / steps', plural: 'Timelines' },
  fields: [
    headingField,
    {
      name: 'steps',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'week', label: 'When', type: 'text', required: true, admin: { description: 'e.g. "Wk 1" or "Mon"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    sectionSettings,
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    headingField,
    {
      name: 'items',
      label: 'Questions',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'aside',
      label: 'Side card',
      type: 'group',
      admin: { description: 'The "Still deciding?" card beside the questions. Leave the title blank to hide it.' },
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Still deciding?' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'Bring your questions to a 20-minute call. No pitch, no pressure — just a straight answer on whether this is a fit.',
        },
        { name: 'buttonLabel', label: 'Button label', type: 'text', defaultValue: 'Book a call' },
        { name: 'buttonHref', label: 'Button link', type: 'text', defaultValue: '/contact' },
        { name: 'note', label: 'Small note', type: 'text', defaultValue: 'Replies within minutes' },
      ],
    },
    sectionSettings,
  ],
}

export const LogosBlock: Block = {
  slug: 'logos',
  labels: { singular: 'Logo strip', plural: 'Logo strips' },
  fields: [
    { name: 'ratingText', label: 'Rating text', type: 'text', admin: { description: 'e.g. "5.0/5 · 44 Google reviews". Leave blank to hide the stars.' } },
    { name: 'label', label: 'Label', type: 'text', defaultValue: 'More collaborations & partnerships' },
    {
      name: 'logos',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    sectionSettings,
  ],
}

export const PortfolioGridBlock: Block = {
  slug: 'portfolioGrid',
  labels: { singular: 'Portfolio projects', plural: 'Portfolio projects' },
  fields: [
    headingField,
    {
      name: 'source',
      label: 'Which projects',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All projects (in their set order)', value: 'all' },
        { label: 'One category', value: 'category' },
        { label: 'Pick them by hand', value: 'manual' },
      ],
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        description: 'Exactly as written on the projects, e.g. "Brand Film".',
        condition: (_, sibling) => sibling?.source === 'category',
      },
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'portfolio-projects',
      hasMany: true,
      admin: { condition: (_, sibling) => sibling?.source === 'manual' },
    },
    { name: 'limit', label: 'Show at most', type: 'number', defaultValue: 8 },
    sectionSettings,
  ],
}

export const JournalPostsBlock: Block = {
  slug: 'journalPosts',
  labels: { singular: 'Journal posts', plural: 'Journal posts' },
  fields: [
    headingField,
    { name: 'category', type: 'text', admin: { description: 'Optional: only posts in this category.' } },
    { name: 'limit', label: 'Show at most', type: 'number', defaultValue: 3 },
    sectionSettings,
  ],
}

export const PipelineBlock: Block = {
  slug: 'pipeline',
  labels: { singular: 'Production pipeline', plural: 'Production pipelines' },
  fields: [
    {
      name: 'eyebrow',
      label: 'Eyebrow',
      type: 'text',
      admin: {
        description:
          'The phases themselves come from Shared Sections > Pipeline. Leave these heading fields blank to use the ones set there.',
      },
    },
    { name: 'title', label: 'Headline', type: 'text' },
    { name: 'description', label: 'Intro text', type: 'textarea' },
    sectionSettings,
  ],
}

export const FinalCtaBlock: Block = {
  slug: 'finalCta',
  labels: { singular: 'Closing call to action', plural: 'Closing calls to action' },
  // No fields of its own: its words live in Shared Sections > Final CTA, so
  // one edit there updates every page that uses it.
  fields: [sectionSettings],
}

export const BookingBlock: Block = {
  slug: 'booking',
  labels: { singular: 'Booking calendar', plural: 'Booking calendars' },
  fields: [
    { name: 'eyebrow', label: 'Eyebrow', type: 'text', defaultValue: '// Production Meeting' },
    { name: 'headline', label: 'Headline', type: 'text', defaultValue: 'Lock In A Time' },
    { name: 'sessionLabel', label: 'Session name', type: 'text', defaultValue: 'Strategy Session' },
    { name: 'durationLabel', label: 'Session length', type: 'text', defaultValue: '45 Min Video Call' },
    sectionSettings,
  ],
}

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: { singular: 'Embed (form, map, calendar...)', plural: 'Embeds' },
  fields: [
    headingField,
    {
      name: 'url',
      label: 'Embed address',
      type: 'text',
      admin: { description: 'The "embed" or "iframe" link the other service gives you (Google Maps, YouTube, a form, a calendar...).' },
    },
    {
      name: 'html',
      label: 'Embed code (advanced)',
      type: 'textarea',
      admin: { description: 'Only if the service gives you code instead of a link. Runs in its own sandboxed frame.' },
    },
    { name: 'height', label: 'Height (pixels)', type: 'number', defaultValue: 600 },
    sectionSettings,
  ],
}

export const SpacerBlock: Block = {
  slug: 'spacer',
  labels: { singular: 'Spacer / divider', plural: 'Spacers' },
  fields: [
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    { name: 'divider', label: 'Show a line', type: 'checkbox', defaultValue: false },
    sectionSettings,
  ],
}

/** Every section type an editor can add to a page. */
export const contentBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  MediaTextBlock,
  MediaBlock,
  StatementBlock,
  CtaBandBlock,
  CardsBlock,
  StatsBlock,
  ClientCardsBlock,
  ServiceCardsBlock,
  TimelineBlock,
  FaqBlock,
  LogosBlock,
  PortfolioGridBlock,
  JournalPostsBlock,
  PipelineBlock,
  FinalCtaBlock,
  BookingBlock,
  EmbedBlock,
  SpacerBlock,
]
