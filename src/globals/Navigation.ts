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
  admin: { group: 'Site Settings' },
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
    {
      name: 'links',
      type: 'array',
      admin: { description: 'Rendered after Home and the Portfolio dropdown, in order' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          required: true,
          admin: { description: 'A page on this site ("/services") or a full address ("https://...").' },
        },
        {
          // 2026-10-01: lets a menu item open a dropdown of subpages, the
          // same way Portfolio lists its industries.
          name: 'children',
          label: 'Dropdown items',
          type: 'array',
          admin: { initCollapsed: true, description: 'Optional. Turns this item into a dropdown.' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', label: 'Link', type: 'text', required: true },
          ],
        },
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
    { name: 'clientPortalLabel', type: 'text', defaultValue: 'Client Portal' },
    { name: 'homeLabel', type: 'text', defaultValue: 'Home', admin: { description: 'First link in the menu (always goes to the homepage).' } },
    {
      name: 'portfolioLabel',
      type: 'text',
      defaultValue: 'Portfolio',
      admin: { description: 'The Portfolio menu. Its list of industries comes from the Industries collection.' },
    },
    {
      name: 'allWorkLabel',
      type: 'text',
      defaultValue: 'All Work',
      admin: { description: 'First entry inside the Portfolio menu (goes to /portfolio).' },
    },
  ],
}
