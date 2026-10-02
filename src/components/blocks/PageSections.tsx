'use client'

import type { ReactNode } from 'react'
import { PAGE_SECTIONS, builtInKey, builtInSlug, type BuiltInSection, type PageKey } from '@/lib/page-sections'
import { BlockShell, RenderBlock } from './RenderBlocks'
import type { BlocksData, ContentBlock } from './types'

/*
  Renders one of the site's original pages from its "Sections" list
  (2026-10-02): the page's built-in sections and any library sections an
  editor added, in the order they were arranged in /admin. A page whose
  list was never saved renders its built-in sections in their original
  order (src/lib/page-sections.ts), so nothing changes until someone
  rearranges it.

  Built-in sections are drawn by the page itself (`builtIns`: one element
  per section key -- elements rather than render functions, so server-
  rendered pages can pass their own server components through); library
  sections go through the same renderer as Custom pages, under `cms` so
  Live Preview's click-to-edit opens this page's document.
*/

/** A stored "Sections" row: a built-in section or a library section. */
export interface SectionRow {
  id?: string | null
  blockType: string
  hidden?: boolean | null
  hideOn?: 'mobile' | 'desktop' | null
  anchor?: string | null
}

export type CmsTarget = { global: string } | { collection: string; docId: string | number }

function cmsAttributes(cms: CmsTarget): Record<string, string> {
  return 'global' in cms
    ? { 'data-cms-global': cms.global }
    : { 'data-cms-collection': cms.collection, 'data-cms-doc-id': String(cms.docId) }
}

/** The saved list, or the page's built-in sections in their original order. */
export function resolveSections(page: PageKey, layout?: readonly SectionRow[] | null): SectionRow[] {
  if (layout?.length) return [...layout]
  return (PAGE_SECTIONS[page] as BuiltInSection[]).map((s) => ({ blockType: builtInSlug(page, s.key) }))
}

export default function PageSections({
  page,
  layout,
  builtIns,
  accent,
  cms,
  data = {},
}: {
  page: PageKey
  layout?: readonly SectionRow[] | null
  /** Each built-in section, by key. A missing or empty one renders nothing. */
  builtIns: Record<string, ReactNode>
  accent: string
  cms: CmsTarget
  data?: BlocksData
}) {
  const sections = PAGE_SECTIONS[page] as BuiltInSection[]
  const info = (row: SectionRow) => {
    const key = builtInKey(page, row.blockType)
    return key ? sections.find((s) => s.key === key) : undefined
  }

  // Index = position in the saved list, which is also each row's
  // click-to-edit path ("layout.<index>"); pinned sections move to the top.
  const rows = resolveSections(page, layout).map((row, index) => ({ row, index }))
  const ordered = [...rows.filter(({ row }) => info(row)?.pinTop), ...rows.filter(({ row }) => !info(row)?.pinTop)]

  // A page usually opens with its own hero, which clears the fixed nav bar.
  // When an editor hides it or moves another section above it, that first
  // section gets the clearance instead of starting underneath the nav.
  const first = ordered.find(({ row }) => !row.hidden)
  const firstClearsNav = first ? (info(first.row)?.top ?? first.row.blockType === 'hero') : true

  return (
    <>
      {ordered.map(({ row, index }) => {
        const key = builtInKey(page, row.blockType)
        const body = key ? builtIns[key] : (
          <div {...cmsAttributes(cms)}>
            <RenderBlock
              block={row as ContentBlock}
              index={index}
              accent={accent}
              prefix="layout"
              data={data}
              isFirst={row === first?.row}
            />
          </div>
        )
        if (!body) return null
        return (
          <BlockShell key={row.id ?? `${row.blockType}-${index}`} block={row as ContentBlock}>
            {row === first?.row && !firstClearsNav ? <div className="pt-24 md:pt-28">{body}</div> : body}
          </BlockShell>
        )
      })}
    </>
  )
}
