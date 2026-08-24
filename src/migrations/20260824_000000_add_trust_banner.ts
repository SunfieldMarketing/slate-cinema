import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Adds SiteSettings.trustBanner (see src/globals/SiteSettings.ts) --
  the previously-fully-hardcoded credibility strip on every industry
  page (src/components/TrustBanner.tsx), found during a "make
  everything CMS-editable" audit. Mirrors HomePage.trustSection's
  marqueeClients shape (name + logo upload) exactly, table structure
  copied from that field's own migration
  (20260820_233310_add_drafts_versions_live_preview.ts's
  home_page_trust_section_marquee_clients /
  _home_page_v_version_trust_section_marquee_clients pair) since
  site_settings has the same drafts/versions setup.

  Simple ADD COLUMN pattern for the two text fields; the array field
  (clients) needs its own child table on both the live `site_settings`
  table and the `_site_settings_v` version-history table, same as any
  other array field under Payload's SQLite adapter.
*/

function isDuplicateColumnError(e: unknown): boolean {
  const err = e as any
  const msg = [err, err && err.message, err && err.cause, err && err.cause && err.cause.message]
    .filter(Boolean)
    .map(String)
    .join(' | ')
  return msg.includes('duplicate column name')
}

function isTableExistsError(e: unknown): boolean {
  const err = e as any
  const msg = [err, err && err.message, err && err.cause, err && err.cause && err.cause.message]
    .filter(Boolean)
    .map(String)
    .join(' | ')
  return msg.includes('already exists')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const { table, column } of [
    { table: 'site_settings', column: 'trust_banner_rating_text' },
    { table: 'site_settings', column: 'trust_banner_marquee_label' },
    { table: '_site_settings_v', column: 'version_trust_banner_rating_text' },
    { table: '_site_settings_v', column: 'version_trust_banner_marquee_label' },
  ]) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` text;`))
    } catch (e) {
      if (!isDuplicateColumnError(e)) throw e
    }
  }

  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS \`site_settings_trust_banner_clients\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`name\` text,
      \`logo_id\` integer,
      FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
    `)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`site_settings_trust_banner_clients_order_idx\` ON \`site_settings_trust_banner_clients\` (\`_order\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`site_settings_trust_banner_clients_parent_id_idx\` ON \`site_settings_trust_banner_clients\` (\`_parent_id\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`site_settings_trust_banner_clients_logo_idx\` ON \`site_settings_trust_banner_clients\` (\`logo_id\`);`)
  } catch (e) {
    if (!isTableExistsError(e)) throw e
  }

  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS \`_site_settings_v_version_trust_banner_clients\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` integer PRIMARY KEY NOT NULL,
      \`name\` text,
      \`logo_id\` integer,
      \`_uuid\` text,
      FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
    `)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`_site_settings_v_version_trust_banner_clients_order_idx\` ON \`_site_settings_v_version_trust_banner_clients\` (\`_order\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`_site_settings_v_version_trust_banner_clients_parent_id_idx\` ON \`_site_settings_v_version_trust_banner_clients\` (\`_parent_id\`);`)
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`_site_settings_v_version_trust_banner_clients_logo_idx\` ON \`_site_settings_v_version_trust_banner_clients\` (\`logo_id\`);`)
  } catch (e) {
    if (!isTableExistsError(e)) throw e
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw('DROP TABLE IF EXISTS `site_settings_trust_banner_clients`;'))
  await db.run(sql.raw('DROP TABLE IF EXISTS `_site_settings_v_version_trust_banner_clients`;'))
  for (const { table, column } of [
    { table: 'site_settings', column: 'trust_banner_rating_text' },
    { table: 'site_settings', column: 'trust_banner_marquee_label' },
    { table: '_site_settings_v', column: 'version_trust_banner_rating_text' },
    { table: '_site_settings_v', column: 'version_trust_banner_marquee_label' },
  ]) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`))
    } catch (e) {
      // Column may already be gone -- fine on a rollback.
    }
  }
}
