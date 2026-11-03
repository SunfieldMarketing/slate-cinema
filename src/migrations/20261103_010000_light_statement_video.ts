import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Follow-up to the video re-encode (Oct 27 audit #1). The code now points at the
  lightweight "-web" files, but the Podcasts industry's "Statement video" is a stored
  value in the database -- the 20261001 migration seeded it with the original 32MB
  4K /videos/post-production.mp4 -- so the page kept serving the heavy file no matter
  what the code said.

  Rewrites any industry statement video (and its saved versions, so a restored
  version doesn't bring the heavy file back) that still names one of the four
  originals to the matching "-web" encode. Exact-match only: a value an editor chose
  on purpose (a different file or an uploaded one) is never touched. Idempotent --
  once rewritten there is nothing left to match. The originals stay in /public/videos,
  so `down` can point the values straight back at them.
*/

const RENAMES: Array<[string, string]> = [
  ['/videos/post-production.mp4', '/videos/post-production-web.mp4'],
  ['/videos/production.mp4', '/videos/production-web.mp4'],
  ['/videos/distribution.mp4', '/videos/distribution-web.mp4'],
  ['/videos/hero.mp4', '/videos/hero-web.mp4'],
]

const COLUMNS: Array<[string, string]> = [
  ['industries', 'statement_video'],
  ['_industries_v', 'version_statement_video'],
]

async function rewrite(db: MigrateUpArgs['db'], pairs: Array<[string, string]>) {
  for (const [table, column] of COLUMNS) {
    for (const [from, to] of pairs) {
      await db.run(
        sql`UPDATE ${sql.identifier(table)} SET ${sql.identifier(column)} = ${to} WHERE ${sql.identifier(column)} = ${from}`,
      )
    }
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await rewrite(db, RENAMES)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await rewrite(
    db,
    RENAMES.map(([original, web]) => [web, original]),
  )
}
