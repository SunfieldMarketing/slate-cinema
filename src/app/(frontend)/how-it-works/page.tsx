import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import HowItWorksPageContent from '@/components/HowItWorksPageContent'
import { getHowItWorksPageGlobal, getPipeline, getFinalCTA } from '@/lib/payload-data'
import { normalizePipeline } from '@/lib/normalize'
import { loadBlocksData } from '@/lib/page-builder-data'
import { pageMetadata } from '@/lib/seo'
import { PAGE_META } from '@/lib/page-meta'

// Search title/description/share card: the page's "Search engines &
// sharing" fields in /admin, else these defaults (src/lib/page-meta.ts).
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const page = await getHowItWorksPageGlobal(draft)
  return pageMetadata({ path: '/how-it-works', seo: page, title: PAGE_META.howItWorks.title, description: PAGE_META.howItWorks.description })
}

export default async function HowItWorksPage() {
  const draft = (await draftMode()).isEnabled
  const [page, pipeline, finalCta] = await Promise.all([
    getHowItWorksPageGlobal(draft),
    getPipeline(draft),
    getFinalCTA(draft),
  ])
  const blocksData = await loadBlocksData(page?.layout, draft)
  return (
    <HowItWorksPageContent
      page={page}
      pipelineCategories={normalizePipeline(pipeline)}
      pipelineHeading={pipeline?.heading}
      finalCta={finalCta}
      blocksData={blocksData}
    />
  )
}
