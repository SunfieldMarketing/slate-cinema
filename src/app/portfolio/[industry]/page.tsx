import { notFound } from 'next/navigation'
import { industries, getIndustryBySlug } from '@/lib/industries'
import IndustryPageContent from '@/components/IndustryPageContent'

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) return {}
  return {
    title: `${industry.label} Video Production | Slate Cinema`,
    description: industry.description,
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await params
  if (!getIndustryBySlug(slug)) notFound()
  return <IndustryPageContent slug={slug} />
}
