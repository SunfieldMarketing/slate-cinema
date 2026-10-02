import { getFinalCTA, getJournalPageGlobal, getPipeline } from '@/lib/payload-data'
import { getNormalizedJournalPosts, getNormalizedPortfolioProjects, normalizePipeline } from '@/lib/normalize'
import type { BlocksData } from '@/components/blocks/types'

/*
  Server-only: fetches what a page's sections need from elsewhere in the
  CMS (portfolio projects, journal posts, the shared Pipeline and Final CTA)
  -- and only the parts its visible sections actually use.
*/
export async function loadBlocksData(
  blocks: { blockType: string; hidden?: boolean | null }[] | null | undefined,
  draft = false,
): Promise<BlocksData> {
  const used = new Set((blocks ?? []).filter((b) => !b.hidden).map((b) => b.blockType))
  const [projects, posts, pipeline, finalCta, journalPage] = await Promise.all([
    used.has('portfolioGrid') ? getNormalizedPortfolioProjects(draft) : undefined,
    used.has('journalPosts') ? getNormalizedJournalPosts(draft) : undefined,
    used.has('pipeline') ? getPipeline(draft) : undefined,
    used.has('finalCta') ? getFinalCTA(draft) : undefined,
    used.has('journalPosts') ? getJournalPageGlobal(draft) : undefined,
  ])
  return {
    projects,
    posts,
    pipeline: pipeline ? { categories: normalizePipeline(pipeline), heading: pipeline.heading } : undefined,
    finalCta: finalCta ?? undefined,
    readLabel: journalPage?.readLabel || undefined,
  }
}
