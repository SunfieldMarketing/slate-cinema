import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Industries } from './collections/Industries'
import { PortfolioProjects } from './collections/PortfolioProjects'
import { JournalPosts } from './collections/JournalPosts'
import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { Pipeline } from './globals/Pipeline'
import { FinalCTA } from './globals/FinalCTA'
import { ReadyToTalk } from './globals/ReadyToTalk'
import { HomePage } from './globals/HomePage'
import { HowItWorksPage } from './globals/HowItWorksPage'
import { PortfolioIndexPage } from './globals/PortfolioIndexPage'
import { ContactPage } from './globals/ContactPage'
import { ScheduleACallPage } from './globals/ScheduleACallPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/*
  Database adapter — swappable via DATABASE_URI alone, no code change.
  - file:./slate-cinema.db (or no DATABASE_URI set at all) -> local SQLite
  - libsql://...           -> remote Turso, same sqliteAdapter, same driver
  - postgres:// or
    postgresql://          -> postgresAdapter
  Per the migration playbook's Phase 1 requirement.
*/
const databaseURI = process.env.DATABASE_URI || 'file:./slate-cinema.db'
const isPostgres = databaseURI.startsWith('postgres://') || databaseURI.startsWith('postgresql://')

/*
  CORS/CSRF allow-list. This site is legitimately reachable on multiple
  origins at once (bare + www custom domain, the .vercel.app fallback
  domain, plus every git-branch preview alias) -- a single NEXT_PUBLIC_
  SERVER_URL value can only ever match ONE of those exactly. Discovered
  2026-08-17: admin saves were silently rejected ("You are not allowed to
  perform this action", a generic-looking 403 that's actually Payload's
  CSRF origin check) whenever the browser's actual origin -- in this case
  https://www.slatecinema.com, which the bare domain redirects to --
  wasn't the one exact string configured. Listing every known-valid
  origin explicitly fixes this regardless of which one visitors land on,
  instead of requiring the env var to be kept in permanent lockstep with
  however Vercel/DNS happens to canonicalize the domain that day.
*/
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SERVER_URL,
  'https://slatecinema.com',
  'https://www.slatecinema.com',
  'https://slate-cinema.vercel.app',
  'http://localhost:3000',
].filter((origin, i, arr): origin is string => Boolean(origin) && arr.indexOf(origin) === i)

const db = isPostgres
  ? postgresAdapter({
      pool: {
        connectionString: databaseURI,
      },
    })
  : sqliteAdapter({
      client: {
        url: databaseURI,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      },
    })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Slate Cinema Admin',
    },
    // Real branding — Phase 5 (this is genuinely new design work, no
    // "original admin" to preserve, unlike the public site).
    components: {
      graphics: {
        Logo: '/components/admin/AdminLogo#AdminLogo',
        Icon: '/components/admin/AdminIcon#AdminIcon',
      },
    },
  },
  collections: [Users, Media, Industries, PortfolioProjects, JournalPosts],
  globals: [
    Navigation,
    Footer,
    SiteSettings,
    Pipeline,
    FinalCTA,
    ReadyToTalk,
    HomePage,
    HowItWorksPage,
    PortfolioIndexPage,
    ContactPage,
    ScheduleACallPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  plugins: [
    formBuilderPlugin({
      // Copy (labels, placeholders, button text, success message) is
      // editable through /admin; submission destination/validation for
      // each of the site's 3 forms stays in the site's own API routes
      // (see src/app/api/forms/*), which write to these collections in
      // addition to whatever else they do — per Phase 3, this plugin
      // never replaces a form's existing submit path, only mirrors it.
      formOverrides: {
        access: {
          read: () => true,
          create: ({ req }) => Boolean(req.user),
          update: ({ req }) => Boolean(req.user),
          delete: ({ req }) => Boolean(req.user),
        },
      },
      formSubmissionOverrides: {
        access: {
          // Anonymous site visitors must be able to submit -- that's the
          // whole point. Reading/editing/deleting past submissions stays
          // admin-only.
          read: ({ req }) => Boolean(req.user),
          create: () => true,
          update: ({ req }) => Boolean(req.user),
          delete: ({ req }) => Boolean(req.user),
        },
      },
    }),
    // S3 media storage — replaces Vercel Blob, per Jake's 2026-08-20
    // handoff (AWS side fully built/verified: bucket, IAM user scoped to
    // just this bucket, public-read GetObject policy, CORS for both
    // sites' domains + *.vercel.app previews). Root cause this fixes:
    // /api/media/file/* was returning 204 for every request (confirmed
    // directly, not just taking the handoff doc's word for it) --
    // disablePayloadAccessControl makes doc URLs point straight at S3,
    // bypassing that broken proxy route entirely rather than debugging
    // it. 'slate' prefix -- this bucket is shared with wavecare.io under
    // a 'wavecare' prefix, kept separate site-by-site in the same bucket.
    //
    // Takes priority over Blob below when its 4 env vars are all set;
    // Blob stays as an automatic fallback otherwise -- rollback is just
    // removing the S3 env vars from Vercel and redeploying, no code
    // revert needed. Both plugins are never active at once: this uses
    // `else if`-style exclusivity via the ternary chain, not two plugins
    // stacked on the same collection.
    ...(process.env.S3_BUCKET && process.env.S3_REGION && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'slate',
                disablePayloadAccessControl: true,
              },
            },
            bucket: process.env.S3_BUCKET,
            config: {
              region: process.env.S3_REGION,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
              },
            },
          }),
        ]
      : process.env.BLOB_READ_WRITE_TOKEN
        ? [
            // Vercel Blob storage for media uploads — the previous
            // adapter, kept as a fallback per Jake's rollback plan
            // rather than deleted. Without either this or S3 configured,
            // uploads fall back to local disk, which is fine for local
            // dev but must never be what production runs on (redeploys
            // wipe the local filesystem).
            vercelBlobStorage({
              enabled: true,
              collections: { media: true },
              token: process.env.BLOB_READ_WRITE_TOKEN,
            }),
          ]
        : []),
  ],
})
