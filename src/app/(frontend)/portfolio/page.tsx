import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import PortfolioPageContent from '@/components/PortfolioPageContent'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getPortfolioIndexPageGlobal, getFinalCTA } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'
import { pageMetadata } from '@/lib/seo'
import { PAGE_META } from '@/lib/page-meta'

// Search title/description/share card: the page's "Search engines &
// sharing" fields in /admin, else these defaults (src/lib/page-meta.ts).
export async function generateMetadata(): Promise<Metadata> {
  const draft = (await draftMode()).isEnabled
  const page = await getPortfolioIndexPageGlobal(draft)
  return pageMetadata({ path: '/portfolio', seo: page, title: PAGE_META.portfolio.title, description: PAGE_META.portfolio.description })
}

export default async function PortfolioPage() {
  const draft = (await draftMode()).isEnabled
  const [industries, projects, page, finalCta] = await Promise.all([
    getNormalizedIndustries(draft),
    getNormalizedPortfolioProjects(draft),
    getPortfolioIndexPageGlobal(draft),
    getFinalCTA(draft),
  ])
  const blocksData = await loadBlocksData(page?.layout, draft)
  return <PortfolioPageContent industries={industries} projects={projects} page={page} finalCta={finalCta} blocksData={blocksData} />
}
