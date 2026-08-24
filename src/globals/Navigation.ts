import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

/*
  Nav.tsx's navLinks array + CTA button. The Portfolio dropdown itself
  is NOT stored here — it's generated live from the Industries
  collection, so it never drifts out of sync with the actual industry
  pages.
*/
export const Navigation: GlobalConfig = {
  slug: 'navigation',
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
