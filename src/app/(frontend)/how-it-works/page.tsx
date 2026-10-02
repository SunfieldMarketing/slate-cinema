import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import HowItWorksPageContent from '@/components/HowItWorksPageContent'
import { getHowItWorksPageGlobal, getPipeline, getFinalCTA } from '@/lib/payload-data'
import { normalizePipeline } from '@/lib/normalize'
import { loadBlocksData } from '@/lib/page-builder-data'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically.',
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
