import type { Page, FinalCta } from '@/payload-types'
import type { JournalPostLocal, PortfolioProjectLocal } from '@/lib/normalize'
import type { Category } from '@/lib/pipeline-data'

/** One page-builder section, as stored on a page (see src/blocks). */
export type ContentBlock = NonNullable<Page['layout']>[number]
export type BlockOfType<T extends ContentBlock['blockType']> = Extract<ContentBlock, { blockType: T }>

/**
 * Data some sections need from other parts of the CMS, fetched once on the
 * server (src/lib/page-builder-data.ts) and handed down to the renderers.
 */
export interface BlocksData {
  projects?: PortfolioProjectLocal[]
  posts?: JournalPostLocal[]
  pipeline?: {
    categories: Category[]
    heading?: { eyebrow?: string | null; title?: string | null; description?: string | null }
  }
  finalCta?: FinalCta | null
  /** Label under each journal card ("Read the piece"), from the Journal Page global. */
  readLabel?: string
}
