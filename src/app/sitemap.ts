import type { MetadataRoute } from 'next'
import { getNormalizedIndustries, getNormalizedJournalPosts } from '@/lib/normalize'
import {
  getAllPagePaths,
  getContactPageGlobal,
  getHomePageGlobal,
  getHowItWorksPageGlobal,
  getJournalPageGlobal,
  getPortfolioIndexPageGlobal,
  getPrivacyPolicyPageGlobal,
  getScheduleACallPageGlobal,
  getSocialMediaManagementPageGlobal,
  getTermsOfServicePageGlobal,
} from '@/lib/payload-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://slatecinema.com'

type Frequency = MetadataRoute.Sitemap[number]['changeFrequency']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [industries, journalPosts, customPages, home, portfolio, howItWorks, contact, scheduleCall, journal, social, privacy, terms] =
    await Promise.all([
      getNormalizedIndustries(),
      getNormalizedJournalPosts(),
      getAllPagePaths(),
      getHomePageGlobal(),
      getPortfolioIndexPageGlobal(),
      getHowItWorksPageGlobal(),
      getContactPageGlobal(),
      getScheduleACallPageGlobal(),
      getJournalPageGlobal(),
      getSocialMediaManagementPageGlobal(),
      getPrivacyPolicyPageGlobal(),
      getTermsOfServicePageGlobal(),
    ])

  // A page ticked "Hide from search engines" in /admin stays out.
  const route = (page: { noIndex?: boolean | null } | null, path: string, changeFrequency: Frequency, priority: number) =>
    page?.noIndex ? [] : [{ url: `${BASE_URL}${path}`, lastModified: new Date(), changeFrequency, priority }]

  const staticRoutes: MetadataRoute.Sitemap = [
    ...route(home, '', 'weekly', 1),
    ...route(portfolio, '/portfolio', 'weekly', 0.9),
    ...route(howItWorks, '/how-it-works', 'monthly', 0.8),
    ...route(contact, '/contact', 'monthly', 0.9),
    ...route(scheduleCall, '/schedule-a-call', 'monthly', 0.7),
    ...route(journal, '/journal', 'weekly', 0.8),
    ...route(social, '/social-media-management', 'monthly', 0.8),
    ...route(privacy, '/privacy-policy', 'yearly', 0.3),
    ...route(terms, '/terms-of-service', 'yearly', 0.3),
  ]

  const industryRoutes: MetadataRoute.Sitemap = industries.filter((industry) => !industry.seo?.noIndex).map((industry) => ({
    url: `${BASE_URL}/portfolio/${industry.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const journalRoutes: MetadataRoute.Sitemap = journalPosts.filter((post) => !post.seo?.noIndex).map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Pages built in /admin (Custom pages), minus any marked "hide from search engines".
  const customRoutes: MetadataRoute.Sitemap = customPages
    .filter((page) => !page.noIndex)
    .map((page) => ({
      url: `${BASE_URL}/${page.path}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [...staticRoutes, ...industryRoutes, ...journalRoutes, ...customRoutes]
}
