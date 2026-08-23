import { NextResponse } from 'next/server'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// ~9 industries x up to 4 thumbnail fetch+upload round-trips each --
// comfortably over the platform default execution window.
export const maxDuration = 300

// One-shot: wires real Slate Cinema Vimeo footage (Jake's account,
// vimeo.com/user58842347) into industries / pipeline / portfolio-index
// slots per the Aug 13 Dropbox/Vimeo media tracker. Every ID here is
// cited directly in that tracker or its Vimeo appendix -- nothing
// invented. Two modes:
//   - videoVimeoUrl set directly (no download) wherever a real 1:1 video
//     match exists and the collection now has a Vimeo column.
//   - for image slots (hero/gallery stills), pulls the video's own
//     official thumbnail via Vimeo's public oEmbed API and uploads it as
//     real media -- a genuine frame from the genuine video, not a guess.
// Read-only against Vimeo/Dropbox; only writes to this site's own DB/S3.
//
// 2026-08-22 fixSelectedWork run: Park Smiles NYC / Gateways / Sleepy
// Hollow Hotel posters fixed (real Vimeo/old-site sources); CVM
// Construction, Real Talk, TruBlue of NW Brooklyn, EKGx, and Smash House
// Burgers postdate every archive searched -- no real source exists to
// wire in. This comment exists to force a fresh deploy so the frontend
// layout's 5-min ISR window rebuilds from the DB write above rather than
// waiting out whatever's left of the prior cache cycle.

const WIRE_TOKEN = 'r4n7k-slate-wiremedia-2026-08-22-vq83zx'

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

