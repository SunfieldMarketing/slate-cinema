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
