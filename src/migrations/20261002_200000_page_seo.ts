import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  "Search engines & sharing" on every page (2026-10-02): search title,
  search description, share image and "hide from search engines"
  (src/fields/seo.ts) on the ten page globals, industries and journal
  posts, plus their version tables. Custom pages had these fields from the
  start (20261002_000000_page_builder).

  All columns start empty, which means "use the page's default" -- nothing
  on the live site changes until an editor fills one in.

  DDL is exactly what Payload's schema push generates for the new config
  (diffed against a freshly pushed database), including its index names
  (one is shortened by Payload's identifier limit). Idempotent: duplicate
  columns are tolerated and indexes use IF NOT EXISTS.
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

/** Document table -> name of the share-image index on its version table. */
const TABLES: Record<string, string> = {
  home_page: '_home_page_v_version_version_meta_image_idx',
  how_it_works_page: '_how_it_works_page_v_version_version_meta_image_idx',
  portfolio_index_page: '_portfolio_index_page_v_version_version_meta_image_idx',
  contact_page: '_contact_page_v_version_version_meta_image_idx',
  schedule_a_call_page: '_schedule_a_call_page_v_version_version_meta_image_idx',
  social_media_management_page: '_social_media_management_page_v_version_version_meta_ima_idx',
  journal_page: '_journal_page_v_version_version_meta_image_idx',
  privacy_policy_page: '_privacy_policy_page_v_version_version_meta_image_idx',
  terms_of_service_page: '_terms_of_service_page_v_version_version_meta_image_idx',
  thank_you_page: '_thank_you_page_v_version_version_meta_image_idx',
  industries: '_industries_v_version_version_meta_image_idx',
  journal_posts: '_journal_posts_v_version_version_meta_image_idx',
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, versionIndex] of Object.entries(TABLES)) {
    for (const [prefix, target] of [
      ['', table],
      ['version_', `_${table}_v`],
    ]) {
      await addColumn(db, target, `\`${prefix}meta_title\` text`)
      await addColumn(db, target, `\`${prefix}meta_description\` text`)
      await addColumn(db, target, `\`${prefix}meta_image_id\` integer REFERENCES media(id) ON DELETE set null`)
      await addColumn(db, target, `\`${prefix}no_index\` integer DEFAULT false`)
    }
    await db.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`${table}_meta_image_idx\` ON \`${table}\` (\`meta_image_id\`);`))
    await db.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`${versionIndex}\` ON \`_${table}_v\` (\`version_meta_image_id\`);`))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [table, versionIndex] of Object.entries(TABLES)) {
    await db.run(sql.raw(`DROP INDEX IF EXISTS \`${table}_meta_image_idx\`;`))
    await db.run(sql.raw(`DROP INDEX IF EXISTS \`${versionIndex}\`;`))
    // SQLite can't drop a foreign-key column without rebuilding the table,
    // so meta_image_id stays behind (unused) after a rollback.
    for (const [prefix, target] of [
      ['', table],
      ['version_', `_${table}_v`],
    ]) {
      for (const column of ['meta_title', 'meta_description', 'no_index']) {
        try {
          await db.run(sql.raw(`ALTER TABLE \`${target}\` DROP COLUMN \`${prefix}${column}\`;`))
        } catch (e) {
          if (!errorText(e).includes('no such column')) throw e
        }
      }
    }
  }
}
