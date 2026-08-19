import type { GlobalConfig } from 'payload'

/*
  Matches src/lib/pipeline-data.ts's `categories` shape exactly. Shared
  between the Pipeline component on Home and How It Works (same
  four-phase breakdown rendered both places) -- one editable source
  instead of two copies drifting apart.
*/
export const Pipeline: GlobalConfig = {
  slug: 'pipeline',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
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
        // No longer hard-required 2026-08-19 -- videoVimeoUrl now
        // satisfies this slot too (see SmartVideo).
        { name: 'video', type: 'upload', relationTo: 'media' },
        {
          name: 'videoVimeoUrl',
          type: 'text',
          admin: { description: 'Paste a Vimeo URL or ID to use an embedded Vimeo video instead of an uploaded file (takes priority when set).' },
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
