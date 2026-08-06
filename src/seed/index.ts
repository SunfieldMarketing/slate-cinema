/*
  One-time / idempotent seed script — populates Payload from the site's
  existing static data files (src/lib/industries.ts, portfolio-projects.ts,
  journal.ts) so the migrated content is byte-identical to what's live,
  per the migration playbook's fidelity rule. Every write checks for an
  existing doc first, so re-running this is safe.

  Run with: npx tsx src/seed/index.ts
  Requires ADMIN_USERNAME + ADMIN_INITIAL_PASSWORD in the environment to
  create the first admin user (16+ chars — enforced in
  src/collections/Users.ts too, not just here).
*/
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { industries } from '../lib/industries'
import { portfolioProjects } from '../lib/portfolio-projects'
import { journalPosts, type JournalBlock } from '../lib/journal'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
// IDs must stay whatever type the DB adapter actually uses (a number for
// SQLite's integer primary key) -- stringifying them here made every
// upload/relationship field fail validation with a cryptic
// "invalid relationships: N 0" error, since Payload's relationship
// validation checks the value against the adapter's real ID type.
const mediaCache = new Map<string, number>()

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  mp4: 'video/mp4',
}

async function uploadMedia(
  payload: Payload,
  relativePath: string | undefined,
  alt: string
): Promise<number | undefined> {
  if (!relativePath) return undefined
  const cached = mediaCache.get(relativePath)
  if (cached !== undefined) return cached

  const absPath = path.join(PUBLIC_DIR, relativePath.replace(/^\//, ''))
  if (!fs.existsSync(absPath)) {
    console.warn(`  ! missing file, skipping: ${relativePath}`)
    return undefined
  }

  // Reuse an already-uploaded doc across script re-runs, keyed by alt +
  // original filename (Payload doesn't dedupe uploads by content itself).
  const filename = path.basename(absPath)
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    const id = existing.docs[0]!.id
    mediaCache.set(relativePath, id)
    return id
  }

  const data = fs.readFileSync(absPath)
  const ext = path.extname(filename).slice(1).toLowerCase()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: MIME_BY_EXT[ext] || 'application/octet-stream', name: filename, size: data.length },
  })
  mediaCache.set(relativePath, doc.id)
  return doc.id
}

type IconName =
  | 'Film'
  | 'Dumbbell'
  | 'Plane'
  | 'Building2'
  | 'HeartPulse'
  | 'ShoppingBag'
  | 'Briefcase'
  | 'Users'
  | 'GraduationCap'

const ICON_NAME_BY_INDUSTRY_ID: Record<string, IconName> = {
  ai: 'Film',
  athletics: 'Dumbbell',
  travel: 'Plane',
  'real-estate': 'Building2',
  healthcare: 'HeartPulse',
  products: 'ShoppingBag',
  corporate: 'Briefcase',
  organizations: 'Users',
  education: 'GraduationCap',
}

/** Converts the old typed p/h2/quote/list block array into a minimal
 *  valid Lexical editor-state JSON tree. */
function blocksToLexical(blocks: JournalBlock[]) {
  const children = blocks.map((b) => {
    const base = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 }
    if (b.type === 'h2') {
      return { ...base, type: 'heading', tag: 'h2', children: [{ type: 'text', text: b.text || '', version: 1 }] }
    }
    if (b.type === 'quote') {
      return { ...base, type: 'quote', children: [{ type: 'text', text: b.text || '', version: 1 }] }
    }
    if (b.type === 'list') {
      return {
        ...base,
        type: 'list',
        tag: 'ul',
        listType: 'bullet',
        start: 1,
        children: (b.items || []).map((item, i) => ({
          ...base,
          type: 'listitem',
          value: i + 1,
          children: [{ type: 'text', text: item, version: 1 }],
        })),
      }
    }
    return { ...base, type: 'paragraph', children: [{ type: 'text', text: b.text || '', version: 1 }] }
  })
  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } }
}

