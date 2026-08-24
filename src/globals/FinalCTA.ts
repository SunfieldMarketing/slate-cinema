import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

/*
  The closing CTA card ("Your next era starts here") rendered identically
  on Home, How It Works, and Portfolio -- one shared editable source.
*/
export const FinalCTA: GlobalConfig = {
  slug: 'final-cta',
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
    { name: 'eyebrow', type: 'text', defaultValue: '// Ready To Scale?' },
    { name: 'headlineLine1', type: 'text', required: true, defaultValue: 'Your next era' },
    { name: 'headlineLine2', type: 'text', required: true, defaultValue: 'starts here' },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        "Don't let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.",
    },
    { name: 'buttonLabel', type: 'text', required: true, defaultValue: 'Get Started' },
    { name: 'buttonHref', type: 'text', required: true, defaultValue: '/contact' },
    { name: 'trustNote', type: 'text', defaultValue: 'Replies within minutes' },
  ],
}
