import { NextResponse } from 'next/server'
import { getPayload, type Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import config from '@/payload.config'
import { industries } from '@/lib/industries'
import { portfolioProjects } from '@/lib/portfolio-projects'
import { categories as pipelineCategories } from '@/lib/pipeline-data'

/*
  EMERGENCY, one-shot data-recovery route -- added 2026-08-21.

  Root cause: the drafts/versions migration's table-rebuild sequence
  (CREATE __new_X / INSERT copy / DROP old / RENAME) ran with
  `PRAGMA foreign_keys=ON` in effect for every parent table that ALSO
  has array-field child tables (e.g. navigation -> navigation_links,
  industries -> industries_gallery/stats/services/serviceCards/faqs/
  videoTestimonials/process, home_page -> mediaVoid.lines etc.,
  portfolio_projects -> metrics, pipeline -> categories.services). Each
  child table was correctly rebuilt with its data intact FIRST, but then
  the migration's own `DROP TABLE <parent>` step (needed to rebuild the
  parent itself for its own _status column) triggered SQLite's
  ON DELETE CASCADE from every child row referencing that parent id --
  wiping every nested array's rows the moment the parent got dropped,
  even though the child rebuild that ran moments earlier was itself
  correct. Confirmed via the live REST API: every affected array reads
  back empty right now, while scalar/relationship fields (title, slug,
  images, hero video, etc.) are untouched -- exactly the signature of a
  cascade wipe on child rows, not a broader data loss.

  This restores from the exact same source data + mapping logic the
  original seed script (src/seed/index.ts) used, since this project's
  fidelity rule was that Payload's content is byte-identical to those
  files. Journal posts' lexical `content` is a single JSON column (not
  a _parent_id child table) and was independently confirmed still
  intact -- left untouched.

  Every write explicitly sets `_status: 'published'` and omits `draft`
  so this can never land as an invisible draft version, matching the
  same fix needed for the `_status` regression (also re-applied here
  for the same tables, confirmed reverted to 'draft' again after the
  cascade-triggering rebuild).

  Delete this route once confirmed the site is fully restored.
*/
const RESTORE_TOKEN = 'y8h4k-slate-restore-2026-08-21-mn3wq7'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const mediaCache = new Map<string, number>()
const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', mp4: 'video/mp4',
}

