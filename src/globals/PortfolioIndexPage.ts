import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

export const PortfolioIndexPage: GlobalConfig = {
  slug: 'portfolio-index-page',
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
    read: ({ req }) => Boolean(req.user) || { _status: { equals: 'published' } },
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
        { name: 'video', type: 'upload', relationTo: 'media' },
        {
          name: 'videoVimeoUrl',
          type: 'text',
          admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
        },
        { name: 'title', type: 'text', defaultValue: 'Our Work' },
        { name: 'date', type: 'text', defaultValue: 'Selected Campaigns' },
        { name: 'scrollToExpandLabel', type: 'text', defaultValue: 'Scroll To Explore' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            "Discover a world of captivating storytelling. From immersive brand journeys to campaigns that dominate the feed — this is Slate Cinema's showcase.",
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Get Started' },
        { name: 'ctaHref', type: 'text', defaultValue: '/contact' },
      ],
    },
    {
      name: 'reelCarousel',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'The Reel' },
        { name: 'headline', type: 'text', defaultValue: 'Spin through the work' },
        { name: 'subhead', type: 'text', defaultValue: 'Drag to spin the reel · click a frame to open it' },
      ],
    },
    {
      name: 'industriesSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Who We Work With' },
        { name: 'headline', type: 'text', defaultValue: 'Cinematic work for every industry' },
      ],
    },
    {
      // Field kept (not deleted) to avoid a DB schema migration on the
      // fragile Windows/tsx `payload generate:types` pipeline -- see
      // CMS_MIGRATION_PHASE0_INVENTORY.md. The client asked (Aug 2026 call)
      // to remove category filter chips from the portfolio grid entirely;
      // Portfolio.tsx no longer reads this field. Hidden from admin so it
      // can't be edited to no effect.
      name: 'portfolioFilters',
      type: 'array',
      admin: { hidden: true, description: 'Unused -- filter chips were removed from the portfolio grid per client request.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}
