import type { CollectionConfig } from 'payload'

/*
  Media uploads. Storage destination is swapped by whether
  BLOB_READ_WRITE_TOKEN is set (see payload.config.ts plugins) — local
  filesystem in dev, Vercel Blob in any environment with the token, per
  Phase 4 of the migration playbook (never local filesystem in
  production; uploads don't survive a redeploy there).
*/
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 900, height: undefined, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
  },
}
