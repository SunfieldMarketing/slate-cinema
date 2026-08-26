import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/*
  Fixes the previous migration (20260826_130000_add_privacy_terms_thankyou_smm_pages):
  its payload.updateGlobal() calls passed `draft: false`, which turns out
  to control whether a NEW version row gets created, not what `_status`
  the saved row actually gets -- `_status` is a real field with its own
  schema default (`text DEFAULT 'draft'`, see that migration's own table
  DDL) that only becomes 'published' when a caller explicitly includes
  `_status: 'published'` in the data itself, the way a real admin
  "Publish" click does. This project has hit this EXACT failure mode
  before (see 20260820_233310_add_drafts_versions_live_preview.ts's
  README "Bug 1" -- a version-column-add backfilling every existing row
  as a draft, silently emptying every public read) -- confirmed live
  after deploying: all 4 new globals' public API/page reads came back
  empty (privacy-policy's rendered page had a title but zero body text),
  since access control's published-only constraint for anonymous reads
  filters out anything that isn't `_status: 'published'`.

  No data was lost or is at risk here -- the actual field content these
  4 rows hold is correct (confirmed identical to what the previous
  migration wrote); only their `_status` needs flipping, on the live row
  and its matching latest version-table row (mirroring exactly how
  Payload's own publish operation updates both).
*/

const targets = [
  { table: 'privacy_policy_page', versionTable: '_privacy_policy_page_v' },
  { table: 'terms_of_service_page', versionTable: '_terms_of_service_page_v' },
  { table: 'thank_you_page', versionTable: '_thank_you_page_v' },
  { table: 'social_media_management_page', versionTable: '_social_media_management_page_v' },
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const { table, versionTable } of targets) {
    await db.run(sql.raw(`UPDATE \`${table}\` SET \`_status\` = 'published' WHERE \`_status\` IS NOT 'published';`))
    await db.run(
      sql.raw(
        `UPDATE \`${versionTable}\` SET \`version__status\` = 'published', \`latest\` = 1 WHERE \`version__status\` IS NOT 'published';`
      )
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const { table, versionTable } of targets) {
    await db.run(sql.raw(`UPDATE \`${table}\` SET \`_status\` = 'draft';`))
    await db.run(sql.raw(`UPDATE \`${versionTable}\` SET \`version__status\` = 'draft';`))
  }
}
