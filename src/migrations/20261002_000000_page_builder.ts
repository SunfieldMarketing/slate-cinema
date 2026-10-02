import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Page builder (2026-10-02): "the entire site and all its contents and pages
  and subpages fully editable".

  1. `pages` + `_pages_v`: the Custom pages collection (src/collections/
     Pages.ts) -- new pages and subpages assembled from section blocks.
  2. `navigation_links_children` (+ version table): dropdown items under any
     menu link.
  3. `payload_locked_documents_rels.pages_id`: Payload joins one column per
     collection there; every admin edit view 500s without it.
  4. `forms.fields`: payload.config.ts turns on the SQLite adapter's
     `blocksAsJSON`, so blocks fields are stored as one JSON column instead
     of a table per block type. The form builder's `fields` was the only
     blocks field before this, so its rows are copied out of the old
     `forms_blocks_*` tables into the new column. The old tables are left
     in place, untouched, as a fallback -- nothing reads them any more.

  DDL is exactly what Payload's own schema push generates for the new
  config (diffed against a freshly pushed database). Idempotent: tables and
  indexes use IF NOT EXISTS, duplicate columns are tolerated, and the forms
  copy only fills rows whose `fields` is still empty.
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

const FORM_BLOCK_TYPES = ['text', 'textarea', 'select', 'email', 'state', 'country', 'checkbox', 'number', 'message']
const BOOLEAN_COLUMNS = new Set(['required'])
const camel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

/** Rebuilds each form's `fields` array (API shape) from the old block tables. */
async function copyFormFields(db: MigrationDB) {
  const existing = new Set(
    (await db.all<{ name: string }>(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'forms_blocks_%'`)).map(
      (t) => t.name,
    ),
  )
  const forms = await db.all<{ id: number }>(sql`SELECT id FROM forms WHERE fields IS NULL`)
  for (const form of forms) {
    const blocks: { order: number; block: Record<string, unknown> }[] = []
    for (const type of FORM_BLOCK_TYPES) {
      const table = `forms_blocks_${type}`
      if (!existing.has(table)) continue
      const rows = await db.all<Record<string, unknown>>(
        sql`SELECT * FROM ${sql.raw(`\`${table}\``)} WHERE _parent_id = ${form.id} AND _path = 'fields' ORDER BY _order`,
      )
      for (const row of rows) {
        const block: Record<string, unknown> = { id: row.id, blockType: type }
        for (const [column, value] of Object.entries(row)) {
          if (column.startsWith('_') || column === 'id') continue
          let v: unknown = value
          if (BOOLEAN_COLUMNS.has(column) || (type === 'checkbox' && column === 'default_value')) {
            v = value === null || value === undefined ? null : Boolean(Number(value))
          } else if (type === 'message' && column === 'message' && typeof value === 'string') {
            try {
              v = JSON.parse(value)
            } catch {
              v = value
            }
          }
          block[camel(column)] = v
        }
        if (type === 'select' && existing.has('forms_blocks_select_options')) {
          block.options = await db.all(
            sql`SELECT id, label, value FROM forms_blocks_select_options WHERE _parent_id = ${String(row.id)} ORDER BY _order`,
          )
        }
        blocks.push({ order: Number(row._order), block })
      }
    }
    if (!blocks.length) continue
    blocks.sort((a, b) => a.order - b.order)
    await db.run(
      sql`UPDATE forms SET fields = ${JSON.stringify(blocks.map((b) => b.block))} WHERE id = ${form.id} AND fields IS NULL`,
    )
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Custom pages
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`path\` text,
  	\`accent\` text DEFAULT '#00AEEF',
  	\`sticky_button\` integer DEFAULT false,
  	\`layout\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_path_idx\` ON \`pages\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_path\` text,
  	\`version_accent\` text DEFAULT '#00AEEF',
  	\`version_sticky_button\` integer DEFAULT false,
  	\`version_layout\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`version_no_index\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version_path_idx\` ON \`_pages_v\` (\`version_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)

  // 2. Menu dropdown items
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`navigation_links_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_links_children_order_idx\` ON \`navigation_links_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`navigation_links_children_parent_id_idx\` ON \`navigation_links_children\` (\`_parent_id\`);`)

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_navigation_v_version_links_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_links_children_order_idx\` ON \`_navigation_v_version_links_children\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`_navigation_v_version_links_children_parent_id_idx\` ON \`_navigation_v_version_links_children\` (\`_parent_id\`);`,
  )

  // 3. Document locking needs a column per collection.
  await addColumn(db, 'payload_locked_documents_rels', '`pages_id` integer REFERENCES pages(id) ON DELETE cascade')
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`,
  )

  // 4. Form builder fields -> JSON column
  await addColumn(db, 'forms', '`fields` text')
  await copyFormFields(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_pages_id_idx\`;`)
  for (const [table, column] of [
    ['payload_locked_documents_rels', 'pages_id'],
    ['forms', 'fields'],
  ]) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`))
    } catch (e) {
      if (!errorText(e).includes('no such column')) throw e
    }
  }
  for (const table of ['_navigation_v_version_links_children', 'navigation_links_children', '_pages_v', 'pages']) {
    await db.run(sql.raw(`DROP TABLE IF EXISTS \`${table}\`;`))
  }
}
