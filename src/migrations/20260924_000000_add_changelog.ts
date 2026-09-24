import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Adds the `changelog` collection (src/collections/Changelog.ts) -- the
  site-wide record of every CMS save, written by src/lib/changelog.ts.

  Hand-written rather than `migrate:create`-generated: the newest .json
  schema snapshot in this folder is 20260822's, and the three migrations
  after it were hand-written without snapshots, so a generated diff would
  re-emit their changes too. Column names/types, index names and FK
  behavior mirror what Payload's SQLite adapter generates for an
  equivalent collection (checked against the 20260822 snapshot's
  portfolio_projects and payload_locked_documents_rels definitions).

  Two pieces: the table itself, and a `changelog_id` column on
  payload_locked_documents_rels -- Payload joins one column per collection
  there, and every admin document view would 500 without it.
*/

function errorText(e: unknown): string {
  const err = e as { message?: unknown; cause?: { message?: unknown } } | null
  return [err, err?.message, err?.cause, err?.cause?.message].filter(Boolean).map(String).join(' | ')
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`changelog\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`summary\` text,
    \`action\` text,
    \`target_label\` text,
    \`target_type\` text,
    \`target_slug\` text,
    \`doc_id\` text,
    \`doc_title\` text,
    \`user_name\` text,
    \`user_id\` integer,
    \`changed_fields\` text,
    \`changes\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`changelog_user_idx\` ON \`changelog\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`changelog_updated_at_idx\` ON \`changelog\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`changelog_created_at_idx\` ON \`changelog\` (\`created_at\`);`)

  try {
    await db.run(
      sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`changelog_id\` integer REFERENCES changelog(id) ON DELETE cascade;`,
    )
  } catch (e) {
    if (!errorText(e).includes('duplicate column name')) throw e
  }
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_changelog_id_idx\` ON \`payload_locked_documents_rels\` (\`changelog_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_changelog_id_idx\`;`)
  try {
    await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` DROP COLUMN \`changelog_id\`;`)
  } catch (e) {
    if (!errorText(e).includes('no such column')) throw e
  }
  await db.run(sql`DROP TABLE IF EXISTS \`changelog\`;`)
}
