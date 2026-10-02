import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import HomePageContent from '@/components/HomePageContent'
import { getHomePageGlobal, getPipeline, getFinalCTA, getSiteSettings } from '@/lib/payload-data'
import { getNormalizedPortfolioProjects, normalizePipeline } from '@/lib/normalize'
import { loadBlocksData } from '@/lib/page-builder-data'
import { DEFAULT_TITLE, pageMetadata } from '@/lib/seo'

// The homepage keeps Site Settings > SEO's default title as-is, with no
// "| Slate Cinema" suffix (TikTok requires its tab to read exactly "Slate
// Cinema"), unless the page's own "Search engines & sharing" says otherwise.
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const [page, settings] = await Promise.all([getHomePageGlobal(draft), getSiteSettings(draft)])
  return pageMetadata({
    path: '/',
    seo: page,
    title: settings.seo?.defaultTitle || DEFAULT_TITLE,
    absoluteTitle: true,
  })
}

export default async function Home() {
  // Set by /api/preview, which every Live Preview iframe URL routes
  // through -- see payload.config.ts's livePreviewURL.
  const draft = (await draftMode()).isEnabled
  const [homePage, pipeline, allProjects, finalCta] = await Promise.all([
    getHomePageGlobal(draft),
    getPipeline(draft),
    getNormalizedPortfolioProjects(draft),
    getFinalCTA(draft),
  ])
  // Selected Work (this carousel) and "A Gallery of Impact" on /portfolio
  // both read the same collection -- give the homepage only the first 8
  // (order 0-7) so the two placements show genuinely different projects
  // instead of the exact same set twice. /portfolio still gets everything
  // via its own page.tsx, which never slices.
  const portfolioProjects = allProjects.slice(0, 8)
  // Whatever library sections an editor added to the page's Sections list.
  const blocksData = await loadBlocksData(homePage?.layout, draft)
  return (
    <HomePageContent
      homePage={homePage}
      pipelineCategories={normalizePipeline(pipeline)}
      pipelineHeading={pipeline?.heading}
      portfolioProjects={portfolioProjects}
      finalCta={finalCta}
      blocksData={blocksData}
    />
  )
}
