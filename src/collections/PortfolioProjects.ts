import type { CollectionConfig } from 'payload'
import { revalidateCollectionAfterChange, revalidateCollectionAfterDelete } from '@/lib/revalidate'

/*
  Matches src/lib/portfolio-projects.ts's PortfolioProject shape —
  shared between the homepage 3D reel and the /portfolio grid. Data is
  currently placeholder/demo content (see Phase 0 inventory), migrated
  as-is per the fidelity rule; swap in real projects through /admin
  whenever they're ready.
*/
export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'category'],
  },
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
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateCollectionAfterChange],
    afterDelete: [revalidateCollectionAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'poster', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Poster image (stands in wherever video can\'t render)' } },
    { name: 'copy', type: 'textarea', required: true },
    { name: 'video', type: 'upload', relationTo: 'media', admin: { description: 'Featured cut shown in the project card modal' } },
    {
      name: 'videoVimeoUrl',
      type: 'text',
      admin: { description: 'Paste a Vimeo URL or ID -- takes priority over the uploaded file when set' },
    },
    {
      name: 'metrics',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'order', type: 'number', admin: { description: 'Lower numbers show first' } },
  ],
  defaultSort: 'order',
}
