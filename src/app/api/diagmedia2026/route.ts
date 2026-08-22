import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { list as blobList, get as blobGet, put as blobPut, del as blobDel, head as blobHead } from '@vercel/blob'

// Batched copy needs more than the default execution window -- 250+ files,
// some 40MB+ videos, fetched from Blob and re-uploaded to S3 one at a time
// within each batch call.
export const maxDuration = 300

// Temporary read-only diagnostic: figure out where Slate Cinema's real
// media files actually live. The `slate/` prefix in the S3 bucket is
// confirmed empty (just the auto-created folder marker) even though the
// `media` collection has 74 docs generating S3 URLs for that prefix --
// so every one of those URLs 404s/403s for real visitors. This checks
// whether the original files are still sitting in the (older) Vercel
// Blob store instead, so the real fix is copying them over rather than
// re-uploading from scratch. Delete once it's served its purpose.

const DIAG_TOKEN = 'x7q2m-slate-diagmedia-2026-08-21-pk9wz3'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== DIAG_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Wires the two real client Vimeo videos the 2026-08-13 scrape actually
  // confirmed (see PROJECT_CONTEXT.md's "Scrape findings") into the matching
  // live portfolio-projects docs -- found by exact title search against
  // Jake's own Vimeo account (vimeo.com/user58842347), not guessed. Every
  // other new portfolio client name (CVM, TruBlue, EKGx, Smash House, Real
  // Talk) returned 0 title matches there, so those stay on the placeholder
  // asset until real footage is supplied -- not touched here.
  if (searchParams.get('wireVimeo') === '1') {
    const payload = await getPayload({ config })
    const updates = [
      { title: 'Chairside Calm', company: 'Park Smiles NYC', videoVimeoUrl: '949324576' }, // the ad -- matches the source doc's own citation
      { title: 'Timeless Passover Memories', company: 'Gateways', videoVimeoUrl: '1174431950' }, // "Gateways 2026 POV commercial"
    ]
    const results = []
    for (const u of updates) {
      const found = await payload.find({ collection: 'portfolio-projects', where: { title: { equals: u.title } }, limit: 1 })
      if (found.totalDocs === 0) {
        results.push({ title: u.title, ok: false, error: 'not found' })
        continue
      }
      const doc = found.docs[0]!
      await payload.update({
        collection: 'portfolio-projects',
        id: doc.id,
        data: { videoVimeoUrl: u.videoVimeoUrl, _status: 'published' },
      })
      results.push({ title: u.title, id: doc.id, ok: true, videoVimeoUrl: u.videoVimeoUrl })
    }
    return NextResponse.json({ results })
  }

  // Narrows down exactly what "Your store is blocked" actually blocks --
  // does it block writes/deletes too, or only content reads? Uses a brand
  // new throwaway blob (never touches any real media) so it's safe
  // regardless of the answer: put a tiny test file, head it, try to read
  // it back, then delete it, reporting which steps succeeded.
  if (searchParams.get('testOps') === '1') {
    const out: Record<string, string> = {}
    let testUrl: string | null = null
    try {
      const putRes = await blobPut('diag-test/probe.txt', 'hello', {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      })
      testUrl = putRes.url
      out.put = 'ok: ' + putRes.url
    } catch (e) {
      out.put = 'FAIL: ' + (e instanceof Error ? e.message : String(e))
    }
    if (testUrl) {
      try {
        const h = await blobHead(testUrl, { token: process.env.BLOB_READ_WRITE_TOKEN })
        out.head = 'ok: size ' + h.size
      } catch (e) {
        out.head = 'FAIL: ' + (e instanceof Error ? e.message : String(e))
      }
      try {
        const g = await blobGet(testUrl, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN })
        out.get = g && g.statusCode === 200 ? 'ok' : `FAIL: status ${g?.statusCode}`
      } catch (e) {
        out.get = 'FAIL: ' + (e instanceof Error ? e.message : String(e))
      }
      try {
        const r = await fetch(testUrl)
        out.rawFetch = `status ${r.status}`
      } catch (e) {
        out.rawFetch = 'FAIL: ' + (e instanceof Error ? e.message : String(e))
      }
      try {
        await blobDel(testUrl, { token: process.env.BLOB_READ_WRITE_TOKEN })
        out.del = 'ok'
      } catch (e) {
        out.del = 'FAIL: ' + (e instanceof Error ? e.message : String(e))
      }
    }
    return NextResponse.json(out)
  }

  // Same read attempt as copyToS3, but via each blob's downloadUrl instead
  // of its plain url -- different query param, worth ruling out separately.
  if (searchParams.get('testDownloadUrl') === '1') {
    const res = await blobList({ token: process.env.BLOB_READ_WRITE_TOKEN, limit: 1 })
    const b = res.blobs[0]
    if (!b) return NextResponse.json({ error: 'no blobs' })
    const r1 = await fetch(b.url)
    const r2 = await fetch(b.downloadUrl)
    return NextResponse.json({ pathname: b.pathname, urlStatus: r1.status, downloadUrlStatus: r2.status })
  }

  if (searchParams.get('listBlobs') === '1') {
    const res = await blobList({ token: process.env.BLOB_READ_WRITE_TOKEN, limit: 30 })
    return NextResponse.json({ blobs: res.blobs.map((b) => ({ pathname: b.pathname, url: b.url, size: b.size })) })
  }

  // The actual fix: every real Slate Cinema media file is still sitting in
  // the old Vercel Blob store (73/74 DB docs' filenames matched there, 0 in
  // S3) -- copy each one into the S3 bucket under the same `slate/<filename>`
  // key the app's s3Storage config already expects reads at. Runs entirely
  // server-side: list() needs the Blob token, but each blob's own `url` is
  // a plain public HTTPS GET, so the token itself never has to leave the
  // server or show up in a response. Batched via offset/limit because 250+
  // files (several 40MB+ videos) won't finish in one call; call repeatedly
  // with increasing offset until `done` comes back true.
  if (searchParams.get('copyToS3') === '1') {
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const limit = parseInt(searchParams.get('limit') || '8', 10)

    const s3 = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })

    const allBlobs: { pathname: string; url: string; size: number }[] = []
    let cursor: string | undefined
    do {
      const res = await blobList({ token: process.env.BLOB_READ_WRITE_TOKEN, cursor, limit: 1000 })
      allBlobs.push(...res.blobs)
      cursor = res.cursor
    } while (cursor)
    // Stable order so offset/limit paging is consistent across calls.
    allBlobs.sort((a, b) => a.pathname.localeCompare(b.pathname))

    const batch = allBlobs.slice(offset, offset + limit)
    const results: { key: string; ok: boolean; size?: number; error?: string }[] = []

    for (const blob of batch) {
      // Use just the bare filename -- that's what media.filename (and every
      // S3 read this app does) actually keys off, regardless of whatever
      // folder structure the old Blob store used.
      const filename = blob.pathname.split('/').pop()!
      const key = `slate/${filename}`
      try {
        // A bare fetch(blob.url) 403s -- these blobs need authenticated
        // access even to read, so go through the SDK's own get() (which
        // knows how to attach the token) instead of a plain HTTPS GET.
        const got = await blobGet(blob.pathname, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN })
        if (!got || got.statusCode !== 200 || !got.stream) throw new Error(`blob get() status ${got?.statusCode ?? 'null'}`)
        const chunks: Uint8Array[] = []
        const reader = got.stream.getReader()
        for (;;) {
          const { done: rDone, value } = await reader.read()
          if (rDone) break
          if (value) chunks.push(value)
        }
        const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)))
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: buf,
            ContentType: got.blob.contentType || undefined,
          }),
        )
        results.push({ key, ok: true, size: buf.length })
      } catch (e) {
        results.push({ key, ok: false, error: e instanceof Error ? e.message : String(e) })
      }
    }

    return NextResponse.json({
      total: allBlobs.length,
      offset,
      limit,
      done: offset + limit >= allBlobs.length,
      nextOffset: offset + limit,
      results,
    })
  }

  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const hasS3 = Boolean(
    process.env.S3_BUCKET && process.env.S3_REGION && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
  )

  const payload = await getPayload({ config })
  const mediaResult = await payload.find({ collection: 'media', limit: 200, depth: 0 })
  const filenames = mediaResult.docs.map((d) => d.filename).filter(Boolean) as string[]

  let blobFiles: string[] = []
  let blobError: string | null = null
  if (hasBlobToken) {
    try {
      let cursor: string | undefined
      do {
        const res = await blobList({ token: process.env.BLOB_READ_WRITE_TOKEN, cursor, limit: 1000 })
        blobFiles.push(...res.blobs.map((b) => b.pathname))
        cursor = res.cursor
      } while (cursor)
    } catch (e) {
      blobError = e instanceof Error ? e.message : String(e)
    }
  }

  let s3Client: S3Client | null = null
  if (hasS3) {
    s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  }

  const foundInBlob: string[] = []
  const foundInS3: string[] = []
  const foundNowhere: string[] = []

  for (const filename of filenames) {
    const inBlob = blobFiles.some((p) => p.endsWith(filename))
    let inS3 = false
    if (s3Client) {
      try {
        await s3Client.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: `slate/${filename}` }))
        inS3 = true
      } catch {
        inS3 = false
      }
    }
    if (inBlob) foundInBlob.push(filename)
    if (inS3) foundInS3.push(filename)
    if (!inBlob && !inS3) foundNowhere.push(filename)
  }

  return NextResponse.json({
    hasBlobToken,
    hasS3,
    totalMediaDocs: mediaResult.totalDocs,
    checkedFilenames: filenames.length,
    blobStoreTotalFiles: blobFiles.length,
    blobError,
    foundInBlobCount: foundInBlob.length,
    foundInS3Count: foundInS3.length,
    foundNowhereCount: foundNowhere.length,
    foundNowhereSample: foundNowhere.slice(0, 20),
    foundInBlobSample: foundInBlob.slice(0, 10),
  })
}