async function vimeoThumbnail(id: string): Promise<{ url: string; width: number; height: number } | null> {
  const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1920`)
  if (!res.ok) return null
  const j = await res.json()
  return { url: j.thumbnail_url, width: j.thumbnail_width, height: j.thumbnail_height }
}

// Uploads a Vimeo video's official thumbnail into the media collection,
// tagged so re-runs reuse the same doc instead of duplicating.
async function uploadVimeoThumbnail(payload: Payload, vimeoId: string, alt: string): Promise<number | null> {
  const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  if (existing.totalDocs > 0) return existing.docs[0]!.id as number

  const thumb = await vimeoThumbnail(vimeoId)
  if (!thumb) return null
  const imgRes = await fetch(thumb.url)
  if (!imgRes.ok) return null
  const buf = Buffer.from(await imgRes.arrayBuffer())
  const filename = `vimeo-${vimeoId}-thumb.jpg`

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buf, mimetype: 'image/jpeg', name: filename, size: buf.length },
  })
  return doc.id as number
}

type IndustryWiring = {
  slug: string
  heroVideoVimeoUrl?: string
  heroImageVimeoId?: string // pulls a thumbnail if set (used when no better still exists)
  galleryVimeoIds?: string[] // replaces the gallery array, one image per id
}

const INDUSTRY_WIRING: IndustryWiring[] = [
  {
    slug: 'healthcare',
    heroImageVimeoId: '929602809', // Chemed JMN App 2023
    galleryVimeoIds: ['929602809', '906114513', '856449144'], // Chemed JMN App / Link Homecare New Employee Film / Priority Healthcare
  },
  {
    slug: 'travel',
    heroVideoVimeoUrl: '928188366', // Envision Recap - Costa Rica 2024
    heroImageVimeoId: '928188366',
    galleryVimeoIds: ['932028681', '1011451800', '1163043374'], // Envision Festival 2024 Recap / TNR Promo Kenya / First Flight NYC
  },
  {
    slug: 'products',
    heroImageVimeoId: '929671839', // EIR NYC - Cream
    galleryVimeoIds: ['929671891', '929671939', '862075818'], // EIR NYC Earrings / Necklaces / Alo Moves Commercial
  },
  {
    slug: 'athletics',
    heroVideoVimeoUrl: '862067416', // Gotham Rugby
    heroImageVimeoId: '862067416',
    galleryVimeoIds: ['863822136', '1198897231', '1198896524'], // Camp Slapshots / HANC Color War / HANC Acceptance 2024
  },
  {
    slug: 'corporate',
    heroVideoVimeoUrl: '936453597', // MPower Event Recap PC-19
    heroImageVimeoId: '936451661', // MPower Recruiter Video
    galleryVimeoIds: ['1187767005'], // Wavecare Landing Video
  },
  {
    slug: 'organizations',
    heroImageVimeoId: '1174431950', // Gateways 2026 POV commercial
    galleryVimeoIds: ['1059344629', '1105627835', '1142588998'], // Gateways 2023 Teaser / TJC Campaign / Aliya Promo 2026
  },
  {
    slug: 'ai',
    heroVideoVimeoUrl: '963219647', // Anochi Workshops - VFX Commercial
    heroImageVimeoId: '963219647',
    galleryVimeoIds: ['963219647', '929602809'], // Anochi VFX Commercial / Chemed VFX-adjacent app build
  },
  {
    slug: 'education',
    galleryVimeoIds: ['1198897231'], // HANC Color War 2023 (real HANC campus-life footage on hand; no dedicated campus-tour cut exists yet)
  },
  {
    slug: 'real-estate',
    galleryVimeoIds: ['1049438739'], // The Brownstone Tour -- the one Real Estate slot with a clean Vimeo ID; Offerman House / Good Choice Realty are Dropbox-only, handled separately
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== WIRE_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const results: Record<string, unknown>[] = []

  // 3 globals (site-settings, final-cta, schedule-a-call-page) were stuck
  // on _status:'draft' with no published version at all -- same class of
  // bug as the drafts/versions migration's _status incident, just missed
  // the first sweep since these three weren't in that fix's table list.
  // Also updates final-cta's button per the explicit content change:
  // "Get Started" -> "View Full Portfolio", pointing at /portfolio instead
  // of /contact (the Portfolio-carousel section's own duplicate button
  // was removed in the same commit, so this is now the one place that link
  // lives on the homepage).
  if (searchParams.get('fixGlobals') === '1') {
    for (const slug of ['site-settings', 'schedule-a-call-page'] as const) {
      try {
        await payload.updateGlobal({ slug, data: { _status: 'published' } as any })
        results.push({ slug, ok: true, applied: ['_status'] })
      } catch (e) {
        results.push({ slug, ok: false, error: e instanceof Error ? e.message : String(e) })
      }
    }
    try {
      await payload.updateGlobal({
        slug: 'final-cta',
        data: { buttonLabel: 'View Full Portfolio', buttonHref: '/portfolio', _status: 'published' } as any,
      })
      results.push({ slug: 'final-cta', ok: true, applied: ['buttonLabel', 'buttonHref', '_status'] })
    } catch (e) {
      results.push({ slug: 'final-cta', ok: false, error: e instanceof Error ? e.message : String(e) })
    }
    return NextResponse.json({ results })
  }

  // Real Estate is the one industry with no clean Vimeo match for its
  // hero + first 2 gallery slots -- Offerman House and Good Choice Realty
  // only exist as real Dropbox footage. Downloads all 3 server-side
  // (55-265MB) and wires hero + gallery[0..1]; gallery[2] (The Brownstone,
  // via Vimeo 1049438739) was already set by the industries wiring above.
  if (searchParams.get('realEstateVideos') === '1') {
    const FILES: Record<string, { url: string; filename: string; mimetype: string }> = {
      offerman: {
        url: 'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/AFsuRwIseEZsx-_IcT4in8o/03%20Portfolio/Real%20Estate/offerman_house_-_brooklyn%2C_ny%20%281080p%29.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1',
        filename: 'real-estate-offerman-house.mp4',
        mimetype: 'video/mp4',
      },
      glamour: {
        url: 'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/AD-YzL555ONmUvWXAQxc2KY/03%20Portfolio/Real%20Estate/4a%20Glamour%20Tour%20-%20Good%20Choice%20Realty.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1',
        filename: 'real-estate-good-choice-glamour.mp4',
        mimetype: 'video/mp4',
      },
      walkthrough: {
        url: 'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/ANFifUlMBRF4siZ8YyGaXQE/03%20Portfolio/Real%20Estate/2%20Walkthrough%20Tour%20-%20Good%20Choice%20Realty.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1',
        filename: 'real-estate-good-choice-walkthrough.mp4',
        mimetype: 'video/mp4',
      },
    }
    const which = searchParams.get('file') // process one at a time -- the 265MB walkthrough alone can eat the whole time budget
    const toProcess = which ? { [which]: FILES[which] } : FILES
    const reResults: Record<string, unknown>[] = []
    let heroMediaId: number | null = null
    let glamourMediaId: number | null = null
    let walkthroughMediaId: number | null = null

    for (const [key, file] of Object.entries(toProcess)) {
      if (!file) continue
      const alt = `Real Estate -- ${key}`
      const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
      let mediaId: number
      if (existing.totalDocs > 0) {
        mediaId = existing.docs[0]!.id as number
      } else {
        const res = await fetch(file.url)
        if (!res.ok) {
          reResults.push({ key, ok: false, error: `dropbox fetch failed: ${res.status}` })
          continue
        }
        const buf = Buffer.from(await res.arrayBuffer())
        const doc = await payload.create({
          collection: 'media',
          data: { alt },
          file: { data: buf, mimetype: file.mimetype, name: file.filename, size: buf.length },
        })
        mediaId = doc.id as number
      }
      if (key === 'offerman') heroMediaId = mediaId
      if (key === 'glamour') glamourMediaId = mediaId
      if (key === 'walkthrough') walkthroughMediaId = mediaId
      reResults.push({ key, ok: true, mediaId })
    }

    const reFound = await payload.find({ collection: 'industries', where: { slug: { equals: 'real-estate' } }, limit: 1, depth: 0 })
    if (reFound.totalDocs > 0) {
      const doc = reFound.docs[0]!
      // Earlier wiring already put The Brownstone (Vimeo 1049438739) as
      // the one existing gallery entry -- preserve it as slot 3 rather
      // than clobbering it when inserting these two ahead of it.
      const brownstone = ((doc as any).gallery ?? [])[0]
      const gallery: { image: number }[] = []
      if (glamourMediaId) gallery.push({ image: glamourMediaId })
      if (walkthroughMediaId) gallery.push({ image: walkthroughMediaId })
      if (brownstone) gallery.push(brownstone)
      const data: Record<string, unknown> = { _status: 'published' }
      if (heroMediaId) data.heroVideo = heroMediaId
      if (gallery.length) data.gallery = gallery
      await payload.update({ collection: 'industries', id: doc.id, data })
    }

    return NextResponse.json({ results: reResults })
  }

  // Client-requested revert: the 8 extra portfolio-projects added by
  // addPortfolioVariety (below), plus splitting Selected Work from
  // "A Gallery of Impact" onto different subsets, broke card sizing --
  // the new entries' longer/shorter copy and metrics values threw off
  // the grid's row heights next to the original 8. Reverting to exactly
  // the original 8 (page.tsx's homepage/hub split was reverted in code
  // separately); real, non-repetitive media across those 8 stays as
  // already fixed earlier this session.
  if (searchParams.get('removePortfolioVariety') === '1') {
    const companies = ['Camp Slapshots', 'Waterview Nursing & Rehabilitation', 'Envision Festival', 'Censible', 'Neil Kerman', 'The Next Ride', 'HANC', 'Priority Healthcare']
    const results: Record<string, any> = {}
    for (const company of companies) {
      const found = await payload.find({ collection: 'portfolio-projects', where: { company: { equals: company } }, limit: 1 })
      if (found.totalDocs === 0) { results[company] = { skipped: 'not found' }; continue }
      await payload.delete({ collection: 'portfolio-projects', id: found.docs[0]!.id })
      results[company] = { ok: true, deleted: found.docs[0]!.id }
    }
    return NextResponse.json({ ok: true, results })
  }

  // Selected Work (homepage) and "A Gallery of Impact" (/portfolio hub)
  // both render off the exact same 8-doc portfolio-projects collection,
  // via the same getNormalizedPortfolioProjects() call -- so the two
  // sections were structurally guaranteed to always show identical
  // content, never different. Adds 8 more real, distinct client projects
  // (real Vimeo footage, none reused from these same 8 slots elsewhere on
  // the site) so there's a real pool to split between the two placements.
  // order controls display sequence (collection is already sorted by it).
  if (searchParams.get('addPortfolioVariety') === '1') {
    type NewProject = {
      title: string; category: string; company: string; copy: string
      metrics: { label: string; value: string }[]; vimeoId: string; order: number
    }
    const newProjects: NewProject[] = [
      { title: 'Pump Up Promo', category: 'Social', company: 'Camp Slapshots', copy: 'A high-energy promo built for a young audience, pairing real sports footage with visual effects for extra punch.', metrics: [{ label: 'Category', value: 'Athletics' }, { label: 'Format', value: 'Promo' }], vimeoId: '863822136', order: 9 },
      { title: 'A Place That Feels Like Home', category: 'Documentary', company: 'Waterview Nursing & Rehabilitation', copy: 'A facility film built to earn trust before a family ever visits in person.', metrics: [{ label: 'Category', value: 'Healthcare' }, { label: 'Format', value: 'Facility Film' }], vimeoId: '1183669641', order: 10 },
      { title: 'Festival Recap, Fast', category: 'Event', company: 'Envision Festival', copy: 'Multi-day festival coverage in Costa Rica, turned around fast enough to still ride the post-event wave.', metrics: [{ label: 'Category', value: 'Travel' }, { label: 'Format', value: 'Recap Film' }], vimeoId: '932028681', order: 11 },
      { title: 'Who We Are', category: 'Brand', company: 'Censible', copy: 'A virtual-tour marketing commercial built to make a construction-tech platform feel as modern as its product.', metrics: [{ label: 'Category', value: 'Corporate' }, { label: 'Format', value: 'Commercial' }], vimeoId: '630102974', order: 12 },
      { title: 'BiTac', category: 'Commercial', company: 'Neil Kerman', copy: "A product commercial built around a single named client's own brand.", metrics: [{ label: 'Category', value: 'Products' }, { label: 'Format', value: 'Commercial' }], vimeoId: '521163963', order: 13 },
      { title: 'Africa Aftermovie', category: 'Documentary', company: 'The Next Ride', copy: 'A 15-minute aftermovie from a multi-day African expedition — long-form documentary work, not a highlight reel.', metrics: [{ label: 'Category', value: 'Travel' }, { label: 'Format', value: 'Documentary' }], vimeoId: '1079646173', order: 14 },
      { title: 'Acceptance Day', category: 'Documentary', company: 'HANC', copy: 'Real school-life storytelling — acceptance day coverage, not stock campus footage.', metrics: [{ label: 'Category', value: 'Education' }, { label: 'Format', value: 'Event Film' }], vimeoId: '1198896524', order: 15 },
      { title: 'Administrator Appreciation', category: 'Documentary', company: 'Priority Healthcare', copy: 'A 60-second appreciation film built around the people who keep a healthcare practice running.', metrics: [{ label: 'Category', value: 'Healthcare' }, { label: 'Format', value: 'Documentary' }], vimeoId: '856449144', order: 16 },
    ]

    const results: Record<string, any> = {}
    for (const p of newProjects) {
      const existing = await payload.find({ collection: 'portfolio-projects', where: { company: { equals: p.company } }, limit: 1 })
      if (existing.totalDocs > 0) { results[p.company] = { skipped: 'already exists' }; continue }
      const posterId = await uploadVimeoThumbnail(payload, p.vimeoId, `Portfolio project poster -- ${p.company}`)
      if (!posterId) { results[p.company] = { error: 'thumbnail fetch failed' }; continue }
      const doc = await payload.create({
        collection: 'portfolio-projects',
        data: {
          title: p.title, category: p.category, company: p.company, copy: p.copy,
          metrics: p.metrics, poster: posterId, videoVimeoUrl: p.vimeoId, order: p.order,
          _status: 'published',
        } as any,
      })
      results[p.company] = { ok: true, id: doc.id, posterId }
    }
    return NextResponse.json({ ok: true, results })
  }

  // Client-requested revert: restore the exact original service-card and
  // portfolio-wheel (heroImage) images from src/lib/industries.ts -- the
  // AI-generated/Unsplash stock set that predates this session's Vimeo
  // sourcing pass. Every path below is copied verbatim from that file.
  // Local /images/*.webp paths are self-fetched over this deployment's
  // own origin (same pattern as every other public/ asset uploaded this
  // session); the 4 Unsplash URLs fetch directly. Each unique image is
  // uploaded once and reused across every field that originally pointed
  // at it (e.g. ind_ath_hero.webp backs both Athletics' heroImage and
  // its "Live Event Capture" card, exactly as industries.ts has it).
  if (searchParams.get('revertToStockImages') === '1') {
    const origin = new URL(req.url).origin
    const cache: Record<string, number> = {}
    const uploadOnce = async (pathOrUrl: string): Promise<number | null> => {
      if (cache[pathOrUrl]) return cache[pathOrUrl]
      const alt = `stock revert -- ${pathOrUrl}`
      const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
      if (existing.totalDocs > 0) { cache[pathOrUrl] = existing.docs[0]!.id as number; return cache[pathOrUrl] }
      const isLocal = pathOrUrl.startsWith('/')
      const url = isLocal ? `${origin}${pathOrUrl}` : pathOrUrl
      const res = await fetch(url)
      if (!res.ok) return null
      const buf = Buffer.from(await res.arrayBuffer())
      const mimetype = isLocal ? 'image/webp' : (res.headers.get('content-type') || 'image/jpeg')
      const filename = isLocal ? pathOrUrl.split('/').pop()! : `unsplash-${pathOrUrl.match(/photo-([a-z0-9]+)/)?.[1] ?? Date.now()}.jpg`
      const doc = await payload.create({ collection: 'media', data: { alt }, file: { data: buf, mimetype, name: filename, size: buf.length } })
      cache[pathOrUrl] = doc.id as number
      return cache[pathOrUrl]
    }

    const heroImages: Record<string, string> = {
      ai: '/images/ai_hero_anim.webp',
      athletics: '/images/ind_ath_hero.webp',
      travel: '/images/ind_travel_hero.webp',
      'real-estate': '/images/ind_realestate_hero.webp',
      healthcare: '/images/ind_health_hero.webp',
      products: '/images/ind_products_hero.webp',
      corporate: '/images/ind_corporate_hero.webp',
      organizations: '/images/ind_orgs_hero.webp',
      education: '/images/ind_corporate_hero.webp', // verbatim from industries.ts -- shares Corporate's image there too
    }
    const serviceCardImages: Record<string, Record<string, string>> = {
      ai: {
        'AI-Accelerated Explainers': '/images/ai_anim_svc_explainer.webp',
        'Product & CGI': '/images/ai_anim_svc_cgi.webp',
        'Motion Branding': '/images/ai_anim_svc_branding.webp',
        'Character Work': '/images/ai_anim_svc_character.webp',
        'Social Loops': '/images/ai_anim_svc_social.webp',
      },
      athletics: {
        'Hype Reels': '/images/ind_ath_gal1.webp',
        'Athlete Feature Films': '/images/ind_ath_gal2.webp',
        'Product Launch Content': '/images/ind_ath_gal3.webp',
        'Live Event Capture': '/images/ind_ath_hero.webp',
      },
      travel: {
        'Destination Films': '/images/ind_travel_gal1.webp',
        'Aerial Cinematography': '/images/ind_travel_gal2.webp',
        'Property Showcases': '/images/ind_travel_gal3.webp',
        'Hospitality Brand Content': '/images/ind_travel_hero.webp',
      },
      'real-estate': {
        'Cinematic Property Tours': '/images/ind_realestate_gal1.webp',
        'Development Timelapses': '/images/ind_realestate_gal2.webp',
        'Aerial Drone Cinematography': '/images/ind_realestate_gal3.webp',
        'Agent & Brokerage Brand Films': '/images/ind_realestate_hero.webp',
      },
      products: {
        'Macro Product Spotlights': '/images/ind_products_hero.webp',
        'E-Commerce Ad Cuts': '/images/ind_products_gal1.webp',
        'Signature Color Grading': '/images/portfolio-social.webp',
        'Platform-Native Spotlights': 'https://images.unsplash.com/photo-1603219225728-0c9e319d2373?q=80&w=1200',
      },
      corporate: {
        'Brand & Culture Films': '/images/ind_corporate_hero.webp',
        'Executive Communications': '/images/portfolio-production.webp',
        'Internal Comms Video': 'https://images.unsplash.com/photo-1611149974482-764b0c2a211a?q=80&w=1200',
        'Investor & Recruiting Content': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
      },
      organizations: {
        'Mission & Impact Films': 'https://images.unsplash.com/photo-1461532257246-777de18cd58b?q=80&w=1200',
        'Donor & Fundraising Content': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200',
        'Volunteer Recruitment Films': '/images/ind_health_gal3.webp',
        'Annual Report Video': '/images/ind_orgs_hero.webp',
      },
      education: {
        'Course & Program Trailers': '/images/mediavoid_creative_bright.webp',
        'Campus Tour Films': '/images/ind_corporate_hero.webp',
        'Faculty & Student Spotlights': '/images/portfolio-social.webp',
        'E-Learning & Course Content': '/images/mediavoid_tech_bright.webp',
      },
    }

    const results: Record<string, any> = {}
    for (const [slug, path] of Object.entries(heroImages)) {
      const id = await uploadOnce(path)
      if (!id) { results[`${slug}.heroImage`] = { error: 'upload failed', path }; continue }
      const found = await payload.find({ collection: 'industries', where: { slug: { equals: slug } }, limit: 1 })
      if (found.totalDocs === 0) { results[`${slug}.heroImage`] = { error: 'industry not found' }; continue }
      await payload.update({ collection: 'industries', id: found.docs[0]!.id, data: { heroImage: id, _status: 'published' } as any })
      results[`${slug}.heroImage`] = { ok: true, id }
    }
    for (const [slug, cards] of Object.entries(serviceCardImages)) {
      const found = await payload.find({ collection: 'industries', where: { slug: { equals: slug } }, limit: 1 })
      if (found.totalDocs === 0) { results[`${slug}.serviceCards`] = { error: 'industry not found' }; continue }
      const doc = found.docs[0] as any
      const existingCards = (doc.serviceCards ?? []) as any[]
      for (const [title, path] of Object.entries(cards)) {
        const id = await uploadOnce(path)
        if (!id) { results[`${slug}.${title}`] = { error: 'upload failed', path }; continue }
        const card = existingCards.find((c) => c.title === title)
        if (card) { card.image = id; results[`${slug}.${title}`] = { ok: true, id } }
        else results[`${slug}.${title}`] = { error: 'card not found' }
      }
      await payload.update({ collection: 'industries', id: doc.id, data: { serviceCards: existingCards, _status: 'published' } as any })
    }

    return NextResponse.json({ ok: true, results })
  }

  // Last remaining local-file video reference anywhere on the site with
  // no real override: Sleepy Hollow Hotel's portfolio-projects.video
  // still points at the dead pre-session placeholder (hero-3.mp4) --
  // already confirmed twice this session that no real Vimeo/Dropbox
  // footage exists for this one specifically (poster already fixed).
  // Clears the field outright rather than leaving a known-dead reference
  // set: SmartVideo falls back to the poster-only <img> path when no
  // video/vimeo is set at all, which is honest about what's actually
  // available instead of pointing at a placeholder.
  if (searchParams.get('clearDeadVideoRefs') === '1') {
    const found = await payload.find({ collection: 'portfolio-projects', where: { company: { equals: 'Sleepy Hollow Hotel' } }, limit: 1 })
    if (found.totalDocs === 0) return NextResponse.json({ ok: false, error: 'doc not found' })
    await payload.update({
      collection: 'portfolio-projects',
      id: found.docs[0]!.id,
      data: { video: null, _status: 'published' } as any,
    })
    return NextResponse.json({ ok: true, cleared: 'Sleepy Hollow Hotel.video' })
  }

  // A repetition audit (every Vimeo ID currently referenced site-wide,
  // deduped by the vimeo-<id>-thumb filename pattern) found real
  // cross-industry contamination, not just heavy reuse of one clip:
  // Athletics' gallery and one service card were pulling Education's HANC
  // videos (HANC Acceptance 2024 / HANC Color War), and Education itself
  // used the same single video in 3 different slots. Both get fresh,
  // previously-unused real footage from the Vimeo library instead.
  if (searchParams.get('dedupeMedia') === '1') {
    const results: Record<string, any> = {}

    const athleticsFixes: Array<{ field: 'gallery1' | 'gallery2' | 'card'; cardTitle?: string; vimeoId: string; alt: string }> = [
      { field: 'gallery1', vimeoId: '588692923', alt: 'athletics gallery -- KOC Arizona Marathon Highlights 2018' },
      { field: 'gallery2', vimeoId: '588690944', alt: 'athletics gallery -- Kids of Courage 2019 Miami Marathon' },
      { field: 'card', cardTitle: 'Athlete Feature Films', vimeoId: '588692923', alt: 'serviceCard poster -- athletics -- Athlete Feature Films (v2)' },
    ]
    const athleticsFound = await payload.find({ collection: 'industries', where: { slug: { equals: 'athletics' } }, limit: 1 })
    if (athleticsFound.totalDocs > 0) {
      const doc = athleticsFound.docs[0] as any
      const gallery = (doc.gallery ?? []) as any[]
      const cards = (doc.serviceCards ?? []) as any[]
      for (const f of athleticsFixes) {
        const posterId = await uploadVimeoThumbnail(payload, f.vimeoId, f.alt)
        if (!posterId) { results[`athletics.${f.field}`] = { error: 'thumbnail fetch failed' }; continue }
        if (f.field === 'gallery1' && gallery[1]) gallery[1].image = posterId
        if (f.field === 'gallery2' && gallery[2]) gallery[2].image = posterId
        if (f.field === 'card') {
          const card = cards.find((c) => c.title === f.cardTitle)
          if (card) card.image = posterId
        }
        results[`athletics.${f.field}`] = { ok: true, posterId }
      }
      await payload.update({ collection: 'industries', id: doc.id, data: { gallery, serviceCards: cards, _status: 'published' } as any })
    }

    const eduFound = await payload.find({ collection: 'industries', where: { slug: { equals: 'education' } }, limit: 1 })
    if (eduFound.totalDocs > 0) {
      const doc = eduFound.docs[0] as any
      const cards = (doc.serviceCards ?? []) as any[]
      const posterId = await uploadVimeoThumbnail(payload, '486871052', 'serviceCard poster -- education -- Campus Tour Films (v2)')
      if (posterId) {
        const card = cards.find((c) => c.title === 'Campus Tour Films')
        if (card) card.image = posterId
        await payload.update({ collection: 'industries', id: doc.id, data: { serviceCards: cards, _status: 'published' } as any })
        results['education.card'] = { ok: true, posterId }
      } else {
        results['education.card'] = { error: 'thumbnail fetch failed' }
      }
    }

    return NextResponse.json({ ok: true, results })
  }

  // src/lib/industries.ts (the static fallback file, used only when an
  // industry has no DB doc at all) turns out to have a FULLER serviceCards
  // set than most industries' actual live DB docs -- the DB migration
  // dropped 1-3 cards per industry somewhere along the way. This is real,
  // already-written service-description copy (what Slate offers, not a
  // claim about a specific client's results), just never made it into the
  // CMS. Restores the missing cards verbatim from that file and gives
  // each a real Vimeo-thumbnail image instead of the local placeholder
  // path the static file itself uses. Cards that already exist in the DB
  // are left untouched -- this only appends what's missing.
  if (searchParams.get('restoreServiceCards') === '1') {
    type NewCard = {
      title: string
      description: string
      outcome: string
      deliverables: string[]
      meta: string
      vimeoId: string
    }
    const restorations: Record<string, NewCard[]> = {
      athletics: [
        {
          title: 'Live Event Capture',
          description: "Multi-camera coverage of competitions, tournaments and activations, turned around fast enough to still matter -- our Gotham Rugby coverage at Randall's Island, NYC, was built exactly this way.",
          outcome: 'Same-week delivery',
          deliverables: ['Multi-cam crew on-site', 'Same-week edit turnaround', 'Recap + social clips'],
          meta: 'Event day · 1-2 wk turnaround',
          vimeoId: '862067416', // Gotham Rugby
        },
      ],
      travel: [
        {
          title: 'Hospitality Brand Content',
          description: 'Ongoing content built around a property or destination brand -- social-native, always on-brand.',
          outcome: 'Always-on content',
          deliverables: ['Content shoot day', 'Batch social cutdowns', 'Brand-consistent grade'],
          meta: 'Batch · 4-6 wks',
          vimeoId: '932028681', // Envision Festival 2024 Recap
        },
      ],
      'real-estate': [
        {
          title: 'Agent & Brokerage Brand Films',
          description: "A short brand film for an agent or brokerage that builds trust before the first phone call.",
          outcome: 'Trust-building brand asset',
          deliverables: ['Interview + lifestyle shoot', 'Brand film edit', 'Social cutdowns'],
          meta: '60-90s · 3-4 wks',
          vimeoId: '501888251', // Good Choice Realty - Glamour Tour
        },
      ],
      education: [
        {
          title: 'Campus Tour Films',
          description: 'A cinematic walk of campus that gives a prospective student a real feel for the place before they ever visit in person.',
          outcome: 'Virtual-visit ready',
          deliverables: ['Campus location shoot', 'Guided-tour style edit', 'Web + admissions cutdowns'],
          meta: '2-4 min · 4-6 wks',
          vimeoId: '1198896524', // HANC Acceptance 2024
        },
      ],
      organizations: [
        {
          title: 'Mission & Impact Films',
          description: "The flagship story film -- who you serve, why it matters, and what a viewer's support actually does.",
          outcome: 'Built to move people to act',
          deliverables: ['Interview + on-location shoot', 'Story-driven edit', 'Event + web cutdowns'],
          meta: '2-4 min · 4-6 wks',
          vimeoId: '553074722', // Gateways Passover Experience 2021 - Highlights
        },
        {
          title: 'Donor & Fundraising Content',
          description: 'Campaign-ready films built around a single, clear ask -- for galas, year-end appeals, or capital campaigns.',
          outcome: 'Campaign-ready asset',
          deliverables: ['Campaign-specific edit', 'Ask-driven CTA cut', 'Social + email cutdowns'],
          meta: '60-90s · 3-4 wks',
          vimeoId: '1142588998', // Aliya Promo 2026
        },
        {
          title: 'Annual Report Video',
          description: 'The numbers-and-narrative recap that turns a written annual report into something a board or donor actually watches.',
          outcome: 'Board & donor-ready',
          deliverables: ['Data-forward edit', 'Leadership interview cutdowns', 'Web-ready master'],
          meta: '2-3 min · 4-5 wks',
          vimeoId: '363484201', // Gateways Cinematic Highlight Reel
        },
      ],
      corporate: [
        {
          title: 'Brand & Culture Films',
          description: 'A film that makes the people inside a company as visible as the product -- shot to make prospects and candidates alike want in.',
          outcome: 'Human-first brand asset',
          deliverables: ['Interview + b-roll shoot', 'Story-driven edit', 'Web + social cutdowns'],
          meta: '2-3 min · 4-6 wks',
          vimeoId: '936451661', // MPower Recruiter Video
        },
        {
          title: 'Internal Comms Video',
          description: 'All-hands updates, policy rollouts and training content built to actually get watched, not just archived.',
          outcome: 'Higher watch-through',
          deliverables: ['Script support', 'Studio shoot', 'Chaptered edit'],
          meta: '1-3 min · 2 wks',
          vimeoId: '936453597', // MPower Event Recap PC-19
        },
        {
          title: 'Investor & Recruiting Content',
          description: 'The film that runs before a pitch or a first interview -- company story, numbers and culture in one confident cut.',
          outcome: 'First-impression asset',
          deliverables: ['Interview + facility shoot', 'Data-forward edit', 'Deck-ready cutdown'],
          meta: '90s-3 min · 3-5 wks',
          vimeoId: '1187767005', // Wavecare Landing Video
        },
      ],
      products: [
        {
          title: 'Macro Product Spotlights',
          description: 'Macro-lit hero shots and turntable sequences that make a product the whole frame -- built for the scroll-stopping first second.',
          outcome: 'Thumb-stopping opens',
          deliverables: ['Macro lighting setup', 'Hero shot sequence', 'Multi-angle coverage', 'Signature grade'],
          meta: '15-30s · 2-3 wks',
          vimeoId: '929671891', // EIR NYC - Earrings
        },
        {
          title: 'Platform-Native Spotlights',
          description: 'The same product, cut natively for every placement -- feed, story, PDP -- instead of one video stretched to fit.',
          outcome: 'One shoot, every placement',
          deliverables: ['Multi-ratio shoot plan', 'Platform-specific cutdowns', 'PDP-ready master'],
          meta: '30-60s · 2-3 wks',
          vimeoId: '929671939', // EIR NYC - Necklaces
        },
      ],
    }

    const results: Record<string, any> = {}
    for (const [slug, cards] of Object.entries(restorations)) {
      const found = await payload.find({ collection: 'industries', where: { slug: { equals: slug } }, limit: 1 })
      if (found.totalDocs === 0) { results[slug] = { error: 'industry not found' }; continue }
      const doc = found.docs[0] as any
      const existing = (doc.serviceCards ?? []) as any[]
      const added: string[] = []
      for (const c of cards) {
        if (existing.some((e) => e.title === c.title)) continue // already restored on a re-run
        const posterId = await uploadVimeoThumbnail(payload, c.vimeoId, `serviceCard poster -- ${slug} -- ${c.title}`)
        existing.push({
          title: c.title,
          description: c.description,
          outcome: c.outcome,
          deliverables: c.deliverables.map((item) => ({ item })),
          meta: c.meta,
          image: posterId,
        })
        added.push(c.title)
      }
      await payload.update({ collection: 'industries', id: doc.id, data: { serviceCards: existing, _status: 'published' } as any })
      results[slug] = { ok: true, added, totalNow: existing.length }
    }
    return NextResponse.json({ ok: true, results })
  }

  // The 5 portfolio-projects docs with no findable footage anywhere
  // (CVM Construction, Real Talk, TruBlue of NW Brooklyn, EKGx, Smash
  // House Burgers -- confirmed again via a name search across the full
  // 281-video Vimeo library and all 49 old-site slugs, zero matches)
  // swapped out entirely for 5 different real, already-verified clients
  // with real Vimeo footage, per client instruction to have every
  // Selected Work slot show real media rather than 5 of 8 staying on the
  // placeholder fallback. Title/category/copy change along with the
  // company name -- keeping the old fabricated-adjacent title on a
  // swapped-in real client's footage would misrepresent whose work it is,
  // the same problem already fixed once for the original invented roster.
  // Metrics below are descriptive (deliverable count, format, category),
  // not performance numbers -- there's no real analytics data behind
  // these jobs to cite, and inventing conversion/reach stats is exactly
  // the fabricated-metrics problem this whole audit started by fixing.
  if (searchParams.get('swapSelectedWork') === '1') {
    type Swap = {
      oldCompany: string
      title: string
      category: string
      company: string
      copy: string
      metrics: { label: string; value: string }[]
      vimeoId: string
    }
    const swaps: Swap[] = [
      {
        oldCompany: 'CVM Construction',
        title: 'The Story Behind the Spirit',
        category: 'Brand',
        company: 'Miami Arak',
        copy: 'A brand film series for a spirits label, built around the people and process behind the drink rather than a straight product shot.',
        metrics: [{ label: 'Deliverables', value: '4' }, { label: 'Format', value: 'Brand Film Series' }],
        vimeoId: '584031043', // Miami Arak - About the Drink
      },
      {
        oldCompany: 'Real Talk',
        title: 'Protecting the Reef',
        category: 'Nonprofit',
        company: 'ARC Reef',
        copy: 'A commercial for Atlantic Reef Conservation, built to make a conservation mission feel as urgent on screen as it is in the water.',
        metrics: [{ label: 'Category', value: 'Conservation' }, { label: 'Format', value: 'Commercial' }],
        vimeoId: '436463495', // ARC Reef Commercial
      },
      {
        oldCompany: 'TruBlue of NW Brooklyn',
        title: 'Built By DCON',
        category: 'Brand',
        company: 'DCON Renovations',
        copy: 'A brand film introducing a renovation company through the crew and process behind the work, not just the finished space.',
        metrics: [{ label: 'Category', value: 'Construction' }, { label: 'Format', value: 'Brand Film' }],
        vimeoId: '723455873', // DCON Renovations - Who We Are
      },
      {
        oldCompany: 'EKGx',
        title: 'Precision in Every Frame',
        category: 'Commercial',
        company: 'Optoma',
        copy: 'A product commercial for a projector brand, shot to sell precision and clarity the way the product itself delivers it.',
        metrics: [{ label: 'Category', value: 'Technology' }, { label: 'Format', value: 'Commercial' }],
        vimeoId: '647488268', // Optoma Commercial
      },
      {
        oldCompany: 'Smash House Burgers',
        title: 'Capital, Reimagined',
        category: 'Commercial',
        company: 'Region Capital',
        copy: 'A commercial for a capital firm, built to make a financial services brand feel as sharp and modern as the markets it operates in.',
        metrics: [{ label: 'Category', value: 'Finance' }, { label: 'Format', value: 'Commercial' }],
        vimeoId: '605213656', // Region Capital Commercial
      },
    ]

    const results: Record<string, any> = {}
    for (const s of swaps) {
      const posterId = await uploadVimeoThumbnail(payload, s.vimeoId, `Selected Work poster -- ${s.company}`)
      if (!posterId) { results[s.oldCompany] = { error: 'thumbnail fetch failed' }; continue }
      const found = await payload.find({ collection: 'portfolio-projects', where: { company: { equals: s.oldCompany } }, limit: 1 })
      if (found.totalDocs === 0) { results[s.oldCompany] = { error: 'doc not found' }; continue }
      await payload.update({
        collection: 'portfolio-projects',
        id: found.docs[0]!.id,
        data: {
          title: s.title,
          category: s.category,
          company: s.company,
          copy: s.copy,
          metrics: s.metrics,
          poster: posterId,
          videoVimeoUrl: s.vimeoId,
          _status: 'published',
        } as any,
      })
      results[s.oldCompany] = { ok: true, newCompany: s.company, posterId }
    }
    return NextResponse.json({ ok: true, results })
  }

  // A full site scan (every page, every S3-hosted media URL, checked for
  // real HTTP status) turned up the rest of what's still dead: all 6
  // journal post covers, Education's heroImage (which was actually
  // pointing at Corporate's old image, not just dead) and missing
  // heroVideoVimeoUrl, 3 more industries missing heroVideoVimeoUrl (their
  // heroImage already got fixed earlier, but the video slot didn't, so it
  // was still falling back to a dead file), Real Estate's heroImage, and
  // one of How It Works' 4 "Behind The Scenes" stills (the other 3 need
  // the Slate Internal/All BTS/ Dropbox folder specifically, which isn't
  // in this session's shared-link scope -- left alone rather than
  // mislabeling unrelated client footage as "Edit Bay"/"Color Suite"/
  // "Sound Stage").
  if (searchParams.get('fixRemainingMedia') === '1') {
    const results: Record<string, any> = {}

    const journalFixes: Array<{ slug: string; vimeoId: string }> = [
      { slug: 'one-shoot-day-month-of-content', vimeoId: '929671839' }, // EIR NYC - Cream
      { slug: 'pre-production-explained', vimeoId: '929642483' }, // BTS - Link Homecare
      { slug: 'how-to-brief-a-video-team', vimeoId: '936451661' }, // MPower Recruiter Video
      { slug: 'storytelling-vs-selling', vimeoId: '906114513' }, // Link Homecare - New Employee Film
      { slug: 'anatomy-of-a-scroll-stopping-ad', vimeoId: '929671988' }, // EIR NYC - Socks
      { slug: 'first-three-seconds', vimeoId: '862075818' }, // Alo Moves Commercial
    ]
    for (const f of journalFixes) {
      const posterId = await uploadVimeoThumbnail(payload, f.vimeoId, `Journal cover -- ${f.slug}`)
      if (!posterId) { results[`journal/${f.slug}`] = { error: 'thumbnail fetch failed' }; continue }
      const found = await payload.find({ collection: 'journal-posts', where: { slug: { equals: f.slug } }, limit: 1 })
      if (found.totalDocs === 0) { results[`journal/${f.slug}`] = { error: 'post not found' }; continue }
      await payload.update({ collection: 'journal-posts', id: found.docs[0]!.id, data: { coverImage: posterId, _status: 'published' } as any })
      results[`journal/${f.slug}`] = { ok: true, posterId }
    }

    const industryFixes: Array<{ slug: string; heroImageVimeoId?: string; heroVideoVimeoUrl?: string }> = [
      { slug: 'education', heroImageVimeoId: '1198896524', heroVideoVimeoUrl: '1198896524' }, // HANC Acceptance 2024 -- was wrongly showing Corporate's old image
      { slug: 'organizations', heroVideoVimeoUrl: '1174431950' }, // matches existing heroImage
      { slug: 'healthcare', heroVideoVimeoUrl: '929602809' }, // matches existing heroImage
      { slug: 'products', heroVideoVimeoUrl: '929671839' }, // matches existing heroImage
      { slug: 'real-estate', heroImageVimeoId: '278155978' }, // Offerman House - Brooklyn, NY
    ]
    for (const f of industryFixes) {
      const found = await payload.find({ collection: 'industries', where: { slug: { equals: f.slug } }, limit: 1 })
      if (found.totalDocs === 0) { results[`industry/${f.slug}`] = { error: 'not found' }; continue }
      const doc = found.docs[0] as any
      const data: any = { _status: 'published' }
      if (f.heroImageVimeoId) {
        const id = await uploadVimeoThumbnail(payload, f.heroImageVimeoId, `${f.slug} heroImage -- Vimeo ${f.heroImageVimeoId}`)
        if (id) data.heroImage = id
      }
      if (f.heroVideoVimeoUrl) data.heroVideoVimeoUrl = f.heroVideoVimeoUrl
      await payload.update({ collection: 'industries', id: doc.id, data })
      results[`industry/${f.slug}`] = { ok: true, ...data }
    }

    const btsPosterId = await uploadVimeoThumbnail(payload, '929642483', 'BTS still -- On Set -- Vimeo 929642483')
    if (btsPosterId) {
      const hiw = await payload.findGlobal({ slug: 'how-it-works-page', depth: 0 })
      const stills = (((hiw as any).behindTheScenes?.stills ?? []) as any[])
      const onSet = stills.find((s) => s.label === 'On Set')
      if (onSet) {
        onSet.image = btsPosterId
        await payload.updateGlobal({ slug: 'how-it-works-page', data: { behindTheScenes: { stills }, _status: 'published' } as any })
        results['bts/On Set'] = { ok: true, posterId: btsPosterId }
      } else {
        results['bts/On Set'] = { error: 'still not found' }
      }
    } else {
      results['bts/On Set'] = { error: 'thumbnail fetch failed' }
    }

    return NextResponse.json({
      ok: true,
      results,
      stillNotFixed: {
        'portfolio-projects posters (5)': 'CVM Construction, Real Talk, TruBlue of NW Brooklyn, EKGx, Smash House Burgers -- no real source in any archive searched',
        'behindTheScenes stills (3 of 4)': 'Edit Bay, Color Suite, Sound Stage -- need Slate Internal/All BTS/ Dropbox folder, outside current share-link scope',
      },
    })
  }

  // Every industry's "What We Make" serviceCards image was still a dead
  // pre-session Blob doc (confirmed: all 20 across the 8 industries that
  // have serviceCards return 403 direct from S3) -- same root cause as
  // every other Blob-suspension fix this session. Healthcare specifically
  // has ZERO serviceCards in the CMS at all (verified directly, not a
  // draft/publish mismatch) -- that's a missing-content gap, not a broken
  // image, and adding cards means writing real description/outcome copy
  // for required fields, which isn't mine to invent (see priority issue
  // #1 upstream: inventing metrics is exactly the problem already fixed
  // once). Left untouched here on purpose; only real, already-existing
  // cards get their image swapped for a real Vimeo thumbnail.
  if (searchParams.get('fixServiceCards') === '1') {
    type Fix = { slug: string; title: string; vimeoId: string }
    const fixes: Fix[] = [
      { slug: 'education', title: 'Course & Program Trailers', vimeoId: '1198896524' }, // HANC Acceptance 2024
      { slug: 'education', title: 'Faculty & Student Spotlights', vimeoId: '486871052' }, // Maayanot STEM Dept
      { slug: 'education', title: 'E-Learning & Course Content', vimeoId: '1198897231' }, // HANC Color War 2023
      { slug: 'organizations', title: 'Volunteer Recruitment Films', vimeoId: '1105627835' }, // TJC Campaign 2025
      { slug: 'corporate', title: 'Executive Communications', vimeoId: '936453597' }, // MPower Event Recap PC-19
      { slug: 'products', title: 'E-Commerce Ad Cuts', vimeoId: '929671988' }, // EIR NYC - Socks
      { slug: 'products', title: 'Signature Color Grading', vimeoId: '862075818' }, // Alo Moves Commercial
      { slug: 'real-estate', title: 'Cinematic Property Tours', vimeoId: '501888251' }, // Good Choice Realty Glamour
      { slug: 'real-estate', title: 'Development Timelapses', vimeoId: '278155978' }, // Offerman House
      { slug: 'real-estate', title: 'Aerial Drone Cinematography', vimeoId: '1065583536' }, // Nyack Ridge banner
      { slug: 'travel', title: 'Destination Films', vimeoId: '928188366' }, // Envision Recap Costa Rica
      { slug: 'travel', title: 'Aerial Cinematography', vimeoId: '1079646173' }, // TNR Africa Aftermovie
      { slug: 'travel', title: 'Property Showcases', vimeoId: '1163043374' }, // First Flight NYC
      { slug: 'athletics', title: 'Hype Reels', vimeoId: '863822136' }, // Camp Slapshots Pump Up Promo
      { slug: 'athletics', title: 'Athlete Feature Films', vimeoId: '1198896524' }, // HANC Acceptance 2024
      { slug: 'athletics', title: 'Product Launch Content', vimeoId: '588692725' }, // KOC Miami Marathon 2020
      { slug: 'ai', title: 'AI-Accelerated Explainers', vimeoId: '963219647' }, // Anochi VFX Commercial
      { slug: 'ai', title: 'Product & CGI', vimeoId: '963220447' }, // Anochi Journey to Anochi
      { slug: 'ai', title: 'Motion Branding', vimeoId: '963221744' }, // Anochi Being Accountable
      { slug: 'ai', title: 'Character Work', vimeoId: '963223558' }, // Anochi Breathwork
      { slug: 'ai', title: 'Social Loops', vimeoId: '963225662' }, // Anochi Coaching Program
    ]

    const results: Record<string, any> = {}
    for (const f of fixes) {
      const key = `${f.slug} / ${f.title}`
      const posterId = await uploadVimeoThumbnail(payload, f.vimeoId, `serviceCard poster -- ${f.slug} -- ${f.title}`)
      if (!posterId) { results[key] = { error: 'thumbnail fetch failed' }; continue }
      const found = await payload.find({ collection: 'industries', where: { slug: { equals: f.slug } }, limit: 1 })
      if (found.totalDocs === 0) { results[key] = { error: 'industry not found' }; continue }
      const doc = found.docs[0] as any
      const cards = (doc.serviceCards ?? []) as any[]
      const card = cards.find((c) => c.title === f.title)
      if (!card) { results[key] = { error: 'card not found' }; continue }
      card.image = posterId
      await payload.update({ collection: 'industries', id: doc.id, data: { serviceCards: cards, _status: 'published' } as any })
      results[key] = { ok: true, posterId }
    }
    return NextResponse.json({ ok: true, results, healthcareSkipped: 'zero serviceCards in CMS -- missing content, not a broken image; needs real copy from the client, not invented' })
  }

  // Flagship logos (Meta/Alo/B&H) and marquee client logos are among the
  // ORIGINAL media docs, whose actual bytes only ever existed in Vercel
  // Blob -- still suspended, still unreachable, so these still 403 even
  // though the doc references themselves are fine. Alo has a real Vimeo
  // match (862075818, "Alo Moves Commercial") per the tracker, so its
  // thumbnail can be re-sourced the same way industries' hero images
  // were -- no Dropbox/Blob needed. Meta and B&H have no Vimeo footage;
  // those still need the Dropbox Logo Videos/Renders folder specifically.
  // checkTrustLogos confirmed the fixTrustLogos docs' S3 objects were
  // never actually written (HeadObject: NotFound for all 8, even with
  // this app's own IAM creds) despite payload.create() returning success
  // with real doc ids -- the s3Storage plugin's own upload silently
  // no-op'd or failed without payload surfacing it. Repairs by writing
  // the bytes directly via a raw S3 PutObjectCommand (same s3 client this
  // route already authenticates with) to the exact key each existing doc
  // already references, rather than touching the DB records again.
  if (searchParams.get('repairTrustLogos') === '1') {
    const origin = new URL(req.url).origin
    const alts = [
      { alt: 'Trust section flagship logo -- Meta', file: 'meta-logo.webp' },
      { alt: 'Trust section flagship logo -- Alo', file: 'alo-logo.webp' },
      { alt: 'Trust section flagship logo -- B&H', file: 'bh-logo.webp' },
      { alt: 'Trust section marquee logo -- Dream', file: 'dream-testimonials.webp' },
      { alt: 'Trust section marquee logo -- Healing Partners', file: 'healing-partners.webp' },
      { alt: 'Trust section marquee logo -- Inhale', file: 'inhale-testimonails.webp' },
      { alt: 'Trust section marquee logo -- Lucida', file: 'lucida-testimonials.webp' },
      { alt: 'Trust section marquee logo -- Workplace Realty', file: 'workplace-realty.webp' },
    ]
    const results: Record<string, any> = {}
    for (const a of alts) {
      const found = await payload.find({ collection: 'media', where: { alt: { equals: a.alt } }, limit: 1 })
      if (found.totalDocs === 0) {
        results[a.alt] = { error: 'no matching media doc' }
        continue
      }
      const doc = found.docs[0] as any
      const key = `slate/${doc.filename}`
      const res = await fetch(`${origin}/images/clients/${a.file}`)
      if (!res.ok) {
        results[a.alt] = { error: `source fetch failed: ${res.status}` }
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buf,
        ContentType: 'image/webp',
      }))
      results[a.alt] = { id: doc.id, key, bytes: buf.length, url: doc.url }
    }
    return NextResponse.json({ ok: true, results })
  }

  // Diagnostic: the fixTrustLogos re-uploads landed real DB media docs
  // (200 from the route, real numeric ids) but their S3 URLs 403 on
  // direct GET -- HeadObject with the app's own IAM creds (bypasses the
  // public bucket policy entirely) to tell "object doesn't exist at that
  // key" apart from "object exists, policy just isn't granting anon
  // reads for it".
  if (searchParams.get('checkTrustLogos') === '1') {
    const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
    const keys = [
      'slate/meta-logo-1.png',
      'slate/bh-logo-1.png',
      'slate/alo-logo-1.png',
      'slate/dream-testimonials-5.webp',
      'slate/healing-partners-1.webp',
      'slate/inhale-testimonails-5.webp',
      'slate/lucida-testimonials-5.webp',
      'slate/workplace-realty-1.webp',
      'slate/vimeo-862075818-thumb-1.jpg', // known-good control
    ]
    const results: Record<string, any> = {}
    for (const key of keys) {
      try {
        const head = await s3.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }))
        results[key] = { exists: true, size: head.ContentLength, contentType: head.ContentType }
      } catch (e: any) {
        results[key] = { exists: false, error: e?.name ?? String(e), message: e?.message }
      }
    }
    return NextResponse.json({ ok: true, results })
  }

  // "Selected Work" (portfolio-projects collection, 8 docs) already got its
  // company-identity fix on 2026-08-12 -- CVM Construction, Real Talk,
  // TruBlue of NW Brooklyn, EKGx, Smash House Burgers, Park Smiles NYC,
  // Sleepy Hollow Hotel, Gateways are all real clients, confirmed live via
  // the API, NOT the fabricated Neon Nights/HyperDrive-style roster an
  // earlier (13 Aug) tracker draft still describes -- that tracker draft
  // predates this fix and was proposing a *different* real-company swap
  // that never got applied because this one landed first. Do NOT overwrite
  // real names with a different real roster; only backfill real posters
  // where a source actually exists for these specific 8 companies.
  // Of the 8: Park Smiles NYC and Gateways have real Vimeo cuts; Sleepy
  // Hollow Hotel has a real photo on the old Wix site but no Vimeo match;
  // the other 5 (CVM Construction, Real Talk, TruBlue, EKGx, Smash House
  // Burgers) postdate the old-site/Vimeo archive entirely -- no real
  // source found anywhere searched, left untouched rather than guessed.
  if (searchParams.get('fixSelectedWork') === '1') {
    const uploadFromUrl = async (url: string, alt: string, mimetype: string, filename: string): Promise<number | null> => {
      const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
      if (existing.totalDocs > 0) return existing.docs[0]!.id as number
      const res = await fetch(url)
      if (!res.ok) return null
      const buf = Buffer.from(await res.arrayBuffer())
      const doc = await payload.create({ collection: 'media', data: { alt }, file: { data: buf, mimetype, name: filename, size: buf.length } })
      return doc.id as number
    }

    const results: Record<string, any> = {}

    const parkSmilesPoster = await uploadVimeoThumbnail(payload, '949325387', 'Selected Work poster -- Park Smiles NYC')
    const gatewaysPoster = await uploadVimeoThumbnail(payload, '1174431950', 'Selected Work poster -- Gateways')
    const sleepyHollowPoster = await uploadFromUrl(
      'https://static.wixstatic.com/media/8a48ae_03c1558276bb482b99197cdcb54197f1~mv2.jpg',
      'Selected Work poster -- Sleepy Hollow Hotel',
      'image/jpeg',
      'sleepy-hollow-hotel.jpg',
    )

    const updates: Array<{ company: string; poster: number | null }> = [
      { company: 'Park Smiles NYC', poster: parkSmilesPoster },
      { company: 'Gateways', poster: gatewaysPoster },
      { company: 'Sleepy Hollow Hotel', poster: sleepyHollowPoster },
    ]

    for (const u of updates) {
      if (!u.poster) { results[u.company] = { error: 'upload failed' }; continue }
      const found = await payload.find({ collection: 'portfolio-projects', where: { company: { equals: u.company } }, limit: 1 })
      if (found.totalDocs === 0) { results[u.company] = { error: 'no matching portfolio-projects doc' }; continue }
      await payload.update({
        collection: 'portfolio-projects',
        id: found.docs[0]!.id,
        data: { poster: u.poster, _status: 'published' } as any,
      })
      results[u.company] = { ok: true, posterId: u.poster }
    }

    return NextResponse.json({ ok: true, results, skipped: ['CVM Construction', 'Real Talk', 'TruBlue of NW Brooklyn', 'EKGx', 'Smash House Burgers'], skippedReason: 'no real source found in Vimeo/Dropbox/old-site archive' })
  }

  if (searchParams.get('fixFlagshipLogos') === '1') {
    const id = await uploadVimeoThumbnail(payload, '862075818', 'Alo flagship logo -- Vimeo 862075818')
    if (!id) return NextResponse.json({ ok: false, error: 'thumbnail fetch failed' })
    const doc = await payload.findGlobal({ slug: 'home-page', depth: 0 })
    const logos = ((doc as any).trustSection?.flagshipLogos ?? []) as any[]
    const alo = logos.find((l) => l.name === 'Alo')
    if (alo) alo.logo = id
    await payload.updateGlobal({
      slug: 'home-page',
      data: { trustSection: { flagshipLogos: logos }, _status: 'published' } as any,
    })
    return NextResponse.json({ ok: true, mediaId: id, updated: 'Alo' })
  }

  // The real fix for the trust section: TrustSection.tsx's own fallback
  // arrays already point at genuine client-provided logo files sitting in
  // this repo's public/ folder (public/images/clients/*.webp -- committed
  // 2026-07-24, "Wire in real brand assets"), but that fallback only
  // fires when home-page.trustSection.flagshipLogos/marqueeClients is
  // EMPTY. It isn't empty -- it's populated with references to media docs
  // whose bytes only ever lived in the now-suspended Vercel Blob store, so
  // every logo 403s. Re-upload those same exact public/ files (self-fetch
  // over this deployment's own origin -- no Dropbox/Vimeo dependency at
  // all, S3 is healthy) into fresh media docs and point the CMS arrays at
  // those instead. fixFlagshipLogos (above) only ever fixed Alo via a
  // Vimeo thumbnail as a stopgap before this file's real source was found;
  // this supersedes it for all 8 marks including Meta, which has no Vimeo
  // footage and was the one logo that mode couldn't touch.
  if (searchParams.get('fixTrustLogos') === '1') {
    const origin = new URL(req.url).origin
    const uploadPublicAsset = async (file: string, alt: string): Promise<number> => {
      const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
      if (existing.totalDocs > 0) return existing.docs[0]!.id as number
      const res = await fetch(`${origin}/images/clients/${file}`)
      if (!res.ok) throw new Error(`fetch ${file} failed: ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data: buf, mimetype: 'image/webp', name: file, size: buf.length },
      })
      return doc.id as number
    }

    const flagshipFiles: Array<{ name: string; file: string }> = [
      { name: 'Meta', file: 'meta-logo.webp' },
      { name: 'Alo', file: 'alo-logo.webp' },
      { name: 'B&H', file: 'bh-logo.webp' },
    ]
    const clientFiles: Array<{ name: string; file: string }> = [
      { name: 'Dream', file: 'dream-testimonials.webp' },
      { name: 'Healing Partners', file: 'healing-partners.webp' },
      { name: 'Inhale', file: 'inhale-testimonails.webp' },
      { name: 'Lucida', file: 'lucida-testimonials.webp' },
      { name: 'Workplace Realty', file: 'workplace-realty.webp' },
    ]

    const flagshipLogos = []
    for (const f of flagshipFiles) {
      const id = await uploadPublicAsset(f.file, `Trust section flagship logo -- ${f.name}`)
      flagshipLogos.push({ name: f.name, logo: id })
    }
    const marqueeClients = []
    for (const c of clientFiles) {
      const id = await uploadPublicAsset(c.file, `Trust section marquee logo -- ${c.name}`)
      marqueeClients.push({ name: c.name, logo: id })
    }

    await payload.updateGlobal({
      slug: 'home-page',
      data: { trustSection: { flagshipLogos, marqueeClients }, _status: 'published' } as any,
    })
    return NextResponse.json({ ok: true, flagshipLogos, marqueeClients })
  }

  // statsBand's Google-rating stat had the whole "★ / 44 Reviews" string
  // crammed into `suffix`, which StatsBand renders at the same giant
  // font-size as the number itself (fine for a short "+"/"wk" suffix,
  // not for a compound phrase) -- that's the 3-line wrap/oversized-text
  // bug. Move the review count into `label` (rendered as the small mono
  // caption every other stat already uses it for) and shorten suffix to
  // just the star, matching the other 3 stats' shape.
  if (searchParams.get('fixStatsBand') === '1') {
    const doc = await payload.findGlobal({ slug: 'how-it-works-page', depth: 0 })
    const statsBand = ((doc as any).statsBand ?? []) as any[]
    const rating = statsBand.find((s) => s.label === 'Google Rating')
    if (rating) {
      rating.suffix = '.0★'
      rating.label = '44 Google Reviews'
    }
    await payload.updateGlobal({ slug: 'how-it-works-page', data: { statsBand, _status: 'published' } as any })
    return NextResponse.json({ ok: true, statsBand })
  }

  // The How It Works page's own "Watch it move through every phase"
  // scrollytelling section (processWalkthrough.phases) is a SEPARATE
  // field from pipeline.categories -- same 4 phases conceptually, but
  // its own copy of the video relation, so wiring Pipeline above doesn't
  // touch it. Reuses the same 4 uploads instead of re-downloading.
  if (searchParams.get('processWalkthroughVideos') === '1') {
    const mediaByAlt: Record<string, number> = {}
    for (const categoryId of ['pre-production', 'production', 'post-production', 'distribution']) {
      const found = await payload.find({ collection: 'media', where: { alt: { equals: `Pipeline -- ${categoryId}` } }, limit: 1 })
      if (found.totalDocs > 0) mediaByAlt[categoryId] = found.docs[0]!.id as number
    }
    const howItWorksDoc = await payload.findGlobal({ slug: 'how-it-works-page', depth: 0 })
    const phases = ((howItWorksDoc as any).processWalkthrough?.phases ?? []) as any[]
    const order = ['pre-production', 'production', 'post-production', 'distribution']
    const pwResults: Record<string, unknown>[] = []
    phases.forEach((p, i) => {
      const categoryId = order[i]
      if (categoryId && mediaByAlt[categoryId]) {
        p.video = mediaByAlt[categoryId]
        pwResults.push({ index: i, categoryId, mediaId: mediaByAlt[categoryId], ok: true })
      }
    })
    await payload.updateGlobal({
      slug: 'how-it-works-page',
      data: { processWalkthrough: { phases }, _status: 'published' } as any,
    })
    return NextResponse.json({ results: pwResults })
  }

  // Downloads all 4 real Production Pipeline phase videos from Dropbox
  // server-side (small files, 5-27MB each -- no batching needed) and
  // wires each into its matching pipeline category by categoryId. These
  // are Slate's own internal "how we work" cuts; no Vimeo ID exists for
  // them (confirmed against the full tracker + Appendix A list), so this
  // is the one set of home-page videos that has to come from Dropbox.
  if (searchParams.get('pipelineVideos') === '1') {
    const PIPELINE_FILES: Record<string, { url: string; filename: string }> = {
      'pre-production': {
        url: 'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/AFmtQDRV_LSzrZcyXMxQFik/01%20Home%20Page/02%20Pipeline%20%28How%20It%20Works%29/2%20Pre-Production%20Video.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1',
        filename: 'pipeline-pre-production.mp4',
      },
      production: {
        url: 'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/AEDzXP-meGa97kdy0bK_yx0/01%20Home%20Page/02%20Pipeline%20%28How%20It%20Works%29/2%20Production%20Video.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1',
        filename: 'pipeline-production.mp4',
      },
      'post-production': {
        url: 'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/ADDOlE3xONwj2gWY1vZ27Lg/01%20Home%20Page/02%20Pipeline%20%28How%20It%20Works%29/4%20Post-Production%20Video.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1',
        filename: 'pipeline-post-production.mp4',
      },
      distribution: {
        url: 'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/AJBOkoDYCAtuM5raur3iHuI/01%20Home%20Page/02%20Pipeline%20%28How%20It%20Works%29/Distribution%20Video.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1',
        filename: 'pipeline-distribution.mp4',
      },
    }

    const pipelineDoc = await payload.findGlobal({ slug: 'pipeline', depth: 0 })
    const categories = (pipelineDoc.categories ?? []) as any[]
    const pipelineResults: Record<string, unknown>[] = []

    for (const [categoryId, file] of Object.entries(PIPELINE_FILES)) {
      const alt = `Pipeline -- ${categoryId}`
      let mediaId: number
      const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
      if (existing.totalDocs > 0) {
        mediaId = existing.docs[0]!.id as number
      } else {
        const res = await fetch(file.url)
        if (!res.ok) {
          pipelineResults.push({ categoryId, ok: false, error: `dropbox fetch failed: ${res.status}` })
          continue
        }
        const buf = Buffer.from(await res.arrayBuffer())
        const doc = await payload.create({
          collection: 'media',
          data: { alt },
          file: { data: buf, mimetype: 'video/mp4', name: file.filename, size: buf.length },
        })
        mediaId = doc.id as number
      }
      const cat = categories.find((c) => c.categoryId === categoryId)
      if (cat) cat.video = mediaId
      pipelineResults.push({ categoryId, ok: true, mediaId })
    }

    await payload.updateGlobal({ slug: 'pipeline', data: { categories, _status: 'published' } as any })
    return NextResponse.json({ results: pipelineResults })
  }

  // Downloads the real Home hero cut (Shortened Reel 2024, 110MB) straight
  // from its Dropbox share link server-side, uploads it into the media
  // library (S3), and wires it into Education's heroVideo per Kauan's
  // explicit instruction ("for education page hero use slate cinema home
  // page hero section 1st video"). Returns the resulting S3 url so it can
  // be hardcoded as the real Home hero too -- committing a 110MB file to
  // git isn't viable (GitHub rejects anything over 100MB outright), so
  // Home's actual hero swap happens in code once this URL is known.
  if (searchParams.get('homeHeroVideo') === '1') {
    const alt = 'Home hero -- Shortened Reel 2024'
    const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
    let mediaId: number
    let mediaUrl: string
    if (existing.totalDocs > 0) {
      mediaId = existing.docs[0]!.id as number
      mediaUrl = (existing.docs[0] as any).url
    } else {
      const dropboxUrl =
        'https://www.dropbox.com/scl/fo/8885n37svhzac53dznww6/AF7CT06oy1qosuQ6LFtAwsY/01%20Home%20Page/01%20Hero/Shortened%20Reel%202024.mp4?rlkey=md2ztdu9dpisgo1wtvplwolja&dl=1'
      const res = await fetch(dropboxUrl)
      if (!res.ok) {
        return NextResponse.json({ error: `dropbox fetch failed: ${res.status}` }, { status: 502 })
      }
      const buf = Buffer.from(await res.arrayBuffer())
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data: buf, mimetype: 'video/mp4', name: 'shortened-reel-2024.mp4', size: buf.length },
      })
      mediaId = doc.id as number
      mediaUrl = (doc as any).url
    }

    const eduFound = await payload.find({ collection: 'industries', where: { slug: { equals: 'education' } }, limit: 1 })
    if (eduFound.totalDocs > 0) {
      await payload.update({
        collection: 'industries',
        id: eduFound.docs[0]!.id,
        data: { heroVideo: mediaId, _status: 'published' },
      })
    }

    return NextResponse.json({ ok: true, mediaId, mediaUrl, educationWired: eduFound.totalDocs > 0 })
  }

  // ?slug=healthcare processes just one industry (fast, safe to retry);
  // omit it to attempt all of them in one call.
  const onlySlug = searchParams.get('slug')
  const skipPortfolioHero = searchParams.get('skipPortfolioHero') === '1'
  const wiringList = onlySlug ? INDUSTRY_WIRING.filter((w) => w.slug === onlySlug) : INDUSTRY_WIRING

  for (const w of wiringList) {
    const found = await payload.find({ collection: 'industries', where: { slug: { equals: w.slug } }, limit: 1 })
    if (found.totalDocs === 0) {
      results.push({ slug: w.slug, ok: false, error: 'industry not found' })
      continue
    }
    const doc = found.docs[0]!
    const data: Record<string, unknown> = { _status: 'published' }

    if (w.heroVideoVimeoUrl) data.heroVideoVimeoUrl = w.heroVideoVimeoUrl

    if (w.heroImageVimeoId) {
      const id = await uploadVimeoThumbnail(payload, w.heroImageVimeoId, `${w.slug} hero -- Vimeo ${w.heroImageVimeoId}`)
      if (id) data.heroImage = id
    }

    if (w.galleryVimeoIds?.length) {
      const galleryIds: number[] = []
      for (const vId of w.galleryVimeoIds) {
        const id = await uploadVimeoThumbnail(payload, vId, `${w.slug} gallery -- Vimeo ${vId}`)
        if (id) galleryIds.push(id)
      }
      if (galleryIds.length) data.gallery = galleryIds.map((image) => ({ image }))
    }

    try {
      await payload.update({ collection: 'industries', id: doc.id, data })
      results.push({ slug: w.slug, ok: true, applied: Object.keys(data) })
    } catch (e) {
      results.push({ slug: w.slug, ok: false, error: e instanceof Error ? e.message : String(e) })
    }
  }

  // Portfolio index hero -- reuse a real showreel (Slate Reel - Sports and
  // Travel) as the /portfolio hero video until a dedicated 2026 cut exists.
  if (!onlySlug && !skipPortfolioHero) {
    try {
      await payload.updateGlobal({
        slug: 'portfolio-index-page',
        data: { hero: { videoVimeoUrl: '937380835' }, _status: 'published' } as any,
      })
      results.push({ slug: 'portfolio-index-page', ok: true, applied: ['hero.videoVimeoUrl'] })
    } catch (e) {
      results.push({ slug: 'portfolio-index-page', ok: false, error: e instanceof Error ? e.message : String(e) })
    }
  }

  return NextResponse.json({ results })
}
