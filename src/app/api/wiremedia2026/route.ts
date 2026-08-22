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