async function uploadMedia(payload: Payload, relativePath: string | undefined, alt: string): Promise<number | undefined> {
  if (!relativePath) return undefined
  const cached = mediaCache.get(relativePath)
  if (cached !== undefined) return cached
  const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  if (existing.totalDocs > 0) {
    const id = existing.docs[0]!.id as number
    mediaCache.set(relativePath, id)
    return id
  }
  const absPath = path.join(PUBLIC_DIR, relativePath.replace(/^\//, ''))
  if (!fs.existsSync(absPath)) return undefined
  const data = fs.readFileSync(absPath)
  const filename = path.basename(absPath)
  const ext = path.extname(filename).slice(1).toLowerCase()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: MIME_BY_EXT[ext] || 'application/octet-stream', name: filename, size: data.length },
  })
  mediaCache.set(relativePath, doc.id as number)
  return doc.id as number
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (token !== RESTORE_TOKEN) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const log: string[] = []
  try {
    const payload = await getPayload({ config })

    // ---- 1. Industries: restore the array/nested fields only ----
    const industriesResults: Record<string, string> = {}
    for (const ind of industries) {
      const existing = await payload.find({ collection: 'industries', where: { slug: { equals: ind.slug } }, limit: 1 })
      if (existing.totalDocs === 0) {
        industriesResults[ind.slug] = 'NOT FOUND -- skipped'
        continue
      }
      const gallery = []
      for (const g of ind.gallery) {
        const id = await uploadMedia(payload, g, `${ind.label} gallery ${ind.gallery.indexOf(g) + 1}`)
        if (id) gallery.push({ image: id })
      }
      const serviceCards = []
      for (const sc of ind.serviceCards ?? []) {
        const image = await uploadMedia(payload, sc.image, `${ind.label} — ${sc.title}`)
        if (image === undefined) continue
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
        if (video === undefined) continue
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
      await payload.update({
        collection: 'industries',
        id: existing.docs[0]!.id,
        data: {
          gallery,
          stats: ind.stats,
          services: ind.services.map((name) => ({ name })),
          serviceCards,
          videoTestimonials,
          process: ind.process ?? [],
          faqs: ind.faqs ?? [],
          _status: 'published',
        },
      })
      industriesResults[ind.slug] = `restored: gallery=${gallery.length} services=${ind.services.length} serviceCards=${serviceCards.length} videoTestimonials=${videoTestimonials.length} process=${(ind.process ?? []).length} faqs=${(ind.faqs ?? []).length}`
    }
    log.push('industries done')

    // ---- 2. Portfolio projects: restore `metrics` only ----
    const portfolioResults: Record<string, string> = {}
    for (const p of portfolioProjects) {
      const existing = await payload.find({ collection: 'portfolio-projects', where: { title: { equals: p.title } }, limit: 1 })
      if (existing.totalDocs === 0) {
        portfolioResults[p.title] = 'NOT FOUND -- skipped'
        continue
      }
      await payload.update({
        collection: 'portfolio-projects',
        id: existing.docs[0]!.id,
        data: { metrics: p.metrics, _status: 'published' },
      })
      portfolioResults[p.title] = `restored: metrics=${p.metrics?.length ?? 0}`
    }
    log.push('portfolio-projects done')

    // ---- 3. Globals: re-run the exact seed-script upserts verbatim ----
    // (payload.updateGlobal is a full upsert against the single row --
    // safe to replay exactly as originally seeded; scalar fields already
    // match this data so this is a no-op for them and a real restore for
    // the now-empty arrays.)
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
        _status: 'published',
      },
    })
    log.push('navigation restored')

    await payload.updateGlobal({
      slug: 'footer',
      data: {
        marqueeItems: [
          { text: 'Cinematic Storytelling' }, { text: 'High-End Production' }, { text: 'Global Distribution' },
          { text: 'Social Media Management' }, { text: 'Brand Films' }, { text: 'Commercial Production' },
          { text: 'Aerial Cinematography' }, { text: 'Post-Production Mastery' }, { text: 'Color Grading' },
          { text: 'Motion Graphics' }, { text: 'Content Strategy' }, { text: 'Documentary Style' },
          { text: 'Event Coverage' }, { text: 'Corporate Video' }, { text: 'Product Launches' },
          { text: 'Real Estate Media' }, { text: 'Travel Films' }, { text: 'Athlete Features' },
          { text: 'Education Campaigns' }, { text: 'Award-Winning Work' },
        ],
        cta: { heading: 'Ready to create?', buttonLabel: 'Get Started', buttonHref: '/contact' },
        newsletter: {
          heading: 'Subscribe to our Newsletter',
          sentence: "Want to stay up to date on the latest AI trends, social media frenzies and the latest in media marketing tech? We share valuable tips straight into your inbox!",
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
        _status: 'published',
      },
    })
    log.push('footer restored')

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
        _status: 'published',
      },
    })
    log.push('pipeline restored')

    await payload.updateGlobal({
      slug: 'ready-to-talk',
      data: {
        eyebrow: '// Ready to Talk',
        headline: 'Book a time on our calendar',
        description: 'Prefer to talk it through live? Grab a 20-minute slot with our team — no pitch deck, no sales script, just an honest read on scope, timeline, and budget so you know exactly where you stand.',
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
        _status: 'published',
      },
    })
    log.push('ready-to-talk restored')

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
        mediaVoid: {
          lines: [
            { text: 'The content we create', color: '#ffffff' },
            { text: "isn't just eye-catching,", color: '#ffffff' },
            { text: "it's content people", color: '#ffffff' },
            { text: 'actually want to watch.', color: '#00AEEF' },
          ],
        },
        industryStandards: {
          phase2: { morphWords: [{ word: 'Intentional.' }, { word: 'Perfected.' }, { word: 'Done Right.' }] },
        },
        trustSection: {
          flagshipLogos: await Promise.all(
            flagshipLogos.map(async (f) => ({ name: f.name, logo: await uploadMedia(payload, f.src, `${f.name} flagship logo`) }))
          ),
          marqueeClients: await Promise.all(
            marqueeClients.map(async (c) => ({ name: c.name, logo: await uploadMedia(payload, c.src, `${c.name} client logo`) }))
          ),
        },
        reviews: {
          testimonials: [
            {
              quote: 'Extremely creative agency with strong experience to back up their ideas. Takes the time to really understand client needs and puts in the effort to bring them to life.',
              name: 'Good Baklava', role: '8 reviews', company: 'Google Review', rating: 5,
            },
            {
              quote: "We've worked with Slate Cinema to create a professional video. Amazing experience! Their willingness and understanding to schedule around our availability to ensure that we're able to complete the project while still running a full operation was amazing. Having someone that understands what we're trying to capture and seamlessly works it all into the shoot was such a great feeling. Just 5 star experience all around.",
              name: 'Ben Kaller', role: 'Local Guide · 27 reviews', company: 'Google Review', rating: 5,
            },
            {
              quote: 'Amazingly talented. Professional. And artistic. Exactly what we needed for the job.',
              name: 'Lia Jay', role: 'Local Guide · 12 reviews', company: 'Google Review', rating: 5,
            },
          ],
        },
        _status: 'published',
      },
    })
    log.push('home-page restored')

    const behindTheScenesStills = [
      { src: '/images/portfolio-production.webp', label: 'On Set', desc: "Whether it's in the universe or metaverse our team shows up.", span: 'tall' as const },
      { src: '/images/portfolio-brand.webp', label: 'The Edit Bay', desc: 'Frame-by-frame assembly with an editor who thinks in story beats.', span: 'normal' as const },
      { src: '/images/portfolio-social.webp', label: 'Color Suite', desc: 'A signature grade that makes your brand recognizable in any feed.', span: 'normal' as const },
      { src: '/images/portfolio-event.webp', label: 'Sound Stage', desc: 'Mix, score, and sound design tuned for sound-on and sound-off.', span: 'wide' as const },
    ]
    await payload.updateGlobal({
      slug: 'how-it-works-page',
      data: {
        processOverview: {
          timelineSteps: [
            { title: 'Pre-Production', color: '#00AEEF', line: 'Scripts, boards, and a locked plan before anything rolls.' },
            { title: 'Production', color: '#a855f7', line: 'Cameras roll — the shoot captures every frame on set.' },
            { title: 'Post-Production', color: '#10b981', line: 'Edit, grade, and sound turn footage into a finished film.' },
            { title: 'Distribution', color: '#f97316', line: 'Platform-native cuts get it in front of the right audience.' },
          ],
        },
        behindTheScenes: {
          stills: await Promise.all(
            behindTheScenesStills.map(async (s) => ({
              image: await uploadMedia(payload, s.src, `Behind the Scenes — ${s.label}`),
              label: s.label, desc: s.desc, span: s.span,
            }))
          ),
        },
        processWalkthrough: {
          phases: [
            { title: 'Pre-Production', color: '#00AEEF', video: await uploadMedia(payload, '/videos/pre-production.mp4', 'Process Walkthrough — Pre-Production'), description: 'Every shoot starts on paper. Scripts, storyboards, shotlists, casting, locations, and a full production schedule — locked before a single camera rolls.' },
            { title: 'Production', color: '#a855f7', video: await uploadMedia(payload, '/videos/production.mp4', 'Process Walkthrough — Production'), description: 'Directors, camera crew, sound, talent, and set design come together on set. This is where the raw footage is captured, frame by frame.' },
            { title: 'Post-Production', color: '#10b981', video: await uploadMedia(payload, '/videos/post-production.mp4', 'Process Walkthrough — Post-Production'), description: 'Editing, color grading, sound design, motion graphics, and VFX turn raw footage into a finished film — the phase most of the craft lives in.' },
            { title: 'Distribution', color: '#f97316', video: await uploadMedia(payload, '/videos/distribution.mp4', 'Process Walkthrough — Distribution'), description: 'Platform-native cuts, ad management, and social strategy get the finished piece in front of the right audience, on every channel that matters.' },
          ],
        },
        statsBand: [
          { value: 174, suffix: '+', label: 'Projects Since 2023' },
          { value: 3, suffix: 'wk', label: 'Avg. Turnaround' },
          { value: 5, suffix: '.0★ / 44 Reviews', label: 'Google Rating' },
          { value: 124, suffix: '+', label: 'Projects On Frame.io' },
        ],
        guarantees: [
          { icon: 'Clock', title: '1-Day Response', desc: 'A custom execution plan within one business day of your scope form.' },
          { icon: 'ShieldCheck', title: 'Fixed Pricing', desc: 'Locked proposal before we roll — no hourly surprises, ever.' },
          { icon: 'RefreshCw', title: 'Revision Rounds', desc: 'Structured revision rounds built into every timeline until it lands.' },
          { icon: 'Handshake', title: 'One Team, End-to-End', desc: 'The same team from first idea to final export — no handoffs, no drift.' },
        ],
        _status: 'published',
      },
    })
    log.push('how-it-works-page restored')

    await payload.updateGlobal({
      slug: 'portfolio-index-page',
      data: {
        portfolioFilters: ['All', 'Commercial', 'Social', 'Documentary', 'Event', 'Action'].map((name) => ({ name })),
        _status: 'published',
      },
    })
    log.push('portfolio-index-page restored')

    await payload.updateGlobal({
      slug: 'contact-page',
      data: {
        whatHappensNext: {
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
          stages: [
            { icon: 'HelpCircle', step: '01', title: 'Not Sure Yet', desc: "Not sure what you need? Leave your info and we'll reach out.", ctaLabel: 'Send a Quick Note', href: '#lead-form', accent: '#00AEEF' },
            { icon: 'ClipboardList', step: '02', title: 'Know What You Need', desc: "Have a project in mind? Walk us through the details and we'll follow up with a plan.", ctaLabel: 'Start the Intake Form', href: '/contact/project', accent: '#c084fc' },
            { icon: 'CalendarClock', step: '03', title: 'Ready to Talk', desc: 'Prefer to talk it through live? Grab a time on our calendar.', ctaLabel: 'Schedule a Call', href: '/schedule-a-call', accent: '#34d399' },
          ],
        },
        leadForm: {
          badges: [
            { icon: 'Timer', label: '~10 Seconds' },
            { icon: 'ShieldCheck', label: 'No Spam, Ever' },
            { icon: 'Mail', label: 'Replies Within Minutes' },
          ],
        },
        contactMethods: {
          badges: [
            { icon: 'MessageCircleMore', label: 'We Reply Fast' },
            { icon: 'Users', label: 'Handled With Care' },
          ],
        },
        _status: 'published',
      },
    })
    log.push('contact-page restored')

    return NextResponse.json({ log, industriesResults, portfolioResults })
  } catch (e) {
    return NextResponse.json(
      { log, error: e instanceof Error ? e.message : String(e), stack: e instanceof Error ? e.stack : undefined },
      { status: 500 },
    )
  }
}
