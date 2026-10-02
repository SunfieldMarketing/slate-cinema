import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import ContactPageContent from '@/components/ContactPageContent'
import { getContactPageGlobal, getReadyToTalk } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'
import { pageMetadata } from '@/lib/seo'
import { PAGE_META } from '@/lib/page-meta'

// Search title/description/share card: the page's "Search engines &
// sharing" fields in /admin, else these defaults (src/lib/page-meta.ts).
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const page = await getContactPageGlobal(draft)
  return pageMetadata({ path: '/contact', seo: page, title: PAGE_META.contact.title, description: PAGE_META.contact.description })
}

export default async function ContactPage() {
  const draft = (await draftMode()).isEnabled
  const [page, readyToTalk] = await Promise.all([getContactPageGlobal(draft), getReadyToTalk(draft)])
  const blocksData = await loadBlocksData(page?.layout, draft)
  return <ContactPageContent page={page} readyToTalk={readyToTalk} blocksData={blocksData} />
}
