import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateCollectionAfterChange, revalidateCollectionAfterDelete } from '@/lib/revalidate'

/*
  Matches src/lib/journal.ts's JournalPost shape. `content` was a typed
  block array (p/h2/quote/list) in the static file — migrated to a real
  Lexical rich-text field here instead of replicating that union, since
  that's a much better editing surface for blog prose than a typed
  block picker, and Lexical already supports headings/quotes/lists
  natively. The seed script converts the old block array into
  equivalent Lexical nodes.
*/
export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateCollectionAfterChange],
    afterDelete: [revalidateCollectionAfterDelete],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'category', type: 'text', required: true },
    { name: 'accent', type: 'text', required: true, admin: { description: 'Hex color, e.g. #00AEEF' } },
    { name: 'date', type: 'text', required: true, admin: { description: 'Display string, e.g. "July 2026"' } },
    { name: 'readTime', type: 'text', required: true, admin: { description: 'e.g. "6 min read"' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'author', type: 'text', required: true },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
    },
  ],
}
