import type { CollectionConfig } from 'payload'

const MIN_PASSWORD_LENGTH = 16

/*
  Admin users — username-based login (not email), per the migration
  playbook. The first user is created by the seed script (see
  src/seed/index.ts) from ADMIN_USERNAME / ADMIN_INITIAL_PASSWORD env
  vars, not through Payload's public "create first user" screen, so
  that screen never has to be exposed.

  The 16-char minimum lives in this collection's own beforeChange hook,
  not only in the seed script -- a lesson from the WaveCare migration,
  where the same check living solely in the seed script meant a later
  password update via a direct API call silently skipped it.
*/
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireUsername: true,
      requireEmail: false,
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (typeof data?.password === 'string' && data.password.length < MIN_PASSWORD_LENGTH) {
          throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only existing admins can change roles — an editor can't
        // promote themselves.
        update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
      },
    },
  ],
}
