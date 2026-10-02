import { randomBytes } from 'node:crypto'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Sections lists for the original pages (2026-10-02, "the entire site and
  all its contents and pages and subpages fully editable").

  1. `layout` (+ `version_layout`) on the ten page globals and on
     industries: each page's "Sections" list (src/blocks/builtin.ts), stored
     as JSON like every blocks field since 20261002_000000_page_builder.
     Every existing page -- and every saved version of it -- is filled with
     its built-in sections in their current order, so the admin shows the
     real page structure from the start and nothing on the site moves.
  2. `ready_to_talk.intake_band_*` (+ versions): the copy of the "Already
     know exactly what you want?" band, typed into IntakeCTABand.tsx until
     now. The column defaults are its exact current wording, which SQLite
     applies to the existing rows.

  DDL is exactly what Payload's schema push generates for the new config
  (diffed against a freshly pushed database). Idempotent: duplicate columns
  are tolerated and only empty lists are filled.

  The default lists are a snapshot of src/lib/page-sections.ts as of this
  migration, so later edits to that file can't change what this one does.
*/

type MigrationDB = MigrateUpArgs['db']

function errorText(e: unknown): string {
  const err = e as { message?: unknown; cause?: { message?: unknown } } | null
  return [err, err?.message, err?.cause, err?.cause?.message].filter(Boolean).map(String).join(' | ')
}

async function addColumn(db: MigrationDB, table: string, definition: string) {
  try {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD ${definition};`))
  } catch (e) {
    if (!errorText(e).includes('duplicate column name')) throw e
  }
}

async function dropColumn(db: MigrationDB, table: string, column: string) {
  try {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`))
  } catch (e) {
    if (!errorText(e).includes('no such column')) throw e
  }
}

/** Global table -> its built-in sections in their current order. */
const GLOBAL_SECTIONS: Record<string, string[]> = {
  home_page: [
    'homeHero',
    'homeTrust',
    'homePipeline',
    'homeMediaVoid',
    'homeResults',
    'homeStandards',
    'homeReviews',
    'homeSelectedWork',
    'homeFinalCta',
  ],
  how_it_works_page: [
    'howItWorksHero',
    'howItWorksOverview',
    'howItWorksPipeline',
    'howItWorksBehindTheScenes',
    'howItWorksWalkthrough',
    'howItWorksStats',
    'howItWorksFinalCta',
  ],
  portfolio_index_page: ['portfolioHero', 'portfolioReel', 'portfolioIndustries', 'portfolioGallery', 'portfolioFinalCta'],
  contact_page: [
    'contactHero',
    'contactWhatHappensNext',
    'contactStageRouter',
    'contactLeadForm',
    'contactReadyToTalk',
    'contactIntakeBand',
    'contactContactMethods',
    'contactStudioLocation',
  ],
  schedule_a_call_page: ['scheduleCallHero', 'scheduleCallCallPrep', 'scheduleCallCalendar', 'scheduleCallIntakeBand'],
  social_media_management_page: ['socialMediaHero', 'socialMediaHowItWorks', 'socialMediaIncluded'],
  journal_page: ['journalHero', 'journalGrid'],
  privacy_policy_page: ['privacyDocument'],
  terms_of_service_page: ['termsDocument'],
  thank_you_page: ['thankYouHero', 'thankYouNextSteps'],
}

const INDUSTRY_SECTIONS = [
  'industryHero',
  'industryTrust',
  'industryClients',
  'industryServices',
  'industryStatement',
  'industryMidCta',
  'industryProcess',
  'industryGallery',
  'industryFinalCta',
]

const INTAKE_BAND_COLUMNS: [string, string][] = [
  ['eyebrow', '// Already Know?'],
  ['headline', 'Already know exactly what you want?'],
  ['body', "Skip the call — walk us through the project details directly and we'll follow up with a plan."],
  ['button_label', 'Start the Intake Form'],
  ['button_href', '/contact/project'],
]

/** A saved Sections list, shaped the way Payload stores one (24-hex row ids). */
function sectionsJson(blockTypes: string[]): string {
  return JSON.stringify(blockTypes.map((blockType) => ({ blockType, hidden: false, id: randomBytes(12).toString('hex') })))
}

const quote = (value: string) => `'${value.replace(/'/g, "''")}'`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Sections lists on the page globals: the published row and every
  //    saved version get the same list (same row ids), so restoring an old
  //    version keeps the page's structure.
  for (const [table, blockTypes] of Object.entries(GLOBAL_SECTIONS)) {
    await addColumn(db, table, '`layout` text')
    await addColumn(db, `_${table}_v`, '`version_layout` text')
    const json = sectionsJson(blockTypes)
    await db.run(sql`UPDATE ${sql.identifier(table)} SET layout = ${json} WHERE layout IS NULL`)
    await db.run(sql`UPDATE ${sql.identifier(`_${table}_v`)} SET version_layout = ${json} WHERE version_layout IS NULL`)
  }

  // ...and on every industry (one list per industry, shared with its versions).
  await addColumn(db, 'industries', '`layout` text')
  await addColumn(db, '_industries_v', '`version_layout` text')
  const industries = await db.all<{ id: number }>(sql`SELECT id FROM industries WHERE layout IS NULL`)
  for (const { id } of industries) {
    const json = sectionsJson(INDUSTRY_SECTIONS)
    await db.run(sql`UPDATE industries SET layout = ${json} WHERE id = ${id} AND layout IS NULL`)
    await db.run(sql`UPDATE _industries_v SET version_layout = ${json} WHERE parent_id = ${id} AND version_layout IS NULL`)
  }

  // 2. Intake band copy, defaulting to the wording that was hardcoded.
  for (const [column, value] of INTAKE_BAND_COLUMNS) {
    await addColumn(db, 'ready_to_talk', `\`intake_band_${column}\` text DEFAULT ${quote(value)}`)
    await addColumn(db, '_ready_to_talk_v', `\`version_intake_band_${column}\` text DEFAULT ${quote(value)}`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [column] of INTAKE_BAND_COLUMNS) {
    await dropColumn(db, 'ready_to_talk', `intake_band_${column}`)
    await dropColumn(db, '_ready_to_talk_v', `version_intake_band_${column}`)
  }
  for (const table of [...Object.keys(GLOBAL_SECTIONS), 'industries']) {
    await dropColumn(db, table, 'layout')
    await dropColumn(db, `_${table}_v`, 'version_layout')
  }
}
