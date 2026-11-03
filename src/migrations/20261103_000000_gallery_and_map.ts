import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Two additions from the Oct 27 site audit (Slate-Fix-List-Kauan):

  1. Industry galleries (#6). Every industry page used to end with the same
     22-tile gallery of all work. Each industry now has "Project gallery >
     Projects shown" (a hasMany relationship to portfolio projects), stored
     in industries_rels / _industries_v_rels. Empty = show all work, so
     nothing changes until a page has picks.

     First-pass picks are seeded for the five industries where at least three
     real projects clearly belong, matched by the project's company name (ids
     differ between databases). It's a starting point for the team to adjust
     under each industry's Project gallery -- Athletics, Education, AI and
     Podcasts don't have enough matching projects yet and stay on "all work",
     and Healthcare redirects to Wavecare. The same picks are copied onto the
     industry's saved versions so a restored version keeps its gallery.

  2. Studio map coordinates (#15): Site Settings > Contact > Map latitude /
     longitude, defaulting to the studio's address. The Contact page map is an
     OpenStreetMap embed now (Google's keyless embed is blocked from being
     framed, so it was an empty box).

  DDL is exactly what Payload's schema push generates for the new config
  (diffed against a freshly pushed database). Idempotent: tables and indexes
  use IF NOT EXISTS, duplicate columns are tolerated, and picks are only
  seeded onto an industry (or version) that has none yet.
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

/** Industry slug -> the companies whose projects open its gallery, in order. */
const GALLERY_PICKS: Record<string, string[]> = {
  products: ['Optoma', 'Eyeleos', 'Miami Arak', 'Barista & The Baker', 'Neil Kerman'],
  corporate: ['Region Capital', 'Censible', 'ValuClean'],
  organizations: ['ARC Reef', 'Gateways', 'Chemed', 'HANC'],
  'real-estate': ['The Brownstone', 'DCON Renovations', 'Park Gardens', 'Star City Rehab'],
  travel: ['Sleepy Hollow Hotel', 'The Next Ride', 'Envision Festival'],
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 2. Map coordinates
  for (const [table, prefix] of [
    ['site_settings', ''],
    ['_site_settings_v', 'version_'],
  ]) {
    await addColumn(db, table, `\`${prefix}contact_map_latitude\` numeric DEFAULT 40.6568049`)
    await addColumn(db, table, `\`${prefix}contact_map_longitude\` numeric DEFAULT -74.0029213`)
  }

  // 1. Gallery relationship tables
  for (const [table, parent] of [
    ['industries_rels', 'industries'],
    ['_industries_v_rels', '_industries_v'],
  ]) {
    await db.run(
      sql.raw(`CREATE TABLE IF NOT EXISTS \`${table}\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`portfolio_projects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`${parent}\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`portfolio_projects_id\`) REFERENCES \`portfolio_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`),
    )
    for (const column of ['order', 'parent', 'path', 'portfolio_projects_id']) {
      const target = column === 'parent' ? 'parent_id' : column
      await db.run(sql.raw(`CREATE INDEX IF NOT EXISTS \`${table}_${column}_idx\` ON \`${table}\` (\`${target}\`);`))
    }
  }

  // First-pass picks (see the header comment).
  for (const [slug, companies] of Object.entries(GALLERY_PICKS)) {
    const industry = (await db.all<{ id: number }>(sql`SELECT id FROM industries WHERE slug = ${slug}`))[0]
    if (!industry) continue

    const ids: number[] = []
    for (const company of companies) {
      const rows = await db.all<{ id: number }>(
        sql`SELECT id FROM portfolio_projects WHERE company = ${company} ORDER BY "order", id`,
      )
      for (const row of rows) if (!ids.includes(row.id)) ids.push(row.id)
    }
    if (!ids.length) continue

    // Payload numbers a field's rows from 1, and stores a version's rows under "version.<field>"
    // (checked against a real save, not assumed).
    const seed = async (relsTable: string, parentId: number, path: string) => {
      const existing = await db.all<{ n: number }>(
        sql`SELECT count(*) AS n FROM ${sql.identifier(relsTable)} WHERE parent_id = ${parentId} AND path = ${path}`,
      )
      if (Number(existing[0]?.n) > 0) return
      for (const [index, projectId] of ids.entries()) {
        await db.run(
          sql`INSERT INTO ${sql.identifier(relsTable)} ("order", parent_id, path, portfolio_projects_id) VALUES (${index + 1}, ${parentId}, ${path}, ${projectId})`,
        )
      }
    }

    await seed('industries_rels', industry.id, 'galleryProjects')
    const versions = await db.all<{ id: number }>(sql`SELECT id FROM _industries_v WHERE parent_id = ${industry.id}`)
    for (const version of versions) await seed('_industries_v_rels', version.id, 'version.galleryProjects')
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql.raw('DROP TABLE IF EXISTS `_industries_v_rels`;'))
  await db.run(sql.raw('DROP TABLE IF EXISTS `industries_rels`;'))
  for (const [table, prefix] of [
    ['site_settings', ''],
    ['_site_settings_v', 'version_'],
  ]) {
    for (const column of ['contact_map_latitude', 'contact_map_longitude']) {
      try {
        await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${prefix}${column}\`;`))
      } catch (e) {
        if (!errorText(e).includes('no such column')) throw e
      }
    }
  }
}
