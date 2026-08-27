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
import { PrivacyPolicyPage } from './globals/PrivacyPolicyPage'
import { TermsOfServicePage } from './globals/TermsOfServicePage'
import { ThankYouPage } from './globals/ThankYouPage'
import { SocialMediaManagementPage } from './globals/SocialMediaManagementPage'

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

// Frontend URL for each collection/global doc, for Live Preview's iframe.
// Route inventory confirmed directly from src/app/(frontend) rather than
// assumed: /portfolio/[industry] and /journal/[slug] are the only two
// collections with a real per-doc page; PortfolioProjects has no
// standalone route (rendered inside the /portfolio grid/modal only), so
// its preview just points at that index page.
//
// Every URL below routes through /api/preview first, which enables
// Next.js Draft Mode (a cookie, not a query param -- readable from
// layout.tsx too, so shared globals like Navigation/Footer/SiteSettings
// also preview correctly, not just the page-specific content a plain
// ?draft=true param could reach) and then redirects to the real path.
// See src/app/api/preview/route.ts. Confirmed directly against the
// installed @payloadcms/ui package that Payload does NOT add any draft
// param/cookie itself (handleLivePreview.js uses this function's return
// value verbatim) -- without this, "Live Preview" would only ever show
// what's already published, defeating the point of previewing an edit
// before it goes live.
const appendDraft = (url: string) => {
  const u = new URL(url)
  return `${u.origin}/api/preview?path=${encodeURIComponent(u.pathname + u.search)}`
}
const livePreviewURL = ({
  data,
  collectionConfig,
  globalConfig,
}: {
  data: Record<string, unknown>
  collectionConfig?: { slug: string }
  globalConfig?: { slug: string }
}) => {
  // Found 2026-08-26 while investigating "Live Preview / click-to-edit
  // doesn't work" -- this function runs entirely client-side inside the
  // admin bundle (Payload serializes `admin.livePreview.url` into the
  // browser app), so if NEXT_PUBLIC_SERVER_URL isn't set at BUILD time on
  // Vercel, this fell back to 'http://localhost:3000' for every real
  // visitor to https://www.slatecinema.com/admin -- the iframe would try
  // to load a localhost URL that doesn't exist from their machine's
  // perspective, so it never renders anything, and the click-to-edit
  // shortcut (LivePreviewClickToEdit.tsx) never gets a chance to mount
  // because its own page never loads inside the frame. The CORS/CSRF
  // allow-list above already learned this exact lesson on 2026-08-17
  // (hardcoded real domains rather than trusting one env var alone) --
  // this applies the same fix here, matching wavecare.io's own
  // buildPreviewURL, which uses the identical NODE_ENV-based fallback.
  const base =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://www.slatecinema.com' : 'http://localhost:3000')
  if (globalConfig) {
    switch (globalConfig.slug) {
      case 'home-page':
        return appendDraft(base)
      case 'contact-page':
        return appendDraft(`${base}/contact`)
      case 'schedule-a-call-page':
        return appendDraft(`${base}/schedule-a-call`)
      case 'how-it-works-page':
        return appendDraft(`${base}/how-it-works`)
      case 'portfolio-index-page':
        return appendDraft(`${base}/portfolio`)
      case 'privacy-policy-page':
        return appendDraft(`${base}/privacy-policy`)
      case 'terms-of-service-page':
        return appendDraft(`${base}/terms-of-service`)
      case 'thank-you-page':
        return appendDraft(`${base}/thank-you`)
      case 'social-media-management-page':
        return appendDraft(`${base}/social-media-management`)
      default:
        // Navigation/Footer/SiteSettings/Pipeline/FinalCTA/ReadyToTalk
        // render on every page -- home is the most representative single
        // preview target for these shared/site-wide globals.
        return appendDraft(base)
    }
  }
  if (collectionConfig) {
    switch (collectionConfig.slug) {
      case 'industries':
        return appendDraft(`${base}/portfolio/${data.slug}`)
      case 'journal-posts':
        return appendDraft(`${base}/journal/${data.slug}`)
      case 'portfolio-projects':
        return appendDraft(`${base}/portfolio`)
      default:
        return appendDraft(base)
    }
  }
  return appendDraft(base)
}

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
      // Click-to-edit shortcut (2026-08-25) -- catches the postMessage
      // sent by src/components/LivePreviewClickToEdit.tsx when an editor
      // clicks tagged content inside the Live Preview iframe, and
      // scrolls/focuses the matching field. See that provider's own
      // comment for the full mechanism.
      providers: ['/components/admin/LivePreviewClickToEditProvider#LivePreviewClickToEditProvider'],
    },
    // Live Preview -- added 2026-08-20 alongside drafts/versions on every
    // content collection/global. Needs the frontend to actually listen
    // for live edits via useLivePreview (see src/components/LivePreviewListener.tsx)
    // for the iframe to update before a save; without that half, this
    // still gives a real preview iframe + device-size toggle, it just
    // only refreshes on save rather than on every keystroke.
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      url: livePreviewURL,
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
    PrivacyPolicyPage,
    TermsOfServicePage,
    ThankYouPage,
    SocialMediaManagementPage,
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
              // Without this, the plugin's own generateURL() (which builds
              // `${endpoint}/${bucket}/${key}` directly, unlike the AWS SDK's
              // upload/API calls which resolve the endpoint internally on
              // their own) renders every media URL with a literal
              // "undefined" as the host. Per Jake's handoff -- a real bug
              // from the Wavecare migration, not a hypothetical.
              endpoint: `https://s3.${process.env.S3_REGION}.amazonaws.com`,
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
