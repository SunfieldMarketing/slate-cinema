import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getAllPagePaths, getPageByPath } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'
import { mediaUrl } from '@/lib/media-url'
import CustomPageContent from '@/components/CustomPageContent'

/*
  Pages built in /admin (Custom pages collection, src/collections/Pages.ts).
  Next.js matches every hand-built route first, so this only ever sees
  addresses that aren't one of the site's own pages; the collection's
  address validation keeps editors from picking one that is.
*/

type Params = Promise<{ slug: string[] }>

const toPath = (slug: string[]) => slug.map((s) => decodeURIComponent(s)).join('/').toLowerCase()

export async function generateStaticParams() {
  const pages = await getAllPagePaths()
  return pages.map((p) => ({ slug: p.path.split('/') }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const draft = (await draftMode()).isEnabled
  const page = await getPageByPath(toPath(slug), draft)
  if (!page) return {}
  const image = mediaUrl(page.metaImage)
  const title = page.metaTitle || page.title
  const description = page.metaDescription || undefined
  return {
    title,
    description,
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, ...(image ? { images: [{ url: image }] } : {}) },
  }
}

export default async function CustomPage({ params }: { params: Params }) {
  const { slug } = await params
  // Set by /api/preview, which every Live Preview iframe URL goes through.
  const draft = (await draftMode()).isEnabled
  const page = await getPageByPath(toPath(slug), draft)
  if (!page) notFound()
  const data = await loadBlocksData(page.layout, draft)
  return <CustomPageContent page={page} data={data} />
}
