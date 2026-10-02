import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import JournalPageContent from '@/components/JournalPageContent'
import { getNormalizedJournalPosts } from '@/lib/normalize'
import { getJournalPageGlobal } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'

export const metadata: Metadata = {
  title: 'The Slate Journal',
  description:
    'Notes on video production, storytelling, and brand — practical writing from Slate Cinema on what actually earns attention and what makes people watch to the end.',
}

export default async function JournalPage() {
  // Set by /api/preview for Live Preview (see payload.config.ts).
  const draft = (await draftMode()).isEnabled
  const [posts, page] = await Promise.all([getNormalizedJournalPosts(draft), getJournalPageGlobal(draft)])
  const blocksData = await loadBlocksData(page?.layout, draft)
  return <JournalPageContent posts={posts} page={page} blocksData={blocksData} />
}
