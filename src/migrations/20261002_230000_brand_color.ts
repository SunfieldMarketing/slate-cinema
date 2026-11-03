import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Site Settings > Brand color (2026-10-02, src/lib/brand.ts): the site-wide
  highlight color, set as --color-brand-blue on every page. Defaults to the
  blue the site has always used (#00AEEF), which SQLite applies to the
  existing row and versions -- nothing visible changes until an editor
  picks a new color. DDL is exactly what Payload's schema push generates.
  Idempotent: a duplicate column is tolerated.
*/

function errorText(e: unknown): string {
  const err = e as { message?: unknown; cause?: { message?: unknown } } | null
  return [err, err?.message, err?.cause, err?.cause?.message].filter(Boolean).map(String).join(' | ')
}

const COLUMNS: [string, string][] = [
  ['site_settings', 'theme_brand_color'],
  ['_site_settings_v', 'version_theme_brand_color'],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, column] of COLUMNS) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` text DEFAULT '#00AEEF';`))
    } catch (e) {
      if (!errorText(e).includes('duplicate column name')) throw e
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [table, column] of COLUMNS) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`))
    } catch (e) {
      if (!errorText(e).includes('no such column')) throw e
    }
  }
}
