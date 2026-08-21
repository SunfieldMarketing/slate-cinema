import type { MetadataRoute } from 'next'
import { getNormalizedIndustries, getNormalizedJournalPosts } from '@/lib/normalize'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://slatecinema.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [industries, journalPosts] = await Promise.all([getNormalizedIndustries(), getNormalizedJournalPosts()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/schedule-a-call`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/social-media-management`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${BASE_URL}/portfolio/${industry.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const journalRoutes: MetadataRoute.Sitemap = journalPosts.map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...industryRoutes, ...journalRoutes]
}
