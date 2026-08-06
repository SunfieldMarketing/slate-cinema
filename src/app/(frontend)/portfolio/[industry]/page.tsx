import { notFound } from 'next/navigation'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getFinalCTA } from '@/lib/payload-data'
import IndustryPageContent from '@/components/IndustryPageContent'

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
    title: `${industry.label} Video Production | Slate Cinema`,
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
