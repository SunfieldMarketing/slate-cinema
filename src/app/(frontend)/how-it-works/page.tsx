import HowItWorksPageContent from '@/components/HowItWorksPageContent'
import { getHowItWorksPageGlobal, getPipeline, getFinalCTA } from '@/lib/payload-data'
import { normalizePipeline } from '@/lib/normalize'

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
