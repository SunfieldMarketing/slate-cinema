/*
  One-time / idempotent seed script — populates Payload from the site's
  existing static data files (src/lib/industries.ts, portfolio-projects.ts,
  journal.ts) so the migrated content is byte-identical to what's live,
  per the migration playbook's fidelity rule. Every write checks for an
  existing doc first, so re-running this is safe.

  Run with: npx tsx src/seed/index.ts
  Requires ADMIN_USERNAME + ADMIN_INITIAL_PASSWORD in the environment to
  create the first admin user (8+ chars — enforced in
  src/collections/Users.ts too, not just here).
*/
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { industries } from '../lib/industries'
import { portfolioProjects } from '../lib/portfolio-projects'
import { journalPosts, type JournalBlock } from '../lib/journal'
import { categories as pipelineCategories } from '../lib/pipeline-data'

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
        { label: 'Social Media', href: '/social-media-management' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Contact Us', href: '/contact#get-started' },
      ],
      ctaButton: { label: 'Schedule Call', href: '/schedule-a-call' },
      clientPortalHref: 'https://my.slatecinema.com/',
    },
  })
  console.log('✓ seeded navigation global')

  // 6. Footer global
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      // 20 phrases -- with only the original 3, the 2x-duplicated marquee
      // content was narrower than the viewport on most desktop screens, so
      // the loop visibly ran out of content and "dropped off" (a blank gap)
      // right before snapping back. This keeps the same xPercent:-50 / 2x
      // duplication mechanism in Footer.tsx working seamlessly at any width.
      marqueeItems: [
        { text: 'Cinematic Storytelling' },
        { text: 'High-End Production' },
        { text: 'Global Distribution' },
        { text: 'Social Media Management' },
        { text: 'Brand Films' },
        { text: 'Commercial Production' },
        { text: 'Aerial Cinematography' },
        { text: 'Post-Production Mastery' },
        { text: 'Color Grading' },
        { text: 'Motion Graphics' },
        { text: 'Content Strategy' },
        { text: 'Documentary Style' },
        { text: 'Event Coverage' },
        { text: 'Corporate Video' },
        { text: 'Product Launches' },
        { text: 'Real Estate Media' },
        { text: 'Travel Films' },
        { text: 'Athlete Features' },
        { text: 'Education Campaigns' },
        { text: 'Award-Winning Work' },
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
        privacyHref: '/privacy-policy',
        termsHref: '/terms-of-service',
        clientPortalHref: 'https://my.slatecinema.com/',
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
        // TikTok Content Posting API approval requirement: the homepage
        // (and both legal pages) <title> must be literally "Slate
        // Cinema" -- no template suffix, no tagline. Sub-pages that set
        // their own string title still get the "%s | Slate Cinema"
        // template above; this only changes what untitled pages (Home,
        // the legal pages) fall back to.
        defaultTitle: 'Slate Cinema',
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

  // 8. Pipeline global (shared Home + How It Works)
  const pipelineCategoriesData = []
  for (const cat of pipelineCategories) {
    const video = await uploadMedia(payload, cat.video, `Pipeline — ${cat.title}`)
    pipelineCategoriesData.push({
      categoryId: cat.id,
      title: cat.title,
      video,
      color: cat.color,
      services: cat.services.map((s) => ({
        name: s.name,
        desc: s.desc,
        tags: (s.tags ?? []).map((tag) => ({ tag })),
      })),
    })
  }
  await payload.updateGlobal({
    slug: 'pipeline',
    data: {
      heading: {
        eyebrow: 'How It Works',
        title: 'The Production Pipeline',
        description: "Four phases, each broken down into the exact services behind it. Open a phase to see what's included.",
      },
      categories: pipelineCategoriesData,
    },
  })
  console.log('✓ seeded pipeline global')

  // 9. FinalCTA global (shared Home / How It Works / Portfolio)
  await payload.updateGlobal({
    slug: 'final-cta',
    data: {
      eyebrow: '// Ready To Scale?',
      headlineLine1: 'Your next era',
      headlineLine2: 'starts here',
      description:
        "Don't let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.",
      buttonLabel: 'Get Started',
      buttonHref: '/contact',
      trustNote: 'Replies within minutes',
    },
  })
  console.log('✓ seeded final-cta global')

  // 10. ReadyToTalk global (shared Contact / Schedule a Call)
  await payload.updateGlobal({
    slug: 'ready-to-talk',
    data: {
      eyebrow: '// Ready to Talk',
      headline: 'Book a time on our calendar',
      description:
        'Prefer to talk it through live? Grab a 20-minute slot with our team — no pitch deck, no sales script, just an honest read on scope, timeline, and budget so you know exactly where you stand.',
      badges: [
        { icon: 'Clock3', label: '20-Minute Call' },
        { icon: 'Users', label: 'Talk to a Real Producer' },
        { icon: 'ShieldCheck', label: 'No Pitch Deck' },
      ],
      prepItems: [
        { icon: 'Target', label: 'Your goals', desc: 'What the video needs to do for your business.' },
        { icon: 'Clock3', label: 'Your timeline', desc: 'When you need it shot, edited, and live.' },
        { icon: 'Wallet', label: 'A budget ballpark', desc: 'Rough range is fine — it keeps the call efficient.' },
        { icon: 'Sparkles', label: 'Any references', desc: 'Links or examples you like are a bonus, not required.' },
      ],
      buttonLabel: 'Schedule a Call',
      buttonHref: '/schedule-a-call',
      note: 'No commitment — reschedule or cancel anytime.',
    },
  })
  console.log('✓ seeded ready-to-talk global')

  // 11. HomePage global
  const flagshipLogos = [
    { name: 'Meta', src: '/images/clients/meta-logo.webp' },
    { name: 'Alo', src: '/images/clients/alo-logo.webp' },
    { name: 'B&H', src: '/images/clients/bh-logo.webp' },
  ]
  const marqueeClients = [
    { name: 'Dream', src: '/images/clients/dream-testimonials.webp' },
    { name: 'Healing Partners', src: '/images/clients/healing-partners.webp' },
    { name: 'Inhale', src: '/images/clients/inhale-testimonails.webp' },
    { name: 'Lucida', src: '/images/clients/lucida-testimonials.webp' },
    { name: 'Workplace Realty', src: '/images/clients/workplace-realty.webp' },
  ]
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        wordmarkPart1: 'SLATE',
        wordmarkPart2: 'CINEMA',
        subtitle: 'Video Marketing At Your Fingertips',
        ctaLabel: 'Get Started',
        ctaHref: '/contact',
        secondaryCtaLabel: 'Watch Our Reel',
        secondaryCtaHref: '#reel',
      },
      mediaVoid: {
        lines: [
          { text: 'The content we create', color: '#ffffff' },
          { text: "isn't just eye-catching,", color: '#ffffff' },
          { text: "it's content people", color: '#ffffff' },
          { text: 'actually want to watch.', color: '#00AEEF' },
        ],
      },
      industryStandards: {
        phase1: {
          eyebrow: '// The Standard',
          headlineLine1: 'WE ENGINEER',
          headlineLine2: 'ATTENTION',
          description:
            "In a crowded digital landscape, being 'good enough' means being invisible. We build content systems designed specifically to hijack feeds, halt thumbs, and demand viewer retention from the very first frame.",
        },
        phase2: {
          eyebrow: '// The Execution',
          headline: 'EVERY FRAME',
          morphWords: [{ word: 'Intentional.' }, { word: 'Perfected.' }, { word: 'Done Right.' }],
          description:
            "We don't just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.",
        },
        phase3: {
          eyebrow: '// The Result',
          headline: 'DOMINATE YOUR MARKET',
          description: 'The result is scalable, predictable growth. We turn passive viewers into active communities, and organic reach into tangible ROI.',
          ctaLabel: 'Get Started',
          ctaHref: '/contact',
        },
      },
      trustSection: {
        eyebrow: 'Join the leaders working with Slate Cinema',
        ratingText: '5.0/5 · 44 Google reviews',
        marqueeLabel: 'More collaborations & partnerships',
        flagshipLogos: await Promise.all(
          flagshipLogos.map(async (f) => ({ name: f.name, logo: await uploadMedia(payload, f.src, `${f.name} flagship logo`) }))
        ),
        marqueeClients: await Promise.all(
          marqueeClients.map(async (c) => ({ name: c.name, logo: await uploadMedia(payload, c.src, `${c.name} client logo`) }))
        ),
      },
      results: {
        viewsTarget: 120000000,
        likesTarget: 14352910,
        commentsTarget: 1670823,
        reachPercent: '98.2%',
        description:
          'Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is meticulously shaped to make audiences stop scrolling.',
        ctaLabel: 'See Case Studies',
        ctaHref: '/portfolio',
      },
      reviews: {
        eyebrow: 'Client Feedback',
        headlineLine1: 'Trusted by leaders',
        headlineLine2: 'across industries',
        ratingText: '5.0/5 average · 44 Google reviews',
        videoTestimonialsLabel: 'Hear it from them, not us',
        googleReviewsLabel: 'From Google reviews',
        testimonials: [
          {
            quote:
              "The attention to detail is better than anyone we've ever worked with! I would highly recommend using Slate for any and all media. We've been working hand-in-hand with Slate for 6+ years now — I would never go back to using anyone else!",
            name: 'Dan Jennings',
            role: 'Local Guide',
            company: 'Google Review',
            rating: 5,
          },
          {
            quote:
              'Slate Cinema is hands-down one of the best video production companies in Brooklyn. They took our ideas and turned them into stunning, high-quality content that perfectly captured our brand. The team is creative, professional, and easy to work with from start to finish.',
            name: 'Sara Greenberg',
            role: 'Client',
            company: 'Google Review',
            rating: 5,
          },
          {
            quote:
              "Jake created an amazing promotional video for my organization and I couldn't be happier with the result. He was professional, creative, and really understood the message we wanted to share. The final product was polished, engaging, and better than I imagined.",
            name: 'Chana W',
            role: 'Local Guide',
            company: 'Google Review',
            rating: 5,
          },
        ],
      },
    },
  })
  console.log('✓ seeded home-page global')

  // 12. HowItWorksPage global
  const behindTheScenesStills = [
    { src: '/images/portfolio-production.webp', label: 'On Set', desc: "Whether it's in the universe or metaverse our team shows up.", span: 'tall' as const },
    { src: '/images/portfolio-brand.webp', label: 'The Edit Bay', desc: 'Frame-by-frame assembly with an editor who thinks in story beats.', span: 'normal' as const },
    { src: '/images/portfolio-social.webp', label: 'Color Suite', desc: 'A signature grade that makes your brand recognizable in any feed.', span: 'normal' as const },
    { src: '/images/portfolio-event.webp', label: 'Sound Stage', desc: 'Mix, score, and sound design tuned for sound-on and sound-off.', span: 'wide' as const },
  ]
  await payload.updateGlobal({
    slug: 'how-it-works-page',
    data: {
      hero: {
        eyebrow: 'The Process',
        title: 'How It Works',
        subtitle:
          'A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically.',
        ctaLabel: 'Get Started',
        ctaHref: '/contact',
      },
      processOverview: {
        eyebrow: 'At A Glance',
        headline: 'Four phases, start to finish',
        timelineSteps: [
          { title: 'Pre-Production', color: '#00AEEF', line: 'Scripts, boards, and a locked plan before anything rolls.' },
          { title: 'Production', color: '#a855f7', line: 'Cameras roll — the shoot captures every frame on set.' },
          { title: 'Post-Production', color: '#10b981', line: 'Edit, grade, and sound turn footage into a finished film.' },
          { title: 'Distribution', color: '#f97316', line: 'Platform-native cuts get it in front of the right audience.' },
        ],
      },
      behindTheScenes: {
        eyebrow: 'Behind The Scenes',
        headline: 'Where the work happens',
        subhead: 'Every phase has a room, a rig, and a person who obsesses over it.',
        stills: await Promise.all(
          behindTheScenesStills.map(async (s) => ({
            image: await uploadMedia(payload, s.src, `Behind the Scenes — ${s.label}`),
            label: s.label,
            desc: s.desc,
            span: s.span,
          }))
        ),
      },
      processWalkthrough: {
        eyebrow: 'Every Project Includes',
        headline: 'Watch it move through every phase',
        subhead: "A complete production — not just raw footage. Scroll through to see what's actually happening at each stage.",
        phases: [
          {
            title: 'Pre-Production',
            color: '#00AEEF',
            video: await uploadMedia(payload, '/videos/pre-production.mp4', 'Process Walkthrough — Pre-Production'),
            description:
              'Every shoot starts on paper. Scripts, storyboards, shotlists, casting, locations, and a full production schedule — locked before a single camera rolls.',
          },
          {
            title: 'Production',
            color: '#a855f7',
            video: await uploadMedia(payload, '/videos/production.mp4', 'Process Walkthrough — Production'),
            description:
              'Directors, camera crew, sound, talent, and set design come together on set. This is where the raw footage is captured, frame by frame.',
          },
          {
            title: 'Post-Production',
            color: '#10b981',
            video: await uploadMedia(payload, '/videos/post-production.mp4', 'Process Walkthrough — Post-Production'),
            description:
              'Editing, color grading, sound design, motion graphics, and VFX turn raw footage into a finished film — the phase most of the craft lives in.',
          },
          {
            title: 'Distribution',
            color: '#f97316',
            video: await uploadMedia(payload, '/videos/distribution.mp4', 'Process Walkthrough — Distribution'),
            description:
              'Platform-native cuts, ad management, and social strategy get the finished piece in front of the right audience, on every channel that matters.',
          },
        ],
      },
      statsBand: [
        { value: 1, suffix: 'hr', label: 'Avg. Response Time' },
        { value: 3, suffix: 'wk', label: 'Avg. Turnaround' },
        { value: 90, suffix: '%', label: 'Client Retention' },
        { value: 50, suffix: '+', label: 'Brands Served' },
      ],
      guarantees: [
        { icon: 'Clock', title: '1-Day Response', desc: 'A custom execution plan within one business day of your scope form.' },
        { icon: 'ShieldCheck', title: 'Fixed Pricing', desc: 'Locked proposal before we roll — no hourly surprises, ever.' },
        { icon: 'RefreshCw', title: 'Revision Rounds', desc: 'Structured revision rounds built into every timeline until it lands.' },
        { icon: 'Handshake', title: 'One Team, End-to-End', desc: 'The same team from first idea to final export — no handoffs, no drift.' },
      ],
    },
  })
  console.log('✓ seeded how-it-works-page global')

  // 13. PortfolioIndexPage global
  await payload.updateGlobal({
    slug: 'portfolio-index-page',
    data: {
      hero: {
        video: await uploadMedia(payload, '/videos/hero.mp4', 'Portfolio hero video'),
        title: 'Our Work',
        date: 'Selected Campaigns',
        scrollToExpandLabel: 'Scroll To Explore',
        description:
          "Discover a world of captivating storytelling. From immersive brand journeys to campaigns that dominate the feed — this is Slate Cinema's showcase.",
        ctaLabel: 'Get Started',
        ctaHref: '/contact',
      },
      reelCarousel: {
        eyebrow: 'The Reel',
        headline: 'Spin through the work',
        subhead: 'Drag to spin the reel · click a frame to open it',
      },
      industriesSection: {
        eyebrow: 'Who We Work With',
        headline: 'Cinematic work for every industry',
      },
      portfolioFilters: ['All', 'Commercial', 'Social', 'Documentary', 'Event', 'Action'].map((name) => ({ name })),
    },
  })
  console.log('✓ seeded portfolio-index-page global')

  // 14. ContactPage global
  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      hero: {
        eyebrow: 'Get Started',
        titleLine1: "Let's get",
        titleLine2: 'you started',
        subtitle: "Tell us where you're at and we'll point you to the right next step. We reply within minutes.",
      },
      whatHappensNext: {
        eyebrow: '// After You Reach Out',
        headline: 'What happens next',
        subhead: "From hello until final delivery, here's the road map laid out.",
        formPrompt: 'Fill out a form below',
        badges: [
          { icon: 'Receipt', label: 'Fixed-Price Proposals' },
          { icon: 'Repeat', label: 'Revision Rounds Included' },
          { icon: 'BadgeCheck', label: 'One Team End-to-End' },
        ],
        steps: [
          { icon: 'FileText', step: '01', title: 'Share Your Scope', desc: 'Fill out a form above or reach out directly with your goals and timeline.' },
          { icon: 'PhoneCall', step: '02', title: 'Discovery Call', desc: 'We hop on a call within one business day to align on vision and budget.' },
          { icon: 'FileCheck2', step: '03', title: 'Custom Proposal', desc: 'You get a fixed-price execution plan tailored to your campaign.' },
          { icon: 'Clapperboard', step: '04', title: 'We Roll Camera', desc: 'Approve and we move straight into pre-production. Lights, camera, launch.' },
        ],
      },
      stageRouter: {
        eyebrow: '// Get Started',
        headline: 'What stage are you at?',
        subhead: "No wrong answer here, pick whichever fits where you're at now.",
        stages: [
          {
            icon: 'HelpCircle',
            step: '01',
            title: 'Not Sure Yet',
            desc: "Not sure what you need? Leave your info and we'll reach out.",
            ctaLabel: 'Send a Quick Note',
            href: '#lead-form',
            accent: '#00AEEF',
          },
          {
            icon: 'ClipboardList',
            step: '02',
            title: 'Know What You Need',
            desc: "Have a project in mind? Walk us through the details and we'll follow up with a plan.",
            ctaLabel: 'Start the Intake Form',
            href: '/contact/project',
            accent: '#c084fc',
          },
          {
            icon: 'CalendarClock',
            step: '03',
            title: 'Ready to Talk',
            desc: 'Prefer to talk it through live? Grab a time on our calendar.',
            ctaLabel: 'Schedule a Call',
            href: '/schedule-a-call',
            accent: '#34d399',
          },
        ],
      },
      leadForm: {
        eyebrow: '// Not Sure Yet',
        headline: 'Drop us a line',
        description:
          "Not sure exactly what you need yet? Totally fine — most people aren't at first. Leave your info and a real person on our team will reach out with the right next step, no matter how vague the ask.",
        badges: [
          { icon: 'Timer', label: '~10 Seconds' },
          { icon: 'ShieldCheck', label: 'No Spam, Ever' },
          { icon: 'Mail', label: 'Replies Within Minutes' },
        ],
        submitLabel: 'Send Message',
        successMessage: "We'll be in touch within minutes.",
      },
      contactMethods: {
        eyebrow: 'Or Reach Us Directly',
        headline: 'Real Humans. Real Work.',
        description: "No forms, no queue — email, call, or stop by the studio directly. Whatever's easiest for you.",
        badges: [
          { icon: 'MessageCircleMore', label: 'We Reply Fast' },
          { icon: 'Users', label: 'Handled With Care' },
        ],
      },
      studioLocation: {
        eyebrow: '// The Studio',
        headlineLine1: 'Based in Brooklyn,',
        headlineLine2: 'shooting everywhere.',
      },
    },
  })
  console.log('✓ seeded contact-page global')

  // 15. ScheduleACallPage global
  await payload.updateGlobal({
    slug: 'schedule-a-call-page',
    data: {
      hero: {
        eyebrow: 'Schedule a Call',
        titleLine1: "Let's talk",
        titleLine2: 'it through',
        subtitle:
          "Grab a time that works for you. We'll walk through your project, timeline, and budget — and outline exactly what happens next.",
      },
      calendar: {
        eyebrow: '// Production Meeting',
        headline: 'Lock In A Time',
        sessionLabel: 'Strategy Session',
        durationLabel: '45 Min Video Call',
        monthLabel: 'OCTOBER 2026',
        selectDateLabel: 'Select Date',
        selectTimeLabel: 'Select Time',
        confirmLabel: 'Confirm Time',
        confirmedLabel: "You're Booked — We'll Be in Touch",
      },
    },
  })
  console.log('✓ seeded schedule-a-call-page global')

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
