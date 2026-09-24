import type { CollectionConfig } from 'payload'

/*
  Site-wide CMS changelog: one entry per save anywhere in the CMS -- who,
  when, what, and exactly which fields changed from what to what. Written
  only by the hooks in src/lib/changelog.ts (attached to every content
  collection and global in payload.config.ts); nobody can create, edit or
  delete entries through the admin or the API, so it stays a trustworthy
  record. Complements Payload's per-document "Versions" tab (which can
  compare and restore a single page/doc) with one place to see every
  change across the whole site.
*/
export const Changelog: CollectionConfig = {
  slug: 'changelog',
  labels: { singular: 'Change', plural: 'Changelog' },
  admin: {
    group: 'System',
    useAsTitle: 'summary',
    defaultColumns: ['createdAt', 'summary', 'userName', 'action'],
    description:
      'Every change made through the CMS, newest first -- who made it, when, and which fields changed. Entries are recorded automatically and cannot be edited. To roll a page back, open it and use its Versions tab.',
    pagination: { defaultLimit: 50 },
  },
  defaultSort: '-createdAt',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'summary', type: 'text', admin: { readOnly: true } },
    {
      name: 'action',
      type: 'select',
      admin: { readOnly: true },
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Updated', value: 'updated' },
        { label: 'Published', value: 'published' },
        { label: 'Draft saved', value: 'draft' },
        { label: 'Deleted', value: 'deleted' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'targetLabel', label: 'What', type: 'text', admin: { readOnly: true } },
        {
          name: 'targetType',
          label: 'Kind',
          type: 'select',
          admin: { readOnly: true },
          options: [
            { label: 'Page / site setting', value: 'global' },
            { label: 'Collection item', value: 'collection' },
          ],
        },
        { name: 'targetSlug', label: 'Slug', type: 'text', admin: { readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'docId', label: 'Item ID', type: 'text', admin: { readOnly: true } },
        { name: 'docTitle', label: 'Item', type: 'text', admin: { readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'userName', label: 'Changed by', type: 'text', admin: { readOnly: true } },
        { name: 'user', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
      ],
    },
    {
      name: 'changedFields',
      label: 'Fields changed',
      type: 'json',
      admin: { readOnly: true },
    },
    {
      name: 'changes',
      label: 'Before / after',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Each changed field with its value before and after this save (long values are shortened).',
      },
    },
  ],
}
