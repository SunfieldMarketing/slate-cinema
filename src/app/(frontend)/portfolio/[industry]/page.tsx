import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getNormalizedIndustries, getNormalizedPortfolioProjects } from '@/lib/normalize'
import { getFinalCTA } from '@/lib/payload-data'
import { loadBlocksData } from '@/lib/page-builder-data'
import IndustryPageContent from '@/components/IndustryPageContent'
import { pageMetadata } from '@/lib/seo'
import { PLACEHOLDER_IMAGE } from '@/lib/media-url'

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
  // The industry's "Search engines & sharing" fields, else its name and
  // description, shared with its hero image.
  return pageMetadata({
    path: `/portfolio/${industry.slug}`,
    seo: industry.seo,
    title: `${industry.label} Video Production`,
    description: industry.description || undefined,
    image: industry.heroImage && industry.heroImage !== PLACEHOLDER_IMAGE ? industry.heroImage : undefined,
  })
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
  const blocksData = await loadBlocksData(industry.layout, draft)
  return <IndustryPageContent industry={industry} portfolioProjects={portfolioProjects} finalCta={finalCta} blocksData={blocksData} />
}
