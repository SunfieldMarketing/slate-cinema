import type { CollectionConfig, FieldHook, Validate } from 'payload'
import { contentBlocks } from '@/blocks'
import { revalidateCollectionAfterChange, revalidateCollectionAfterDelete } from '@/lib/revalidate'

/*
  Pages built from sections (2026-10-01). Anyone editing the site can create
  a page or subpage at any address, stack sections from the block library
  (src/blocks), and publish it -- no code or deploy needed. Rendered by the
  catch-all route src/app/(frontend)/[...slug]/page.tsx.

  The site's original pages (Home, How It Works, Contact...) keep their own
  documents under Pages in the admin sidebar; these addresses are reserved
  so a new page can't silently hide behind one of them.
*/
export const RESERVED_PATHS = [
  'admin',
  'api',
  'contact',
  'how-it-works',
  'journal',
  'portfolio',
  'privacy-policy',
  'schedule-a-call',
  'social-media-management',
  'terms-of-service',
  'thank-you',
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  'images',
  'videos',
  '_next',
  // Old addresses next.config.ts permanently redirects, and its analytics
  // proxy -- a page here would never be reachable.
  'ingest',
  'athletics',
  'education',
  'organizations',
  'realestate',
  'ai',
  'animation',
  'construction',
  'hospitality',
  'music',
  'podcasts',
]

export function normalizePath(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/[?#].*$/, '')
    .replace(/\s+/g, '-')
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+|\/+$/g, '')
}

const formatPath: FieldHook = ({ value }) => (typeof value === 'string' ? normalizePath(value) : value)

const validatePath: Validate<string> = (value) => {
  const path = normalizePath(value)
  if (!path) return 'Give the page an address, e.g. "services" or "services/branding".'
  if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(path)) {
    return 'Use lowercase letters, numbers and dashes, with "/" between levels (e.g. "services/branding").'
  }
  if (RESERVED_PATHS.includes(path.split('/')[0])) {
    return `"/${path.split('/')[0]}" is already one of the site's built-in pages -- pick another address.`
  }
  return true
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Custom pages' },
  versions: { drafts: true },
  admin: {
    group: 'Pages',
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', '_status', 'updatedAt'],
    description: 'New pages and subpages built from sections. Add one to the menu under Site Settings > Navigation.',
  },
  access: {
    // Same rule as every other content type: visitors only ever see
    // published versions; drafts are for logged-in editors and Live Preview.
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
    { name: 'title', type: 'text', required: true, admin: { description: 'Shown in the browser tab and search results.' } },
    {
      name: 'path',
      label: 'Address',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: validatePath,
      hooks: { beforeValidate: [formatPath] },
      admin: {
        position: 'sidebar',
        description: 'What comes after slatecinema.com/ -- e.g. "services", or "services/branding" for a subpage.',
      },
    },
    {
      name: 'accent',
      label: 'Page color',
      type: 'text',
      defaultValue: '#00AEEF',
      admin: { position: 'sidebar', description: 'Hex color used for this page\'s highlights.' },
    },
    {
      name: 'stickyButton',
      label: 'Floating "Get Started" button',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'layout',
      label: 'Sections',
      // Without these the add button reads "Add Layout" (from the field name).
      labels: { singular: 'Section', plural: 'Sections' },
      type: 'blocks',
      blocks: contentBlocks,
      admin: { description: 'Add, drag to reorder, duplicate or remove sections. Each section has its own settings to hide it.' },
    },
    {
      type: 'collapsible',
      label: 'Search engines & sharing',
      admin: { initCollapsed: true },
      fields: [
        { name: 'metaTitle', label: 'Search title', type: 'text', admin: { description: 'Defaults to the page title.' } },
        { name: 'metaDescription', label: 'Search description', type: 'textarea' },
        { name: 'metaImage', label: 'Share image', type: 'upload', relationTo: 'media' },
        { name: 'noIndex', label: 'Hide from search engines', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
