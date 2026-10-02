import type { Block, Field } from 'payload'
import { PAGE_SECTIONS, builtInSlug, type BuiltInSection, type PageKey } from '@/lib/page-sections'
import { contentBlocks } from './index'

/*
  The "Sections" list on each of the site's original pages (2026-10-02).
  One block type per built-in section (src/lib/page-sections.ts), listed
  after the section library in the "Add Section" picker under its own
  heading -- so a removed built-in section can always be added back.

  A built-in section has no content fields of its own: its words and media
  stay in the page's existing fields (or a shared global). Its row only
  carries the same visibility settings every library section has.
*/

const BUILT_IN_GROUP = "This page's built-in sections"

function builtInBlock(page: PageKey, section: BuiltInSection): Block {
  const where = section.editIn
    ? `Its words and media are edited in ${section.editIn}.`
    : 'Its words and media are edited in the fields further down this page.'
  const pinned = section.pinTop ? ' Always shown at the top of the page.' : ''
  return {
    slug: builtInSlug(page, section.key),
    labels: { singular: section.label, plural: section.label },
    // No "Untitled" name box on the row: the section's own name is the label.
    admin: { group: BUILT_IN_GROUP, disableBlockName: true },
    fields: [
      {
        name: 'hidden',
        label: 'Hide this section',
        type: 'checkbox',
        defaultValue: false,
        admin: { description: `Keeps the section in the list but stops it showing on the site. ${where}${pinned}` },
      },
      {
        name: 'hideOn',
        label: 'Hide on',
        type: 'select',
        options: [
          { label: 'Phones only', value: 'mobile' },
          { label: 'Computers only', value: 'desktop' },
        ],
      },
      {
        name: 'anchor',
        label: 'Anchor name',
        type: 'text',
        admin: { description: 'Lets a button jump straight here: "pricing" makes /this-page#pricing work. Letters, numbers and dashes.' },
      },
    ],
  }
}

/** The page's built-in sections in their original order, as a saved "Sections" list. */
export function defaultSections(page: PageKey) {
  return (PAGE_SECTIONS[page] as BuiltInSection[]).map((s) => ({ blockType: builtInSlug(page, s.key) }))
}

/**
 * The "Sections" field for one of the original pages: the page's built-in
 * sections (in their default order for a new document) plus the whole
 * section library.
 */
export function sectionsField(page: PageKey): Field {
  return {
    name: 'layout',
    label: 'Sections',
    labels: { singular: 'Section', plural: 'Sections' },
    type: 'blocks',
    blocks: [...contentBlocks, ...(PAGE_SECTIONS[page] as BuiltInSection[]).map((s) => builtInBlock(page, s))],
    defaultValue: () => defaultSections(page),
    admin: {
      description:
        "The order this page's sections appear in. Drag to reorder, open a section to hide it (on every device or just phones or computers), " +
        'or use "Add Section" to put any section from the library anywhere on the page. A removed built-in section can be added back from the ' +
        'same menu. The built-in sections keep their words and media in the fields below.',
      initCollapsed: true,
    },
  }
}
