import type { Metadata } from 'next'
import HowItWorksPageContent from '@/components/HowItWorksPageContent'
import { getHowItWorksPageGlobal, getPipeline, getFinalCTA } from '@/lib/payload-data'
import { normalizePipeline } from '@/lib/normalize'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically.',
}

export default async function HowItWorksPage() {
  const [page, pipeline, finalCta] = await Promise.all([
    getHowItWorksPageGlobal(),
    getPipeline(),
    getFinalCTA(),
  ])
  return (
    <HowItWorksPageContent
      page={page}
      pipelineCategories={normalizePipeline(pipeline)}
      pipelineHeading={pipeline?.heading}
      finalCta={finalCta}
    />
  )
}
