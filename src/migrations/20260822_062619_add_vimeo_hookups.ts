import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Adds the videoVimeoUrl columns for four dormant Vimeo hookups the
  frontend has been carrying since 2026-08-19/20 but could never read --
  each one was reverted at the time because this session had no way to
  run a real migration against production (see the removed comments on
  IndustryData.heroVideoVimeoUrl, IndustryServiceCard.videoVimeoUrl,
  IndustryVideoTestimonial.videoVimeoUrl, Pipeline categories, HowItWorks
  processWalkthrough phases, and PortfolioIndexPage hero). SmartVideo /
  ScrollExpandMedia already know how to render these; they just never had
  a column to read from. Same try/catch-on-duplicate-column pattern as
  every other ADD COLUMN in this project -- safe to re-run.
*/

const ADDS: Array<{ table: string; column: string }> = [
  { table: 'industries_service_cards', column: 'video_vimeo_url' },
  { table: 'industries_video_testimonials', column: 'video_vimeo_url' },
  { table: 'industries', column: 'hero_video_vimeo_url' },
  { table: '_industries_v_version_service_cards', column: 'video_vimeo_url' },
  { table: '_industries_v_version_video_testimonials', column: 'video_vimeo_url' },
  { table: '_industries_v', column: 'version_hero_video_vimeo_url' },
  { table: 'pipeline_categories', column: 'video_vimeo_url' },
  { table: '_pipeline_v_version_categories', column: 'video_vimeo_url' },
  { table: 'how_it_works_page_process_walkthrough_phases', column: 'video_vimeo_url' },
  { table: '_how_it_works_page_v_version_process_walkthrough_phases', column: 'video_vimeo_url' },
  { table: 'portfolio_index_page', column: 'hero_video_vimeo_url' },
  { table: '_portfolio_index_page_v', column: 'version_hero_video_vimeo_url' },
]

function isDuplicateColumnError(e: unknown): boolean {
  const err = e as any
  const msg = [err, err && err.message, err && err.cause, err && err.cause && err.cause.message, err && err.cause && err.cause.cause, err && err.cause && err.cause.cause && err.cause.cause.message]
    .filter(Boolean)
    .map(String)
    .join(' | ')
  return msg.includes('duplicate column name')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const { table, column } of ADDS) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` text;`))
    } catch (e) {
      if (!isDuplicateColumnError(e)) throw e
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (const { table, column } of ADDS) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`))
    } catch (e) {
      // Column may already be gone -- fine on a rollback.
    }
  }
}
