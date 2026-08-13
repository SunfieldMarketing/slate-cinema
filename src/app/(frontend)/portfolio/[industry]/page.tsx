import { notFound } from 'next/navigation'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getFinalCTA } from '@/lib/payload-data'
import IndustryPageContent from '@/components/IndustryPageContent'

// 'athletics' excluded -- it has its own dedicated static route
// (portfolio/athletics/page.tsx) with a genuinely different page design,
// per Jake's Aug 12 call note that Athletics + Animation are different
// designs from the rest. A literal static route always wins over a
// dynamic [industry] match for the same path in Next.js, but leaving
// 'athletics' in generateStaticParams here would still try to
// prerender a second, conflicting page at the same URL and fail the
// build -- excluded explicitly instead of relying on routing alone.
export async function generateStaticParams() {
  const industries = await getNormalizedIndustries()
  return industries.filter((i) => i.slug !== 'athletics').map((i) => ({ industry: i.slug }))
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
  const [industries, portfolioProjects, finalCta] = await Promise.all([
    getNormalizedIndustries(),
    getNormalizedPortfolioProjects(),
    getFinalCTA(),
  ])
  const industry = industries.find((i) => i.slug === slug)
  if (!industry) notFound()
  return <IndustryPageContent industry={industry} portfolioProjects={portfolioProjects} finalCta={finalCta} />
}
