import type { CollectionConfig } from 'payload'

/*
  Matches src/lib/portfolio-projects.ts's PortfolioProject shape —
  shared between the homepage 3D reel and the /portfolio grid. Data is
  currently placeholder/demo content (see Phase 0 inventory), migrated
  as-is per the fidelity rule; swap in real projects through /admin
  whenever they're ready.
*/
export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'category'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
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
      admin: { description: 'Paste a Vimeo URL or ID to use an embedded Vimeo video instead of an uploaded file (takes priority when set).' },
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