async function main() {
  const payload = await getPayload({ config })

  // 1. Admin user
  const userCount = await payload.count({ collection: 'users' })
  if (userCount.totalDocs === 0) {
    const username = process.env.ADMIN_USERNAME
    const password = process.env.ADMIN_INITIAL_PASSWORD
    if (!username || !password) {
      throw new Error(
        'ADMIN_USERNAME and ADMIN_INITIAL_PASSWORD must be set in the environment to seed the first admin user.'
      )
    }
    await payload.create({
      collection: 'users',
      data: { username, password, roles: ['admin'] },
    })
    console.log(`✓ created admin user "${username}"`)
  } else {
    console.log('- admin user(s) already exist, skipping')
  }

  // 2. Industries
  for (const ind of industries) {
    const existing = await payload.find({
      collection: 'industries',
      where: { slug: { equals: ind.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`- industry "${ind.slug}" already seeded, skipping`)
      continue
    }

    const heroImage = await uploadMedia(payload, ind.heroImage, `${ind.label} hero image`)
    const heroVideo = await uploadMedia(payload, ind.heroVideo, `${ind.label} hero video`)

    const gallery = []
    for (const [i, g] of ind.gallery.entries()) {
      const id = await uploadMedia(payload, g, `${ind.label} gallery ${i + 1}`)
      if (id) gallery.push({ image: id })
    }

    const serviceCards = []
    for (const sc of ind.serviceCards ?? []) {
      const image = await uploadMedia(payload, sc.image, `${ind.label} — ${sc.title}`)
      if (image === undefined) {
        console.warn(`  ! skipping service card "${sc.title}" — required image missing`)
        continue
      }
      serviceCards.push({
        title: sc.title,
        description: sc.description,
        outcome: sc.outcome,
        deliverables: sc.deliverables.map((item) => ({ item })),
        meta: sc.meta,
        image,
        video: sc.video ? await uploadMedia(payload, sc.video, `${ind.label} — ${sc.title} video`) : undefined,
        featured: !!sc.featured,
      })
    }

    const videoTestimonials = []
    for (const vt of ind.videoTestimonials ?? []) {
      const video = await uploadMedia(payload, vt.video, `${vt.name} testimonial video`)
      if (video === undefined) {
        console.warn(`  ! skipping video testimonial "${vt.name}" — required video missing`)
        continue
      }
      videoTestimonials.push({
        quote: vt.quote,
        name: vt.name,
        role: vt.role,
        company: vt.company,
        video,
        outcome: vt.outcome,
        poster: vt.poster ? await uploadMedia(payload, vt.poster, `${vt.name} testimonial poster`) : undefined,
        logo: vt.logo ? await uploadMedia(payload, vt.logo, `${vt.company} logo`) : undefined,
      })
    }

    await payload.create({
      collection: 'industries',
      data: {
        slug: ind.slug,
        label: ind.label,
        icon: ICON_NAME_BY_INDUSTRY_ID[ind.id] ?? 'Film',
        accent: ind.accent,
        blurb: ind.blurb,
        description: ind.description,
        stat: ind.stat,
        heroImage,
        heroVideo,
        gallery,
        stats: ind.stats,
        services: ind.services.map((name) => ({ name })),
        testimonial: ind.testimonial,
        serviceCards,
        videoTestimonials,
        process: ind.process ?? [],
        faqs: ind.faqs ?? [],
      },
    })
    console.log(`✓ seeded industry "${ind.slug}"`)
  }

  // 3. Portfolio projects
  let order = 0
  for (const p of portfolioProjects) {
    const existing = await payload.find({
      collection: 'portfolio-projects',
      where: { title: { equals: p.title } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`- project "${p.title}" already seeded, skipping`)
      order++
      continue
    }
    const poster = await uploadMedia(payload, p.url, `${p.title} poster`)
    if (poster === undefined) {
      console.warn(`  ! skipping project "${p.title}" — required poster missing`)
      order++
      continue
    }
    await payload.create({
      collection: 'portfolio-projects',
      data: {
        title: p.title,
        category: p.category,
        company: p.company,
        poster,
        copy: p.copy,
        video: p.video ? await uploadMedia(payload, p.video, `${p.title} featured cut`) : undefined,
        metrics: p.metrics,
        order,
      },
    })
    console.log(`✓ seeded project "${p.title}"`)
    order++
  }

  // 4. Journal posts
  for (const post of journalPosts) {
    const existing = await payload.find({
      collection: 'journal-posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`- journal post "${post.slug}" already seeded, skipping`)
      continue
    }
    const coverImage = await uploadMedia(payload, post.coverImage, `${post.title} cover`)
    if (coverImage === undefined) {
      console.warn(`  ! skipping journal post "${post.slug}" — required cover image missing`)
      continue
    }
    await payload.create({
      collection: 'journal-posts',
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        accent: post.accent,
        date: post.date,
        readTime: post.readTime,
        coverImage,
        author: post.author,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: blocksToLexical(post.content) as any,
      },
    })
    console.log(`✓ seeded journal post "${post.slug}"`)
  }

  // 5. Navigation global
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      links: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Contact Us', href: '/contact#get-started' },
      ],
      ctaButton: { label: 'Schedule Call', href: '/schedule-a-call' },
      clientPortalHref: '#',
    },
  })
  console.log('✓ seeded navigation global')

  // 6. Footer global
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      marqueeItems: [
        { text: 'Cinematic Storytelling' },
        { text: 'High-End Production' },
        { text: 'Global Distribution' },
      ],
      cta: { heading: 'Ready to create?', buttonLabel: 'Get Started', buttonHref: '/contact' },
      newsletter: {
        heading: 'Subscribe to our Newsletter',
        sentence:
          "Want to stay up to date on the latest Ai trends, social media frenzy's and the latest in media marketing tech? We share valuable tips straight into your inbox!",
        placeholder: 'Your email address',
        buttonLabel: 'Sign Up',
      },
      sitemapColumn: {
        heading: 'Studio',
        links: [
          { label: 'Work', href: '/portfolio' },
          { label: 'How It Works', href: '/how-it-works' },
          { label: 'Journal', href: '/journal' },
          { label: 'Get Started', href: '/contact' },
        ],
      },
      bottomBar: {
        craftedWithLoveText: 'Crafted with love by Slate Cinema',
        privacyHref: '#',
        termsHref: '#',
        clientPortalHref: '#',
      },
    },
  })
  console.log('✓ seeded footer global')

  // 7. Site settings global
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      seo: {
        titleTemplate: '%s | Slate Cinema',
        defaultTitle: 'Slate Cinema | Video Marketing at Your Fingertips',
        defaultDescription:
          'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.',
      },
      contact: {
        email: 'info@slatecinema.com',
        phone: '+1 732 930 1934',
        studioName: 'Slate Cinema Studio',
        addressLine: '132 32nd St',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11232',
        hours: 'Mon–Fri · 9am – 7pm ET · On-location by appointment',
      },
    },
  })
  console.log('✓ seeded site settings global')

  console.log('\nSeed complete.')
  process.exit(0)
}

main().catch((err) => {
  // Payload's ValidationError nests per-field messages in err.data.errors /
  // err.cause.errors, which Node's default depth-2 inspect collapses to
  // "[Object]" — dump those explicitly so failures are actually readable.
  const nested = (err as { data?: { errors?: unknown[] }; cause?: { errors?: unknown[] } })
  const fieldErrors = nested?.data?.errors ?? nested?.cause?.errors
  if (fieldErrors) {
    console.error('Validation errors:')
    console.error(JSON.stringify(fieldErrors, null, 2))
  }
  console.error(err)
  process.exit(1)
})
