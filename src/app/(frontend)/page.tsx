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
  // both used to read the exact same full project list, so the two
  // sections always showed identical content -- there was no way for
  // them to ever look different. The homepage now gets every other
  // project (odd positions), the /portfolio hub still gets the complete
  // set, so a visitor sees real variety between the two rather than the
  // same 8-16 cards twice.
  const portfolioProjects = allProjects.filter((_, i) => i % 2 === 0)
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
