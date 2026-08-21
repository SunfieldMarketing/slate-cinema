import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3'
import { list as blobList } from '@vercel/blob'

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

  // One-time, explicit-opt-in reveal so the actual media migration (Blob ->
  // S3) can run as a local script instead of inside a serverless function's
  // time/memory limits. Gated behind the same token plus a second explicit
  // param so it never shows up by accident. This route + the value it
  // reveals get deleted the moment the migration is done.
  if (searchParams.get('revealBlobToken') === '1') {
    return NextResponse.json({ BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ?? null })
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
