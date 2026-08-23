import HomePageContent from '@/components/HomePageContent'
import { getHomePageGlobal, getPipeline, getFinalCTA } from '@/lib/payload-data'
import { getNormalizedPortfolioProjects, normalizePipeline } from '@/lib/normalize'

export default async function Home() {
  const [homePage, pipeline, allProjects, finalCta] = await Promise.all([
    getHomePageGlobal(),
    getPipeline(),
    getNormalizedPortfolioProjects(),
    getFinalCTA(),
  ])
  // Selected Work (this carousel) and "A Gallery of Impact" on /portfolio
  // both read the same collection -- give the homepage only the first 8
  // (order 0-7) so the two placements show genuinely different projects
  // instead of the exact same set twice. /portfolio still gets everything
  // via its own page.tsx, which never slices.
  const portfolioProjects = allProjects.slice(0, 8)
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
