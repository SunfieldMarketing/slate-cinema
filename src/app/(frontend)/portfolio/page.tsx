import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import PortfolioPageContent from '@/components/PortfolioPageContent'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getPortfolioIndexPageGlobal, getFinalCTA } from '@/lib/payload-data'

export const metadata: Metadata = {
  title: 'Our Work',
  description: 'Browse Slate Cinema video production work by industry, and explore the full reel of selected campaigns.',
}

export default async function PortfolioPage() {
  const draft = (await draftMode()).isEnabled
  const [industries, projects, page, finalCta] = await Promise.all([
    getNormalizedIndustries(draft),
    getNormalizedPortfolioProjects(draft),
    getPortfolioIndexPageGlobal(draft),
    getFinalCTA(draft),
  ])
  return <PortfolioPageContent industries={industries} projects={projects} page={page} finalCta={finalCta} />
}
