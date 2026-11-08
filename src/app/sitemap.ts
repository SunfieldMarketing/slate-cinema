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

import { SITE_URL } from '@/lib/site-url'

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

  // lastmod is the document's real last edit (2026-11-07, Levi's AI-search list #8). It used
  // to be new Date() for every URL -- one build timestamp on all 50 -- and search engines
  // ignore lastmod that isn't consistently accurate. No document, no lastmod: better absent
  // than wrong.
  const edited = (doc?: { updatedAt?: string | null } | null) => (doc?.updatedAt ? { lastModified: new Date(doc.updatedAt) } : {})

  // A page ticked "Hide from search engines" in /admin stays out.
  const route = (page: { noIndex?: boolean | null; updatedAt?: string | null } | null, path: string, changeFrequency: Frequency, priority: number) =>
    page?.noIndex ? [] : [{ url: `${SITE_URL}${path}`, ...edited(page), changeFrequency, priority }]

  const staticRoutes: MetadataRoute.Sitemap = [
    ...route(home, '', 'weekly', 1),
    ...route(portfolio, '/portfolio', 'weekly', 0.9),
    ...route(howItWorks, '/how-it-works', 'monthly', 0.8),
    ...route(contact, '/contact', 'monthly', 0.9),
    ...route(scheduleCall, '/schedule-a-call', 'monthly', 0.7),
    // The project intake form has no CMS document of its own, so it's always listed.
    ...route(null, '/contact/project', 'monthly', 0.7),
    ...route(journal, '/journal', 'weekly', 0.8),
    ...route(social, '/social-media-management', 'monthly', 0.8),
    ...route(privacy, '/privacy-policy', 'yearly', 0.3),
    ...route(terms, '/terms-of-service', 'yearly', 0.3),
  ]

  const industryRoutes: MetadataRoute.Sitemap = industries.filter((industry) => !industry.seo?.noIndex).map((industry) => ({
    url: `${SITE_URL}/portfolio/${industry.slug}`,
    ...edited(industry),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const journalRoutes: MetadataRoute.Sitemap = journalPosts.filter((post) => !post.seo?.noIndex).map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    ...edited(post),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Pages built in /admin (Custom pages), minus any marked "hide from search engines".
  const customRoutes: MetadataRoute.Sitemap = customPages
    .filter((page) => !page.noIndex)
    .map((page) => ({
      url: `${SITE_URL}/${page.path}`,
      ...edited(page),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [...staticRoutes, ...industryRoutes, ...journalRoutes, ...customRoutes]
}
