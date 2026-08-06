import HomePageContent from '@/components/HomePageContent'
import { getHomePageGlobal, getPipeline, getFinalCTA } from '@/lib/payload-data'
import { getNormalizedPortfolioProjects, normalizePipeline } from '@/lib/normalize'

export default async function Home() {
  const [homePage, pipeline, portfolioProjects, finalCta] = await Promise.all([
    getHomePageGlobal(),
    getPipeline(),
    getNormalizedPortfolioProjects(),
    getFinalCTA(),
  ])
  return (
    <HomePageContent
      homePage={homePage}
      pipelineCategories={normalizePipeline(pipeline)}
      pipelineHeading={pipeline?.heading}
      portfolioProjects={portfolioProjects}
      finalCta={finalCta}
    />
  )
}
