/*
  Live Preview click-to-edit field paths for sections that render on more
  than one kind of document. The industry template stores them as flat
  fields on the industry doc; the same components used as page-builder
  blocks (src/components/blocks) read from `layout.<n>.heading.*` and
  `layout.<n>.<items>` instead.
*/
export interface SectionCmsPaths {
  eyebrow: string
  headline: string
  accent: string
  intro?: string
  /** Path of the array the section's rows come from; row fields are appended. */
  items: string
}

export function blockSectionPaths(prefix: string, items: string): SectionCmsPaths {
  return {
    eyebrow: `${prefix}.heading.eyebrow`,
    headline: `${prefix}.heading.headline`,
    accent: `${prefix}.heading.headlineAccent`,
    intro: `${prefix}.heading.intro`,
    items: `${prefix}.${items}`,
  }
}
