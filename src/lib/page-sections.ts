/*
  The built-in sections of the site's original pages, in their default
  order (2026-10-02, "the entire site and all its contents and pages and
  subpages fully editable").

  Every original page (and every industry page) has a "Sections" list in
  /admin that starts out as exactly this list. Editors drag the built-in
  sections into a different order, hide them, and drop any section from
  the page-builder library (src/blocks) in between. The words and media of
  a built-in section stay where they always were -- the page's own fields,
  or a shared global -- the list only decides order and visibility.

  Shared by the Payload config (src/blocks/builtin.ts builds one block type
  per entry) and the page renderers (src/components/blocks/PageSections.tsx
  falls back to this order when a page has no list saved yet), so it holds
  plain data only.

  Keys are part of the stored block type ("home" + "hero" -> "homeHero"),
  so renaming one orphans that section on every saved page -- add new keys
  instead. The result must not equal a library block's slug (src/blocks):
  Payload rejects two blocks with one slug in the same list, which is why
  the journal's post grid is "journalGrid", not "journalPosts".
*/

export interface BuiltInSection {
  key: string
  /** Name shown on the section's row in /admin and in the "Add Section" picker. */
  label: string
  /** Where its content is edited, when that isn't the page's own fields. */
  editIn?: string
  /** Clears the fixed nav bar itself (a hero). Decides whether the page
      needs top padding when an editor moves something else to the top. */
  top?: boolean
  /** Always rendered first, wherever it sits in the list (the portfolio
      page's scroll-to-expand hero takes over scrolling until it opens, so
      it only works at the very top). */
  pinTop?: boolean
}

const PIPELINE = 'Shared Sections > Pipeline (the same on every page that shows it)'
const FINAL_CTA = 'Shared Sections > Final CTA (the same on every page that shows it)'
const READY_TO_TALK = 'Shared Sections > Ready To Talk (shared by Contact and Schedule a Call)'
const INTAKE_BAND = 'Shared Sections > Ready To Talk > "Intake form band" (shared by Contact and Schedule a Call)'

export const PAGE_SECTIONS = {
  home: [
    { key: 'hero', label: 'Hero (wordmark)', top: true },
    { key: 'trust', label: 'Client logos' },
    { key: 'pipeline', label: 'Production pipeline', editIn: PIPELINE },
    { key: 'mediaVoid', label: '3D text moment' },
    { key: 'results', label: 'Results (views counter)' },
    { key: 'standards', label: 'The Standard (3-step scroll)' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'selectedWork', label: 'Selected work carousel' },
    { key: 'finalCta', label: 'Closing call to action', editIn: FINAL_CTA },
  ],
  howItWorks: [
    { key: 'hero', label: 'Hero (storyboard)', top: true },
    { key: 'overview', label: 'Four phases at a glance' },
    { key: 'pipeline', label: 'Production pipeline', editIn: PIPELINE },
    { key: 'behindTheScenes', label: 'Behind the scenes' },
    { key: 'walkthrough', label: 'Phase-by-phase walkthrough' },
    { key: 'stats', label: 'Numbers & guarantees' },
    { key: 'finalCta', label: 'Closing call to action', editIn: FINAL_CTA },
  ],
  portfolio: [
    { key: 'hero', label: 'Hero (scroll-to-expand video)', top: true, pinTop: true },
    { key: 'reel', label: '3D project reel' },
    { key: 'industries', label: 'Industry wheel' },
    { key: 'gallery', label: 'Project gallery' },
    { key: 'finalCta', label: 'Closing call to action', editIn: FINAL_CTA },
  ],
  contact: [
    { key: 'hero', label: 'Hero', top: true },
    { key: 'whatHappensNext', label: 'What happens next' },
    { key: 'stageRouter', label: 'Ways to get started (3 options)' },
    { key: 'leadForm', label: 'Quick message form' },
    { key: 'readyToTalk', label: 'Book a call', editIn: READY_TO_TALK },
    { key: 'intakeBand', label: 'Intake form band', editIn: INTAKE_BAND },
    { key: 'contactMethods', label: 'Contact methods' },
    { key: 'studioLocation', label: 'Studio location' },
  ],
  scheduleCall: [
    { key: 'hero', label: 'Hero', top: true },
    { key: 'callPrep', label: 'What to have ready', editIn: READY_TO_TALK },
    { key: 'calendar', label: 'Booking calendar' },
    { key: 'intakeBand', label: 'Intake form band', editIn: INTAKE_BAND },
  ],
  socialMedia: [
    { key: 'hero', label: 'Hero', top: true },
    { key: 'howItWorks', label: 'How it works (steps)' },
    { key: 'included', label: "What's included + call to action" },
  ],
  journal: [
    { key: 'hero', label: 'Hero', top: true },
    { key: 'grid', label: 'Journal posts (with filters)' },
  ],
  privacy: [{ key: 'document', label: 'Policy text', top: true }],
  terms: [{ key: 'document', label: 'Terms text', top: true }],
  thankYou: [
    { key: 'hero', label: 'Hero', top: true },
    { key: 'nextSteps', label: 'Next steps + buttons' },
  ],
  industry: [
    { key: 'hero', label: 'Hero', top: true },
    { key: 'trust', label: 'Rating + logo strip', editIn: 'Site Settings > Trust banner (the same on every industry page)' },
    { key: 'clients', label: 'Client strip' },
    { key: 'services', label: 'Service cards' },
    { key: 'statement', label: 'Statement (full-width video)' },
    { key: 'midCta', label: 'Mid-page call to action' },
    { key: 'process', label: 'Timeline' },
    { key: 'gallery', label: 'Project gallery' },
    { key: 'finalCta', label: 'Closing call to action', editIn: FINAL_CTA },
  ],
} satisfies Record<string, BuiltInSection[]>

export type PageKey = keyof typeof PAGE_SECTIONS

/** Stored block type of a built-in section: "home" + "hero" -> "homeHero". */
export function builtInSlug(page: PageKey, key: string): string {
  return `${page}${key.charAt(0).toUpperCase()}${key.slice(1)}`
}

/** The section key a stored block type stands for on this page, or null for a library section. */
export function builtInKey(page: PageKey, blockType: string): string | null {
  const found = (PAGE_SECTIONS[page] as BuiltInSection[]).find((s) => builtInSlug(page, s.key) === blockType)
  return found ? found.key : null
}
