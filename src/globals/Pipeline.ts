import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

/*
  Matches src/lib/pipeline-data.ts's `categories` shape exactly. Shared
  between the Pipeline component on Home and How It Works (same
  four-phase breakdown rendered both places) -- one editable source
  instead of two copies drifting apart.
*/
export const Pipeline: GlobalConfig = {
  slug: 'pipeline',
  admin: { group: 'Shared Sections' },
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
      name: 'heading',
      type: 'group',
      admin: { description: 'Section header shown above the pipeline on both Home and How It Works' },
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'How It Works' },
        { name: 'title', type: 'text', defaultValue: 'The Production Pipeline' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: "Four phases, each broken down into the exact services behind it. Open a phase to see what's included.",
        },
      ],
    },
    {
      name: 'categories',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'categoryId', type: 'text', required: true, admin: { description: 'e.g. "pre-production" -- used as the React key, keep stable' } },
        { name: 'title', type: 'text', required: true },
        { name: 'video', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'videoVimeoUrl',
          type: 'text',
          admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
        },
        { name: 'color', type: 'text', required: true, admin: { description: 'Hex color' } },
        {
          name: 'services',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'desc', type: 'textarea', admin: { description: 'Shown on How It Works detail panel' } },
            {
              name: 'tags',
              type: 'array',
              admin: { description: 'Shown on Pre-Production beat overlay tags instead of a description' },
              fields: [{ name: 'tag', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
