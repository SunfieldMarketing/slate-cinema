import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'
import { sectionsField } from '@/blocks/builtin'
import { seoFields } from '@/fields/seo'
import { PAGE_META } from '@/lib/page-meta'

const GUARANTEE_ICONS = ['Clock', 'ShieldCheck', 'RefreshCw', 'Handshake'].map((v) => ({ label: v, value: v }))

/*
  Every hardcoded string/media reference on /how-it-works not already
  covered by the shared Pipeline / FinalCTA globals. StoryboardHero's 3D
  choreography stays as code (see Phase 0 inventory) -- only its text
  overlay is here.
*/
export const HowItWorksPage: GlobalConfig = {
  slug: 'how-it-works-page',
  admin: { group: 'Pages' },
  versions: { drafts: true },
  access: {
    // Public reads only ever see published content -- unpublished
    // drafts must stay invisible to real visitors until explicitly
    // published. Found 2026-08-24: this used to be a bare `() => true`
    // (no status check at all), which combined with the Local API's
    // default overrideAccess:true meant a saved-but-unpublished draft
    // was visible on the live public site immediately -- see this
    // session's e2eTest finding (journalPostLifecycle.hiddenWhileDraft
    // came back false). payload-data.ts now threads overrideAccess:
    // draft through every call so this constraint actually applies to
    // ordinary (draft:false) visitors, while Live Preview (draft:true)
    // passes overrideAccess:true and bypasses it entirely, same as an
    // authenticated admin editing in /admin.
    read: ({ req }) => Boolean(req?.user) || { _status: { equals: 'published' } },
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    // Order/visibility of this page's sections + library sections in between.
    sectionsField('howItWorks'),
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
        {
          // Typed into the storyboard scenes until 2026-10-02.
          name: 'storyboard',
          type: 'group',
          label: 'Storyboard text',
          admin: { description: 'The captions over the four scroll scenes, and the closing call to action at the end of the hero.' },
          fields: [
            { name: 'preProductionCaption', label: 'Scene 1 caption', type: 'text', defaultValue: 'Every project starts on the board.' },
            { name: 'productionCaption', label: 'Scene 2 caption', type: 'text', defaultValue: 'On set, it all comes together.' },
            { name: 'postProductionCaption', label: 'Scene 3 caption', type: 'text', defaultValue: 'Then it all takes shape in the edit.' },
            { name: 'editHint', label: 'Scene 3 hint', type: 'text', defaultValue: 'Scroll scrubs the edit · drag the playhead' },
            { name: 'distributionCaption', label: 'Scene 4 caption', type: 'text', defaultValue: 'Then it goes everywhere at once.' },
            { name: 'closingHeadline', label: 'Closing headline', type: 'text', defaultValue: "Let's make something great." },
            {
              name: 'closingText',
              label: 'Closing text',
              type: 'textarea',
              defaultValue: "Every project starts with a conversation — reach out and we'll walk you through exactly how it works.",
            },
          ],
        },
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
            {
              name: 'videoVimeoUrl',
              type: 'text',
              admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
            },
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
    seoFields({ title: PAGE_META.howItWorks.title, description: PAGE_META.howItWorks.description }),
  ],
}
