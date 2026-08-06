import type { Metadata } from 'next'
import PortfolioPageContent from '@/components/PortfolioPageContent'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getPortfolioIndexPageGlobal, getFinalCTA } from '@/lib/payload-data'

export const metadata: Metadata = {
  title: 'Our Work | Slate Cinema',
  description: 'Browse Slate Cinema video production work by industry, and explore the full reel of selected campaigns.',
}

export default async function PortfolioPage() {
  const [industries, projects, page, finalCta] = await Promise.all([
    getNormalizedIndustries(),
    getNormalizedPortfolioProjects(),
    getPortfolioIndexPageGlobal(),
    getFinalCTA(),
  ])
  return <PortfolioPageContent industries={industries} projects={projects} page={page} finalCta={finalCta} />
}
