import type { CollectionConfig } from 'payload'

const MIN_PASSWORD_LENGTH = 8

/*
  Admin users — username-based login (not email), per the migration
  playbook. The first user is created by the seed script (see
  src/seed/index.ts) from ADMIN_USERNAME / ADMIN_INITIAL_PASSWORD env
  vars, not through Payload's public "create first user" screen, so
  that screen never has to be exposed.

  The minimum lives in this collection's own beforeChange hook, not only
  in the seed script -- a lesson from the WaveCare migration, where the
  same check living solely in the seed script meant a later password
  update via a direct API call silently skipped it. Lowered from 16 to 8
  at the client's explicit request (2026-08-11) to allow a specific
  shorter admin password; still a real floor, not removed entirely.
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
    // Lets an admin user generate a long-lived API key from their own user
    // document in /admin (Edit screen -> "Enable API Key" toggle), for
    // programmatic REST/GraphQL access via `Authorization: users API-Key
    // <key>` -- an alternative to a session-cookie login for
    // machine/integration use. Added 2026-08-19 alongside the
    // src/migrations/ baseline so the new apiKey/enableAPIKey/apiKeyIndex
    // columns this adds to `users` actually exist in production (SQLite
    // doesn't auto-migrate -- see the migrations README).
    useAPIKey: true,
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
