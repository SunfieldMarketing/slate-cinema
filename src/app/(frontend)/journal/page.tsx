import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import JournalPageContent from '@/components/JournalPageContent'
import { getNormalizedJournalPosts } from '@/lib/normalize'
import { getJournalPageGlobal } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'
import { pageMetadata } from '@/lib/seo'
import { PAGE_META } from '@/lib/page-meta'

// Search title/description/share card: the page's "Search engines &
// sharing" fields in /admin, else these defaults (src/lib/page-meta.ts).
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const page = await getJournalPageGlobal(draft)
  return pageMetadata({ path: '/journal', seo: page, title: PAGE_META.journal.title, description: PAGE_META.journal.description })
}

export default async function JournalPage() {
  // Set by /api/preview for Live Preview (see payload.config.ts).
  const draft = (await draftMode()).isEnabled
  const [posts, page] = await Promise.all([getNormalizedJournalPosts(draft), getJournalPageGlobal(draft)])
  const blocksData = await loadBlocksData(page?.layout, draft)
  return <JournalPageContent posts={posts} page={page} blocksData={blocksData} />
}
