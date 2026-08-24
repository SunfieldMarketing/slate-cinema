import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
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
