import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getFinalCTA } from '@/lib/payload-data'
import IndustryPageContent from '@/components/IndustryPageContent'

// Athletics' dedicated static route (portfolio/athletics/page.tsx) was
// retired 2026-08-13 -- its client-showcase + cinematic-statement
// format was generalized into IndustryPageContent for every industry
// (see IndustryData.clientShowcase in src/lib/industries.ts), so
// Athletics goes through this same dynamic route again like everyone
// else. 'podcasts' also flows through here now (added as a normal,
// code-only industry entry -- see getNormalizedIndustries).
export async function generateStaticParams() {
  const industries = await getNormalizedIndustries()
  return industries.map((i) => ({ industry: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await params
  const industries = await getNormalizedIndustries()
  const industry = industries.find((i) => i.slug === slug)
  if (!industry) return {}
  return {
    title: `${industry.label} Video Production`,
    description: industry.description,
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await params
  // Set by /api/preview, which every Live Preview iframe URL routes
  // through -- see payload.config.ts's livePreviewURL.
  const draft = (await draftMode()).isEnabled
  const [industries, portfolioProjects, finalCta] = await Promise.all([
    getNormalizedIndustries(draft),
    getNormalizedPortfolioProjects(draft),
    getFinalCTA(draft),
  ])
  const industry = industries.find((i) => i.slug === slug)
  if (!industry) notFound()
  return <IndustryPageContent industry={industry} portfolioProjects={portfolioProjects} finalCta={finalCta} />
}
